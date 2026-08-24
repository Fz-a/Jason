#!/usr/bin/env node
/**
 * Cloudflare Workers Builds deploy step.
 *
 * Workers Builds requires an explicit deploy — unlike Pages git integration,
 * the platform does not upload dist/ by itself after build.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const serverWrangler = path.join(dist, "server", "wrangler.json");

for (const file of ["_worker.js", "folio-deploy.txt"]) {
	if (!fs.existsSync(path.join(dist, file))) {
		console.error(`[deploy] missing dist/${file} — run pnpm pages:build first`);
		process.exit(1);
	}
}

if (fs.existsSync(serverWrangler)) {
	const cfg = JSON.parse(fs.readFileSync(serverWrangler, "utf8"));
	delete cfg.r2_buckets;
	delete cfg.pages_build_output_dir;
	if (cfg.assets && "binding" in cfg.assets) delete cfg.assets.binding;
	fs.writeFileSync(serverWrangler, `${JSON.stringify(cfg, null, "\t")}\n`);
	console.log("[deploy] patched dist/server/wrangler.json (no R2 / ASSETS binding)");
}

console.log("[deploy] running wrangler deploy …");
const r = spawnSync("npx", ["wrangler", "deploy"], {
	stdio: "inherit",
	env: process.env,
	shell: process.platform === "win32",
});
process.exit(r.status ?? 1);
