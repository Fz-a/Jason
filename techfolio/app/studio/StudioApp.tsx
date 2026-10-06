"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { BriefDocument } from "../components/BriefDocument";
import { briefFromShowcase } from "../lib/brief-from-legacy";
import {
	createEmptyBlock,
	newBlockId,
	type BriefBlock,
	type BriefDoc,
	type BriefImage,
	type BriefStore,
} from "../lib/brief-types";
import {
	IMAGE_FOCUS_MAX,
	IMAGE_FOCUS_MIN,
	clampFocus,
	imageFocusStyle,
	normalizeImageFocus,
	panLimit,
	withFocus,
} from "../lib/image-focus";
import { makeEssay } from "../projects/make-essay";
import {
	groupOverridesFromCatalog,
	listProjectCatalog,
	orderIdsFromCatalog,
	PROJECT_GROUP_LABEL,
	PROJECT_GROUP_ORDER,
	PROJECT_GROUP_LABEL_TO_ID,
	type ProjectCatalogGroup,
} from "../projects/project-catalog";
import { universityProjectShowcases } from "../projects/university-showcases";
import { societyShowcases } from "../projects/society-showcases";
import { workCompanies, workShowcases } from "../projects/work-showcases";
import seedBriefs from "../../content/briefs.json";
import mediaList from "../../content/media.json";
import {
	AvatarEditor,
	type AvatarEditorHandle,
	type AvatarPreview,
} from "./AvatarEditor";
import { PageLayoutEditor } from "./PageLayoutEditor";

type CatalogEntry = {
	id: string;
	title: string;
	group: string;
	source: "showcase" | "company" | "helmet" | "diy" | "custom";
};

type CatalogPersist = {
	items: CatalogEntry[];
	hidden: string[];
	/** Shared with site via content/project-order.json */
	order?: string[];
	/** id → en group id (work/university/diy/society) */
	groups?: Record<string, ProjectCatalogGroup>;
	/** Highlighted project ids (star in site nav). */
	starred?: string[];
	customs?: CatalogEntry[];
};

const CATALOG_LS_KEY = "techfolio-studio-catalog-v4";
const LONG_PRESS_MS = 360;
/** Must match FeaturedProjects groups via project-catalog */
const GROUPS = PROJECT_GROUP_ORDER.map((g) => PROJECT_GROUP_LABEL[g]);

function catalogTitle(id: string, kind: CatalogEntry["source"]): string {
	if (kind === "company") {
		return workCompanies.find((c) => c.id === id)?.company ?? id;
	}
	if (kind === "helmet") {
		return makeEssay.find((b) => b.type === "helmet")?.title ?? id;
	}
	if (kind === "diy") {
		return makeEssay.find((b) => b.type === "diy-wall")?.title ?? id;
	}
	const showcase = [
		...workShowcases,
		...universityProjectShowcases,
		...societyShowcases,
	].find((s) => s.id === id);
	return showcase?.title ?? id;
}

function buildCatalog(
	override?: {
		order?: string[];
		hidden?: string[];
		groups?: Record<string, ProjectCatalogGroup>;
		starred?: string[];
	} | null,
): CatalogEntry[] {
	return listProjectCatalog(override).map((e) => ({
		id: e.id,
		title: catalogTitle(e.id, e.kind),
		group: PROJECT_GROUP_LABEL[e.group],
		source: e.kind,
	}));
}

/**
 * Built-in membership from site catalog; order/group/hidden/starred from shared file.
 * Customs stay Studio-only.
 */
function hydrateCatalog(persist: CatalogPersist | null): {
	items: CatalogEntry[];
	hidden: string[];
	starred: string[];
} {
	const order =
		persist?.order?.length && persist.order.length > 0
			? persist.order
			: undefined;
	const hiddenList = persist?.hidden ?? [];
	const starredList = (persist?.starred ?? []).filter(
		(id) => typeof id === "string",
	);

	// Prefer explicit groups map; else migrate zh groups from items
	let groups = persist?.groups;
	if (!groups || Object.keys(groups).length === 0) {
		const migrated: Record<string, ProjectCatalogGroup> = {};
		for (const raw of persist?.items ?? []) {
			if (!raw?.id || raw.source === "custom") continue;
			const gid = PROJECT_GROUP_LABEL_TO_ID[raw.group];
			if (gid) migrated[raw.id] = gid;
		}
		if (Object.keys(migrated).length > 0) groups = migrated;
	}

	const base = buildCatalog({
		order,
		hidden: hiddenList,
		groups,
		starred: starredList,
	});
	const byId = new Map<string, CatalogEntry>(base.map((e) => [e.id, e]));

	const customs: CatalogEntry[] = [];
	for (const c of persist?.customs ?? []) {
		if (!c?.id) continue;
		customs.push({
			id: c.id,
			title: c.title || "Untitled",
			group: GROUPS.includes(c.group) ? c.group : "Work",
			source: "custom",
		});
	}
	for (const raw of persist?.items ?? []) {
		if (!raw?.id) continue;
		if (raw.source === "custom" || raw.id.startsWith("custom_")) {
			if (customs.some((c) => c.id === raw.id)) continue;
			customs.push({
				id: raw.id,
				title: raw.title || "Untitled",
				group: GROUPS.includes(raw.group) ? raw.group : "Work",
				source: "custom",
			});
		}
	}

	const hidden = new Set(hiddenList);
	for (const id of [...hidden]) {
		if (!byId.has(id) && !id.startsWith("custom_")) hidden.delete(id);
	}

	const starred = new Set(starredList);
	for (const id of [...starred]) {
		if (!byId.has(id) && !customs.some((c) => c.id === id)) starred.delete(id);
	}

	const items = [
		...base.filter((e) => !hidden.has(e.id)),
		...customs.filter((e) => !hidden.has(e.id)),
	];
	return { items, hidden: [...hidden], starred: [...starred] };
}

function blankDoc(id: string, title: string, group: string): BriefDoc {
	return {
		id,
		title,
		subtitle: "",
		section: group,
		blocks: [
			{ id: newBlockId(), type: "kicker", text: group },
			{ id: newBlockId(), type: "heading", text: title },
			{ id: newBlockId(), type: "text", text: "Start writing here." },
		],
	};
}

function lookupDefaultCardImage(id: string): BriefImage | undefined {
	const showcase = [
		...workShowcases,
		...universityProjectShowcases,
		...societyShowcases,
	].find((s) => s.id === id);
	if (showcase?.cardImage) {
		return { src: showcase.cardImage.src, alt: showcase.cardImage.alt };
	}
	const company = workCompanies.find((c) => c.id === id);
	if (company) {
		return { src: company.image.src, alt: company.image.alt };
	}
	if (id === "smart-helmet") {
		const h = makeEssay.find((b) => b.type === "helmet");
		if (h && h.type === "helmet" && h.images[0]) {
			return { src: h.images[0].src, alt: h.images[0].alt };
		}
	}
	if (id === "make-diy" || id === "diy-wall") {
		const diy = makeEssay.find((b) => b.type === "diy-wall");
		if (diy && diy.type === "diy-wall") {
			const shot = diy.items[4]?.image ?? diy.items[0]?.image;
			if (shot) return { src: shot.src, alt: shot.alt };
		}
	}
	return undefined;
}

/** Ensure docs always carry a homepage cover when a showcase default exists. */
function withCardImage(doc: BriefDoc): BriefDoc {
	if (doc.cardImage?.src) return doc;
	const fallback = lookupDefaultCardImage(doc.id);
	return fallback ? { ...doc, cardImage: fallback } : doc;
}

function toPersist(
	items: CatalogEntry[],
	hidden: string[],
	starred: string[],
): CatalogPersist {
	const customs = items.filter(
		(e) => e.source === "custom" || e.id.startsWith("custom_"),
	);
	return {
		items: items.map((e) => ({
			id: e.id,
			title: e.title,
			group: e.group,
			source: e.source,
		})),
		hidden,
		starred,
		order: orderIdsFromCatalog(items),
		groups: groupOverridesFromCatalog(items),
		customs,
	};
}

