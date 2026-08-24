#!/usr/bin/env node
/**
 * Deploy static dist/ to Cloudflare Workers (assets-only).
 * Free-tier Workers cannot host the ~36 MiB SSR bundle (code 10027).
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const marker = path.join(dist, "folio-deploy.txt");
const rootWrangler = path.resolve("wrangler.jsonc");
const deployConfig = path.resolve("wrangler.deploy.static.json");
const wranglerState = path.resolve(".wrangler");

for (const file of ["folio-deploy.txt", "index.html"]) {
	if (!fs.existsSync(path.join(dist, file))) {
		console.error(`[deploy] missing dist/${file} — run pnpm pages:build (static) first`);
		process.exit(1);
	}
}

console.log(
	"[deploy] marker preview:\n",
	fs.readFileSync(marker, "utf8").trim().split("\n").slice(0, 6).join("\n"),
);

if (fs.existsSync(wranglerState)) {
	fs.rmSync(wranglerState, { recursive: true, force: true });
}

const deployCfg = {
	name: "firefly",
	compatibility_date: "2025-01-01",
	compatibility_flags: ["nodejs_compat"],
	assets: {
		directory: "./dist",
		not_found_handling: "404-page",
		html_handling: "force-trailing-slash",
	},
};
fs.writeFileSync(deployConfig, `${JSON.stringify(deployCfg, null, "\t")}\n`);
console.log("[deploy] static assets-only wrangler config (no SSR worker script)");

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
}

console.log("[deploy] running: wrangler deploy --config wrangler.deploy.static.json");
const r = spawnSync("npx", ["wrangler", "deploy", "--config", "wrangler.deploy.static.json"], {
	stdio: "inherit",
	env: process.env,
	shell: process.platform === "win32",
});

if (rootBackup && fs.existsSync(rootBackup)) {
	fs.copyFileSync(rootBackup, rootWrangler);
	fs.unlinkSync(rootBackup);
}

if ((r.status ?? 1) !== 0) {
	console.error("[deploy] static wrangler deploy failed");
	process.exit(r.status ?? 1);
}

try {
	fs.unlinkSync(deployConfig);
} catch {
	/* ignore */
}

console.log("[deploy] done — static site published");
