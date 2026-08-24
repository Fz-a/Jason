#!/usr/bin/env node
/**
 * Cloudflare Workers Builds deploy step.
 * Uses a minimal wrangler config so deploy does not auto-provision KV/D1/R2.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const client = path.join(dist, "client");
const serverDir = path.join(dist, "server");
const marker = path.join(client, "folio-deploy.txt");
const rootWrangler = path.resolve("wrangler.jsonc");
const deployConfig = path.join(serverDir, "wrangler.deploy.json");
const redirectConfig = path.resolve(".wrangler/deploy/config.json");

if (!fs.existsSync(path.join(serverDir, "entry.mjs"))) {
	console.error("[deploy] missing dist/server/entry.mjs — run pnpm pages:build first");
	process.exit(1);
}

if (!fs.existsSync(marker)) {
	console.error("[deploy] missing dist/client/folio-deploy.txt — build may be stale");
	process.exit(1);
}

console.log(
	"[deploy] marker preview:\n",
	fs.readFileSync(marker, "utf8").trim().split("\n").slice(0, 4).join("\n"),
);

// Minimal config only — wrangler must NOT try to create KV/D1/R2 during deploy.
const deployCfg = {
	name: "firefly",
	main: "entry.mjs",
	compatibility_date: "2025-01-01",
	compatibility_flags: ["nodejs_compat"],
	assets: {
		directory: "../client",
		not_found_handling: "404-page",
		html_handling: "force-trailing-slash",
	},
	vars: {
		CMS_ADMIN_USERNAME: "admin",
	},
};
fs.writeFileSync(deployConfig, `${JSON.stringify(deployCfg, null, "\t")}\n`);
console.log("[deploy] wrote minimal dist/server/wrangler.deploy.json (no KV/D1/R2)");

// wrangler merges repo-root wrangler.jsonc — strip bindings there during deploy.
let rootBackup = null;
if (fs.existsSync(rootWrangler)) {
	rootBackup = `${rootWrangler}.deploy-backup`;
	fs.copyFileSync(rootWrangler, rootBackup);
	fs.writeFileSync(
		rootWrangler,
		`{
	"name": "firefly",
	"compatibility_date": "2025-01-01",
	"compatibility_flags": ["nodejs_compat"]
}
`,
	);
	console.log("[deploy] temporarily minimized wrangler.jsonc for deploy merge");
}

// Astro/vite may leave a redirect that still references bindings-rich config.
if (fs.existsSync(redirectConfig)) {
	fs.unlinkSync(redirectConfig);
	console.log("[deploy] removed .wrangler/deploy/config.json redirect");
}

console.log("[deploy] running: wrangler deploy --config dist/server/wrangler.deploy.json");
const r = spawnSync(
	"npx",
	["wrangler", "deploy", "--config", "dist/server/wrangler.deploy.json"],
	{
		stdio: "inherit",
		env: process.env,
		shell: process.platform === "win32",
	},
);

if (rootBackup && fs.existsSync(rootBackup)) {
	fs.copyFileSync(rootBackup, rootWrangler);
	fs.unlinkSync(rootBackup);
	console.log("[deploy] restored wrangler.jsonc");
}

if ((r.status ?? 1) !== 0) {
	console.error("[deploy] wrangler deploy failed");
	process.exit(r.status ?? 1);
}

console.log("[deploy] done — verify https://firefly.<account>.workers.dev/folio-deploy.txt");
