/**
 * Terminal content compiler.
 *
 * Reads `content/terminal/<locale>/*.md` (the authoring source the site owner
 * edits) and emits `app/components/terminal/term-content.generated.ts`.
 *
 *   node scripts/build-terminal-content.mjs          # build
 *   node scripts/build-terminal-content.mjs --check  # validate only
 *
 * The format is specified in `content/terminal/SPEC.md`. Anything that doesn't
 * match is a hard error with file + line — we never write a half-built file.
 *
 * Structure: every locale ships exactly four files, one per ZONE.
 * A zone says *what kind of copy it is*; chapters inside `content`/`recap`
 * say *which question the copy answers*.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "content", "terminal");
const OUT = join(
	ROOT,
	"app",
	"components",
	"terminal",
	"term-content.generated.ts",
);

const LOCALES = ["en"];

/**
 * The four content zones, in build order. Every locale must ship exactly
 * these files — one per zone — no more, no fewer.
 *
 *   content  the guided tour: one chapter per question, all of them are steps
 *   recap    the post-tour summary page + the left-rail navigation titles
 *   ui       chrome copy: buttons, prompts, command manual, variable templates
 *   theater  decoration: boot log, neofetch, git history, ASCII gallery
 */
const ZONES = ["content", "recap", "ui", "theater"];

/** Zones whose chapters form the click-through guided tour. */
const TOUR_ZONES = new Set(["content"]);

/** Zones that contain `## NN · Title` chapter sections. */
const CHAPTER_ZONES = new Set(["content", "recap"]);

/** Keys allowed in a chapter's meta block (the lines under its heading). */
const CHAPTER_META_KEYS = new Set(["cmd", "narration", "takeaway"]);

/** Chapter meta keys that must be present and non-empty. */
const CHAPTER_META_REQUIRED = ["cmd", "narration", "takeaway"];

/**
 * Commands the terminal actually implements. A chapter's `cmd` must be here.
 * Entries may carry arguments (`git log`, `man foo`) — only the head verb is
 * matched against the switch statement.
 */
const KNOWN_COMMANDS = new Set(
	(
		// tour
		"next skip start restart tour " +
		// chapters
		"whoami about intro me who role do job work projects " +
		"skills path career exp contact social email summary stats resume index " +
		// fun
		"hack hollywood art buddha neumann dragon rocket matrix theme " +
		// misc
		"help man cat ping fortune history clear banner neofetch " +
		"pwd date echo top htop git uname uptime python python3 " +
		"sudo rm exit quit vim vi nano emacs hello hi xyzzy 42"
	)
		.split(/\s+/)
		.filter(Boolean),
);

/** First whitespace-separated word of a command line. */
const headVerb = (cmd) => cmd.split(/\s+/)[0];

/**
 * Keys a `settings` block may set. Anything else is a typo and must fail.
 * This is the contract between the MD files and TerminalSection.tsx.
 */
const SETTING_KEYS = new Set(
	(
		// chrome / nav
		"pressEnterToContinue orTypeACommand inputPlaceholder guidedTour " +
		"btnRun btnNext navTitle navSubtitle navNotStarted " +
		// welcome
		"welcomeLine1 welcomeLine2a welcomeLine2b " +
		// tour lifecycle
		"advancing restarting tourDoneA tourDoneB tourDoneCmd tourDoneC tourDoneD " +
		// manual
		"manualHeader manualEgg " +
		// misc one-offs
		"catUsage didYouMean tryHelp pythonLine1 pythonLine2 sudoSandwich " +
		"sudoDenied rmReply exitLine1 exitLine2 helloLine1 helloLine2 xyzzyReply " +
		"fortyTwoReply unameLine topHeader uptimeLine1 uptimeLine2 pingLost " +
		"gitUsage gitStatusNothing gitStatusShip matrixWake konamiLine " +
		"galleryHeader dragonCaption rocketCaption bootTitle emailLabel " +
		"hackNote_a hackNote_intro hackNote_art hackNote_end"
	)
		.split(/\s+/)
		.filter(Boolean),
);

/**
 * Keys a `field` block may set. A `field` is chapter-local copy — it lands
 * inside the section it opens rather than at the top level.
 *
 *   header / body / footer  the three lines that wrap one section's content
 *   hint / rule / cta       one-off lines for specific chapters
 *   navTitle / navSubtitle / navNotStarted   left-rail chrome
 */
const FIELD_KEYS = new Set([
	"header",
	"body",
	"footer",
	"hint",
	"rule",
	"cta",
	"navTitle",
	"navSubtitle",
	"navNotStarted",
]);

