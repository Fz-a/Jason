#!/usr/bin/env node
/**
 * Unified Astro build pipeline (Cloudflare-first).
 * CF_STATIC_DEPLOY=1 → static HTML for free-tier Workers assets deploy.
 * CF_WORKERS=1 → SSR + Cloudflare adapter (needs paid plan to deploy worker).
 */
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, rmSync } from "node:fs";
import path from "node:path";

const staticDeploy =
	process.env.CF_STATIC_DEPLOY === "1" || process.env.CF_STATIC_DEPLOY === "true";
const forceStatic = staticDeploy || process.env.CF_WORKERS === "0";
const onCloudflareCi =
	process.env.CF_PAGES === "1" ||
	process.env.CF_PAGES === "true" ||
	process.env.WORKERS_CI === "1" ||
	process.env.CI === "true";

if (!forceStatic && (onCloudflareCi || process.env.CF_WORKERS !== "0")) {
	if (process.env.CF_WORKERS !== "1" && process.env.CF_WORKERS !== "true") {
		process.env.CF_WORKERS = "1";
		console.log("[build] enabling CF_WORKERS=1 (Cloudflare SSR output)");
	}
}

if (staticDeploy) {
	console.log("[build] CF_STATIC_DEPLOY=1 → static HTML (no SSR worker)");
}

if (onCloudflareCi && existsSync("dist")) {
	rmSync("dist", { recursive: true, force: true });
	console.log("[build] cleared dist/ (avoid stale Workers build cache)");
}

const apiDir = path.join("src", "pages", "api");
const apiHidden = path.join("src", "pages", ".api-static-build-hidden");
let apiHiddenDuringBuild = false;

function hideApiRoutesForStaticBuild() {
	if (!staticDeploy || !existsSync(apiDir)) return;
	if (existsSync(apiHidden)) rmSync(apiHidden, { recursive: true, force: true });
	cpSync(apiDir, apiHidden, { recursive: true });
	rmSync(apiDir, { recursive: true, force: true });
	apiHiddenDuringBuild = true;
	console.log("[build] temporarily hid src/pages/api for static build");
}

function restoreApiRoutes() {
	if (!apiHiddenDuringBuild || !existsSync(apiHidden)) return;
	if (existsSync(apiDir)) rmSync(apiDir, { recursive: true, force: true });
	cpSync(apiHidden, apiDir, { recursive: true });
	rmSync(apiHidden, { recursive: true, force: true });
	apiHiddenDuringBuild = false;
	console.log("[build] restored src/pages/api");
}

function run(cmd, args, { optional = false } = {}) {
	console.log(`\n> ${cmd} ${args.join(" ")}`);
	const r = spawnSync(cmd, args, {
		stdio: "inherit",
		env: process.env,
		shell: process.platform === "win32",
	});
	const code = r.status ?? 1;
	if (code !== 0) {
		if (optional) {
			console.warn(`[build] optional step failed (exit ${code}), continuing`);
			return;
		}
		throw new Error(`command failed (exit ${code}): ${cmd} ${args.join(" ")}`);
	}
}

function resolveDistSite() {
	const client = path.join("dist", "client");
	if (existsSync(client)) return client;
	return "dist";
}

hideApiRoutesForStaticBuild();
try {
	run("npx", ["tsx", "scripts/generate-lqips.ts"], { optional: true });
	run("npx", ["tsx", "scripts/generate-vndb-covers.ts"], { optional: true });
	run("npx", ["astro", "build"]);
	run("npx", ["tsx", "scripts/prune-pio-assets.ts"], { optional: true });
	run("npx", ["tsx", "scripts/subset-fonts.ts"], { optional: true });
	run("npx", ["tsx", "scripts/minify-inline-scripts.ts"], { optional: true });

	const site = resolveDistSite();
	console.log(`[build] pagefind site → ${site}`);
	const pf = spawnSync("npx", ["pagefind", "--site", site], {
		stdio: "inherit",
		env: process.env,
		shell: process.platform === "win32",
	});
	if ((pf.status ?? 1) !== 0) {
		console.warn("[build] pagefind failed or empty index — continuing");
	}

	if (!staticDeploy && (process.env.CF_WORKERS === "1" || process.env.CF_WORKERS === "true")) {
		run("node", ["scripts/patch-cf-pages-output.mjs"]);
	}
} catch (err) {
	console.error("[build] failed:", err instanceof Error ? err.message : err);
	process.exitCode = 1;
} finally {
	restoreApiRoutes();
}

if (process.exitCode) process.exit(process.exitCode);

console.log("\n[build] done");
