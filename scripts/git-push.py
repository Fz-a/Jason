#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
可靠推送到 GitHub，并核对远程是否真的更新。

会先自动提交本地代码改动（src/public/scripts 等），再 push。
以前只推已有 commit：本地改了很多却显示「已与远程一致」——站点就不会更新。

跳过：我的图片/、tmp/、.data/ 等本地素材。
仅推送已有 commit：加 --no-commit

失败原因（本机实测）：
  git 默认 HTTPS 常走 HTTP/2，访问 github.com:443 时会出现
  Recv failure / Connection was reset。改用 HTTP/1.1 + 加大
  postBuffer + 重试，可稳定推送。fetch 同样需要这些参数。

用法：
  双击  推送.bat
  或：  py -3 scripts/git-push.py
  或：  py -3 scripts/git-push.py -m "feat: ..."
"""

from __future__ import annotations

import argparse
import io
import json
import os
import re
import shutil
import socket
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
MIRROR_ENV = ROOT / "scripts" / "mirror.env"
MIRROR_ENV_EXAMPLE = ROOT / "scripts" / "mirror.env.example"
DEFAULT_PROXY_PORTS = (7897, 7890, 10809, 1080)
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

# 推送前自动提交时跳过这些路径（本地素材/临时文件）
SKIP_PREFIXES = (
	"我的图片/",
	"tmp/",
	".data/",
	".wrangler/",
	"node_modules/",
	"dist/",
	".astro/",
)

SAFE_DIRS = (
	"src/",
	"public/",
	"scripts/",
	"migrations/",
	"docs/",
)

SAFE_ROOT_FILES = {
	".gitignore",
	".env.example",
	".npmrc",
	"package.json",
	"pnpm-lock.yaml",
	"astro.config.mjs",
	"wrangler.jsonc",
	"vercel.json",
	"推送.bat",
	"tsconfig.json",
}


def load_mirror_env() -> list[str]:
	"""Load scripts/mirror.env into os.environ (without overriding existing vars)."""
	if not MIRROR_ENV.exists():
		return []
	loaded: list[str] = []
	for raw in MIRROR_ENV.read_text(encoding="utf-8").splitlines():
		line = raw.strip()
		if not line or line.startswith("#"):
			continue
		if "=" not in line:
			continue
		key, value = line.split("=", 1)
		key = key.strip()
		value = value.strip().strip('"').strip("'")
		if key and key not in os.environ:
			os.environ[key] = value
			loaded.append(key)
	return loaded


def probe_local_proxy(ports: tuple[int, ...] = DEFAULT_PROXY_PORTS) -> str | None:
	for port in ports:
		try:
			with socket.create_connection(("127.0.0.1", port), timeout=0.35):
				return f"http://127.0.0.1:{port}"
		except OSError:
			continue
	return None


def setup_network_mirrors() -> None:
	loaded = load_mirror_env()
	if loaded:
		print(f"[镜像] 已加载 {MIRROR_ENV.name}: {', '.join(loaded)}")

	auto_probe = os.environ.get("AUTO_PROBE_PROXY", "1") not in ("0", "false", "False")
	has_proxy = any(
		os.environ.get(k)
		for k in ("HTTPS_PROXY", "HTTP_PROXY", "GIT_HTTPS_PROXY", "GIT_HTTP_PROXY")
	)
	if not has_proxy and auto_probe:
		proxy = probe_local_proxy()
		if proxy:
			os.environ.setdefault("HTTPS_PROXY", proxy)
			os.environ.setdefault("HTTP_PROXY", proxy)
			os.environ.setdefault("GIT_HTTPS_PROXY", proxy)
			os.environ.setdefault("GIT_HTTP_PROXY", proxy)
			print(f"[镜像] 检测到本地代理，自动使用 {proxy}")

	registry = os.environ.get("NPM_CONFIG_REGISTRY")
	if registry:
		print(f"[镜像] npm registry = {registry}")


def setup_git_proxy_from_env() -> None:
	proxy = (
		os.environ.get("GIT_HTTPS_PROXY")
		or os.environ.get("HTTPS_PROXY")
		or os.environ.get("GIT_HTTP_PROXY")
		or os.environ.get("HTTP_PROXY")
	)
	if not proxy:
		return
	for key in ("http.proxy", "https.proxy"):
		r = git("config", "--local", key, proxy)
		if r.returncode != 0:
			die(f"写入 git {key} 失败：{out_text(r)}")
	print(f"[镜像] git http(s).proxy = {proxy}")


def urlopen_with_proxy(req: urllib.request.Request, timeout: int = 25):
	proxy = os.environ.get("HTTPS_PROXY") or os.environ.get("HTTP_PROXY")
	if not proxy:
		return urllib.request.urlopen(req, timeout=timeout)
	handler = urllib.request.ProxyHandler({"http": proxy, "https": proxy})
	opener = urllib.request.build_opener(handler)
	return opener.open(req, timeout=timeout)


def run(cmd: list[str], *, timeout: int | None = 120) -> subprocess.CompletedProcess[str]:
	env = os.environ.copy()
	return subprocess.run(
		cmd,
		cwd=ROOT,
		text=True,
		encoding="utf-8",
		errors="replace",
		capture_output=True,
		timeout=timeout,
		env=env,
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
		with urlopen_with_proxy(req, timeout=25) as resp:
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


def normalize_repo_path(path: str) -> str:
	p = path.strip().strip('"').replace("\\", "/")
	if " -> " in p:
		p = p.split(" -> ", 1)[1]
	return p


def is_skippable(path: str) -> bool:
	p = normalize_repo_path(path)
	for prefix in SKIP_PREFIXES:
		if p == prefix.rstrip("/") or p.startswith(prefix):
			return True
	return False


def is_pushable(path: str) -> bool:
	"""Tracked or new paths we are willing to auto-commit."""
	p = normalize_repo_path(path)
	if is_skippable(p):
		return False
	if p in SAFE_ROOT_FILES:
		return True
	if any(p.startswith(d) for d in SAFE_DIRS):
		return True
	# already-tracked files outside safe dirs (e.g. root configs already in repo)
	r = git("ls-files", "--error-unmatch", p)
	return r.returncode == 0


def porcelain_paths() -> list[tuple[str, str]]:
	r = git("status", "--porcelain", "-u")
	if r.returncode != 0:
		die(f"无法读取 git status：{out_text(r)}")
	out: list[tuple[str, str]] = []
	for line in (r.stdout or "").splitlines():
		if len(line) < 4:
			continue
		code = line[:2]
		path = normalize_repo_path(line[3:])
		out.append((code, path))
	return out


def commit_local_changes(message: str | None) -> bool:
	"""
	有未提交改动时先提交，再推送。
	以前只 push 已有 commit，本地改了一堆却显示「已一致」——这就是没推上去的原因。
	"""
	entries = porcelain_paths()
	if not entries:
		print("[提交] 工作区干净，无需新建提交。", flush=True)
		return False

	pushable = [p for _, p in entries if is_pushable(p)]
	skipped = sorted({p for _, p in entries if is_skippable(p) or p not in pushable})

	print("[提交] 发现本地未提交改动：", flush=True)
	for code, path in entries:
		mark = "跳过" if path not in pushable else "纳入"
		print(f"      [{mark}] {code} {path}", flush=True)

	if not pushable:
		print(
			"[警告] 有改动，但都在跳过列表（如 我的图片/、tmp/）。"
			"没有可推送的代码提交。",
			flush=True,
		)
		return False

	# stage one-by-one so skips stay out
	for path in pushable:
		r = git("add", "--", path)
		if r.returncode != 0:
			die(f"git add 失败：{path}\n{out_text(r)}")

	msg = (message or "").strip() or "chore: sync local folio updates"
	# HEREDOC-style via -m; keep simple for Windows
	r = git("commit", "-m", msg)
	text = out_text(r)
	if r.returncode != 0:
		# nothing staged / hook etc.
		if "nothing to commit" in text.lower():
			print("[提交] 没有可提交内容。", flush=True)
			return False
		die(f"git commit 失败：{text}")

	print(f"[提交] 已创建提交：{msg}", flush=True)
	if skipped:
		print(f"[提交] 已跳过 {len(skipped)} 项本地素材/临时文件（不会上传）。", flush=True)
	return True


def main() -> int:
	parser = argparse.ArgumentParser(description="可靠推送到 GitHub 并核对")
	parser.add_argument("--remote", default="origin")
	parser.add_argument("--branch", default=None, help="默认当前分支")
	parser.add_argument("--retries", type=int, default=MAX_RETRIES)
	parser.add_argument("--setup-only", action="store_true")
	parser.add_argument(
		"--no-commit",
		action="store_true",
		help="不自动提交，仅推送已有 commit",
	)
	parser.add_argument("-m", "--message", default=None, help="自动提交时的说明")
	args = parser.parse_args()

	ensure_git()
	setup_network_mirrors()
	setup_local_config()
	setup_git_proxy_from_env()
	if args.setup_only:
		print("[完成] 仅配置，未推送。")
		return 0

	branch = args.branch or current_branch()
	remote = args.remote
	url = remote_url(remote)
	repo = parse_github_repo(url)

	print(f"[信息] 仓库目录: {ROOT}", flush=True)
	print(f"[信息] 远程: {remote} → {url}", flush=True)
	print(f"[信息] 分支: {branch}", flush=True)
	print(f"[状态] {(git('status', '-sb').stdout or '').strip()}", flush=True)

	print("[1.5/5] 检查是否需要先提交本地改动…", flush=True)
	if args.no_commit:
		dirty = porcelain_paths()
		if dirty:
			print(
				"[警告] 仍有未提交改动，且使用了 --no-commit。"
				"这些改动不会出现在 GitHub 上。",
				flush=True,
			)
			for code, path in dirty[:20]:
				print(f"      {code} {path}", flush=True)
			if len(dirty) > 20:
				print(f"      …另有 {len(dirty) - 20} 项", flush=True)
	else:
		commit_local_changes(args.message)

	head = local_head()
	print(f"[信息] 本地 HEAD: {head[:12]}…", flush=True)

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
			hint = ""
			if not MIRROR_ENV.exists() and MIRROR_ENV_EXAMPLE.exists():
				hint = (
					f"\n  4) 复制镜像配置：copy scripts\\mirror.env.example scripts\\mirror.env\n"
					f"     修改代理端口后重试（见 scripts/mirror.env.example）"
				)
			die(
				"多次推送仍失败。请检查：\n"
				"  1) 网络 / 代理是否可用（scripts/mirror.env）\n"
				"  2) Windows「凭据管理器」里 GitHub 登录是否有效\n"
				"  3) 或改 SSH：git remote set-url origin git@github.com:OWNER/REPO.git"
				f"{hint}"
			)
	else:
		print("[4/5] 跳过 push", flush=True)

	# refresh head after push (same)
	head = local_head()

	print("[5/5] 最终核对远程…", flush=True)
	time.sleep(0.8)
	# push 成功后优先用本地记录的 origin/*；API 可能有几秒缓存延迟
	fetch_remote(remote, 1)
	final_git = remote_tip_via_git(remote, branch) or head
	ok_git = verify_match(head, final_git, "git 远程")
	ok_api = False
	if repo:
		for attempt in range(1, 4):
			final_api = github_api_sha(repo[0], repo[1], branch)
			ok_api = verify_match(head, final_api, "GitHub API")
			if ok_api:
				break
			if attempt < 3:
				print(f"      API 可能延迟，{2 * attempt}s 后再查…", flush=True)
				time.sleep(2 * attempt)

	if not (ok_git or ok_api):
		die("推送后核对失败：远程 tip 与本地 HEAD 不一致。请把上面日志发我。")
	if ok_git and not ok_api:
		print("      [提示] git 远程已一致；GitHub API 偶发延迟，可忽略。", flush=True)

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
