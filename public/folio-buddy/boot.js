/* Folio buddy v46 — idle eyes restored, ferrofluid spikes. */
(function () {
	const BOOT_VER = 46;
	if (window.__folioBuddyBootVer === BOOT_VER) return;
	try {
		window.__folioBuddyDestroyLive?.();
	} catch (_) {
		/* ignore */
	}
	window.__folioBuddyBootVer = BOOT_VER;
	document.getElementById("folio-buddy-root")?.remove();
	document.querySelectorAll("link[data-folio-buddy-css]").forEach((el) => el.remove());

	const SCRIPTS = [
		"/folio-buddy/geometry-data.js",
		"/folio-buddy/src/math.js",
		"/folio-buddy/src/tables.js",
		"/folio-buddy/src/pose.js",
		"/folio-buddy/src/tricks.js",
		"/folio-buddy/src/fx.js",
		"/folio-buddy/src/eyes.js",
		"/folio-buddy/src/character.js",
	];

	const IDLE_MS = 6800;
	const EQ_RETURN_MS = 3000;
	const EQ_BANDS = 16;
	/* 中间一滩磁液：几乎不整体胀缩，只轻轻呼吸 */
	const EQ_POOL_R = 18.6;
	/* 少量尖刺，一起动，长短略有差别 —— 更协调 */
	const EQ_SPIKES = [
		{ a: -0.2, rest: 1.6, reach: 9.2, thick: 2.7, w: 1.08 },
		{ a: 0.55, rest: 1.3, reach: 7.4, thick: 2.4, w: 0.92 },
		{ a: 1.25, rest: 1.8, reach: 10.5, thick: 2.9, w: 1.15 },
		{ a: 2.05, rest: 1.4, reach: 8.1, thick: 2.5, w: 0.95 },
		{ a: 2.85, rest: 1.7, reach: 9.8, thick: 2.8, w: 1.1 },
		{ a: 3.7, rest: 1.35, reach: 7.6, thick: 2.45, w: 0.9 },
		{ a: 4.5, rest: 1.75, reach: 10.1, thick: 2.85, w: 1.12 },
		{ a: 5.3, rest: 1.45, reach: 8.4, thick: 2.55, w: 0.98 },
	];
	const EQ_SPLIT_AT = 14.2;
	const eqCircles = (cls, n) =>
		Array.from({ length: n }, () => `<circle class="${cls}" fill="#141210" cx="50" cy="50" r="0"/>`).join("");
	const eqEllipses = (cls, n) =>
		Array.from({ length: n }, () => `<ellipse class="${cls}" fill="#141210" cx="50" cy="50" rx="0" ry="0"/>`).join("");
	const EQ_MARKUP = `<svg class="folio-buddy-eq-svg" viewBox="0 0 100 100" aria-hidden="true"><defs><filter id="folio-buddy-goo" x="-55%" y="-55%" width="210%" height="210%" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="1.55" result="blur"/><feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo"/></filter></defs><g class="folio-buddy-eq-field" filter="url(#folio-buddy-goo)"><circle class="eq-pool" fill="#141210" cx="50" cy="50" r="0"/>${eqEllipses("eq-spike", EQ_SPIKES.length)}${eqCircles("eq-split", 4)}</g></svg><div class="folio-buddy-eq-face" aria-hidden="true"><span class="folio-buddy-eq-eye is-l"><i></i></span><span class="folio-buddy-eq-eye is-r"><i></i></span></div>`;
	const SHAPES = ["blob", "teardrop", "pebble", "squircle", "hex", "tablet"];
	const MOODS = ["idle", "listening", "happy", "proud", "shy", "happy", "idle", "listening"];

	/** @type {any} */
	let live = null;
	/** @type {string} */
	let kbCache = "";
	/** @type {{ label: string, prompt: string }[]} */
	let quickPrompts = [];
	/** @type {{ role: string, content: string }[]} */
	let history = [];

	function ensureCss() {
		if (document.querySelector("link[data-folio-buddy-css]")) return;
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = `/folio-buddy/folio-buddy.css?v=${BOOT_VER}`;
		link.dataset.folioBuddyCss = "1";
		document.head.appendChild(link);
	}

	function ensureScripts() {
		const needFresh = window.__folioBuddyEngineVer !== BOOT_VER;
		if (needFresh) {
			window.GrokCharacter = undefined;
			window.GROK_TRICKS = undefined;
			window.GROK_MATH = undefined;
			window.GROK_TABLES = undefined;
			window.GROK_POSE = undefined;
			window.GROK_EYES = undefined;
			window.GROK_FX = undefined;
			document.querySelectorAll("script[data-folio-buddy]").forEach((el) => el.remove());
		}
		if (window.GrokCharacter) return Promise.resolve();
		return new Promise((resolve, reject) => {
			let left = SCRIPTS.length;
			let failed = false;
			for (const src of SCRIPTS) {
				const el = document.createElement("script");
				el.src = `${src}?v=${BOOT_VER}`;
				el.async = false;
				el.dataset.folioBuddy = src;
				el.onload = () => {
					left -= 1;
					if (left === 0 && !failed) {
						window.__folioBuddyEngineVer = BOOT_VER;
						resolve();
					}
				};
				el.onerror = () => {
					failed = true;
					reject(new Error(`Failed to load ${src}`));
				};
				document.head.appendChild(el);
			}
		});
	}

	async function loadKb() {
		if (kbCache) return kbCache;
		try {
			const man = await fetch(`/folio-buddy/kb/manifest.json?v=${BOOT_VER}`).then((r) => r.json());
			quickPrompts = Array.isArray(man.quick) ? man.quick : [];
			const files = Array.isArray(man.files) ? man.files : [];
			const texts = await Promise.all(
				files.map(async (f) => {
					const t = await fetch(`/folio-buddy/kb/${f}?v=${BOOT_VER}`).then((r) => (r.ok ? r.text() : ""));
					return `## ${f}\n${t}`;
				}),
			);
			kbCache = texts.join("\n\n");
		} catch (_) {
			kbCache = "";
			quickPrompts = [
				{ label: "你是谁？", prompt: "简单介绍一下站主是谁。" },
				{ label: "经历", prompt: "概括站主的个人经历。" },
			];
		}
		return kbCache;
	}

	function localAnswer(message, kb) {
		const q = String(message || "").toLowerCase();
		const chunks = kb
			.split(/^##\s+/m)
			.map((s) => s.trim())
			.filter(Boolean);
		let best = chunks[0] || "我还在学习站主的故事。请先在知识库里补充内容。";
		let score = -1;
		for (const c of chunks) {
			const body = c.toLowerCase();
			let s = 0;
			for (const w of q.split(/[^\p{L}\p{N}]+/u).filter((x) => x.length > 1)) {
				if (body.includes(w)) s += 2;
			}
			if (s > score) {
				score = s;
				best = c;
			}
		}
		const excerpt = best.replace(/^[\w.-]+\n/, "").trim().slice(0, 480);
		if (score <= 0) {
			return "我先翻了本地笔记，还没对上。可以问「你是谁」「经历」「本站」，或稍后再补知识库。";
		}
		return `根据站主留下的笔记：\n\n${excerpt}`;
	}

	async function askAi(message) {
		const kb = await loadKb();
		try {
			const res = await fetch("/api/folio-buddy-chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ message, history }),
			});
			if (res.ok) {
				const data = await res.json();
				if (data?.reply) return String(data.reply);
			}
		} catch (_) {
			/* local fallback */
		}
		return localAnswer(message, kb);
	}

	function clamp(n, a, b) {
		return Math.max(a, Math.min(b, n));
	}

	function defaultFloatPos(size) {
		return {
			x: 16,
			y: window.innerHeight - size - 20,
		};
	}

	function isHomeView() {
		return !!document.querySelector("[data-folio-buddy-dock]");
	}

	function destroyLive() {
		if (!live) return;
		try {
			live.teardown();
		} catch (_) {
			/* ignore */
		}
		live = null;
	}
	window.__folioBuddyDestroyLive = destroyLive;

	function createShell() {
		let root = document.getElementById("folio-buddy-root");
		if (root) return root;

		root = document.createElement("div");
		root.id = "folio-buddy-root";
		root.className = "is-placing";
		root.innerHTML = `
			<button type="button" class="folio-buddy-avatar" aria-label="墨趣伙伴">
				<div class="folio-buddy-genesis" aria-hidden="true">
					<span class="folio-buddy-seed" data-n="1"></span>
					<span class="folio-buddy-seed" data-n="2"></span>
					<span class="folio-buddy-seed" data-n="3"></span>
				</div>
				<div class="folio-buddy-stage" aria-hidden="true"></div>
				<div class="folio-buddy-eq" aria-hidden="true">${EQ_MARKUP}</div>
			</button>
			<div class="folio-buddy-chat" role="dialog" aria-label="墨趣问答" hidden>
				<div class="folio-buddy-chat-head">
					<span class="folio-buddy-chat-title">问一问</span>
					<button type="button" class="folio-buddy-chat-close" aria-label="关闭">×</button>
				</div>
				<div class="folio-buddy-quick"></div>
				<div class="folio-buddy-msgs"></div>
				<form class="folio-buddy-form">
					<input type="text" name="q" placeholder="说点什么…" autocomplete="off" maxlength="500" />
					<button type="submit">问</button>
				</form>
			</div>
		`;
		document.body.appendChild(root);
		return root;
	}

	function bindCompanion(root) {
		const stage = root.querySelector(".folio-buddy-stage");
		const avatar = root.querySelector(".folio-buddy-avatar");
		const chat = root.querySelector(".folio-buddy-chat");
		const msgs = root.querySelector(".folio-buddy-msgs");
		const quick = root.querySelector(".folio-buddy-quick");
		const form = root.querySelector(".folio-buddy-form");
		const input = form?.querySelector("input");
		const closeBtn = root.querySelector(".folio-buddy-chat-close");
		let eq = root.querySelector(".folio-buddy-eq");
		if (!eq && avatar) {
			eq = document.createElement("div");
			eq.className = "folio-buddy-eq";
			eq.setAttribute("aria-hidden", "true");
			eq.innerHTML = EQ_MARKUP;
			avatar.appendChild(eq);
		}
		const eqField = eq?.querySelector(".folio-buddy-eq-field") || eq;
		const eqPool = eqField?.querySelector(".eq-pool");
		const eqSpikes = eqField ? Array.from(eqField.querySelectorAll(".eq-spike")) : [];
		const eqSplits = eqField ? Array.from(eqField.querySelectorAll(".eq-split")) : [];
		let eqFace = eq?.querySelector(".folio-buddy-eq-face");
		if (!eqFace && eq) {
			eqFace = document.createElement("div");
			eqFace.className = "folio-buddy-eq-face";
			eqFace.setAttribute("aria-hidden", "true");
			eqFace.innerHTML =
				'<span class="folio-buddy-eq-eye is-l"><i></i></span><span class="folio-buddy-eq-eye is-r"><i></i></span>';
			eq.appendChild(eqFace);
		}
		const eqPupils = eqFace ? Array.from(eqFace.querySelectorAll("i")) : [];
		if (!stage || !avatar || !window.GrokCharacter) return;

		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute("role", "img");
		svg.setAttribute("aria-hidden", "true");
		svg.setAttribute("data-folio-buddy-svg", "1");
		stage.replaceChildren(svg);

		const bot = new window.GrokCharacter(svg, {
			mode: "hold",
			shape: "blob",
			color: "black",
			scheme: "light",
			loginWrap: true,
			eyeTopology: false,
			followPointer: false,
			state: "idle",
			emphasis: false,
			calm: true,
		});
		bot.calm = true;
		bot.setFollowPointer(false);
		bot.setGazeTarget(null);
		bot.setColor("black", "light");
		bot.setState("idle", { resetEyes: true, soft: true });

		const reduceMotion =
			typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
		const playGenesis = !reduceMotion;

		let actIdx = 1;
		let idleWatch = 0;
		/** @type {number[]} */
		let timers = [];
		let chatOpen = false;
		let busyAsk = false;
		let docked = false;
		let size = 92;
		let userFreed = false;
		let musicPlaying = false;
		let eqMode = false;
		let eqRaf = 0;
		let eqReturnWatch = 0;
		let eqEnergy = 0.15;
		let eqBass = 0.15;
		/** @type {{ x: number, y: number, r: number }} */
		let eqCoreState = { x: 50, y: 50, r: EQ_POOL_R };
		/** @type {{ cx: number, cy: number, rx: number, ry: number, rot: number }[]} */
		let eqSpikeState = EQ_SPIKES.map((sp) => ({
			cx: 50,
			cy: 50,
			rx: 0,
			ry: 0,
			rot: (sp.a * 180) / Math.PI - 90,
		}));
		/** @type {number[]} */
		let eqSpikeDrive = EQ_SPIKES.map(() => 0.08);
		/** @type {number[]} */
		let eqSpikeSnap = EQ_SPIKES.map(() => 0);
		/** @type {{ x: number, y: number, r: number, vx: number, vy: number, free: number, life: number }[]} */
		let eqSplitState = eqSplits.map(() => ({ x: 50, y: 50, r: 0, vx: 0, vy: 0, free: 0, life: 0 }));
		let eqSplitCursor = 0;
		let ptrX = 0;
		let ptrY = 0;
		let ptrHas = false;
		let lookX = 0;
		let lookY = 0;
		let blink = 1;
		let blinkUntil = 0;
		let shock = 0;
		let eqMorph = 0;
		let eqTarget = 0;

		const clearTimers = () => {
			for (const id of timers) window.clearTimeout(id);
			timers = [];
		};
		const clearIdle = () => {
			if (idleWatch) window.clearTimeout(idleWatch);
			idleWatch = 0;
		};
		const clearEqReturn = () => {
			if (eqReturnWatch) window.clearTimeout(eqReturnWatch);
			eqReturnWatch = 0;
		};
		const stopEqLoop = () => {
			if (eqRaf) cancelAnimationFrame(eqRaf);
			eqRaf = 0;
		};

		const readBands = () => {
			const bands = window.__fireflyMusic?.getBands?.(EQ_BANDS);
			if (Array.isArray(bands) && bands.length >= EQ_BANDS) return bands;
			const out = [];
			const t = performance.now() / 1000;
			const kick = Math.pow(0.5 + 0.5 * Math.sin(t * Math.PI * 2.15), 3.1);
			for (let i = 0; i < EQ_BANDS; i++) {
				const shimmer = 0.22 + 0.78 * Math.abs(Math.sin(t * (1.15 + i * 0.41) + i * 0.7));
				const melody = i >= 3 && i <= 11 ? 1.2 : 0.75;
				out.push(Math.min(1, (kick * (0.9 - i * 0.03) + shimmer * (0.16 + (i % 5) * 0.04)) * melody));
			}
			return out;
		};

		const pokeEq = () => {
			if (eqMorph < 0.7) return;
			shock = 1;
		};

		const tickEq = () => {
			if (!eqMode) return;
			eqMorph += (eqTarget - eqMorph) * 0.048;
			if (eqTarget < 0.5 && eqMorph < 0.04) {
				eqMode = false;
				eqMorph = 0;
				eqTarget = 0;
				shock = 0;
				root.classList.remove("is-eq");
				root.style.removeProperty("--fb-eq");
				stopEqLoop();
				bot.setShape("blob", { silent: true });
				bot.setState("idle", { resetEyes: false, soft: true });
				if (!musicPlaying && !root.classList.contains("is-forming")) armIdle();
				return;
			}
			root.style.setProperty("--fb-eq", eqMorph.toFixed(3));

			const bands = readBands();
			const now = performance.now();
			const t = now / 1000;
			let energy = 0;
			let bass = 0;
			let melody = 0;
			for (let i = 0; i < EQ_BANDS; i++) {
				const v = bands[i] ?? 0;
				energy += v;
				if (i < 3) bass += v;
				if (i >= 3 && i <= 11) melody += v;
			}
			energy /= EQ_BANDS;
			bass /= 3;
			melody /= 9;
			eqEnergy += (energy - eqEnergy) * 0.14;
			eqBass += (bass - eqBass) * 0.32;
			shock += (0 - shock) * 0.08;

			/* 磁流体：液面几乎不动，鼓点只轻微起伏 */
			const kick = Math.pow(Math.max(0, eqBass), 0.75) * eqMorph;
			const breath = 1 + Math.sin(t * 1.4) * 0.012 * eqMorph + kick * 0.028 + shock * 0.02;
			const poolR = EQ_POOL_R * breath * eqMorph;
			const squashX = 1 + kick * 0.02 + shock * 0.03;
			const squashY = 1 - kick * 0.018 - shock * 0.025;

			const box = avatar.getBoundingClientRect();
			let txLook = Math.sin(t * 0.55) * 0.18;
			let tyLook = Math.cos(t * 0.42) * 0.12;
			if (ptrHas && box.width > 0) {
				txLook = Math.max(-1, Math.min(1, (ptrX - (box.left + box.width / 2)) / (box.width * 0.62)));
				tyLook = Math.max(-1, Math.min(1, (ptrY - (box.top + box.height / 2)) / (box.height * 0.62)));
			}
			lookX += (txLook - lookX) * 0.14;
			lookY += (tyLook - lookY) * 0.14;

			if (now > blinkUntil) {
				blink = 0.08;
				blinkUntil = now + 1800 + Math.random() * 2400;
			} else if (blink < 0.98) {
				blink += (1 - blink) * 0.32;
			}

			/* 粘滞跟随：像磁液慢慢爬 */
			const follow = shock > 0.4 ? 0.16 : 0.09;
			eqCoreState.x += (50 + lookX * 0.25 * eqMorph - eqCoreState.x) * follow;
			eqCoreState.y += (50.2 + lookY * 0.18 * eqMorph - eqCoreState.y) * follow;
			eqCoreState.r += (poolR - eqCoreState.r) * 0.12;
			if (eqPool) {
				eqPool.setAttribute("cx", eqCoreState.x.toFixed(2));
				eqPool.setAttribute("cy", eqCoreState.y.toFixed(2));
				eqPool.setAttribute("r", Math.max(0.01, eqCoreState.r).toFixed(2));
			}

			for (let i = 0; i < eqSpikes.length; i++) {
				const sp = EQ_SPIKES[i];
				if (!sp) continue;
				/* 全体跟节奏：鼓点 + 能量为主，本频段只做一点长短差 */
				const local = bands[i] ?? bands[i % 8] ?? 0.2;
				const pop = Math.pow(Math.max(0.08, local), 0.6);
				const shared = kick * 0.55 + eqEnergy * 0.45 + melody * 0.25;
				const driveTarget = Math.min(1.25, (shared * 0.72 + pop * 0.38) * sp.w);
				eqSpikeDrive[i] += (driveTarget - eqSpikeDrive[i]) * 0.18;
				eqSpikeSnap[i] += (0 - eqSpikeSnap[i]) * 0.1;
				const drive = eqSpikeDrive[i];
				const ang = sp.a + Math.sin(t * 0.5 + i * 0.4) * 0.025;
				const stretch =
					(sp.rest + drive * sp.reach + kick * 2.6 + shock * 3.8 + eqSpikeSnap[i] * 2.4) * eqMorph;
				const thick = (sp.thick * (0.82 + drive * 0.28) + kick * 0.3) * eqMorph;
				const ry = Math.max(0.01, stretch * 0.5);
				const d = eqCoreState.r * 0.8 + ry * 0.74;
				const tcx = eqCoreState.x + Math.cos(ang) * d;
				const tcy = eqCoreState.y + Math.sin(ang) * d;
				const trot = (ang * 180) / Math.PI - 90;
				const st = eqSpikeState[i];
				st.cx += (tcx - st.cx) * follow;
				st.cy += (tcy - st.cy) * follow;
				st.rx += (thick - st.rx) * 0.16;
				st.ry += (ry - st.ry) * 0.18;
				st.rot += (trot - st.rot) * follow;
				const el = eqSpikes[i];
				if (el) {
					el.setAttribute("cx", st.cx.toFixed(2));
					el.setAttribute("cy", st.cy.toFixed(2));
					el.setAttribute("rx", Math.max(0.01, st.rx).toFixed(2));
					el.setAttribute("ry", Math.max(0.01, st.ry).toFixed(2));
					el.setAttribute("transform", `rotate(${st.rot.toFixed(2)} ${st.cx.toFixed(2)} ${st.cy.toFixed(2)})`);
				}

				if (stretch > EQ_SPLIT_AT && drive > 0.72 && Math.random() < 0.02) {
					const slot = eqSplitState[eqSplitCursor % eqSplitState.length];
					eqSplitCursor += 1;
					if (slot && slot.free < 0.15) {
						const tipX = eqCoreState.x + Math.cos(ang) * (eqCoreState.r + stretch);
						const tipY = eqCoreState.y + Math.sin(ang) * (eqCoreState.r + stretch);
						slot.free = 1;
						slot.life = 1;
						slot.x = tipX;
						slot.y = tipY;
						const speed = 0.22 + drive * 0.28;
						slot.vx = Math.cos(ang) * speed;
						slot.vy = Math.sin(ang) * speed;
						slot.r = 1.2 + drive * 0.35;
						eqSpikeSnap[i] = -0.16;
					}
				}
			}

			for (let i = 0; i < eqSplitState.length; i++) {
				const split = eqSplitState[i];
				const ang = Math.atan2(split.y - eqCoreState.y, split.x - eqCoreState.x);
				const homeX = eqCoreState.x + Math.cos(ang) * (eqCoreState.r + 1.8);
				const homeY = eqCoreState.y + Math.sin(ang) * (eqCoreState.r + 1.8);
				if (split.free > 0 || split.r > 0.08) {
					const pullX = homeX - split.x;
					const pullY = homeY - split.y;
					let dist = Math.hypot(pullX, pullY);
					if (dist > 5.5) {
						const scale = 5.5 / dist;
						split.x = homeX - pullX * scale;
						split.y = homeY - pullY * scale;
						dist = 5.5;
					}
					split.vx += pullX * 0.12;
					split.vy += pullY * 0.12;
					split.vx *= 0.76;
					split.vy *= 0.76;
					split.x += split.vx;
					split.y += split.vy;
					split.life *= 0.985;
					const speedNow = Math.hypot(split.vx, split.vy);
					if (dist < 3.8 && speedNow < 0.55) {
						split.free = 0;
						split.r *= 0.55;
						if (split.r < 0.35) {
							split.r = 0;
							split.vx = 0;
							split.vy = 0;
							split.life = 0;
						}
					} else {
						const wantR = 1.2 * eqMorph * Math.max(split.free, 0.2) * split.life;
						split.r += (wantR - split.r) * 0.18;
					}
				} else {
					split.r += (0 - split.r) * 0.22;
				}
				const blob = eqSplits[i];
				if (blob) {
					blob.setAttribute("cx", split.x.toFixed(2));
					blob.setAttribute("cy", split.y.toFixed(2));
					blob.setAttribute("r", Math.max(0, split.r).toFixed(2));
				}
			}

			if (eqFace) {
				const faceScale = 1.06 + kick * 0.04 + shock * 0.04;
				eqFace.style.opacity = String(eqMorph);
				eqFace.style.transform = `translate(-50%, -48%) scale(${(faceScale * squashX).toFixed(3)}, ${(faceScale * squashY).toFixed(3)})`;
				const leftEye = eqFace.querySelector(".is-l");
				const rightEye = eqFace.querySelector(".is-r");
				const lid = Math.max(0.14, blink);
				if (leftEye) leftEye.style.transform = `scale(1, ${lid.toFixed(3)})`;
				if (rightEye) rightEye.style.transform = `scale(1, ${(lid * 0.97).toFixed(3)})`;
				const px = lookX * 2.8;
				const py = lookY * 2.1 + (1 - lid) * 0.8;
				for (const p of eqPupils) {
					p.style.transform = `translate(${px.toFixed(2)}px, ${py.toFixed(2)}px)`;
				}
			}
			eqRaf = requestAnimationFrame(tickEq);
		};

		const enterEq = () => {
			if (!musicPlaying || chatOpen || root.classList.contains("is-forming")) return;
			if (reduceMotion) return;
			clearIdle();
			clearTimers();
			clearEqReturn();
			eqTarget = 1;
			eqMode = true;
			root.classList.add("is-eq");
			if (!eqRaf) tickEq();
		};

		const leaveEq = (armReturn = false) => {
			eqTarget = 0;
			shock = 0;
			clearEqReturn();
			if (armReturn && musicPlaying) {
				eqReturnWatch = window.setTimeout(() => {
					eqReturnWatch = 0;
					if (musicPlaying && !chatOpen) enterEq();
				}, EQ_RETURN_MS);
			}
			if (eqMode && !eqRaf) tickEq();
		};

		const syncMusicPlaying = (playing) => {
			musicPlaying = !!playing;
			if (musicPlaying) {
				if (!eqReturnWatch && !chatOpen) enterEq();
			} else {
				leaveEq(false);
			}
		};

		const armIdle = () => {
			clearIdle();
			if (musicPlaying) {
				if (!eqMode && !eqReturnWatch) enterEq();
				return;
			}
			idleWatch = window.setTimeout(() => cycleMood(), IDLE_MS);
		};

		const cycleMood = (opts = {}) => {
			const i = actIdx++;
			const shape = SHAPES[i % SHAPES.length];
			const mood = MOODS[i % MOODS.length];
			clearIdle();
			clearTimers();
			bot.setShape(shape, { silent: true });
			timers.push(
				window.setTimeout(() => {
					bot.setState(mood, { resetEyes: false, soft: true });
				}, 520),
			);
			if (!opts.skipArmIdle) {
				timers.push(window.setTimeout(() => armIdle(), 2600));
			}
		};

		const setPos = (x, y, animate, pin = false) => {
			size = root.getBoundingClientRect().width || size;
			if (!pin) {
				x = clamp(x, 8, window.innerWidth - size - 8);
				y = clamp(y, 8, window.innerHeight - size - 8);
			}
			if (!animate) root.classList.add("is-dragging");
			root.style.setProperty("--fb-x", `${Math.round(x)}px`);
			root.style.setProperty("--fb-y", `${Math.round(y)}px`);
			root.classList.toggle("is-chat-right", x > window.innerWidth * 0.45);
			if (!animate) {
				requestAnimationFrame(() => root.classList.remove("is-dragging"));
			}
			return { x, y };
		};

		const dockBox = () => {
			const dock = document.querySelector("[data-folio-buddy-dock]");
			if (!dock) return null;
			const r = dock.getBoundingClientRect();
			if (r.width < 40 || r.height < 40) return null;
			return r;
		};

		const placeFloat = () => {
			docked = false;
			root.classList.remove("is-docked", "is-home");
			root.style.width = "";
			root.style.height = "";
			size = root.getBoundingClientRect().width || 92;
			const pos = defaultFloatPos(size);
			setPos(pos.x, pos.y, false);
		};

		const placeDock = () => {
			const r = dockBox();
			if (!r) return false;
			userFreed = false;
			docked = true;
			root.classList.add("is-docked", "is-home");
			const shortSide = Math.min(r.width, r.height);
			const side = shortSide * 0.72;
			root.style.width = `${side}px`;
			root.style.height = `${side}px`;
			size = side;
			const x = r.left + window.scrollX + (r.width - side) / 2;
			const y = r.top + window.scrollY + (r.height - side) / 2;
			setPos(x, y, false, true);
			return true;
		};

		const syncPlace = (resetFree = false) => {
			if (resetFree) userFreed = false;
			const home = isHomeView();
			if (home) {
				if (!placeDock() && !root.classList.contains("is-placing")) placeFloat();
				setChat(false);
			} else if (resetFree || !userFreed) {
				placeFloat();
			} else {
				const rect = root.getBoundingClientRect();
				setPos(rect.left, rect.top, false);
			}
			avatar?.setAttribute("aria-label", home ? "墨趣伙伴，点击互动" : "墨趣伙伴，点击提问，可拖动");
		};

		const waitDock = (ms = 1200) =>
			new Promise((resolve) => {
				if (!isHomeView() || dockBox()) {
					resolve();
					return;
				}
				const start = performance.now();
				const tick = () => {
					if (dockBox() || performance.now() - start > ms) {
						resolve();
						return;
					}
					requestAnimationFrame(tick);
				};
				tick();
			});

		const startGenesis = () => {
			if (!playGenesis) {
				root.classList.remove("is-forming");
				root.classList.add("is-formed");
				if (musicPlaying) enterEq();
				else armIdle();
				return;
			}
			root.classList.remove("is-formed");
			root.classList.add("is-forming");
			root.querySelectorAll(".folio-buddy-seed").forEach((el) => {
				el.style.animation = "none";
				void el.offsetWidth;
				el.style.animation = "";
			});
			window.setTimeout(() => {
				root.classList.remove("is-forming");
				root.classList.add("is-formed");
				if (musicPlaying) enterEq();
				else armIdle();
			}, 3600);
		};

		const reveal = async () => {
			if (isHomeView()) await waitDock();
			syncPlace();
			void root.offsetWidth;
			startGenesis();
			root.classList.remove("is-placing");
			root.classList.add("is-placed");
		};

		const addBubble = (text, who) => {
			const el = document.createElement("div");
			el.className = `folio-buddy-bubble is-${who}`;
			el.textContent = text;
			msgs.appendChild(el);
			msgs.scrollTop = msgs.scrollHeight;
			return el;
		};

		const setChat = (open) => {
			if (open && isHomeView()) return;
			chatOpen = open;
			root.classList.toggle("is-chat-open", open);
			chat.hidden = !open;
			if (open) {
				leaveEq(false);
				bot.setState("listening", { resetEyes: false, soft: true });
				input?.focus();
			} else if (!isHomeView()) {
				bot.setState("happy", { resetEyes: false, soft: true });
				if (musicPlaying) leaveEq(true);
			}
		};

		const renderQuick = () => {
			quick.replaceChildren();
			for (const q of quickPrompts) {
				const b = document.createElement("button");
				b.type = "button";
				b.textContent = q.label;
				b.addEventListener("click", () => sendMessage(q.prompt));
				quick.appendChild(b);
			}
		};

		const sendMessage = async (text) => {
			if (isHomeView()) return;
			const message = String(text || "").trim();
			if (!message || busyAsk) return;
			busyAsk = true;
			if (form) form.querySelector("button").disabled = true;
			addBubble(message, "user");
			history.push({ role: "user", content: message });
			const typing = addBubble("墨趣正在想…", "bot");
			typing.classList.add("is-typing");
			bot.setState("listening", { resetEyes: false, soft: true });
			try {
				const reply = await askAi(message);
				typing.remove();
				addBubble(reply, "bot");
				history.push({ role: "assistant", content: reply });
				if (history.length > 16) history = history.slice(-16);
				bot.setState("happy", { resetEyes: false, soft: true });
			} catch (_) {
				typing.remove();
				addBubble("这会儿连不上，稍后再试。", "bot");
				bot.setState("shy", { resetEyes: false, soft: true });
			} finally {
				busyAsk = false;
				if (form) form.querySelector("button").disabled = false;
			}
		};

		// drag / click
		let ptrId = null;
		let startX = 0;
		let startY = 0;
		let origX = 0;
		let origY = 0;
		let dragged = false;

		const onPointerDown = (e) => {
			if (e.button != null && e.button !== 0) return;
			ptrId = e.pointerId;
			dragged = false;
			if (isHomeView()) return;
			avatar.setPointerCapture?.(ptrId);
			startX = e.clientX;
			startY = e.clientY;
			const rect = root.getBoundingClientRect();
			origX = rect.left;
			origY = rect.top;
			root.classList.add("is-dragging");
		};

		const onPointerMove = (e) => {
			if (ptrId == null || e.pointerId !== ptrId) return;
			if (isHomeView()) return;
			const dx = e.clientX - startX;
			const dy = e.clientY - startY;
			if (!dragged && dx * dx + dy * dy > 36) {
				dragged = true;
				userFreed = true;
				docked = false;
				root.classList.remove("is-docked");
				root.style.width = "";
				root.style.height = "";
				size = root.getBoundingClientRect().width || 92;
				if (chatOpen) setChat(false);
			}
			if (dragged) setPos(origX + dx, origY + dy, false);
		};

		const onPointerUp = (e) => {
			if (ptrId == null || e.pointerId !== ptrId) return;
			root.classList.remove("is-dragging");
			avatar.releasePointerCapture?.(ptrId);
			ptrId = null;
			if (isHomeView()) {
				if (!root.classList.contains("is-forming")) {
					if (musicPlaying) {
						if (!eqMode) enterEq();
						pokeEq();
					} else {
						cycleMood();
					}
				}
				return;
			}
			if (dragged) {
				const rect = root.getBoundingClientRect();
				setPos(rect.left, rect.top, false);
			} else {
				if (eqMode) leaveEq(true);
				setChat(!chatOpen);
			}
		};

		const onPtrLook = (e) => {
			ptrX = e.clientX;
			ptrY = e.clientY;
			ptrHas = true;
		};
		const onPtrLeave = () => {
			ptrHas = false;
		};
		window.addEventListener("pointermove", onPtrLook, { passive: true });
		document.documentElement.addEventListener("pointerleave", onPtrLeave);

		avatar.addEventListener("pointerdown", onPointerDown);
		avatar.addEventListener("pointermove", onPointerMove);
		avatar.addEventListener("pointerup", onPointerUp);
		avatar.addEventListener("pointercancel", onPointerUp);

		closeBtn?.addEventListener("click", () => setChat(false));
		form?.addEventListener("submit", (e) => {
			e.preventDefault();
			const v = input?.value || "";
			if (input) input.value = "";
			sendMessage(v);
		});

		const onResize = () => syncPlace();
		let scrollTick = 0;
		const onScroll = () => {
			if (!docked && !isHomeView()) return;
			if (scrollTick) return;
			scrollTick = requestAnimationFrame(() => {
				scrollTick = 0;
				if (isHomeView()) placeDock();
			});
		};
		const onMusicPlay = (e) => {
			syncMusicPlaying(!!e.detail?.isPlaying);
		};
		const onMusicInit = () => {
			const playing = !!window.__fireflyMusic?.getState?.()?.isPlaying;
			syncMusicPlaying(playing);
		};
		window.addEventListener("resize", onResize);
		document.addEventListener("scroll", onScroll, { passive: true, capture: true });
		window.addEventListener("fm:play-state", onMusicPlay);
		window.addEventListener("fm:init", onMusicInit);

		loadKb().then(() => {
			renderQuick();
			if (!msgs.childElementCount) {
				addBubble("想了解站主，问我就好。", "bot");
			}
		});

		onMusicInit();
		void reveal();

		live = {
			bot,
			root,
			syncPlace,
			teardown: () => {
				clearIdle();
				clearTimers();
				clearEqReturn();
				stopEqLoop();
				leaveEq(false);
				window.removeEventListener("resize", onResize);
				document.removeEventListener("scroll", onScroll, { capture: true });
				window.removeEventListener("fm:play-state", onMusicPlay);
				window.removeEventListener("fm:init", onMusicInit);
				window.removeEventListener("pointermove", onPtrLook);
				document.documentElement.removeEventListener("pointerleave", onPtrLeave);
				avatar.removeEventListener("pointerdown", onPointerDown);
				avatar.removeEventListener("pointermove", onPointerMove);
				avatar.removeEventListener("pointerup", onPointerUp);
				avatar.removeEventListener("pointercancel", onPointerUp);
				bot.destroy?.();
				// keep shell DOM for Swup; only destroy character instance on version bump
			},
		};
	}

	function onView() {
		mount().catch(console.error);
	}

	ensureCss();
	const scriptsReady = ensureScripts();

	async function mount() {
		await scriptsReady;
		const root = createShell();
		if (live?.root === root && root.querySelector("svg[data-folio-buddy-svg]")) {
			live.syncPlace?.(true);
			return;
		}
		destroyLive();
		bindCompanion(root);
		loadKb();
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", onView);
	} else {
		onView();
	}
	document.addEventListener("swup:page:view", onView);
	document.addEventListener("astro:page-load", onView);
})();
