"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BriefDocument } from "../components/BriefDocument";
import { briefFromShowcase } from "../lib/brief-from-legacy";
import {
	BLOCK_LABELS,
	createEmptyBlock,
	newBlockId,
	type BriefBlock,
	type BriefDoc,
	type BriefStore,
} from "../lib/brief-types";
import { makeEssay } from "../projects/make-essay";
import {
	universityDepartmentShowcases,
	universityProjectShowcases,
} from "../projects/university-showcases";
import { societyShowcases } from "../projects/society-showcases";
import { workCompanies, workShowcases } from "../projects/work-showcases";
import seedBriefs from "../../content/briefs.json";
import mediaList from "../../content/media.json";

type CatalogEntry = {
	id: string;
	title: string;
	section: string;
	source: "override" | "showcase" | "company" | "helmet" | "diy";
};

const WORK_PRODUCT_IDS = new Set(["zongheng-robot", "rtk", "agv"]);

function buildCatalog(store: BriefStore): CatalogEntry[] {
	const entries: CatalogEntry[] = [];

	for (const item of [
		...workShowcases,
		...universityProjectShowcases.filter((p) =>
			["smart-clothes", "fire-warning", "robotman"].includes(p.id),
		),
		...universityDepartmentShowcases,
		...societyShowcases.filter((p) =>
			["volunteering", "exhibitions"].includes(p.id),
		),
	]) {
		entries.push({
			id: item.id,
			title: item.title,
			section: WORK_PRODUCT_IDS.has(item.id)
				? "Work · Product"
				: item.id === "robotman"
					? "Society · Team"
					: ["volunteering", "exhibitions"].includes(item.id)
						? "Society"
						: "University",
			source: store[item.id] ? "override" : "showcase",
		});
	}

	for (const company of workCompanies) {
		entries.push({
			id: company.id,
			title: company.company,
			section: company.role,
			source: store[company.id] ? "override" : "company",
		});
	}

	const helmet = makeEssay.find((b) => b.type === "helmet");
	const diy = makeEssay.find((b) => b.type === "diy-wall");
	if (helmet) {
		entries.push({
			id: "smart-helmet",
			title: helmet.title,
			section: "MAKE · Venture",
			source: store["smart-helmet"] ? "override" : "helmet",
		});
	}
	if (diy) {
		entries.push({
			id: "make-diy",
			title: "DIY",
			section: "MAKE · Bench",
			source: store["make-diy"] ? "override" : "diy",
		});
	}

	return entries;
}