/** Keys a `template` block may define, with their expected parameter lists. */
const TEMPLATE_KEYS = {
	themeSet: ["next"],
	eggPrefix: ["n", "total", "label"],
	gitStatusClean: ["branch"],
	pingStats: ["host"],
	pingHeader: ["host"],
	cmdNotFound: ["cmd"],
	catNoFile: ["arg"],
	manNoEntry: ["arg"],
	editorReply: ["cmd"],
};

/** Which zone(s) each block type is allowed in. */
const BLOCK_SCOPE = {
	note: ["content", "recap"],
	field: ["content", "recap"],
	identity: ["content"],
	numbered: ["content"],
	items: ["content"],
	bars: ["content"],
	links: ["content"],
	index: ["recap"],
	settings: ["ui"],
	template: ["ui"],
	cmds: ["ui"],
	raw: ["theater"],
	pairs: ["theater"],
	trio: ["theater"],
};

/** Blocks that land in the top-level `raw` bag rather than a chapter payload. */
const GLOBAL_BLOCKS = new Set(["raw", "pairs", "trio", "cmds"]);

/**
 * Every chapter the terminal expects, and the content block it must contain.
 * The key set is also the authoritative chapter list: an unexpected chapter
 * number or a missing one is a hard error, so the tour can't silently drift.
 */
const CHAPTER_REQUIREMENTS = {
	"01": "identity",
	"02": "items",
	"03": "items",
	"04": "bars",
	"05": "items",
	"06": "links",
	"07": "index",
};

/** Copy keys that belong to the left rail rather than to a section. */
const NAV_KEYS = new Set(["navTitle", "navSubtitle", "navNotStarted"]);

// ── diagnostics ────────────────────────────────────────────────────────

const errors = [];
let currentFile = "";

function fail(message, line) {
	errors.push({ file: currentFile, line, message });
}

function failIn(file, message, line) {
	errors.push({ file, line, message });
}

// ── front-matter ───────────────────────────────────────────────────────

function parseFrontMatter(src, file) {
	const lines = src.split(/\r?\n/);
	if (lines[0].trim() !== "---") {
		failIn(file, "文件必须以 front-matter 开头（第一行是 ---）", 1);
		return { meta: {}, bodyStart: 0 };
	}
	let end = -1;
	for (let i = 1; i < lines.length; i++) {
		if (lines[i].trim() === "---") {
			end = i;
			break;
		}
	}
	if (end === -1) {
		failIn(file, "front-matter 没有结束标记 ---", 1);
		return { meta: {}, bodyStart: 1 };
	}

	const meta = {};
	for (let i = 1; i < end; i++) {
		const raw = lines[i];
		const trimmed = raw.trim();
		if (!trimmed) continue;
		const colon = raw.indexOf(":");
		if (colon === -1) {
			failIn(file, `这一行不是 key: value —— ${trimmed}`, i + 1);
			continue;
		}
		const key = raw.slice(0, colon).trim();
		let value = raw.slice(colon + 1).trim();
		if (
			(value.startsWith('"') && value.endsWith('"') && value.length > 1) ||
			(value.startsWith("'") && value.endsWith("'") && value.length > 1)
		) {
			value = value.slice(1, -1);
		}
		if (key in meta) {
			failIn(file, `front-matter 字段重复：${key}`, i + 1);
		}
		meta[key] = value;
	}
	return { meta, bodyStart: end + 1 };
}

// ── body scanner ───────────────────────────────────────────────────────

const FENCE_OPEN = /^\s*```+\s*([a-zA-Z]+)?\s*([A-Za-z0-9_]+)?\s*$/;
const FENCE_CLOSE = /^\s*```+\s*$/;
/** `## 01 · 我是谁` — the number is the chapter, the rest is its label. */
const CHAPTER_HEADING = /^##\s+(\d{2})\s*·\s*(.+?)\s*$/;
/** `cmd: whoami` inside a chapter's meta block. */
const META_ROW = /^([a-z][A-Za-z0-9_]*)\s*:\s*(.*)$/;

/**
 * Split a body into a flat token stream: chapter headings, meta rows, fenced
 * blocks and blank filler. Nothing is interpreted here beyond shape, so error
 * messages can always quote the exact line number.
 */
