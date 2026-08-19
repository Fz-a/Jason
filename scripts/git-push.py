#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
可靠推送到 GitHub，并核对远程是否真的更新。

失败原因（本机实测）：
  git 默认 HTTPS 常走 HTTP/2，访问 github.com:443 时会出现
  Recv failure / Connection was reset。改用 HTTP/1.1 + 加大
  postBuffer + 重试，可稳定推送。fetch 同样需要这些参数。

用法：
  双击  推送.bat
  或：  py -3 scripts/git-push.py
  或：  py -3 scripts/git-push.py --branch master
"""

from __future__ import annotations

import argparse
import io
import json
import re
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path


def _fix_stdio() -> None:
	for stream in (sys.stdout, sys.stderr):
		if hasattr(stream, "reconfigure"):
			try:
				stream.reconfigure(encoding="utf-8", errors="replace")
			except Exception:
				pass
		elif hasattr(stream, "buffer"):
			try:
				wrapped = io.TextIOWrapper(stream.buffer, encoding="utf-8", errors="replace")
				if stream is sys.stdout:
					sys.stdout = wrapped
				else:
					sys.stderr = wrapped
			except Exception:
				pass


_fix_stdio()

# 无缓冲，bat 双击时也能实时看到进度
try:
	sys.stdout.reconfigure(line_buffering=True)  # type: ignore[attr-defined]
	sys.stderr.reconfigure(line_buffering=True)  # type: ignore[attr-defined]
except Exception:
	pass

ROOT = Path(__file__).resolve().parents[1]
MAX_RETRIES = 6
RETRY_SLEEP = 2.5

GIT_HTTP_FLAGS = [
	"-c",
	"http.version=HTTP/1.1",
	"-c",
	"http.postBuffer=524288000",
	"-c",
	"http.lowSpeedLimit=0",
	"-c",
	"http.lowSpeedTime=999",
]

LOCAL_CONFIG = {
	"http.version": "HTTP/1.1",
	"http.postBuffer": "524288000",
}


def run(cmd: list[str], *, timeout: int | None = 120) -> subprocess.CompletedProcess[str]:
	return subprocess.run(
		cmd,
		cwd=ROOT,
		text=True,
		encoding="utf-8",
		errors="replace",
		capture_output=True,
		timeout=timeout,
	)


def git(*args: str, http: bool = False, timeout: int | None = 120) -> subprocess.CompletedProcess[str]:
	cmd = ["git"]
	if http:
		cmd.extend(GIT_HTTP_FLAGS)
	cmd.extend(args)
	return run(cmd, timeout=timeout)


def die(msg: str, code: int = 1) -> None:
	print(f"[错误] {msg}", file=sys.stderr)
	sys.exit(code)


def ensure_git() -> None:
	if not shutil.which("git"):
		die("未找到 git，请先安装 Git for Windows 并加入 PATH。")
	if not (ROOT / ".git").exists():
		die(f"目录不是 git 仓库：{ROOT}")


def setup_local_config() -> None:
	print("[1/5] 写入本仓库本地 git 配置（不影响全局）…")
	for key, value in LOCAL_CONFIG.items():
		r = git("config", "--local", key, value)
		if r.returncode != 0:
			die(f"写入配置失败 {key}: {(r.stderr or '').strip()}")
		print(f"      {key} = {value}")


def out_text(r: subprocess.CompletedProcess[str]) -> str:
	return ((r.stdout or "") + (r.stderr or "")).strip()


def local_head() -> str:
	r = git("rev-parse", "HEAD")
	if r.returncode != 0:
		die(f"无法读取本地 HEAD：{out_text(r)}")
	return (r.stdout or "").strip()


def current_branch() -> str:
	r = git("rev-parse", "--abbrev-ref", "HEAD")
	name = (r.stdout or "").strip()
	return name if name and name != "HEAD" else "master"


def remote_url(remote: str = "origin") -> str:
	r = git("remote", "get-url", remote)
	if r.returncode != 0:
		die(f"无法读取远程 {remote}：{out_text(r)}")
	return (r.stdout or "").strip()


def parse_github_repo(url: str) -> tuple[str, str] | None:
	# https://github.com/Fz-a/Jason.git  or  git@github.com:Fz-a/Jason.git
	m = re.search(r"github\.com[:/](?P<owner>[^/]+)/(?P<repo>[^/.]+)", url)
	if not m:
		return None
	return m.group("owner"), m.group("repo")


def github_api_sha(owner: str, repo: str, branch: str) -> str | None:
	api = f"https://api.github.com/repos/{owner}/{repo}/commits/{branch}"
	print(f"      GET {api}", flush=True)
	req = urllib.request.Request(
		api,
		headers={
			"Accept": "application/vnd.github+json",
			"User-Agent": "jason-git-push-script",
		},
	)
	try:
		with urllib.request.urlopen(req, timeout=25) as resp:
			data = json.loads(resp.read().decode("utf-8", errors="replace"))
		sha = data.get("sha")
		return sha if isinstance(sha, str) and len(sha) >= 7 else None
	except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, ValueError) as e:
		print(f"      [警告] GitHub API 查询失败：{e}", flush=True)
		return None


def fetch_remote(remote: str, retries: int) -> bool:
	"""fetch 在坏网络上很慢，少重试、短超时，失败马上走 API。"""
	n = max(1, min(retries, 2))
	print(f"[2/5] fetch {remote}（最多 {n} 次，超时 25s）…", flush=True)
	for i in range(1, n + 1):
		print(f"      fetch 尝试 {i}/{n} …", flush=True)
		try:
			r = git("fetch", remote, "--prune", http=True, timeout=25)
		except subprocess.TimeoutExpired:
			print("      fetch 超时", flush=True)
			continue
		if r.returncode == 0:
			print("      fetch 成功", flush=True)
			return True
		print(f"      fetch 失败：{out_text(r) or r.returncode}", flush=True)
		if i < n:
			time.sleep(1.5)
	print("      改用 GitHub API 核对（不依赖 git fetch）", flush=True)
	return False


def remote_tip_via_git(remote: str, branch: str) -> str | None:
	for ref in (f"{remote}/{branch}", f"{remote}/HEAD"):
		r = git("rev-parse", ref)
		if r.returncode == 0:
			sha = (r.stdout or "").strip()
			if sha:
				return sha
	return None


def push_once(remote: str, branch: str) -> subprocess.CompletedProcess[str]:
	# 明确推当前分支到同名远程分支，避免 HEAD 歧义
	cmd = ["git", *GIT_HTTP_FLAGS, "push", "-u", remote, f"HEAD:refs/heads/{branch}"]
	print(f"      命令: git … push -u {remote} HEAD:refs/heads/{branch}")
	return run(cmd, timeout=180)


def verify_match(local: str, remote_sha: str | None, label: str) -> bool:
	if not remote_sha:
		print(f"      [警告] 无法核对 {label}")
		return False
	ok = remote_sha.startswith(local[:7]) or local.startswith(remote_sha[:7]) or remote_sha == local
	print(f"      本地  {local[:12]}…")
	print(f"      {label} {remote_sha[:12]}…  {'✓ 一致' if ok else '✗ 不一致'}")
	return ok


def main() -> int:
	parser = argparse.ArgumentParser(description="可靠推送到 GitHub 并核对")
	parser.add_argument("--remote", default="origin")
	parser.add_argument("--branch", default=None, help="默认当前分支")
	parser.add_argument("--retries", type=int, default=MAX_RETRIES)
	parser.add_argument("--setup-only", action="store_true")
	args = parser.parse_args()

	ensure_git()
	setup_local_config()
	if args.setup_only:
		print("[完成] 仅配置，未推送。")
		return 0

	branch = args.branch or current_branch()
	remote = args.remote
	head = local_head()
	url = remote_url(remote)
	repo = parse_github_repo(url)

	print(f"[信息] 仓库目录: {ROOT}", flush=True)
	print(f"[信息] 远程: {remote} → {url}", flush=True)
	print(f"[信息] 分支: {branch}", flush=True)
	print(f"[信息] 本地 HEAD: {head[:12]}…", flush=True)
	print(f"[状态] {(git('status', '-sb').stdout or '').strip()}", flush=True)

	# 优先 API（本机 git fetch/HTTPS 经常卡住或被重置）
	print("[2/5] 查询远程 tip…", flush=True)
	remote_sha = github_api_sha(repo[0], repo[1], branch) if repo else None
	if not remote_sha:
		fetched = fetch_remote(remote, 1)
		remote_sha = remote_tip_via_git(remote, branch) if fetched else None
	print("[3/5] 对比本地 / 远程…", flush=True)
	if remote_sha:
		print(f"      远程 tip = {remote_sha[:12]}…", flush=True)

	need_push = True
	if remote_sha and (remote_sha == head or remote_sha.startswith(head[:12]) or head.startswith(remote_sha[:12])):
		need_push = False
		print("[结果] 本地已与远程一致，无需再推代码。", flush=True)
	elif remote_sha:
		print("[结果] 本地与远程不一致，需要推送。", flush=True)
	else:
		print("[结果] 无法确认远程 tip，仍尝试推送。", flush=True)

	pushed = False
	if need_push:
		print(f"[4/5] push → {remote}/{branch} …", flush=True)
		last_err = ""
		for i in range(1, args.retries + 1):
			print(f"\n—— 第 {i}/{args.retries} 次 ——", flush=True)
			result = push_once(remote, branch)
			text = out_text(result)
			if text:
				print(text, flush=True)
			if result.returncode == 0:
				pushed = True
				print("[成功] git push 返回成功", flush=True)
				break
			last_err = text or f"exit={result.returncode}"
			print(f"[失败] {last_err}", flush=True)
			if i < args.retries:
				print(f"[重试] {RETRY_SLEEP}s 后重试…", flush=True)
				time.sleep(RETRY_SLEEP)
		if not pushed:
			die(
				"多次推送仍失败。请检查：\n"
				"  1) 网络 / 代理是否可用\n"
				"  2) Windows「凭据管理器」里 GitHub 登录是否有效\n"
				"  3) 或改 SSH：git remote set-url origin git@github.com:OWNER/REPO.git"
			)
	else:
		print("[4/5] 跳过 push", flush=True)

	print("[5/5] 最终核对远程…", flush=True)
	time.sleep(0.8)
	# 优先 API（本机 git fetch 经常挂），再尝试一次短 fetch
	final_api = github_api_sha(repo[0], repo[1], branch) if repo else None
	final_git = None
	if not final_api:
		fetch_remote(remote, 1)
		final_git = remote_tip_via_git(remote, branch)
	else:
		final_git = remote_tip_via_git(remote, branch)
	ok_api = verify_match(head, final_api, "GitHub API") if repo else False
	ok_git = verify_match(head, final_git, "git 远程") if final_git else False

	if not (ok_git or ok_api):
		die("推送后核对失败：远程 tip 与本地 HEAD 不一致。请把上面日志发我。")

	print("\n========== 完成 ==========", flush=True)
	print("GitHub 已是最新提交。", flush=True)
	print("若 https://cjyfz.dpdns.org 看起来还是旧版：", flush=True)
	print("  1) 等 Cloudflare Pages 构建 1～3 分钟", flush=True)
	print("  2) 浏览器硬刷新：Ctrl+F5（或清缓存）", flush=True)
	print("  3) 右键查看源代码，确认含 folio-buddy/boot.js?v=46", flush=True)
	print(f"提交: {head}", flush=True)
	if repo:
		print(f"GitHub: https://github.com/{repo[0]}/{repo[1]}/commit/{head}", flush=True)
	return 0


if __name__ == "__main__":
	try:
		sys.exit(main())
	except subprocess.TimeoutExpired:
		die("git 命令超时，请检查网络后重试。")
	except KeyboardInterrupt:
		die("已取消。", 130)
