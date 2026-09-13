#!/usr/bin/env node
/**
 * Build techfolio (Next static export) and merge into Astro dist so `/` is the portfolio home.
 * Cloudflare CI only installs root pnpm deps — always npm-install techfolio before building.
 *
 * Next `output: "export"` cannot include Route Handlers (`app/api/*`). Those APIs are
 * studio-only (local `next dev`). Hide them during production static export, then restore.
 */
import "./mirror-env.mjs";
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, rmSync } from "node:fs";
import path from "node:path";

const techfolioDir = path.resolve("techfolio");
const outDir = path.join(techfolioDir, "out");
const distArg = process.argv[2];
const distSite = distArg ? path.resolve(distArg) : path.resolve("dist");

const apiDir = path.join(techfolioDir, "app", "api");
const apiHidden = path.join(techfolioDir, ".api-static-build-hidden");
let apiHiddenDuringBuild = false;

function hideApiRoutesForStaticExport() {
	if (!existsSync(apiDir)) return;
	if (existsSync(apiHidden)) rmSync(apiHidden, { recursive: true, force: true });
	cpSync(apiDir, apiHidden, { recursive: true });
	rmSync(apiDir, { recursive: true, force: true });
	apiHiddenDuringBuild = true;
	console.log("[techfolio] temporarily hid app/api for static export");
}

function restoreApiRoutes() {
	if (!apiHiddenDuringBuild || !existsSync(apiHidden)) return;
	if (existsSync(apiDir)) rmSync(apiDir, { recursive: true, force: true });
	cpSync(apiHidden, apiDir, { recursive: true });
	rmSync(apiHidden, { recursive: true, force: true });
	apiHiddenDuringBuild = false;
	console.log("[techfolio] restored app/api");
}

function runNpm(args, label) {
	console.log(`[techfolio] ${label}…`);
	const result = spawnSync("npm", args, {
		cwd: techfolioDir,
		stdio: "inherit",
		env: process.env,
		shell: true,
	});
	if (result.error) {
		throw new Error(`[techfolio] ${label} spawn failed: ${result.error.message}`);
	}
	if ((result.status ?? 1) !== 0) {
		throw new Error(`[techfolio] ${label} failed (exit ${result.status ?? "unknown"})`);
	}
}

if (!existsSync(path.join(techfolioDir, "package.json"))) {
	throw new Error(`[techfolio] missing package.json in ${techfolioDir}`);
}

try {
	runNpm(["install", "--no-fund", "--no-audit"], "installing dependencies");
	hideApiRoutesForStaticExport();
	runNpm(["run", "build"], "building static export");
} finally {
	restoreApiRoutes();
}

if (!existsSync(outDir)) {
	throw new Error(`[techfolio] missing output directory: ${outDir}`);
}

if (!existsSync(distSite)) {
	throw new Error(`[techfolio] dist site not found: ${distSite}`);
}

cpSync(outDir, distSite, { recursive: true });
console.log(`[techfolio] merged ${outDir} → ${distSite}`);
