"use client";

import {
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

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

/** domain · bar (10 cells) · details */
const SKILLS: [string, number, string][] = [
	["embedded", 9, "C/C++ · STM32 · PCB bring-up · sensor integration"],
	["control ", 9, "PID tuning · motion control · line-follow & AGV"],
	["position", 8, "Beidou RTK · GNSS · LPWAN field deployment"],
	["vision  ", 8, "OpenCV · edge AI on Jetson · detection pipelines"],
	["software", 8, "Python · TypeScript · Next.js · mini programs"],
];

/** Concrete facts for `summary` / `stats` — the at-a-glance highlights. */
const STATS: [string, string][] = [
	["Experience", "4+ years, electronics / embedded"],
	["Shipped", "9 products, 2 companies"],
	["Focus", "hardware that lands on metal floors"],
	["Stack", "C/C++ · STM32 · PCB · RTK/GNSS · Jetson · Web"],
	["Rule", "if it doesn't work on the bench, it never leaves"],
];

/** Keyword → label map for emphasis highlighting in prose output. */
const HIGHLIGHTS = [
	"STM32", "PID", "RTK", "GNSS", "Jetson", "OpenCV", "AGV", "PCB",
	"Beidou", "C/C++", "Python", "TypeScript", "Next.js", "embedded",
];

const SOCIALS = [
	{ label: "github", href: "https://github.com/Fz-a" },
	{ label: "gitee ", href: "https://gitee.com/Fz_z" },
	{ label: "csdn  ", href: "https://blog.csdn.net/Fz_a" },
];

/** [name, description, what clicking it actually runs] */
const MANUAL: [string, string, string][] = [
	["next / skip", "advance the guided tour one chapter", "next"],
	["restart", "run the guided tour from the top", "restart"],
	["summary / stats", "everything at a glance — the highlights", "summary"],
	["skills", "capability bars, the honest kind", "skills"],
	["about / whoami", "who is Jason", "about"],
	["contact / social", "email + socials", "contact"],
	["neofetch", "system info, portfolio edition", "neofetch"],
	["git log", "commit history of a career", "git log"],
	["hack", "hollywood-style intrusion (fake, obviously)", "hack"],
	["art", "the ASCII gallery — buddha, neumann & friends", "art"],
	["matrix", "follow the white rabbit", "matrix"],
	["theme", "toggle green / amber phosphor", "theme"],
	["cat <file>", "about.txt · skills.txt · contact.txt", "cat about.txt"],
	["ping <host>", "check if the internet still works", "ping"],
	["fortune", "wisdom dispenser", "fortune"],
	["history", "your command history", "history"],
	["man <cmd>", "manual pages", "man tour"],
	["help", "list commands", "help"],
	["clear", "wipe the screen", "clear"],
];

const COMMAND_NAMES = [
	...new Set([
		"next", "skip", "start", "restart", "tour", "skills", "hack",
		"hollywood", "art", "buddha", "neumann", "dragon", "rocket", "help",
		"about", "whoami", "summary", "stats", "resume", "contact", "social",
		"email", "clear", "pwd", "date", "echo", "history", "man",
		"neofetch", "banner", "matrix", "theme", "top", "htop", "ping",
		"git", "uname", "uptime", "fortune", "python", "python3", "cat",
		"sudo", "rm", "exit", "quit", "vim", "vi", "nano", "emacs",
		"hello", "hi", "xyzzy", "42",
	]),
];

/** Three quiet suggestions under the window — the only chrome we keep. */
const SUGGESTIONS = ["help", "art", "matrix"];

/**
 * The guided journey — a linear story the shell tells, one chapter at a
 * time. The visitor never picks; they just press Enter (or click the
 * [ Enter ↵ ] prompt) to advance. `text` is typed by the shell first as
 * narration, then the command runs and its output reveals the chapter.
 */
type Step = { label: string; text: string; cmd: string; takeaway: string };
const JOURNEY: Step[] = [
	{
		label: "01 · who",
		text: "first, who is this person? let's ask the system.",
		cmd: "whoami",
		takeaway: "Jason Chen — electronics engineer, 4+ yrs, Guangzhou.",
	},
	{
		label: "02 · capability",
		text: "next: what can they actually do?",
		cmd: "skills",
		takeaway: "embedded · control · positioning · vision · software",
	},
	{
		label: "03 · the machine",
		text: "and the machine behind it —",
		cmd: "neofetch",
		takeaway: "9 shipped products · 2 companies · 4+ yrs uptime",
	},
	{
		label: "04 · career",
		text: "four years, one commit at a time.",
		cmd: "git log",
		takeaway: "AGV → RTK → shixun → VXS-100 → edu robots",
	},
	{
		label: "05 · contact",
		text: "if you like what you've seen —",
		cmd: "contact",
		takeaway: "email + GitHub · Gitee · CSDN",
	},
	{
		label: "06 · finale",
		text: "and because every good demo needs a little theater…",
		cmd: "hack",
		takeaway: "(that was fake — the real skill is above)",
	},
];

const BANNER = [
	"     _                        ",
	"    | | __ _ ___  ___  _ __   ",
	" _  | |/ _` / __|/ _ \\| '_ \\  ",
	"| |_| | (_| \\__ \\ (_) | | | | ",
	" \\___/ \\__,_|___/\\___/|_| |_| ",
];

/** Kernel-style boot cascade — pours down before the banner appears. */
const BOOT_LOG = [
	"[    0.000000] JasonOS 2.6.10 booting on portfolio-cpu0",
	"[    0.000421] CPU: curiosity @ 5.15GHz (8 cores, 1 brain)",
	"[    0.001024] Memory: 128TB idea-space available",
	"[    0.002048] solder0: USB iron detected, heating to 350°C",
	"[    0.003145] rtk-gnss0: 31 satellites locked, fix: RTK-FIXED",
	"[    0.004096] pid0: Kp=1.8 Ki=0.4 Kd=0.06 — loop stable",
	"[    0.005512] agv-can0: link up, 500 kbit/s, metal floor ready",
	"[    0.006331] jetson0: CUDA cores awake, edge-AI pipeline armed",
	"[    0.007222] coffee0: drip dependency resolved (critical)",
	"[    0.008192] mounting /dev/projects on /home/jason ... done",
	"[  OK  ] Started Portfolio Shell.",
	"[  OK  ] Reached target Shipped Projects (9).",
	"[  OK  ] Reached target Companies (2).",
	"[  OK  ] Started Easter Egg Daemon (4 eggs hidden).",
	"",
];

const NEOFETCH_LOGO = [
	"  ┌───────────────┐  ",
	"  │ · · · · · · · │  ",
	"  │   J A S O N   │  ",
	"  │     O S       │  ",
	"  │ · · · · · · · │  ",
	"  └───────────────┘  ",
];

const NEOFETCH_INFO: [string, string][] = [
	["OS", "JasonOS 2.6.10 portfolio x86_64"],
	["Host", "Guangzhou, China"],
	["Role", "Electronics Engineer"],
	["Kernel", "curiosity-5.15-rc2"],
	["Uptime", "4+ yrs building hardware"],
	["Packages", "9 shipped projects"],
	["Shell", "jsh 1.0 (this thing)"],
	["Editor", "whatever gets it done"],
];

const FORTUNES = [
	"“Talk is cheap. Show me the code.” — Linus Torvalds",
	"“Simplicity is prerequisite for reliability.” — Dijkstra",
	"“First, solve the problem. Then, write the code.” — John Johnson",
	"“Hardware: the part you can kick.” — anonymous",
	"“It works on my bench.” — every electronics engineer ever",
];

const GIT_LOG = [
	"* 9f3e2a1 (HEAD -> main) feat: heavy-industry AGV remote, metal-floor proven",
	"* 4c7b8d2 feat: Beidou RTK batch bring-up — farm machines stay on line",
	"* a1e5f90 fix: PID oscillation on shixun car at high Kp",
	"* 77d0c3e feat: VXS-100 industrial remote — panel to PCB",
	"* 52b9aa4 feat: education robot fleet for university IoT labs",
	"* 2e08f17 chore: coffee.iv drip — dependency of all of the above",
];

const HACK_LINES = [
	"[ 0.000021] jsh: intrusion module loaded",
	"[ 0.000112] scanning 65535 ports on portfolio.local ...",
	"[ 0.000987]    22/tcp   OPEN   ssh    OpenSSH 9.6p1",
	"[ 0.001243]    80/tcp   OPEN   http   jason-nginx 1.25",
	"[ 0.001890]    443/tcp  OPEN   https  let's-encrypt-everything",
	">> injecting payload ................. done",
	">> escalating privileges ............. done",
	">> hijacking rtk-gnss0 uplink ........ done",
	">> decrypting project_secrets.enc",
	"   0f a3 9c 44 e1 7b 22 90  c8 15 6d f0 3a 61 84 2e",
	"   7d b1 05 99 e4 2c 18 76  40 ad 53 f8 0b 96 d2 3f",
	"   91 c4 2e 67 aa 18 f5 03  bd 49 70 e6 2a dc 31 85",
	"   26 f8 0d b3 59 e1 47 ac  12 78 c0 95 da 43 6e b9",
	"   b4 60 3d 17 ee 82 09 5c  f1 2b a6 48 70 d9 03 94",
	"   58 c2 1a e7 30 96 4b dd  07 65 b8 21 f4 39 ac 50",
	">> brute-forcing passphrase: \"solder\" ... MATCH",
	"   [####------] 40%   1.1 GB/s",
	"   [########--] 80%   2.9 GB/s",
	"   [##########] 100%  3.2 GB/s",
	"   extracting  pid_tuning_notes.txt",
	"   extracting  rtk_field_logs.tar.gz",
	"   extracting  satellite_ephemeris.bin",
	"   extracting  agv_schematics_FINAL_v2.pdf",
	"   extracting  resume_FINAL_v9_FINAL.docx",
	"   extracting  coffee_recipes.secret",
	"",
	"  █████╗  ██████╗ ██████╗███████╗███████╗███████╗",
	" ██╔══██╗██╔════╝██╔════╝██╔════╝██╔════╝██╔════╝",
	" ███████║██║     ██║     █████╗  ███████╗███████╗",
	" ██╔══██║██║     ██║     ██╔══╝  ╚════██║╚════██║",
	" ██║  ██║╚██████╗╚██████╗███████╗███████║███████║",
	" ╚═╝  ╚═╝ ╚═════╝ ╚═════╝╚══════╝╚══════╝╚══════╝",
	"  ██████╗ ██████╗  █████╗ ███╗   ██╗████████╗███████╗██████╗",
	" ██╔════╝ ██╔══██╗██╔══██╗████╗  ██║╚══██╔══╝██╔════╝██╔══██╗",
	" ██║  ███╗██████╔╝███████║██╔██╗ ██║   ██║   █████╗  ██║  ██║",
	" ██║   ██║██╔══██╗██╔══██║██║╚██╗██║   ██║   ██╔══╝  ██║  ██║",
	" ╚██████╔╝██║  ██║██║  ██║██║ ╚████║   ██║   ███████╗██████╔╝",
	"  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═════╝",
	"",
	"  ... just kidding. this is a portfolio, not a mainframe.",
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

const GALLERY: [string, string][] = [
	["buddha", "zen, in monospace"],
	["neumann", "the machine you're using right now"],
	["dragon", "here be shipped products"],
	["rocket", "T-0, every time"],
];

type Theme = {
	bg: string;
	border: string;
	text: string;
	acc: string;
	hl: string;
	barText: string;
};

const THEMES: Record<"green" | "amber", Theme> = {
	green: {
		bg: "#0F2A24",
		border: "rgba(111,169,140,0.22)",
		text: "#C9DCD1",
		acc: "#6FA98C",
		hl: "#E8C468",
		barText: "rgba(111,169,140,0.75)",
	},
	amber: {
		bg: "#1A1206",
		border: "rgba(255,176,0,0.28)",
		text: "#FFDFA8",
		acc: "#FFB000",
		hl: "#FFD76A",
		barText: "rgba(255,176,0,0.75)",
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

export function TerminalSection() {
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
			newLines.forEach((line, i) => {
				timerRef.current.push(
					window.setTimeout(() => print([line]), startMs + stepMs * i),
				);
			});
		},
		[print],
	);

	const unlockEgg = useCallback(
		(id: string, label: string) => {
			if (eggsRef.current.has(id)) return;
			eggsRef.current.add(id);
			print([
				out(`  ✦ easter egg ${eggsRef.current.size}/${EGG_TOTAL} — ${label}`, HL),
				out(""),
			]);
		},
		[print],
	);

	const bootLines = useCallback(
		(): Line[] => [
			...BOOT_LOG.map((l) =>
				out(
					l,
					l.startsWith("[  OK  ]")
						? "text-[var(--tt-acc)]"
						: "opacity-60",
				),
			),
			...BANNER.map((l) => out(l, "text-[var(--tt-acc)]")),
			out(""),
			out("JasonOS 2.6.10 — portfolio shell"),
			out(""),
		],
		[],
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

	// Scrollback pinned to bottom.
	useEffect(() => {
		const el = scrollRef.current;
		if (el) el.scrollTop = el.scrollHeight;
	}, [lines, stepIdx]);

	const focusInput = useCallback(() => {
		inputRef.current?.focus({ preventScroll: true });
	}, []);

	/**
	 * Visitor takes over: kill the tour AND every pending timer, so a
	 * new action can never interleave with stale staggered output —
	 * this is what keeps rapid clicking bug-free.
	 */
	const cancelGhost = useCallback(() => {
		stopTimers();
	}, [stopTimers]);

	/** Ghost-types `text` into the prompt, char by char. */
	const ghostType = useCallback(
		(text: string, startMs: number, onDone?: () => void) => {
			for (let i = 1; i <= text.length; i++) {
				timerRef.current.push(
					window.setTimeout(() => setValue(text.slice(0, i)), startMs + i * 70),
				);
			}
			if (onDone) {
				timerRef.current.push(
					window.setTimeout(onDone, startMs + text.length * 70 + 400),
				);
			}
		},
		[],
	);

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
			ctx.fillStyle = "rgba(0, 10, 4, 0.12)";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = "#2dff6d";
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
			print([out("  KONAMI ACCEPTED — phosphor overload, power level: 9001", HL)]);
			unlockEgg("konami", "you know the code");
			setThemeName((t0) => (t0 === "green" ? "amber" : "green"));
			setTimeout(
				() => setThemeName((t0) => (t0 === "green" ? "amber" : "green")),
				2600,
			);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [print, unlockEgg]);

	/** Advance the guided journey by one chapter. */
	const advance = useCallback(() => {
		stopTimers();
		const i = stepIdxRef.current + 1;
		if (i >= JOURNEY.length) {
			// finished — restart the whole journey on next Enter
			stepIdxRef.current = -1;
			setStepIdx(-1);
			print([
				out("  ★ that's the guided tour — you've seen the whole story."),
				rich([
					{ t: "  press " },
					{ t: "Enter", cls: HL },
					{ t: " to run it again, or explore: " },
					{ t: "art", cls: `${HL} ${RUNNABLE}`, run: "art" },
					{ t: " / " },
					{ t: "matrix", cls: `${HL} ${RUNNABLE}`, run: "matrix" },
					{ t: " / " },
					{ t: "help", cls: `${HL} ${RUNNABLE}`, run: "help" },
				]),
				out(""),
			]);
			return;
		}
		const step = JOURNEY[i];
		stepIdxRef.current = i;
		setStepIdx(i);
		print([out(`  ${step.label} — ${step.text}`)]);
		// ghost-type the command so it's obvious what's happening, then run it.
		ghostType(step.cmd, 300, () => {
			runRef.current(step.cmd);
			setValue("");
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
		});
	}, [stopTimers, print, ghostType]);

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
						out("  advancing to the next chapter…"),
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
						out("  restarting the guided tour from the top."),
						out(""),
					]);
					break;
				}

				case "hack":
				case "hollywood":
					printStaggered(
						[
							echo,
							...HACK_LINES.map((l) =>
								out(l, l.startsWith(">>") ? HL : undefined),
							),
							rich([
								{ t: "   everything here is public — run " },
								{ t: "skills", cls: `${HL} ${RUNNABLE}`, run: "skills" },
								{ t: " — or enjoy the " },
								{ t: "art", cls: `${HL} ${RUNNABLE}`, run: "art" },
								{ t: " gallery." },
							]),
							out(""),
						],
						26,
					);
					break;

				case "art":
					print([
						echo,
						out("  the gallery — click to unveil:"),
						...GALLERY.map(([a, d]) =>
							rich([
								{ t: `  ${a.padEnd(10)}`, cls: `${HL} ${RUNNABLE}`, run: a },
								{ t: d },
							]),
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
							out("  here be shipped products."),
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
							out("  T-0 confirmed. every project above left the pad."),
							out(""),
						],
						30,
					);
					break;

				case "help":
					print([
						echo,
						out("available commands — click any of them:"),
						...MANUAL.map(([c, d, r]) =>
							rich([
								{ t: `  ${c.padEnd(16)}`, cls: `${HL} ${RUNNABLE}`, run: r },
								{ t: d },
							]),
						),
						rich([
							{ t: "  + ", cls: HL },
							{ t: `${EGG_TOTAL} hidden eggs`, cls: HL },
							{ t: " — real hackers don't read manuals." },
						]),
						out(""),
					]);
					break;

				case "man": {
					const entry = MANUAL.find(([c]) =>
						c.split(" /").some((n) => n.trim().startsWith(arg)),
					);
					print([
						echo,
						entry
							? rich([
									{ t: `  ${entry[0]}`, cls: `${HL} ${RUNNABLE}`, run: entry[2] },
									{ t: ` — ${entry[1]}` },
								])
							: out(`  no manual entry for ${arg || "(nothing)"}`),
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
						out(
							arg
								? `  cat: ${arg}: no such file (try: about.txt, skills.txt, contact.txt)`
								: "  usage: cat <file>",
						),
						out(""),
					]);
					break;
				}

				case "skills": {
					const rows: Line[] = [
						echo,
						out("  capability self-assessment — calibrated on metal floors:"),
						out(""),
					];
					for (const [k, lvl, v] of SKILLS) {
						rows.push(
							rich([
								{ t: `  ${k}  `, cls: HL },
								{
									t: `[${"#".repeat(lvl)}${"-".repeat(10 - lvl)}] `,
									cls: "text-[var(--tt-acc)]",
								},
								...emphasize(v),
							]),
						);
					}
					rows.push(out(""));
					rows.push(
						rich([
							{ t: "  every bar above has " },
							{ t: "shipped hardware", cls: EMPH },
							{ t: " behind it." },
						]),
					);
					rows.push(out(""));
					printStaggered(rows, 90);
					break;
				}

				case "about":
				case "whoami":
					print([
						echo,
						rich([{ t: "  Jason Chen", cls: EMPH }, { t: " — electronics engineer, Guangzhou." }]),
						out(""),
						rich([{ t: "  I build " }, ...emphasize("landed hardware: education robots, Beidou RTK for farm machines, industrial AGVs — from PCB to metal floor.")]),
						out(""),
						rich([{ t: "  " }, { t: "2 companies", cls: EMPH }, { t: " · " }, { t: "9 shipped products", cls: EMPH }, { t: ", one rule:" }]),
						rich([{ t: "  if it doesn't work on the " }, { t: "bench", cls: EMPH }, { t: ", it never leaves." }]),
						out(""),
						rich([{ t: "  daily stack → " }, ...emphasize("C/C++ · STM32 · PCB · RTK/GNSS · Jetson · Python · TypeScript")]),
						out(""),
					]);
					break;

				case "summary":
				case "stats":
				case "resume":
					print([
						echo,
						out("  — at a glance —"),
						out(""),
						...STATS.map(([k, v]) =>
							rich([
								{ t: `  ${k.padEnd(12)} `, cls: HL },
								{ t: "» " },
								...emphasize(v),
							]),
						),
						out(""),
						rich([
							{ t: "  run " },
							{ t: "skills", cls: `${HL} ${RUNNABLE}`, run: "skills" },
							{ t: " for the deep dive, or " },
							{ t: "contact", cls: `${HL} ${RUNNABLE}`, run: "contact" },
							{ t: " to reach me." },
						]),
						out(""),
					]);
					break;

				case "contact":
				case "social":
					print([
						echo,
						rich([
							{ t: "  email  ", cls: HL },
							{
								t: "1106467336@qq.com",
								href: "mailto:1106467336@qq.com",
								cls: "underline underline-offset-4 opacity-90 hover:opacity-100",
							},
						]),
						...SOCIALS.map((s) =>
							rich([
								{ t: `  ${s.label}  `, cls: HL },
								{
									t: s.href.replace("https://", ""),
									href: s.href,
									cls: "underline underline-offset-4 opacity-90 hover:opacity-100",
								},
							]),
						),
						out(""),
					]);
					break;

				case "email":
					print([echo, out("  1106467336@qq.com"), out("")]);
					break;

				case "neofetch": {
					const rows: Line[] = [echo];
					const n = Math.max(NEOFETCH_LOGO.length, NEOFETCH_INFO.length);
					for (let i = 0; i < n; i++) {
						const logo = NEOFETCH_LOGO[i] ?? " ".repeat(20);
						const info = NEOFETCH_INFO[i];
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
					print([echo, out("  wake up, Neo… (any key to exit)"), out("")]);
					setMatrixOn(true);
					break;

				case "theme":
					setThemeName((t0) => (t0 === "green" ? "amber" : "green"));
					print([
						echo,
						out(
							`  phosphor set to ${themeName === "green" ? "amber" : "green"} — run again to flip back`,
						),
						out(""),
					]);
					break;

				case "git":
					if (args[0] === "log") {
						print([
							echo,
							...GIT_LOG.map((l) =>
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
							out("  on branch main"),
							out("  nothing to commit, working tree clean"),
							out("  (shipping is the default state)"),
							out(""),
						]);
					} else {
						print([echo, out("  usage: git log | git status"), out("")]);
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
							out(`  PING ${host} 56(84) bytes of data.`),
							...fake,
							out(`  --- ${host} ping statistics ---`),
							out("  4 transmitted, 4 received, 0% packet loss"),
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
						out("    PID  COMMAND        %CPU  %MEM"),
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
					print([echo, out("  JasonOS 2.6.10-portfolio #1 SMP x86_64 GNU/Web"), out("")]);
					break;

				case "uptime":
					print([
						echo,
						out("  up 4+ years, 9 shipped projects, 2 companies,"),
						out("  load average: solder, firmware, repeat"),
						out(""),
					]);
					break;

				case "fortune":
					print([
						echo,
						out(`  ${FORTUNES[Math.floor(Math.random() * FORTUNES.length)]}`),
						out(""),
					]);
					break;

				case "python":
				case "python3":
					print([
						echo,
						rich([
							{ t: "  real python runs in-browser at " },
							{
								t: "/py",
								href: "/py/",
								cls: "underline underline-offset-4",
							},
							{ t: " (password-gated, numpy included)" },
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
						print([echo, out("  okay."), out("")]);
						unlockEgg("sandwich", "xkcd 149, honored");
					} else {
						print([
							echo,
							out("  jason is not in the sudoers file. This incident will be reported."),
							out(""),
						]);
					}
					break;

				case "rm":
					print([echo, out("  nice try."), out("")]);
					break;

				case "exit":
				case "quit":
					print([
						echo,
						rich([
							{ t: "  there is no escape. try " },
							{ t: "skills", cls: `${HL} ${RUNNABLE}`, run: "skills" },
							{ t: " instead." },
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
						out(`  ${cmd}: editor not included. this portfolio is read-only anyway.`),
						out(""),
					]);
					break;

				case "hello":
				case "hi":
					print([
						echo,
						rich([
							{ t: "  hello. click " },
							{ t: "skills", cls: `${HL} ${RUNNABLE}`, run: "skills" },
							{ t: " — that's why you're here." },
						]),
						out(""),
					]);
					break;

				case "xyzzy":
					print([echo, out("  a hollow voice says: keep shipping."), out("")]);
					unlockEgg("xyzzy", "plugh");
					break;

				case "42":
					print([echo, out("  correct. the answer to everything."), out("")]);
					unlockEgg("42", "deep thought");
					break;

				default: {
					const suggestion = COMMAND_NAMES.filter(
						(c) => levenshtein(cmd, c) <= 2,
					).sort((a, b) => levenshtein(cmd, a) - levenshtein(cmd, b))[0];
					print([
						echo,
						out(`  command not found: ${cmd}`),
						...(suggestion
							? [
									rich([
										{ t: "  did you mean " },
										{
											t: suggestion,
											cls: `${HL} ${RUNNABLE}`,
											run: suggestion,
										},
										{ t: "?" },
									]),
								]
							: [out("  (try: help)")]),
						out(""),
					]);
				}
			}

		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[print, printStaggered, themeName, unlockEgg, advance],
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
						{ t: "  welcome. this terminal will walk you through me, " },
					]),
					rich([
						{ t: "  " },
						{ t: ">>", cls: HL },
						{ t: "  one command at a time. just press " },
						{ t: "Enter", cls: HL },
						{ t: " to begin." },
					]),
					out(""),
				]);
				focusInput();
			}, bootMs + 300),
		);
		return stopTimers;
	}, [booted, bootLines, stopTimers, print, focusInput]);

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		const v = value.trim();
		if (v === "") {
			// empty Enter = advance the guided journey one chapter
			cancelGhost();
			advance();
			setValue("");
		} else {
			cancelGhost();
			run(v);
			setValue("");
		}
	};

	const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		cancelGhost();
		const hist = historyRef.current;
		if (e.key === "ArrowUp") {
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
					print([cmdLine(value), out("  " + matches.join("   "))]);
				}
			} else if (parts[0] === "cat") {
				const files = ["about.txt", "skills.txt", "contact.txt"];
				const prefix = parts[1] ?? "";
				const matches = files.filter((f) => f.startsWith(prefix));
				if (matches.length === 1) setValue(`cat ${matches[0]}`);
				else if (matches.length > 1 && prefix) {
					print([cmdLine(value), out("  " + matches.join("   "))]);
				}
			}
		} else if (e.key === "l" && e.ctrlKey) {
			e.preventDefault();
			setLines([]);
		}
	};

	return (
		<section
			ref={sectionRef}
			id="experience"
			className="story-slide bg-[#0B1F1B]"
		>
			<style>{`.term-line{animation:termin .22s cubic-bezier(.22,1,.36,1)}@keyframes termin{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}`}</style>
			<div className="story-slide__body px-4 py-8 sm:px-8 lg:px-12">
				<div className="mx-auto flex h-full w-full max-w-[820px] min-h-0 flex-col justify-center">
					{/* one clean window — nothing else competes for attention */}
					<div
						className="relative flex min-h-0 flex-1 flex-col border shadow-[0_40px_100px_rgba(0,0,0,0.5)] transition-colors duration-300"
						style={
							{
								backgroundColor: theme.bg,
								borderColor: theme.border,
								"--tt-acc": theme.acc,
								"--tt-hl": theme.hl,
								"--tt-text": theme.text,
							} as React.CSSProperties
						}
					>
						{/* title bar */}
						<div
							className="flex shrink-0 items-center gap-2 border-b px-4 py-3"
							style={{ borderColor: theme.border }}
						>
							<span className="h-2.5 w-2.5 bg-[#C0554A]" />
							<span className="h-2.5 w-2.5 bg-[#E8C468]" />
							<span className="h-2.5 w-2.5 bg-[#6FA98C]" />
							<span
								className="ml-3 font-mono text-[0.68rem]"
								style={{ color: theme.barText }}
							>
								jason@portfolio
							</span>
							{stepIdx >= 0 && stepIdx < JOURNEY.length ? (
								<span
									className="ml-auto font-mono text-[0.62rem]"
									style={{ color: theme.barText }}
								>
									{`guided tour ${stepIdx + 1}/${JOURNEY.length}`}
								</span>
							) : null}
						</div>

						{/* scrollback */}
						<div
							ref={scrollRef}
							onClick={() => {
								cancelGhost();
								focusInput();
							}}
							className="min-h-0 flex-1 cursor-text scroll-smooth overflow-y-auto px-5 py-5 font-mono text-[0.82rem] leading-[1.6] sm:px-7 sm:text-[0.88rem]"
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
													focusInput();
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
									{/* guided prompt — the one clear call to action */}
									<div
										className={`mt-1 mb-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 transition-opacity duration-300 ${
											value ? "opacity-30" : "opacity-100"
										}`}
									>
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation();
												cancelGhost();
												advance();
												setValue("");
												focusInput();
											}}
											className="animate-pulse border px-2 py-0.5 font-mono text-[0.68rem] transition-colors duration-200"
											style={{
												borderColor: theme.hl,
												color: theme.hl,
											}}
										>
											⏎ press Enter to continue
										</button>
										<span
											className="font-mono text-[0.66rem]"
											style={{ color: theme.barText }}
										>
											{stepIdx >= 0 && stepIdx < JOURNEY.length
												? `${JOURNEY[stepIdx].label} / ${JOURNEY.length}`
												: "or type a command · help"}
										</span>
									</div>

									<form onSubmit={submit} className="flex items-center">
										<span
											className="mr-2 shrink-0"
											style={{ color: theme.acc }}
										>
											{PROMPT}
										</span>
										<input
											ref={inputRef}
											value={value}
											onChange={(e) => {
												cancelGhost();
												setValue(e.target.value);
											}}
											onKeyDown={onKeyDown}
											spellCheck={false}
											autoComplete="off"
											autoCapitalize="off"
											placeholder="press Enter to continue, or type help"
											aria-label="terminal input"
											className="w-full min-w-0 flex-1 bg-transparent outline-none placeholder:opacity-30"
											style={{
												color: theme.text,
												caretColor: theme.hl,
											}}
										/>
									</form>
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
									<span className="text-[#6FA98C]/30">·</span>
								) : null}
								<button
									type="button"
									onClick={() => {
										cancelGhost();
										run(q);
										focusInput();
									}}
									className="text-[#6FA98C]/70 transition hover:text-[#E8C468]"
								>
									{q}
								</button>
							</span>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
