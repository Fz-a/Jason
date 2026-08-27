<script lang="ts">
	import {
		collageHasImage,
		createCollage,
		defaultLayoutForCount,
		FOLIO_COLLAGE_COUNTS,
		getCollageLayout,
		layoutsForCount,
		resizeCells,
	} from "@/lib/folio/collage-layouts";
	import FolioMediaLibrary from "@/components/pages/portfolio/FolioMediaLibrary.svelte";
	import type { FolioCollage, FolioCollageCell } from "@/types/folioTree";
	import { downloadFolioMedia } from "@/utils/folio-media";

	interface Props {
		collage?: FolioCollage;
		editable?: boolean;
		onChange?: (next: FolioCollage | undefined) => void;
		onFlash?: (msg: string) => void;
	}

	let { collage, editable = false, onChange, onFlash }: Props = $props();

	type EditMode = "fill" | "focus";

	let mode = $state<EditMode>("fill");
	let activeCell = $state<number | null>(null);
	let uploading = $state(false);
	let posDragging = $state(false);
	let dropOver = $state<number | "frame" | null>(null);
	let mediaOpen = $state(false);
	let fileInput: HTMLInputElement | undefined = $state();
	let multiInput: HTMLInputElement | undefined = $state();
	/** When set, next file pick fills this cell; null = fill empties from start */
	let pickTarget = $state<number | null>(null);

	const layout = $derived(getCollageLayout(collage?.layout));
	const showMosaic = $derived(!!collage && (!!editable || collageHasImage(collage)));
	const countOptions = FOLIO_COLLAGE_COUNTS;
	const layoutOptions = $derived(layoutsForCount(layout?.count ?? 3));
	const filledCount = $derived(collage?.cells.filter((c) => c.src).length ?? 0);
	const emptyCount = $derived(
		collage ? collage.cells.length - filledCount : 0,
	);

	function cellLetter(i: number) {
		return String.fromCharCode(97 + i);
	}

	function emit(next: FolioCollage | undefined) {
		onChange?.(next);
	}

	function flash(msg: string) {
		onFlash?.(msg);
	}

	function startCollage() {
		emit(createCollage(3));
		activeCell = 0;
		mode = "fill";
	}

	function clearCollage() {
		if (!confirm("清空整块拼图？")) return;
		emit(undefined);
		activeCell = null;
		mediaOpen = false;
	}

	function setCount(count: number) {
		if (!collage) return;
		const nextLayout = defaultLayoutForCount(count);
		emit({
			layout: nextLayout.id,
			cells: resizeCells(collage.cells, nextLayout.count),
		});
		activeCell = null;
	}

	function setLayout(id: string) {
		if (!collage) return;
		const nextLayout = getCollageLayout(id);
		if (!nextLayout) return;
		emit({
			layout: nextLayout.id,
			cells: resizeCells(collage.cells, nextLayout.count),
		});
	}

	function patchCell(index: number, patch: Partial<FolioCollageCell>) {
		if (!collage) return;
		const cells = collage.cells.map((c, i) =>
			i === index ? { ...c, ...patch } : c,
		);
		emit({ ...collage, cells });
	}

	function patchCells(updater: (cells: FolioCollageCell[]) => FolioCollageCell[]) {
		if (!collage) return;
		emit({ ...collage, cells: updater(collage.cells.map((c) => ({ ...c }))) });
	}

	function clearCell(index: number) {
		patchCell(index, { src: "", pos: undefined });
	}

	function swapCells(a: number, b: number) {
		if (!collage || a === b) return;
		patchCells((cells) => {
			const tmp = cells[a];
			cells[a] = cells[b];
			cells[b] = tmp;
			return cells;
		});
		activeCell = b;
	}

	function parsePos(raw: string | undefined): { x: number; y: number } {
		const m = (raw || "50% 50%").match(/([\d.]+)\s*%\s+([\d.]+)\s*%/);
		if (!m) return { x: 50, y: 50 };
		return {
			x: Math.min(100, Math.max(0, Number(m[1]))),
			y: Math.min(100, Math.max(0, Number(m[2]))),
		};
	}

	function formatPos(x: number, y: number) {
		return `${Math.round(x)}% ${Math.round(y)}%`;
	}

	function setPosFromPointer(index: number, e: PointerEvent) {
		const el = e.currentTarget as HTMLElement;
		const rect = el.getBoundingClientRect();
		if (rect.width <= 0 || rect.height <= 0) return;
		const x = ((e.clientX - rect.left) / rect.width) * 100;
		const y = ((e.clientY - rect.top) / rect.height) * 100;
		patchCell(index, {
			pos: formatPos(Math.min(100, Math.max(0, x)), Math.min(100, Math.max(0, y))),
		});
	}

	function onFocusPointerDown(index: number, e: PointerEvent) {
		if (!editable || mode !== "focus" || !collage?.cells[index]?.src) return;
		e.preventDefault();
		activeCell = index;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		posDragging = true;
		setPosFromPointer(index, e);
	}

	function onFocusPointerMove(index: number, e: PointerEvent) {
		if (!posDragging || activeCell !== index) return;
		setPosFromPointer(index, e);
	}

	function onFocusPointerUp(e: PointerEvent) {
		posDragging = false;
		try {
			(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
		} catch {
			/* ignore */
		}
	}

	function selectCell(index: number) {
		activeCell = index;
		if (!collage?.cells[index]?.src) mode = "fill";
	}

	function openSinglePick(index: number) {
		pickTarget = index;
		activeCell = index;
		mode = "fill";
		fileInput?.click();
	}

	function openBatchPick() {
		pickTarget = null;
		mode = "fill";
		multiInput?.click();
	}

	async function onSingleFile(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		input.value = "";
		const index = pickTarget ?? activeCell;
		if (index == null) return;
		await uploadFilesTo([index], file ? [file] : []);
	}

	async function onMultiFile(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const files = [...(input.files ?? [])].filter((f) => f.type.startsWith("image/"));
		input.value = "";
		if (!collage || files.length === 0) {
			flash("请选择图片文件");
			return;
		}
		const targets: number[] = [];
		for (let i = 0; i < collage.cells.length; i++) {
			if (!collage.cells[i].src) targets.push(i);
		}
		if (targets.length === 0) {
			flash("格子已满，请先清空或换图");
			return;
		}
		await uploadFilesTo(targets, files);
	}

	async function uploadOne(file: File): Promise<string | null> {
		const form = new FormData();
		form.append("file", file);
		const res = await fetch("/api/media/", { method: "POST", body: form });
		const data = (await res.json()) as {
			error?: string;
			media?: { url: string };
		};
		if (!res.ok) {
			flash(data.error || "上传失败");
			return null;
		}
		return data.media?.url || null;
	}

	async function uploadFilesTo(indices: number[], files: File[]) {
		if (!collage || files.length === 0) return;
		uploading = true;
		try {
			const n = Math.min(indices.length, files.length);
			const urls: (string | null)[] = [];
			for (let i = 0; i < n; i++) {
				urls.push(await uploadOne(files[i]));
			}
			patchCells((cells) => {
				for (let i = 0; i < n; i++) {
					const url = urls[i];
					if (!url) continue;
					cells[indices[i]] = { src: url, pos: "50% 50%" };
				}
				return cells;
			});
			const ok = urls.filter(Boolean).length;
			if (ok > 0) {
				activeCell = indices[Math.min(ok - 1, indices.length - 1)];
				flash(ok === 1 ? "已添加图片" : `已添加 ${ok} 张`);
			}
		} catch {
			flash("上传失败");
		} finally {
			uploading = false;
		}
	}

	function onDragOver(e: DragEvent, target: number | "frame") {
		if (!editable) return;
		e.preventDefault();
		dropOver = target;
	}

	function onDragLeave(target: number | "frame") {
		if (dropOver === target) dropOver = null;
	}

	async function onDrop(e: DragEvent, target: number | "frame") {
		if (!editable || !collage) return;
		e.preventDefault();
		dropOver = null;
		const files = [...(e.dataTransfer?.files ?? [])].filter((f) =>
			f.type.startsWith("image/"),
		);
		if (files.length === 0) {
			flash("请拖入图片文件");
			return;
		}
		mode = "fill";
		if (target === "frame") {
			const empties: number[] = [];
			for (let i = 0; i < collage.cells.length; i++) {
				if (!collage.cells[i].src) empties.push(i);
			}
			const indices =
				empties.length > 0
					? empties
					: Array.from({ length: collage.cells.length }, (_, i) => i);
			await uploadFilesTo(indices, files);
			return;
		}
		await uploadFilesTo([target], files.slice(0, 1));
	}

	async function openMediaPicker(index?: number) {
		if (index != null) activeCell = index;
		if (activeCell == null && collage) {
			const empty = collage.cells.findIndex((c) => !c.src);
			activeCell = empty >= 0 ? empty : 0;
		}
		mediaOpen = true;
		mode = "fill";
	}

	function pickMedia(url: string) {
		if (!collage) return;
		let index = activeCell;
		if (index == null || collage.cells[index]?.src) {
			const empty = collage.cells.findIndex((c) => !c.src);
			index = empty >= 0 ? empty : (activeCell ?? 0);
		}
		patchCell(index, { src: url, pos: "50% 50%" });
		activeCell = index;
		flash("已从相册库填入");
	}

	async function downloadCell(index: number) {
		const src = collage?.cells[index]?.src;
		if (!src) return;
		const ok = await downloadFolioMedia({ url: src });
		flash(ok ? "已开始下载" : "下载失败，请重试");
	}

	function onCellDragStart(index: number, e: DragEvent) {
		if (!editable || mode !== "fill" || !collage?.cells[index]?.src) {
			e.preventDefault();
			return;
		}
		e.dataTransfer?.setData("text/folio-collage-cell", String(index));
		e.dataTransfer!.effectAllowed = "move";
	}

	function onCellDropSwap(index: number, e: DragEvent) {
		if (!editable) return;
		e.preventDefault();
		e.stopPropagation();
		dropOver = null;
		const raw = e.dataTransfer?.getData("text/folio-collage-cell");
		if (raw) {
			const from = Number(raw);
			if (Number.isFinite(from)) {
				swapCells(from, index);
				flash("已交换格子");
				return;
			}
		}
		void onDrop(e, index);
	}
</script>

<input
	bind:this={fileInput}
	type="file"
	accept="image/*"
	hidden
	onchange={onSingleFile}
/>
<input
	bind:this={multiInput}
	type="file"
	accept="image/*"
	multiple
	hidden
	onchange={onMultiFile}
/>

{#if !collage && editable}
	<div
		class="folio-collage-empty"
		class:is-drop={dropOver === "frame"}
		role="region"
		ondragover={(e) => onDragOver(e, "frame")}
		ondragleave={() => onDragLeave("frame")}
		ondrop={(e) => void onDrop(e, "frame")}
	>
		<div class="folio-collage-empty-text">
			<p class="folio-collage-empty-copy">添加 16:9 拼图</p>
			<p class="folio-collage-empty-sub">可选版式，再批量拖入或上传图片</p>
		</div>
		<button type="button" class="folio-btn" onclick={startCollage}>开始编排</button>
	</div>
{:else if showMosaic && layout && collage}
	<section class="folio-collage" class:is-editing={editable} aria-label="拼图">
		{#if editable}
			<div class="folio-collage-toolbar">
				<div class="folio-collage-toolbar-primary">
					<button
						type="button"
						class="folio-btn"
						disabled={uploading || emptyCount === 0}
						onclick={openBatchPick}
					>
						{uploading ? "上传中…" : emptyCount > 0 ? `批量添加（空 ${emptyCount}）` : "格子已满"}
					</button>
					<button
						type="button"
						class="folio-btn folio-btn-ghost"
						onclick={() => void openMediaPicker()}
					>
						从相册库填
					</button>
					<div class="folio-collage-mode" role="group" aria-label="编辑模式">
						<button
							type="button"
							class="folio-collage-chip"
							class:is-on={mode === "fill"}
							onclick={() => (mode = "fill")}
						>
							填图
						</button>
						<button
							type="button"
							class="folio-collage-chip"
							class:is-on={mode === "focus"}
							onclick={() => (mode = "focus")}
						>
							调焦
						</button>
					</div>
				</div>

				<div class="folio-collage-toolbar-row" role="group" aria-label="张数">
					<span class="folio-collage-label">张数</span>
					{#each countOptions as n}
						<button
							type="button"
							class="folio-collage-chip"
							class:is-on={layout.count === n}
							onclick={() => setCount(n)}
						>
							{n}
						</button>
					{/each}
					<span class="folio-collage-status">{filledCount}/{layout.count} 已填</span>
				</div>

				<div class="folio-collage-toolbar-row" role="group" aria-label="版式">
					<span class="folio-collage-label">版式</span>
					<div class="folio-collage-layouts">
						{#each layoutOptions as opt}
							<button
								type="button"
								class="folio-collage-layout-btn"
								class:is-on={collage.layout === opt.id}
								title={opt.label}
								aria-label={opt.label}
								onclick={() => setLayout(opt.id)}
							>
								<span
									class="folio-collage-layout-thumb"
									style={`grid-template-columns:${opt.columns};grid-template-rows:${opt.rows};grid-template-areas:${opt.areas}`}
									aria-hidden="true"
								>
									{#each Array.from({ length: opt.count }, (_, i) => cellLetter(i)) as letter}
										<span style={`grid-area:${letter}`}></span>
									{/each}
								</span>
								<span class="folio-collage-layout-name">{opt.label}</span>
							</button>
						{/each}
					</div>
				</div>

				<div class="folio-collage-toolbar-row folio-collage-toolbar-actions">
					<button type="button" class="folio-btn folio-btn-ghost" onclick={clearCollage}>
						清空拼图
					</button>
					<p class="folio-collage-hint">
						{#if mode === "fill"}
							拖图片到格子，或批量上传；格子之间可拖拽交换。
						{:else}
							在有图的格子上拖动，调整裁切焦点。
						{/if}
					</p>
				</div>
			</div>
		{/if}

		<div
			class="folio-collage-frame"
			class:is-drop={dropOver === "frame"}
			style={`grid-template-columns:${layout.columns};grid-template-rows:${layout.rows};grid-template-areas:${layout.areas}`}
			ondragover={(e) => onDragOver(e, "frame")}
			ondragleave={() => onDragLeave("frame")}
			ondrop={(e) => void onDrop(e, "frame")}
		>
			{#each collage.cells as cell, i}
				{@const letter = cellLetter(i)}
				{@const focus = parsePos(cell.pos)}
				<div
					class="folio-collage-cell"
					class:is-active={editable && activeCell === i}
					class:is-empty={!cell.src}
					class:is-drop={dropOver === i}
					style={`grid-area:${letter}`}
					ondragover={(e) => onDragOver(e, i)}
					ondragleave={() => onDragLeave(i)}
					ondrop={(e) => onCellDropSwap(i, e)}
				>
					{#if cell.src}
						<div
							class="folio-collage-cell-hit"
							class:is-focus-mode={editable && mode === "focus"}
							role="button"
							tabindex={editable ? 0 : -1}
							aria-label={
								editable
									? mode === "focus"
										? `格子 ${i + 1}，拖动调焦`
										: `格子 ${i + 1}，点击选中`
									: `拼图 ${i + 1}`
							}
							draggable={editable && mode === "fill"}
							onpointerdown={(e) => onFocusPointerDown(i, e)}
							onpointermove={(e) => onFocusPointerMove(i, e)}
							onpointerup={onFocusPointerUp}
							onpointercancel={onFocusPointerUp}
							onclick={() => {
								if (!editable) return;
								if (mode === "fill") selectCell(i);
							}}
							ondragstart={(e) => onCellDragStart(i, e)}
							onkeydown={(e) => {
								if (!editable) return;
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									selectCell(i);
								}
							}}
						>
							<img
								src={cell.src}
								alt=""
								draggable="false"
								style={`object-position: ${cell.pos || "50% 50%"}`}
							/>
							{#if editable && mode === "focus" && activeCell === i}
								<span
									class="folio-collage-focus-dot"
									style={`left:${focus.x}%;top:${focus.y}%`}
								></span>
							{/if}
							{#if editable}
								<span class="folio-collage-cell-index">{i + 1}</span>
							{/if}
						</div>
					{:else if editable}
						<div class="folio-collage-cell-empty">
							<button
								type="button"
								class="folio-collage-cell-cta"
								onclick={() => openSinglePick(i)}
							>
								<span class="folio-collage-cell-cta-plus">+</span>
								<span>上传</span>
							</button>
							<button
								type="button"
								class="folio-collage-cell-cta is-ghost"
								onclick={() => void openMediaPicker(i)}
							>
								相册
							</button>
						</div>
					{:else}
						<span class="folio-collage-cell-blank" aria-hidden="true"></span>
					{/if}
				</div>
			{/each}
		</div>

		{#if editable && activeCell != null && collage.cells[activeCell]}
			{@const idx = activeCell}
			{@const cell = collage.cells[idx]}
			<div class="folio-collage-dock" role="toolbar" aria-label={`格子 ${idx + 1} 操作`}>
				<span class="folio-collage-dock-label">格子 {idx + 1}</span>
				{#if cell.src}
					<button type="button" class="folio-btn" onclick={() => openSinglePick(idx)}>
						换图
					</button>
					<button
						type="button"
						class="folio-btn folio-btn-ghost"
						onclick={() => void openMediaPicker(idx)}
					>
						相册换图
					</button>
					<button
						type="button"
						class="folio-btn folio-btn-ghost"
						onclick={() => void downloadCell(idx)}
					>
						下载
					</button>
					<button
						type="button"
						class="folio-btn folio-btn-ghost"
						onclick={() => {
							mode = "focus";
						}}
					>
						调焦
					</button>
					<button
						type="button"
						class="folio-btn folio-btn-danger"
						onclick={() => clearCell(idx)}
					>
						清除
					</button>
				{:else}
					<button type="button" class="folio-btn" onclick={() => openSinglePick(idx)}>
						上传图片
					</button>
					<button
						type="button"
						class="folio-btn folio-btn-ghost"
						onclick={() => void openMediaPicker(idx)}
					>
						从相册库选
					</button>
				{/if}
			</div>
		{/if}

		{#if mediaOpen}
			<FolioMediaLibrary
				open={mediaOpen}
				title="相册库"
				hint="点击选用 · 可连续点选多张，会优先填入空格。"
				onSelect={(item) => pickMedia(item.url)}
				onClose={() => (mediaOpen = false)}
				onFlash={flash}
			/>
		{/if}
	</section>
{/if}
