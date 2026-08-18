<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { isFav, loadFavs, toggleFav } from "@/utils/folio-music-favs";

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
			initialized: boolean;
			error?: string | null;
		};
		playTrackByIndex: (i: number) => void;
		togglePlay: () => void;
	};

	interface Props {
		homeHref?: string;
	}

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

	let api: MusicApi | null = null;
	let unsubs: Array<() => void> = [];

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

	const now = $derived(playlist[currentIndex] ?? null);

	function syncFromApi() {
		if (!api) return;
		const s = api.getState();
		playlist = s.playlist || [];
		currentIndex = s.currentIndex ?? 0;
		isPlaying = !!s.isPlaying;
		playMode = s.playMode ?? 0;
		ready = !!s.initialized;
		if (s.error) errorMsg = String(s.error);
		loading = !s.initialized && playlist.length === 0;
	}

	function on(name: string, fn: (e: CustomEvent) => void) {
		const handler = (e: Event) => fn(e as CustomEvent);
		window.addEventListener(name, handler);
		unsubs.push(() => window.removeEventListener(name, handler));
	}

	onMount(() => {
		favKeys = loadFavs();
		api = (window as unknown as { __fireflyMusic?: MusicApi }).__fireflyMusic ?? null;
		if (!api) {
			loading = false;
			errorMsg = "播放器未就绪，请刷新页面。";
			return;
		}

		on("fm:init", (e) => {
			playlist = e.detail?.playlist || [];
			playMode = e.detail?.playMode ?? 0;
			ready = true;
			loading = false;
			if (!playlist.length) errorMsg = "歌单为空，请在 musicConfig 中配置歌单。";
			syncFromApi();
		});
		on("fm:track", () => syncFromApi());
		on("fm:play-state", (e) => {
			isPlaying = !!e.detail?.isPlaying;
		});
		on("fm:mode", (e) => {
			playMode = e.detail?.playMode ?? 0;
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
		for (const off of unsubs) off();
		unsubs = [];
	});

	function selectTrack(i: number) {
		api?.playTrackByIndex(i);
	}

	function starTrack(e: MouseEvent, t: Track) {
		e.stopPropagation();
		favKeys = toggleFav(t);
	}
</script>

<section class="folio-music folio-music--library" aria-label="Music library">
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

	<div class="folio-music-manage folio-tile">
		<div class="folio-music-banner">
			<div>
				<p class="folio-music-banner-kicker">正在管理</p>
				{#if now}
					<strong class="folio-music-banner-title">{now.name || "Untitled"}</strong>
					<p class="folio-music-banner-meta">
						{now.artist || "Unknown"}
						·
						{isPlaying ? "播放中" : "已选定"}
						·
						{modeLabel}
					</p>
				{:else}
					<strong class="folio-music-banner-title">歌单库</strong>
					<p class="folio-music-banner-meta">点选曲目后，回首页用留声机播放</p>
				{/if}
			</div>
			<a class="folio-music-to-bells" href={homeHref}>回首页留声</a>
		</div>

		<div class="folio-music-lib-head">
			<h2>全部曲目</h2>
			<label class="folio-music-search">
				<span class="sr-only">搜索</span>
				<input type="search" placeholder="搜索曲名 / 艺人" bind:value={query} />
			</label>
		</div>

		{#if loading}
			<p class="folio-music-status">正在载入歌单…</p>
		{:else if errorMsg && !playlist.length}
			<p class="folio-music-status">{errorMsg}</p>
			<p class="folio-music-hint">
				在 <code>src/config/musicConfig.ts</code> 修改网易云歌单 ID，或改用本地
				<code>public/assets/music/</code>。
			</p>
		{:else if !filtered.length}
			<p class="folio-music-status">{query ? "没有匹配的曲子" : "暂无曲目"}</p>
		{:else}
			<ul class="folio-music-list folio-music-list--wide" role="listbox" aria-label="Playlist">
				{#each filtered as { t, i } (i)}
					<li>
						<div
							class="folio-music-item"
							class:is-active={i === currentIndex}
							class:is-playing={i === currentIndex && isPlaying}
						>
							<button
								type="button"
								class="folio-music-pick"
								onclick={() => selectTrack(i)}
								disabled={!ready}
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
							</button>
							<button
								type="button"
								class="folio-music-fav"
								class:is-on={isFav(t, favKeys)}
								onclick={(e) => starTrack(e, t)}
								aria-label={isFav(t, favKeys) ? "取消收藏" : "加入偏好"}
								title={isFav(t, favKeys) ? "取消收藏" : "加入偏好"}
							>
								藏
							</button>
							{#if i === currentIndex && isPlaying}
								<span class="folio-music-eq" aria-hidden="true"><i></i><i></i><i></i></span>
							{:else if i === currentIndex}
								<span class="folio-music-picked">当前</span>
							{/if}
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</section>