function docFromCatalog(entry: CatalogEntry, store: BriefStore): BriefDoc {
	if (store[entry.id]) return structuredClone(store[entry.id]);

	if (entry.source === "showcase" || entry.id) {
		const item = [
			...workShowcases,
			...universityProjectShowcases,
			...universityDepartmentShowcases,
			...societyShowcases,
		].find((s) => s.id === entry.id);
		if (item) return briefFromShowcase(item, entry.section);
	}

	if (entry.source === "company") {
		const company = workCompanies.find((c) => c.id === entry.id);
		if (company) {
			return {
				id: company.id,
				title: company.company,
				subtitle: company.companyZh,
				section: company.role,
				blocks: [
					{ id: newBlockId(), type: "kicker", text: company.role },
					{ id: newBlockId(), type: "heading", text: company.company },
					{
						id: newBlockId(),
						type: "subheading",
						text: company.companyZh,
					},
					{
						id: newBlockId(),
						type: "image",
						image: {
							src: company.image.src,
							alt: company.image.alt,
							caption:
								"caption" in company.image
									? String(company.image.caption ?? "")
									: undefined,
						},
					},
					...company.brief.map(
						(text): BriefBlock => ({
							id: newBlockId(),
							type: "text",
							text,
						}),
					),
					{
						id: newBlockId(),
						type: "list",
						items: [...company.highlights],
					},
				],
			};
		}
	}

	if (entry.id === "smart-helmet") {
		const helmet = makeEssay.find((b) => b.type === "helmet");
		if (helmet) {
			return {
				id: "smart-helmet",
				title: helmet.title,
				subtitle: helmet.titleZh,
				section: "MAKE · Venture",
				blocks: [
					{ id: newBlockId(), type: "kicker", text: "MAKE · Venture" },
					{ id: newBlockId(), type: "heading", text: helmet.title },
					{
						id: newBlockId(),
						type: "subheading",
						text: helmet.titleZh,
					},
					{ id: newBlockId(), type: "pull", text: helmet.pull },
					...helmet.body.map(
						(text): BriefBlock => ({
							id: newBlockId(),
							type: "text",
							text,
						}),
					),
					{
						id: newBlockId(),
						type: "duo",
						images: [
							{
								src: helmet.images[0].src,
								alt: helmet.images[0].alt,
								caption: helmet.images[0].caption,
							},
							{
								src: helmet.images[1].src,
								alt: helmet.images[1].alt,
								caption: helmet.images[1].caption,
							},
						],
					},
				],
			};
		}
	}

	if (entry.id === "make-diy") {
		const diy = makeEssay.find((b) => b.type === "diy-wall");
		if (diy) {
			const blocks: BriefBlock[] = [
				{ id: newBlockId(), type: "kicker", text: "MAKE · DIY" },
				{ id: newBlockId(), type: "heading", text: diy.title },
				{ id: newBlockId(), type: "subheading", text: diy.titleZh },
				{ id: newBlockId(), type: "text", text: diy.lede },
			];
			for (const item of diy.items) {
				blocks.push({
					id: newBlockId(),
					type: "heading",
					text: item.title,
				});
				blocks.push({
					id: newBlockId(),
					type: "subheading",
					text: item.titleZh,
				});
				blocks.push({
					id: newBlockId(),
					type: "image",
					image: {
						src: item.image.src,
						alt: item.image.alt,
					},
				});
			}
			return {
				id: "make-diy",
				title: diy.title,
				subtitle: diy.titleZh,
				section: "MAKE · Bench",
				blocks,
			};
		}
	}

	return {
		id: entry.id,
		title: entry.title,
		section: entry.section,
		blocks: [
			{ id: newBlockId(), type: "kicker", text: entry.section },
			{ id: newBlockId(), type: "heading", text: entry.title },
			{
				id: newBlockId(),
				type: "text",
				text: "Start writing this brief.",
			},
		],
	};
}

function downloadJson(filename: string, data: unknown) {
	const blob = new Blob([`${JSON.stringify(data, null, "\t")}\n`], {
		type: "application/json",
	});
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = filename;
	anchor.click();
	URL.revokeObjectURL(url);
}

function updateBlock(
	blocks: BriefBlock[],
	blockId: string,
	updater: (block: BriefBlock) => BriefBlock,
): BriefBlock[] {
	return blocks.map((block) => {
		if (block.id === blockId) return updater(block);
		if (block.type === "tabs") {
			return {
				...block,
				tabs: block.tabs.map((tab) => ({
					...tab,
					blocks: updateBlock(tab.blocks, blockId, updater),
				})),
			};
		}
		return block;
	});
}

function removeBlock(blocks: BriefBlock[], blockId: string): BriefBlock[] {
	return blocks
		.filter((block) => block.id !== blockId)
		.map((block) => {
			if (block.type !== "tabs") return block;
			return {
				...block,
				tabs: block.tabs.map((tab) => ({
					...tab,
					blocks: removeBlock(tab.blocks, blockId),
				})),
			};
		});
}

function moveBlock(
	blocks: BriefBlock[],
	blockId: string,
	dir: -1 | 1,
): BriefBlock[] {
	const index = blocks.findIndex((block) => block.id === blockId);
	if (index >= 0) {
		const next = index + dir;
		if (next < 0 || next >= blocks.length) return blocks;
		const copy = [...blocks];
		const [item] = copy.splice(index, 1);
		copy.splice(next, 0, item!);
		return copy;
	}
	return blocks.map((block) => {
		if (block.type !== "tabs") return block;
		return {
			...block,
			tabs: block.tabs.map((tab) => ({
				...tab,
				blocks: moveBlock(tab.blocks, blockId, dir),
			})),
		};
	});
}

