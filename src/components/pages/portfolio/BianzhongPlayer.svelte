<script lang="ts">
	import { onDestroy, onMount } from "svelte";

	type Track = {
		name?: string;
		artist?: string;
		pic?: string;
		cover?: string;
	};

	type MusicApi = {
		init: () => void | Promise<void>;
		getState: () => {
			playlist: Track[];
			currentIndex: number;
			track: Track | null;
			isPlaying: boolean;
			playMode: number;
			volume: number;
			isMuted: boolean;
			initialized: boolean;
		};
		togglePlay: () => void;
		playNext: () => void;
		playPrev: () => void;
		setPlayMode: (mode: number) => void;
		setVolume: (v: number) => void;
		toggleMute: () => void;
	};

	type Bell = {
		id: string;
		name: string;
		tone: string;
		hint: string;
		size: number;
		action: "play" | "list" | "one" | "random" | "next" | "prev" | "mute";
	};

	const BELLS: Bell[] = [
		{ id: "gong", name: "宫", tone: "起止", hint: "播放 / 暂停", size: 1, action: "play" },
		{ id: "shang", name: "商", tone: "循列", hint: "列表循环", size: 0.92, action: "list" },
		{ id: "jue", name: "角", tone: "单旋", hint: "单曲循环", size: 0.84, action: "one" },
		{ id: "zhi", name: "徵", tone: "散序", hint: "随机播放", size: 0.76, action: "random" },
		{ id: "yu", name: "羽", tone: "更迭", hint: "下一首", size: 0.68, action: "next" },
		{ id: "bian", name: "变", tone: "回响", hint: "上一首", size: 0.62, action: "prev" },
		{ id: "qing", name: "清", tone: "缄默", hint: "静音切换", size: 0.56, action: "mute" },
	];

	let api: MusicApi | null = null;
	let unsubs: Array<() => void> = [];
	let audioCtx: AudioContext | null = null;

	let isPlaying = $state(false);
	let playMode = $state(0);
	let isMuted = $state(false);
	let title = $state("编钟 · 点钟听乐");
	let artist = $state("点不同的钟，切换播放设定");
	let activeId = $state("");
	let strikeId = $state("");
	let ready = $state(false);

	function sync() {
		if (!api) return;
		const s = api.getState();
		isPlaying = !!s.isPlaying;
		playMode = s.playMode ?? 0;
		isMuted = !!s.isMuted;
		ready = !!s.initialized;
		const t = s.track;
		if (t?.name) {
			title = t.name;
			artist = t.artist || "";
		}
	}

	function on(name: string, fn: (e: CustomEvent) => void) {
		const h = (e: Event) => fn(e as CustomEvent);
		window.addEventListener(name, h);
		unsubs.push(() => window.removeEventListener(name, h));
	}

	function ensureAudio() {
		const AC =
			window.AudioContext ||
			(window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
		if (!AC) return null;
		if (!audioCtx) audioCtx = new AC();
		if (audioCtx.state === "suspended") void audioCtx.resume();
		return audioCtx;
	}

	/** Short metallic chime — no asset files needed. */
	function chime(size: number) {
		const ctx = ensureAudio();
		if (!ctx) return;
		const t0 = ctx.currentTime;
		const base = 220 + (1 - size) * 420;
		const freqs = [base, base * 2.01, base * 2.98];
		for (let i = 0; i < freqs.length; i++) {
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.type = i === 0 ? "triangle" : "sine";
			osc.frequency.value = freqs[i];
			gain.gain.setValueAtTime(0.0001, t0);
			gain.gain.exponentialRampToValueAtTime(0.12 / (i + 1), t0 + 0.02);
			gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.55 + i * 0.08);
			osc.connect(gain);
			gain.connect(ctx.destination);
			osc.start(t0);
			osc.stop(t0 + 0.8);
		}
	}

	function modeActive(action: Bell["action"]) {
		if (action === "list") return playMode === 0 && isPlaying;
		if (action === "one") return playMode === 1;
		if (action === "random") return playMode === 2;
		if (action === "play") return isPlaying;
		if (action === "mute") return isMuted;
		return false;
	}

	function strike(bell: Bell) {
		if (!api) return;
		strikeId = bell.id;
		window.setTimeout(() => {
			if (strikeId === bell.id) strikeId = "";
		}, 420);
		chime(bell.size);
		void Promise.resolve(api.init()).then(() => {
			switch (bell.action) {
				case "play":
					api?.togglePlay();
					activeId = bell.id;
					break;
				case "list":
					api?.setPlayMode(0);
					activeId = bell.id;
					if (!api?.getState().isPlaying) api?.togglePlay();
					break;
				case "one":
					api?.setPlayMode(1);
					activeId = bell.id;
					if (!api?.getState().isPlaying) api?.togglePlay();
					break;
				case "random":
					api?.setPlayMode(2);
					activeId = bell.id;
					if (!api?.getState().isPlaying) api?.togglePlay();
					break;
				case "next":
					api?.playNext();
					activeId = bell.id;
					break;
				case "prev":
					api?.playPrev();
					activeId = bell.id;
					break;
				case "mute":
					api?.toggleMute();
					activeId = bell.id;
					break;
			}
			sync();
		});
	}

	onMount(() => {
		api = (window as unknown as { __fireflyMusic?: MusicApi }).__fireflyMusic ?? null;
		on("fm:init", () => sync());
		on("fm:track", () => sync());
		on("fm:play-state", (e) => {
			isPlaying = !!e.detail?.isPlaying;
		});
		on("fm:mode", (e) => {
			playMode = e.detail?.playMode ?? 0;
		});
		on("fm:volume", (e) => {
			isMuted = !!e.detail?.isMuted;
		});
		if (api) {
			void Promise.resolve(api.init()).finally(sync);
		}
	});

	onDestroy(() => {
		for (const off of unsubs) off();
		unsubs = [];
		void audioCtx?.close();
		audioCtx = null;
	});
</script>

<article class="folio-tile folio-bianzhong" style="--bento-delay: 90ms" aria-label="编钟播放器">
	<header class="folio-bz-head">
		<p class="folio-bz-kicker">编钟</p>
		<div class="folio-bz-now">
			<strong class="folio-bz-title">{title}</strong>
			<span class="folio-bz-artist">{artist}</span>
		</div>
	</header>

	<div class="folio-bz-rack" role="group" aria-label="编钟">
		<div class="folio-bz-beam" aria-hidden="true"></div>
		<div class="folio-bz-bells">
			{#each BELLS as bell}
				<button
					type="button"
					class="folio-bz-bell"
					class:is-active={activeId === bell.id || modeActive(bell.action)}
					class:is-strike={strikeId === bell.id}
					style={`--bz-size: ${bell.size}`}
					onclick={() => strike(bell)}
					aria-label={`${bell.name} · ${bell.hint}`}
					title={bell.hint}
				>
					<span class="folio-bz-cord" aria-hidden="true"></span>
					<span class="folio-bz-body">
						<span class="folio-bz-name">{bell.name}</span>
						<span class="folio-bz-tone">{bell.tone}</span>
					</span>
					<span class="folio-bz-hint">{bell.hint}</span>
				</button>
			{/each}
		</div>
		<div class="folio-bz-stand" aria-hidden="true"></div>
	</div>

	<p class="folio-bz-footnote">点钟切换设定 · 歌单在 Music 管理</p>
</article>
