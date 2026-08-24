#!/usr/bin/env node
/**
 * Cloudflare Pages deploy step.
 *
 * Do NOT use `wrangler deploy` here — it provisions Worker bindings (R2/D1/KV)
 * via API and fails with code 10042 when R2 is not enabled on the account.
 *
 * Pages publishes the build output directory; this script only verifies it.
 * Bind D1/R2 in the Pages dashboard (Settings → Bindings), not wrangler.jsonc.
 */
import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const required = ["_worker.js", "folio-deploy.txt"];

for (const file of required) {
	const p = path.join(dist, file);
	if (!fs.existsSync(p)) {
		console.error(`[deploy] missing dist/${file} — build step may have failed`);
		process.exit(1);
	}
}

console.log("[deploy] dist/ ready for Cloudflare Pages (SSR via dist/_worker.js)");
console.log("[deploy] skip wrangler deploy — Pages uploads pages_build_output_dir automatically");
