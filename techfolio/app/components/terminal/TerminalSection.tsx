"use client";

import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useLocale } from "../../lib/i18n";
import { getTermStrings } from "./term-strings";
import type { TermSection } from "./term-strings";

/**
 * Home "experience" slide — one clean terminal that anyone can drive,
 * and a self-contained skill showcase: nothing navigates away.
 * Non-programmers never need to type: every command in the output is
 * clickable (text-adventure style), a "try →" row always suggests the
 * next move, and an idle auto-tour plays itself until you take over.
 * Every interactive action kills pending timers first, so hammering
 * chips/clicks can never interleave output. Typists keep everything:
 * Tab completion, ↑ history, Ctrl+L, hidden eggs.
 */

type Segment = { t: string; href?: string; run?: string; cls?: string };
type Line = { id: number; segments: Segment[]; cls?: string };

const PROMPT = "jason@portfolio:~$";

/** Keyword → label map for emphasis highlighting in prose output. */
const HIGHLIGHTS = [
	"STM32", "PID", "RTK", "GNSS", "Jetson", "OpenCV", "AGV", "PCB",
	"Beidou", "C/C++", "Python", "TypeScript", "Next.js", "embedded",
];

const COMMAND_NAMES = [
	...new Set([
		"next", "skip", "start", "restart", "tour", "role", "work", "path",
		"skills", "hack", "hollywood", "art", "buddha", "neumann", "dragon",
		"rocket", "help", "about", "whoami", "intro", "me", "who", "summary",
		"stats", "resume", "contact", "social", "email", "clear", "pwd",
		"date", "echo", "history", "man", "neofetch", "banner", "matrix",
		"theme", "top", "htop", "ping", "git", "uname", "uptime", "fortune",
		"python", "python3", "cat", "sudo", "rm", "exit", "quit", "vim",
		"vi", "nano", "emacs", "hello", "hi", "xyzzy", "42",
	]),
];

/** Three quiet suggestions under the window — the only chrome we keep. */
const SUGGESTIONS = ["role", "work", "skills"];

/**
 * Chapter banner: a numbered section rule that makes the structure of the
 * tour obvious at a glance instead of a wall of undifferentiated output.
 * Built from the journey label, which is already "01 · who I am".
 */
function chapter(label: string): Line {
	const [n, ...rest] = label.split("· ");
	const title = (rest.join("· ") || label).trim();
	return rich([
		{ t: `  ══ ${n.trim()} `, cls: "text-[var(--tt-acc)] font-bold" },
		{ t: title.toUpperCase(), cls: "font-bold tracking-[0.16em]" },
		{ t: " ", cls: "text-[var(--tt-acc)]" },
	]);
}

/** Banner for content that isn't one of the six numbered chapters. */
function banner(title: string): Line {
	return rich([
		{ t: "  ══ ", cls: "text-[var(--tt-acc)] font-bold" },
		{ t: title.toUpperCase(), cls: "font-bold tracking-[0.16em]" },
		{ t: " ", cls: "text-[var(--tt-acc)]" },
	]);
}

const BANNER = [
	"     _                        ",
	"    | | __ _ ___  ___  _ __   ",
	" _  | |/ _` / __|/ _ \\| '_ \\  ",
	"| |_| | (_| \\__ \\ (_) | | | | ",
	" \\___/ \\__,_|___/\\___/|_| |_| ",
];

const NEOFETCH_LOGO = [
	"  ┌───────────────┐  ",
	"  │ · · · · · · · │  ",
	"  │   J A S O N   │  ",
	"  │     O S       │  ",
	"  │ · · · · · · · │  ",
	"  └───────────────┘  ",
];

const BUDDHA_ART = [
	"            .-~~~~~-.",
	"           /  .--.   \\",
	"          |  /    \\   |",
	"          | | -  - |  |",
	"          |  \\ __ /   |",
	"           \\  '--'   /",
	"        ____\\      /____",
	"      /      \\    /      \\",
	"     /   /\\   \\  /   /\\   \\",
	"    |   |  \\   \\/   /  |   |",
	"     \\  |   \\      /   |  /",
	"      \\ |    \\    /    | /",
	"       \\|     \\__/     |/",
	"        \\    /    \\    /",
	"         \\  / |  | \\  /",
	"          |/  |  |  \\|",
	"          |   |  |   |",
	"          |  /    \\  |",
	"          | /      \\ |",
	"         /|  \\    /  |\\",
	"        / |   \\  /   | \\",
	"       (  |    \\/    |  )",
	"        \\ |   /\\     | /",
	"         \\|  /  \\    |/",
	"        __/ /    \\   \\__",
	"       (___/      \\___)",
];

const BUDDHA_KOAN = [
	"  while (alive) {",
	"      breathe();",
	"      ship();",
	"  }",
];

const NEUMANN_ART = [
	"        JOHN  von  NEUMANN   (1903 — 1957)",
	"        stored-program architecture —",
	"        the machine you are reading this on",
	"",
	"        ┌──────────────────────────┐",
	"        │          INPUT           │",
	"        └────────────┬─────────────┘",
	"                     ▼",
	"        ┌──────────────────────────┐",
	"        │          MEMORY          │",
	"        │   program + data, one    │",
	"        │     address space        │",
	"        └────────────┬─────────────┘",
	"                     ▼",
	"        ┌──────────────────────────┐",
	"        │           CPU            │",
	"        │  ┌───────┐   ┌────────┐  │",
	"        │  │  ALU  │   │CONTROL │  │",
	"        │  └───────┘   └────────┘  │",
	"        └────────────┬─────────────┘",
	"                     ▼",
	"        ┌──────────────────────────┐",
	"        │          OUTPUT          │",
	"        └──────────────────────────┘",
	"",
	"  \"If people do not believe that mathematics is simple,",
	"   it is only because they do not realize how",
	"   complicated life is.\"",
];

