#!/usr/bin/env node
/**
 * Build techfolio (Next static export) and merge into Astro dist so `/` is the portfolio home.
 * Cloudflare CI only installs root pnpm deps — always npm-install techfolio before building.
 */
import "./mirror-env.mjs";
import { spawnSync } from "node:child_process";
import { cpSync, existsSync } from "node:fs";
import path from "node:path";

const techfolioDir = path.resolve("techfolio");
const outDir = path.join(techfolioDir, "out");
const distArg = process.argv[2];
const distSite = distArg ? path.resolve(distArg) : path.resolve("dist");

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

runNpm(["install", "--no-fund", "--no-audit"], "installing dependencies");
runNpm(["run", "build"], "building static export");

if (!existsSync(outDir)) {
	throw new Error(`[techfolio] missing output directory: ${outDir}`);
}

if (!existsSync(distSite)) {
	throw new Error(`[techfolio] dist site not found: ${distSite}`);
}

cpSync(outDir, distSite, { recursive: true });
console.log(`[techfolio] merged ${outDir} → ${distSite}`);
