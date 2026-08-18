/* Folio buddy v14 — genesis form-in: 一生二，二生三，三生万物. */
(function () {
	const BOOT_VER = 14;
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
	const SHAPES = ["blob", "wedge", "teardrop", "pebble", "squircle", "hex", "tablet"];
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
		root.innerHTML = `
			<button type="button" class="folio-buddy-avatar" aria-label="墨趣伙伴">
				<div class="folio-buddy-genesis" aria-hidden="true">
					<span class="folio-buddy-seed" data-n="1"></span>
					<span class="folio-buddy-seed" data-n="2"></span>
					<span class="folio-buddy-seed" data-n="3"></span>
				</div>
				<div class="folio-buddy-stage" aria-hidden="true"></div>
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
		const playGenesis = !reduceMotion && sessionStorage.getItem("folio-buddy-genesis") !== "1";
		if (playGenesis) {
			root.classList.add("is-forming");
			root.classList.remove("is-formed");
			sessionStorage.setItem("folio-buddy-genesis", "1");
			window.setTimeout(() => {
				root.classList.remove("is-forming");
				root.classList.add("is-formed");
				armIdle();
			}, 3600);
		} else {
			root.classList.remove("is-forming");
			root.classList.add("is-formed");
		}

		let actIdx = 1;
		let idleWatch = 0;
		/** @type {number[]} */
		let timers = [];
		let chatOpen = false;
		let busyAsk = false;
		let docked = false;
		let size = 92;
		let userFreed = false;

		const clearTimers = () => {
			for (const id of timers) window.clearTimeout(id);
			timers = [];
		};
		const clearIdle = () => {
			if (idleWatch) window.clearTimeout(idleWatch);
			idleWatch = 0;
		};
		const armIdle = () => {
			clearIdle();
			idleWatch = window.setTimeout(() => cycleMood(), IDLE_MS);
		};

		const cycleMood = () => {
			const i = actIdx++;
			const shape = SHAPES[i % SHAPES.length];
			const mood = MOODS[i % MOODS.length];
			clearIdle();
			clearTimers();
			bot.setShape(shape, { silent: true });
			timers.push(
				window.setTimeout(() => {
					bot.setState(mood, { resetEyes: false, soft: true });
				}, 160),
			);
			timers.push(window.setTimeout(() => armIdle(), 2200));
		};

		const setPos = (x, y, animate) => {
			size = root.getBoundingClientRect().width || size;
			x = clamp(x, 8, window.innerWidth - size - 8);
			y = clamp(y, 8, window.innerHeight - size - 8);
			if (!animate) root.classList.add("is-dragging");
			root.style.setProperty("--fb-x", `${Math.round(x)}px`);
			root.style.setProperty("--fb-y", `${Math.round(y)}px`);
			root.classList.toggle("is-chat-right", x > window.innerWidth * 0.45);
			if (!animate) {
				requestAnimationFrame(() => root.classList.remove("is-dragging"));
			}
			return { x, y };
		};

		const placeFloat = (animate = true) => {
			docked = false;
			root.classList.remove("is-docked", "is-home");
			root.style.width = "";
			root.style.height = "";
			size = root.getBoundingClientRect().width || 92;
			const pos = defaultFloatPos(size);
			setPos(pos.x, pos.y, animate);
		};

		const placeDock = () => {
			const dock = document.querySelector("[data-folio-buddy-dock]");
			if (!dock) {
				placeFloat(true);
				return;
			}
			const r = dock.getBoundingClientRect();
			if (r.width < 40 || r.height < 40) {
				placeFloat(true);
				return;
			}
			userFreed = false;
			docked = true;
			root.classList.add("is-docked", "is-home");
			root.classList.remove("is-dragging");
			const side = Math.min(r.width, r.height) * 0.72;
			root.style.width = `${side}px`;
			root.style.height = `${side}px`;
			size = side;
			const x = r.left + (r.width - side) / 2;
			const y = r.top + (r.height - side) / 2;
			setPos(x, y, true);
		};

		const syncPlace = (resetFree = false) => {
			if (resetFree) userFreed = false;
			const home = isHomeView();
			if (home) {
				placeDock();
				setChat(false);
			} else if (resetFree || !userFreed) {
				placeFloat(true);
			} else {
				const rect = root.getBoundingClientRect();
				setPos(rect.left, rect.top, false);
			}
			avatar?.setAttribute("aria-label", home ? "墨趣伙伴，点击互动" : "墨趣伙伴，点击提问，可拖动");
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
				bot.setState("listening", { resetEyes: false, soft: true });
				input?.focus();
			} else if (!isHomeView()) {
				bot.setState("happy", { resetEyes: false, soft: true });
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
				if (!root.classList.contains("is-forming")) cycleMood();
				return;
			}
			if (dragged) {
				const rect = root.getBoundingClientRect();
				setPos(rect.left, rect.top, false);
			} else {
				setChat(!chatOpen);
			}
		};

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
		window.addEventListener("resize", onResize);
		window.addEventListener("scroll", onResize, { passive: true });

		loadKb().then(() => {
			renderQuick();
			if (!msgs.childElementCount) {
				addBubble("想了解站主，问我就好。", "bot");
			}
		});

		syncPlace();
		if (!playGenesis) armIdle();

		live = {
			bot,
			root,
			syncPlace,
			teardown: () => {
				clearIdle();
				clearTimers();
				window.removeEventListener("resize", onResize);
				window.removeEventListener("scroll", onResize);
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