function moveCatalogItem(
	items: CatalogEntry[],
	fromId: string,
	toId: string,
	place: "before" | "after",
): CatalogEntry[] {
	if (fromId === toId) return items;
	const from = items.findIndex((e) => e.id === fromId);
	const to = items.findIndex((e) => e.id === toId);
	if (from < 0 || to < 0) return items;
	const moved = items[from]!;
	const target = items[to]!;
	const next = [...items];
	next.splice(from, 1);
	const updated = { ...moved, group: target.group };
	let insertAt = next.findIndex((e) => e.id === toId);
	if (insertAt < 0) return items;
	if (place === "after") insertAt += 1;
	next.splice(insertAt, 0, updated);
	return next;
}

/** Move item into a group (append). Used for empty-group drops. */
function moveCatalogItemToGroup(
	items: CatalogEntry[],
	fromId: string,
	group: string,
): CatalogEntry[] {
	const from = items.findIndex((e) => e.id === fromId);
	if (from < 0) return items;
	const moved = items[from]!;
	if (moved.group === group) return items;
	const next = items.filter((e) => e.id !== fromId);
	const lastInGroup = [...next].reverse().findIndex((e) => e.group === group);
	const updated = { ...moved, group };
	if (lastInGroup < 0) {
		// Insert before first item of next group, or at end
		const groupIdx = GROUPS.indexOf(group as (typeof GROUPS)[number]);
		let insertAt = next.length;
		for (let i = groupIdx + 1; i < GROUPS.length; i++) {
			const g = GROUPS[i]!;
			const idx = next.findIndex((e) => e.group === g);
			if (idx >= 0) {
				insertAt = idx;
				break;
			}
		}
		next.splice(insertAt, 0, updated);
	} else {
		const idxFromEnd = lastInGroup;
		const insertAt = next.length - idxFromEnd;
		next.splice(insertAt, 0, updated);
	}
	return next;
}

function CatalogNav({
	items,
	activeId,
	starredIds,
	onSelect,
	onReorder,
	onMoveToGroup,
	onAdd,
	onRemove,
	onToggleStar,
}: {
	items: CatalogEntry[];
	activeId: string;
	starredIds: string[];
	onSelect: (id: string) => void;
	onReorder: (
		fromId: string,
		toId: string,
		place: "before" | "after",
	) => void;
	onMoveToGroup: (fromId: string, group: string) => void;
	onAdd: (group: string) => void;
	onRemove: (id: string) => void;
	onToggleStar: (id: string) => void;
}) {
	const [dragId, setDragId] = useState<string | null>(null);
	const [over, setOver] = useState<{
		id: string;
		place: "before" | "after";
	} | null>(null);
	const [overGroup, setOverGroup] = useState<string | null>(null);
	const pressTimer = useRef<number | null>(null);
	const dragIdRef = useRef<string | null>(null);
	const overRef = useRef<{ id: string; place: "before" | "after" } | null>(
		null,
	);
	const overGroupRef = useRef<string | null>(null);
	const didDrag = useRef(false);
	const suppressClick = useRef(false);

	const clearPress = () => {
		if (pressTimer.current != null) {
			window.clearTimeout(pressTimer.current);
			pressTimer.current = null;
		}
	};

	const endDrag = () => {
		clearPress();
		dragIdRef.current = null;
		overRef.current = null;
		overGroupRef.current = null;
		setDragId(null);
		setOver(null);
		setOverGroup(null);
		didDrag.current = false;
	};

	const setOverState = (v: { id: string; place: "before" | "after" } | null) => {
		overRef.current = v;
		setOver(v);
		if (v) {
			overGroupRef.current = null;
			setOverGroup(null);
		}
	};

	const setOverGroupState = (g: string | null) => {
		overGroupRef.current = g;
		setOverGroup(g);
		if (g) {
			overRef.current = null;
			setOver(null);
		}
	};

	const groups = useMemo(() => {
		return GROUPS.map((g) => [g, items.filter((c) => c.group === g)] as const);
	}, [items]);

	return (
		<div className="flex h-full flex-col">
			<div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto p-2">
				{groups.map(([group, list]) => (
					<div
						key={group}
						data-cat-group={group}
						className={`rounded-md transition ${
							overGroup === group
								? "bg-[#0F4C45]/[0.07] ring-1 ring-[#0F4C45]/20"
								: ""
						}`}
					>
						<div className="mb-0.5 flex items-center gap-1 px-1.5">
							<p className="min-w-0 flex-1 text-[0.56rem] font-semibold tracking-[0.14em] text-[#A0ADA9]">
								{group}
							</p>
							<button
								type="button"
								title={`Add to “${group}”`}
								onClick={() => onAdd(group)}
								className="flex h-5 w-5 items-center justify-center rounded-md text-[0.85rem] leading-none text-[#0F4C45]/45 transition hover:bg-[#0F4C45]/8 hover:text-[#0F4C45]"
							>
								+
							</button>
						</div>
						<ul className="space-y-0.5">
							{list.map((c) => {
								const isDrag = dragId === c.id;
								const showBefore = over?.id === c.id && over.place === "before";
								const showAfter = over?.id === c.id && over.place === "after";
								return (
									<li key={c.id} className="relative">
										{showBefore ? (
											<span className="absolute -top-0.5 left-2 right-2 z-[3] h-0.5 rounded-full bg-[#0F4C45]/55" />
										) : null}
										<div
											data-cat-id={c.id}
											className={`group/nav relative flex items-center rounded-md transition ${
												isDrag
													? "bg-[#0F4C45]/14 opacity-90 shadow-sm ring-1 ring-[#0F4C45]/15"
													: activeId === c.id
														? "bg-[#0F4C45]/[0.1]"
														: "hover:bg-[#0F4C45]/[0.05]"
											} ${dragId ? "cursor-grabbing select-none" : "cursor-default"}`}
											onPointerDown={(e) => {
												if (e.button !== 0) return;
												const target = e.target as HTMLElement;
												if (
													target.closest("[data-nav-x]") ||
													target.closest("[data-nav-star]")
												)
													return;
												didDrag.current = false;
												suppressClick.current = false;
												clearPress();
												const id = c.id;
												pressTimer.current = window.setTimeout(() => {
													didDrag.current = true;
													suppressClick.current = true;
													dragIdRef.current = id;
													setDragId(id);
													try {
														(
															e.currentTarget as HTMLElement
														).setPointerCapture(e.pointerId);
													} catch {
														/* ignore */
													}
												}, LONG_PRESS_MS);
											}}
											onPointerMove={(e) => {
												if (!dragIdRef.current) {
													if (pressTimer.current != null) {
														const el = e.currentTarget;
														const r = el.getBoundingClientRect();
														if (
															e.clientX < r.left - 8 ||
															e.clientX > r.right + 8 ||
															e.clientY < r.top - 8 ||
															e.clientY > r.bottom + 8
														) {
															clearPress();
														}
													}
													return;
												}
												const el = document.elementFromPoint(
													e.clientX,
													e.clientY,
												);
												const row = el?.closest(
													"[data-cat-id]",
												) as HTMLElement | null;
												const tid = row?.dataset.catId;
												if (tid && tid !== dragIdRef.current) {
													const rect = row.getBoundingClientRect();
													const place =
														e.clientY < rect.top + rect.height / 2
															? "before"
															: "after";
													setOverState({ id: tid, place });
													return;
												}
												const zone = el?.closest(
													"[data-cat-group]",
												) as HTMLElement | null;
												const g = zone?.dataset.catGroup;
												if (g) {
													setOverGroupState(g);
													return;
												}
												setOverState(null);
												setOverGroupState(null);
											}}
											onPointerUp={() => {
												clearPress();
												const from = dragIdRef.current;
												const drop = overRef.current;
												const dropGroup = overGroupRef.current;
												if (from && didDrag.current) {
													if (drop) {
														onReorder(from, drop.id, drop.place);
														suppressClick.current = true;
													} else if (dropGroup) {
														onMoveToGroup(from, dropGroup);
														suppressClick.current = true;
													}
												}
												endDrag();
												window.setTimeout(() => {
													suppressClick.current = false;
												}, 50);
											}}
											onPointerCancel={() => {
												clearPress();
												endDrag();
											}}
										>
											<button
												type="button"
												onClick={() => {
													if (suppressClick.current) return;
													onSelect(c.id);
												}}
												className={`min-w-0 flex-1 truncate px-2 py-1.5 text-left text-[0.74rem] ${
													activeId === c.id
														? "font-semibold text-[#043439]"
														: "text-[#5A6B67]"
												}`}
											>
												{c.title}
											</button>
											<button
												type="button"
												data-nav-star
												title={
													starredIds.includes(c.id)
														? "Unstar"
														: "Starred (shown statically on the showcase)"
												}
												onClick={(e) => {
													e.stopPropagation();
													onToggleStar(c.id);
												}}
												className={`mr-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-[0.68rem] transition ${
													starredIds.includes(c.id)
														? "text-[#0F4C45] opacity-100"
														: "text-[#0F4C45]/40 opacity-0 group-hover/nav:opacity-100 hover:bg-[#0F4C45]/8 hover:text-[#0F4C45]"
												}`}
											>
												{starredIds.includes(c.id) ? "★" : "☆"}
											</button>
											<button
												type="button"
												data-nav-x
												title="Remove from list"
												onClick={(e) => {
													e.stopPropagation();
													onRemove(c.id);
												}}
												className="mr-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-[0.7rem] text-[#9b4a3c]/70 opacity-0 transition group-hover/nav:opacity-100 hover:bg-[#9b4a3c]/10"
											>
												×
											</button>
										</div>
										{showAfter ? (
											<span className="absolute -bottom-0.5 left-2 right-2 z-[3] h-0.5 rounded-full bg-[#0F4C45]/55" />
										) : null}
									</li>
								);
							})}
							{list.length === 0 ? (
								<p
									className={`px-2 py-2 text-[0.68rem] ${
										overGroup === group
											? "text-[#0F4C45]"
											: "text-[#B0BBB7]"
									}`}
								>
									Empty · drop here
								</p>
							) : null}
						</ul>
					</div>
				))}
			</div>
			<p className="shrink-0 border-t border-[#0F4C45]/6 px-2.5 py-1.5 text-[0.6rem] leading-4 text-[#A0ADA9]">
				Drag to reorder · ★ to star · hover × to remove · shared with the site
			</p>
		</div>
	);
}

