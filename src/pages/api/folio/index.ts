import type { APIRoute } from "astro";
import { getSessionIdFromRequest, requireUser } from "@/lib/cms/auth";
import { errorJson, getCmsEnv, json } from "@/lib/cms/env";
import { getSectionTree, isSectionInitialized, replaceSectionTree } from "@/lib/cms/folio";
import { isFolioSection, seedNodesForSection } from "@/lib/cms/seed-nodes";
import type { GalleryNode } from "@/types/folioTree";

export const prerender = false;

function sectionFrom(request: Request, url: URL): string {
	const q = url.searchParams.get("section");
	if (q) return q;
	try {
		const bodyHint = request.headers.get("x-folio-section");
		if (bodyHint) return bodyHint;
	} catch {
		/* ignore */
	}
	return "";
}

export const GET: APIRoute = async ({ request, url, locals }) => {
	const section = sectionFrom(request, url);
	if (!isFolioSection(section)) return errorJson("Unknown section (pass ?section=)", 404);

	const env = getCmsEnv(locals);
	if (env) {
		try {
			const nodes = await getSectionTree(env.DB, section);
			const initialized = await isSectionInitialized(env.DB, section);
			if (nodes.length === 0 && !initialized) {
				return json({
					section,
					source: "config",
					nodes: seedNodesForSection(section),
				});
			}
			return json({ section, source: "db", nodes });
		} catch {
			return json({ section, source: "config", nodes: seedNodesForSection(section) });
		}
	}

	const { isLocalCmsEnabled, localGetTree } = await import("@/lib/cms/local-store");
	if (isLocalCmsEnabled()) {
		return json({ section, source: "local", nodes: localGetTree(section) });
	}
	return json({ section, source: "config", nodes: seedNodesForSection(section) });
};

export const PUT: APIRoute = async ({ request, url, locals }) => {
	const section = sectionFrom(request, url);
	if (!isFolioSection(section)) return errorJson("Unknown section (pass ?section=)", 404);

	let body: { nodes?: GalleryNode[]; section?: string };
	try {
		body = (await request.json()) as { nodes?: GalleryNode[]; section?: string };
	} catch {
		return errorJson("Invalid JSON body");
	}
	const sec = isFolioSection(section) ? section : String(body.section || "");
	if (!isFolioSection(sec)) return errorJson("Unknown section", 404);
	if (!Array.isArray(body.nodes)) return errorJson("nodes array required");

	const env = getCmsEnv(locals);
	if (env) {
		const auth = await requireUser(env.DB, request);
		if (auth instanceof Response) return auth;
		const nodes = await replaceSectionTree(env.DB, sec, body.nodes);
		return json({ section: sec, source: "db", nodes });
	}

	const { isLocalCmsEnabled, localGetUser, localPutTree } = await import(
		"@/lib/cms/local-store"
	);
	if (!isLocalCmsEnabled()) {
		return errorJson("CMS database unavailable (need Cloudflare D1)", 503);
	}
	const user = localGetUser(getSessionIdFromRequest(request));
	if (!user) return errorJson("Unauthorized", 401);
	const nodes = localPutTree(sec, body.nodes);
	return json({ section: sec, source: "local", nodes });
};
