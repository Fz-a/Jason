<script lang="ts">
	import { onDestroy, onMount } from "svelte";

	type Track = {
		name?: string;
		artist?: string;
		url?: string;
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
			currentTime: number;
			duration: number;
			progress: number;
			currentTimeStr: string;
			durationStr: string;
			initialized: boolean;
			error?: string | null;
		};
		togglePlay: () => void;
		playNext: () => void;
		playPrev: () => void;
		cyclePlayMode: () => void;
		setVolume: (v: number) => void;
		toggleMute: () => void;
		seek: (pct: number) => void;
		playTrackByIndex: (i: number) => void;
	};

	interface Props {
		homeHref?: string;
	}

	let { homeHref = "/" }: Props = $props();

	let playlist = $state<Track[]>([]);
	let currentIndex = $state(0);
	let isPlaying = $state(false);
	let playMode = $state(0);
	let volume = $state(0.7);
	let isMuted = $state(false);
	let progress = $state(0);
	let currentTimeStr = $state("0:00");
	let durationStr = $state("0:00");
	let ready = $state(false);
	let loading = $state(true);
	let errorMsg = $state("");
	let query = $state("");

	let api: MusicApi | null = null;
	let unsubs: Array<() => void> = [];

	const track = $derived(playlist[currentIndex] ?? null);
	const cover = $derived(track?.pic || track?.cover || "");
	const title = $derived(track?.name || "Music");
	const artist = $derived(track?.artist || "选择一首开始听");

	const filtered = $derived(
		playlist
			.map((t, i) => ({ t, i }))
			.filter(({ t }) => {
				const q = query.trim().toLowerCase();
				if (!q) return true;
				return (
					String(t.name || "")
						.toLowerCase()
						.includes(q) ||
					String(t.artist || "")
						.toLowerCase()
						.includes(q)
				);
			}),
	);

	const modeLabel = $derived(
		playMode === 1 ? "单曲循环" : playMode === 2 ? "随机播放" : "列表循环",
	);

	function syncFromApi() {
		if (!api) return;
		const s = api.getState();
		playlist = s.playlist || [];
		currentIndex = s.currentIndex ?? 0;
		isPlaying = !!s.isPlaying;
		playMode = s.playMode ?? 0;
		volume = s.volume ?? 0.7;
		isMuted = !!s.isMuted;
		progress = s.progress ?? 0;
		currentTimeStr = s.currentTimeStr || "0:00";
		durationStr = s.durationStr || "0:00";
		ready = !!s.initialized;
		if (s.error) errorMsg = String(s.error);
		loading = !s.initialized && playlist.length === 0;
	}

	function on<K extends string>(name: K, fn: (e: CustomEvent) => void) {
		const handler = (e: Event) => fn(e as CustomEvent);
		window.addEventListener(name, handler);
		unsubs.push(() => window.removeEventListener(name, handler));
	}

	onMount(() => {
		api = (window as unknown as { __fireflyMusic?: MusicApi }).__fireflyMusic ?? null;
		if (!api) {
			loading = false;
			errorMsg = "播放器未就绪，请刷新页面。";
			return;
		}

		on("fm:init", (e) => {
			playlist = e.detail?.playlist || [];
			playMode = e.detail?.playMode ?? 0;
			volume = e.detail?.volume ?? 0.7;
			isMuted = !!e.detail?.isMuted;
			ready = true;
			loading = false;
			if (!playlist.length) errorMsg = "歌单为空，请检查音乐配置。";
			syncFromApi();
		});
		on("fm:track", (e) => {
			currentIndex = e.detail?.index ?? 0;
			syncFromApi();
		});
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
		on("fm:time", (e) => {
			progress = e.detail?.progress ?? 0;
			currentTimeStr = e.detail?.currentTimeStr || "0:00";
			durationStr = e.detail?.durationStr || "0:00";
		});
		on("fm:error", (e) => {
			errorMsg = e.detail?.message || "播放出错";
			loading = false;
		});

		void Promise.resolve(api.init()).finally(() => {
			syncFromApi();
			loading = false;
		});
	});

	onDestroy(() => {
		for (const off of unsubs) off();
		unsubs = [];
	});

	function playAt(i: number) {
		api?.playTrackByIndex(i);
	}

	function onSeek(e: MouseEvent | KeyboardEvent) {
		const el = e.currentTarget as HTMLElement;
		if (e instanceof KeyboardEvent) {
			if (e.key === "ArrowLeft") api?.seek(Math.max(0, progress - 5));
			if (e.key === "ArrowRight") api?.seek(Math.min(100, progress + 5));
			return;
		}
		const rect = el.getBoundingClientRect();
		const pct = ((e.clientX - rect.left) / rect.width) * 100;
		api?.seek(Math.max(0, Math.min(100, pct)));
	}

	function onVol(e: MouseEvent) {
		const el = e.currentTarget as HTMLElement;
		const rect = el.getBoundingClientRect();
		const pct = (e.clientX - rect.left) / rect.width;
		api?.setVolume(Math.max(0, Math.min(1, pct)));
	}
</script>

