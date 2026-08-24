#!/usr/bin/env node
/**
 * Cloudflare Pages + @astrojs/cloudflare SSR post-build fix.
 *
 * Pages auto-injects an ASSETS binding; wrangler 4.98+ rejects an explicit
 * `assets.binding: "ASSETS"` when `pages_build_output_dir` is set — deploy
 * fails in ~10s with "The name 'ASSETS' is reserved in Pages projects."
 *
 * This script:
 * 1. Copies dist/client/* → dist/ so static files sit beside _worker.js
 * 2. Writes dist/_worker.js for Pages SSR
 * 3. Strips the reserved ASSETS binding from dist/server/wrangler.json
 */
import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const client = path.join(dist, "client");
const serverWrangler = path.join(dist, "server", "wrangler.json");

if (!fs.existsSync(client)) {
	console.log("[patch-cf] no dist/client — skipping (static build?)");
	process.exit(0);
}

console.log("[patch-cf] copying dist/client → dist/ for Pages static assets");
for (const entry of fs.readdirSync(client, { withFileTypes: true })) {
	const src = path.join(client, entry.name);
	const dest = path.join(dist, entry.name);
	if (entry.name === "server") continue;
	fs.cpSync(src, dest, { recursive: true, force: true });
}

const workerEntry = path.join(dist, "_worker.js");
fs.writeFileSync(workerEntry, "export { default } from './server/entry.mjs';\n");
console.log("[patch-cf] wrote dist/_worker.js");

if (fs.existsSync(serverWrangler)) {
	const cfg = JSON.parse(fs.readFileSync(serverWrangler, "utf8"));
	delete cfg.pages_build_output_dir;
	if (cfg.assets && "binding" in cfg.assets) {
		delete cfg.assets.binding;
	}
	// R2 must be dashboard-bound after enabling the product; omit from deploy config.
	delete cfg.r2_buckets;
	if (cfg.kv_namespaces?.length) delete cfg.kv_namespaces;
	for (const key of ["rules", "images", "previews", "no_bundle"]) {
		delete cfg[key];
	}
	fs.writeFileSync(serverWrangler, `${JSON.stringify(cfg, null, "\t")}\n`);
	console.log("[patch-cf] patched dist/server/wrangler.json (removed ASSETS binding)");
}

console.log("[patch-cf] done");
