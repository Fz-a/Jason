#!/usr/bin/env node
/**
 * Resize + WebP compress folio CMS images under public/portfolio/cms/.
 * Used by folio:export and folio:optimize-media.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

export const COVER_MAX_WIDTH = 1600;
export const COLLAGE_MAX_WIDTH = 1920;
export const WEBP_QUALITY = 82;

const SOURCE_EXT = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp"]);

export async function optimizeImageBuffer(buf, maxWidth = COVER_MAX_WIDTH) {
	return sharp(buf)
		.rotate()
		.resize({ width: maxWidth, withoutEnlargement: true })
		.webp({ quality: WEBP_QUALITY, effort: 4 })
		.toBuffer();
}

export async function writeOptimizedWebpFromBuffer(buf, destPath, maxWidth = COVER_MAX_WIDTH) {
	const out = await optimizeImageBuffer(buf, maxWidth);
	fs.mkdirSync(path.dirname(destPath), { recursive: true });
	fs.writeFileSync(destPath, out);
	return out.length;
}

/**
 * Optimize one file → sibling .webp. Returns { webpPath, bytes, removed }.
 */
export async function optimizeMediaFile(filePath, maxWidth = COVER_MAX_WIDTH) {
	const ext = path.extname(filePath).toLowerCase();
	if (!SOURCE_EXT.has(ext)) return null;

	const base = filePath.slice(0, -ext.length);
	const webpPath = `${base}.webp`;
	const before = fs.statSync(filePath).size;
	const after = await writeOptimizedWebpFromBuffer(fs.readFileSync(filePath), webpPath, maxWidth);

	let removed = null;
	if (webpPath !== filePath && fs.existsSync(filePath)) {
		fs.unlinkSync(filePath);
		removed = filePath;
	}

	return { webpPath, bytes: after, before, removed };
}

/** Optimize every raster in mediaDir; delete originals when a new .webp is written. */
export async function optimizeMediaDir(mediaDir, maxWidth = COVER_MAX_WIDTH) {
	if (!fs.existsSync(mediaDir)) return { files: 0, before: 0, after: 0 };

	const entries = fs.readdirSync(mediaDir).filter((name) => {
		const ext = path.extname(name).toLowerCase();
		return SOURCE_EXT.has(ext) && ext !== ".webp";
	});

	let before = 0;
	let after = 0;
	let files = 0;

	for (const name of entries) {
		const filePath = path.join(mediaDir, name);
		const result = await optimizeMediaFile(filePath, maxWidth);
		if (!result) continue;
		before += result.before;
		after += result.bytes;
		files += 1;
	}

	// Re-compress existing webp if larger than needed (optional pass)
	for (const name of fs.readdirSync(mediaDir)) {
		if (!name.endsWith(".webp")) continue;
		const filePath = path.join(mediaDir, name);
		const size = fs.statSync(filePath).size;
		if (size < 180 * 1024) continue; // already small enough
		const buf = fs.readFileSync(filePath);
		const optimized = await optimizeImageBuffer(buf, maxWidth);
		if (optimized.length < size * 0.92) {
			before += size;
			fs.writeFileSync(filePath, optimized);
			after += optimized.length;
		}
	}

	return { files, before, after };
}

function rewriteUrlsInJson(value, urlMap) {
	if (typeof value === "string") {
		let next = value;
		for (const [from, to] of urlMap) {
			if (next.includes(from)) next = next.replaceAll(from, to);
		}
		return next;
	}
	if (Array.isArray(value)) return value.map((v) => rewriteUrlsInJson(v, urlMap));
	if (value && typeof value === "object") {
		const out = {};
		for (const [k, v] of Object.entries(value)) {
			out[k] = rewriteUrlsInJson(v, urlMap);
		}
		return out;
	}
	return value;
}

export function updateStaticSeedUrls(seedPath, urlMap) {
	if (!fs.existsSync(seedPath) || urlMap.size === 0) return;
	const seed = JSON.parse(fs.readFileSync(seedPath, "utf8"));
	const next = rewriteUrlsInJson(seed, urlMap);
	fs.writeFileSync(seedPath, `${JSON.stringify(next, null, "\t")}\n`, "utf8");
}

async function main() {
	const mediaDir = path.resolve("public/portfolio/cms");
	const seedPath = path.resolve("src/constants/folio-static-seed.json");
	const urlMap = new Map();

	if (fs.existsSync(mediaDir)) {
		for (const name of fs.readdirSync(mediaDir)) {
			const ext = path.extname(name).toLowerCase();
			if (!SOURCE_EXT.has(ext) || ext === ".webp") continue;
			const filePath = path.join(mediaDir, name);
			const publicPath = `/portfolio/cms/${name}`;
			const webpName = `${name.slice(0, -ext.length)}.webp`;
			const webpPublic = `/portfolio/cms/${webpName}`;
			const result = await optimizeMediaFile(filePath, COVER_MAX_WIDTH);
			if (result) urlMap.set(publicPath, webpPublic);
		}
	}

	const pass = await optimizeMediaDir(mediaDir, COVER_MAX_WIDTH);
	updateStaticSeedUrls(seedPath, urlMap);

	const saved =
		pass.before > 0 ? `${Math.round((1 - pass.after / pass.before) * 100)}% smaller` : "n/a";
	console.log(
		`[folio:optimize-media] ${pass.files} files → WebP max ${COVER_MAX_WIDTH}px (${saved}, ${Math.round(pass.before / 1024)}KB → ${Math.round(pass.after / 1024)}KB)`,
	);
}

const isMain = process.argv[1]?.endsWith("folio-media-optimize.mjs");
if (isMain) {
	main().catch((err) => {
		console.error("[folio:optimize-media] failed:", err);
		process.exit(1);
	});
}
