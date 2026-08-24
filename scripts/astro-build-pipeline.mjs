#!/usr/bin/env node
/**
 * Unified Astro build pipeline (Cloudflare-first).
 * Set CF_WORKERS=0 to force a classic static Node build.
 */
import { spawnSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import path from "node:path";

// Cloudflare Pages / Workers Builds / explicit CF_WORKERS
const forceStatic = process.env.CF_WORKERS === "0";
const onCloudflareCi =
	process.env.CF_PAGES === "1" ||
	process.env.CF_PAGES === "true" ||
	process.env.WORKERS_CI === "1" ||
	process.env.CI === "true";

if (!forceStatic && (onCloudflareCi || process.env.CF_WORKERS !== "0")) {
	// Default production path: Cloudflare adapter + SSR APIs
	if (process.env.CF_WORKERS !== "1" && process.env.CF_WORKERS !== "true") {
		process.env.CF_WORKERS = "1";
		console.log("[build] enabling CF_WORKERS=1 (Cloudflare output)");
	}
}

// Cloudflare may restore a stale dist/ from build cache (old SESSION KV metadata).
if (onCloudflareCi && existsSync("dist")) {
	rmSync("dist", { recursive: true, force: true });
	console.log("[build] cleared dist/ (avoid stale Workers build cache)");
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
		process.exit(code);
	}
}

function resolveDistSite() {
	const client = path.join("dist", "client");
	if (existsSync(client)) return client;
	return "dist";
}

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
	console.warn(
		"[build] pagefind failed or empty index — continuing (SSR/Cloudflare builds often have few static HTML files).",
	);
}

if (
	process.env.CF_WORKERS === "1" ||
	process.env.CF_WORKERS === "true" ||
	onCloudflareCi
) {
	run("node", ["scripts/patch-cf-pages-output.mjs"]);
}

console.log("\n[build] done");
