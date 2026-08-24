#!/usr/bin/env node
/**
 * Cloudflare Workers Builds deploy step.
 * Uses a minimal wrangler config — no KV/D1/R2 auto-provisioning.
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
const generatedWrangler = path.join(serverDir, "wrangler.json");
const wranglerState = path.resolve(".wrangler");

if (!fs.existsSync(path.join(serverDir, "entry.mjs"))) {
	console.error("[deploy] missing dist/server/entry.mjs — run pnpm pages:build first");
	process.exit(1);
}

if (!fs.existsSync(marker)) {
	console.error("[deploy] missing dist/client/folio-deploy.txt — build may be stale");
	process.exit(1);
}

const markerText = fs.readFileSync(marker, "utf8").trim();
console.log("[deploy] marker preview:\n", markerText.split("\n").slice(0, 6).join("\n"));

if (!markerText.includes("astro-session-false-no-kv")) {
	console.warn(
		"[deploy] WARNING: folio-deploy.txt missing fix=astro-session-false-no-kv — build cache may be stale",
	);
}

// Drop Astro-generated config so wrangler cannot merge SESSION KV bindings.
if (fs.existsSync(generatedWrangler)) {
	fs.unlinkSync(generatedWrangler);
	console.log("[deploy] removed dist/server/wrangler.json (prevents SESSION auto-provision)");
}
if (fs.existsSync(wranglerState)) {
	fs.rmSync(wranglerState, { recursive: true, force: true });
	console.log("[deploy] cleared .wrangler/ redirect state");
}

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
console.log("[deploy] wrote dist/server/wrangler.deploy.json (no KV/D1/R2)");

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
	console.log("[deploy] temporarily minimized wrangler.jsonc");
}

function wrangler(args) {
	return spawnSync("npx", ["wrangler", ...args], {
		stdio: "inherit",
		env: process.env,
		shell: process.platform === "win32",
		cwd: serverDir,
	});
}

console.log("[deploy] dry-run bindings check …");
const dry = wrangler(["deploy", "--config", "wrangler.deploy.json", "--dry-run"]);
if ((dry.status ?? 1) !== 0) {
	console.error("[deploy] dry-run failed");
	if (rootBackup) {
		fs.copyFileSync(rootBackup, rootWrangler);
		fs.unlinkSync(rootBackup);
	}
	process.exit(dry.status ?? 1);
}

console.log("[deploy] running: wrangler deploy --config wrangler.deploy.json");
const r = wrangler(["deploy", "--config", "wrangler.deploy.json"]);

if (rootBackup && fs.existsSync(rootBackup)) {
	fs.copyFileSync(rootBackup, rootWrangler);
	fs.unlinkSync(rootBackup);
	console.log("[deploy] restored wrangler.jsonc");
}

if ((r.status ?? 1) !== 0) {
	console.error("[deploy] wrangler deploy failed");
	process.exit(r.status ?? 1);
}

console.log("[deploy] done — open /folio-deploy.txt on your worker URL");
