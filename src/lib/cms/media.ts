import { newId } from "@/lib/cms/auth";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 5 * 1024 * 1024;

export type MediaRow = {
	id: string;
	r2_key: string;
	url: string;
	mime: string;
	size: number;
	created_at: string;
};

export function mediaPublicUrl(id: string): string {
	return `/api/media/file/?id=${encodeURIComponent(id)}`;
}

export async function listMedia(db: D1Database, limit = 100): Promise<MediaRow[]> {
	const { results } = await db
		.prepare(
			`SELECT id, r2_key, url, mime, size, created_at
			 FROM media
			 ORDER BY created_at DESC
			 LIMIT ?`,
		)
		.bind(limit)
		.all<MediaRow>();
	return results ?? [];
}

export async function getMedia(db: D1Database, id: string): Promise<MediaRow | null> {
	return (
		(await db
			.prepare(
				`SELECT id, r2_key, url, mime, size, created_at FROM media WHERE id = ?`,
			)
			.bind(id)
			.first<MediaRow>()) ?? null
	);
}

export async function uploadMedia(
	db: D1Database,
	bucket: R2Bucket,
	file: File,
): Promise<MediaRow> {
	if (!ALLOWED.has(file.type)) {
		throw new Error("Only JPEG, PNG, WebP, or GIF images are allowed");
	}
	if (file.size > MAX_BYTES) {
		throw new Error("Image must be 5MB or smaller");
	}

	const id = newId("media");
	const ext =
		file.type === "image/png"
			? "png"
			: file.type === "image/webp"
				? "webp"
				: file.type === "image/gif"
					? "gif"
					: "jpg";
	const key = `uploads/${id}.${ext}`;
	const bytes = new Uint8Array(await file.arrayBuffer());
	await bucket.put(key, bytes, {
		httpMetadata: { contentType: file.type },
	});

	const url = mediaPublicUrl(id);
	await db
		.prepare(
			`INSERT INTO media (id, r2_key, url, mime, size) VALUES (?, ?, ?, ?, ?)`,
		)
		.bind(id, key, url, file.type, file.size)
		.run();

	return {
		id,
		r2_key: key,
		url,
		mime: file.type,
		size: file.size,
		created_at: new Date().toISOString(),
	};
}
