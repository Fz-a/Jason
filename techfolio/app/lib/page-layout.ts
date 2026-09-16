import type { Locale } from "./i18n";

export const PAGE_SECTION_IDS = [
	"home",
	"agenda",
	"experience",
	"research",
	"goal",
	"next",
	"contact",
] as const;

export type PageSectionId = (typeof PAGE_SECTION_IDS)[number];

export type PageField = {
	key: string;
	label: string;
	multiline?: boolean;
	/** Visual weight in the editor artboard */
	role?: "display" | "title" | "body" | "label";
};

export type PageSectionMeta = {
	id: PageSectionId;
	label: string;
	hint: string;
	fields: PageField[];
};

export const PAGE_SECTIONS: PageSectionMeta[] = [
	{
		id: "home",
		label: "Home",
		hint: "首页 Hero",
		fields: [
			{ key: "hero.headline", label: "主标题", multiline: true, role: "display" },
			{ key: "hero.blurb", label: "简介", multiline: true, role: "body" },
			{ key: "hero.role", label: "角色", role: "label" },
			{ key: "hero.hello", label: "问候", role: "label" },
			{ key: "hero.contact", label: "按钮", role: "label" },
		],
	},
	{
		id: "agenda",
		label: "Agenda",
		hint: "议程总览",
		fields: [
			{ key: "agenda.word", label: "大词", role: "display" },
			{ key: "agenda.title", label: "标题", role: "title" },
			{ key: "agenda.blurb", label: "说明", multiline: true, role: "body" },
			{ key: "agenda.c1.title", label: "01 标题", role: "title" },
			{ key: "agenda.c1.blurb", label: "01 说明", multiline: true, role: "body" },
			{ key: "agenda.c2.title", label: "02 标题", role: "title" },
			{ key: "agenda.c2.blurb", label: "02 说明", multiline: true, role: "body" },
			{ key: "agenda.c3.title", label: "03 标题", role: "title" },
			{ key: "agenda.c3.blurb", label: "03 说明", multiline: true, role: "body" },
			{ key: "agenda.c4.title", label: "04 标题", role: "title" },
			{ key: "agenda.c4.blurb", label: "04 说明", multiline: true, role: "body" },
		],
	},
	{
		id: "experience",
		label: "Projects",
		hint: "项目墙（内容走详情库）",
		fields: [
			{ key: "core.kicker", label: "Kicker", role: "label" },
			{ key: "core.title", label: "标题", role: "display" },
			{ key: "core.blurb", label: "说明", multiline: true, role: "body" },
		],
	},
	{
		id: "research",
		label: "Explore",
		hint: "研究方向",
		fields: [
			{ key: "research.kicker", label: "Kicker", role: "label" },
			{ key: "research.title", label: "标题", role: "display" },
			{ key: "research.d1.title", label: "01 标题", role: "title" },
			{ key: "research.d1.body", label: "01 正文", multiline: true, role: "body" },
			{ key: "research.d2.title", label: "02 标题", role: "title" },
			{ key: "research.d2.body", label: "02 正文", multiline: true, role: "body" },
			{ key: "research.d3.title", label: "03 标题", role: "title" },
			{ key: "research.d3.body", label: "03 正文", multiline: true, role: "body" },
			{ key: "research.d4.title", label: "04 标题", role: "title" },
			{ key: "research.d4.body", label: "04 正文", multiline: true, role: "body" },
			{ key: "research.q.kicker", label: "问题标签", role: "label" },
			{ key: "research.q.body", label: "研究问题", multiline: true, role: "title" },
		],
	},
	{
		id: "goal",
		label: "Goal",
		hint: "目标页",
		fields: [
			{ key: "goal.kicker", label: "Kicker", role: "label" },
			{ key: "goal.headline", label: "主标题", role: "display" },
			{ key: "goal.lede", label: "副文", multiline: true, role: "body" },
			{ key: "goal.path.current", label: "01 标签", role: "label" },
			{ key: "goal.current.dest", label: "01 标题", role: "title" },
			{ key: "goal.path.grad", label: "02 标签", role: "label" },
			{ key: "goal.grad.title", label: "02 标题", role: "title" },
			{ key: "goal.path.vision", label: "03 标签", role: "label" },
			{ key: "goal.flag.vision.blurb", label: "03 左侧", role: "title" },
			{ key: "goal.vision.title", label: "Vision 标题", multiline: true, role: "title" },
			{ key: "goal.panel.vision.p1", label: "Vision p1", multiline: true, role: "body" },
			{ key: "goal.panel.vision.p2", label: "Vision p2", multiline: true, role: "body" },
			{ key: "goal.panel.vision.p3", label: "Vision p3", multiline: true, role: "body" },
			{ key: "goal.panel.vision.p4", label: "Vision p4", multiline: true, role: "body" },
		],
	},
	{
		id: "next",
		label: "Next Step",
		hint: "下一步",
		fields: [
			{ key: "next.kicker", label: "Kicker", role: "label" },
			{ key: "next.title", label: "主标题", role: "display" },
			{ key: "next.sub", label: "副标题", role: "title" },
			{ key: "next.blurb", label: "说明", multiline: true, role: "body" },
			{ key: "next.s1.title", label: "01", role: "title" },
			{ key: "next.s2.title", label: "02", role: "title" },
			{ key: "next.s3.title", label: "03", role: "title" },
			{ key: "next.s4.title", label: "04", role: "title" },
			{ key: "next.s5.title", label: "05", role: "title" },
			{ key: "next.s6.title", label: "06", role: "title" },
		],
	},
	{
		id: "contact",
		label: "Contact",
		hint: "联系页",
		fields: [
			{ key: "contact.kicker", label: "Kicker", role: "label" },
			{ key: "hero.role", label: "角色（共用）", role: "title" },
			{ key: "nav.cv", label: "简历文案", role: "label" },
		],
	},
];