const DRAGON_ART = [
	"                ___====-_  _-====___",
	"          _--^^^#####//      \\\\#####^^^--_",
	"       _-^##########// (    ) \\\\##########^-_",
	"      -############//  |\\^^/|  \\\\############-",
	"    _/############//   (@::@)   \\\\############\\_",
	"   /#############((     \\\\//     ))#############\\",
	"  -###############\\\\    (oo)    //###############-",
	" -#################\\\\  /    \\  //#################-",
	"-###################\\\\/      \\//###################-",
	"_#/|##########/\\######(   /\\   )######/\\##########|\\#_",
	"|/ |#/\\#/\\#/\\/  \\#/\\##\\  |  |  /##/\\#/  \\/\\#/\\#/\\#| \\|",
	"`  |/  V  V  `   V  \\#\\| |  | |/#/  V   '  V  V  \\|  '",
	"   `   `  `      `   / | |  | | \\   '      '  '   '",
	"                    (  | |  | |  )",
	"                   __\\ | |  | | /__",
	"                  (vvv(VVV)(VVV)vvv)",
];

const ROCKET_ART = [
	"               /\\",
	"              /  \\",
	"             |    |",
	"             | SH |",
	"             | IP |",
	"             | IT |",
	"            /|    |\\",
	"           / |    | \\",
	"          |  |    |  |",
	"          | /      \\ |",
	"          |/        \\|",
	"         /|   (())   |\\",
	"        | |__________| |",
	"        |  | |    | |  |",
	"        |__|_|____|_|__|",
	"           /  |  |  \\",
	"          /   |  |   \\",
	"          |  _|  |_  |",
	"          |_/      \\_|",
	"             *|  |*",
	"            **|  |**",
	"           ***|  |***",
	"          ****|  |****",
	"         *\\** |  | **/*",
	"           \\  |  /",
	"            \\ | /",
	"             \\|/",
	"               V",
];

type Theme = {
	bg: string;
	border: string;
	text: string;
	acc: string;
	hl: string;
	barText: string;
};

/**
 * Frosted-glass terminal, drawn from the site's own design tokens so it
 * feels like a light pane on the cream slide rather than a dark slab:
 *   cream #F7F1E8 · forest #162b26 · teal #0F4C45 · deep #043439
 *   gold #E8C468 (accent) · sage #6FA98C
 * Both themes are light and translucent; the toggle only shifts the
 * accent hue (teal/sage vs. gold), never the lightness.
 */
const THEMES: Record<"green" | "amber", Theme> = {
	green: {
		bg: "rgba(255,253,249,0.62)",
		border: "rgba(22,43,38,0.12)",
		text: "#1E322C",
		acc: "#0F4C45",
		hl: "#0F4C45",
		barText: "rgba(22,43,38,0.55)",
	},
	amber: {
		bg: "rgba(255,252,246,0.62)",
		border: "rgba(168,120,42,0.18)",
		text: "#2B2415",
		acc: "#9A6B1F",
		hl: "#9A6B1F",
		barText: "rgba(74,58,26,0.55)",
	},
};

let lineId = 0;
const nextId = () => ++lineId;

function out(text: string, cls?: string): Line {
	return { id: nextId(), segments: [{ t: text }], cls };
}
function rich(segments: Segment[], cls?: string): Line {
	return { id: nextId(), segments, cls };
}
function cmdLine(cmd: string): Line {
	return {
		id: nextId(),
		segments: [
			{ t: `${PROMPT} `, cls: "text-[var(--tt-acc)]" },
			{ t: cmd, cls: "text-[var(--tt-text)]" },
		],
	};
}
const HL = "text-[var(--tt-hl)]";
/** Bold + bright emphasis for the key facts we want to land. */
const EMPH = "font-bold text-[var(--tt-hl)]";
/** Click-to-run segments get a dotted underline so visitors can tell. */
const RUNNABLE =
	"cursor-pointer underline decoration-dotted underline-offset-4 decoration-current/40 hover:decoration-current";

/**
 * Split a sentence into segments, bolding any keyword in HIGHLIGHTS.
 * This is how we make the useful info stand out instead of blending in.
 */
function emphasize(text: string): Segment[] {
	const re = new RegExp(`(${HIGHLIGHTS.map(escapeRegExp).join("|")})`, "i");
	const parts = text.split(re);
	return parts.map((part) =>
		HIGHLIGHTS.some((k) => k.toLowerCase() === part.toLowerCase())
			? { t: part, cls: EMPH }
			: { t: part },
	);
}