<section class="folio-music" aria-label="Music library">
	<header class="folio-music-head">
		<a class="folio-music-back" href={homeHref}>← Home</a>
		<div class="folio-music-titles">
			<p class="folio-music-kicker">Library</p>
			<h1 class="folio-music-title">Music</h1>
		</div>
		<p class="folio-music-count">
			{playlist.length ? `${playlist.length} tracks` : "—"}
		</p>
	</header>

	<div class="folio-music-layout">
		<aside class="folio-music-now folio-tile" aria-live="polite">
			<div class="folio-music-cover-wrap">
				{#if cover}
					<img class="folio-music-cover" class:is-spinning={isPlaying} src={cover} alt="" />
				{:else}
					<div class="folio-music-cover folio-music-cover--empty" aria-hidden="true"></div>
				{/if}
			</div>

			<div class="folio-music-meta">
				<h2 class="folio-music-track">{title}</h2>
				<p class="folio-music-artist">{artist}</p>
			</div>

			{#if errorMsg && !playlist.length}
				<p class="folio-music-error">{errorMsg}</p>
			{/if}

			<div
				class="folio-music-progress"
				role="slider"
				tabindex="0"
				aria-label="Progress"
				aria-valuemin="0"
				aria-valuemax="100"
				aria-valuenow={Math.round(progress)}
				onclick={onSeek}
				onkeydown={onSeek}
			>
				<div class="folio-music-progress-bar" style={`width:${progress}%`}></div>
			</div>
			<div class="folio-music-time">
				<span>{currentTimeStr}</span>
				<span>{durationStr}</span>
			</div>

			<div class="folio-music-controls">
				<button type="button" class="folio-music-btn" onclick={() => api?.cyclePlayMode()} title={modeLabel} aria-label={modeLabel}>
					{#if playMode === 1}
						<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1.5h1.5V15H13z"/></svg>
					{:else if playMode === 2}
						<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M10.59 9.17 5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/></svg>
					{:else}
						<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>
					{/if}
				</button>
				<button type="button" class="folio-music-btn" onclick={() => api?.playPrev()} aria-label="Previous">
					<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M6 6h2v12H6V6zm3.5 6 8.5 6V6l-8.5 6z"/></svg>
				</button>
				<button
					type="button"
					class="folio-music-btn folio-music-btn--play"
					onclick={() => api?.togglePlay()}
					aria-label={isPlaying ? "Pause" : "Play"}
					disabled={!ready || !playlist.length}
				>
					{#if isPlaying}
						<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M6 5h4v14H6V5zm8 0h4v14h-4V5z"/></svg>
					{:else}
						<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7L8 5z"/></svg>
					{/if}
				</button>
				<button type="button" class="folio-music-btn" onclick={() => api?.playNext()} aria-label="Next">
					<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
				</button>
				<button
					type="button"
					class="folio-music-btn"
					onclick={() => api?.toggleMute()}
					aria-label={isMuted ? "Unmute" : "Mute"}
				>
					{#if isMuted || volume < 0.02}
						<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M16.5 12A4.5 4.5 0 0 0 14 8.18v2.06l2.45 2.45c.03-.22.05-.45.05-.69zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.8 8.8 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z"/></svg>
					{:else}
						<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8.18v7.64A4.47 4.47 0 0 0 16.5 12zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
					{/if}
				</button>
			</div>

			<div
				class="folio-music-vol"
				role="slider"
				tabindex="0"
				aria-label="Volume"
				aria-valuemin="0"
				aria-valuemax="100"
				aria-valuenow={Math.round((isMuted ? 0 : volume) * 100)}
				onclick={onVol}
			>
				<div class="folio-music-vol-bar" style={`width:${(isMuted ? 0 : volume) * 100}%`}></div>
			</div>
		</aside>

		<div class="folio-music-library folio-tile">
			<div class="folio-music-lib-head">
				<h2>歌单</h2>
				<label class="folio-music-search">
					<span class="sr-only">搜索</span>
					<input type="search" placeholder="搜索曲名 / 艺人" bind:value={query} />
				</label>
			</div>

			{#if loading}
				<p class="folio-music-status">正在载入歌单…</p>
			{:else if !filtered.length}
				<p class="folio-music-status">{query ? "没有匹配的曲子" : "暂无曲目"}</p>
			{:else}
				<ul class="folio-music-list" role="listbox" aria-label="Playlist">
					{#each filtered as { t, i } (i)}
						<li>
							<button
								type="button"
								class="folio-music-item"
								class:is-active={i === currentIndex}
								class:is-playing={i === currentIndex && isPlaying}
								onclick={() => playAt(i)}
								role="option"
								aria-selected={i === currentIndex}
							>
								<span class="folio-music-idx">{String(i + 1).padStart(2, "0")}</span>
								{#if t.pic || t.cover}
									<img class="folio-music-thumb" src={t.pic || t.cover} alt="" loading="lazy" />
								{:else}
									<span class="folio-music-thumb folio-music-thumb--empty"></span>
								{/if}
								<span class="folio-music-item-text">
									<span class="folio-music-item-name">{t.name || "Untitled"}</span>
									<span class="folio-music-item-artist">{t.artist || ""}</span>
								</span>
								{#if i === currentIndex && isPlaying}
									<span class="folio-music-eq" aria-hidden="true">
										<i></i><i></i><i></i>
									</span>
								{/if}
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
</section>
