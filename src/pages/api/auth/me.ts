import type { APIRoute } from "astro";
import { getSessionIdFromRequest, getUserFromSession } from "@/lib/cms/auth";
import { getCmsEnv, json } from "@/lib/cms/env";

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
	const env = getCmsEnv(locals);
	if (env) {
		const user = await getUserFromSession(env.DB, getSessionIdFromRequest(request));
		if (!user) return json({ authenticated: false, cms: true, backend: "d1" });
		return json({ authenticated: true, cms: true, backend: "d1", user });
	}

	const { isLocalCmsEnabled, localGetUser } = await import("@/lib/cms/local-store");
	if (!isLocalCmsEnabled()) {
		return json({ authenticated: false, cms: false, backend: null });
	}
	const user = localGetUser(getSessionIdFromRequest(request));
	if (!user) return json({ authenticated: false, cms: true, backend: "local" });
	return json({ authenticated: true, cms: true, backend: "local", user });
};
