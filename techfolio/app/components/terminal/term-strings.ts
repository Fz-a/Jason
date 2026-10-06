"use client";

import { getTermContent } from "./term-content.generated";
import type {
	TermBlock,
	TermChapterDoc,
	TermCopy,
	TermSection,
} from "./term-content.generated";

/**
 * Runtime view over the generated terminal content.
 *
 * The authoring source lives in `content/terminal/<locale>/*.md` — see
 * `content/terminal/SPEC.md`. `npm run content:build` compiles those files
 * into `term-content.generated.ts`; this module only shapes them into the
 * flat, typed object `TerminalSection.tsx` consumes.
 *
 * A chapter is an ordered list of **sections**. Each section = a `field`
 * block's prose plus the content blocks that followed it, so one chapter can
 * open a claim, show the evidence, then state the harder conclusion — as many
 * times as the argument needs.
 */

export type TermStep = { label: string; text: string; cmd: string; takeaway: string };

export type { TermBlock, TermCopy, TermSection };

/** `[string, string]` rows as typed tuples. */
function pairs(v: unknown, key: string): [string, string][] {
	const o = v as Record<string, unknown>;
	const rows = (o?.[key] ?? []) as string[][];
	return rows.map((r) => [r[0], r[1] ?? ""]);
}

export type TermStrings = {
	// ── the six-chapter guided tour ────────────────────────────────────
	journey: TermStep[];
	/** Chapters keyed by number ("01".."07"), each an ordered section list. */
	chapters: Record<string, TermSection[]>;
	/** Left-rail chrome, authored in the recap chapter's `field` block. */
	navTitle: string;
	navSubtitle: string;
	navNotStarted: string;
	btnRun: string;
	btnNext: string;
	guidedTour: string;
	// ── chrome ─────────────────────────────────────────────────────────
	pressEnterToContinue: string;
	orTypeACommand: string;
	inputPlaceholder: string;
	welcomeLine1: string;
	welcomeLine2a: string;
	welcomeLine2b: string;
	advancing: string;
	restarting: string;
	tourDoneA: string;
	tourDoneB: string;
	/** The runnable command name shown between B and C — authored, not hardcoded. */
	tourDoneCmd: string;
	tourDoneC: string;
	tourDoneD: string;
	// ── manual ─────────────────────────────────────────────────────────
	manual: [string, string, string][];
	manualHeader: string;
	manualEgg: string;
	// ── theater ────────────────────────────────────────────────────────
	bootLog: string[];
	bootTitle: string;
	neofetchInfo: [string, string][];
	gitLog: string[];
	gitStatus: string[];
	hackLines: string[];
	hackNote: { a: string; intro: string; art: string; end: string };
	gallery: [string, string][];
	galleryHeader: string;
	dragonCaption: string;
	rocketCaption: string;
	fortunes: string[];
	// ── fun one-offs ───────────────────────────────────────────────────
	matrixWake: string;
	konamiLine: string;
	unameLine: string;
	topHeader: string;
	uptimeLine1: string;
	uptimeLine2: string;
	pingLost: string;
	gitUsage: string;
	gitStatusNothing: string;
	gitStatusShip: string;
	pythonLine1: string;
	pythonLine2: string;
	sudoSandwich: string;
	sudoDenied: string;
	rmReply: string;
	exitLine1: string;
	exitLine2: string;
	helloLine1: string;
	helloLine2: string;
	xyzzyReply: string;
	fortyTwoReply: string;
	didYouMean: string;
	tryHelp: string;
	catUsage: string;
	emailLabel: string;
	// ── built from `template` blocks ────────────────────────────────────
	themeSet: (next: string) => string;
	eggPrefix: (n: number, total: number, label: string) => string;
	gitStatusClean: (branch: string) => string;
	pingStats: (host: string) => string;
	pingHeader: (host: string) => string;
	cmdNotFound: (cmd: string) => string;
	catNoFile: (arg: string) => string;
	manNoEntry: (arg: string) => string;
	editorReply: (cmd: string) => string;
};

type Raw = Record<string, unknown>;

/**
 * Rebuild a `{arg}`-templated string into a function. Avoids `new Function`
 * so the whole content pipeline stays CSP-safe and statically analyzable.
 */
