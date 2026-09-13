import { writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";

type AvatarBody = {
	src: string;
	source?: string;
	scale: number;
	tx: number;
	ty: number;
	v?: number;
};

const DISPLAY_SIZE = 1600;
const SOURCE_MAX = 2400;

async function bakeDisplay(
	input: Buffer,
	settings: { scale: number; tx: number; ty: number },
) {
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

	// Intersection of placed image with canvas
	const srcLeft = Math.max(0, -left);
	const srcTop = Math.max(0, -top);
	const dstLeft = Math.max(0, left);
	const dstTop = Math.max(0, top);
	const width = Math.min(dw - srcLeft, size - dstLeft);
	const height = Math.min(dh - srcTop, size - dstTop);

	if (width <= 0 || height <= 0) {
		throw new Error("裁切区域无效，请调整位置后再保存");
	}

	const cropped = await sharp(resized)
		.extract({
			left: srcLeft,
			top: srcTop,
			width,
			height,
		})
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
		// Light capture sharpen — crisp at large hero size without AI upscale
		.sharpen({ sigma: 0.7, m1: 0.9, m2: 0.35 })
		.webp({ quality: 90, effort: 5 })
		.toBuffer();
}

async function makeSource(input: Buffer) {
	const meta = await sharp(input).metadata();
	const iw = meta.width ?? 1;
	const ih = meta.height ?? 1;
	const scale = Math.min(1, SOURCE_MAX / Math.max(iw, ih));
	const w = Math.max(1, Math.round(iw * scale));
	const h = Math.max(1, Math.round(ih * scale));
	return sharp(input)
		.resize(w, h, { fit: "fill", kernel: sharp.kernel.lanczos3 })
		.jpeg({ quality: 93, mozjpeg: true })
		.toBuffer();
}

export async function POST(request: Request) {
	if (process.env.NODE_ENV === "production") {
		return NextResponse.json(
			{ ok: false, error: "头像保存仅在本地开发模式可用" },
			{ status: 403 },
		);
	}

	try {
		const form = await request.formData();
		const settingsRaw = form.get("settings");
		if (typeof settingsRaw !== "string") {
			return NextResponse.json(
				{ ok: false, error: "缺少 settings" },
				{ status: 400 },
			);
		}

		const parsed = JSON.parse(settingsRaw) as AvatarBody;
		const settingsIn = {
			scale: Number(parsed.scale),
			tx: Number(parsed.tx),
			ty: Number(parsed.ty),
		};

		const root = process.cwd();
		const v = Date.now();

		// Prefer fresh upload; else bake from existing source / avatar2
		let inputBuf: Buffer | null = null;
		const image = form.get("image");
		if (image instanceof File && image.size > 0) {
			inputBuf = Buffer.from(await image.arrayBuffer());
		} else {
			const candidates = [
				"avatar-source.jpg",
				"avatar2.png",
				"avatar.webp",
			];
			const { readFile } = await import("node:fs/promises");
			for (const name of candidates) {
				try {
					inputBuf = await readFile(path.join(root, "public", name));
					break;
				} catch {
					/* try next */
				}
			}
		}

		if (!inputBuf) {
			return NextResponse.json(
				{ ok: false, error: "找不到可处理的图片，请重新上传" },
				{ status: 400 },
			);
		}

		const [displayBuf, sourceBuf] = await Promise.all([
			bakeDisplay(inputBuf, settingsIn),
			makeSource(inputBuf),
		]);

		await writeFile(path.join(root, "public", "avatar.webp"), displayBuf);
		await writeFile(path.join(root, "public", "avatar-source.jpg"), sourceBuf);

		const settings: AvatarBody = {
			src: "/avatar.webp",
			source: "/avatar-source.jpg",
			scale: settingsIn.scale,
			tx: settingsIn.tx,
			ty: settingsIn.ty,
			v,
		};

		await writeFile(
			path.join(root, "content", "avatar.json"),
			`${JSON.stringify(settings, null, "\t")}\n`,
			"utf8",
		);

		return NextResponse.json({
			ok: true,
			settings,
			bytes: { display: displayBuf.length, source: sourceBuf.length },
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : "保存失败";
		return NextResponse.json({ ok: false, error: message }, { status: 500 });
	}
}
