import type { APIRoute } from "astro";
import {
	clearSessionCookieHeader,
	destroySession,
	getSessionIdFromRequest,
	requestIsSecure,
} from "@/lib/cms/auth";
import { getCmsEnv, json } from "@/lib/cms/env";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
	const env = getCmsEnv(locals);
	const sessionId = getSessionIdFromRequest(request);
	if (env && sessionId) {
		await destroySession(env.DB, sessionId);
	} else if (sessionId) {
		const { isLocalCmsEnabled, localLogout } = await import("@/lib/cms/local-store");
		if (isLocalCmsEnabled()) localLogout(sessionId);
	}
	const secure = requestIsSecure(request);
	return json(
		{ ok: true },
		{ headers: { "Set-Cookie": clearSessionCookieHeader(secure) } },
	);
};