function bind(
	templates: Record<string, { body: string; args: string[] }>,
	name: string,
): (...a: never[]) => string {
	const t = templates[name];
	if (!t) return () => "";
	const slots = t.args.map((a) => new RegExp(`\\{${a}\\}`, "g"));
	return (...vals: never[]) => {
		let out = t.body;
		slots.forEach((re, i) => {
			out = out.replace(re, String(vals[i] ?? ""));
		});
		return out;
	};
}

export function getTermStrings(): TermStrings {
	const C = getTermContent("en");
	const s = C.settings;
	const raw = C.raw as Raw;
	const fn = (name: string) =>
		bind(C.templates, name) as unknown as (...a: string[]) => string;

	/** Section lists per chapter number, with an empty list for gaps. */
	const chapters: Record<string, TermSection[]> = {};
	for (const [num, doc] of Object.entries(C.chapters)) {
		chapters[num] = (doc as TermChapterDoc).sections ?? [];
	}
	const recap = (C.chapters["07"] ?? {}) as TermChapterDoc;

	return {
		journey: C.journey,
		chapters,
		navTitle: recap.nav?.navTitle ?? s.navTitle,
		navSubtitle: recap.nav?.navSubtitle ?? "",
		navNotStarted: recap.nav?.navNotStarted ?? "",
		btnRun: s.btnRun,
		btnNext: s.btnNext,
		guidedTour: s.guidedTour,

		pressEnterToContinue: s.pressEnterToContinue,
		orTypeACommand: s.orTypeACommand,
		inputPlaceholder: s.inputPlaceholder,
		welcomeLine1: s.welcomeLine1,
		welcomeLine2a: s.welcomeLine2a,
		welcomeLine2b: s.welcomeLine2b,
		advancing: s.advancing,
		restarting: s.restarting,
		tourDoneA: s.tourDoneA,
		tourDoneB: s.tourDoneB,
		tourDoneCmd: s.tourDoneCmd,
		tourDoneC: s.tourDoneC,
		tourDoneD: s.tourDoneD,

		manual: (raw.manual ?? []) as [string, string, string][],
		manualHeader: s.manualHeader,
		manualEgg: s.manualEgg,

		bootLog: (raw.bootLog ?? []) as string[],
		bootTitle: s.bootTitle,
		neofetchInfo: pairs(raw, "neofetchInfo"),
		gitLog: (raw.gitLog ?? []) as string[],
		gitStatus: (raw.gitStatus ?? []) as string[],
		hackLines: (raw.hackLines ?? []) as string[],
		hackNote: {
			a: s.hackNote_a,
			intro: s.hackNote_intro,
			art: s.hackNote_art,
			end: s.hackNote_end,
		},
		gallery: pairs(raw, "gallery"),
		galleryHeader: s.galleryHeader,
		dragonCaption: s.dragonCaption,
		rocketCaption: s.rocketCaption,
		fortunes: (raw.fortunes ?? []) as string[],

		matrixWake: s.matrixWake,
		konamiLine: s.konamiLine,
		unameLine: s.unameLine,
		topHeader: s.topHeader,
		uptimeLine1: s.uptimeLine1,
		uptimeLine2: s.uptimeLine2,
		pingLost: s.pingLost,
		gitUsage: s.gitUsage,
		gitStatusNothing: s.gitStatusNothing,
		gitStatusShip: s.gitStatusShip,
		pythonLine1: s.pythonLine1,
		pythonLine2: s.pythonLine2,
		sudoSandwich: s.sudoSandwich,
		sudoDenied: s.sudoDenied,
		rmReply: s.rmReply,
		exitLine1: s.exitLine1,
		exitLine2: s.exitLine2,
		helloLine1: s.helloLine1,
		helloLine2: s.helloLine2,
		xyzzyReply: s.xyzzyReply,
		fortyTwoReply: s.fortyTwoReply,
		didYouMean: s.didYouMean,
		tryHelp: s.tryHelp,
		catUsage: s.catUsage,
		emailLabel: s.emailLabel,

		themeSet: fn("themeSet"),
		eggPrefix: fn("eggPrefix") as unknown as TermStrings["eggPrefix"],
		gitStatusClean: fn("gitStatusClean"),
		pingStats: fn("pingStats"),
		pingHeader: fn("pingHeader"),
		cmdNotFound: fn("cmdNotFound"),
		catNoFile: fn("catNoFile"),
		manNoEntry: fn("manNoEntry"),
		editorReply: fn("editorReply"),
	};
}