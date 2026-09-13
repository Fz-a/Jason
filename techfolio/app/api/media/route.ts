import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";

const MAX_EDGE = 2400;
const ALLOWED = new Set([
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
]);

function safeStem(name: string) {
	const base = path.basename(name, path.extname(name));
	const cleaned = base
		.normalize("NFKD")
		.replace(/[^\w\-]+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "")
		.slice(0, 48);
	return cleaned || "image";
}

export async function POST(req: Request) {
	try {
		const form = await req.formData();
		const file = form.get("image");
		if (!(file instanceof File) || file.size <= 0) {
			return NextResponse.json({ error: "请选择图片文件" }, { status: 400 });
		}
		if (file.type && !ALLOWED.has(file.type)) {
			return NextResponse.json(
				{ error: "仅支持 JPG / PNG / WebP" },
				{ status: 400 },
			);
		}

		const input = Buffer.from(await file.arrayBuffer());
		const outBuf = await sharp(input)
			.rotate()
			.resize({
				width: MAX_EDGE,
				height: MAX_EDGE,
				fit: "inside",
				withoutEnlargement: true,
				kernel: sharp.kernel.lanczos3,
			})
			.webp({ quality: 86, effort: 4 })
			.toBuffer();

		const stem = safeStem(file.name);
		const stamp = Date.now().toString(36);
		const filename = `${stem}-${stamp}.webp`;
		const publicDir = path.join(process.cwd(), "public", "uploads");
		await mkdir(publicDir, { recursive: true });
		await writeFile(path.join(publicDir, filename), outBuf);

		const publicPath = `/uploads/${filename}`;

		// Keep studio gallery in sync when possible
		try {
			const mediaPath = path.join(process.cwd(), "content", "media.json");
			const raw = await readFile(mediaPath, "utf8");
			const list = JSON.parse(raw) as string[];
			if (Array.isArray(list) && !list.includes(publicPath)) {
				list.unshift(publicPath);
				await writeFile(mediaPath, `${JSON.stringify(list, null, 4)}\n`, "utf8");
			}
		} catch {
			// gallery index is best-effort
		}

		return NextResponse.json({ path: publicPath });
	} catch (err) {
		const message = err instanceof Error ? err.message : "上传失败";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
