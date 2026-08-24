#!/usr/bin/env node
/**
 * Cloudflare Workers Builds deploy step.
 * Publishes dist/server/entry.mjs + dist/client static assets via wrangler.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const client = path.join(dist, "client");
const serverWrangler = path.join(dist, "server", "wrangler.json");
const marker = path.join(client, "folio-deploy.txt");

if (!fs.existsSync(path.join(dist, "server", "entry.mjs"))) {
	console.error("[deploy] missing dist/server/entry.mjs — run pnpm pages:build first");
	process.exit(1);
}

if (!fs.existsSync(marker)) {
	console.error("[deploy] missing dist/client/folio-deploy.txt — build may be stale");
	process.exit(1);
}

const markerBody = fs.readFileSync(marker, "utf8").trim();
console.log("[deploy] marker preview:\n", markerBody.split("\n").slice(0, 4).join("\n"));

if (!fs.existsSync(serverWrangler)) {
	console.error("[deploy] missing dist/server/wrangler.json");
	process.exit(1);
}

const cfg = JSON.parse(fs.readFileSync(serverWrangler, "utf8"));
delete cfg.r2_buckets;
delete cfg.pages_build_output_dir;
if (cfg.assets && "binding" in cfg.assets) delete cfg.assets.binding;
// Placeholder D1 id breaks remote deploy; bind real D1 in the dashboard instead.
const d1 = cfg.d1_databases?.[0];
if (d1?.database_id?.startsWith("00000000")) {
	delete cfg.d1_databases;
	console.log("[deploy] skipped placeholder D1 binding (add DB in Cloudflare dashboard)");
}
for (const key of ["rules", "images", "previews", "no_bundle"]) {
	delete cfg[key];
}
fs.writeFileSync(serverWrangler, `${JSON.stringify(cfg, null, "\t")}\n`);

console.log("[deploy] running: wrangler deploy --config dist/server/wrangler.json");
const r = spawnSync(
	"npx",
	["wrangler", "deploy", "--config", "dist/server/wrangler.json"],
	{
		stdio: "inherit",
		env: process.env,
		shell: process.platform === "win32",
		cwd: process.cwd(),
	},
);

if ((r.status ?? 1) !== 0) {
	console.error("[deploy] wrangler deploy failed");
	process.exit(r.status ?? 1);
}

console.log("[deploy] done — verify https://<your-worker>.workers.dev/folio-deploy.txt");