function buildDocFromSource(entry: CatalogEntry): BriefDoc | null {
	// Content by id (group may have been moved in Studio)
	const item = [
		...workShowcases,
		...universityProjectShowcases,
		...societyShowcases,
	].find((s) => s.id === entry.id);
	if (item) return briefFromShowcase(item, entry.group);

	if (entry.source === "company") {
		const company = workCompanies.find((c) => c.id === entry.id);
		if (company) {
			return {
				id: company.id,
				title: company.company,
				subtitle: company.role,
				section: company.role,
				cardImage: { src: company.image.src, alt: company.image.alt },
				blocks: [
					{ id: newBlockId(), type: "heading", text: company.company },
					{
						id: newBlockId(),
						type: "image",
						image: { src: company.image.src, alt: company.image.alt },
					},
					...company.brief.map(
						(text): BriefBlock => ({ id: newBlockId(), type: "text", text }),
					),
				],
			};
		}
	}

	if (entry.id === "smart-helmet") {
		const h = makeEssay.find((b) => b.type === "helmet");
		if (h && h.type === "helmet") {
			const [product, camp, crew] = h.images;
			return {
				id: "smart-helmet",
				title: h.title,
				subtitle: h.title,
				section: "MAKE",
				cardImage: product
					? { src: product.src, alt: product.alt }
					: undefined,
				blocks: [
					{ id: newBlockId(), type: "heading", text: h.title },
					{ id: newBlockId(), type: "pull", text: h.pull },
					...h.body.map(
						(text): BriefBlock => ({ id: newBlockId(), type: "text", text }),
					),
					...(product
						? [
								{
									id: newBlockId(),
									type: "image" as const,
									image: {
										src: product.src,
										alt: product.alt,
										caption: product.caption,
									},
								},
							]
						: []),
					{ id: newBlockId(), type: "kicker", text: "Booth" },
					{
						id: newBlockId(),
						type: "text",
						text: "Exhibition floor and roadside stall — the same helmet, two public tests.",
					},
					...(camp && crew
						? [
								{
									id: newBlockId(),
									type: "duo" as const,
									images: [
										{
											src: camp.src,
											alt: camp.alt,
											caption: camp.caption,
										},
										{
											src: crew.src,
											alt: crew.alt,
											caption: crew.caption,
										},
									] as [BriefImage, BriefImage],
								},
							]
						: []),
				],
			};
		}
	}

	if (entry.id === "diy-wall" || entry.id === "make-diy") {
		const diy = makeEssay.find((b) => b.type === "diy-wall");
		if (diy && diy.type === "diy-wall") {
			const cover = diy.items[4]?.image ?? diy.items[0]?.image;
			return {
				id: "diy-wall",
				title: diy.title,
				subtitle: diy.title,
				section: "MAKE · DIY",
				cardImage: cover
					? { src: cover.src, alt: cover.alt }
					: undefined,
				blocks: [
					{ id: newBlockId(), type: "heading", text: diy.title },
					...diy.items.map(
						(it): BriefBlock => ({
							id: newBlockId(),
							type: "image",
							image: {
								src: it.image.src,
								alt: it.image.alt,
								caption: it.title,
							},
						}),
					),
				],
			};
		}
	}

	return null;
}

/**
 * Site showcase/make data is canonical for structure.
 * Studio store only keeps cover framing (cardImage scale/pan) for non-custom entries.
 */
function loadDoc(entry: CatalogEntry, store: BriefStore): BriefDoc {
	const saved =
		store[entry.id] ??
		(entry.id === "diy-wall" ? store["make-diy"] : undefined);

	if (entry.source === "custom") {
		return withCardImage(
			saved
				? structuredClone(saved)
				: blankDoc(entry.id, entry.title, entry.group),
		);
	}

	// Prefer the Studio-saved doc so text edits persist across reloads. The source
	// showcase is only a fallback, or used to fill in a missing cover / empty body.
	if (saved) {
		const doc = structuredClone(saved);
		const fromSource = buildDocFromSource(entry);
		if ((!doc.blocks || doc.blocks.length === 0) && fromSource) {
			doc.blocks = fromSource.blocks;
		}
		if (!doc.cardImage?.src && fromSource?.cardImage?.src) {
			doc.cardImage = structuredClone(fromSource.cardImage);
		}
		return withCardImage(doc);
	}

	const fromSource = buildDocFromSource(entry);
	if (fromSource) return withCardImage(fromSource);

	return withCardImage({
		id: entry.id,
		title: entry.title,
		blocks: [
			{ id: newBlockId(), type: "heading", text: entry.title },
			{ id: newBlockId(), type: "text", text: "Click to edit text" },
		],
	});
}

function downloadJson(data: unknown) {
	const blob = new Blob([`${JSON.stringify(data, null, "\t")}\n`], {
		type: "application/json",
	});
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "briefs.json";
	a.click();
	URL.revokeObjectURL(url);
}

function patchBlock(
	blocks: BriefBlock[],
	id: string,
	fn: (b: BriefBlock) => BriefBlock,
): BriefBlock[] {
	return blocks.map((b) => {
		if (b.id === id) return fn(b);
		if (b.type === "tabs") {
			return {
				...b,
				tabs: b.tabs.map((tab) => ({
					...tab,
					blocks: patchBlock(tab.blocks, id, fn),
				})),
			};
		}
		return b;
	});
}

function dropBlock(blocks: BriefBlock[], id: string): BriefBlock[] {
	return blocks
		.filter((b) => b.id !== id)
		.map((b) =>
			b.type === "tabs"
				? {
						...b,
						tabs: b.tabs.map((tab) => ({
							...tab,
							blocks: dropBlock(tab.blocks, id),
						})),
					}
				: b,
		);
}

