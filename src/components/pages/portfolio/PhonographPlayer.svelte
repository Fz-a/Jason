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
	};

	let api: MusicApi | null = null;
	let unsubs: Array<() => void> = [];
	let volEl: HTMLDivElement | undefined;

	let playlist = $state<Track[]>([]);
	let currentIndex = $state(0);
	let isPlaying = $state(false);
	let playMode = $state(0);
	let volume = $state(0.7);
	let title = $state("留声");
	let artist = $state("点唱片播放");
	let favKeys = $state<string[]>([]);
	let favOnly = $state(false);
	let note = $state("");

	const track = $derived(playlist[currentIndex] ?? null);
	const cover = $derived(track?.pic || track?.cover || "");
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
		api.playTrackByIndex(pool[(from + dir + pool.length) % pool.length]);
	}

	function run(fn: () => void) {
		void Promise.resolve(api?.init()).then(() => {
			fn();
			sync();
		});
	}

	function playPause() {
		run(() => api?.togglePlay());
	}

	function prev() {
		run(() => skip(-1));
	}

	function next() {
		run(() => skip(1));
	}

	function shuffle() {
		run(() => {
			api?.setPlayMode(playMode === 2 ? 0 : 2);
			if (!api?.getState().isPlaying) api?.togglePlay();
		});
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
			note = "先盖印收藏";
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

<article class="folio-tile folio-phono" style="--bento-delay: 90ms" aria-label="留声机">
	<div class="folio-phono-stage">
		<button
			type="button"
			class="folio-phono-disc"
			class:is-spinning={isPlaying}
			onclick={playPause}
			aria-label={isPlaying ? "暂停" : "播放"}
			title={isPlaying ? "暂停" : "播放"}
		>
			<span class="folio-phono-grooves" aria-hidden="true"></span>
			<span class="folio-phono-label">
				{#if cover}
					<img src={cover} alt="" />
				{:else}
					<span class="folio-phono-listen">{isPlaying ? "停" : "听"}</span>
				{/if}
			</span>
		</button>
		<div class="folio-phono-arm" class:is-on={isPlaying} aria-hidden="true">
			<span class="folio-phono-arm-bar"></span>
			<span class="folio-phono-arm-head"></span>
		</div>
	</div>

	<div class="folio-phono-meta">
		<strong class="folio-phono-title">{title}</strong>
		<span class="folio-phono-artist">{artist}</span>
	</div>

	<div class="folio-phono-keys" role="group" aria-label="播放控制">
		<button type="button" onclick={prev} title="上一首" aria-label="上一首">上</button>
		<button type="button" class="is-main" class:is-on={isPlaying} onclick={playPause} title="播放 / 暂停">
			{isPlaying ? "停" : "听"}
		</button>
		<button type="button" onclick={next} title="下一首" aria-label="下一首">下</button>
		<button type="button" class:is-on={playMode === 2} onclick={shuffle} title="随机" aria-label="随机">散</button>
		<button type="button" class:is-on={liked} onclick={stampFav} title="收藏" aria-label="收藏">藏</button>
		<button type="button" class:is-on={favOnly} onclick={toggleFavOnly} title="只听偏好" aria-label="只听偏好">偏</button>
	</div>

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
		<span>音量</span>
	</div>

	<p class="folio-phono-note">{note || "点唱片播放 · 歌单在 Music"}</p>
</article>
