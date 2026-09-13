"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
	AI_PROMPT_SNIPPET,
	BRIEF_MD_RULES_TEXT,
	briefDocToSlice,
	bundleToActiveDoc,
	docToBundle,
	parseBriefMd,
	serializeBriefMd,
	type BriefLocale,
	type BriefMdBundle,
} from "../lib/brief-md";
import { makeEssay } from "../projects/make-essay";
import {
	universityDepartmentShowcases,
	universityProjectShowcases,
} from "../projects/university-showcases";
import { societyShowcases } from "../projects/society-showcases";
import { workCompanies, workShowcases } from "../projects/work-showcases";
import seedBriefs from "../../content/briefs.json";
import mediaList from "../../content/media.json";
import {
	AvatarEditor,
	type AvatarEditorHandle,
	type AvatarPreview,
} from "./AvatarEditor";

type CatalogEntry = {
	id: string;
	title: string;
	group: string;
	source: "showcase" | "company" | "helmet" | "diy" | "custom";
};

type CatalogPersist = {
	items: CatalogEntry[];
	hidden: string[];
	/** @deprecated legacy */
	order?: string[];
	customs?: CatalogEntry[];
};

const CATALOG_LS_KEY = "techfolio-studio-catalog-v1";
const LONG_PRESS_MS = 360;
const GROUPS = ["项目", "公司", "造物", "社会"] as const;

function buildCatalog(): CatalogEntry[] {
	const entries: CatalogEntry[] = [];
	for (const item of workShowcases) {
		entries.push({
			id: item.id,
			title: item.title,
			group: "项目",
			source: "showcase",
		});
	}
	for (const item of universityProjectShowcases.filter((p) =>
		["smart-clothes", "fire-warning"].includes(p.id),
	)) {
		entries.push({
			id: item.id,
			title: item.title,
			group: "项目",
			source: "showcase",
		});
	}
	for (const company of workCompanies) {
		entries.push({
			id: company.id,
			title: company.company,
			group: "公司",
			source: "company",
		});
	}
	const helmet = makeEssay.find((b) => b.type === "helmet");
	const diy = makeEssay.find((b) => b.type === "diy-wall");
	if (helmet) {
		entries.push({
			id: "smart-helmet",
			title: helmet.title,
			group: "造物",
			source: "helmet",
		});
	}
	if (diy) {
		entries.push({ id: "make-diy", title: "DIY", group: "造物", source: "diy" });
	}
	for (const item of [
		...universityProjectShowcases.filter((p) => p.id === "robotman"),
		...societyShowcases.filter((p) =>
			["volunteering", "exhibitions"].includes(p.id),
		),
	]) {
		entries.push({
			id: item.id,
			title: item.title,
			group: "社会",
			source: "showcase",
		});
	}
	entries.push({
		id: "campus-depts",
		title: "校园部门",
		group: "社会",
		source: "showcase",
	});
	return entries;
}

function hydrateCatalog(persist: CatalogPersist | null): {
	items: CatalogEntry[];
	hidden: string[];
} {
	const base = buildCatalog();
	const byId = new Map<string, CatalogEntry>(base.map((e) => [e.id, e]));
	for (const c of persist?.customs ?? []) {
		if (!c?.id) continue;
		byId.set(c.id, {
			id: c.id,
			title: c.title || "未命名",
			group: c.group || "项目",
			source: "custom",
		});
	}

	const hidden = new Set(persist?.hidden ?? []);

	if (persist?.items?.length) {
		const items: CatalogEntry[] = [];
		const seen = new Set<string>();
		for (const raw of persist.items) {
			if (!raw?.id || hidden.has(raw.id) || seen.has(raw.id)) continue;
			const baseE = byId.get(raw.id);
			if (raw.source === "custom" || raw.id.startsWith("custom_")) {
				items.push({
					id: raw.id,
					title: raw.title || "未命名",
					group: raw.group || "项目",
					source: "custom",
				});
				seen.add(raw.id);
				continue;
			}
			if (baseE) {
				items.push({
					...baseE,
					title: raw.title || baseE.title,
					group: raw.group || baseE.group,
				});
				seen.add(raw.id);
			}
		}
		for (const e of byId.values()) {
			if (seen.has(e.id) || hidden.has(e.id)) continue;
			items.push(e);
		}
		return { items, hidden: [...hidden] };
	}

	const order =
		persist?.order?.length && persist.order.length > 0
			? persist.order
			: base.map((e) => e.id);

	const items: CatalogEntry[] = [];
	const seen = new Set<string>();
	for (const id of order) {
		if (hidden.has(id) || seen.has(id)) continue;
		const e = byId.get(id);
		if (!e) continue;
		items.push(e);
		seen.add(id);
	}
	for (const e of byId.values()) {
		if (seen.has(e.id) || hidden.has(e.id)) continue;
		items.push(e);
		seen.add(e.id);
	}
	return { items, hidden: [...hidden] };
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
			{ id: newBlockId(), type: "text", text: "从这里开始写。" },
		],
	};
}

