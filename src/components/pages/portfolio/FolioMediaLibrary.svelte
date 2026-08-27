<script lang="ts">
	import { onMount } from "svelte";
	import {
		downloadFolioMedia,
		type FolioMediaItem,
	} from "@/utils/folio-media";

	interface Props {
		open?: boolean;
		title?: string;
		hint?: string;
		selectable?: boolean;
		onSelect?: (item: FolioMediaItem) => void;
		onClose?: () => void;
		onFlash?: (msg: string) => void;
	}

	let {
		open = true,
		title = "相册库",
		hint = "上传的图片会集中保存在这里，可复用或下载。",
		selectable = true,
		onSelect,
		onClose,
		onFlash,
	}: Props = $props();

	let items = $state<FolioMediaItem[]>([]);
	let loading = $state(false);
	let uploading = $state(false);
	let error = $state("");

	async function load() {
		loading = true;
		error = "";
		try {
			const res = await fetch("/api/media/");
			const data = (await res.json()) as {
				items?: FolioMediaItem[];
				error?: string;
			};
			if (!res.ok) {
				error = data.error || "无法加载相册库";
				items = [];
				return;
			}
			items = data.items ?? [];
		} catch {
			error = "无法加载相册库";
			items = [];
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		if (open) void load();
	});

	$effect(() => {
		if (open) void load();
	});

	function flash(msg: string) {
		onFlash?.(msg);
	}

	async function onUpload(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		input.value = "";
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			flash("请选择图片文件");
			return;
		}
		uploading = true;
		error = "";
		try {
			const form = new FormData();
			form.append("file", file);
			const res = await fetch("/api/media/", { method: "POST", body: form });
			const data = (await res.json()) as {
				error?: string;
				media?: FolioMediaItem;
			};
			if (!res.ok) {
				error = data.error || "上传失败";
				return;
			}
			flash("已加入相册库");
			await load();
			if (selectable && data.media) onSelect?.(data.media);
		} catch {
			error = "上传失败";
		} finally {
			uploading = false;
		}
	}

	function pick(item: FolioMediaItem) {
		if (!selectable) return;
		onSelect?.(item);
	}

	async function download(item: FolioMediaItem, e?: MouseEvent) {
		e?.stopPropagation();
		e?.preventDefault();
		const ok = await downloadFolioMedia(item);
		flash(ok ? "已开始下载" : "下载失败，请重试");
	}
</script>

{#if open}
	<div class="folio-media-lib" role="dialog" aria-label={title}>
		<div class="folio-media-lib-head">
			<div class="folio-media-lib-title">
				<span>{title}</span>
				{#if hint}
					<p class="folio-media-lib-hint">{hint}</p>
				{/if}
			</div>
			<div class="folio-media-lib-actions">
				<label class="folio-btn folio-btn-ghost folio-media-lib-upload">
					{uploading ? "上传中…" : "上传"}
					<input
						type="file"
						accept="image/jpeg,image/png,image/webp,image/gif"
						hidden
						onchange={onUpload}
					/>
				</label>
				{#if onClose}
					<button type="button" class="folio-btn folio-btn-ghost" onclick={() => onClose?.()}>
						完成
					</button>
				{/if}
			</div>
		</div>

		{#if loading}
			<p class="folio-media-lib-status">加载中…</p>
		{:else if error}
			<p class="folio-media-lib-status is-error">{error}</p>
		{:else if items.length === 0}
			<p class="folio-media-lib-status">相册库为空，请先上传图片。</p>
		{:else}
			<div class="folio-media-lib-grid">
				{#each items as item (item.id)}
					<div class="folio-media-lib-card">
						{#if selectable}
							<button
								type="button"
								class="folio-media-lib-pick"
								onclick={() => pick(item)}
								aria-label="选用此图"
							>
								<img src={item.url} alt="" loading="lazy" />
							</button>
						{:else}
							<div class="folio-media-lib-pick is-static">
								<img src={item.url} alt="" loading="lazy" />
							</div>
						{/if}
						<button
							type="button"
							class="folio-media-lib-download"
							title="下载"
							aria-label="下载图片"
							onclick={(e) => void download(item, e)}
						>
							↓
						</button>
					</div>
				{/each}
			</div>
			<p class="folio-media-lib-foot">
				{selectable ? "点击选用 · " : ""}共 {items.length} 张
			</p>
		{/if}
	</div>
{/if}