function scanBody(lines, startLine, file, zone) {
	const tokens = [];
	let chapter = null; // active chapter number, or null at file level
	let metaDone = false; // meta rows are only legal before the first block

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const lineNo = startLine + i;
		const trimmed = line.trim();

		if (!trimmed) continue;
		if (FENCE_CLOSE.test(line)) {
			failIn(file, "这里有一个孤立的 ``` ，没有对应的开栏", lineNo);
			continue;
		}

		// HTML comment — a documented no-op for notes to self. May span lines.
		if (trimmed.startsWith("<!--")) {
			let j = i;
			let closed = false;
			for (; j < lines.length; j++) {
				if (lines[j].includes("-->")) {
					closed = true;
					break;
				}
			}
			if (!closed) {
				failIn(file, "HTML 注释没有闭合（缺少 -->）", lineNo);
				break;
			}
			i = j;
			continue;
		}

		if (trimmed.startsWith("#")) {
			const h = CHAPTER_HEADING.exec(trimmed);
			if (!h) {
				failIn(
					file,
					`标题格式必须是 \`## NN · 标题\`，实际是 "${trimmed}"`,
					lineNo,
				);
				continue;
			}
			if (!CHAPTER_ZONES.has(zone)) {
				failIn(file, `zone "${zone}" 里不能有章节标题（只有 content / recap 可以）`, lineNo);
				continue;
			}
			chapter = { num: h[1], label: h[2], meta: {}, line: lineNo };
			tokens.push({ kind: "chapter", value: chapter, line: lineNo });
			metaDone = false;
			continue;
		}

		const fence = FENCE_OPEN.exec(line);
		if (fence) {
			const rows = [];
			let j = i + 1;
			for (; j < lines.length; j++) {
				if (FENCE_CLOSE.test(lines[j])) break;
				rows.push({ text: lines[j], line: startLine + j });
			}
			if (j >= lines.length) {
				failIn(file, "代码块没有闭合（缺少 ``` ）", lineNo);
				break;
			}
			tokens.push({
				kind: "block",
				lang: fence[1] ?? "",
				name: fence[2] ?? "",
				rows,
				line: lineNo,
				chapter: chapter?.num ?? null,
			});
			i = j;
			metaDone = true;
			continue;
		}

		if (CHAPTER_ZONES.has(zone) && !chapter) {
			failIn(
				file,
				`块必须放在某个 \`## NN · 标题\` 章节下面，这一行游离在外面：${trimmed.slice(0, 40)}`,
				lineNo,
			);
			continue;
		}

		if (CHAPTER_ZONES.has(zone) && !metaDone) {
			const m = META_ROW.exec(trimmed);
			if (m && CHAPTER_META_KEYS.has(m[1])) {
				if (m[1] in chapter.meta) {
					failIn(file, `章节元信息 "${m[1]}" 重复`, lineNo);
				}
				chapter.meta[m[1]] = m[2].trim();
				tokens.push({ kind: "meta", value: chapter, line: lineNo });
				continue;
			}
		}

		failIn(
			file,
			`正文里出现了游离文字（内容必须在代码块或章节标题下）：${trimmed.slice(0, 40)}`,
			lineNo,
		);
	}

	return tokens;
}

// ── row helpers ────────────────────────────────────────────────────────

const nonEmpty = (rows) => rows.filter((r) => r.text.trim().length > 0);

/**
 * Read a `key = value` row.
 *
 * The value is taken verbatim except for the single space after `=` and any
 * trailing `\r`. Wrap the value in quotes to protect leading/trailing spaces,
 * which several strings rely on (they get concatenated with clickable
 * segments right after them). Use `'` when the value itself contains `"`.
 *
 * Returns `{ key, value }`, or `null` when the row is blank.
 */
function readAssignment(text) {
	const eq = text.indexOf("=");
	if (eq === -1) return null;
	const key = text.slice(0, eq).trim();
	let value = text.slice(eq + 1).replace(/\r$/, "");
	if (value.startsWith(" ")) value = value.slice(1);
	const q = value[0];
	if (
		(q === '"' || q === "'") &&
		value.length > 1 &&
		value.endsWith(q)
	) {
		value = value.slice(1, -1).split(`\\${q}`).join(q);
	} else {
		value = value.replace(/\s+$/, "");
	}
	if (!key) return null;
	return { key, value };
}

/** Split a row on `|`, trim each half. */
function splitCols(row) {
	return row.text
		.split("|")
		.map((c) => c.trim());
}

// ── block parsers ──────────────────────────────────────────────────────
// Each returns `{ key, value }`. `value` is plain JSON-able data.
// `ctx.chapter` is the chapter number the block sits under, or null.

