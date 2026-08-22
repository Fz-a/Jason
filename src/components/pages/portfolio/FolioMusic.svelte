<script lang="ts">
	import { onDestroy, onMount, tick } from "svelte";
	import { isFav, loadFavs, toggleFav } from "@/utils/folio-music-favs";

	type Track = {
		name?: string;
		artist?: string;
		url?: string;
		pic?: string;
		cover?: string;
		lrc?: string;
	};

	type LyricLine = { time: number; text: string };

	type MusicApi = {
		init: () => void | Promise<void>;
		getState: () => {
			playlist: Track[];
			currentIndex: number;
			track: Track | null;
			isPlaying: boolean;
			playMode: number;
			initialized: boolean;
			currentTime: number;
			duration: number;
			progress: number;
			currentTimeStr: string;
			durationStr: string;
			lyrics: LyricLine[];
			currentLrcIndex: number;
			error?: string | null;
		};
		playTrackByIndex: (i: number) => void;
		togglePlay: () => void;
		playNext: () => void;
		playPrev: () => void;
		cyclePlayMode: () => void;
		seek: (percent: number) => void;
	};

	interface Props {
		homeHref?: string;
	}

	const MUSIC_BG = "/portfolio/music-bg.png";

	let { homeHref = "/" }: Props = $props();

	let playlist = $state<Track[]>([]);
	let currentIndex = $state(0);
	let isPlaying = $state(false);
	let playMode = $state(0);
	let ready = $state(false);
	let loading = $state(true);
	let errorMsg = $state("");
	let query = $state("");
	let favKeys = $state<string[]>([]);
	let lyrics = $state<LyricLine[]>([]);
	let lrcIndex = $state(-1);
	let progress = $state(0);
	let timeStr = $state("0:00");
	let durStr = $state("0:00");
	let mobileTab = $state<"list" | "lrc">("list");
	let menuOpen = $state(false);

	let api: MusicApi | null = null;
	let unsubs: Array<() => void> = [];
	let lrcViewport: HTMLDivElement | undefined;
	let searchInput: HTMLInputElement | undefined;

	function trackHaystack(t: Track) {
		return `${t.name || ""} ${t.artist || ""}`.toLowerCase();
	}

	function matchesQuery(t: Track, raw: string) {
		const tokens = raw
			.trim()
			.toLowerCase()
			.split(/\s+/)
			.filter(Boolean);
		if (!tokens.length) return true;
		const hay = trackHaystack(t);
		return tokens.every((tok) => hay.includes(tok));
	}

	const filtered = $derived(
		playlist.map((t, i) => ({ t, i })).filter(({ t }) => matchesQuery(t, query)),
	);
	const filterActive = $derived(query.trim().length > 0);

	const now = $derived(playlist[currentIndex] ?? null);
	const cover = $derived(now?.pic || now?.cover || "");
	const modeLabel = $derived(
		playMode === 1 ? "单曲循环" : playMode === 2 ? "随机播放" : "列表循环",
	);
	const liked = $derived(isFav(now, favKeys));

	function syncFromApi() {
		if (!api) return;
		const s = api.getState();
		playlist = s.playlist || [];
		currentIndex = s.currentIndex ?? 0;
		isPlaying = !!s.isPlaying;
		playMode = s.playMode ?? 0;
		ready = !!s.initialized;
		lyrics = s.lyrics || [];
		lrcIndex = s.currentLrcIndex ?? -1;
		progress = s.progress ?? 0;
		timeStr = s.currentTimeStr || "0:00";
		durStr = s.durationStr || "0:00";
		if (s.error) errorMsg = String(s.error);
		loading = !s.initialized && playlist.length === 0;
	}

	function on(name: string, fn: (e: CustomEvent) => void) {
		const handler = (e: Event) => fn(e as CustomEvent);
		window.addEventListener(name, handler);
		unsubs.push(() => window.removeEventListener(name, handler));
	}

	async function scrollLyrics() {
		await tick();
		if (typeof window === "undefined" || !lrcViewport) return;
		const active = lrcViewport.querySelector<HTMLElement>(".is-current");
		if (!active) return;
		const top =
			active.offsetTop - lrcViewport.clientHeight * 0.42 + active.clientHeight / 2;
		lrcViewport.scrollTo({
			top: Math.max(0, top),
			behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
				? "auto"
				: "smooth",
		});
	}

	onMount(() => {
		if (typeof document !== "undefined") {
			document.documentElement.classList.add("folio-music-immerse");
		}
		favKeys = loadFavs();
		api = (window as unknown as { __fireflyMusic?: MusicApi }).__fireflyMusic ?? null;
		if (!api) {
			loading = false;
			errorMsg = "播放器未就绪，请刷新页面。";
			return;
		}

		on("fm:init", () => {
			ready = true;
			loading = false;
			syncFromApi();
			if (!playlist.length) errorMsg = "歌单为空，请在 musicConfig 中配置歌单。";
		});
		on("fm:track", () => {
			syncFromApi();
			menuOpen = false;
		});
		on("fm:play-state", (e) => {
			isPlaying = !!e.detail?.isPlaying;
		});
		on("fm:mode", (e) => {
			playMode = e.detail?.playMode ?? 0;
		});
		on("fm:time", (e) => {
			progress = e.detail?.progress ?? 0;
			timeStr = e.detail?.currentTimeStr || "0:00";
			durStr = e.detail?.durationStr || "0:00";
		});
		on("fm:lyrics", (e) => {
			lyrics = e.detail?.lyrics || [];
			lrcIndex = -1;
			void scrollLyrics();
		});
		on("fm:lrc-index", (e) => {
			lrcIndex = e.detail?.index ?? -1;
			void scrollLyrics();
		});
		on("fm:error", (e) => {
			errorMsg = e.detail?.message || "加载失败";
			loading = false;
		});

		void Promise.resolve(api.init()).finally(() => {
			syncFromApi();
			loading = false;
		});
	});

	onDestroy(() => {
		if (typeof document !== "undefined") {
			document.documentElement.classList.remove("folio-music-immerse");
		}
		for (const off of unsubs) off();
		unsubs = [];
	});

	function selectTrack(i: number) {
		if (!api || !ready) return;
		if (i === currentIndex) {
			api.togglePlay();
			return;
		}
		api.playTrackByIndex(i);
		if (typeof window !== "undefined" && window.innerWidth < 900) {
			mobileTab = "lrc";
		}
	}

	function seekFromEvent(e: PointerEvent) {
		if (!api) return;
		const el = e.currentTarget as HTMLElement | null;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		api.seek(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
	}

	function lyricParts(text: string) {
		const raw = text.trim();
		if (!raw) return { main: "", sub: "" };
		const byBreak = raw.split(/\n+/);
		if (byBreak.length > 1) return { main: byBreak[0], sub: byBreak.slice(1).join(" ") };
		const bySlash = raw.split(/\s*\/\s*/);
		if (bySlash.length === 2) return { main: bySlash[0], sub: bySlash[1] };
		return { main: raw, sub: "" };
	}

	function clearQuery() {
		query = "";
		searchInput?.focus();
	}

	function onSearchKeydown(e: KeyboardEvent) {
		if (e.key === "Escape" && query) {
			e.preventDefault();
			clearQuery();
		}
	}

	async function focusSearch() {
		mobileTab = "list";
		await tick();
		searchInput?.focus();
		searchInput?.select();
	}
</script>

<section class="folio-music folio-music--immerse" aria-label="Music player">
	<div class="folio-music-bg" aria-hidden="true">
		<img src={MUSIC_BG} alt="" class="folio-music-bg-img" />
		{#if cover}
			<div class="folio-music-bg-accent" style={`background-image:url('${cover}')`}></div>
		{/if}
		<div class="folio-music-bg-shade"></div>
	</div>

	<a class="folio-music-back" href={homeHref}>←</a>

	<div class="folio-music-mobile-bar">
		<div class="folio-music-tabs" role="tablist" aria-label="视图">
			<button
				type="button"
				role="tab"
				class:is-on={mobileTab === "list"}
				aria-selected={mobileTab === "list"}
				onclick={() => (mobileTab = "list")}
			>歌单</button>
			<button
				type="button"
				role="tab"
				class:is-on={mobileTab === "lrc"}
				aria-selected={mobileTab === "lrc"}
				onclick={() => (mobileTab = "lrc")}
			>歌词</button>
		</div>
		<button
			type="button"
			class="folio-music-search-btn"
			aria-label="搜索歌单"
			onclick={() => void focusSearch()}
		>搜</button>
	</div>

	<div class="folio-music-stage" data-tab={mobileTab}>
		<aside
			class="folio-music-rail"
			class:is-show={mobileTab === "list"}
			aria-label="Playlist"
		>
			<div class="folio-music-search">
				<label class="folio-music-search-field">
					<span class="sr-only">在歌单内搜索</span>
					<input
						bind:this={searchInput}
						type="search"
						placeholder="搜曲名 / 艺人"
						autocomplete="off"
						autocapitalize="off"
						spellcheck="false"
						enterkeyhint="search"
						bind:value={query}
						onkeydown={onSearchKeydown}
					/>
				</label>
				{#if filterActive}
					<button
						type="button"
						class="folio-music-search-clear"
						aria-label="清空搜索"
						onclick={clearQuery}
					>清除</button>
				{/if}
				{#if playlist.length > 0}
					<span class="folio-music-search-meta" aria-live="polite">
						{filterActive
							? `${filtered.length}/${playlist.length}`
							: `${playlist.length} 首`}
					</span>
				{/if}
			</div>

			{#if loading}
				<p class="folio-music-status">正在载入歌单…</p>
			{:else if errorMsg && !playlist.length}
				<p class="folio-music-status">{errorMsg}</p>
			{:else if !filtered.length}
				<p class="folio-music-status"
					>{filterActive ? "没有匹配的曲子" : "暂无曲目"}</p
				>
			{:else}
				<ul class="folio-music-pills">
					{#each filtered as { t, i } (i)}
						{@const active = i === currentIndex}
						<li>
							<div
								class="folio-music-pill"
								class:is-active={active}
								class:is-playing={active && isPlaying}
							>
								{#if active}
									<div class="folio-music-pill-active">
										<button
											type="button"
											class="folio-music-pill-hit"
											onclick={() => selectTrack(i)}
											disabled={!ready}
										>
											{#if t.pic || t.cover}
												<img
													class="folio-music-pill-cover"
													src={t.pic || t.cover}
													alt=""
													loading="lazy"
												/>
											{:else}
												<span
													class="folio-music-pill-cover folio-music-pill-cover--empty"
												></span>
											{/if}
											<span class="folio-music-pill-body">
												<span class="folio-music-pill-row">
													<span class="folio-music-pill-name"
													>{t.name || "Untitled"}</span
													>
													<span class="folio-music-pill-time"
													>{timeStr} / {durStr}</span
													>
												</span>
												<span
													class="folio-music-pill-bar"
													role="slider"
													tabindex="0"
													aria-label="进度"
													aria-valuemin="0"
													aria-valuemax="100"
													aria-valuenow={Math.round(progress)}
													onpointerdown={(e) => {
														e.stopPropagation();
														(e.currentTarget as HTMLElement).setPointerCapture(
															e.pointerId,
														);
														seekFromEvent(e);
													}}
													onpointermove={(e) =>
														e.buttons && seekFromEvent(e)}
													onclick={(e) => e.stopPropagation()}
												>
													<span
														class="folio-music-pill-bar-fill"
														style={`width:${progress}%`}
													></span>
												</span>
											</span>
										</button>
										<div class="folio-music-pill-actions">
											<button
												type="button"
												class="folio-music-pill-more"
												aria-label="更多"
												aria-expanded={menuOpen}
												onclick={() => (menuOpen = !menuOpen)}
											>
												<span></span><span></span><span></span>
											</button>
											{#if menuOpen}
												<div class="folio-music-menu" role="menu">
													<button
														type="button"
														role="menuitem"
														onclick={() => api?.togglePlay()}
													>
														{isPlaying ? "暂停" : "播放"}
													</button>
													<button
														type="button"
														role="menuitem"
														onclick={() => api?.playPrev()}
													>上一首</button>
													<button
														type="button"
														role="menuitem"
														onclick={() => api?.playNext()}
													>下一首</button>
													<button
														type="button"
														role="menuitem"
														onclick={() => api?.cyclePlayMode()}
													>{modeLabel}</button>
													<button
														type="button"
														role="menuitem"
														class:is-on={liked}
														onclick={() => {
															if (!now) return;
															favKeys = toggleFav(now);
														}}
													>
														{liked ? "取消收藏" : "收藏"}
													</button>
												</div>
											{/if}
										</div>
									</div>
								{:else}
									<button
										type="button"
										class="folio-music-pill-hit folio-music-pill-hit--idle"
										onclick={() => selectTrack(i)}
										disabled={!ready}
									>
										{#if t.pic || t.cover}
											<img
												class="folio-music-pill-cover"
												src={t.pic || t.cover}
												alt=""
												loading="lazy"
											/>
										{:else}
											<span
												class="folio-music-pill-cover folio-music-pill-cover--empty"
											></span>
										{/if}
										<span class="folio-music-pill-copy">
											<span class="folio-music-pill-name"
												>{t.name || "Untitled"}</span
											>
											{#if t.artist}
												<span class="folio-music-pill-artist">{t.artist}</span>
											{/if}
										</span>
									</button>
								{/if}
							</div>
						</li>
					{/each}
				</ul>
			{/if}
		</aside>

		<div
			class="folio-music-lyrics"
			class:is-show={mobileTab === "lrc"}
			bind:this={lrcViewport}
			aria-live="polite"
		>
			{#if now}
				<div class="folio-music-lrc-meta">
					<p class="folio-music-lrc-title">{now.name || "Untitled"}</p>
					<p class="folio-music-lrc-artist">{now.artist || "Unknown"}</p>
				</div>
			{/if}
			<div class="folio-music-lyrics-inner">
				{#if lyrics.length}
					{#each lyrics as line, i}
						{@const parts = lyricParts(line.text)}
						<p class="folio-music-lrc-line" class:is-current={i === lrcIndex}>
							<span class="folio-music-lrc-main">{parts.main}</span>
							{#if parts.sub}
								<span class="folio-music-lrc-sub">{parts.sub}</span>
							{/if}
						</p>
					{/each}
				{:else}
					<p class="folio-music-lrc-empty">
						{loading ? "…" : now ? "暂无歌词" : "选一首歌开始"}
					</p>
				{/if}
			</div>
		</div>
	</div>

	<footer class="folio-music-foot">
		<span>Music · Jason</span>
		<a href={homeHref}>回首页留声</a>
	</footer>

	<button
		type="button"
		class="folio-music-float-play"
		aria-label={isPlaying ? "暂停" : "播放"}
		onclick={() => api?.togglePlay()}
		disabled={!ready}
	>
		{#if isPlaying}
			<span class="folio-music-float-icon is-pause" aria-hidden="true"></span>
		{:else}
			<span class="folio-music-float-icon is-play" aria-hidden="true"></span>
		{/if}
	</button>
</section>