function toPersist(
	items: CatalogEntry[],
	hidden: string[],
): CatalogPersist {
	return {
		items: items.map((e) => ({
			id: e.id,
			title: e.title,
			group: e.group,
			source: e.source,
		})),
		hidden,
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
	const next = [...items];
	const [moved] = next.splice(from, 1);
	if (!moved) return items;
	const target = items[to]!;
	const updated = { ...moved, group: target.group };
	let insertAt = next.findIndex((e) => e.id === toId);
	if (insertAt < 0) return items;
	if (place === "after") insertAt += 1;
	next.splice(insertAt, 0, updated);
	return next;
}

function CatalogNav({
	items,
	activeId,
	onSelect,
	onReorder,
	onAdd,
	onRemove,
}: {
	items: CatalogEntry[];
	activeId: string;
	onSelect: (id: string) => void;
	onReorder: (
		fromId: string,
		toId: string,
		place: "before" | "after",
	) => void;
	onAdd: (group: string) => void;
	onRemove: (id: string) => void;
}) {
	const [dragId, setDragId] = useState<string | null>(null);
	const [over, setOver] = useState<{
		id: string;
		place: "before" | "after";
	} | null>(null);
	const pressTimer = useRef<number | null>(null);
	const dragIdRef = useRef<string | null>(null);
	const overRef = useRef<{ id: string; place: "before" | "after" } | null>(
		null,
	);
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
		setDragId(null);
		setOver(null);
		didDrag.current = false;
	};

	const setOverState = (v: { id: string; place: "before" | "after" } | null) => {
		overRef.current = v;
		setOver(v);
	};

	const groups = useMemo(() => {
		return GROUPS.map((g) => [g, items.filter((c) => c.group === g)] as const);
	}, [items]);

	return (
		<div className="flex h-full flex-col">
			<div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto p-2">
				{groups.map(([group, list]) => (
					<div key={group}>
						<div className="mb-0.5 flex items-center gap-1 px-1.5">
							<p className="min-w-0 flex-1 text-[0.56rem] font-semibold tracking-[0.14em] text-[#A0ADA9]">
								{group}
							</p>
							<button
								type="button"
								title={`在「${group}」增加一项`}
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
												if (target.closest("[data-nav-x]")) return;
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
												if (!tid || tid === dragIdRef.current) {
													setOverState(null);
													return;
												}
												const rect = row.getBoundingClientRect();
												const place =
													e.clientY < rect.top + rect.height / 2
														? "before"
														: "after";
												setOverState({ id: tid, place });
											}}
											onPointerUp={() => {
												clearPress();
												const from = dragIdRef.current;
												const drop = overRef.current;
												if (from && drop && didDrag.current) {
													onReorder(from, drop.id, drop.place);
													suppressClick.current = true;
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
												data-nav-x
												title="移出列表"
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
								<p className="px-2 py-1 text-[0.68rem] text-[#B0BBB7]">空</p>
							) : null}
						</ul>
					</div>
				))}
			</div>
			<p className="shrink-0 border-t border-[#0F4C45]/6 px-2.5 py-1.5 text-[0.6rem] leading-4 text-[#A0ADA9]">
				长按拖动排序 · 悬停 × 移除
			</p>
		</div>
	);
}