const BLOCK_PARSERS = {
	note: (rows) => ({
		key: "_note",
		value: nonEmpty(rows).map((r) => r.text.trim()),
	}),

	/** chapter-local `key = value` copy */
	field: (rows) => {
		const obj = {};
		for (const r of nonEmpty(rows)) {
			const a = readAssignment(r.text);
			if (!a) {
				fail(`field 行必须是 key = value —— ${r.text.trim()}`, r.line);
				continue;
			}
			if (!FIELD_KEYS.has(a.key)) {
				fail(`field 里没有这个键 "${a.key}"（可用：${[...FIELD_KEYS].join(", ")}）`, r.line);
				continue;
			}
			if (a.key in obj) fail(`field "${a.key}" 重复定义`, r.line);
			obj[a.key] = a.value;
		}
		return { key: "_field", value: obj };
	},

	identity: (rows) => {
		const obj = {};
		for (const r of nonEmpty(rows)) {
			const c = splitCols(r);
			if (c.length === 1 && r.text.includes(":")) {
				const colon = r.text.indexOf(":");
				const k = r.text.slice(0, colon).trim();
				const v = r.text.slice(colon + 1).trim();
				if (!(k in obj)) obj[k] = v;
			} else if (c.length === 2) {
				if (!(c[0] in obj)) obj[c[0]] = c[1];
			}
		}
		return { key: "idCard", value: obj };
	},

	numbered: (rows, block, file, ctx) => {
		const items = [];
		let expected = 1;
		for (const r of nonEmpty(rows)) {
			const m = /^(\d+)\.\s*(.+)$/.exec(r.text.trim());
			if (!m) {
				fail(`numbered 行必须以 "N. " 开头 —— ${r.text.trim()}`, r.line);
				continue;
			}
			const n = Number(m[1]);
			if (n !== expected) {
				fail(`序号不连续：期望 ${expected}，实际 ${n}`, r.line);
				expected = n;
			}
			expected++;
			const c = splitCols({ text: m[2] });
			items.push([c[0], c.slice(1).join(" · ")]);
		}
		return { key: `items:${ctx.chapter}`, value: items };
	},

	items: (rows, block, file, ctx) => {
		const items = [];
		for (const r of nonEmpty(rows)) {
			const c = splitCols(r);
			if (c.length === 1) {
				items.push([c[0], ""]);
			} else if (c.length === 2) {
				items.push([c[0], c[1]]);
			} else {
				fail(`items 行最多两列（标题 | 说明），实际 ${c.length} 列`, r.line);
			}
		}
		return { key: `items:${ctx.chapter}`, value: items };
	},

	bars: (rows) => {
		const groups = [];
		let cur = null;
		for (const r of nonEmpty(rows)) {
			const t = r.text.trim();
			const g = /^group:\s*(.+)$/.exec(t);
			if (g) {
				cur = { title: g[1].trim(), rows: [] };
				groups.push(cur);
				continue;
			}
			if (!cur) {
				fail("bars 里第一条数据行之前必须先写 group: 分组", r.line);
				continue;
			}
			const c = splitCols(r);
			if (c.length !== 3) {
				fail(`bars 行必须是三列（名称 | 等级 | 说明），实际 ${c.length} 列`, r.line);
				continue;
			}
			const lvl = Number(c[1]);
			if (!Number.isInteger(lvl) || lvl < 1 || lvl > 10) {
				fail(`等级必须是 1–10 的整数，实际是 "${c[1]}"`, r.line);
				continue;
			}
			cur.rows.push([c[0], lvl, c[2]]);
		}
		return { key: "skillGroups", value: groups };
	},

	links: (rows) => {
		const out = [];
		for (const r of nonEmpty(rows)) {
			const c = splitCols(r);
			if (c.length !== 3) {
				fail(`links 行必须是三列（显示名 | 链接 | 展示文本），实际 ${c.length} 列`, r.line);
				continue;
			}
			if (!/^(https?:|mailto:)/.test(c[1])) {
				fail(`links 第二列必须是 http(s):// 或 mailto: 开头的真实链接，实际是 "${c[1]}"`, r.line);
				continue;
			}
			out.push([c[0], c[1], c[2]]);
		}
		return { key: "contactLinks", value: out };
	},

	index: (rows) => {
		const out = [];
		for (const r of nonEmpty(rows)) {
			const c = splitCols(r);
			if (c.length !== 2) {
				fail(`index 行必须是两列（编号 | 说明），实际 ${c.length} 列`, r.line);
				continue;
			}
			out.push([c[0], c[1]]);
		}
		return { key: "indexRows", value: out };
	},

	cmds: (rows) => {
		const out = [];
		for (const r of nonEmpty(rows)) {
			const c = splitCols(r);
			if (c.length !== 3) {
				fail(`cmds 行必须是三列（命令 | 说明 | 执行），实际 ${c.length} 列`, r.line);
				continue;
			}
			if (!KNOWN_COMMANDS.has(headVerb(c[2]))) {
				fail(`cmds 第三列 "${c[2]}" 不是已实现的命令`, r.line);
				continue;
			}
			out.push([c[0], c[1], c[2]]);
		}
		return { key: "manual", value: out };
	},

	settings: (rows) => {
		const obj = {};
		for (const r of nonEmpty(rows)) {
			const a = readAssignment(r.text);
			if (!a) {
				fail(`settings 行必须是 key = value —— ${r.text.trim()}`, r.line);
				continue;
			}
			if (!SETTING_KEYS.has(a.key)) {
				fail(`settings 里没有这个键 "${a.key}"（终端不读它，多半是拼错了）`, r.line);
				continue;
			}
			obj[a.key] = a.value;
		}
		return { key: "_settings", value: obj };
	},

	template: (rows) => {
		const out = [];
		for (const r of nonEmpty(rows)) {
			const a = readAssignment(r.text);
			if (!a) {
				fail(`template 行必须是 name(args) = value —— ${r.text.trim()}`, r.line);
				continue;
			}
			const body = a.value;
			const m = /^([A-Za-z0-9_]+)\s*\(([^)]*)\)$/.exec(a.key);
			if (!m) {
				fail(`template 签名格式应为 name(arg1, arg2) —— ${a.key}`, r.line);
				continue;
			}
			const [, name, argList] = m;
			const args = argList
				.split(",")
				.map((a) => a.trim())
				.filter(Boolean);
			const expected = TEMPLATE_KEYS[name];
			if (!expected) {
				fail(`template 里没有这个键 "${name}"`, r.line);
				continue;
			}
			if (
				expected.length !== args.length ||
				expected.some((a, idx) => a !== args[idx])
			) {
				fail(
					`"${name}" 的参数签名必须是 (${expected.join(", ")})，实际是 (${args.join(", ")})`,
					r.line,
				);
				continue;
			}
			// every {placeholder} must be a declared arg, and vice versa
			const used = [...body.matchAll(/\{([A-Za-z0-9_]+)\}/g)].map((x) => x[1]);
			for (const u of used) {
				if (!args.includes(u)) {
					fail(`"${name}" 里的占位符 {${u}} 没有在签名里声明`, r.line);
				}
			}
			for (const a of args) {
				if (!used.includes(a)) {
					fail(`"${name}" 声明了参数 ${a}，但值里没用它`, r.line);
				}
			}
			if (!args.length && used.length) {
				fail(`"${name}" 没有参数，值里不该有占位符`, r.line);
			}
			out.push([name, body, args]);
		}
		return { key: "_templates", value: out };
	},

	raw: (rows, block) => ({
		key: block.name || null,
		value: rows.map((r) => r.text.replace(/\s+$/, "")),
	}),

	pairs: (rows, block) => {
		const out = [];
		for (const r of nonEmpty(rows)) {
			const c = splitCols(r);
			if (c.length !== 2) {
				fail(`pairs 行必须是两列，实际 ${c.length} 列`, r.line);
				continue;
			}
			out.push([c[0], c[1]]);
		}
		return { key: block.name || null, value: out };
	},

	trio: (rows, block) => {
		const out = [];
		for (const r of nonEmpty(rows)) {
			const c = splitCols(r);
			if (c.length < 2 || c.length > 3) {
				fail(`trio 行必须是两或三列，实际 ${c.length} 列`, r.line);
				continue;
			}
			out.push([c[0], c[1], c[2] ?? ""]);
		}
		return { key: block.name || null, value: out };
	},
};

