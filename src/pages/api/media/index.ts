import type { APIRoute } from "astro";
import { getSessionIdFromRequest, requireUser } from "@/lib/cms/auth";
import { errorJson, getCmsEnv, json } from "@/lib/cms/env";
import { listMedia, uploadMedia } from "@/lib/cms/media";

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
	const env = getCmsEnv(locals);
	if (env) {
		const auth = await requireUser(env.DB, request);
		if (auth instanceof Response) return auth;
		const items = await listMedia(env.DB);
		return json({ items });
	}

	const { isLocalCmsEnabled, localGetUser, localListMedia } = await import(
		"@/lib/cms/local-store"
	);
	if (!isLocalCmsEnabled()) {
		return errorJson("CMS database unavailable (need Cloudflare D1)", 503);
	}
	if (!localGetUser(getSessionIdFromRequest(request))) {
		return errorJson("Unauthorized", 401);
	}
	return json({ items: localListMedia() });
};

export const POST: APIRoute = async ({ request, locals }) => {
	const contentType = request.headers.get("content-type") || "";
	if (!contentType.includes("multipart/form-data")) {
		return errorJson("Expected multipart form upload");
	}
	const form = await request.formData();
	const file = form.get("file");
	if (!(file instanceof File)) return errorJson("file field required");

	const env = getCmsEnv(locals);
	if (env) {
		if (!env.MEDIA) return errorJson("R2 MEDIA bucket not configured", 503);
		const auth = await requireUser(env.DB, request);
		if (auth instanceof Response) return auth;
		try {
			const media = await uploadMedia(env.DB, env.MEDIA, file);
			return json({ ok: true, media }, { status: 201 });
		} catch (e) {
			return errorJson(e instanceof Error ? e.message : "Upload failed", 400);
		}
	}

	const { isLocalCmsEnabled, localGetUser, localUpload } = await import(
		"@/lib/cms/local-store"
	);
	if (!isLocalCmsEnabled()) {
		return errorJson("CMS database unavailable (need Cloudflare D1)", 503);
	}
	if (!localGetUser(getSessionIdFromRequest(request))) {
		return errorJson("Unauthorized", 401);
	}
	try {
		const media = await localUpload(file);
		return json({ ok: true, media }, { status: 201 });
	} catch (e) {
		return errorJson(e instanceof Error ? e.message : "Upload failed", 400);
	}
};
