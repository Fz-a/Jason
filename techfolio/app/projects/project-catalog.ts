/**
 * Single source of truth for Projects stage membership & order.
 * FeaturedProjects (site) and Studio (editor) both consume this.
 *
 * Default membership comes from showcase arrays.
 * Display order / group / hidden come from content/project-order.json
 * (Studio drag-reorder writes that file via /api/catalog).
 */
import projectOrderFile from "../../content/project-order.json";
import { makeEssay } from "./make-essay";
import { societyShowcases } from "./society-showcases";
import { universityProjectShowcases } from "./university-showcases";
import { workCompanies, workShowcases } from "./work-showcases";

export type ProjectCatalogGroup = "work" | "university" | "diy" | "society";

export type ProjectCatalogKind =
	| "showcase"
	| "company"
	| "helmet"
	| "diy";

export type ProjectCatalogEntry = {
	id: string;
	group: ProjectCatalogGroup;
	kind: ProjectCatalogKind;
};

export type ProjectOrderFile = {
	order: string[];
	hidden: string[];
	/** Optional group overrides vs default membership (id → group). */
	groups?: Record<string, ProjectCatalogGroup>;
};

/** Studio sidebar labels (zh) ↔ site group ids */
export const PROJECT_GROUP_LABEL_ZH: Record<ProjectCatalogGroup, string> = {
	work: "工作",
	university: "大学",
	diy: "造物",
	society: "社会",
};

export const PROJECT_GROUP_ZH_TO_ID: Record<string, ProjectCatalogGroup> = {
	工作: "work",
	大学: "university",
	造物: "diy",
	社会: "society",
};

export const PROJECT_GROUP_ORDER: ProjectCatalogGroup[] = [
	"work",
	"university",
	"diy",
	"society",
];

const GROUP_IDS = new Set<ProjectCatalogGroup>(PROJECT_GROUP_ORDER);

export function isProjectCatalogGroup(v: string): v is ProjectCatalogGroup {
	return GROUP_IDS.has(v as ProjectCatalogGroup);
}

/** Membership in source-array order (site default before any order file). */
export function defaultProjectCatalog(): ProjectCatalogEntry[] {
	const entries: ProjectCatalogEntry[] = [];

	for (const item of workShowcases) {
		entries.push({ id: item.id, group: "work", kind: "showcase" });
	}
	for (const company of workCompanies) {
		if (company.id === "moore") continue;
		if (workShowcases.some((w) => w.id === company.id)) continue;
		entries.push({ id: company.id, group: "work", kind: "company" });
	}

	for (const item of universityProjectShowcases) {
		entries.push({ id: item.id, group: "university", kind: "showcase" });
	}

	if (makeEssay.some((b) => b.type === "helmet")) {
		entries.push({ id: "smart-helmet", group: "diy", kind: "helmet" });
	}
	if (makeEssay.some((b) => b.type === "diy-wall")) {
		entries.push({ id: "diy-wall", group: "diy", kind: "diy" });
	}

	for (const item of societyShowcases) {
		entries.push({ id: item.id, group: "society", kind: "showcase" });
	}

	return entries;
}

function normalizeGroups(
	raw: Record<string, string> | undefined,
): Record<string, ProjectCatalogGroup> {
	if (!raw) return {};
	const out: Record<string, ProjectCatalogGroup> = {};
	for (const [id, g] of Object.entries(raw)) {
		if (isProjectCatalogGroup(g)) out[id] = g;
	}
	return out;
}

export function applyProjectOrder(
	base: ProjectCatalogEntry[],
	orderFile: ProjectOrderFile | null | undefined,
): ProjectCatalogEntry[] {
	const hidden = new Set(orderFile?.hidden ?? []);
	const groupOverrides = normalizeGroups(orderFile?.groups);
	const byId = new Map(
		base.map((e) => [
			e.id,
			groupOverrides[e.id] ? { ...e, group: groupOverrides[e.id]! } : e,
		]),
	);
	const ordered: ProjectCatalogEntry[] = [];
	const seen = new Set<string>();

	for (const id of orderFile?.order ?? []) {
		if (hidden.has(id) || seen.has(id)) continue;
		const e = byId.get(id);
		if (!e) continue;
		ordered.push(e);
		seen.add(id);
	}
	for (const e of byId.values()) {
		if (hidden.has(e.id) || seen.has(e.id)) continue;
		ordered.push(e);
		seen.add(e.id);
	}
	return ordered;
}

/** Ordered catalog for site + Studio — shared order file. */
export function listProjectCatalog(
	override?: Partial<ProjectOrderFile> | null,
): ProjectCatalogEntry[] {
	const file = projectOrderFile as ProjectOrderFile;
	return applyProjectOrder(defaultProjectCatalog(), {
		order: override?.order ?? file.order ?? [],
		hidden: override?.hidden ?? file.hidden ?? [],
		groups: override?.groups ?? file.groups ?? {},
	});
}

/** Build order payload from a Studio catalog list (builtins only). */
export function orderIdsFromCatalog(
	items: { id: string; source?: string }[],
): string[] {
	return items
		.filter((e) => e.source !== "custom" && !e.id.startsWith("custom_"))
		.map((e) => e.id);
}

/**
 * Group overrides vs default membership.
 * Only ids whose Studio/zh group differs from the default are stored.
 */
export function groupOverridesFromCatalog(
	items: { id: string; group: string; source?: string }[],
): Record<string, ProjectCatalogGroup> {
	const defaults = new Map(
		defaultProjectCatalog().map((e) => [e.id, e.group]),
	);
	const out: Record<string, ProjectCatalogGroup> = {};
	for (const item of items) {
		if (item.source === "custom" || item.id.startsWith("custom_")) continue;
		const zh = item.group;
		const gid = PROJECT_GROUP_ZH_TO_ID[zh];
		if (!gid) continue;
		const def = defaults.get(item.id);
		if (def && gid !== def) out[item.id] = gid;
	}
	return out;
}