/** Inline text that looks like preview until focused. */
function LiveText({
	value,
	onChange,
	className,
	multiline = false,
	placeholder = "Click to edit",
}: {
	value: string;
	onChange: (v: string) => void;
	className: string;
	multiline?: boolean;
	placeholder?: string;
}) {
	if (multiline) {
		return (
			<textarea
				value={value}
				placeholder={placeholder}
				rows={Math.max(2, value.split("\n").length + 1)}
				onChange={(e) => onChange(e.target.value)}
				className={`studio-live w-full resize-y rounded-lg bg-transparent px-1.5 -mx-1.5 outline-none transition hover:bg-[#0F4C45]/[0.035] focus:bg-[#0F4C45]/[0.05] focus:ring-1 focus:ring-[#0F4C45]/18 ${className}`}
			/>
		);
	}
	return (
		<input
			value={value}
			placeholder={placeholder}
			onChange={(e) => onChange(e.target.value)}
			className={`studio-live w-full rounded-lg bg-transparent px-1.5 -mx-1.5 outline-none transition hover:bg-[#0F4C45]/[0.035] focus:bg-[#0F4C45]/[0.05] focus:ring-1 focus:ring-[#0F4C45]/18 ${className}`}
		/>
	);
}

function LiveImage({
	image,
	onPick,
	onCaption,
	onChange,
	aspectClass = "aspect-[4/3]",
}: {
	image: BriefImage;
	onPick: () => void;
	onCaption?: (v: string) => void;
	onChange?: (image: BriefImage) => void;
	aspectClass?: string;
}) {
	const focus = normalizeImageFocus(image);
	const drag = useRef<{
		px: number;
		py: number;
		otx: number;
		oty: number;
	} | null>(null);
	const moved = useRef(false);

	const setFocus = (next: { scale: number; tx: number; ty: number }) => {
		onChange?.(withFocus(image, next));
	};

	const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
		if (!onChange) return;
		if ((e.target as HTMLElement).closest("[data-pick]")) return;
		e.currentTarget.setPointerCapture(e.pointerId);
		moved.current = false;
		drag.current = {
			px: e.clientX,
			py: e.clientY,
			otx: focus.tx,
			oty: focus.ty,
		};
	};

	const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
		if (!onChange || !drag.current) return;
		const dx = e.clientX - drag.current.px;
		const dy = e.clientY - drag.current.py;
		if (Math.hypot(dx, dy) > 3) moved.current = true;
		const rect = e.currentTarget.getBoundingClientRect();
		const limit = panLimit(focus.scale);
		setFocus({
			scale: focus.scale,
			tx: clampFocus(
				drag.current.otx + (dx / Math.max(rect.width, 1)) * 100,
				-limit,
				limit,
			),
			ty: clampFocus(
				drag.current.oty + (dy / Math.max(rect.height, 1)) * 100,
				-limit,
				limit,
			),
		});
	};

	const onPointerUp = () => {
		drag.current = null;
	};

	return (
		<figure className="group/img relative overflow-hidden bg-[#F5F5F3]">
			<div
				className={`relative block w-full overflow-hidden ${aspectClass} ${
					onChange ? "cursor-grab active:cursor-grabbing" : ""
				}`}
				style={{ touchAction: onChange ? "none" : undefined }}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}
				onPointerCancel={onPointerUp}
			>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={image.src}
					alt={image.alt || ""}
					draggable={false}
					className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
					style={imageFocusStyle(image)}
				/>
				<button
					type="button"
					data-pick
					onClick={(e) => {
						e.stopPropagation();
						if (moved.current) return;
						onPick();
					}}
					className="absolute right-2 top-2 z-[1] rounded-full bg-[#162b26]/72 px-2.5 py-1 text-[0.68rem] font-semibold text-white opacity-0 backdrop-blur-sm transition group-hover/img:opacity-100"
				>
					Swap image
				</button>
				{onChange ? (
					<p className="pointer-events-none absolute bottom-2 left-2 rounded-full bg-[#162b26]/55 px-2 py-0.5 text-[0.6rem] font-medium text-white/90 opacity-0 backdrop-blur-sm transition group-hover/img:opacity-100">
						Drag to move · zoom below
					</p>
				) : null}
			</div>
			{onChange ? (
				<div className="flex items-center gap-2 border-t border-black/[0.05] bg-white/70 px-3 py-2">
					<span className="shrink-0 text-[0.62rem] font-semibold text-[#8A9692]">
						Zoom
					</span>
					<input
						type="range"
						min={IMAGE_FOCUS_MIN}
						max={IMAGE_FOCUS_MAX}
						step={0.01}
						value={focus.scale}
						onChange={(e) => {
							const scale = Number(e.target.value);
							const limit = panLimit(scale);
							setFocus({
								scale,
								tx: clampFocus(focus.tx, -limit, limit),
								ty: clampFocus(focus.ty, -limit, limit),
							});
						}}
						className="min-w-0 flex-1 accent-[#0F4C45]"
					/>
					<span className="w-9 shrink-0 text-right text-[0.62rem] font-semibold tabular-nums text-[#0F4C45]">
						{focus.scale.toFixed(2)}×
					</span>
					<button
						type="button"
						onClick={() => setFocus({ scale: 1, tx: 0, ty: 0 })}
						className="shrink-0 rounded-full px-2 py-0.5 text-[0.62rem] font-semibold text-[#0F4C45]/70 hover:bg-[#0F4C45]/8 hover:text-[#0F4C45]"
					>
						Reset
					</button>
				</div>
			) : null}
			{onCaption ? (
				<LiveText
					value={image.caption ?? ""}
					onChange={onCaption}
					placeholder="Image caption"
					className="px-3 py-2.5 text-center text-[0.74rem] text-[#8A9692]"
				/>
			) : image.caption ? (
				<figcaption className="px-3 py-2.5 text-center text-[0.74rem] text-[#8A9692]">
					{image.caption}
				</figcaption>
			) : null}
		</figure>
	);
}

function BlockRow({
	block,
	onChange,
	onRemove,
	onPick,
}: {
	block: BriefBlock;
	onChange: (b: BriefBlock) => void;
	onRemove: () => void;
	onPick: (field: string) => void;
}) {
	return (
		<div className="group/block relative">
			<button
				type="button"
				onClick={onRemove}
				className="absolute -right-1 -top-1 z-[2] hidden h-6 w-6 items-center justify-center rounded-full bg-[#9b4a3c] text-[0.7rem] font-bold text-white shadow group-hover/block:flex"
				title="Delete this block"
			>
				×
			</button>

			{block.type === "kicker" ? (
				<LiveText
					value={block.text}
					onChange={(text) => onChange({ ...block, text })}
					className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#8A9692]"
				/>
			) : null}
			{block.type === "heading" ? (
				<LiveText
					value={block.text}
					onChange={(text) => onChange({ ...block, text })}
					className="mt-4 text-[1.6rem] font-extrabold tracking-tight text-[#162b26]"
				/>
			) : null}
			{block.type === "subheading" ? (
				<LiveText
					value={block.text}
					onChange={(text) => onChange({ ...block, text })}
					className="mt-1.5 text-[0.95rem] text-[#6A7A76]"
				/>
			) : null}
			{block.type === "pull" ? (
				<LiveText
					value={block.text}
					onChange={(text) => onChange({ ...block, text })}
					multiline
					className="mt-5 text-[1.02rem] font-medium leading-8 text-[#0F4C45]"
				/>
			) : null}
			{block.type === "text" ? (
				<LiveText
					value={block.text}
					onChange={(text) => onChange({ ...block, text })}
					multiline
					className="mt-3.5 text-[1rem] leading-8 text-[#333]"
				/>
			) : null}
			{block.type === "list" ? (
				<LiveText
					value={block.items.join("\n")}
					onChange={(v) =>
						onChange({
							...block,
							items: v.split("\n").filter(Boolean),
						})
					}
					multiline
					placeholder={"One item per line"}
					className="mt-4 text-[1rem] leading-8 text-[#333]"
				/>
			) : null}
			{block.type === "image" ? (
				<div className="mt-7">
					<LiveImage
						image={block.image}
						onPick={() => onPick("src")}
						onChange={(image) => onChange({ ...block, image })}
						onCaption={(caption) =>
							onChange({
								...block,
								image: { ...block.image, caption },
							})
						}
					/>
				</div>
			) : null}
			{block.type === "duo" ? (
				<div className="mt-7 grid gap-3.5 sm:grid-cols-2">
					{block.images.map((image, idx) => (
						<LiveImage
							key={`${block.id}-${idx}`}
							image={image}
							onPick={() => onPick(String(idx))}
							onChange={(next) => {
								const images = [...block.images] as typeof block.images;
								images[idx] = next;
								onChange({ ...block, images });
							}}
							onCaption={(caption) => {
								const images = [...block.images] as typeof block.images;
								images[idx] = { ...images[idx], caption };
								onChange({ ...block, images });
							}}
						/>
					))}
				</div>
			) : null}
			{block.type === "tabs" ? (
				<div className="mt-6 space-y-6 rounded-lg border border-dashed border-[#0F4C45]/2 p-3">
					{block.tabs.map((tab, tabIndex) => (
						<div key={tab.id}>
							<LiveText
								value={tab.label}
								onChange={(label) => {
									const tabs = block.tabs.map((t, i) =>
										i === tabIndex ? { ...t, label } : t,
									);
									onChange({ ...block, tabs });
								}}
								className="text-[0.9rem] font-semibold text-[#0F4C45]"
							/>
							<div className="mt-3 space-y-3">
								{tab.blocks.map((child) => (
									<BlockRow
										key={child.id}
										block={child}
										onChange={(next) => {
											const tabs = block.tabs.map((t) =>
												t.id === tab.id
													? {
															...t,
															blocks: t.blocks.map((b) =>
																b.id === child.id ? next : b,
															),
														}
													: t,
											);
											onChange({ ...block, tabs });
										}}
										onRemove={() => {
											const tabs = block.tabs.map((t) =>
												t.id === tab.id
													? {
															...t,
															blocks: t.blocks.filter((b) => b.id !== child.id),
														}
													: t,
											);
											onChange({ ...block, tabs });
										}}
										onPick={(field) => onPick(`${child.id}::${field}`)}
									/>
								))}
							</div>
						</div>
					))}
				</div>
			) : null}
		</div>
	);
}

