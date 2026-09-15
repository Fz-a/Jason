import {
	newBlockId,
	type BriefBlock,
	type BriefDoc,
	type BriefImage,
} from "./brief-types";

export type BriefLocale = "en" | "zh-Hans" | "zh-Hant";

export const BRIEF_LOCALES: BriefLocale[] = ["zh-Hans", "en", "zh-Hant"];

export type BriefLocaleSlice = {
	title: string;
	subtitle?: string;
	section?: string;
	cardImage?: BriefImage;
	blocks: BriefBlock[];
};

export type BriefMdBundle = {
	id: string;
	source_locale: BriefLocale;
	locales: Partial<Record<BriefLocale, BriefLocaleSlice>>;
};

function isLocale(s: string): s is BriefLocale {
	return s === "en" || s === "zh-Hans" || s === "zh-Hant";
}

function escAttr(s: string) {
	return s.replace(/\s+/g, " ").trim();
}

function imageLine(img: BriefImage): string {
	const alt = escAttr(img.alt || "");
	const cap = img.caption ? `|${escAttr(img.caption)}` : "";
	const base = `![${alt}${cap}](${img.src})`;
	const scale = img.scale ?? 1;
	const tx = img.tx ?? 0;
	const ty = img.ty ?? 0;
	if (scale === 1 && tx === 0 && ty === 0) return base;
	return `${base}{${Number(scale).toFixed(2)},${Number(tx).toFixed(1)},${Number(ty).toFixed(1)}}`;
}

function parseImageLine(line: string): BriefImage | null {
	const m = line.match(/^!\[(.*?)\]\((.*?)\)(?:\{([^}]*)\})?\s*$/);
	if (!m) return null;
	const rawAlt = m[1] ?? "";
	const src = (m[2] ?? "").trim();
	if (!src) return null;
	const focusRaw = (m[3] ?? "").trim();
	let scale: number | undefined;
	let tx: number | undefined;
	let ty: number | undefined;
	if (focusRaw) {
		const parts = focusRaw.split(/[,;]/).map((p) => p.trim());
		const nums = parts
			.map((p) => {
				const kv = p.match(/^[sxy]=(.+)$/i);
				return Number(kv ? kv[1] : p);
			})
			.filter((n) => Number.isFinite(n));
		if (nums[0] != null) scale = nums[0];
		if (nums[1] != null) tx = nums[1];
		if (nums[2] != null) ty = nums[2];
	}
	const pipe = rawAlt.indexOf("|");
	const base =
		pipe >= 0
			? {
					src,
					alt: rawAlt.slice(0, pipe).trim(),
					caption: rawAlt.slice(pipe + 1).trim() || undefined,
				}
			: { src, alt: rawAlt.trim() };
	return {
		...base,
		...(scale != null && scale !== 1 ? { scale } : {}),
		...(tx != null && tx !== 0 ? { tx } : {}),
		...(ty != null && ty !== 0 ? { ty } : {}),
	};
}

function serializeBlocks(blocks: BriefBlock[], indent = ""): string {
	const parts: string[] = [];
	for (const b of blocks) {
		if (b.type === "tabs") {
			parts.push(`${indent}<!-- block:${b.id} type:tabs -->`);
			for (const tab of b.tabs) {
				parts.push(
					`${indent}<!-- tab:${tab.id} label="${escAttr(tab.label).replace(/"/g, "'")}"${
						tab.labelEn
							? ` labelEn="${escAttr(tab.labelEn).replace(/"/g, "'")}"`
							: ""
					} -->`,
				);
				parts.push(serializeBlocks(tab.blocks, indent));
				parts.push(`${indent}<!-- /tab -->`);
			}
			parts.push(`${indent}<!-- /tabs -->`);
			continue;
		}

		parts.push(`${indent}<!-- block:${b.id} type:${b.type} -->`);
		switch (b.type) {
			case "kicker":
			case "heading":
			case "subheading":
			case "pull":
			case "text":
				parts.push(b.text.trimEnd());
				break;
			case "list":
				parts.push(b.items.map((i) => `- ${i}`).join("\n"));
				break;
			case "image":
				parts.push(imageLine(b.image));
				break;
			case "duo":
				parts.push(imageLine(b.images[0]));
				parts.push(imageLine(b.images[1]));
				break;
		}
		parts.push("");
	}
	return parts.join("\n").replace(/\n{3,}/g, "\n\n");
}

function serializeSlice(slice: BriefLocaleSlice): string {
	const sub = slice.subtitle?.trim() ? slice.subtitle.trim() : "";
	const section = slice.section?.trim() ? slice.section.trim() : "";
	const cover = slice.cardImage?.src
		? imageLine(slice.cardImage)
		: "";
	return [
		`## Title`,
		slice.title.trim() || "",
		``,
		`## Subtitle`,
		sub,
		``,
		`## Section`,
		section,
		``,
		`## Cover`,
		cover,
		``,
		`## Blocks`,
		``,
		serializeBlocks(slice.blocks).trimEnd(),
		``,
	].join("\n");
}