function loadDoc(entry: CatalogEntry, store: BriefStore): BriefDoc {
	if (store[entry.id]) return structuredClone(store[entry.id]!);

	if (entry.id === "campus-depts") {
		return {
			id: "campus-depts",
			title: "Campus Departments",
			subtitle: "国防教育教导队 · 无人机工作站",
			section: "Society · Departments",
			blocks: [
				{ id: newBlockId(), type: "kicker", text: "Society · Departments" },
				{ id: newBlockId(), type: "heading", text: "Campus Departments" },
				{
					id: newBlockId(),
					type: "subheading",
					text: "国防教育教导队 · 无人机工作站",
				},
				...universityDepartmentShowcases.flatMap((dept): BriefBlock[] => [
					{ id: newBlockId(), type: "heading", text: dept.title },
					{ id: newBlockId(), type: "subheading", text: dept.subtitle },
					{
						id: newBlockId(),
						type: "image",
						image: { src: dept.cardImage.src, alt: dept.cardImage.alt },
					},
					...(dept.preview ?? []).map(
						(text): BriefBlock => ({ id: newBlockId(), type: "text", text }),
					),
				]),
			],
		};
	}

	const item = [
		...workShowcases,
		...universityProjectShowcases,
		...universityDepartmentShowcases,
		...societyShowcases,
	].find((s) => s.id === entry.id);
	if (item) return briefFromShowcase(item, entry.group);

	if (entry.source === "company") {
		const company = workCompanies.find((c) => c.id === entry.id);
		if (company) {
			return {
				id: company.id,
				title: company.company,
				subtitle: company.companyZh,
				section: company.role,
				blocks: [
					{ id: newBlockId(), type: "heading", text: company.company },
					{ id: newBlockId(), type: "subheading", text: company.companyZh },
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
		if (h) {
			return {
				id: "smart-helmet",
				title: h.title,
				subtitle: h.titleZh,
				section: "MAKE",
				blocks: [
					{ id: newBlockId(), type: "heading", text: h.title },
					{ id: newBlockId(), type: "subheading", text: h.titleZh },
					{ id: newBlockId(), type: "text", text: h.pull },
					...h.body.map(
						(text): BriefBlock => ({ id: newBlockId(), type: "text", text }),
					),
					{
						id: newBlockId(),
						type: "duo",
						images: [
							{ src: h.images[0].src, alt: h.images[0].alt },
							{ src: h.images[1].src, alt: h.images[1].alt },
						],
					},
				],
			};
		}
	}

	if (entry.id === "make-diy") {
		const diy = makeEssay.find((b) => b.type === "diy-wall");
		if (diy) {
			return {
				id: "make-diy",
				title: diy.title,
				subtitle: diy.titleZh,
				section: "MAKE · DIY",
				blocks: [
					{ id: newBlockId(), type: "heading", text: diy.title },
					{ id: newBlockId(), type: "subheading", text: diy.titleZh },
					...diy.items.map(
						(it): BriefBlock => ({
							id: newBlockId(),
							type: "image",
							image: {
								src: it.image.src,
								alt: it.image.alt,
								caption: it.titleZh,
							},
						}),
					),
				],
			};
		}
	}

	return {
		id: entry.id,
		title: entry.title,
		blocks: [
			{ id: newBlockId(), type: "heading", text: entry.title },
			{ id: newBlockId(), type: "text", text: "点这里改文字" },
		],
	};
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
	placeholder = "点这里编辑",
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
}: {
	image: BriefImage;
	onPick: () => void;
	onCaption?: (v: string) => void;
}) {
	return (
		<figure className="group/img relative overflow-hidden bg-[#F5F5F3]">
			<button
				type="button"
				onClick={onPick}
				className="relative block aspect-[4/3] w-full cursor-pointer"
			>
				<Image
					src={image.src}
					alt={image.alt || ""}
					fill
					sizes="420px"
					className="object-cover"
				/>
				<span className="absolute inset-0 flex items-center justify-center bg-[#162b26]/0 text-[0.78rem] font-semibold text-white opacity-0 transition group-hover/img:bg-[#162b26]/35 group-hover/img:opacity-100">
					换图
				</span>
			</button>
			{onCaption ? (
				<LiveText
					value={image.caption ?? ""}
					onChange={onCaption}
					placeholder="图片说明"
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
				title="删除这块"
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
					placeholder={"每行一项"}
					className="mt-4 text-[1rem] leading-8 text-[#333]"
				/>
			) : null}
			{block.type === "image" ? (
				<div className="mt-7">
					<LiveImage
						image={block.image}
						onPick={() => onPick("src")}
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
	const [catalogReady, setCatalogReady] = useState(false);
	const [mode, setMode] = useState<"briefs" | "avatar">("briefs");
	const [store, setStore] = useState<BriefStore>(
		() => structuredClone(seedBriefs) as BriefStore,
	);
	const [activeId, setActiveId] = useState(
		() => hydrateCatalog(null).items[0]?.id ?? "zongheng-robot",
	);
	const [doc, setDoc] = useState<BriefDoc>(() => {
		const first = hydrateCatalog(null).items[0];
		if (!first) {
			return blankDoc("untitled", "未命名", "项目");
		}
		return loadDoc(first, structuredClone(seedBriefs) as BriefStore);
	});
	const [pickToken, setPickToken] = useState<string | null>(null);
	const [mediaQ, setMediaQ] = useState("");
	const [tip, setTip] = useState<string | null>(null);
	const [extraMedia, setExtraMedia] = useState<string[]>([]);
	const [uploading, setUploading] = useState(false);
	const filePickRef = useRef<HTMLInputElement>(null);
	const [mdPane, setMdPane] = useState(false);
	const [mdText, setMdText] = useState("");
	const [editLocale, setEditLocale] = useState<BriefLocale>("zh-Hans");
	const [mdSource, setMdSource] = useState<BriefLocale>("zh-Hans");
	const [mdBusy, setMdBusy] = useState(false);
	const mdBundleRef = useRef<BriefMdBundle | null>(null);
	const editLocaleRef = useRef<BriefLocale>("zh-Hans");
	const docRef = useRef(doc);
	docRef.current = doc;
	editLocaleRef.current = editLocale;
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
			setCatalogReady(true);
		};
		try {
			const raw = localStorage.getItem(CATALOG_LS_KEY);
			if (raw) {
				apply(JSON.parse(raw) as CatalogPersist);
				return () => {
					cancelled = true;
				};
			}
		} catch {
			/* ignore */
		}
		void fetch("/api/catalog/")
			.then((r) => (r.ok ? r.json() : null))
			.then((data) => apply((data as CatalogPersist) ?? null))
			.catch(() => apply(null));
		return () => {
			cancelled = true;
		};
	}, []);

	// Persist catalog (local + disk)
	useEffect(() => {
		if (!catalogReady) return;
		const payload = toPersist(catalog, hiddenIds);
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
	}, [catalog, hiddenIds, catalogReady]);

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

	useEffect(() => {
		if (!pickToken) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setPickToken(null);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [pickToken]);

	const reorderCatalog = useCallback(
		(fromId: string, toId: string, place: "before" | "after") => {
			setCatalog((prev) => moveCatalogItem(prev, fromId, toId, place));
		},
		[],
	);

	const addCatalogItem = useCallback((group: string) => {
		const id = `custom_${Date.now().toString(36)}`;
		const title = "未命名";
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
		setTip("已新增 · 中间改标题即可");
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
			const next = catalog.filter((c) => c.id !== id);
			setCatalog(next);
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
			setTip("已移除 · 点击可撤销");
			window.setTimeout(() => {
				if (undoRemoveRef.current?.entry.id === id) {
					setTip(null);
					undoRemoveRef.current = null;
				}
			}, 4000);
		},
		[activeId, catalog, store],
	);

	const undoRemove = useCallback(() => {
		const u = undoRemoveRef.current;
		if (!u) return;
		undoRemoveRef.current = null;
		setCatalog((prev) => {
			if (prev.some((c) => c.id === u.entry.id)) return prev;
			const next = [...prev];
			next.splice(Math.min(u.index, next.length), 0, u.entry);
			return next;
		});
		if (u.wasHidden) {
			setHiddenIds((h) => h.filter((x) => x !== u.entry.id));
		}
		setTip("已撤销");
		window.setTimeout(() => setTip(null), 1600);
	}, []);

	const setBlocks = (blocks: BriefBlock[]) => {
		setDoc((prev) => ({ ...prev, blocks }));
	};

	const applyImage = (path: string) => {
		if (!pickToken) return;
		const parts = pickToken.split("::");
		// formats: blockId::src | blockId::0 | blockId::childId::src
		if (parts.length === 2) {
			const [blockId, field] = parts;
			if (!blockId) return;
			setBlocks(
				patchBlock(doc.blocks, blockId, (block) => {
					if (block.type === "image") {
						return { ...block, image: { ...block.image, src: path } };
					}
					if (block.type === "duo" && (field === "0" || field === "1")) {
						const images = [...block.images] as typeof block.images;
						images[Number(field)] = {
							...images[Number(field)],
							src: path,
						};
						return { ...block, images };
					}
					return block;
				}),
			);
		} else if (parts.length === 3) {
			const [parentHint, childId, field] = parts;
			void parentHint;
			if (!childId) return;
			setBlocks(
				patchBlock(doc.blocks, childId, (block) => {
					if (block.type === "image") {
						return { ...block, image: { ...block.image, src: path } };
					}
					if (block.type === "duo" && (field === "0" || field === "1")) {
						const images = [...block.images] as typeof block.images;
						images[Number(field)] = {
							...images[Number(field)],
							src: path,
						};
						return { ...block, images };
					}
					return block;
				}),
			);
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
				throw new Error(data.error || "上传失败");
			}
			setExtraMedia((prev) =>
				prev.includes(data.path!) ? prev : [data.path!, ...prev],
			);
			applyImage(data.path);
			setTip("已从文件夹换上");
			window.setTimeout(() => setTip(null), 2000);
		} catch (err) {
			setTip(err instanceof Error ? err.message : "上传失败");
			window.setTimeout(() => setTip(null), 2800);
		} finally {
			setUploading(false);
			if (filePickRef.current) filePickRef.current.value = "";
		}
	};

	const flushDocIntoBundle = useCallback(
		(locale: BriefLocale, current: BriefDoc, source: BriefLocale) => {
			const prev = mdBundleRef.current;
			const base =
				prev && prev.id === current.id
					? prev
					: docToBundle(current, source, null);
			const next: BriefMdBundle = {
				...base,
				id: current.id,
				source_locale: source,
				locales: {
					...base.locales,
					[locale]: briefDocToSlice(current),
				},
			};
			mdBundleRef.current = next;
			return next;
		},
		[],
	);

	const loadLocaleDoc = useCallback(
		(bundle: BriefMdBundle, locale: BriefLocale) => {
			const next = bundleToActiveDoc(bundle, locale);
			setDoc(next);
			setStore((prev) => ({ ...prev, [next.id]: next }));
		},
		[],
	);

	const ensureBundleForDoc = useCallback(
		async (current: BriefDoc, preferred?: BriefLocale) => {
			let existing: BriefMdBundle | null = null;
			try {
				const res = await fetch(
					`/api/brief-md/?id=${encodeURIComponent(current.id)}`,
				);
				if (res.ok) {
					const data = (await res.json()) as { markdown?: string };
					if (data.markdown) existing = parseBriefMd(data.markdown);
				}
			} catch {
				/* ignore */
			}
			const source = preferred ?? existing?.source_locale ?? mdSource;
			const bundle = docToBundle(current, source, existing);
			mdBundleRef.current = bundle;
			setMdSource(bundle.source_locale);
			setMdText(serializeBriefMd(bundle));
			return bundle;
		},
		[mdSource],
	);

	const switchLocale = useCallback(
		(nextLocale: BriefLocale) => {
			if (nextLocale === editLocaleRef.current) return;
			const bundle = flushDocIntoBundle(
				editLocaleRef.current,
				docRef.current,
				mdSource,
			);
			setEditLocale(nextLocale);
			loadLocaleDoc(bundle, nextLocale);
			setMdText(serializeBriefMd(bundle));
		},
		[flushDocIntoBundle, loadLocaleDoc, mdSource],
	);

	const download = () => {
		downloadJson({ ...store, [doc.id]: doc });
		setTip("已下载 · 覆盖 content/briefs.json 即可");
		window.setTimeout(() => setTip(null), 2500);
	};

	const enterMdPane = async () => {
		setMdBusy(true);
		try {
			const bundle = flushDocIntoBundle(editLocale, doc, mdSource);
			mdBundleRef.current = bundle;
			setMdText(serializeBriefMd(bundle));
			setMdPane(true);
		} finally {
			setMdBusy(false);
		}
	};

	const leaveMdPane = () => {
		try {
			const parsed = parseBriefMd(mdText);
			mdBundleRef.current = parsed;
			setMdSource(parsed.source_locale);
			loadLocaleDoc(parsed, editLocale);
		} catch {
			/* keep doc */
		}
		setMdPane(false);
	};

	const exportMdDownload = () => {
		const bundle = flushDocIntoBundle(editLocale, doc, mdSource);
		const text = mdPane ? mdText : serializeBriefMd(bundle);
		const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${doc.id}.md`;
		a.click();
		URL.revokeObjectURL(url);
		setTip("已导出 MD");
		window.setTimeout(() => setTip(null), 2000);
	};

	const refreshMdFromPage = () => {
		const bundle = flushDocIntoBundle(editLocale, doc, mdSource);
		setMdText(serializeBriefMd(bundle));
		setTip("已从当前预览刷新 MD");
		window.setTimeout(() => setTip(null), 2000);
	};

	const copyRulesOnly = async () => {
		try {
			await navigator.clipboard.writeText(BRIEF_MD_RULES_TEXT);
			setTip("已复制规则 · 可发给其它 AI");
		} catch {
			setTip("复制失败");
		}
		window.setTimeout(() => setTip(null), 2200);
	};

	const copyRulesAndMd = async () => {
		const text = `${AI_PROMPT_SNIPPET}\n\n----\n\n${BRIEF_MD_RULES_TEXT}\n\n----\n\n${mdText}`;
		try {
			await navigator.clipboard.writeText(text);
			setTip("已复制：提示 + 规则 + MD");
		} catch {
			setTip("复制失败");
		}
		window.setTimeout(() => setTip(null), 2200);
	};

	const saveMdFile = async () => {
		setMdBusy(true);
		try {
			const parsed = parseBriefMd(mdText);
			mdBundleRef.current = parsed;
			const normalized = serializeBriefMd(parsed);
			setMdText(normalized);
			const res = await fetch("/api/brief-md/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id: parsed.id || doc.id,
					markdown: normalized,
				}),
			});
			const data = (await res.json()) as { path?: string; error?: string };
			if (!res.ok) throw new Error(data.error || "写入失败");
			setTip(`已写入 ${data.path}`);
		} catch (err) {
			setTip(err instanceof Error ? err.message : "写入失败");
		} finally {
			setMdBusy(false);
			window.setTimeout(() => setTip(null), 2500);
		}
	};

	const importMdReplace = async () => {
		setMdBusy(true);
		try {
			const parsed = parseBriefMd(mdText);
			const normalized = serializeBriefMd(parsed);
			mdBundleRef.current = parsed;
			setMdText(normalized);
			setMdSource(parsed.source_locale);
			const loc = parsed.locales[editLocale]
				? editLocale
				: parsed.source_locale;
			setEditLocale(loc);
			loadLocaleDoc(parsed, loc);
			await fetch("/api/brief-md/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id: parsed.id || doc.id,
					markdown: normalized,
				}),
			});
			setTip("已导入替换 · 右侧实时预览已更新");
			setMdPane(false);
		} catch (err) {
			setTip(err instanceof Error ? err.message : "解析失败");
		} finally {
			setMdBusy(false);
			window.setTimeout(() => setTip(null), 2500);
		}
	};

	// MD 编辑时实时预览
	useEffect(() => {
		if (!mdPane) return;
		const t = window.setTimeout(() => {
			try {
				const parsed = parseBriefMd(mdText);
				mdBundleRef.current = parsed;
				loadLocaleDoc(parsed, editLocaleRef.current);
			} catch {
				/* 输入不完整时忽略 */
			}
		}, 480);
		return () => window.clearTimeout(t);
	}, [mdText, mdPane, loadLocaleDoc]);

	// 切换卡片时带上 MD 包
	const switchCard = (id: string) => {
		if (id === activeId) return;
		const entry = catalog.find((c) => c.id === id);
		if (!entry) return;
		flushDocIntoBundle(editLocale, doc, mdSource);
		setActiveId(id);
		const nextDoc = loadDoc(entry, store);
		setDoc(nextDoc);
		setMdPane(false);
		void ensureBundleForDoc(nextDoc).then((bundle) => {
			const loc = bundle.locales[editLocale]
				? editLocale
				: bundle.source_locale;
			setEditLocale(loc);
			if (bundle.locales[loc]) loadLocaleDoc(bundle, loc);
		});
	};

	const hasKicker = doc.blocks.some((b) => b.type === "kicker");
	const hasHeading = doc.blocks.some((b) => b.type === "heading");
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
						详情
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
						头像
					</button>
				</div>

				<div className="hidden min-w-0 flex-1 items-center gap-2 sm:flex">
					{mode === "briefs" ? (
						<>
							<div className="flex items-center gap-0.5 rounded-full bg-white/70 p-0.5 ring-1 ring-[#0F4C45]/8">
								{(
									[
										["zh-Hans", "简"],
										["en", "EN"],
										["zh-Hant", "繁"],
									] as const
								).map(([id, label]) => (
									<button
										key={id}
										type="button"
										onClick={() => switchLocale(id)}
										className={`rounded-full px-2.5 py-0.5 text-[0.68rem] font-semibold transition ${
											editLocale === id
												? "bg-[#043439] text-white"
												: "text-[#0F4C45]/70 hover:text-[#0F4C45]"
										}`}
									>
										{label}
									</button>
								))}
							</div>
							<span className="min-w-0 truncate text-[0.75rem] text-[#6A7A76]">
								{doc.title}
							</span>
						</>
					) : (
						<span className="truncate text-[0.75rem] text-[#6A7A76]">头像</span>
					)}
				</div>

				<div className="ml-auto flex items-center gap-1">
					{mode === "briefs" ? (
						<>
							{!mdPane ? (
								<div className="mr-0.5 hidden items-center gap-0.5 md:flex">
									{(
										[
											["heading", "标题"],
											["text", "正文"],
											["image", "图"],
											["duo", "双图"],
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
							) : null}
							<button
								type="button"
								onClick={() =>
									mdPane ? leaveMdPane() : void enterMdPane()
								}
								className={`rounded-full px-2.5 py-1 text-[0.7rem] font-semibold ${
									mdPane
										? "bg-[#0F4C45]/12 text-[#043439]"
										: "text-[#0F4C45] hover:bg-white/70"
								}`}
							>
								{mdPane ? "编辑" : "MD"}
							</button>
							<button
								type="button"
								onClick={exportMdDownload}
								className="rounded-full px-2.5 py-1 text-[0.7rem] font-semibold text-[#0F4C45] hover:bg-white/70"
							>
								导出MD
							</button>
							<button
								type="button"
								onClick={download}
								className="rounded-full bg-[#043439] px-3 py-1 text-[0.7rem] font-semibold text-white"
							>
								保存
							</button>
						</>
					) : (
						<>
							<button
								type="button"
								onClick={() => avatarRef.current?.pickFile()}
								className="rounded-full px-2.5 py-1 text-[0.7rem] font-semibold text-[#0F4C45] hover:bg-white/70"
							>
								上传
							</button>
							<button
								type="button"
								onClick={() => avatarRef.current?.save()}
								className="rounded-full bg-[#043439] px-3 py-1 text-[0.7rem] font-semibold text-white"
							>
								保存
							</button>
						</>
					)}
					<Link
						href="/#home"
						className="rounded-full px-2 py-1 text-[0.7rem] font-medium text-[#8A9692] hover:text-[#0F4C45]"
					>
						回站
					</Link>
				</div>
			</header>

			<div className="studio-workspace flex min-h-0 flex-1 gap-2.5 p-2.5 pt-2 sm:gap-3.5 sm:p-3.5 sm:pt-2.5">
				{/* Left nav card */}
				<aside className="studio-panel studio-panel--nav hidden w-[12rem] shrink-0 flex-col overflow-hidden lg:flex xl:w-[13rem]">
					{mode === "briefs" ? (
						<CatalogNav
							items={catalog}
							activeId={activeId}
							onSelect={switchCard}
							onReorder={reorderCatalog}
							onAdd={addCatalogItem}
							onRemove={removeCatalogItem}
						/>
					) : (
						<p className="px-3 py-4 text-[0.74rem] leading-5 text-[#6A7A76]">
							中间拖动调位置，右侧看首页圆形效果。
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
									onPreviewChange={onAvatarPreview}
									onTip={setTip}
								/>
							</div>
						) : mdPane ? (
							<div className="flex h-full min-h-0">
								{/* Rules column */}
								<aside className="hidden w-[13.5rem] shrink-0 flex-col border-r border-[#0F4C45]/8 bg-[#F7F1E8]/70 md:flex">
									<div className="flex items-center justify-between gap-1 border-b border-[#0F4C45]/8 px-3 py-2">
										<p className="text-[0.72rem] font-semibold text-[#0F4C45]">
											规则
										</p>
										<button
											type="button"
											onClick={() => void copyRulesOnly()}
											className="rounded-full bg-white px-2 py-0.5 text-[0.65rem] font-semibold text-[#043439] ring-1 ring-[#0F4C45]/12"
										>
											复制规则
										</button>
									</div>
									<div className="min-h-0 flex-1 overflow-y-auto px-3 py-2 text-[0.65rem] leading-4 text-[#5A6B67] whitespace-pre-wrap">
										{BRIEF_MD_RULES_TEXT}
									</div>
								</aside>

								<div className="flex min-w-0 flex-1 flex-col">
									<div className="flex shrink-0 flex-wrap items-center gap-1.5 border-b border-[#0F4C45]/8 px-3 py-2">
										<label className="mr-1 flex items-center gap-1 text-[0.68rem] text-[#6A7A76]">
											主语言
											<select
												value={mdSource}
												onChange={(e) => {
													const v = e.target.value as BriefLocale;
													setMdSource(v);
													if (mdBundleRef.current) {
														mdBundleRef.current = {
															...mdBundleRef.current,
															source_locale: v,
														};
													}
												}}
												className="rounded-md bg-white px-1.5 py-0.5 text-[0.68rem] outline-none ring-1 ring-[#0F4C45]/10"
											>
												<option value="zh-Hans">简体</option>
												<option value="en">EN</option>
												<option value="zh-Hant">繁体</option>
											</select>
										</label>
										<button
											type="button"
											disabled={mdBusy}
											onClick={refreshMdFromPage}
											className="rounded-full bg-white px-2 py-0.5 text-[0.65rem] font-semibold text-[#0F4C45] ring-1 ring-[#0F4C45]/10"
										>
											从预览刷新
										</button>
										<button
											type="button"
											className="rounded-full bg-white px-2 py-0.5 text-[0.65rem] font-semibold text-[#0F4C45] ring-1 ring-[#0F4C45]/10 md:hidden"
											onClick={() => void copyRulesOnly()}
										>
											复制规则
										</button>
										<button
											type="button"
											disabled={mdBusy}
											onClick={() => void copyRulesAndMd()}
											className="rounded-full bg-white px-2 py-0.5 text-[0.65rem] font-semibold text-[#0F4C45] ring-1 ring-[#0F4C45]/10"
										>
											复制规则+MD
										</button>
										<button
											type="button"
											disabled={mdBusy}
											onClick={exportMdDownload}
											className="rounded-full bg-white px-2 py-0.5 text-[0.65rem] font-semibold text-[#0F4C45] ring-1 ring-[#0F4C45]/10"
										>
											导出MD
										</button>
										<button
											type="button"
											disabled={mdBusy}
											onClick={() => void saveMdFile()}
											className="rounded-full bg-white px-2 py-0.5 text-[0.65rem] font-semibold text-[#0F4C45] ring-1 ring-[#0F4C45]/10"
										>
											写入文件
										</button>
										<button
											type="button"
											disabled={mdBusy}
											onClick={() => void importMdReplace()}
											className="rounded-full bg-[#043439] px-2.5 py-0.5 text-[0.65rem] font-semibold text-white"
										>
											导入替换
										</button>
									</div>
									<textarea
										value={mdText}
										onChange={(e) => setMdText(e.target.value)}
										spellCheck={false}
										className="min-h-0 flex-1 resize-none bg-[#FFFCFA] p-3 font-mono text-[0.72rem] leading-5 text-[#162b26] outline-none"
										placeholder="粘贴 AI 返回的 MD，或在此编辑… 右侧实时预览"
									/>
								</div>
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

									{/* mobile locale */}
									<div className="mb-4 flex items-center gap-0.5 rounded-full bg-[#F7F1E8] p-0.5 sm:hidden">
										{(
											[
												["zh-Hans", "简"],
												["en", "EN"],
												["zh-Hant", "繁"],
											] as const
										).map(([id, label]) => (
											<button
												key={id}
												type="button"
												onClick={() => switchLocale(id)}
												className={`flex-1 rounded-full py-1.5 text-[0.72rem] font-semibold ${
													editLocale === id
														? "bg-[#043439] text-white"
														: "text-[#0F4C45]/75"
												}`}
											>
												{label}
											</button>
										))}
									</div>

									<div className="space-y-1">
										{!hasKicker && doc.section ? (
											<LiveText
												value={doc.section}
												onChange={(section) =>
													setDoc((p) => ({ ...p, section }))
												}
												className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#8A9692]"
											/>
										) : null}
										{!hasHeading ? (
											<>
												<LiveText
													value={doc.title}
													onChange={(title) =>
														setDoc((p) => ({ ...p, title }))
													}
													className="mt-3 text-[1.5rem] font-extrabold tracking-tight text-[#162b26]"
												/>
												<LiveText
													value={doc.subtitle ?? ""}
													onChange={(subtitle) =>
														setDoc((p) => ({ ...p, subtitle }))
													}
													className="mt-1.5 text-[0.92rem] text-[#6A7A76]"
													placeholder="副标题"
												/>
											</>
										) : null}

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
												["heading", "标题"],
												["text", "正文"],
												["image", "图"],
												["duo", "双图"],
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
									首页
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
							<div className="studio-preview-drawer flex max-h-[min(100%,42rem)] w-full max-w-[26rem] flex-col overflow-hidden 2xl:max-w-[30rem]">
								<div className="flex shrink-0 items-center justify-between px-5 py-3">
									<p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#0F4C45]/45">
										Brief ·{" "}
										{editLocale === "zh-Hans"
											? "简"
											: editLocale === "zh-Hant"
												? "繁"
												: "EN"}
									</p>
									<span className="text-[0.72rem] font-medium text-[#0F4C45]/30">
										实时预览
									</span>
								</div>
								<div className="mx-4 mb-2 h-px bg-[#0F4C45]/[0.08]" />
								<div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-1 pb-2">
									<div className="studio-preview-body">
										<BriefDocument doc={doc} />
									</div>
								</div>
							</div>
						)}
					</div>
				</aside>
			</div>

			{pickToken ? (
				<div className="fixed inset-0 z-50 flex items-end justify-center bg-[#162b26]/35 backdrop-blur-[2px] sm:items-center sm:p-4">
					<div className="flex max-h-[82vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-[#F7F1E8] shadow-2xl sm:rounded-2xl">
						<div className="flex items-center justify-between px-4 py-3">
							<p className="text-[0.9rem] font-semibold text-[#0F4C45]">换图</p>
							<button
								type="button"
								onClick={() => setPickToken(null)}
								className="text-[0.78rem] font-semibold text-[#6A7A76]"
							>
								关闭
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
								{uploading ? "上传中…" : "从文件夹选择"}
							</button>
							<p className="mt-2 text-center text-[0.7rem] text-[#8A9692]">
								打开本机文件夹 · 不在图库里的图也能用
							</p>
						</div>

						<div className="mx-4 mb-2 flex items-center gap-2">
							<div className="h-px flex-1 bg-[#0F4C45]/10" />
							<span className="text-[0.65rem] font-semibold tracking-[0.12em] text-[#9AA8A4]">
								或从图库选
							</span>
							<div className="h-px flex-1 bg-[#0F4C45]/10" />
						</div>

						<input
							value={mediaQ}
							onChange={(e) => setMediaQ(e.target.value)}
							placeholder="搜索图库"
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

			{tip ? (
				<button
					type="button"
					onClick={() => {
						if (undoRemoveRef.current) undoRemove();
						else setTip(null);
					}}
					className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#043439] px-4 py-2 text-[0.76rem] font-semibold text-white shadow-lg"
				>
					{tip}
				</button>
			) : null}
		</div>
	);
}
