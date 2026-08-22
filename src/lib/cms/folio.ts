import { normalizeCollage } from "@/lib/folio/collage-layouts";
import type { FolioCollage, GalleryNode, GalleryNodeKind } from "@/types/folioTree";
import { normalizeGalleryNode } from "@/utils/folio-tree";

export type FolioNodeRow = {
	id: string;
	section_id: string;
	parent_id: string | null;
	kind: GalleryNodeKind;
	title: string;
	summary: string;
	body: string;
	cover_media_id: string | null;
	cover_url: string | null;
	cover_pos: string | null;
	collage_json: string | null;
	accent: string | null;
	sort_order: number;
};

function parseCollageJson(raw: string | null | undefined): FolioCollage | undefined {
	if (!raw) return undefined;
	try {
		return normalizeCollage(JSON.parse(raw));
	} catch {
		return undefined;
	}
}

function serializeCollage(collage: FolioCollage | undefined): string | null {
	if (!collage) return null;
	const normalized = normalizeCollage(collage);
	if (!normalized) return null;
	return JSON.stringify(normalized);
}

export function buildTree(rows: FolioNodeRow[]): GalleryNode[] {
	const byParent = new Map<string | null, FolioNodeRow[]>();
	for (const row of rows) {
		const key = row.parent_id;
		const list = byParent.get(key) ?? [];
		list.push(row);
		byParent.set(key, list);
	}
	for (const list of byParent.values()) {
		list.sort((a, b) => a.sort_order - b.sort_order || a.title.localeCompare(b.title));
	}

	function walk(parentId: string | null): GalleryNode[] {
		const kids = byParent.get(parentId) ?? [];
		return kids.map((row) => {
			const kind = row.kind;
			const node: GalleryNode = {
				id: row.id,
				title: row.title,
				summary: row.summary,
				body: row.body,
				accent: row.accent ?? undefined,
				coverSrc: row.cover_url ?? undefined,
				coverPos: row.cover_pos ?? undefined,
				collage: kind === "module" ? parseCollageJson(row.collage_json) : undefined,
				kind,
				children: kind === "folder" ? walk(row.id) : [],
			};
			return normalizeGalleryNode(node);
		});
	}

	return walk(null);
}

export type FlatNode = {
	id: string;
	parent_id: string | null;
	kind: GalleryNodeKind;
	title: string;
	summary: string;
	body: string;
	cover_url: string | null;
	cover_pos: string | null;
	collage_json: string | null;
	accent: string | null;
	sort_order: number;
};

export function flattenTree(nodes: GalleryNode[], parentId: string | null = null): FlatNode[] {
	const out: FlatNode[] = [];
	nodes.forEach((n, i) => {
		const kind: GalleryNodeKind =
			n.kind ?? ((n.children?.length ?? 0) > 0 ? "folder" : "module");
		out.push({
			id: n.id,
			parent_id: parentId,
			kind,
			title: n.title,
			summary: n.summary ?? "",
			body: n.body ?? "",
			cover_url: n.coverSrc || null,
			cover_pos: n.coverPos || null,
			collage_json: kind === "module" ? serializeCollage(n.collage) : null,
			accent: n.accent ?? null,
			sort_order: i,
		});
		if (kind === "folder" && n.children?.length) {
			out.push(...flattenTree(n.children, n.id));
		}
	});
	return out;
}

export async function getSectionTree(
	db: D1Database,
	sectionId: string,
): Promise<GalleryNode[]> {
	const { results } = await db
		.prepare(
			`SELECT id, section_id, parent_id, kind, title, summary, body,
				cover_media_id, cover_url, cover_pos, collage_json, accent, sort_order
			 FROM folio_nodes
			 WHERE section_id = ?
			 ORDER BY sort_order ASC`,
		)
		.bind(sectionId)
		.all<FolioNodeRow>();
	return buildTree(results ?? []);
}

export async function replaceSectionTree(
	db: D1Database,
	sectionId: string,
	nodes: GalleryNode[],
): Promise<GalleryNode[]> {
	const flat = flattenTree(nodes);
	const stmts = [
		db.prepare("DELETE FROM folio_nodes WHERE section_id = ?").bind(sectionId),
		...flat.map((n) =>
			db
				.prepare(
					`INSERT INTO folio_nodes
					 (id, section_id, parent_id, kind, title, summary, body, cover_url, cover_pos, collage_json, accent, sort_order, updated_at)
					 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
				)
				.bind(
					n.id,
					sectionId,
					n.parent_id,
					n.kind,
					n.title,
					n.summary,
					n.body,
					n.cover_url,
					n.cover_pos,
					n.collage_json,
					n.accent,
					n.sort_order,
				),
		),
		db
			.prepare(
				`INSERT INTO folio_section_meta (section_id, updated_at)
				 VALUES (?, datetime('now'))
				 ON CONFLICT(section_id) DO UPDATE SET updated_at = datetime('now')`,
			)
			.bind(sectionId),
	];
	await db.batch(stmts);
	return getSectionTree(db, sectionId);
}

export async function isSectionInitialized(
	db: D1Database,
	sectionId: string,
): Promise<boolean> {
	try {
		const row = await db
			.prepare("SELECT 1 AS ok FROM folio_section_meta WHERE section_id = ?")
			.bind(sectionId)
			.first<{ ok: number }>();
		return !!row;
	} catch {
		// Meta table missing (migration not applied) — fall back to node count
		const c = await countSectionNodes(db, sectionId);
		return c > 0;
	}
}

export async function countSectionNodes(db: D1Database, sectionId: string): Promise<number> {
	const row = await db
		.prepare("SELECT COUNT(*) AS c FROM folio_nodes WHERE section_id = ?")
		.bind(sectionId)
		.first<{ c: number }>();
	return row?.c ?? 0;
}