// ── per-file parse ─────────────────────────────────────────────────────

/**
 * Parse one zone file into `{ zone, chapters, settings, templates, raw }`.
 *
 * Chapters are keyed by number and carry their own payload bag, so a chapter
 * can never read another chapter's copy by accident.
 */
function parseZoneFile(file) {
	const abs = join(file.dir, file.name);
	const src = readFileSync(abs, "utf8");
	const { meta, bodyStart } = parseFrontMatter(src, file.name);
	const lines = src.split(/\r?\n/);

	const zone = meta.zone ?? "";
	const stem = file.name.replace(/\.md$/, "");
	if (!zone) {
		failIn(file.name, `front-matter 缺少必填字段 "zone"（应为 ${ZONES.join(" / ")}）`, 1);
	} else if (!ZONES.includes(zone)) {
		failIn(file.name, `zone "${zone}" 不是已知的分区（应为 ${ZONES.join(" / ")}）`, 1);
	} else if (zone !== stem) {
		failIn(
			file.name,
			`zone "${zone}" 与文件名 "${stem}" 不一致（文件名固定为 ${ZONES.map((z) => `${z}.md`).join(" / ")}）`,
			1,
		);
	}

	const tokens = scanBody(
		lines.slice(bodyStart),
		bodyStart + 1,
		file.name,
		zone,
	);

	const chapters = {};
	const settings = {};
	const templates = {};
	const raw = {};

	/** Chapter record, created lazily by its heading. */
	const payload = (num) =>
		(chapters[num] ??= { label: "", meta: "", sections: [], nav: {} });

	for (const tok of tokens) {
		if (tok.kind === "chapter") {
			const ch = tok.value;
			if (ch.num in chapters) {
				failIn(file.name, `章节 ${ch.num} 重复定义`, tok.line);
				continue;
			}
			for (const k of CHAPTER_META_REQUIRED) {
				if (!ch.meta[k]) {
					failIn(
						file.name,
						`第 ${ch.num} 章缺少必填元信息 "${k}"`,
						ch.line,
					);
				}
			}
			if (ch.meta.cmd && !KNOWN_COMMANDS.has(ch.meta.cmd)) {
				failIn(
					file.name,
					`第 ${ch.num} 章的 cmd "${ch.meta.cmd}" 不是已实现的命令`,
					ch.line,
				);
			}
			payload(ch.num).label = ch.label;
			payload(ch.num).meta = ch.meta;
			continue;
		}

		if (tok.kind === "meta") continue;

		// ── fenced block ──
		const { lang, name, rows, line, chapter } = tok;
		if (!BLOCK_PARSERS[lang]) {
			failIn(
				file.name,
				`未知的块类型 "${lang}"（已知：${Object.keys(BLOCK_PARSERS).join(", ")}）`,
				line,
			);
			continue;
		}
		const allowed = BLOCK_SCOPE[lang];
		if (!allowed.includes(zone)) {
			failIn(
				file.name,
				`块类型 "${lang}" 只允许出现在 ${allowed.join(" / ")} 分区，此文件是 ${zone} 分区`,
				line,
			);
			continue;
		}
		if (["raw", "pairs", "trio"].includes(lang) && !name) {
			failIn(
				file.name,
				`块类型 "${lang}" 必须带字段名，例如 \`\`\`${lang} bootLog`,
				line,
			);
			continue;
		}

		const before = errors.length;
		const { key, value } = BLOCK_PARSERS[lang](rows, tok, file.name, {
			chapter,
		});
		if (errors.length > before) continue;

		// zone-level bags
		if (key === "_settings") {
			Object.assign(settings, value);
			continue;
		}
		if (key === "_templates") {
			for (const [tname, body, args] of value) templates[tname] = [body, args];
			continue;
		}
		if (GLOBAL_BLOCKS.has(lang)) {
			if (!key) {
				failIn(file.name, `${lang} 块必须带字段名`, line);
				continue;
			}
			if (key in raw) {
				failIn(file.name, `字段 "${key}" 重复定义`, line);
				continue;
			}
			raw[key] = value;
			continue;
		}

		// chapter payload
		if (!chapter) {
			failIn(file.name, `块类型 "${lang}" 必须放在某个章节下面`, line);
			continue;
		}
		const rec = payload(chapter);

		/**
		 * A `field` block *opens a section*. Content blocks that follow land
		 * in that section, in source order. This is what lets one chapter say
		 * a thing, show evidence, then say the harder thing — several times.
		 */
		if (lang === "field") {
			const nav = {};
			const copy = {};
			for (const [k, v] of Object.entries(value)) {
				if (NAV_KEYS.has(k)) nav[k] = v;
				else copy[k] = v;
			}
			Object.assign(rec.nav, nav);
			rec.sections.push({ copy, blocks: [] });
			continue;
		}

		// a chapter always has at least one section, even if the author only
		// wrote bare content blocks with no surrounding prose
		let section = rec.sections.at(-1);
		if (!section) rec.sections.push((section = { copy: {}, blocks: [] }));

		if (lang === "note") {
			(section.blocks ??= []).push({ t: "note", lines: value });
			continue;
		}
		if (lang === "bars") {
			// consecutive `bars` blocks merge into one section block, so the
			// usual "one block per group" style reads as a single list
			const last = section.blocks.at(-1);
			if (last?.t === "bars") last.groups.push(...value);
			else section.blocks.push({ t: "bars", groups: value });
			continue;
		}
		if (lang === "identity") {
			section.blocks.push({ t: "identity", card: value });
			continue;
		}
		if (lang === "links") {
			section.blocks.push({
				t: "links",
				links: value.map(([label, href, text]) => ({ label, href, text })),
			});
			continue;
		}
		if (lang === "index") {
			section.blocks.push({ t: "index", rows: value });
			continue;
		}
		// `items` and `numbered` both land as a plain label/description list
		if (lang === "items" || lang === "numbered") {
			section.blocks.push({ t: "items", items: value });
			continue;
		}

		failIn(file.name, `块类型 "${lang}" 尚未接入章节渲染`, line);
	}

	return {
		zone,
		chapters: Object.fromEntries(
			Object.entries(chapters).map(([num, c]) => [
				num,
				{ label: c.label, meta: c.meta, nav: c.nav, sections: c.sections },
			]),
		),
		settings,
		templates,
		raw,
	};
}

