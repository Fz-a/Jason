import fs from "node:fs";
import path from "node:path";

/** Astro static → dist/; @astrojs/cloudflare → dist/client/ */
export function resolveDistDir(): string {
	const client = path.join("dist", "client");
	if (fs.existsSync(client)) return client;
	return "dist";
}
