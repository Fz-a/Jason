import type { APIRoute } from "astro";
import {
	createSession,
	findUserByUsername,
	requestIsSecure,
	sessionCookieHeader,
	verifyPassword,
} from "@/lib/cms/auth";
import { errorJson, getCmsEnv, json } from "@/lib/cms/env";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
	let body: { username?: string; password?: string };
	try {
		body = (await request.json()) as { username?: string; password?: string };
	} catch {
		return errorJson("Invalid JSON body");
	}

	const password = String(body.password || "");
	if (!password) return errorJson("Password required");

	const secure = requestIsSecure(request);
	const env = getCmsEnv(locals);

	const username =
		String(body.username || "").trim() ||
		env?.CMS_ADMIN_USERNAME ||
		(typeof process !== "undefined" ? process.env.CMS_ADMIN_USERNAME : undefined) ||
		"admin";

	if (env) {
		const user = await findUserByUsername(env.DB, username);
		if (!user || !(await verifyPassword(password, user.password_hash))) {
			return errorJson("Invalid credentials", 401);
		}
		const sessionId = await createSession(env.DB, user.id);
		return json(
			{ ok: true, user: { id: user.id, username: user.username } },
			{ headers: { "Set-Cookie": sessionCookieHeader(sessionId, { secure }) } },
		);
	}

	const { isLocalCmsEnabled, localLogin } = await import("@/lib/cms/local-store");
	if (!isLocalCmsEnabled()) {
		return errorJson("CMS database unavailable (need Cloudflare D1)", 503);
	}
	const result = await localLogin(username, password);
	if (!result) return errorJson("Invalid credentials", 401);
	return json(
		{ ok: true, user: { id: result.id, username: result.username } },
		{
			headers: {
				"Set-Cookie": sessionCookieHeader(result.sessionId, { secure }),
			},
		},
	);
};