// ── locale build ───────────────────────────────────────────────────────

function buildLocale(locale) {
	const dir = join(SRC, locale);
	if (!existsSync(dir)) {
		errors.push({
			file: `content/terminal/${locale}`,
			line: 0,
			message: "语言目录不存在",
		});
		return null;
	}

	// every locale must ship exactly the four zone files, nothing else
	for (const l of LOCALES) {
		const d = join(SRC, l);
		const files = existsSync(d) ? readdirSync(d).filter((f) => f.endsWith(".md")).sort() : [];
		const want = ZONES.map((z) => `${z}.md`).sort();
		if (files.join(",") !== want.join(",")) {
			const missing = want.filter((f) => !files.includes(f));
			const extra = files.filter((f) => !want.includes(f));
			failIn(
				`content/terminal/${l}`,
				"文件列表必须是 " +
					want.join(", ") +
					(missing.length ? `；缺少 ${missing.join(", ")}` : "") +
					(extra.length ? `；多出 ${extra.join(", ")}` : ""),
				0,
			);
		}
	}

	const journey = [];
	const chapters = {};
	const settings = {};
	const templates = {};
	const raw = {};

	for (const zone of ZONES) {
		const name = `${zone}.md`;
		if (!existsSync(join(dir, name))) continue;
		currentFile = `${locale}/${name}`;
		const built = parseZoneFile({ dir, name });
		Object.assign(settings, built.settings);
		for (const [t, v] of Object.entries(built.templates)) templates[t] = v;
		Object.assign(raw, built.raw);

		// chapters arrive in file order; number them into the tour
		for (const [num, entry] of Object.entries(built.chapters)) {
			if (num in chapters) {
				fail(`${num} 章在两个文件里都出现了`);
				continue;
			}
			chapters[num] = entry;
			if (TOUR_ZONES.has(zone)) {
				journey.push({
					label: `${num} · ${entry.label}`,
					text: entry.meta.narration,
					cmd: entry.meta.cmd,
					takeaway: entry.meta.takeaway,
				});
			}
		}
	}

	currentFile = `${locale}/*`;

	// the chapter set is fixed: no missing chapters, no unexpected ones
	const expected = Object.keys(CHAPTER_REQUIREMENTS);
	const got = Object.keys(chapters).sort();
	const missing = expected.filter((n) => !got.includes(n));
	const extra = got.filter((n) => !expected.includes(n));
	if (missing.length) fail(`缺少章节：${missing.join(", ")}`);
	if (extra.length) fail(`出现了未登记的章节：${extra.join(", ")}（允许的编号：${expected.join(", ")})`);

	// each chapter must carry its designated content block somewhere.
	// These are whole-file checks, so they report at line 0 like the others.
	for (const [num, kind] of Object.entries(CHAPTER_REQUIREMENTS)) {
		const c = chapters[num];
		if (!c) continue;
		if (!c.sections.some((sec) => sec.blocks.some((b) => b.t === kind))) {
			fail(`第 ${num} 章缺少必填内容块：${kind}`, 0);
		}
	}

	if (!journey.length) fail("content.md 里至少要有一章", 0);
	if (!settings.inputPlaceholder) fail("ui.md 里没有 inputPlaceholder（输入框占位文字）", 0);
	if (!templates.cmdNotFound) fail("ui.md 里没有 template: cmdNotFound", 0);
	if (!raw.manual?.length) fail("theater/ui 里没有 cmds 块（help 命令表是空的）", 0);

	// the tour must be a contiguous 01..N run — the left rail numbers itself
	const tourNums = journey.map((s) => s.label.slice(0, 2));
	const contiguous = tourNums.every(
		(n, i) => n === String(i + 1).padStart(2, "0"),
	);
	if (!contiguous) {
		fail(
			`content.md 的章节编号必须从 01 开始连续递增，实际是 ${tourNums.join(", ")}`,
			0,
		);
	}

	return { journey, chapters, settings, templates, raw };
}

