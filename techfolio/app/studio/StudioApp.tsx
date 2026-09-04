"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { briefFromShowcase } from "../lib/brief-from-legacy";
import {
	createEmptyBlock,
	newBlockId,
	type BriefBlock,
	type BriefDoc,
	type BriefImage,
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
	group: string;
	source: "showcase" | "company" | "helmet" | "diy";
};

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
				className={`studio-live w-full resize-y rounded-md bg-transparent outline-none hover:bg-[#0F4C45]/[0.04] focus:bg-[#0F4C45]/[0.06] focus:ring-1 focus:ring-[#0F4C45]/25 ${className}`}
			/>
		);
	}
	return (
		<input
			value={value}
			placeholder={placeholder}
			onChange={(e) => onChange(e.target.value)}
			className={`studio-live w-full rounded-md bg-transparent outline-none hover:bg-[#0F4C45]/[0.04] focus:bg-[#0F4C45]/[0.06] focus:ring-1 focus:ring-[#0F4C45]/25 ${className}`}
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
	const catalog = useMemo(() => buildCatalog(), []);
	const [store, setStore] = useState<BriefStore>(
		() => structuredClone(seedBriefs) as BriefStore,
	);
	const [activeId, setActiveId] = useState(catalog[0]?.id ?? "zongheng-robot");
	const [doc, setDoc] = useState<BriefDoc>(() =>
		loadDoc(catalog[0]!, structuredClone(seedBriefs) as BriefStore),
	);
	const [pickToken, setPickToken] = useState<string | null>(null);
	const [mediaQ, setMediaQ] = useState("");
	const [tip, setTip] = useState<string | null>(null);

	const media = mediaList as string[];
	const mediaHits = useMemo(() => {
		const q = mediaQ.trim().toLowerCase();
		return (q ? media.filter((p) => p.toLowerCase().includes(q)) : media).slice(
			0,
			48,
		);
	}, [media, mediaQ]);

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

	const switchCard = (id: string) => {
		if (id === activeId) return;
		const entry = catalog.find((c) => c.id === id);
		if (!entry) return;
		setActiveId(id);
		setDoc(loadDoc(entry, store));
	};

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

	const download = () => {
		downloadJson({ ...store, [doc.id]: doc });
		setTip("已下载 · 覆盖 content/briefs.json 即可");
		window.setTimeout(() => setTip(null), 2500);
	};

	const hasKicker = doc.blocks.some((b) => b.type === "kicker");
	const hasHeading = doc.blocks.some((b) => b.type === "heading");

	return (
		<div className="min-h-screen bg-[#E8E2D8] text-[#162b26]">
			<header className="sticky top-0 z-20 border-b border-[#0F4C45]/10 bg-[#F7F1E8]/95 backdrop-blur">
				<div className="mx-auto flex max-w-[42rem] items-center gap-2 px-4 py-2.5 sm:px-0">
					<select
						value={activeId}
						onChange={(e) => switchCard(e.target.value)}
						className="min-w-0 flex-1 rounded-full border border-[#0F4C45]/15 bg-white px-3 py-2 text-[0.82rem] font-semibold outline-none"
					>
						{catalog.map((c) => (
							<option key={c.id} value={c.id}>
								{c.group} · {c.title}
							</option>
						))}
					</select>
					<button
						type="button"
						onClick={download}
						className="shrink-0 rounded-full bg-[#0F4C45] px-3.5 py-2 text-[0.75rem] font-semibold text-white"
					>
						下载
					</button>
					<Link
						href="/#about"
						className="shrink-0 rounded-full px-2 py-2 text-[0.75rem] font-semibold text-[#5C6F6A]"
					>
						回站
					</Link>
				</div>
				<p className="mx-auto max-w-[42rem] px-4 pb-2 text-[0.68rem] text-[#6A7A76] sm:px-0">
					直接点预览里的文字改 · 点图片换图 · 悬停出现删除
				</p>
			</header>

			<main className="mx-auto max-w-[42rem] px-3 py-6 sm:px-0">
				<article className="overflow-hidden rounded-2xl bg-white/95 px-6 py-8 shadow-[0_20px_50px_rgba(22,43,38,0.12)] sm:px-10 sm:py-10">
					{!hasKicker && doc.section ? (
						<LiveText
							value={doc.section}
							onChange={(section) => setDoc((p) => ({ ...p, section }))}
							className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#8A9692]"
						/>
					) : null}
					{!hasHeading ? (
						<>
							<LiveText
								value={doc.title}
								onChange={(title) => setDoc((p) => ({ ...p, title }))}
								className="mt-4 text-[1.6rem] font-extrabold tracking-tight text-[#162b26]"
							/>
							<LiveText
								value={doc.subtitle ?? ""}
								onChange={(subtitle) => setDoc((p) => ({ ...p, subtitle }))}
								className="mt-1.5 text-[0.95rem] text-[#6A7A76]"
								placeholder="副标题"
							/>
						</>
					) : null}

					<div className="space-y-1">
						{doc.blocks.map((block) => (
							<BlockRow
								key={block.id}
								block={block}
								onChange={(next) =>
									setBlocks(
										patchBlock(doc.blocks, block.id, () => next),
									)
								}
								onRemove={() => setBlocks(dropBlock(doc.blocks, block.id))}
								onPick={(field) => {
									// tabs child passes "childId::field"
									if (field.includes("::")) {
										setPickToken(`${block.id}::${field}`);
									} else {
										setPickToken(`${block.id}::${field}`);
									}
								}}
							/>
						))}
					</div>

					<div className="mt-8 flex flex-wrap gap-2 border-t border-dashed border-[#0F4C45]/15 pt-5">
						{(
							[
								["heading", "加标题"],
								["text", "加正文"],
								["image", "加图片"],
								["duo", "加双图"],
							] as const
						).map(([type, label]) => (
							<button
								key={type}
								type="button"
								onClick={() =>
									setBlocks([...doc.blocks, createEmptyBlock(type)])
								}
								className="rounded-full border border-[#0F4C45]/15 px-3 py-1.5 text-[0.72rem] font-semibold text-[#0F4C45] hover:bg-[#0F4C45] hover:text-white"
							>
								{label}
							</button>
						))}
					</div>
				</article>
			</main>

			{pickToken ? (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
					<div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-[#F7F1E8]">
						<div className="flex items-center justify-between px-4 py-3">
							<p className="font-semibold text-[#0F4C45]">选图</p>
							<button
								type="button"
								onClick={() => setPickToken(null)}
								className="text-[0.8rem] font-semibold text-[#6A7A76]"
							>
								关闭
							</button>
						</div>
						<input
							autoFocus
							value={mediaQ}
							onChange={(e) => setMediaQ(e.target.value)}
							placeholder="搜索图片"
							className="mx-4 mb-2 rounded-lg border border-[#0F4C45]/15 bg-white px-3 py-2 text-[0.85rem] outline-none"
						/>
						<div className="grid grid-cols-3 gap-2 overflow-y-auto p-3 sm:grid-cols-4">
							{mediaHits.map((path) => (
								<button
									key={path}
									type="button"
									onClick={() => applyImage(path)}
									className="relative aspect-square overflow-hidden rounded-lg bg-white"
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
				<div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#0F4C45] px-4 py-2 text-[0.78rem] font-semibold text-white">
					{tip}
				</div>
			) : null}
		</div>
	);
}