export type SectionLayout = {
	scale: number;
	offsetY: number;
	offsetX: number;
	padTop: number;
};

/** Per-text-component layout (i18n key → box). */
export type ElementLayout = {
	/** Font size multiplier (1 = 100%). */
	fontScale: number;
	/** Horizontal nudge in rem. */
	offsetX: number;
	/** Vertical nudge in rem. */
	offsetY: number;
	/** Max width in rem; 0 = auto. */
	maxWidth: number;
};

export type PageLayoutFile = {
	version: 1;
	order: PageSectionId[];
	hidden: PageSectionId[];
	sections: Partial<Record<PageSectionId, SectionLayout>>;
	/** Fine-grained text widgets. */
	elements: Record<string, ElementLayout>;
	copy: Partial<Record<Locale, Record<string, string>>>;
};

export const DEFAULT_SECTION_LAYOUT: SectionLayout = {
	scale: 1,
	offsetY: 0,
	offsetX: 0,
	padTop: 0,
};

export const DEFAULT_ELEMENT_LAYOUT: ElementLayout = {
	fontScale: 1,
	offsetX: 0,
	offsetY: 0,
	maxWidth: 0,
};

export function defaultPageLayout(): PageLayoutFile {
	return {
		version: 1,
		order: [...PAGE_SECTION_IDS],
		hidden: [],
		sections: {},
		elements: {},
		copy: {},
	};
}

export function isPageSectionId(id: string): id is PageSectionId {
	return (PAGE_SECTION_IDS as readonly string[]).includes(id);
}

export function normalizePageLayout(raw: unknown): PageLayoutFile {
	const base = defaultPageLayout();
	if (!raw || typeof raw !== "object") return base;
	const data = raw as Partial<PageLayoutFile>;

	const order = Array.isArray(data.order)
		? data.order.filter(isPageSectionId)
		: [];
	const missing = PAGE_SECTION_IDS.filter((id) => !order.includes(id));
	const normalizedOrder = [...order, ...missing];

	const hidden = Array.isArray(data.hidden)
		? data.hidden.filter(isPageSectionId)
		: [];

	const sections: PageLayoutFile["sections"] = {};
	if (data.sections && typeof data.sections === "object") {
		for (const id of PAGE_SECTION_IDS) {
			const s = data.sections[id];
			if (!s || typeof s !== "object") continue;
			sections[id] = {
				scale: clampNum(s.scale, 0.7, 1.35, 1),
				offsetY: clampNum(s.offsetY, -12, 12, 0),
				offsetX: clampNum(s.offsetX, -8, 8, 0),
				padTop: clampNum(s.padTop, -8, 16, 0),
			};
		}
	}

	const elements: Record<string, ElementLayout> = {};
	if (data.elements && typeof data.elements === "object") {
		for (const [key, rawEl] of Object.entries(data.elements)) {
			if (!rawEl || typeof rawEl !== "object") continue;
			const el = rawEl as Partial<ElementLayout>;
			elements[key] = {
				fontScale: clampNum(el.fontScale, 0.55, 2.4, 1),
				offsetX: clampNum(el.offsetX, -24, 24, 0),
				offsetY: clampNum(el.offsetY, -24, 24, 0),
				maxWidth: clampNum(el.maxWidth, 0, 48, 0),
			};
		}
	}

	const copy: PageLayoutFile["copy"] = {};
	if (data.copy && typeof data.copy === "object") {
		for (const loc of ["en", "zh-Hans", "zh-Hant"] as Locale[]) {
			const bag = data.copy[loc];
			if (!bag || typeof bag !== "object") continue;
			const out: Record<string, string> = {};
			for (const [k, v] of Object.entries(bag)) {
				if (typeof v === "string") out[k] = v;
			}
			if (Object.keys(out).length) copy[loc] = out;
		}
	}

	return {
		version: 1,
		order: normalizedOrder,
		hidden,
		sections,
		elements,
		copy,
	};
}

function clampNum(
	n: unknown,
	min: number,
	max: number,
	fallback: number,
): number {
	if (typeof n !== "number" || Number.isNaN(n)) return fallback;
	return Math.min(max, Math.max(min, n));
}

export function sectionLayoutOf(
	layout: PageLayoutFile,
	id: PageSectionId,
): SectionLayout {
	return { ...DEFAULT_SECTION_LAYOUT, ...layout.sections[id] };
}

export function elementLayoutOf(
	layout: PageLayoutFile,
	key: string,
): ElementLayout {
	return { ...DEFAULT_ELEMENT_LAYOUT, ...layout.elements[key] };
}

export function visibleOrder(layout: PageLayoutFile): PageSectionId[] {
	return layout.order.filter((id) => !layout.hidden.includes(id));
}

export function sectionStyle(layout: SectionLayout): Record<string, string> {
	const style: Record<string, string> = {
		"--page-zoom": String(layout.scale),
		transform: `translate(${layout.offsetX}rem, ${layout.offsetY}vh)`,
	};
	if (layout.padTop) style.paddingTop = `${layout.padTop}vh`;
	return style;
}

export function elementStyle(layout: ElementLayout): Record<string, string> {
	const style: Record<string, string> = {};
	if (layout.fontScale !== 1) {
		style.fontSize = `${layout.fontScale}em`;
	}
	if (layout.offsetX || layout.offsetY) {
		style.transform = `translate(${layout.offsetX}rem, ${layout.offsetY}rem)`;
		style.display = "inline-block";
	}
	if (layout.maxWidth > 0) {
		style.maxWidth = `${layout.maxWidth}rem`;
		style.display = style.display || "inline-block";
	}
	return style;
}
