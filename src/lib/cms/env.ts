import type { APIContext } from "astro";

export type CmsBindings = {
	DB: D1Database;
	MEDIA?: R2Bucket;
	CMS_SESSION_SECRET?: string;
	CMS_ADMIN_USERNAME?: string;
	CMS_ADMIN_PASSWORD?: string;
};

export function getCmsEnv(locals: APIContext["locals"]): CmsBindings | null {
	const runtime = (locals as { runtime?: { env?: CmsBindings } }).runtime;
	const env = runtime?.env;
	if (!env?.DB) return null;
	return env;
}

export function json(
	data: unknown,
	init: ResponseInit & { status?: number } = {},
): Response {
	const status = init.status ?? 200;
	return new Response(JSON.stringify(data), {
		...init,
		status,
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			...(init.headers ?? {}),
		},
	});
}

export function errorJson(message: string, status = 400): Response {
	return json({ error: message }, { status });
}