export function briefDocToSlice(doc: BriefDoc): BriefLocaleSlice {
	return {
		title: doc.title,
		subtitle: doc.subtitle,
		section: doc.section,
		cardImage: doc.cardImage
			? structuredClone(doc.cardImage)
			: undefined,
		blocks: structuredClone(doc.blocks),
	};
}

export function sliceToBriefDoc(id: string, slice: BriefLocaleSlice): BriefDoc {
	return {
		id,
		title: slice.title,
		subtitle: slice.subtitle,
		section: slice.section,
		cardImage: slice.cardImage
			? structuredClone(slice.cardImage)
			: undefined,
		blocks: structuredClone(slice.blocks),
	};
}

/** Stub other locales: same structure, empty-ish text marked for AI */
function stubSliceFrom(source: BriefLocaleSlice): BriefLocaleSlice {
	const mapText = (t: string) => (t.trim() ? `TODO: ${t}` : "");
	const mapBlocks = (blocks: BriefBlock[]): BriefBlock[] =>
		blocks.map((b) => {
			switch (b.type) {
				case "kicker":
				case "heading":
				case "subheading":
				case "pull":
				case "text":
					return { ...b, text: mapText(b.text) };
				case "list":
					return {
						...b,
						items: b.items.map((i) => mapText(i)),
					};
				case "image":
					return {
						...b,
						image: {
							...b.image,
							alt: b.image.alt ? mapText(b.image.alt) : "",
							caption: b.image.caption
								? mapText(b.image.caption)
								: undefined,
							// keep focus geometry shared across locales
							scale: b.image.scale,
							tx: b.image.tx,
							ty: b.image.ty,
						},
					};
				case "duo":
					return {
						...b,
						images: [
							{
								...b.images[0],
								alt: b.images[0].alt
									? mapText(b.images[0].alt)
									: "",
								caption: b.images[0].caption
									? mapText(b.images[0].caption)
									: undefined,
								scale: b.images[0].scale,
								tx: b.images[0].tx,
								ty: b.images[0].ty,
							},
							{
								...b.images[1],
								alt: b.images[1].alt
									? mapText(b.images[1].alt)
									: "",
								caption: b.images[1].caption
									? mapText(b.images[1].caption)
									: undefined,
								scale: b.images[1].scale,
								tx: b.images[1].tx,
								ty: b.images[1].ty,
							},
						],
					};
				case "tabs":
					return {
						...b,
						tabs: b.tabs.map((tab) => ({
							...tab,
							label: mapText(tab.label) || tab.label,
							labelEn: tab.labelEn
								? mapText(tab.labelEn)
								: tab.labelEn,
							blocks: mapBlocks(tab.blocks),
						})),
					};
			}
		});
	return {
		title: mapText(source.title) || "TODO",
		subtitle: source.subtitle ? mapText(source.subtitle) : undefined,
		section: source.section ? mapText(source.section) : undefined,
		// Keep cover path shared across locales; only stub alt/caption text.
		cardImage: source.cardImage
			? {
					src: source.cardImage.src,
					alt: source.cardImage.alt
						? mapText(source.cardImage.alt)
						: "",
					caption: source.cardImage.caption
						? mapText(source.cardImage.caption)
						: undefined,
					scale: source.cardImage.scale,
					tx: source.cardImage.tx,
					ty: source.cardImage.ty,
				}
			: undefined,
		blocks: mapBlocks(source.blocks),
	};
}

