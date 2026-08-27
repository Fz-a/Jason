<script lang="ts">
	import { onMount } from "svelte";
	import { downloadFolioMedia, type FolioMediaItem } from "@/utils/folio-media";

	type MediaItem = FolioMediaItem;

	let items = $state<MediaItem[]>([]);
	let error = $state("");
	let toast = $state("");
	let uploading = $state(false);
	let ready = $state(false);

	async function ensureAuth() {
		const res = await fetch("/api/auth/me/");
		const data = (await res.json()) as { authenticated?: boolean };
		if (!data.authenticated) {
			window.location.assign("/admin/login/");
			return false;
		}
		return true;
	}

	async function load() {
		const res = await fetch("/api/media/");
		if (res.status === 401) {
			window.location.assign("/admin/login/");
			return;
		}
		const data = (await res.json()) as { items?: MediaItem[]; error?: string };
		if (!res.ok) {
			error = data.error || "Failed to load media";
			return;
		}
		items = data.items ?? [];
	}

	onMount(async () => {
		if (!(await ensureAuth())) return;
		await load();
		ready = true;
	});

	async function onUpload(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		input.value = "";
		if (!file) return;
		error = "";
		uploading = true;
		try {
			const form = new FormData();
			form.append("file", file);
			const res = await fetch("/api/media/", { method: "POST", body: form });
			const data = (await res.json()) as { error?: string; media?: MediaItem };
			if (!res.ok) {
				error = data.error || "Upload failed";
				return;
			}
			toast = "Uploaded";
			window.setTimeout(() => (toast = ""), 2000);
			await load();
		} catch {
			error = "Network error";
		} finally {
			uploading = false;
		}
	}

	async function copyUrl(url: string) {
		try {
			await navigator.clipboard.writeText(url);
			toast = "URL copied";
			window.setTimeout(() => (toast = ""), 2000);
		} catch {
			toast = url;
		}
	}

	async function downloadItem(item: MediaItem) {
		const ok = await downloadFolioMedia(item);
		toast = ok ? "Download started" : "Download failed";
		window.setTimeout(() => (toast = ""), 2000);
	}
</script>

{#if ready}
	<nav class="cms-nav">
		<a href="/admin/">Dashboard</a>
		<a href="/admin/media/">Media</a>
		<a href="/">Site</a>
	</nav>

	<div class="cms-card">
		<h1 class="cms-title">相册库</h1>
		<p class="cms-note">JPEG / PNG / WebP / GIF · max 5MB. 编辑时上传的图片会集中保存在这里。</p>

		<label class="cms-btn cms-btn-primary" style="display:inline-flex; cursor:pointer">
			{uploading ? "Uploading…" : "Upload image"}
			<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden onchange={onUpload} />
		</label>

		{#if error}
			<p class="cms-error" style="margin-top:0.85rem">{error}</p>
		{/if}

		{#if items.length === 0}
			<p class="cms-note" style="margin-top:1rem">No uploads yet.</p>
		{:else}
			<div class="cms-media-grid" style="margin-top:1rem">
				{#each items as item}
					<div class="cms-media-item">
						<img src={item.url} alt="" loading="lazy" />
						<div class="cms-media-item-actions">
							<button type="button" onclick={() => copyUrl(item.url)}>Copy URL</button>
							<button type="button" onclick={() => void downloadItem(item)}>Download</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
{/if}

{#if toast}
	<p class="cms-note" role="status">{toast}</p>
{/if}