// ── emit ───────────────────────────────────────────────────────────────

function emit(localeData) {
	const lines = [];
	lines.push("/* eslint-disable */");
	lines.push("/**");
	lines.push(" * GENERATED FILE — do not edit.");
	lines.push(" *");
	lines.push(" * Source: content/terminal/<locale>/{content,recap,ui,theater}.md");
	lines.push(" *         (see content/terminal/SPEC.md)");
	lines.push(" * Rebuild: npm run content:build");
	lines.push(" */");
	lines.push("");
	lines.push('import type { Locale } from "../../lib/i18n";');
	lines.push("");
	lines.push("export type TermChapter = {");
	lines.push("\tlabel: string;");
	lines.push("\ttext: string;");
	lines.push("\tcmd: string;");
	lines.push("\ttakeaway: string;");
	lines.push("};");
	lines.push("");
	lines.push("export type TermCopy = {");
	lines.push("\theader?: string;");
	lines.push("\tbody?: string;");
	lines.push("\tfooter?: string;");
	lines.push("\thint?: string;");
	lines.push("\trule?: string;");
	lines.push("\tcta?: string;");
	lines.push("};");
	lines.push("");
	lines.push("export type TermBlock =");
	lines.push("\t| { t: \"items\"; items: [string, string][] }");
	lines.push("\t| { t: \"bars\"; groups: { title: string; rows: [string, number, string][] }[] }");
	lines.push("\t| { t: \"links\"; links: { label: string; href: string; text: string }[] }");
	lines.push("\t| { t: \"index\"; rows: [string, string][] }");
	lines.push("\t| { t: \"identity\"; card: Record<string, string> }");
	lines.push("\t| { t: \"note\"; lines: string[] };");
	lines.push("");
	lines.push("export type TermSection = { copy: TermCopy; blocks: TermBlock[] };");
	lines.push("");
	lines.push("export type TermChapterDoc = {");
	lines.push("\tlabel: string;");
	lines.push("\tmeta: Record<string, string>;");
	lines.push("\tnav: Record<string, string>;");
	lines.push("\tsections: TermSection[];");
	lines.push("};");
	lines.push("");
	lines.push("export type TermContent = {");
	lines.push("\tjourney: TermChapter[];");
	lines.push("\tchapters: Record<string, TermChapterDoc>;");
	lines.push("\tsettings: Record<string, string>;");
	lines.push("\ttemplates: Record<string, { body: string; args: string[] }>;");
	lines.push("\traw: Record<string, unknown>;");
	lines.push("};");
	lines.push("");
	lines.push("const CONTENT: Record<Locale, TermContent> =");
	lines.push(
		JSON.stringify(localeData, null, "\t")
			.split("\n")
			.map((l, i) => (i === 0 ? l : "\t" + l))
			.join("\n") + " as unknown as Record<Locale, TermContent>;",
	);
	lines.push("");
	lines.push("export function getTermContent(locale: Locale): TermContent {");
	lines.push("\treturn CONTENT[locale] ?? CONTENT.en;");
	lines.push("}");
	lines.push("");
	lines.push("export default CONTENT;");
	lines.push("");
	return lines.join("\n");
}

