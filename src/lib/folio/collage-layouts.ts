import type { FolioCollage, FolioCollageCell } from "@/types/folioTree";

export type FolioCollageLayout = {
	id: string;
	label: string;
	count: number;
	/** CSS grid-template-areas string (quoted cell names a b c …) */
	areas: string;
	/** grid-template-columns */
	columns: string;
	/** grid-template-rows */
	rows: string;
};

/**
 * Preset mosaics that fill a 16:9 frame.
 * Cell names are always a, b, c… in reading order for `cells[i]`.
 */
export const FOLIO_COLLAGE_LAYOUTS: FolioCollageLayout[] = [
	// —— 2 ——
	{
		id: "2-split",
		label: "左右对半",
		count: 2,
		columns: "1fr 1fr",
		rows: "1fr",
		areas: `"a b"`,
	},
	{
		id: "2-wide-left",
		label: "左宽右窄",
		count: 2,
		columns: "1.45fr 1fr",
		rows: "1fr",
		areas: `"a b"`,
	},
	// —— 3 ——
	{
		id: "3-left-stack",
		label: "左大右双",
		count: 3,
		columns: "1.35fr 1fr",
		rows: "1fr 1fr",
		areas: `
			"a b"
			"a c"
		`,
	},
	{
		id: "3-top-pair",
		label: "上大下双",
		count: 3,
		columns: "1fr 1fr",
		rows: "1.35fr 1fr",
		areas: `
			"a a"
			"b c"
		`,
	},
	// —— 4 ——
	{
		id: "4-grid",
		label: "二乘二",
		count: 4,
		columns: "1fr 1fr",
		rows: "1fr 1fr",
		areas: `
			"a b"
			"c d"
		`,
	},
	{
		id: "4-left-stack",
		label: "左竖右三",
		count: 4,
		columns: "1.25fr 1fr",
		rows: "1fr 1fr 1fr",
		areas: `
			"a b"
			"a c"
			"a d"
		`,
	},
	// —— 5 ——
	{
		id: "5-left-quad",
		label: "左大右四",
		count: 5,
		columns: "1.3fr 1fr 1fr",
		rows: "1fr 1fr",
		areas: `
			"a b c"
			"a d e"
		`,
	},
	{
		id: "5-top-row",
		label: "上三下二",
		count: 5,
		columns: "1fr 1fr 1fr",
		rows: "1fr 1.15fr",
		areas: `
			"a b c"
			"d d e"
		`,
	},
	// —— 6 ——
	{
		id: "6-grid",
		label: "三乘二",
		count: 6,
		columns: "1fr 1fr 1fr",
		rows: "1fr 1fr",
		areas: `
			"a b c"
			"d e f"
		`,
	},
	{
		id: "6-magazine",
		label: "杂志非对称",
		count: 6,
		columns: "1.4fr 1fr 1fr",
		rows: "1.2fr 1fr 1fr",
		areas: `
			"a b c"
			"a d e"
			"a d f"
		`,
	},
];

export const FOLIO_COLLAGE_COUNTS = [2, 3, 4, 5, 6] as const;

export function layoutsForCount(count: number): FolioCollageLayout[] {
	return FOLIO_COLLAGE_LAYOUTS.filter((l) => l.count === count);
}

export function getCollageLayout(id: string | undefined): FolioCollageLayout | undefined {
	if (!id) return undefined;
	return FOLIO_COLLAGE_LAYOUTS.find((l) => l.id === id);
}

export function defaultLayoutForCount(count: number): FolioCollageLayout {
	const list = layoutsForCount(count);
	return list[0] ?? FOLIO_COLLAGE_LAYOUTS[0];
}

export function emptyCells(count: number): FolioCollageCell[] {
	return Array.from({ length: count }, () => ({ src: "" }));
}

export function resizeCells(
	cells: FolioCollageCell[] | undefined,
	count: number,
): FolioCollageCell[] {
	const next = emptyCells(count);
	const prev = cells ?? [];
	for (let i = 0; i < count; i++) {
		if (prev[i]?.src) next[i] = { src: prev[i].src, pos: prev[i].pos };
	}
	return next;
}

export function createCollage(count = 3): FolioCollage {
	const layout = defaultLayoutForCount(count);
	return {
		layout: layout.id,
		cells: emptyCells(layout.count),
	};
}

export function normalizeCollage(raw: unknown): FolioCollage | undefined {
	if (!raw || typeof raw !== "object") return undefined;
	const o = raw as { layout?: unknown; cells?: unknown };
	if (typeof o.layout !== "string") return undefined;
	const layout = getCollageLayout(o.layout);
	if (!layout) return undefined;
	if (!Array.isArray(o.cells)) return undefined;
	const cells = resizeCells(
		o.cells.map((c) => {
			if (!c || typeof c !== "object") return { src: "" };
			const cell = c as { src?: unknown; pos?: unknown };
			return {
				src: typeof cell.src === "string" ? cell.src : "",
				pos: typeof cell.pos === "string" ? cell.pos : undefined,
			};
		}),
		layout.count,
	);
	return { layout: layout.id, cells };
}

export function collageHasImage(collage: FolioCollage | undefined): boolean {
	return !!collage?.cells.some((c) => c.src);
}

/** Thumbnail preview: which grid cells belong to which letter (for editor chrome). */
export function layoutThumbCells(layout: FolioCollageLayout): string[] {
	const names = new Set<string>();
	const tokens = layout.areas.replace(/"/g, " ").trim().split(/\s+/);
	for (const t of tokens) {
		if (/^[a-z]$/.test(t)) names.add(t);
	}
	return [...names].sort();
}