export function docToBundle(
	doc: BriefDoc,
	source_locale: BriefLocale = "zh-Hans",
	existing?: BriefMdBundle | null,
): BriefMdBundle {
	const source = briefDocToSlice(doc);
	const locales: BriefMdBundle["locales"] = {
		...(existing?.locales ?? {}),
		[source_locale]: source,
	};
	for (const loc of BRIEF_LOCALES) {
		if (!locales[loc]) {
			locales[loc] = stubSliceFrom(source);
		}
	}
	return {
		id: doc.id,
		source_locale,
		locales,
	};
}

export function serializeBriefMd(bundle: BriefMdBundle): string {
	const lines = [
		`---`,
		`id: ${bundle.id}`,
		`source_locale: ${bundle.source_locale}`,
		`---`,
		``,
	];
	for (const loc of BRIEF_LOCALES) {
		const slice = bundle.locales[loc];
		if (!slice) continue;
		lines.push(`# Locale: ${loc}`);
		lines.push(``);
		lines.push(serializeSlice(slice).trimEnd());
		lines.push(``);
	}
	return `${lines.join("\n").trimEnd()}\n`;
}

function parseFrontMatter(raw: string): {
	matter: Record<string, string>;
	body: string;
} {
	if (!raw.startsWith("---")) {
		return { matter: {}, body: raw };
	}
	const end = raw.indexOf("\n---", 3);
	if (end < 0) return { matter: {}, body: raw };
	const head = raw.slice(3, end).trim();
	const body = raw.slice(end + 4).replace(/^\s*\n/, "");
	const matter: Record<string, string> = {};
	for (const line of head.split("\n")) {
		const m = line.match(/^(\w+):\s*(.*)$/);
		if (m) matter[m[1]!] = m[2]!.trim();
	}
	return { matter, body };
}

type OpenBlock =
	| { kind: "block"; id: string; type: BriefBlock["type"]; lines: string[] }
	| {
			kind: "tabs";
			id: string;
			tabs: {
				id: string;
				label: string;
				labelEn?: string;
				blocks: BriefBlock[];
			}[];
			current?: {
				id: string;
				label: string;
				labelEn?: string;
				blocks: BriefBlock[];
				open?: OpenBlock;
			};
	  };

function flushTextBlock(
	id: string,
	type: Exclude<BriefBlock["type"], "list" | "image" | "duo" | "tabs">,
	lines: string[],
): BriefBlock {
	return { id, type, text: lines.join("\n").trim() };
}

function finalizeBlock(
	id: string,
	type: BriefBlock["type"],
	lines: string[],
): BriefBlock {
	const body = lines.join("\n").trim();
	switch (type) {
		case "list": {
			const items = body
				.split("\n")
				.map((l) => l.replace(/^\s*[-*]\s+/, "").trim())
				.filter(Boolean);
			return { id, type, items };
		}
		case "image": {
			const img =
				parseImageLine(body.split("\n").find((l) => l.startsWith("![")) ?? "") ?? {
					src: "/experience/work/zongheng/robot-dock.webp",
					alt: "",
				};
			return { id, type, image: img };
		}
		case "duo": {
			const imgs = body
				.split("\n")
				.map((l) => parseImageLine(l.trim()))
				.filter((x): x is BriefImage => !!x);
			const a = imgs[0] ?? {
				src: "/experience/work/zongheng/robot-dock.webp",
				alt: "",
			};
			const b = imgs[1] ?? {
				src: "/experience/work/zongheng/shixun-car.webp",
				alt: "",
			};
			return { id, type, images: [a, b] };
		}
		case "tabs":
			return { id, type, tabs: [] };
		default:
			return flushTextBlock(id, type, lines);
	}
}

