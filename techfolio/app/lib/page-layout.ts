
export const PAGE_SECTION_IDS = [
	"home",
	"about",
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
		hint: "Home hero",
		fields: [
			{ key: "hero.headline", label: "Headline", multiline: true, role: "display" },
			{ key: "hero.blurb", label: "Intro", multiline: true, role: "body" },
			{ key: "hero.role", label: "Role", role: "label" },
			{ key: "hero.hello", label: "Greeting", role: "label" },
			{ key: "hero.contact", label: "Button", role: "label" },
		],
	},
	{
		id: "about",
		label: "About",
		hint: "Personal intro (second slide)",
		fields: [
			{ key: "about.kicker", label: "Kicker", role: "label" },
			{ key: "about.heading", label: "Heading", role: "display" },
			{ key: "about.body1", label: "Body 1", multiline: true, role: "body" },
			{ key: "about.body2", label: "Body 2", multiline: true, role: "body" },
		],
	},
	{
		id: "agenda",
		label: "Agenda",
		hint: "Agenda overview",
		fields: [
			{ key: "agenda.word", label: "Display word", role: "display" },
			{ key: "agenda.title", label: "Heading", role: "title" },
			{ key: "agenda.blurb", label: "Caption", multiline: true, role: "body" },
			{ key: "agenda.c1.title", label: "01 Heading", role: "title" },
			{ key: "agenda.c1.blurb", label: "01 Caption", multiline: true, role: "body" },
			{ key: "agenda.c2.title", label: "02 Heading", role: "title" },
			{ key: "agenda.c2.blurb", label: "02 Caption", multiline: true, role: "body" },
			{ key: "agenda.c3.title", label: "03 Heading", role: "title" },
			{ key: "agenda.c3.blurb", label: "03 Caption", multiline: true, role: "body" },
			{ key: "agenda.c4.title", label: "04 Heading", role: "title" },
			{ key: "agenda.c4.blurb", label: "04 Caption", multiline: true, role: "body" },
		],
	},
	{
		id: "experience",
		label: "Projects",
		hint: "Project wall (detail data)",
		fields: [
			{ key: "core.kicker", label: "Kicker", role: "label" },
			{ key: "core.title", label: "Heading", role: "display" },
			{ key: "core.blurb", label: "Caption", multiline: true, role: "body" },
		],
	},
	{
		id: "research",
		label: "Explore",
		hint: "Research directions",
		fields: [
			{ key: "research.kicker", label: "Kicker", role: "label" },
			{ key: "research.title", label: "Heading", role: "display" },
			{ key: "research.d1.title", label: "01 Heading", role: "title" },
			{ key: "research.d1.body", label: "01 Body", multiline: true, role: "body" },
			{ key: "research.d2.title", label: "02 Heading", role: "title" },
			{ key: "research.d2.body", label: "02 Body", multiline: true, role: "body" },
			{ key: "research.d3.title", label: "03 Heading", role: "title" },
			{ key: "research.d3.body", label: "03 Body", multiline: true, role: "body" },
			{ key: "research.d4.title", label: "04 Heading", role: "title" },
			{ key: "research.d4.body", label: "04 Body", multiline: true, role: "body" },
			{ key: "research.q.kicker", label: "Question kicker", role: "label" },
			{ key: "research.q.body", label: "Research question", multiline: true, role: "title" },
		],
	},
	{
		id: "goal",
		label: "Goal",
		hint: "Goal",
		fields: [
			{ key: "goal.kicker", label: "Kicker", role: "label" },
			{ key: "goal.headline", label: "Headline", role: "display" },
			{ key: "goal.lede", label: "Sub-copy", multiline: true, role: "body" },
			{ key: "goal.path.current", label: "01 Kicker", role: "label" },
			{ key: "goal.current.dest", label: "01 Heading", role: "title" },
			{ key: "goal.path.grad", label: "02 Kicker", role: "label" },
			{ key: "goal.grad.title", label: "02 Heading", role: "title" },
			{ key: "goal.path.vision", label: "03 Kicker", role: "label" },
			{ key: "goal.flag.vision.blurb", label: "03 Left column", role: "title" },
			{ key: "goal.vision.title", label: "Vision title", multiline: true, role: "title" },
			{ key: "goal.panel.vision.p1", label: "Vision p1", multiline: true, role: "body" },
			{ key: "goal.panel.vision.p2", label: "Vision p2", multiline: true, role: "body" },
			{ key: "goal.panel.vision.p3", label: "Vision p3", multiline: true, role: "body" },
			{ key: "goal.panel.vision.p4", label: "Vision p4", multiline: true, role: "body" },
		],
	},
	{
		id: "next",
		label: "Next Step",
		hint: "Next steps",
		fields: [
			{ key: "next.kicker", label: "Kicker", role: "label" },
			{ key: "next.title", label: "Headline", role: "display" },
			{ key: "next.sub", label: "Subtitle", role: "title" },
			{ key: "next.blurb", label: "Caption", multiline: true, role: "body" },
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
		hint: "Contact",
		fields: [
			{ key: "contact.kicker", label: "Kicker", role: "label" },
			{ key: "hero.role", label: "Role (shared)", role: "title" },
			{ key: "nav.cv", label: "Resume copy", role: "label" },
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
	copy: Record<string, string>;
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

	// Older files nested overrides per locale; only the English bag is read.
	const rawCopy = (data.copy ?? {}) as Record<string, unknown>;
	const legacy = rawCopy.en;
	const source =
		typeof legacy === "object" && legacy !== null
			? (legacy as Record<string, unknown>)
			: rawCopy;
	const copy: Record<string, string> = {};
	for (const [k, v] of Object.entries(source)) {
		if (typeof v === "string") copy[k] = v;
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
