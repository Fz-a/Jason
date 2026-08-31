#!/usr/bin/env node
/**
 * Load scripts/mirror.env into process.env (does not override existing vars).
 * Used by build / deploy scripts for npm registry & proxy.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(scriptsDir, "mirror.env");

export function applyMirrorEnv() {
	if (!existsSync(envPath)) {
		return { loaded: false, path: envPath, keys: [] };
	}

	const keys = [];
	for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;
		const eq = trimmed.indexOf("=");
		if (eq <= 0) continue;
		const key = trimmed.slice(0, eq).trim();
		let value = trimmed.slice(eq + 1).trim();
		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1);
		}
		if (process.env[key] === undefined) {
			process.env[key] = value;
			keys.push(key);
		}
	}

	return { loaded: true, path: envPath, keys };
}

/** ESM import side-effect: apply when imported. */
const result = applyMirrorEnv();
if (result.loaded && result.keys.length > 0) {
	console.log(`[mirror] loaded ${result.path} (${result.keys.join(", ")})`);
}