// ── main ───────────────────────────────────────────────────────────────

const checkOnly = process.argv.includes("--check");
const localeData = {};
for (const locale of LOCALES) {
	const built = buildLocale(locale);
	if (!built) continue;
	// templates ship as {name: [body, argNames]} so the runtime can rebuild
	// the same function without eval()
	const templates = {};
	for (const [name, [body, args]] of Object.entries(built.templates)) {
		templates[name] = { body, args };
	}
	localeData[locale] = {
		journey: built.journey,
		chapters: built.chapters,
		settings: built.settings,
		templates,
		raw: built.raw,
	};
}

if (errors.length) {
	console.error(`\n✗ ${errors.length} 个问题：\n`);
	const byFile = new Map();
	for (const e of errors) {
		const key = e.file;
		if (!byFile.has(key)) byFile.set(key, []);
		byFile.get(key).push(e);
	}
	for (const [file, list] of byFile) {
		console.error(`  ${file}`);
		for (const e of list) {
			// line 0 = a whole-file rule, not one specific line
			const where = e.line ? `第 ${e.line} 行：` : "";
			console.error(`    · ${where}${e.message}`);
		}
		console.error("");
	}
	process.exit(1);
}

if (checkOnly) {
	console.log("✓ 校验通过，没有写入文件。");
	process.exit(0);
}

writeFileSync(OUT, emit(localeData), "utf8");
console.log(`✓ 已生成 ${OUT}`);
console.log(
	`  分区 ${ZONES.length} · 章节 ${localeData.en.journey.length} · 命令 ${localeData.en.raw.manual.length}`,
);