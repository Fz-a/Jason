#!/usr/bin/env node
/**
 * Build techfolio (Next static export) and merge into Astro dist so `/` is the portfolio home.
 */
import { spawnSync } from "node:child_process";
import { cpSync, existsSync } from "node:fs";
import path from "node:path";

const techfolioDir = path.resolve("techfolio");
const outDir = path.join(techfolioDir, "out");
const distArg = process.argv[2];
const distSite = distArg ? path.resolve(distArg) : path.resolve("dist");

console.log("[techfolio] building static export…");
const build = spawnSync("npm", ["run", "build"], {
	cwd: techfolioDir,
	stdio: "inherit",
	env: process.env,
	shell: process.platform === "win32",
});
if ((build.status ?? 1) !== 0) {
	throw new Error("[techfolio] build failed");
}

if (!existsSync(outDir)) {
	throw new Error(`[techfolio] missing output directory: ${outDir}`);
}

if (!existsSync(distSite)) {
	throw new Error(`[techfolio] dist site not found: ${distSite}`);
}

cpSync(outDir, distSite, { recursive: true });
console.log(`[techfolio] merged ${outDir} → ${distSite}`);