function parseBlocksSection(raw: string): BriefBlock[] {
	const lines = raw.split("\n");
	const out: BriefBlock[] = [];
	let open: OpenBlock | null = null;

	const pushOpen = () => {
		if (!open) return;
		if (open.kind === "block") {
			out.push(finalizeBlock(open.id, open.type, open.lines));
		} else {
			if (open.current) {
				if (open.current.open?.kind === "block") {
					open.current.blocks.push(
						finalizeBlock(
							open.current.open.id,
							open.current.open.type,
							open.current.open.lines,
						),
					);
				}
				open.tabs.push({
					id: open.current.id,
					label: open.current.label,
					labelEn: open.current.labelEn,
					blocks: open.current.blocks,
				});
			}
			out.push({ id: open.id, type: "tabs", tabs: open.tabs });
		}
		open = null;
	};

	for (const line of lines) {
		const blockStart = line.match(
			/^<!--\s*block:([^\s]+)\s+type:([^\s]+)\s*-->\s*$/,
		);
		if (blockStart) {
			const id = blockStart[1]!;
			const type = blockStart[2]! as BriefBlock["type"];
			if (open?.kind === "tabs" && open.current) {
				if (open.current.open?.kind === "block") {
					open.current.blocks.push(
						finalizeBlock(
							open.current.open.id,
							open.current.open.type,
							open.current.open.lines,
						),
					);
				}
				if (type === "tabs") {
					// nested tabs not supported
					open.current.open = undefined;
				} else {
					open.current.open = { kind: "block", id, type, lines: [] };
				}
				continue;
			}
			pushOpen();
			if (type === "tabs") {
				open = { kind: "tabs", id, tabs: [] };
			} else {
				open = { kind: "block", id, type, lines: [] };
			}
			continue;
		}

		const tabStart = line.match(
			/^<!--\s*tab:([^\s]+)\s+label="([^"]*)"(?:\s+labelEn="([^"]*)")?\s*-->\s*$/,
		);
		// legacy unquoted
		const tabStartLegacy = !tabStart
			? line.match(
					/^<!--\s*tab:([^\s]+)\s+label:(\S+)(?:\s+labelEn:(\S+))?\s*-->\s*$/,
				)
			: null;
		const tabM = tabStart ?? tabStartLegacy;
		if (tabM && open?.kind === "tabs") {
			if (open.current) {
				if (open.current.open?.kind === "block") {
					open.current.blocks.push(
						finalizeBlock(
							open.current.open.id,
							open.current.open.type,
							open.current.open.lines,
						),
					);
				}
				open.tabs.push({
					id: open.current.id,
					label: open.current.label,
					labelEn: open.current.labelEn,
					blocks: open.current.blocks,
				});
			}
			open.current = {
				id: tabM[1]!,
				label: (tabM[2] ?? "").trim(),
				labelEn: tabM[3]?.trim(),
				blocks: [],
			};
			continue;
		}

		if (/^<!--\s*\/tab\s*-->\s*$/.test(line) && open?.kind === "tabs") {
			if (open.current) {
				if (open.current.open?.kind === "block") {
					open.current.blocks.push(
						finalizeBlock(
							open.current.open.id,
							open.current.open.type,
							open.current.open.lines,
						),
					);
					open.current.open = undefined;
				}
				open.tabs.push({
					id: open.current.id,
					label: open.current.label,
					labelEn: open.current.labelEn,
					blocks: open.current.blocks,
				});
				open.current = undefined;
			}
			continue;
		}

		if (/^<!--\s*\/tabs\s*-->\s*$/.test(line) && open?.kind === "tabs") {
			pushOpen();
			continue;
		}

		if (open?.kind === "block") {
			open.lines.push(line);
		} else if (open?.kind === "tabs" && open.current?.open?.kind === "block") {
			open.current.open.lines.push(line);
		}
	}
	pushOpen();
	return out;
}

