<script lang="ts">
	import { onDestroy, onMount, tick } from "svelte";
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
			initialized: boolean;
		};
		togglePlay: () => void;
		playTrackByIndex: (i: number) => void;
		setPlayMode: (mode: number) => void;
		setVolume: (v: number) => void;
	};

	let api: MusicApi | null = null;
	let unsubs: Array<() => void> = [];
	let volEl: HTMLDivElement | undefined;
	let rootEl: HTMLElement | undefined;
	let copyEl: HTMLElement | undefined;
	let swapTimer = 0;
	let pulseTimer = 0;
	let lastTitle = "";

	let playlist = $state<Track[]>([]);
	let currentIndex = $state(0);
	let isPlaying = $state(false);
	let playMode = $state(0);
	let volume = $state(0.7);
	let title = $state("暂无曲目");
	let artist = $state("");
	let favKeys = $state<string[]>([]);
	let favOnly = $state(false);

	const track = $derived(playlist[currentIndex] ?? null);
	const liked = $derived(isFav(track, favKeys));

	function prefersReducedMotion() {
		return (
			typeof window !== "undefined" &&
			window.matchMedia("(prefers-reduced-motion: reduce)").matches
		);
	}

	function bumpCopy() {
		if (typeof window === "undefined" || !copyEl || prefersReducedMotion()) return;
		copyEl.classList.remove("is-swap");
		void copyEl.offsetWidth;
		copyEl.classList.add("is-swap");
		window.clearTimeout(swapTimer);
		swapTimer = window.setTimeout(() => copyEl?.classList.remove("is-swap"), 360);
	}

	function pulseShell() {
		if (typeof window === "undefined" || !rootEl || prefersReducedMotion()) return;
		rootEl.classList.remove("is-pulse");
		void rootEl.offsetWidth;
		rootEl.classList.add("is-pulse");
		window.clearTimeout(pulseTimer);
		pulseTimer = window.setTimeout(() => rootEl?.classList.remove("is-pulse"), 540);
	}

	function tap(e: MouseEvent) {
		if (typeof window === "undefined") return;
		const btn = e.currentTarget as HTMLElement | null;
		if (!btn || prefersReducedMotion()) return;
		btn.classList.remove("is-tap");
		void btn.offsetWidth;
		btn.classList.add("is-tap");
		window.setTimeout(() => btn.classList.remove("is-tap"), 360);
	}

	function sync() {
		if (!api) return;
		const s = api.getState();
		playlist = s.playlist || [];
		currentIndex = s.currentIndex ?? 0;
		isPlaying = !!s.isPlaying;
		playMode = s.playMode ?? 0;
		volume = s.volume ?? 0.7;
		const t = s.track;
		const nextTitle = t?.name || "暂无曲目";
		const nextArtist = t?.artist || "";
		const changed = lastTitle !== "" && (nextTitle !== title || nextArtist !== artist);
		title = nextTitle;
		artist = nextArtist;
		lastTitle = nextTitle;
		if (changed) void tick().then(bumpCopy);
	}

	function on(name: string, fn: (e: CustomEvent) => void) {
		const h = (e: Event) => fn(e as CustomEvent);
		window.addEventListener(name, h);
		unsubs.push(() => window.removeEventListener(name, h));
	}

	function favIndices() {
		return playlist.map((_, i) => i).filter((i) => isFav(playlist[i], favKeys));
	}

	function skip(dir: 1 | -1) {
		if (!api) return;
		const pool = favOnly ? favIndices() : playlist.map((_, i) => i);
		if (!pool.length) return;
		const pos = pool.indexOf(currentIndex);
		const from = pos < 0 ? 0 : pos;
		api.playTrackByIndex(pool[(from + dir + pool.length) % pool.length]);
	}

	function run(fn: () => void) {
		void Promise.resolve(api?.init()).then(() => {
			fn();
			sync();
		});
	}

	function setVolFromEvent(e: PointerEvent) {
		if (!volEl) return;
		const rect = volEl.getBoundingClientRect();
		api?.setVolume(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
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
		});
		if (api) void Promise.resolve(api.init()).finally(sync);
	});

	onDestroy(() => {
		if (typeof window !== "undefined") {
			window.clearTimeout(swapTimer);
			window.clearTimeout(pulseTimer);
		}
		for (const off of unsubs) off();
		unsubs = [];
	});
</script>

<article
	bind:this={rootEl}
	class="folio-tile folio-phono"
	style="--bento-delay: 90ms"
	aria-label="留声"
>
	<span class="folio-phono-kicker">留声</span>

	<div class="folio-phono-copy" bind:this={copyEl}>
		<strong class="folio-phono-title">{title}</strong>
		{#if artist}
			<span class="folio-phono-artist">{artist}</span>
		{/if}
	</div>

	<nav class="folio-phono-nav" aria-label="播放控制">
		<button
			type="button"
			onclick={(e) => {
				tap(e);
				run(() => skip(-1));
			}}
		>上一</button>
		<button
			type="button"
			class="is-play"
			class:is-on={isPlaying}
			onclick={(e) => {
				tap(e);
				pulseShell();
				run(() => api?.togglePlay());
			}}
		>
			{isPlaying ? "暂停" : "播放"}
		</button>
		<button
			type="button"
			onclick={(e) => {
				tap(e);
				run(() => skip(1));
			}}
		>下一</button>
	</nav>

	<nav class="folio-phono-aux" aria-label="播放选项">
		<button
			type="button"
			class:is-on={playMode === 2}
			onclick={(e) => {
				tap(e);
				run(() => {
					api?.setPlayMode(playMode === 2 ? 0 : 2);
					if (!api?.getState().isPlaying) api?.togglePlay();
				});
			}}
		>随机</button>
		<button
			type="button"
			class:is-on={liked}
			onclick={(e) => {
				tap(e);
				if (!track) return;
				favKeys = toggleFav(track);
			}}
		>收藏</button>
		<button
			type="button"
			class:is-on={favOnly}
			onclick={(e) => {
				tap(e);
				if (!favKeys.length) return;
				favOnly = !favOnly;
				if (favOnly && track && !isFav(track, favKeys)) skip(1);
			}}
		>偏好</button>
	</nav>

	<div
		bind:this={volEl}
		class="folio-phono-vol"
		role="slider"
		tabindex="0"
		aria-label="音量"
		aria-valuemin="0"
		aria-valuemax="100"
		aria-valuenow={Math.round(volume * 100)}
		onpointerdown={(e) => {
			(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
			setVolFromEvent(e);
		}}
		onpointermove={(e) => e.buttons && setVolFromEvent(e)}
	>
		<div class="folio-phono-vol-fill" style={`width:${volume * 100}%`}></div>
	</div>
</article>
