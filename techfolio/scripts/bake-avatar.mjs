/**
 * One-shot: bake current avatar2.png + content/avatar.json into a sharp WebP.
 * Run: node scripts/bake-avatar.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DISPLAY_SIZE = 1600;

async function bakeDisplay(input, settings) {
	const size = DISPLAY_SIZE;
	const meta = await sharp(input).metadata();
	const iw = meta.width ?? 1;
	const ih = meta.height ?? 1;
	const cover = Math.max(size / iw, size / ih) * settings.scale;
	const dw = Math.max(1, Math.round(iw * cover));
	const dh = Math.max(1, Math.round(ih * cover));
	const left = Math.round((size - dw) / 2 + (settings.tx / 100) * size);
	const top = Math.round((size - dh) / 2 + (settings.ty / 100) * size);

	const resized = await sharp(input)
		.resize(dw, dh, { fit: "fill", kernel: sharp.kernel.lanczos3 })
		.toBuffer();

	const srcLeft = Math.max(0, -left);
	const srcTop = Math.max(0, -top);
	const dstLeft = Math.max(0, left);
	const dstTop = Math.max(0, top);
	const width = Math.min(dw - srcLeft, size - dstLeft);
	const height = Math.min(dh - srcTop, size - dstTop);

	const cropped = await sharp(resized)
		.extract({ left: srcLeft, top: srcTop, width, height })
		.toBuffer();

	return sharp({
		create: {
			width: size,
			height: size,
			channels: 3,
			background: { r: 240, g: 235, b: 227 },
		},
	})
		.composite([{ input: cropped, left: dstLeft, top: dstTop }])
		.sharpen({ sigma: 0.7, m1: 0.9, m2: 0.35 })
		.webp({ quality: 90, effort: 5 })
		.toBuffer();
}

const settings = JSON.parse(
	await readFile(path.join(root, "content", "avatar.json"), "utf8"),
);
const input = await readFile(path.join(root, "public", "avatar2.png"));
const display = await bakeDisplay(input, settings);
const source = await sharp(input)
	.resize(2400, 2400, { fit: "inside", withoutEnlargement: true, kernel: sharp.kernel.lanczos3 })
	.jpeg({ quality: 93, mozjpeg: true })
	.toBuffer();

await writeFile(path.join(root, "public", "avatar.webp"), display);
await writeFile(path.join(root, "public", "avatar-source.jpg"), source);

const next = {
	src: "/avatar.webp",
	source: "/avatar-source.jpg",
	scale: settings.scale,
	tx: settings.tx,
	ty: settings.ty,
	v: Date.now(),
};
await writeFile(
	path.join(root, "content", "avatar.json"),
	`${JSON.stringify(next, null, "\t")}\n`,
	"utf8",
);

console.log("baked", {
	displayKB: Math.round(display.length / 1024),
	sourceKB: Math.round(source.length / 1024),
	settings: next,
});