function escapeRegExp(s: string): string {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Render one chapter as an ordered list of sections.
 *
 * This is the single place chapter content is drawn. A section is its `field`
 * prose (header → body → content → footer) followed by whatever content
 * blocks the author put under it, so adding a chapter or giving an existing
 * one a second argument needs no code change at all — only new Markdown.
 */
function renderSections(sections: TermSection[]): Line[] {
	const rows: Line[] = [];
	for (const sec of sections) {
		const { header, body, footer, hint, rule, cta } = sec.copy;
		if (header) {
			rows.push(out(`  ${header}`, EMPH));
			rows.push(out(""));
		}
		if (body) {
			rows.push(rich([{ t: `  ${body}`, cls: "opacity-85" }]));
			rows.push(out(""));
		}

		for (const b of sec.blocks) {
			switch (b.t) {
				case "identity": {
					const c = b.card;
					rows.push(
						rich([
							{ t: "  " },
							{ t: c.name ?? "", cls: "font-extrabold tracking-[0.18em]" },
						]),
					);
					if (c.title)
						rows.push(rich([{ t: "  " }, { t: c.title, cls: EMPH }]));
					if (c.meta)
						rows.push(rich([{ t: "  " }, { t: c.meta, cls: "opacity-60" }]));
					if (c.oneLine) {
						rows.push(out(""));
						rows.push(rich([{ t: `  ${c.oneLine}`, cls: "opacity-85" }]));
					}
					rows.push(out(""));
					break;
				}

				case "items":
					for (const [k, v] of b.items) {
						rows.push(
							rich([
								{ t: "  ▸ ", cls: "text-[var(--tt-acc)]" },
								{ t: k, cls: EMPH },
								...(v ? [{ t: "\n     " }, ...emphasize(v)] : []),
							]),
						);
					}
					if (b.items.length) rows.push(out(""));
					break;

				case "bars":
					for (const g of b.groups) {
						rows.push(out(`  ${g.title}`, HL));
						// Pad to the widest label in the whole chapter, so the
						// bars line up even when a name is longer than 10 chars.
						const w = Math.max(
							...b.groups.flatMap((x) => x.rows.map((r) => r[0].length)),
							6,
						);
						for (const [k, lvl, v] of g.rows) {
							rows.push(
								rich([
									{ t: `    ${k.padEnd(w)} `, cls: HL },
									{
										t: `[${"#".repeat(lvl)}${"·".repeat(10 - lvl)}]  `,
										cls: "text-[var(--tt-acc)]",
									},
									...emphasize(v),
								]),
							);
						}
						rows.push(out(""));
					}
					break;

				case "links": {
					const w = Math.max(...b.links.map((l) => l.label.length), 0);
					for (const l of b.links) {
						rows.push(
							rich([
								{ t: `  ${l.label.padEnd(w)}  `, cls: HL },
								{
									t: l.text,
									href: l.href,
									cls: "underline underline-offset-4 opacity-90 hover:opacity-100",
								},
							]),
						);
					}
					rows.push(out(""));
					break;
				}

				case "index":
					for (const [n, label] of b.rows) {
						rows.push(
							rich([
								{ t: `  ${n}   `, cls: "text-[var(--tt-acc)] font-bold" },
								{ t: label, cls: "opacity-85" },
							]),
						);
					}
					if (b.rows.length) rows.push(out(""));
					break;

				case "note":
					for (const l of b.lines) rows.push(out(`  ${l}`, "opacity-75"));
					rows.push(out(""));
					break;
			}
		}

		if (rule) {
			rows.push(rich([{ t: `  ${rule}`, cls: EMPH }]));
			rows.push(out(""));
		}
		if (footer) {
			rows.push(rich([{ t: `  ${footer}`, cls: "opacity-70" }]));
			rows.push(out(""));
		}
		if (hint) rows.push(out(`  ${hint}`, "opacity-70"));
		if (cta) rows.push(out(`  ${cta}`, "opacity-70"));
	}
	return rows;
}

function levenshtein(a: string, b: string): number {
	const m = a.length;
	const n = b.length;
	const dp: number[] = Array.from({ length: n + 1 }, (_, j) => j);
	for (let i = 1; i <= m; i++) {
		let prev = dp[0];
		dp[0] = i;
		for (let j = 1; j <= n; j++) {
			const tmp = dp[j];
			dp[j] = Math.min(
				dp[j] + 1,
				dp[j - 1] + 1,
				prev + (a[i - 1] === b[j - 1] ? 0 : 1),
			);
			prev = tmp;
		}
	}
	return dp[n];
}

const EGG_TOTAL = 4;

/**
 * Gallery keys that have ASCII art behind them, so `art` may render them as
 * click-to-run. Everything else in a `gallery` block is a plain label.
 */
const ART_TARGETS = new Set(["buddha", "neumann", "dragon", "rocket"]);

export function TerminalSection() {
	const T = useMemo(() => getTermStrings(), []);
	const [lines, setLines] = useState<Line[]>([]);
	const [value, setValue] = useState("");
	const [booted, setBooted] = useState(false);
	const [themeName, setThemeName] = useState<"green" | "amber">("green");
	const [matrixOn, setMatrixOn] = useState(false);
	const [stepIdx, setStepIdx] = useState(-1); // current journey chapter (-1 = not started)
	const eggsRef = useRef(new Set<string>());
	const historyRef = useRef<string[]>([]);
	const historyIdxRef = useRef(-1);
	const scrollRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const sectionRef = useRef<HTMLElement>(null);
	const matrixCanvasRef = useRef<HTMLCanvasElement>(null);
	const timerRef = useRef<number[]>([]);
	const stepIdxRef = useRef(-1);
	const runRef = useRef<(raw: string) => void>(() => {});

	const theme = THEMES[themeName];

	const print = useCallback((newLines: Line[]) => {
		setLines((prev) => [...prev, ...newLines].slice(-500));
	}, []);

	const stopTimers = useCallback(() => {
		timerRef.current.forEach((t) => window.clearTimeout(t));
		timerRef.current = [];
	}, []);

	const printStaggered = useCallback(
		(newLines: Line[], stepMs = 45, startMs = 0) => {
			// Batch small groups per tick so renders are fewer and the
			// cascade reads as a smooth flow rather than a per-line stutter.
			const batch = stepMs <= 40 ? 2 : 1;
			let i = 0;
			const tick = () => {
				const chunk = newLines.slice(i, i + batch);
				if (chunk.length) print(chunk);
				i += batch;
				if (i < newLines.length) {
					timerRef.current.push(window.setTimeout(tick, stepMs));
				}
			};
			timerRef.current.push(window.setTimeout(tick, startMs));
		},
		[print],
	);

	const unlockEgg = useCallback(
		(id: string, label: string) => {
			if (eggsRef.current.has(id)) return;
			eggsRef.current.add(id);
			print([
				out(
					`  ✦ ${T.eggPrefix(eggsRef.current.size, EGG_TOTAL, label)}`,
					HL,
				),
				out(""),
			]);
		},
		[print, T],
	);

	const bootLines = useCallback(
		(): Line[] => [
			...T.bootLog.map((l) =>
				out(
					l,
					l.startsWith("[  OK  ]")
						? "text-[var(--tt-acc)]"
						: "opacity-60",
				),
			),
			...BANNER.map((l) => out(l, "text-[var(--tt-acc)]")),
			out(""),
			out(T.bootTitle),
			out(""),
		],
		[T],
	);

	// Boot once when the slide first scrolls into view.
	useEffect(() => {
		const el = sectionRef.current;
		if (!el) return;
		const io = new IntersectionObserver(
			(entries) => {
				if (!entries.some((e) => e.isIntersecting)) return;
				io.disconnect();
				printStaggered(bootLines(), 60, 80);
				setBooted(true);
			},
			{ threshold: 0.35 },
		);
		io.observe(el);
		return () => io.disconnect();
	}, [printStaggered, bootLines]);

	// Scrollback pinned to bottom — smooth, so cascades glide instead of jump.
	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;
		const raf = requestAnimationFrame(() => {
			el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
		});
		return () => cancelAnimationFrame(raf);
	}, [lines, stepIdx]);

	/**
	 * Visitor takes over: kill the tour AND every pending timer, so a
	 * new action can never interleave with stale staggered output —
	 * this is what keeps rapid clicking bug-free.
	 */
	const cancelGhost = useCallback(() => {
		stopTimers();
	}, [stopTimers]);

	// Matrix rain overlay.
	useEffect(() => {
		if (!matrixOn) return;
		const canvas = matrixCanvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const parent = canvas.parentElement!;
		canvas.width = parent.clientWidth;
		canvas.height = parent.clientHeight;
		const fontSize = 15;
		const cols = Math.ceil(canvas.width / fontSize);
		const drops = Array.from({ length: cols }, () =>
			Math.floor(Math.random() * -40),
		);
		const chars = "アイウエオカキクケコ01";

		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		const iv = setInterval(() => {
			ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = "#6FA98C";
			ctx.font = `${fontSize}px monospace`;
			for (let i = 0; i < cols; i++) {
				const ch = chars[Math.floor(Math.random() * chars.length)];
				ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
				if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
					drops[i] = 0;
				}
				drops[i]++;
			}
		}, 66);

		const stop = () => setMatrixOn(false);
		const timer = setTimeout(stop, 8000);
		window.addEventListener("keydown", stop);
		return () => {
			clearInterval(iv);
			clearTimeout(timer);
			window.removeEventListener("keydown", stop);
		};
	}, [matrixOn]);

	// Konami code — anywhere: ↑↑↓↓←→←→ B A
	useEffect(() => {
		const seq = [
			"arrowup", "arrowup", "arrowdown", "arrowdown",
			"arrowleft", "arrowright", "arrowleft", "arrowright",
			"b", "a",
		];
		let idx = 0;
		const onKey = (e: KeyboardEvent) => {
			const k = e.key.toLowerCase();
			idx = k === seq[idx] ? idx + 1 : k === seq[0] ? 1 : 0;
			if (idx < seq.length) return;
			idx = 0;
			print([out(`  ${T.konamiLine}`, HL)]);
			unlockEgg("konami", "you know the code");
			setThemeName((t0) => (t0 === "green" ? "amber" : "green"));
			setTimeout(
				() => setThemeName((t0) => (t0 === "green" ? "amber" : "green")),
				2600,
			);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [print, unlockEgg, T]);

	/** Advance the guided journey by one chapter. */
	const advance = useCallback(() => {
		stopTimers();
		const i = stepIdxRef.current + 1;
		if (i >= T.journey.length) {
			// finished — hand them the recap and a way to restart
			stepIdxRef.current = -1;
			setStepIdx(-1);
			print([
				out(`  ${T.tourDoneA}`, EMPH),
				rich([
					{ t: `  ${T.tourDoneB}` },
					{ t: T.tourDoneCmd, cls: `${HL} ${RUNNABLE}`, run: T.tourDoneCmd },
					{ t: T.tourDoneC },
				]),
				rich([
					{ t: "  " },
					{ t: "restart", cls: `${HL} ${RUNNABLE}`, run: "restart" },
					{ t: " / " },
					{ t: "help", cls: `${HL} ${RUNNABLE}`, run: "help" },
					{ t: T.tourDoneD },
				]),
				out(""),
			]);
			return;
		}
		const step = T.journey[i];
		stepIdxRef.current = i;
		setStepIdx(i);
		// Narration only — the chapter handler prints its own numbered banner,
		// so the label never appears twice.
		print([out(`  ${step.text}`, "opacity-70")]);
		// show the command line, then run it after a short beat so the
		// narration reads before the output pours in.
		timerRef.current.push(
			window.setTimeout(() => {
				runRef.current(step.cmd);
				// land the takeaway: a one-line highlight after each chapter.
				timerRef.current.push(
					window.setTimeout(() => {
						print([
							rich([
								{ t: "  └─ ", cls: "text-[var(--tt-acc)]" },
								{ t: step.takeaway, cls: EMPH },
							]),
							out(""),
						]);
					}, 500),
				);
			}, 650),
		);
	}, [stopTimers, print, T]);

	const run = useCallback(
		(raw: string) => {
			const trimmed = raw.trim();
			if (trimmed) historyRef.current.push(trimmed);
			historyIdxRef.current = -1;

			const echo = cmdLine(trimmed);
			if (!trimmed) {
				print([echo]);
				return;
			}
			const [cmd, ...args] = trimmed.toLowerCase().split(/\s+/);
			const arg = args.join(" ");

			switch (cmd) {
			case "next":
			case "skip":
			case "start":
				print([
					echo,
					out(`  ${T.advancing}`),
					out(""),
				]);
				advance();
				break;

			case "tour":
			case "restart": {
				stepIdxRef.current = -1;
				setStepIdx(-1);
				print([
					echo,
					out(`  ${T.restarting}`),
					out(""),
				]);
				break;
			}

			case "hack":
			case "hollywood":
				// `hackLines` is optional — a theater file may drop the fake
				// intrusion entirely and keep only the pointer note.
				printStaggered(
					[
						echo,
						...T.hackLines.map((l) =>
							out(l, l.startsWith(">>") ? HL : undefined),
						),
						rich([
							{ t: T.hackNote.a },
							{ t: "intro", cls: `${HL} ${RUNNABLE}`, run: "intro" },
							{ t: T.hackNote.intro },
							{ t: "art", cls: `${HL} ${RUNNABLE}`, run: "art" },
							{ t: T.hackNote.art },
							{ t: T.hackNote.end },
						]),
						out(""),
					],
					26,
				);
				break;

			case "art":
				print([
					echo,
					out(`  ${T.galleryHeader}`),
					...T.gallery.map(([a, d]) =>
						// A gallery row is clickable only when its key is a real
						// command with ASCII art behind it; conceptual rows
						// (hardware, rtk, agv…) are labels, not run targets.
						ART_TARGETS.has(a)
							? rich([
									{ t: `  ${a.padEnd(10)}`, cls: `${HL} ${RUNNABLE}`, run: a },
									{ t: d },
								])
							: rich([{ t: `  ${a.padEnd(10)}`, cls: HL }, { t: d }]),
					),
					out(""),
				]);
				break;

				case "buddha":
					printStaggered(
						[
							echo,
							...BUDDHA_ART.map((l) => out(l, "text-[var(--tt-acc)]")),
							out(""),
							...BUDDHA_KOAN.map((l) => out(l)),
							out(""),
						],
						30,
					);
					break;

				case "neumann":
					printStaggered(
						[
							echo,
							...NEUMANN_ART.map((l) => out(l, "text-[var(--tt-acc)]")),
							out(""),
						],
						30,
					);
					break;

			case "dragon":
				printStaggered(
					[
						echo,
						...DRAGON_ART.map((l) => out(l, "text-[var(--tt-acc)]")),
						out(`  ${T.dragonCaption}`),
						out(""),
					],
					30,
				);
				break;

			case "rocket":
				printStaggered(
					[
						echo,
						...ROCKET_ART.map((l) => out(l, "text-[var(--tt-acc)]")),
						out(`  ${T.rocketCaption}`),
						out(""),
					],
					30,
				);
				break;

			case "help":
				print([
					echo,
					out(`  ${T.manualHeader}`),
					...T.manual.map(([c, d, r]) =>
						rich([
							{ t: `  ${c.padEnd(16)}`, cls: `${HL} ${RUNNABLE}`, run: r },
							{ t: d },
						]),
					),
					rich([
						{ t: "  + ", cls: HL },
						{ t: `${EGG_TOTAL} hidden eggs`, cls: HL },
						{ t: ` — ${T.manualEgg}` },
					]),
					out(""),
				]);
				break;

			case "man": {
				const entry = T.manual.find(([c]) =>
					c.split(" /").some((n) => n.trim().startsWith(arg)),
				);
				print([
					echo,
					entry
						? rich([
								{ t: `  ${entry[0]}`, cls: `${HL} ${RUNNABLE}`, run: entry[2] },
								{ t: ` — ${entry[1]}` },
							])
						: out(`  ${T.manNoEntry(arg)}`),
					out(""),
				]);
				break;
			}

			case "cat": {
				if (arg === "about.txt") return run("about");
				if (arg === "skills.txt") return run("skills");
				if (arg === "contact.txt") return run("contact");
				print([
					echo,
					out(arg ? `  ${T.catNoFile(arg)}` : `  ${T.catUsage}`),
					out(""),
				]);
				break;
			}

	// ── chapters 01-06 · one generic renderer ───────────────────────
			// A chapter is just a number plus a list of sections, so adding or
			// reshaping one is a Markdown edit — never a code edit here.
			case "role":
			case "do":
			case "job":
			case "work":
			case "projects":
			case "skills":
			case "path":
			case "career":
			case "exp":
			case "about":
			case "whoami":
			case "intro":
			case "me":
			case "who":
			case "contact":
			case "social": {
				// Each chapter's own `cmd` names it, so whatever the visitor
				// typed is all we need to find both the journey step and the
				// chapter body — no hardcoded chapter table to keep in sync.
				const at = T.journey.findIndex((s) => s.cmd === cmd);
				if (at < 0) break;
				const rows: Line[] = [
					echo,
					chapter(T.journey[at].label),
					out(""),
				];
				rows.push(
					...renderSections(T.chapters[T.journey[at].label.slice(0, 2)] ?? []),
				);
				printStaggered(rows, 70);
				break;
			}

			// ── chapter 07 · the recap ────────────────────────────────────
			case "summary":
			case "stats":
			case "resume":
			case "index": {
				const rows: Line[] = [echo, banner(T.navTitle), out("")];
				rows.push(...renderSections(T.chapters["07"] ?? []));
				rows.push(
					rich([
						{ t: "  " },
						{ t: "summary", cls: `${HL} ${RUNNABLE}`, run: "summary" },
						{ t: " · " },
						{ t: "restart", cls: `${HL} ${RUNNABLE}`, run: "restart" },
						{ t: " · " },
						{ t: "help", cls: `${HL} ${RUNNABLE}`, run: "help" },
					]),
				);
				rows.push(out(""));
				printStaggered(rows, 70);
				break;
			}

			case "email":
				print([echo, out("  1106467336@qq.com"), out("")]);
				break;

			case "neofetch": {
				const rows: Line[] = [echo];
				const n = Math.max(NEOFETCH_LOGO.length, T.neofetchInfo.length);
				for (let i = 0; i < n; i++) {
					const logo = NEOFETCH_LOGO[i] ?? " ".repeat(20);
					const info = T.neofetchInfo[i];
					rows.push(
						rich([
							{ t: logo, cls: "text-[var(--tt-acc)]" },
							...(info
								? ([
										{ t: `${info[0]}: `, cls: HL },
										...emphasize(info[1]),
									] as Segment[])
								: []),
						]),
					);
				}
				rows.push(out(""));
				printStaggered(rows, 40);
				break;
			}

				case "banner":
					print([
						echo,
						...BANNER.map((l) => out(l, "text-[var(--tt-acc)]")),
						out(""),
					]);
					break;

			case "matrix":
				print([echo, out(`  ${T.matrixWake}`), out("")]);
				setMatrixOn(true);
				break;

			case "theme":
				setThemeName((t0) => (t0 === "green" ? "amber" : "green"));
				print([
					echo,
					out(
						`  ${T.themeSet(themeName === "green" ? "amber" : "green")}`,
					),
					out(""),
				]);
				break;

			case "git":
				if (args[0] === "log") {
					print([
						echo,
						...T.gitLog.map((l) =>
							rich([
								{ t: l.slice(0, 8), cls: HL },
								...emphasize(l.slice(8)),
							]),
						),
						out(""),
					]);
				} else if (args[0] === "status") {
					print([
						echo,
						...T.gitStatus.map((l) => out(`  ${l}`)),
						out(""),
					]);
				} else {
					print([echo, out(`  ${T.gitUsage}`), out("")]);
				}
				break;

			case "ping": {
				const host = arg || "github.com";
				const fake = Array.from({ length: 4 }, (_, i) =>
					out(
						`  64 bytes from ${host}: icmp_seq=${i + 1} ttl=57 time=${(8 + Math.random() * 22).toFixed(1)} ms`,
					),
				);
				printStaggered(
					[
						echo,
						out(`  ${T.pingHeader(host)}`),
						...fake,
						out(`  ${T.pingStats(host)}`),
						out(`  ${T.pingLost}`),
						out(""),
					],
					260,
				);
				break;
			}

			case "top":
			case "htop":
				print([
					echo,
					out(`    ${T.topHeader}`),
					...[
						["1337", "agv-bring-up", "42.0", "12.1"],
						["1024", "rtk-survey", "18.6", "8.4"],
						["0512", "pid-tuner", "13.7", "4.2"],
						["0256", "pcb-router", "9.9", "6.6"],
						["0001", "curiosity", "100.0", "∞"],
					].map(([pid, c, cpu, mem]) =>
						rich([
							{ t: `  ${pid.padStart(6)}  ` },
							{ t: c.padEnd(15), cls: HL },
							{ t: `${cpu.padStart(5)}  ${mem.padStart(5)}` },
						]),
					),
					out(""),
				]);
				break;

			case "uname":
				print([echo, out(`  ${T.unameLine}`), out("")]);
				break;

			case "uptime":
				print([
					echo,
					out(`  ${T.uptimeLine1}`),
					out(`  ${T.uptimeLine2}`),
					out(""),
				]);
				break;

			case "fortune":
				print([
					echo,
					out(`  ${T.fortunes[Math.floor(Math.random() * T.fortunes.length)]}`),
					out(""),
				]);
				break;

			case "python":
			case "python3":
				print([
					echo,
					rich([
						{ t: `  ${T.pythonLine1}` },
						{
							t: "/py",
							href: "/py/",
							cls: "underline underline-offset-4",
						},
						{ t: T.pythonLine2 },
					]),
					out(""),
				]);
				break;

				case "history":
					print([
						echo,
						...historyRef.current.map((h, i) =>
							out(`  ${String(i + 1).padStart(4)}  ${h}`),
						),
						out(""),
					]);
					break;

				case "clear":
					setLines([]);
					break;

				case "pwd":
					print([echo, out("  /home/jason"), out("")]);
					break;

				case "date":
					print([echo, out(`  ${new Date().toString()}`), out("")]);
					break;

				case "echo":
					print([echo, out(`  ${arg}`), out("")]);
					break;

			case "sudo":
				if (arg === "make me a sandwich") {
					print([echo, out(`  ${T.sudoSandwich}`), out("")]);
					unlockEgg("sandwich", "xkcd 149, honored");
				} else {
					print([
						echo,
						out(`  ${T.sudoDenied}`),
						out(""),
					]);
				}
				break;

			case "rm":
				print([echo, out(`  ${T.rmReply}`), out("")]);
				break;

			case "exit":
			case "quit":
				print([
					echo,
					rich([
						{ t: `  ${T.exitLine1}` },
						{ t: "skills", cls: `${HL} ${RUNNABLE}`, run: "skills" },
						{ t: T.exitLine2 },
					]),
					out(""),
				]);
				break;

			case "vim":
			case "vi":
			case "nano":
			case "emacs":
				print([
					echo,
					out(`  ${T.editorReply(cmd)}`),
					out(""),
				]);
				break;

			case "hello":
			case "hi":
				print([
					echo,
					rich([
						{ t: `  ${T.helloLine1}` },
						{ t: "skills", cls: `${HL} ${RUNNABLE}`, run: "skills" },
						{ t: T.helloLine2 },
					]),
					out(""),
				]);
				break;

			case "xyzzy":
				print([echo, out(`  ${T.xyzzyReply}`), out("")]);
				unlockEgg("xyzzy", "plugh");
				break;

			case "42":
				print([echo, out(`  ${T.fortyTwoReply}`), out("")]);
				unlockEgg("42", "deep thought");
				break;

			default: {
				const suggestion = COMMAND_NAMES.filter(
					(c) => levenshtein(cmd, c) <= 2,
				).sort((a, b) => levenshtein(cmd, a) - levenshtein(cmd, b))[0];
				print([
					echo,
					out(`  ${T.cmdNotFound(cmd)}`),
					...(suggestion
						? [
								rich([
									{ t: `  ${T.didYouMean}` },
									{
										t: suggestion,
										cls: `${HL} ${RUNNABLE}`,
										run: suggestion,
									},
									{ t: "?" },
								]),
							]
						: [out(`  ${T.tryHelp}`)]),
					out(""),
				]);
			}
		}

	},
	// eslint-disable-next-line react-hooks/exhaustive-deps
	[print, printStaggered, themeName, unlockEgg, advance, T],
);
	runRef.current = run;

	// After boot: show the first "press Enter" prompt.
	useEffect(() => {
		if (!booted) return;
		const bootMs = 80 + 60 * bootLines().length + 400;
		timerRef.current.push(
			window.setTimeout(() => {
				stepIdxRef.current = -1;
				setStepIdx(-1);
			print([
				rich([
					{ t: "  " },
					{ t: ">>", cls: HL },
					{ t: `  ${T.welcomeLine1}` },
				]),
				rich([
					{ t: "  " },
					{ t: ">>", cls: HL },
					{ t: `  ${T.welcomeLine2a}` },
					{ t: "Enter", cls: HL },
				{ t: T.welcomeLine2b },
			]),
			out(""),
		]);
		}, bootMs + 300),
	);
	return stopTimers;
}, [booted, bootLines, stopTimers, print, T]);

	// Enter is handled by the form's onSubmit below (empty = next chapter,
	// text = run that command), so there is no separate global key handler.
	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		const v = value.trim();
		if (v === "") {
			// empty Enter = advance the guided journey one chapter
			cancelGhost();
			advance();
		} else {
			cancelGhost();
			run(v);
		}
		setValue("");
	};

	const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const hist = historyRef.current;
		if (e.key === "ArrowUp") {
			e.preventDefault();
			if (!hist.length) return;
			historyIdxRef.current =
				historyIdxRef.current === -1
					? hist.length - 1
					: Math.max(0, historyIdxRef.current - 1);
			setValue(hist[historyIdxRef.current]);
		} else if (e.key === "ArrowDown") {
			e.preventDefault();
			if (historyIdxRef.current === -1) return;
			historyIdxRef.current += 1;
			if (historyIdxRef.current >= hist.length) {
				historyIdxRef.current = -1;
				setValue("");
			} else {
				setValue(hist[historyIdxRef.current]);
			}
		} else if (e.key === "Tab") {
			e.preventDefault();
			const parts = value.split(/\s+/);
			if (parts.length <= 1) {
				const prefix = parts[0] ?? "";
				const matches = COMMAND_NAMES.filter((c) => c.startsWith(prefix));
				if (matches.length === 1) {
					setValue(matches[0] + " ");
				} else if (matches.length > 1 && prefix) {
					cancelGhost();
					print([cmdLine(value), out("  " + matches.join("   "))]);
				}
			} else if (parts[0] === "cat") {
				const files = ["about.txt", "skills.txt", "contact.txt"];
				const prefix = parts[1] ?? "";
				const matches = files.filter((f) => f.startsWith(prefix));
				if (matches.length === 1) setValue(`cat ${matches[0]}`);
				else if (matches.length > 1 && prefix) {
					cancelGhost();
					print([cmdLine(value), out("  " + matches.join("   "))]);
				}
			}
		} else if (e.key === "l" && e.ctrlKey) {
			e.preventDefault();
			setLines([]);
		} else if (e.key === "Escape") {
			setValue("");
		}
	};

	return (
		<section
			ref={sectionRef}
			id="experience"
			className="story-slide bg-[#F7F1E8]"
		>
			<style>{`.term-line{animation:termin .3s ease-out}@keyframes termin{from{opacity:0}to{opacity:1}}.term-scroll{scrollbar-width:thin;scrollbar-color:rgba(22,43,38,0.18) transparent}.term-scroll::-webkit-scrollbar{width:6px}.term-scroll::-webkit-scrollbar-thumb{background:rgba(22,43,38,0.16);border-radius:999px}.term-scroll::-webkit-scrollbar-thumb:hover{background:rgba(22,43,38,0.28)}.term-scroll::-webkit-scrollbar-track{background:transparent}`}</style>
			<div className="story-slide__body px-4 py-8 sm:px-8 lg:px-12">
				<div className="mx-auto flex h-full w-full max-w-[1080px] min-h-0 flex-col justify-center gap-5 md:flex-row">
					{/* left nav rail — what's happening now, one glance */}
					<aside
						className="hidden shrink-0 md:flex md:w-[200px] md:flex-col md:gap-4 md:pt-1"
						aria-label="journey progress"
					>
						<div className="rounded-xl px-1 py-2">
							<div
								className="mb-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.2em]"
								style={{ color: theme.barText }}
							>
								{T.navTitle}
							</div>
							<p
								className="mb-4 text-[0.72rem] leading-snug"
								style={{ color: theme.text }}
							>
								{T.navSubtitle}
							</p>

							<ol className="flex flex-col gap-0.5">
								{T.journey.map((s, i) => {
									const state =
										stepIdx === i
											? "active"
											: stepIdx > i
												? "done"
												: "todo";
									return (
										<li key={s.cmd}>
											<button
												type="button"
											onClick={() => {
												cancelGhost();
												// jump directly to this chapter
												stepIdxRef.current = i - 1;
												setStepIdx(i - 1);
												advance();
											}}
												className={`group flex w-full items-baseline gap-2 rounded-md px-2 py-1 text-left transition-colors ${
													state === "active"
														? "bg-[#0F4C45]/10"
														: "hover:bg-[#0F4C45]/5"
												}`}
												style={{
													color:
														state === "todo"
															? theme.barText
															: theme.text,
												}}
											>
												<span
													className="font-mono text-[0.62rem]"
													style={{
														color:
															state === "active"
																? theme.hl
																: state === "done"
																	? theme.acc
																	: "rgba(22,43,38,0.3)",
													}}
												>
													{String(i + 1).padStart(2, "0")}
												</span>
												<span
													className={`text-[0.78rem] leading-tight ${
														state === "active" ? "font-semibold" : ""
													} ${state === "todo" ? "opacity-70" : ""}`}
												>
													{s.label.replace(/^\d+\s*·\s*/, "")}
												</span>
												{state === "done" ? (
													<span
														className="ml-auto font-mono text-[0.62rem]"
														style={{ color: theme.acc }}
													>
														✓
													</span>
												) : null}
												{state === "active" ? (
													<span
														className="ml-auto h-1.5 w-1.5 animate-pulse rounded-full"
														style={{ background: theme.hl }}
													/>
												) : null}
											</button>
										</li>
									);
								})}
							</ol>

							{/* current status line */}
							<div
								className="mt-4 rounded-lg px-2 py-2 text-[0.7rem] leading-snug"
								style={{
									background: "rgba(15,76,69,0.06)",
									color: theme.text,
								}}
							>
								<span
									className="mb-1 block font-mono text-[0.6rem] uppercase tracking-[0.15em]"
									style={{ color: theme.acc }}
								>
									{T.navTitle}
								</span>
								{stepIdx >= 0 && stepIdx < T.journey.length
									? T.journey[stepIdx].takeaway
									: T.navNotStarted}
							</div>
						</div>
					</aside>

					{/* terminal + suggestions stacked in one column */}
					<div className="flex min-h-0 flex-1 flex-col">
					{/* Apple-style frosted glass slab — layered depth + top highlight */}
					<div
						className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl shadow-[0_24px_70px_-20px_rgba(22,43,38,0.35),0_6px_18px_-8px_rgba(22,43,38,0.18)] ring-1 ring-white/40 backdrop-blur-2xl transition-colors duration-300"
						style={
							{
								background:
									"linear-gradient(145deg, rgba(255,255,255,0.72) 0%, rgba(255,253,249,0.48) 55%, rgba(246,240,230,0.55) 100%)",
								border: "1px solid rgba(255,255,255,0.65)",
								"--tt-acc": theme.acc,
								"--tt-hl": theme.hl,
								"--tt-text": theme.text,
							} as React.CSSProperties
						}
					>
						{/* top glass highlight — the subtle sheen Apple windows have */}
						<div
							className="pointer-events-none absolute inset-x-0 top-0 h-px"
							style={{
								background:
									"linear-gradient(90deg, transparent, rgba(255,255,255,0.9) 30%, rgba(255,255,255,0.9) 70%, transparent)",
							}}
						/>
						<div
							className="pointer-events-none absolute inset-0 rounded-2xl"
							style={{
								background:
									"linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 22%)",
							}}
						/>
						{/* title bar */}
						<div
							className="relative flex shrink-0 items-center gap-2 px-4 py-3"
							style={{ borderBottom: "1px solid rgba(22,43,38,0.08)" }}
						>
							<span className="h-3 w-3 rounded-full bg-[#FF5F57] shadow-[inset_0_-1px_1px_rgba(0,0,0,0.15)]" />
							<span className="h-3 w-3 rounded-full bg-[#FEBC2E] shadow-[inset_0_-1px_1px_rgba(0,0,0,0.15)]" />
							<span className="h-3 w-3 rounded-full bg-[#28C840] shadow-[inset_0_-1px_1px_rgba(0,0,0,0.15)]" />
							<span
								className="ml-3 font-mono text-[0.68rem] font-medium"
								style={{ color: theme.barText }}
							>
								jason@portfolio
							</span>
						{stepIdx >= 0 && stepIdx < T.journey.length ? (
							<span
								className="ml-auto font-mono text-[0.62rem]"
								style={{ color: theme.barText }}
							>
								{`${T.guidedTour} ${stepIdx + 1}/${T.journey.length}`}
							</span>
						) : null}
						</div>

					{/* scrollback */}
					<div
						ref={scrollRef}
						className="term-scroll min-h-0 flex-1 scroll-smooth overflow-y-auto px-5 py-5 font-mono text-[0.82rem] leading-[1.6] sm:px-7 sm:text-[0.88rem]"
						style={{ color: theme.text }}
					>
							{lines.map((line) => (
								<div
									key={line.id}
									className={`term-line whitespace-pre-wrap break-words ${line.cls ?? ""}`}
								>
									{line.segments.map((seg, i) =>
										seg.href ? (
											<a
												key={i}
												href={seg.href}
												target={seg.href.startsWith("mailto") ? undefined : "_blank"}
												rel="noreferrer"
												className={seg.cls}
												onClick={(e) => e.stopPropagation()}
											>
												{seg.t}
											</a>
										) : seg.run ? (
											<button
												key={i}
												type="button"
											className={seg.cls}
											onClick={(e) => {
												e.stopPropagation();
												cancelGhost();
												run(seg.run!);
											}}
										>
											{seg.t}
										</button>
										) : (
											<span key={i} className={seg.cls}>
												{seg.t}
											</span>
										),
									)}
								</div>
							))}

						{booted ? (
							<>
								{/* prompt + input on the left, submit button on the right */}
								<div
									className="mt-3 flex items-center gap-2 border-t px-1 pt-3"
									style={{ borderColor: "rgba(22,43,38,0.08)" }}
								>
									<form onSubmit={submit} className="flex min-w-0 flex-1 items-center gap-2">
										<span
											className="shrink-0 font-mono text-[0.82rem] sm:text-[0.88rem]"
											style={{ color: theme.acc }}
										>
											{PROMPT}
										</span>
										<input
											ref={inputRef}
											value={value}
											onChange={(e) => setValue(e.target.value)}
											onKeyDown={onKeyDown}
											spellCheck={false}
											autoComplete="off"
											autoCapitalize="off"
											placeholder={T.inputPlaceholder}
											aria-label="terminal input"
											className="min-w-0 flex-1 bg-transparent font-mono text-[0.82rem] outline-none placeholder:opacity-30 sm:text-[0.88rem]"
											style={{ color: theme.text, caretColor: theme.hl }}
										/>
									</form>
									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											if (value.trim()) {
												cancelGhost();
												run(value);
												setValue("");
											} else {
												cancelGhost();
												advance();
											}
											inputRef.current?.blur();
										}}
										title={T.pressEnterToContinue}
										aria-label={T.pressEnterToContinue}
										className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.78rem] font-semibold text-white shadow-sm transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
										style={{ background: theme.acc }}
									>
										<span>{value.trim() ? T.btnRun : T.btnNext}</span>
										<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
											<path d="M5 12h14" />
											<path d="m13 6 6 6-6 6" />
										</svg>
									</button>
								</div>
								<p
									className="mt-1.5 text-center font-mono text-[0.64rem]"
									style={{ color: theme.barText }}
								>
									{stepIdx >= 0 && stepIdx < T.journey.length
										? `${T.journey[stepIdx].label} · ${stepIdx + 1} / ${T.journey.length}`
										: T.orTypeACommand}
								</p>
							</>
						) : null}
					</div>

						{/* matrix overlay */}
						{matrixOn ? (
							<div
								className="absolute inset-0 z-10 cursor-pointer"
								onClick={() => setMatrixOn(false)}
							>
								<canvas ref={matrixCanvasRef} className="h-full w-full" />
							</div>
						) : null}
					</div>

					{/* three quiet suggestions — the only hint we give */}
					<div className="mt-5 flex items-center justify-center gap-2 font-mono text-[0.72rem]">
						{SUGGESTIONS.map((q, i) => (
							<span key={q} className="flex items-center gap-2">
								{i > 0 ? (
									<span className="text-[#0F4C45]/30">·</span>
								) : null}
							<button
								type="button"
								onClick={() => {
									cancelGhost();
									run(q);
								}}
								className="text-[#0F4C45]/70 transition hover:text-[#043439]"
							>
								{q}
							</button>
							</span>
						))}
					</div>
					</div>
				</div>
			</div>
		</section>
	);
}
