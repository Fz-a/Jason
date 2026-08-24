#!/usr/bin/env node
/**
 * Export local CMS (.data/folio-cms-local.json) into committed static seed + media files.
 * Static Cloudflare deploy has no /api/folio or /api/media — bake CMS content at build time.
 */
import fs from "node:fs";
import path from "node:path";
import { COVER_MAX_WIDTH, writeOptimizedWebpFromBuffer } from "./folio-media-optimize.mjs";

const storePath = path.resolve(".data/folio-cms-local.json");
const outJson = path.resolve("src/constants/folio-static-seed.json");
const mediaDir = path.resolve("public/portfolio/cms");

function parseMediaId(url) {
	if (!url || typeof url !== "string") return null;
	const m = url.match(/[?&]id=([^&]+)/);
	return m?.[1] ?? null;
}

function rewriteNodeUrls(node, urlMap) {
	if (!node || typeof node !== "object") return node;
	const next = { ...node };
	if (typeof next.coverSrc === "string") {
		const id = parseMediaId(next.coverSrc);
		if (id && urlMap[id]) next.coverSrc = urlMap[id];
	}
	if (next.collage?.cells && Array.isArray(next.collage.cells)) {
		next.collage = {
			...next.collage,
			cells: next.collage.cells.map((cell) => {
				if (!cell || typeof cell !== "object") return cell;
				const c = { ...cell };
				const id = parseMediaId(c.src);
				if (id && urlMap[id]) c.src = urlMap[id];
				return c;
			}),
		};
	}
	if (Array.isArray(next.children)) {
		next.children = next.children.map((child) => rewriteNodeUrls(child, urlMap));
	}
	return next;
}

async function writeMediaFiles(media, urlMap) {
	fs.mkdirSync(mediaDir, { recursive: true });
	for (const entry of media) {
		if (!entry?.id || !entry.dataUrl) continue;
		const m = /^data:([^;]+);base64,(.+)$/.exec(entry.dataUrl);
		if (!m) continue;
		const buf = Buffer.from(m[2], "base64");
		const fileName = `${entry.id}.webp`;
		const dest = path.join(mediaDir, fileName);
		await writeOptimizedWebpFromBuffer(buf, dest, COVER_MAX_WIDTH);
		urlMap[entry.id] = `/portfolio/cms/${fileName}`;
	}
}

async function main() {
	if (!fs.existsSync(storePath)) {
		console.log("[folio:export] no .data/folio-cms-local.json — keeping existing static seed");
		return;
	}

	const store = JSON.parse(fs.readFileSync(storePath, "utf8"));
	const urlMap = {};
	const media = Array.isArray(store.media) ? store.media : [];
	await writeMediaFiles(media, urlMap);

	const trees = store.trees && typeof store.trees === "object" ? store.trees : {};
	const exportedTrees = {};
	for (const [section, nodes] of Object.entries(trees)) {
		if (!Array.isArray(nodes)) continue;
		exportedTrees[section] = nodes.map((node) => rewriteNodeUrls(node, urlMap));
	}

	const payload = {
		exportedAt: new Date().toISOString(),
		source: ".data/folio-cms-local.json",
		trees: exportedTrees,
	};

	fs.mkdirSync(path.dirname(outJson), { recursive: true });
	fs.writeFileSync(outJson, `${JSON.stringify(payload, null, "\t")}\n`, "utf8");

	const sectionSummary = Object.entries(exportedTrees)
		.map(([k, v]) => `${k}:${v.length}`)
		.join(", ");
	console.log(
		`[folio:export] wrote ${outJson} (${sectionSummary || "no sections"}) + ${Object.keys(urlMap).length} WebP media files (max ${COVER_MAX_WIDTH}px)`,
	);
}

main().catch((err) => {
	console.error("[folio:export] failed:", err);
	process.exit(1);
});
