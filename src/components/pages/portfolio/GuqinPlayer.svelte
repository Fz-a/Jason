<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { isFav, loadFavs, toggleFav, type FavTrack } from "@/utils/folio-music-favs";

	type Track = FavTrack & { pic?: string; cover?: string };

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
		playTrackByIndex: (i: number) => void;
		setPlayMode: (mode: number) => void;
		setVolume: (v: number) => void;
		toggleMute: () => void;
	};

	type StringAct = {
		id: string;
		label: string;
		hint: string;
		action: "prev" | "play" | "next" | "random";
	};

	const STRINGS: StringAct[] = [
		{ id: "prev", label: "徵", hint: "上一首", action: "prev" },
		{ id: "play", label: "宫", hint: "播放 / 暂停", action: "play" },
		{ id: "next", label: "商", hint: "下一首", action: "next" },
		{ id: "random", label: "羽", hint: "随机", action: "random" },
	];

	let api: MusicApi | null = null;
	let unsubs: Array<() => void> = [];
	let audioCtx: AudioContext | null = null;
	let volEl: HTMLDivElement | undefined;

	let playlist = $state<Track[]>([]);
	let currentIndex = $state(0);
	let isPlaying = $state(false);
	let playMode = $state(0);
	let volume = $state(0.7);
	let isMuted = $state(false);
	let title = $state("古琴 · 抚弦听乐");
	let artist = $state("拨弦切歌，沿琴面滑动调音量");
	let plucked = $state("");
	let favKeys = $state<string[]>([]);
	let favOnly = $state(false);
	let note = $state("");

	const track = $derived(playlist[currentIndex] ?? null);
	const liked = $derived(isFav(track, favKeys));

	function sync() {
		if (!api) return;
		const s = api.getState();
		playlist = s.playlist || [];
		currentIndex = s.currentIndex ?? 0;
		isPlaying = !!s.isPlaying;
		playMode = s.playMode ?? 0;
		volume = s.volume ?? 0.7;
		isMuted = !!s.isMuted;
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

	function pluckTone(which: number) {
		const ctx = ensureAudio();
		if (!ctx) return;
		const t0 = ctx.currentTime;
		const base = 196 * 2 ** (which / 12);
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = "triangle";
		osc.frequency.setValueAtTime(base, t0);
		osc.frequency.exponentialRampToValueAtTime(base * 0.97, t0 + 0.45);
		gain.gain.setValueAtTime(0.0001, t0);
		gain.gain.exponentialRampToValueAtTime(0.08, t0 + 0.018);
		gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.55);
		osc.connect(gain);
		gain.connect(ctx.destination);
		osc.start(t0);
		osc.stop(t0 + 0.6);
	}

	function favIndices() {
		return playlist.map((_, i) => i).filter((i) => isFav(playlist[i], favKeys));
	}

	function skip(dir: 1 | -1) {
		if (!api) return;
		const pool = favOnly ? favIndices() : playlist.map((_, i) => i);
		if (!pool.length) {
			note = favOnly ? "还没有收藏曲目" : "";
			return;
		}
		const pos = pool.indexOf(currentIndex);
		const from = pos < 0 ? 0 : pos;
		const next = pool[(from + dir + pool.length) % pool.length];
		api.playTrackByIndex(next);
	}

	function pluck(act: StringAct) {
		plucked = act.id;
		window.setTimeout(() => {
			if (plucked === act.id) plucked = "";
		}, 280);
		pluckTone(STRINGS.findIndex((s) => s.id === act.id));
		void Promise.resolve(api?.init()).then(() => {
			switch (act.action) {
				case "play":
					api?.togglePlay();
					break;
				case "prev":
					skip(-1);
					break;
				case "next":
					skip(1);
					break;
				case "random":
					api?.setPlayMode(playMode === 2 ? 0 : 2);
					if (!api?.getState().isPlaying) api?.togglePlay();
					break;
			}
			sync();
		});
	}

	function setVolFromEvent(e: PointerEvent) {
		if (!volEl) return;
		const rect = volEl.getBoundingClientRect();
		const pct = (e.clientX - rect.left) / rect.width;
		api?.setVolume(Math.max(0, Math.min(1, pct)));
	}

	function onVolPointer(e: PointerEvent) {
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		setVolFromEvent(e);
	}

	function stampFav() {
		if (!track) {
			note = "先选一首再收藏";
			return;
		}
		favKeys = toggleFav(track);
		note = liked ? "已移出偏好" : "已收入偏好";
		window.setTimeout(() => {
			note = "";
		}, 1400);
	}

	function toggleFavOnly() {
		if (!favKeys.length) {
			note = "先在曲目上盖印收藏";
			favOnly = false;
			return;
		}
		favOnly = !favOnly;
		note = favOnly ? "只听偏好" : "听全部歌单";
		if (favOnly && track && !isFav(track, favKeys)) skip(1);
		window.setTimeout(() => {
			note = "";
		}, 1400);
	}

	onMount(() => {
		favKeys = loadFavs();
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
			volume = e.detail?.volume ?? volume;
			isMuted = !!e.detail?.isMuted;
		});
		if (api) void Promise.resolve(api.init()).finally(sync);
	});

	onDestroy(() => {
		for (const off of unsubs) off();
		unsubs = [];
		void audioCtx?.close();
		audioCtx = null;
	});