export function StudioApp() {
	const [catalog, setCatalog] = useState<CatalogEntry[]>(
		() => hydrateCatalog(null).items,
	);
	const [hiddenIds, setHiddenIds] = useState<string[]>([]);
	const [starredIds, setStarredIds] = useState<string[]>([]);
	const [catalogReady, setCatalogReady] = useState(false);
	const [mode, setMode] = useState<"briefs" | "avatar" | "page">("briefs");
	const [avatarVariant, setAvatarVariant] = useState<"home" | "introduce">(
		"home",
	);
	const [store, setStore] = useState<BriefStore>(
		() => structuredClone(seedBriefs) as BriefStore,
	);
	const [activeId, setActiveId] = useState(
		() => hydrateCatalog(null).items[0]?.id ?? "zongheng-robot",
	);
	const [doc, setDoc] = useState<BriefDoc>(() => {
		const first = hydrateCatalog(null).items[0];
		if (!first) {
			return blankDoc("untitled", "Untitled", "Work");
		}
		return loadDoc(first, structuredClone(seedBriefs) as BriefStore);
	});
	const [pickToken, setPickToken] = useState<string | null>(null);
	const [mediaQ, setMediaQ] = useState("");
	const [tip, setTip] = useState<string | null>(null);
	const [extraMedia, setExtraMedia] = useState<string[]>([]);
	const [uploading, setUploading] = useState(false);
	const filePickRef = useRef<HTMLInputElement>(null);
	const [saving, setSaving] = useState(false);
	const [undoLabel, setUndoLabel] = useState<string | null>(null);
	const undoRemoveRef = useRef<{
		entry: CatalogEntry;
		index: number;
		wasHidden: boolean;
	} | null>(null);

	const media = useMemo(
		() => [...extraMedia, ...(mediaList as string[])],
		[extraMedia],
	);
	const mediaHits = useMemo(() => {
		const q = mediaQ.trim().toLowerCase();
		const seen = new Set<string>();
		const list: string[] = [];
		for (const p of media) {
			if (seen.has(p)) continue;
			if (q && !p.toLowerCase().includes(q)) continue;
			seen.add(p);
			list.push(p);
			if (list.length >= 48) break;
		}
		return list;
	}, [media, mediaQ]);

	useEffect(() => {
		let cancelled = false;
		const apply = (persist: CatalogPersist | null) => {
			if (cancelled) return;
			const h = hydrateCatalog(persist);
			setCatalog(h.items);
			setHiddenIds(h.hidden);
			setStarredIds(h.starred);
			setCatalogReady(true);
		};
		// Shared disk order is canonical (same file the site imports)
		void fetch("/api/catalog/")
			.then((r) => (r.ok ? r.json() : null))
			.then((data) => {
				if (data) {
					apply(data as CatalogPersist);
					return;
				}
				try {
					const raw = localStorage.getItem(CATALOG_LS_KEY);
					if (raw) {
						apply(JSON.parse(raw) as CatalogPersist);
						return;
					}
				} catch {
					/* ignore */
				}
				apply(null);
			})
			.catch(() => {
				try {
					const raw = localStorage.getItem(CATALOG_LS_KEY);
					apply(raw ? (JSON.parse(raw) as CatalogPersist) : null);
				} catch {
					apply(null);
				}
			});
		return () => {
			cancelled = true;
		};
	}, []);

	// Nav labels should match the site: prefer Studio-saved brief titles
	// (runs once after the catalog is ready; live edits still win afterwards).
	useEffect(() => {
		if (!catalogReady) return;
		let cancelled = false;
		(async () => {
			try {
				const res = await fetch("/api/briefs/", { cache: "no-store" });
				if (!res.ok) return;
				const data = (await res.json()) as BriefStore;
				if (cancelled || !data || typeof data !== "object") return;
				setCatalog((prev) =>
					prev.map((c) => {
						const saved = data[c.id]?.title;
						return saved && saved !== c.title ? { ...c, title: saved } : c;
					}),
				);
			} catch {
				/* keep source titles */
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [catalogReady]);

	// Persist catalog (local + disk)
	useEffect(() => {
		if (!catalogReady) return;
		const payload = toPersist(catalog, hiddenIds, starredIds);
		try {
			localStorage.setItem(CATALOG_LS_KEY, JSON.stringify(payload));
		} catch {
			/* ignore */
		}
		const t = window.setTimeout(() => {
			void fetch("/api/catalog/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
		}, 450);
		return () => window.clearTimeout(t);
	}, [catalog, hiddenIds, starredIds, catalogReady]);

	// Keep sidebar title in sync with edited doc
	useEffect(() => {
		setCatalog((prev) =>
			prev.map((c) =>
				c.id === doc.id && c.title !== doc.title
					? { ...c, title: doc.title }
					: c,
			),
		);
	}, [doc.id, doc.title]);

	useEffect(() => {
		setStore((prev) => ({ ...prev, [doc.id]: doc }));
	}, [doc]);

	// Live briefs: the static JSON seed is a compile-time snapshot and can be
	// stale (e.g. after Write from an earlier session). Load the saved store from
	// disk on mount so edits start from the real data instead of clobbering it.
	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const res = await fetch("/api/briefs/", { cache: "no-store" });
				if (!res.ok) return;
				const data = (await res.json()) as BriefStore;
				if (
					cancelled ||
					!data ||
					typeof data !== "object" ||
					Array.isArray(data)
				)
					return;
				setStore(data);
				setDoc((prev) => {
					const fresh = data[prev.id];
					return fresh ? structuredClone(fresh) : prev;
				});
			} catch {
				/* keep seed */
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	useEffect(() => {
		if (!pickToken) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setPickToken(null);
		};
		window.addEventListener("keydown", onKey);
		// Refresh gallery from disk so new uploads appear after reload
		void fetch("/api/media/")
			.then((r) => (r.ok ? r.json() : null))
			.then((data: { paths?: string[] } | null) => {
				if (!data?.paths?.length) return;
				setExtraMedia((prev) => {
					const seen = new Set(prev);
					const fresh = data.paths!.filter((p) => !seen.has(p));
					return fresh.length ? [...fresh, ...prev] : prev;
				});
			})
			.catch(() => undefined);
		return () => window.removeEventListener("keydown", onKey);
	}, [pickToken]);

	const reorderCatalog = useCallback(
		(fromId: string, toId: string, place: "before" | "after") => {
			setCatalog((prev) => moveCatalogItem(prev, fromId, toId, place));
		},
		[],
	);

	const moveCatalogToGroup = useCallback((fromId: string, group: string) => {
		setCatalog((prev) => moveCatalogItemToGroup(prev, fromId, group));
	}, []);

	const addCatalogItem = useCallback((group: string) => {
		const id = `custom_${Date.now().toString(36)}`;
		const title = "Untitled";
		const entry: CatalogEntry = {
			id,
			title,
			group,
			source: "custom",
		};
		const fresh = blankDoc(id, title, group);
		setCatalog((prev) => {
			const lastInGroup = [...prev]
				.map((e, i) => ({ e, i }))
				.reverse()
				.find((x) => x.e.group === group);
			if (!lastInGroup) return [...prev, entry];
			const next = [...prev];
			next.splice(lastInGroup.i + 1, 0, entry);
			return next;
		});
		setStore((prev) => ({ ...prev, [id]: fresh }));
		setActiveId(id);
		setDoc(fresh);
		setTip("Added · rename it in the middle");
		window.setTimeout(() => setTip(null), 2200);
	}, []);

	const removeCatalogItem = useCallback(
		(id: string) => {
			const index = catalog.findIndex((c) => c.id === id);
			if (index < 0) return;
			const entry = catalog[index]!;
			undoRemoveRef.current = {
				entry,
				index,
				wasHidden: entry.source !== "custom",
			};
			setUndoLabel(`Removed「${entry.title}」`);
			const next = catalog.filter((c) => c.id !== id);
			setCatalog(next);
			setStarredIds((s) => s.filter((x) => x !== id));
			if (entry.source !== "custom") {
				setHiddenIds((h) => (h.includes(id) ? h : [...h, id]));
			} else {
				setStore((s) => {
					const copy = { ...s };
					delete copy[id];
					return copy;
				});
			}
			if (activeId === id) {
				const fallback = next[Math.min(index, next.length - 1)];
				if (fallback) {
					setActiveId(fallback.id);
					setDoc(loadDoc(fallback, store));
				}
			}
		},
		[activeId, catalog, store],
	);

	const undoRemove = useCallback(() => {
		const u = undoRemoveRef.current;
		if (!u) return;
		undoRemoveRef.current = null;
		setUndoLabel(null);
		setCatalog((prev) => {
			if (prev.some((c) => c.id === u.entry.id)) return prev;
			const next = [...prev];
			next.splice(Math.min(u.index, next.length), 0, u.entry);
			return next;
		});
		if (u.wasHidden) {
			setHiddenIds((h) => h.filter((x) => x !== u.entry.id));
		}
		setTip("Undone");
		window.setTimeout(() => setTip(null), 1600);
	}, []);

	const setBlocks = (blocks: BriefBlock[]) => {
		setDoc((prev) => ({ ...prev, blocks }));
	};

	const applyImage = (path: string) => {
		if (!pickToken) return;
		const parts = pickToken.split("::");

		// Homepage / Projects stage cover
		if (parts[0] === "meta" && parts[1] === "cardImage") {
			setDoc((prev) => ({
				...prev,
				cardImage: {
					src: path,
					alt: prev.cardImage?.alt || prev.title,
					caption: prev.cardImage?.caption,
					// Reset framing when swapping the file — new crop
					scale: undefined,
					tx: undefined,
					ty: undefined,
				},
			}));
			setPickToken(null);
			setMediaQ("");
			return;
		}

		// formats: blockId::src | blockId::0 | blockId::childId::src
		if (parts.length === 2) {
			const [blockId, field] = parts;
			if (!blockId) return;
			setDoc((prev) => ({
				...prev,
				blocks: patchBlock(prev.blocks, blockId, (block) => {
					if (block.type === "image") {
						return {
							...block,
							image: {
								...block.image,
								src: path,
								scale: undefined,
								tx: undefined,
								ty: undefined,
							},
						};
					}
					if (block.type === "duo" && (field === "0" || field === "1")) {
						const images = [...block.images] as typeof block.images;
						images[Number(field)] = {
							...images[Number(field)],
							src: path,
							scale: undefined,
							tx: undefined,
							ty: undefined,
						};
						return { ...block, images };
					}
					return block;
				}),
			}));
		} else if (parts.length === 3) {
			const [parentHint, childId, field] = parts;
			void parentHint;
			if (!childId) return;
			setDoc((prev) => ({
				...prev,
				blocks: patchBlock(prev.blocks, childId, (block) => {
					if (block.type === "image") {
						return {
							...block,
							image: {
								...block.image,
								src: path,
								scale: undefined,
								tx: undefined,
								ty: undefined,
							},
						};
					}
					if (block.type === "duo" && (field === "0" || field === "1")) {
						const images = [...block.images] as typeof block.images;
						images[Number(field)] = {
							...images[Number(field)],
							src: path,
							scale: undefined,
							tx: undefined,
							ty: undefined,
						};
						return { ...block, images };
					}
					return block;
				}),
			}));
		}
		setPickToken(null);
		setMediaQ("");
	};

	const uploadFromFolder = async (file: File | undefined) => {
		if (!file || !pickToken) return;
		setUploading(true);
		try {
			const form = new FormData();
			form.append("image", file);
			const res = await fetch("/api/media/", { method: "POST", body: form });
			const data = (await res.json()) as { path?: string; error?: string };
			if (!res.ok || !data.path) {
				throw new Error(data.error || "Upload failed");
			}
			setExtraMedia((prev) =>
				prev.includes(data.path!) ? prev : [data.path!, ...prev],
			);
			applyImage(data.path);
			setTip("Swapped from folder");
			window.setTimeout(() => setTip(null), 2000);
		} catch (err) {
			setTip(err instanceof Error ? err.message : "Upload failed");
			window.setTimeout(() => setTip(null), 2800);
		} finally {
			setUploading(false);
			if (filePickRef.current) filePickRef.current.value = "";
		}
	};

	const download = () => {
		downloadJson({ ...store, [doc.id]: doc });
		setTip("Downloaded JSON · or press Write to save it to disk");
		window.setTimeout(() => setTip(null), 2500);
	};

	const saveToDisk = async () => {
		setSaving(true);
		try {
			const payload = { ...store, [doc.id]: doc };
			const res = await fetch("/api/briefs/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const data = (await res.json()) as { path?: string; error?: string };
			if (!res.ok) throw new Error(data.error || "Write failed");
			setStore(payload);
			setTip(`Written ${data.path}`);
		} catch (err) {
			setTip(err instanceof Error ? err.message : "Write failed");
		} finally {
			setSaving(false);
			window.setTimeout(() => setTip(null), 2500);
		}
	};

	// Switching cards: body copy syncs with the site stage
	const switchCard = (id: string) => {
		if (id === activeId) return;
		const entry = catalog.find((c) => c.id === id);
		if (!entry) return;
		setActiveId(id);
		setDoc(loadDoc(entry, store));
	};

	const avatarRef = useRef<AvatarEditorHandle>(null);
	const [avatarPreview, setAvatarPreview] = useState<AvatarPreview | null>(
		null,
	);
	const onAvatarPreview = useCallback((p: AvatarPreview) => {
		setAvatarPreview(p);
	}, []);

	const addBlock = (type: "heading" | "text" | "image" | "duo") => {
		setBlocks([...doc.blocks, createEmptyBlock(type)]);
	};

	return (
		<div className="studio-shell flex h-[100svh] flex-col text-[#162b26]">
			{/* Short top bar */}
			<header className="studio-topbar z-20 flex h-9 shrink-0 items-center gap-2.5 px-3 sm:px-4">
				<div className="flex items-center gap-0.5 rounded-full bg-[#0F4C45]/[0.06] p-0.5">
					<button
						type="button"
						onClick={() => setMode("briefs")}
						className={`rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold transition ${
							mode === "briefs"
								? "bg-white text-[#043439] shadow-sm"
								: "text-[#0F4C45]/70 hover:text-[#0F4C45]"
						}`}
					>
						Details
					</button>
					<button
						type="button"
						onClick={() => setMode("page")}
						className={`rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold transition ${
							mode === "page"
								? "bg-white text-[#043439] shadow-sm"
								: "text-[#0F4C45]/70 hover:text-[#0F4C45]"
						}`}
					>
						Layout
					</button>
					<button
						type="button"
						onClick={() => setMode("avatar")}
						className={`rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold transition ${
							mode === "avatar"
								? "bg-white text-[#043439] shadow-sm"
								: "text-[#0F4C45]/70 hover:text-[#0F4C45]"
						}`}
					>
						Avatar
					</button>
				</div>

				<div className="hidden min-w-0 flex-1 items-center gap-2 sm:flex">
					{mode === "briefs" ? (
						<span className="min-w-0 truncate text-[0.75rem] text-[#6A7A76]">
							{doc.title}
						</span>
					) : mode === "page" ? (
						<span className="truncate text-[0.75rem] text-[#6A7A76]">
							Edit while previewing · click text for a red frame
						</span>
					) : (
						<span className="truncate text-[0.75rem] text-[#6A7A76]">Avatar</span>
					)}
				</div>

				<div className="ml-auto flex items-center gap-1">
					{mode === "briefs" ? (
						<>
							<div className="mr-0.5 hidden items-center gap-0.5 md:flex">
								{(
									[
										["heading", "Title"],
										["text", "Body"],
										["image", "Image"],
										["duo", "Two images"],
									] as const
								).map(([type, label]) => (
									<button
										key={type}
										type="button"
										onClick={() => addBlock(type)}
										className="rounded-full px-2 py-0.5 text-[0.65rem] font-medium text-[#0F4C45]/65 transition hover:bg-white/80 hover:text-[#0F4C45]"
									>
										+{label}
									</button>
								))}
							</div>
							<button
								type="button"
								onClick={download}
								className="rounded-full px-2.5 py-1 text-[0.7rem] font-semibold text-[#0F4C45] hover:bg-white/70"
							>
								Download
							</button>
							<button
								type="button"
								disabled={saving}
								onClick={() => void saveToDisk()}
								className="rounded-full bg-[#043439] px-3 py-1 text-[0.7rem] font-semibold text-white disabled:opacity-60"
							>
								{saving ? "Writing…" : "Write"}
							</button>
						</>
					) : mode === "avatar" ? (
						<>
							<div className="flex items-center gap-0.5 rounded-full bg-white/70 p-0.5 ring-1 ring-[#0F4C45]/8">
								{(
									[
										["home", "Home"],
										["introduce", "Introduce"],
									] as const
								).map(([id, label]) => (
									<button
										key={id}
										type="button"
										onClick={() => setAvatarVariant(id)}
										className={`rounded-full px-2.5 py-0.5 text-[0.68rem] font-semibold transition ${
											avatarVariant === id
												? "bg-white text-[#043439] shadow-sm"
												: "text-[#0F4C45]/70 hover:text-[#0F4C45]"
										}`}
									>
										{label}
									</button>
								))}
							</div>
							<button
								type="button"
								onClick={() => avatarRef.current?.pickFile()}
								className="rounded-full px-2.5 py-1 text-[0.7rem] font-semibold text-[#0F4C45] hover:bg-white/70"
							>
								Upload
							</button>
							<button
								type="button"
								onClick={() => avatarRef.current?.save()}
								className="rounded-full bg-[#043439] px-3 py-1 text-[0.7rem] font-semibold text-white"
							>
								Save
							</button>
						</>
					) : null}
					<Link
						href="/#home"
						className="rounded-full px-2 py-1 text-[0.7rem] font-medium text-[#8A9692] hover:text-[#0F4C45]"
					>
						Site
					</Link>
				</div>
			</header>

			<div className="studio-workspace flex min-h-0 flex-1 gap-2.5 p-2.5 pt-2 sm:gap-3.5 sm:p-3.5 sm:pt-2.5">
				{mode === "page" ? (
					<section className="studio-panel studio-panel--editor min-w-0 flex-1 overflow-hidden">
						<PageLayoutEditor onTip={setTip} />
					</section>
				) : (
					<>
				{/* Left nav card */}
				<aside className="studio-panel studio-panel--nav hidden w-[12rem] shrink-0 flex-col overflow-hidden lg:flex xl:w-[13rem]">
					{mode === "briefs" ? (
						<CatalogNav
							items={catalog}
							activeId={activeId}
							starredIds={starredIds}
							onSelect={switchCard}
							onReorder={reorderCatalog}
							onMoveToGroup={moveCatalogToGroup}
							onAdd={addCatalogItem}
							onRemove={removeCatalogItem}
							onToggleStar={(id) => {
								setStarredIds((prev) =>
									prev.includes(id)
										? prev.filter((x) => x !== id)
										: [...prev, id],
								);
							}}
						/>
					) : (
						<p className="px-3 py-4 text-[0.74rem] leading-5 text-[#6A7A76]">
							Drag in the middle to position; the home circle preview is on the right.
						</p>
					)}
				</aside>

				{/* Center editor / MD */}
				<section className="studio-panel studio-panel--editor min-w-0 flex-1 overflow-hidden">
					<div className="h-full overflow-hidden">
						{mode === "avatar" ? (
							<div className="h-full overflow-y-auto">
								<AvatarEditor
									ref={avatarRef}
									embedded
									variant={avatarVariant}
									onPreviewChange={onAvatarPreview}
									onTip={setTip}
								/>
							</div>
						) : (
							<div className="h-full overflow-y-auto">
								<div className="mx-auto max-w-[34rem] px-5 py-6 sm:px-8 sm:py-8">
									<select
										value={activeId}
										onChange={(e) => switchCard(e.target.value)}
										className="mb-4 w-full rounded-xl border-0 bg-[#F7F1E8] px-3 py-2.5 text-[0.82rem] font-semibold text-[#0F4C45] outline-none lg:hidden"
									>
										{catalog.map((c) => (
											<option key={c.id} value={c.id}>
												{c.group} · {c.title}
											</option>
										))}
									</select>

									<div className="space-y-1">
										{/* Homepage / Projects stage cover */}
										<div className="mb-6 overflow-hidden rounded-2xl bg-[#F7F1E8] ring-1 ring-[#0F4C45]/8">
											<div className="flex items-center justify-between px-3.5 py-2.5">
												<div>
													<p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#0F4C45]/45">
														Home card image
													</p>
													<p className="mt-0.5 text-[0.68rem] text-[#8A9692]">
														Projects stage image · separate from body images
													</p>
												</div>
												<button
													type="button"
													onClick={() => setPickToken("meta::cardImage")}
													className="rounded-full bg-white px-2.5 py-1 text-[0.68rem] font-semibold text-[#0F4C45] ring-1 ring-[#0F4C45]/12 transition hover:bg-[#043439] hover:text-white"
												>
													Swap image
												</button>
											</div>
											{doc.cardImage?.src ? (
												<LiveImage
													image={doc.cardImage}
													aspectClass="aspect-[16/10]"
													onPick={() => setPickToken("meta::cardImage")}
													onChange={(cardImage) =>
														setDoc((p) => ({ ...p, cardImage }))
													}
													onCaption={(caption) =>
														setDoc((p) =>
															p.cardImage
																? {
																		...p,
																		cardImage: {
																			...p.cardImage,
																			caption:
																				caption || undefined,
																		},
																	}
																: p,
														)
													}
												/>
											) : (
												<button
													type="button"
													onClick={() => setPickToken("meta::cardImage")}
													className="flex aspect-[16/10] w-full items-center justify-center bg-[#EFE8DE] text-[0.8rem] font-semibold text-[#0F4C45]/55 transition hover:bg-[#E8E0D4]"
												>
													Click to set the home image
												</button>
											)}
										</div>

										<div className="mb-6 rounded-2xl bg-[#F7F1E8] p-3.5 ring-1 ring-[#0F4C45]/8">
											<p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#0F4C45]/45">
												Title · shown on the home card
											</p>
											<LiveText
												value={doc.title}
												onChange={(title) =>
													setDoc((p) => ({ ...p, title }))
												}
												className="mt-2 text-[1.5rem] font-extrabold tracking-tight text-[#162b26]"
												placeholder="Title"
											/>
											<LiveText
												value={doc.subtitle ?? ""}
												onChange={(subtitle) =>
													setDoc((p) => ({ ...p, subtitle }))
												}
												className="mt-1.5 text-[0.92rem] text-[#6A7A76]"
												placeholder="Subtitle"
											/>
										</div>

										{doc.blocks.map((block) => (
											<BlockRow
												key={block.id}
												block={block}
												onChange={(next) =>
													setBlocks(
														patchBlock(doc.blocks, block.id, () => next),
													)
												}
												onRemove={() =>
													setBlocks(dropBlock(doc.blocks, block.id))
												}
												onPick={(field) =>
													setPickToken(`${block.id}::${field}`)
												}
											/>
										))}
									</div>

									<div className="mt-8 flex flex-wrap gap-1.5 md:hidden">
										{(
											[
												["heading", "Title"],
												["text", "Body"],
												["image", "Image"],
												["duo", "Two images"],
											] as const
										).map(([type, label]) => (
											<button
												key={type}
												type="button"
												onClick={() => addBlock(type)}
												className="rounded-full bg-[#F7F1E8] px-2.5 py-1.5 text-[0.7rem] font-semibold text-[#0F4C45]"
											>
												+{label}
											</button>
										))}
									</div>
								</div>
							</div>
						)}
					</div>
				</section>

				{/* Right preview — frosted glass */}
				<aside className="studio-panel studio-panel--preview relative hidden min-w-0 flex-1 xl:flex">
					<div className="studio-preview-stage absolute inset-0 rounded-[1rem]" />
					<div className="relative z-[1] flex min-h-0 flex-1 items-center justify-center p-4 2xl:p-6">
						{mode === "avatar" ? (
							<div className="flex flex-col items-center gap-3">
								<p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[#0F4C45]/40">
									{avatarVariant === "introduce" ? "Introduce" : "Home"}
								</p>
								<div className="hero-avatar relative aspect-square w-[min(40vw,240px)]">
									<div className="hero-avatar__frame relative h-full w-full overflow-hidden rounded-full shadow-[0_20px_48px_rgba(22,43,38,0.12)] ring-4 ring-white/70">
										{avatarPreview ? (
											// eslint-disable-next-line @next/next/no-img-element
											<img
												src={avatarPreview.src}
												alt=""
												className="hero-avatar__img absolute inset-0 h-full w-full object-cover"
												style={{
													transform: `translate(${avatarPreview.tx}%, ${avatarPreview.ty}%) scale(${avatarPreview.scale})`,
													transformOrigin: "center center",
												}}
											/>
										) : null}
										<span aria-hidden className="hero-avatar__veil" />
									</div>
								</div>
							</div>
						) : (
							<div className="studio-preview-drawer flex max-h-[min(100%,48rem)] w-full max-w-[46rem] flex-col overflow-hidden">
								<div className="flex shrink-0 items-center justify-between px-5 py-3">
								<p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#0F4C45]/45">
									Site preview
								</p>
									<span className="text-[0.72rem] font-medium text-[#0F4C45]/30">
										Same as Projects
									</span>
								</div>
								<div className="mx-4 mb-2 h-px bg-[#0F4C45]/[0.08]" />
								<div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-1 pb-2">
									<div className="studio-preview-body">
										{doc.cardImage?.src ? (
											<figure className="mx-4 mb-3 overflow-hidden rounded-xl bg-[#F5F5F3] ring-1 ring-black/[0.04]">
												<div className="relative aspect-[16/10] w-full overflow-hidden">
													{/* eslint-disable-next-line @next/next/no-img-element */}
													<img
														src={doc.cardImage.src}
														alt={doc.cardImage.alt || doc.title}
														className="absolute inset-0 h-full w-full object-cover"
														style={imageFocusStyle(doc.cardImage)}
													/>
												</div>
												<figcaption className="px-3 py-2 text-center text-[0.62rem] font-medium tracking-[0.08em] text-[#8A9692]">
													Home card
												</figcaption>
											</figure>
										) : null}
										<BriefDocument doc={doc} />
									</div>
								</div>
							</div>
						)}
					</div>
				</aside>
					</>
				)}
			</div>

			{pickToken ? (
				<div className="fixed inset-0 z-50 flex items-end justify-center bg-[#162b26]/35 backdrop-blur-[2px] sm:items-center sm:p-4">
					<div className="flex max-h-[82vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-[#F7F1E8] shadow-2xl sm:rounded-2xl">
						<div className="flex items-center justify-between px-4 py-3">
							<p className="text-[0.9rem] font-semibold text-[#0F4C45]">
								{pickToken === "meta::cardImage" ? "Swap home card image" : "Swap image"}
							</p>
							<button
								type="button"
								onClick={() => setPickToken(null)}
								className="text-[0.78rem] font-semibold text-[#6A7A76]"
							>
								Close
							</button>
						</div>

						<input
							ref={filePickRef}
							type="file"
							accept="image/jpeg,image/png,image/webp,image/jpg,.jpg,.jpeg,.png,.webp"
							className="hidden"
							onChange={(e) => void uploadFromFolder(e.target.files?.[0])}
						/>

						<div className="px-4 pb-3">
							<button
								type="button"
								disabled={uploading}
								onClick={() => filePickRef.current?.click()}
								className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#043439] px-4 py-3 text-[0.86rem] font-semibold text-white disabled:opacity-60"
							>
								{uploading ? "Uploading…" : "Choose from folder"}
							</button>
							<p className="mt-2 text-center text-[0.7rem] text-[#8A9692]">
								Opens a local folder · images outside the library work too
							</p>
						</div>

						<div className="mx-4 mb-2 flex items-center gap-2">
							<div className="h-px flex-1 bg-[#0F4C45]/10" />
							<span className="text-[0.65rem] font-semibold tracking-[0.12em] text-[#9AA8A4]">
								or pick from the library
							</span>
							<div className="h-px flex-1 bg-[#0F4C45]/10" />
						</div>

						<input
							value={mediaQ}
							onChange={(e) => setMediaQ(e.target.value)}
							placeholder="Search the library"
							className="mx-4 mb-2 rounded-xl border-0 bg-white px-3 py-2.5 text-[0.85rem] outline-none ring-1 ring-[#0F4C45]/10"
						/>
						<div className="grid grid-cols-3 gap-2 overflow-y-auto p-3 sm:grid-cols-4">
							{mediaHits.map((path) => (
								<button
									key={path}
									type="button"
									onClick={() => applyImage(path)}
									className="relative aspect-square overflow-hidden rounded-xl bg-white"
								>
									<Image
										src={path}
										alt=""
										fill
										sizes="110px"
										className="object-cover"
									/>
								</button>
							))}
						</div>
					</div>
				</div>
			) : null}

			{undoLabel ? (
				<div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#043439] px-2 py-1.5 text-[0.76rem] font-semibold text-white shadow-lg">
					<span className="pl-2">{undoLabel}</span>
					<button
						type="button"
						onClick={() => undoRemove()}
						className="rounded-full bg-white/20 px-3 py-1 font-semibold text-white transition hover:bg-white/35"
					>
						Undo
					</button>
					<button
						type="button"
						onClick={() => {
							undoRemoveRef.current = null;
							setUndoLabel(null);
						}}
						className="rounded-full px-1.5 text-white/70 transition hover:text-white"
						aria-label="Close"
					>
						×
					</button>
				</div>
			) : null}

			{tip ? (
				<button
					type="button"
					onClick={() => setTip(null)}
					className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#043439] px-4 py-2 text-[0.76rem] font-semibold text-white shadow-lg"
				>
					{tip}
				</button>
			) : null}
		</div>
	);
}
