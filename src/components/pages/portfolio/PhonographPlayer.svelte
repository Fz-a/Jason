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

	function sync() {
		if (!api) return;
		const s = api.getState();
		playlist = s.playlist || [];
		currentIndex = s.currentIndex ?? 0;
		isPlaying = !!s.isPlaying;
		playMode = s.playMode ?? 0;
		volume = s.volume ?? 0.7;
		const t = s.track;
		title = t?.name || "暂无曲目";
		artist = t?.artist || "";
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
		for (const off of unsubs) off();
		unsubs = [];
	});
</script>

<article class="folio-tile folio-phono" style="--bento-delay: 90ms" aria-label="留声">
	<span class="folio-phono-kicker">留声</span>

	<div class="folio-phono-copy">
		<strong class="folio-phono-title">{title}</strong>
		{#if artist}
			<span class="folio-phono-artist">{artist}</span>
		{/if}
	</div>

	<nav class="folio-phono-nav" aria-label="播放控制">
		<button type="button" onclick={() => run(() => skip(-1))}>上一</button>
		<button type="button" class="is-play" class:is-on={isPlaying} onclick={() => run(() => api?.togglePlay())}>
			{isPlaying ? "暂停" : "播放"}
		</button>
		<button type="button" onclick={() => run(() => skip(1))}>下一</button>
	</nav>

	<nav class="folio-phono-aux" aria-label="播放选项">
		<button
			type="button"
			class:is-on={playMode === 2}
			onclick={() =>
				run(() => {
					api?.setPlayMode(playMode === 2 ? 0 : 2);
					if (!api?.getState().isPlaying) api?.togglePlay();
				})}
		>随机</button>
		<button
			type="button"
			class:is-on={liked}
			onclick={() => {
				if (!track) return;
				favKeys = toggleFav(track);
			}}
		>收藏</button>
		<button
			type="button"
			class:is-on={favOnly}
			onclick={() => {
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