</script>

<article class="folio-tile folio-qin" style="--bento-delay: 90ms" aria-label="古琴播放器">
	<header class="folio-qin-head">
		<div class="folio-qin-now">
			<p class="folio-qin-kicker">古琴</p>
			<strong class="folio-qin-title">{title}</strong>
			<span class="folio-qin-artist">{artist}</span>
		</div>
		<div class="folio-qin-stamps">
			<button
				type="button"
				class="folio-qin-seal"
				class:is-on={liked}
				onclick={stampFav}
				title="收藏当前曲"
				aria-pressed={liked}
			>
				藏
			</button>
			<button
				type="button"
				class="folio-qin-seal folio-qin-seal--mode"
				class:is-on={favOnly}
				onclick={toggleFavOnly}
				title="只听偏好"
				aria-pressed={favOnly}
			>
				癖
			</button>
		</div>
	</header>

	<div class="folio-qin-body">
		<div class="folio-qin-hui" aria-hidden="true">
			{#each [0, 1, 2, 3, 4, 5, 6] as i (i)}
				<span class="folio-qin-dot"></span>
			{/each}
		</div>

		<div class="folio-qin-strings" role="group" aria-label="琴弦">
			{#each STRINGS as s, i}
				<button
					type="button"
					class="folio-qin-string"
					class:is-plucked={plucked === s.id}
					class:is-live={(s.action === "play" && isPlaying) || (s.action === "random" && playMode === 2)}
					style={`--s:${i}`}
					onclick={() => pluck(s)}
					aria-label={s.hint}
					title={s.hint}
				>
					<span class="folio-qin-wire"></span>
					<span class="folio-qin-s-label">
						<b>{s.label}</b>
						<small>{s.hint}</small>
					</span>
				</button>
			{/each}
		</div>

		<div
			bind:this={volEl}
			class="folio-qin-vol"
			role="slider"
			tabindex="0"
			aria-label="音量"
			aria-valuemin="0"
			aria-valuemax="100"
			aria-valuenow={Math.round((isMuted ? 0 : volume) * 100)}
			onpointerdown={onVolPointer}
			onpointermove={(e) => e.buttons && setVolFromEvent(e)}
		>
			<div class="folio-qin-vol-fill" style={`width:${(isMuted ? 0 : volume) * 100}%`}></div>
			<span class="folio-qin-vol-label">{isMuted ? "噤" : "音量"}</span>
		</div>
	</div>

	<p class="folio-qin-note">{note || (favOnly ? "偏好模式 · 歌单在 Music 管理" : "拨弦控制 · 滑动调音 · 歌单在 Music")}</p>
</article>
