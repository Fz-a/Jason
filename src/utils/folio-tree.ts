import type { GalleryNode, GalleryNodeKind } from "@/types/folioTree";

export function normalizeGalleryNode(n: GalleryNode): GalleryNode {
	const kind: GalleryNodeKind =
		n.kind ?? ((n.children?.length ?? 0) > 0 ? "folder" : "module");
	return {
		...n,
		kind,
		summary: n.summary ?? "",
		body: n.body ?? "",
		children: kind === "folder" ? (n.children ?? []).map(normalizeGalleryNode) : [],
	};
}

export function cloneGalleryNodes(list: GalleryNode[]): GalleryNode[] {
	return list.map(normalizeGalleryNode);
}

export function findGalleryNode(
	list: GalleryNode[],
	id: string,
): GalleryNode | undefined {
	for (const n of list) {
		if (n.id === id) return n;
		const hit = findGalleryNode(n.children ?? [], id);
		if (hit) return hit;
	}
	return undefined;
}

export function updateGalleryAtPath(
	list: GalleryNode[],
	ids: string[],
	fn: (node: GalleryNode) => GalleryNode,
): GalleryNode[] {
	if (ids.length === 0) return list;
	const [head, ...rest] = ids;
	return list.map((n) => {
		if (n.id !== head) return n;
		if (rest.length === 0) return fn(n);
		return {
			...n,
			children: updateGalleryAtPath(n.children ?? [], rest, fn),
		};
	});
}

export function removeGalleryAtPath(
	list: GalleryNode[],
	ids: string[],
): GalleryNode[] {
	if (ids.length === 0) return list;
	const [head, ...rest] = ids;
	if (rest.length === 0) return list.filter((n) => n.id !== head);
	return list.map((n) => {
		if (n.id !== head) return n;
		return { ...n, children: removeGalleryAtPath(n.children ?? [], rest) };
	});
}

export type FolderScene = "ink" | "type" | "circuit" | "grid" | "folio" | "craft";

export function resolveFolderScene(
	sectionId: string,
	title: string,
	index: number,
): FolderScene {
	const t = title.toLowerCase();
	if (/hard|mcu|embed|circuit|sensor|rf/.test(t)) return "circuit";
	if (/soft|code|ai|web|algo/.test(t)) return "grid";
	if (/diy|craft|make|hand|tool/.test(t)) return "craft";
	if (/univ|college|course|lab|thesis/.test(t)) return "folio";
	switch (sectionId) {
		case "knowledge":
			return index % 2 === 0 ? "ink" : "type";
		case "projects":
			return "grid";
		case "works":
			return "folio";
		case "life":
			return "craft";
		default:
			return index % 3 === 0 ? "ink" : "type";
	}
}