export function StudioApp() {
	const [store, setStore] = useState<BriefStore>(
		() => structuredClone(seedBriefs) as BriefStore,
	);
	const catalog = useMemo(() => buildCatalog(store), [store]);
	const [activeId, setActiveId] = useState(catalog[0]?.id ?? "zongheng-robot");
	const [draft, setDraft] = useState<BriefDoc>(() =>
		docFromCatalog(catalog[0]!, store),
	);
	const [mediaFilter, setMediaFilter] = useState("");
	const [pickingFor, setPickingFor] = useState<string | null>(null);

	const media = mediaList as string[];
	const filteredMedia = useMemo(() => {
		const q = mediaFilter.trim().toLowerCase();
		if (!q) return media.slice(0, 48);
		return media.filter((path) => path.toLowerCase().includes(q)).slice(0, 48);
	}, [media, mediaFilter]);

	const selectEntry = (id: string) => {
		const entry = catalog.find((item) => item.id === id);
		if (!entry) return;
		setActiveId(id);
		setDraft(docFromCatalog(entry, store));
		setPickingFor(null);
	};

	const saveDraftToStore = () => {
		setStore((prev) => ({ ...prev, [draft.id]: structuredClone(draft) }));
	};

	const exportStore = () => {
		const next = { ...store, [draft.id]: draft };
		setStore(next);
		downloadJson("briefs.json", next);
	};

	const setBlocks = (blocks: BriefBlock[]) => {
		setDraft((prev) => ({ ...prev, blocks }));
	};

	return (
		<div className="min-h-screen bg-[#F3EEE6] text-[#162b26]">
			<header className="sticky top-0 z-20 border-b border-[#0F4C45]/10 bg-[#F7F1E8]/95 backdrop-blur">
				<div className="mx-auto flex max-w-[90rem] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
					<div>
						<p className="font-mono text-[0.58rem] tracking-[0.22em] text-[#0F4C45]/55">
							CONTENT STUDIO
						</p>
						<h1 className="text-[1.05rem] font-semibold tracking-tight">
							Briefs · images · copy · layout
						</h1>
					</div>
					<div className="flex flex-wrap items-center gap-2">
						<button
							type="button"
							onClick={saveDraftToStore}
							className="rounded-full border border-[#0F4C45]/15 px-3.5 py-1.5 text-[0.78rem] font-semibold text-[#0F4C45] hover:bg-[#0F4C45]/08"
						>
							Apply
						</button>
						<button
							type="button"
							onClick={exportStore}
							className="rounded-full bg-[#0F4C45] px-3.5 py-1.5 text-[0.78rem] font-semibold text-[#F7F1E8] hover:bg-[#0c3d37]"
						>
							Download briefs.json
						</button>
						<Link
							href="/#about"
							className="rounded-full px-3 py-1.5 text-[0.78rem] font-semibold text-[#5C6F6A] hover:text-[#0F4C45]"
						>
							← Site
						</Link>
					</div>
				</div>
				<p className="mx-auto max-w-[90rem] px-4 pb-3 text-[0.75rem] leading-5 text-[#6A7A76] sm:px-6">
					Edit blocks on the left, preview on the right. Download{" "}
					<code className="rounded bg-black/5 px-1">briefs.json</code> and replace{" "}
					<code className="rounded bg-black/5 px-1">content/briefs.json</code>,
					then refresh the site.
				</p>
			</header>

			<div className="mx-auto grid max-w-[90rem] gap-4 px-4 py-4 lg:grid-cols-[14rem_minmax(0,1fr)_minmax(0,1.1fr)] sm:px-6">
				<aside className="max-h-[calc(100vh-8rem)] overflow-y-auto rounded-xl border border-[#0F4C45]/10 bg-white/70 p-3">
					<p className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#8A9692]">
						Cards
					</p>
					<ul className="space-y-1">
						{catalog.map((entry) => (
							<li key={entry.id}>
								<button
									type="button"
									onClick={() => selectEntry(entry.id)}
									className={`w-full rounded-lg px-2.5 py-2 text-left transition-colors ${
										activeId === entry.id
											? "bg-[#0F4C45] text-[#F7F1E8]"
											: "hover:bg-[#0F4C45]/06"
									}`}
								>
									<span className="block text-[0.8rem] font-semibold">
										{entry.title}
									</span>
									<span
										className={`mt-0.5 block text-[0.62rem] ${
											activeId === entry.id
												? "text-white/70"
												: "text-[#8A9692]"
										}`}
									>
										{store[entry.id] ? "Editable override" : "From source"}
									</span>
								</button>
							</li>
						))}
					</ul>
				</aside>

				<section className="max-h-[calc(100vh-8rem)] space-y-3 overflow-y-auto rounded-xl border border-[#0F4C45]/10 bg-white/80 p-4">
					<div className="grid gap-2 sm:grid-cols-2">
						<label className="block text-[0.72rem] font-semibold text-[#5C6F6A]">
							Title
							<input
								value={draft.title}
								onChange={(event) =>
									setDraft((prev) => ({ ...prev, title: event.target.value }))
								}
								className="mt-1 w-full rounded-lg border border-[#0F4C45]/15 bg-white px-3 py-2 text-[0.9rem] text-[#162b26]"
							/>
						</label>
						<label className="block text-[0.72rem] font-semibold text-[#5C6F6A]">
							Subtitle
							<input
								value={draft.subtitle ?? ""}
								onChange={(event) =>
									setDraft((prev) => ({
										...prev,
										subtitle: event.target.value,
									}))
								}
								className="mt-1 w-full rounded-lg border border-[#0F4C45]/15 bg-white px-3 py-2 text-[0.9rem] text-[#162b26]"
							/>
						</label>
						<label className="block text-[0.72rem] font-semibold text-[#5C6F6A] sm:col-span-2">
							Section label
							<input
								value={draft.section ?? ""}
								onChange={(event) =>
									setDraft((prev) => ({
										...prev,
										section: event.target.value,
									}))
								}
								className="mt-1 w-full rounded-lg border border-[#0F4C45]/15 bg-white px-3 py-2 text-[0.9rem] text-[#162b26]"
							/>
						</label>
					</div>

					<div className="flex flex-wrap gap-1.5 border-y border-[#0F4C45]/08 py-3">
						{(
							Object.keys(BLOCK_LABELS) as BriefBlock["type"][]
						).map((type) => (
							<button
								key={type}
								type="button"
								onClick={() =>
									setBlocks([...draft.blocks, createEmptyBlock(type)])
								}
								className="rounded-full border border-[#0F4C45]/12 px-2.5 py-1 text-[0.68rem] font-semibold text-[#0F4C45] hover:bg-[#0F4C45]/08"
							>
								+ {BLOCK_LABELS[type]}
							</button>
						))}
					</div>

					<div className="space-y-3">
						{draft.blocks.map((block, index) => (
							<BlockEditor
								key={block.id}
								block={block}
								index={index}
								onChange={(next) =>
									setBlocks(
										updateBlock(draft.blocks, block.id, () => next),
									)
								}
								onRemove={() => setBlocks(removeBlock(draft.blocks, block.id))}
								onMove={(dir) =>
									setBlocks(moveBlock(draft.blocks, block.id, dir))
								}
								onPickImage={(token) => setPickingFor(token)}
								onNestedChange={(blocks) => setBlocks(blocks)}
								allBlocks={draft.blocks}
							/>
						))}
					</div>

					{pickingFor ? (
						<div className="rounded-xl border border-[#0F4C45]/15 bg-[#F7F1E8] p-3">
							<div className="mb-2 flex items-center justify-between gap-2">
								<p className="text-[0.72rem] font-semibold text-[#0F4C45]">
									Pick image
								</p>
								<button
									type="button"
									onClick={() => setPickingFor(null)}
									className="text-[0.72rem] font-semibold text-[#6A7A76]"
								>
									Close
								</button>
							</div>
							<input
								value={mediaFilter}
								onChange={(event) => setMediaFilter(event.target.value)}
								placeholder="Filter paths…"
								className="mb-2 w-full rounded-lg border border-[#0F4C45]/15 bg-white px-3 py-2 text-[0.8rem]"
							/>
							<div className="grid max-h-64 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
								{filteredMedia.map((path) => (
									<button
										key={path}
										type="button"
										onClick={() => {
											const [blockId, field] = pickingFor.split("::");
											if (!blockId) return;
											setBlocks(
												updateBlock(draft.blocks, blockId, (block) => {
													if (block.type === "image" && field === "src") {
														return {
															...block,
															image: { ...block.image, src: path },
														};
													}
													if (
														block.type === "duo" &&
														(field === "0" || field === "1")
													) {
														const images = [...block.images] as [
															(typeof block.images)[0],
															(typeof block.images)[0],
														];
														const idx = Number(field);
														images[idx] = { ...images[idx], src: path };
														return { ...block, images };
													}
													return block;
												}),
											);
											setPickingFor(null);
										}}
										className="overflow-hidden rounded-md border border-[#0F4C45]/10 bg-white text-left hover:border-[#0F4C45]/35"
									>
										<div className="relative aspect-square">
											<Image
												src={path}
												alt=""
												fill
												sizes="120px"
												className="object-cover"
											/>
										</div>
										<span className="block truncate px-1 py-1 text-[0.58rem] text-[#6A7A76]">
											{path.split("/").pop()}
										</span>
									</button>
								))}
							</div>
						</div>
					) : null}
				</section>

				<section className="max-h-[calc(100vh-8rem)] overflow-y-auto rounded-xl border border-[#0F4C45]/10 bg-[#E8E2D8] p-3">
					<p className="mb-2 px-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#8A9692]">
						Live preview
					</p>
					<div className="overflow-hidden rounded-lg shadow-[0_20px_50px_rgba(22,43,38,0.12)]">
						<BriefDocument doc={draft} />
					</div>
				</section>
			</div>
		</div>
	);
}

