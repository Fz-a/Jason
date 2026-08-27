import type { APIRoute } from "astro";
import { errorJson, getCmsEnv } from "@/lib/cms/env";
import { getMedia } from "@/lib/cms/media";

export const prerender = false;

export const GET: APIRoute = async ({ url, locals }) => {
	const id = url.searchParams.get("id") ?? "";
	if (!id) return errorJson("Missing id", 404);

	const env = getCmsEnv(locals);
	if (env?.MEDIA) {
		const row = await getMedia(env.DB, id);
		if (!row) return errorJson("Not found", 404);
		const obj = await env.MEDIA.get(row.r2_key);
		if (!obj) return errorJson("File missing in storage", 404);
		const headers = new Headers();
		headers.set(
			"Content-Type",
			row.mime || obj.httpMetadata?.contentType || "application/octet-stream",
		);
		headers.set("Cache-Control", "public, max-age=31536000, immutable");
		if (obj.size != null) headers.set("Content-Length", String(obj.size));
		if (url.searchParams.get("download") === "1") {
			const ext = row.r2_key.split(".").pop() || "jpg";
			headers.set(
				"Content-Disposition",
				`attachment; filename="${row.id}.${ext}"`,
			);
		}
		return new Response(obj.body, { status: 200, headers });
	}

	const { isLocalCmsEnabled, localGetMedia } = await import("@/lib/cms/local-store");
	if (!isLocalCmsEnabled()) return errorJson("Media storage unavailable", 503);
	const row = localGetMedia(id);
	if (!row?.dataUrl) return errorJson("Not found", 404);
	const match = /^data:([^;]+);base64,(.+)$/.exec(row.dataUrl);
	if (!match) return errorJson("Corrupt media", 500);
	const bytes = Buffer.from(match[2]!, "base64");
	const headers: Record<string, string> = {
		"Content-Type": match[1] || row.mime,
		"Cache-Control": "public, max-age=31536000, immutable",
		"Content-Length": String(bytes.length),
	};
	if (url.searchParams.get("download") === "1") {
		const ext =
			row.mime === "image/png"
				? "png"
				: row.mime === "image/webp"
					? "webp"
					: row.mime === "image/gif"
						? "gif"
						: "jpg";
		headers["Content-Disposition"] = `attachment; filename="${row.id}.${ext}"`;
	}
	return new Response(bytes, {
		status: 200,
		headers,
	});
};