function parseLocaleSlice(sectionBody: string): BriefLocaleSlice {
	const titleM = sectionBody.match(
		/## Title\s*\n([\s\S]*?)(?=\n## Subtitle\b|$)/,
	);
	const subM = sectionBody.match(
		/## Subtitle\s*\n([\s\S]*?)(?=\n## Section\b|$)/,
	);
	const secM = sectionBody.match(
		/## Section\s*\n([\s\S]*?)(?=\n## (?:Cover|Blocks)\b|$)/,
	);
	const coverM = sectionBody.match(
		/## Cover\s*\n([\s\S]*?)(?=\n## Blocks\b|$)/,
	);
	const blocksM = sectionBody.match(/## Blocks\s*\n([\s\S]*)$/);

	const title = (titleM?.[1] ?? "").trim();
	const subtitle = (subM?.[1] ?? "").trim();
	const section = (secM?.[1] ?? "").trim();
	const coverLine = (coverM?.[1] ?? "")
		.split("\n")
		.map((l) => l.trim())
		.find((l) => l.startsWith("!["));
	const cardImage = coverLine ? parseImageLine(coverLine) : null;
	const blocks = parseBlocksSection(blocksM?.[1] ?? "");

	return {
		title: title || "Untitled",
		subtitle: subtitle || undefined,
		section: section || undefined,
		cardImage: cardImage ?? undefined,
		blocks:
			blocks.length > 0
				? blocks
				: [{ id: newBlockId(), type: "text", text: "" }],
	};
}

export function parseBriefMd(raw: string): BriefMdBundle {
	const { matter, body } = parseFrontMatter(raw.trimStart());
	const id = matter.id?.trim() || "untitled";
	const source_locale = isLocale(matter.source_locale ?? "")
		? (matter.source_locale as BriefLocale)
		: "zh-Hans";

	const locales: BriefMdBundle["locales"] = {};
	const re = /^# Locale:\s*(en|zh-Hans|zh-Hant)\s*$/gm;
	const matches = [...body.matchAll(re)];
	for (let i = 0; i < matches.length; i++) {
		const m = matches[i]!;
		const loc = m[1] as BriefLocale;
		const start = (m.index ?? 0) + m[0].length;
		const end = matches[i + 1]?.index ?? body.length;
		const sectionBody = body.slice(start, end).trim();
		locales[loc] = parseLocaleSlice(sectionBody);
	}

	if (Object.keys(locales).length === 0) {
		// Treat whole body as source locale content
		locales[source_locale] = parseLocaleSlice(body);
	}

	return { id, source_locale, locales };
}

export function bundleToActiveDoc(
	bundle: BriefMdBundle,
	locale?: BriefLocale,
): BriefDoc {
	const loc =
		locale ??
		bundle.source_locale ??
		(BRIEF_LOCALES.find((l) => bundle.locales[l]) as BriefLocale);
	const slice = bundle.locales[loc] ?? bundle.locales[bundle.source_locale];
	if (!slice) {
		return {
			id: bundle.id,
			title: "Untitled",
			blocks: [{ id: newBlockId(), type: "text", text: "" }],
		};
	}
	return sliceToBriefDoc(bundle.id, slice);
}

export const AI_PROMPT_SNIPPET = `请严格按下面的「Brief MD 规则」处理我粘贴的 MD：
- 以 front matter 的 source_locale 那一节为唯一权威原文
- 补全/更新另外两种语言（en / zh-Hans / zh-Hant 里缺的，或仍带 TODO: 的）
- 保持所有 block id、type、图片路径、tab 结构不变
- 只改文案；返回完整可覆盖的同一份 MD（含 --- front matter 与三个 # Locale: 节）`;

/** 给其它 AI 的完整规则（可单独「复制规则」） */
export const BRIEF_MD_RULES_TEXT = `# Brief MD 互通规则（给 AI）

你收到的是作品集 Brief 的中间层 Markdown。请按本规则改写/补全后，返回**完整同一份 MD**（可直接覆盖原文件）。

## 流程
1. 用户只认真写好 source_locale 那一节（简体或英文）。
2. 你补全其余语言节。
3. 用户把你的整份 MD 粘贴回 Studio →「导入替换」。

## 结构（必须）
\`\`\`md
---
id: 与项目 id 一致
source_locale: zh-Hans | en | zh-Hant
---

# Locale: zh-Hans
## Title
...
## Subtitle
...
## Section
...
## Cover
![首页卡片图 alt](/path/to/card.webp)

## Blocks

<!-- block:ID type:kicker|heading|subheading|pull|text -->
纯文本

<!-- block:ID type:list -->
- 项

<!-- block:ID type:image -->
![alt|caption](/path.webp)
![alt|caption](/path.webp){1.25,8.0,-4.0}
（花括号可选：缩放,横向平移%,纵向平移%）

<!-- block:ID type:duo -->
![左alt|左caption](/a.webp)
![右alt|右caption](/b.webp)

<!-- block:ID type:tabs -->
<!-- tab:TAB_ID label="中文" labelEn="English" -->
<!-- block:CHILD_ID type:text -->
...
<!-- /tab -->
<!-- /tabs -->

# Locale: en
（相同 block id / type / 图片路径）

# Locale: zh-Hant
（同上）
\`\`\`

## 硬性约束
1. 三个 \`# Locale:\` 节都保留；不要删节、不要改 block/tab id。
2. 只改文字：Title / Subtitle / Section / 块正文 / list 项 / alt 与 caption。
3. 图片路径不要改；duo 必须两行图。
4. 不要发明新 block type；不要输出 JSON。
5. 简→繁可转换后润色专有名词；英文要自然作品集语气。
6. 未完成处可用 \`TODO: …\`，但尽量写完。

## 你的输出
只输出完整 Markdown 文档本身（从 --- 开始），不要解释。`;