function BlockEditor({
	block,
	index,
	onChange,
	onRemove,
	onMove,
	onPickImage,
	onNestedChange,
	allBlocks,
}: {
	block: BriefBlock;
	index: number;
	onChange: (block: BriefBlock) => void;
	onRemove: () => void;
	onMove: (dir: -1 | 1) => void;
	onPickImage: (token: string) => void;
	onNestedChange: (blocks: BriefBlock[]) => void;
	allBlocks: BriefBlock[];
}) {
	return (
		<div className="rounded-xl border border-[#0F4C45]/12 bg-[#FBF8F3] p-3">
			<div className="mb-2 flex items-center justify-between gap-2">
				<p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#0F4C45]/70">
					{index + 1}. {BLOCK_LABELS[block.type]}
				</p>
				<div className="flex gap-1">
					<button
						type="button"
						onClick={() => onMove(-1)}
						className="rounded px-2 py-0.5 text-[0.68rem] font-semibold text-[#5C6F6A] hover:bg-black/5"
					>
						↑
					</button>
					<button
						type="button"
						onClick={() => onMove(1)}
						className="rounded px-2 py-0.5 text-[0.68rem] font-semibold text-[#5C6F6A] hover:bg-black/5"
					>
						↓
					</button>
					<button
						type="button"
						onClick={onRemove}
						className="rounded px-2 py-0.5 text-[0.68rem] font-semibold text-[#9b4a3c] hover:bg-[#9b4a3c]/10"
					>
						Delete
					</button>
				</div>
			</div>

			{block.type === "kicker" ||
			block.type === "heading" ||
			block.type === "subheading" ||
			block.type === "pull" ||
			block.type === "text" ? (
				<textarea
					value={block.text}
					onChange={(event) =>
						onChange({ ...block, text: event.target.value })
					}
					rows={block.type === "text" || block.type === "pull" ? 3 : 2}
					className="w-full rounded-lg border border-[#0F4C45]/12 bg-white px-3 py-2 text-[0.88rem] leading-6"
				/>
			) : null}

			{block.type === "list" ? (
				<textarea
					value={block.items.join("\n")}
					onChange={(event) =>
						onChange({
							...block,
							items: event.target.value.split("\n").filter(Boolean),
						})
					}
					rows={4}
					className="w-full rounded-lg border border-[#0F4C45]/12 bg-white px-3 py-2 text-[0.88rem] leading-6"
					placeholder="One item per line"
				/>
			) : null}

			{block.type === "image" ? (
				<div className="space-y-2">
					<div className="flex gap-2">
						<input
							value={block.image.src}
							onChange={(event) =>
								onChange({
									...block,
									image: { ...block.image, src: event.target.value },
								})
							}
							className="min-w-0 flex-1 rounded-lg border border-[#0F4C45]/12 bg-white px-3 py-2 text-[0.8rem]"
						/>
						<button
							type="button"
							onClick={() => onPickImage(`${block.id}::src`)}
							className="rounded-lg border border-[#0F4C45]/15 px-3 text-[0.72rem] font-semibold text-[#0F4C45]"
						>
							Browse
						</button>
					</div>
					<input
						value={block.image.alt}
						onChange={(event) =>
							onChange({
								...block,
								image: { ...block.image, alt: event.target.value },
							})
						}
						placeholder="Alt text"
						className="w-full rounded-lg border border-[#0F4C45]/12 bg-white px-3 py-2 text-[0.8rem]"
					/>
					<input
						value={block.image.caption ?? ""}
						onChange={(event) =>
							onChange({
								...block,
								image: { ...block.image, caption: event.target.value },
							})
						}
						placeholder="Caption"
						className="w-full rounded-lg border border-[#0F4C45]/12 bg-white px-3 py-2 text-[0.8rem]"
					/>
				</div>
			) : null}

			{block.type === "duo" ? (
				<div className="grid gap-3 sm:grid-cols-2">
					{block.images.map((image, idx) => (
						<div key={`${block.id}-${idx}`} className="space-y-2">
							<div className="flex gap-2">
								<input
									value={image.src}
									onChange={(event) => {
										const images = [...block.images] as typeof block.images;
										images[idx] = { ...images[idx], src: event.target.value };
										onChange({ ...block, images });
									}}
									className="min-w-0 flex-1 rounded-lg border border-[#0F4C45]/12 bg-white px-2 py-1.5 text-[0.75rem]"
								/>
								<button
									type="button"
									onClick={() => onPickImage(`${block.id}::${idx}`)}
									className="rounded-lg border border-[#0F4C45]/15 px-2 text-[0.68rem] font-semibold text-[#0F4C45]"
								>
									Browse
								</button>
							</div>
							<input
								value={image.alt}
								onChange={(event) => {
									const images = [...block.images] as typeof block.images;
									images[idx] = { ...images[idx], alt: event.target.value };
									onChange({ ...block, images });
								}}
								placeholder="Alt"
								className="w-full rounded-lg border border-[#0F4C45]/12 bg-white px-2 py-1.5 text-[0.75rem]"
							/>
							<input
								value={image.caption ?? ""}
								onChange={(event) => {
									const images = [...block.images] as typeof block.images;
									images[idx] = {
										...images[idx],
										caption: event.target.value,
									};
									onChange({ ...block, images });
								}}
								placeholder="Caption"
								className="w-full rounded-lg border border-[#0F4C45]/12 bg-white px-2 py-1.5 text-[0.75rem]"
							/>
						</div>
					))}
				</div>
			) : null}

			{block.type === "tabs" ? (
				<div className="space-y-3">
					{block.tabs.map((tab, tabIndex) => (
						<div
							key={tab.id}
							className="rounded-lg border border-[#0F4C45]/10 bg-white/80 p-2.5"
						>
							<div className="mb-2 grid gap-2 sm:grid-cols-2">
								<input
									value={tab.label}
									onChange={(event) => {
										const tabs = block.tabs.map((item, i) =>
											i === tabIndex
												? { ...item, label: event.target.value }
												: item,
										);
										onChange({ ...block, tabs });
									}}
									className="rounded-lg border border-[#0F4C45]/12 px-2 py-1.5 text-[0.8rem]"
									placeholder="Tab label"
								/>
								<input
									value={tab.labelEn ?? ""}
									onChange={(event) => {
										const tabs = block.tabs.map((item, i) =>
											i === tabIndex
												? { ...item, labelEn: event.target.value }
												: item,
										);
										onChange({ ...block, tabs });
									}}
									className="rounded-lg border border-[#0F4C45]/12 px-2 py-1.5 text-[0.8rem]"
									placeholder="English label"
								/>
							</div>
							<div className="flex flex-wrap gap-1 pb-2">
								{(
									[
										"pull",
										"text",
										"image",
										"duo",
										"list",
									] as BriefBlock["type"][]
								).map((type) => (
									<button
										key={type}
										type="button"
										onClick={() => {
											const tabs = block.tabs.map((item, i) =>
												i === tabIndex
													? {
															...item,
															blocks: [
																...item.blocks,
																createEmptyBlock(type),
															],
														}
													: item,
											);
											onChange({ ...block, tabs });
										}}
										className="rounded-full border border-[#0F4C45]/12 px-2 py-0.5 text-[0.62rem] font-semibold text-[#0F4C45]"
									>
										+ {BLOCK_LABELS[type]}
									</button>
								))}
							</div>
							<div className="space-y-2">
								{tab.blocks.map((child, childIndex) => (
									<BlockEditor
										key={child.id}
										block={child}
										index={childIndex}
										onChange={(next) => {
											onNestedChange(
												updateBlock(allBlocks, child.id, () => next),
											);
										}}
										onRemove={() =>
											onNestedChange(removeBlock(allBlocks, child.id))
										}
										onMove={(dir) =>
											onNestedChange(moveBlock(allBlocks, child.id, dir))
										}
										onPickImage={onPickImage}
										onNestedChange={onNestedChange}
										allBlocks={allBlocks}
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
