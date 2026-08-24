<script lang="ts">
	import { onMount } from "svelte";
	import FolioCollage from "@/components/pages/portfolio/FolioCollage.svelte";
	import FolderCover from "@/components/pages/portfolio/FolderCover.svelte";
	import type { FolioCollage as FolioCollageData, GalleryNode, GalleryNodeKind } from "@/types/folioTree";
	import {
		cloneGalleryNodes,
		findGalleryNode,
		removeGalleryAtPath,
		reorderGalleryChildren,
		updateGalleryAtPath,
	} from "@/utils/folio-tree";

	interface Props {
		sectionId: string;
		sectionLabel: string;
		homeHref: string;
		seedNodes: GalleryNode[];
	}

	let { sectionId, sectionLabel, homeHref, seedNodes }: Props = $props();

	type Panel = "none" | "create" | "edit" | "module";

	/** Start from config seed so first paint is never an empty flash. */
	let nodes = $state<GalleryNode[]>(cloneGalleryNodes(seedNodes));
	let path = $state<string[]>([]);
	let unlocked = $state(false);
	let panel = $state<Panel>("none");
	let targetId = $state<string | null>(null);
	let toast = $state("");
	let modalDrag = $state(false);
	let saving = $state(false);

	let draftKind = $state<GalleryNodeKind>("folder");
	let draftTitle = $state("");
	let draftSummary = $state("");
	let draftBody = $state("");
	let draftCover = $state("");
	let draftCoverPos = $state("50% 50%");
	let coverPosDragging = $state(false);
	let stageOn = $state(true);
	let navLock = false;
	let dragFrom = $state<number | null>(null);
	let dragOver = $state<number | null>(null);

	function parseCoverPos(raw: string | undefined): { x: number; y: number } {
		const m = (raw || "50% 50%").match(/([\d.]+)\s*%\s+([\d.]+)\s*%/);
		if (!m) return { x: 50, y: 50 };
		return {
			x: Math.min(100, Math.max(0, Number(m[1]))),
			y: Math.min(100, Math.max(0, Number(m[2]))),
		};
	}

	function formatCoverPos(x: number, y: number) {
		return `${Math.round(x)}% ${Math.round(y)}%`;
	}

	const draftCoverFocus = $derived(parseCoverPos(draftCoverPos));

	function setCoverPosFromPointer(e: PointerEvent) {
		const el = e.currentTarget as HTMLElement;
		const rect = el.getBoundingClientRect();
		if (rect.width <= 0 || rect.height <= 0) return;
		const x = ((e.clientX - rect.left) / rect.width) * 100;
		const y = ((e.clientY - rect.top) / rect.height) * 100;
		draftCoverPos = formatCoverPos(
			Math.min(100, Math.max(0, x)),
			Math.min(100, Math.max(0, y)),
		);
	}

	function onCoverPosPointerDown(e: PointerEvent) {
		e.preventDefault();
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		coverPosDragging = true;
		setCoverPosFromPointer(e);
	}

	function onCoverPosPointerMove(e: PointerEvent) {
		if (!coverPosDragging) return;
		setCoverPosFromPointer(e);
	}

	function onCoverPosPointerUp(e: PointerEvent) {
		coverPosDragging = false;
		try {
			(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
		} catch {
			/* ignore */
		}
	}

	function withStage(run: () => void) {
		if (navLock) return;
		navLock = true;
		closePanel();
		stageOn = false;
		window.setTimeout(() => {
			run();
			requestAnimationFrame(() => {
				stageOn = true;
				navLock = false;
			});
		}, 70);
	}

	function goHome() {
		closePanel();
		const swup = (window as Window & { swup?: { navigate: (u: string) => void } })
			.swup;
		if (swup) swup.navigate(homeHref);
		else window.location.assign(homeHref);
	}

	function goBackLevel() {
		if (path.length === 0) {
			goHome();
			return;
		}
		withStage(() => {
			path = path.slice(0, -1);
			syncUrl();
		});
	}

	function onTreeBack(e: Event) {
		e.preventDefault();
		goBackLevel();
	}

	async function refreshAuth() {
		try {
			const res = await fetch("/api/auth/me/");
			const data = (await res.json()) as { authenticated?: boolean };
			unlocked = !!data.authenticated;
		} catch {
			unlocked = false;
		}
		syncEditFab();
	}

	async function load() {
		// Drop legacy localStorage trees from older folio builds (password / Module UI).
		try {
			const doomed: string[] = [];
			for (let i = 0; i < localStorage.length; i++) {
				const k = localStorage.key(i);
				if (k?.startsWith("folio-section-tree:")) doomed.push(k);
			}
			for (const k of doomed) localStorage.removeItem(k);
		} catch {
			/* ignore */
		}

		try {
			const res = await fetch(`/api/folio/?section=${encodeURIComponent(sectionId)}`);
			if (res.ok) {
				const data = (await res.json()) as {
					nodes?: GalleryNode[];
					source?: string;
				};
				if (Array.isArray(data.nodes)) {
					// Prefer API when it has content, or when CMS explicitly owns the tree.
					// Ignore empty "config" / unknown payloads so seed stays visible if API is broken.
					const fromCms = data.source === "db" || data.source === "local";
					if (data.nodes.length > 0 || fromCms) {
						nodes = cloneGalleryNodes(data.nodes);
						return;
					}
				}
			}
		} catch {
			/* seed */
		}
		nodes = cloneGalleryNodes(seedNodes);
	}

	async function persist() {
		if (!unlocked) {
			flash("Sign in at /admin/login to save");
			return;
		}
		saving = true;
		try {
			const res = await fetch(`/api/folio/?section=${encodeURIComponent(sectionId)}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ nodes, section: sectionId }),
			});
			const data = (await res.json()) as { error?: string; nodes?: GalleryNode[] };
			if (res.status === 401) {
				unlocked = false;
				syncEditFab();
				flash("Session expired — sign in again");
				return;
			}
			if (!res.ok) {
				flash(data.error || "保存失败");
				return;
			}
			if (Array.isArray(data.nodes)) nodes = cloneGalleryNodes(data.nodes);
		} catch {
			flash("保存时网络出错");
		} finally {
			saving = false;
		}
	}

	function flash(msg: string) {
		toast = msg;
		window.setTimeout(() => {
			if (toast === msg) toast = "";
		}, 2200);
	}

	const current = $derived.by(() => {
		if (path.length === 0) return null;
		return findGalleryNode(nodes, path[path.length - 1]!) ?? null;
	});

	const children = $derived.by(() => {
		if (path.length === 0) return nodes;
		return current?.children ?? [];
	});

	const bannerTitle = $derived(current?.title ?? sectionLabel);

	const crumbs = $derived.by(() => {
		const list: { id: string | null; title: string }[] = [
			{ id: null, title: sectionLabel },
		];
		let cursor = nodes;
		for (const id of path) {
			const n = cursor.find((x) => x.id === id);
			if (!n) break;
			list.push({ id, title: n.title });
			cursor = n.children ?? [];
		}
		return list;
	});

	const targetNode = $derived.by(() => {
		if (!targetId) return null;
		return children.find((c) => c.id === targetId) ?? null;
	});

	const focusNode = $derived.by(() => {
		if (targetId) return targetNode;
		return current;
	});

	const focusPath = $derived.by(() => {
		if (targetId) return [...path, targetId];
		return path;
	});

	function enterFolder(id: string) {
		withStage(() => {
			path = [...path, id];
			syncUrl();
		});
	}

	function openModule(id: string) {
		targetId = id;
		panel = "module";
	}

	function onCardActivate(item: GalleryNode) {
		if (item.kind === "folder") enterFolder(item.id);
		else openModule(item.id);
	}

	function syncUrl() {
		const next = new URL(window.location.href);
		if (path.length) next.searchParams.set("path", path.join("/"));
		else next.searchParams.delete("path");
		history.replaceState(null, "", next);
	}

	function readUrlPath() {
		const raw = new URLSearchParams(window.location.search).get("path");
		if (!raw) {
			path = [];
			return;
		}
		const ids = raw.split("/").filter(Boolean);
		const valid: string[] = [];
		let cursor = nodes;
		for (const id of ids) {
			const n = cursor.find((x) => x.id === id);
			if (!n || n.kind === "module") break;
			valid.push(id);
			cursor = n.children ?? [];
		}
		path = valid;
	}

	function closePanel() {
		panel = "none";
		targetId = null;
		modalDrag = false;
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === "Escape" && panel !== "none") closePanel();
	}

	function uid(prefix: string) {
		return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
	}

	function fillDraftFrom(node: GalleryNode | null) {
		draftKind = node?.kind ?? "folder";
		draftTitle = node?.title ?? (draftKind === "folder" ? "Untitled Folder" : "Untitled Module");
		draftSummary = node?.summary ?? "";
		draftBody = node?.body ?? "";
		draftCover = node?.coverSrc ?? "";
		draftCoverPos = node?.coverPos || "50% 50%";
	}

	function requireAuth(): boolean {
		if (unlocked) return true;
		flash("Sign in required");
		window.location.assign(`/admin/login/?next=${encodeURIComponent(window.location.pathname)}`);
		return false;
	}

	async function lockEdit() {
		await fetch("/api/auth/logout/", { method: "POST" });
		unlocked = false;
		closePanel();
		syncEditFab();
		flash("Signed out");
	}

	function syncEditFab() {
		const sync = (
			window as Window & { folioSyncEditFab?: (u: boolean) => void }
		).folioSyncEditFab;
		sync?.(unlocked);
	}

	function onEditToggle(e: Event) {
		e.preventDefault();
		if (unlocked) void lockEdit();
		else requireAuth();
	}

	function openCreate() {
		if (!requireAuth()) return;
		targetId = null;
		draftKind = "folder";
		draftTitle = "Untitled Folder";
		draftSummary = "";
		draftBody = "";
		draftCover = "";
		draftCoverPos = "50% 50%";
		panel = "create";
	}

	function openEditCurrent() {
		if (!requireAuth()) return;
		if (path.length === 0) {
			flash("Use New at root; open a folder to edit that level");
			return;
		}
		targetId = null;
		fillDraftFrom(current);
		panel = "edit";
	}

	function openEditChild(id: string, e?: MouseEvent) {
		e?.stopPropagation();
		if (!requireAuth()) return;
		targetId = id;
		fillDraftFrom(children.find((c) => c.id === id) ?? null);
		panel = "edit";
	}

	async function patchAt(ids: string[], patch: Partial<GalleryNode>) {
		if (ids.length === 0) return;
		nodes = updateGalleryAtPath(nodes, ids, (n) => ({ ...n, ...patch }));
		await persist();
	}

	async function saveModuleCollage(next: FolioCollageData | undefined) {
		if (!targetId) return;
		await patchAt([...path, targetId], { collage: next });
	}

	async function saveCreate() {
		const kind = draftKind;
		const title =
			draftTitle.trim() ||
			(kind === "folder" ? "Untitled Folder" : "Untitled Module");
		const child: GalleryNode = {
			id: uid(kind),
			title,
			summary: draftSummary.trim(),
			body: draftBody.trim(),
			coverSrc: draftCover || undefined,
			coverPos: draftCover ? draftCoverPos : undefined,
			accent: "#4a463e",
			kind,
			children: kind === "folder" ? [] : undefined,
		};
		if (path.length === 0) {
			nodes = [...nodes, child];
		} else {
			nodes = updateGalleryAtPath(nodes, path, (n) => ({
				...n,
				children: [...(n.children ?? []), child],
			}));
		}
		await persist();
		closePanel();
		flash(kind === "folder" ? "已新建文件夹" : "已新建模块");
		if (kind === "folder") enterFolder(child.id);
		else openModule(child.id);
	}

	async function saveEdit() {
		const ids = focusPath;
		if (ids.length === 0) {
			flash("不能编辑根目录");
			return;
		}
		const kind = draftKind;
		await patchAt(ids, {
			title:
				draftTitle.trim() ||
				(kind === "folder" ? "Untitled Folder" : "Untitled Module"),
			summary: draftSummary.trim(),
			body: draftBody.trim(),
			coverSrc: draftCover || undefined,
			coverPos: draftCover ? draftCoverPos : undefined,
			kind,
			children: kind === "folder" ? focusNode?.children ?? [] : undefined,
		});
		closePanel();
		flash("已保存");
	}

	async function deleteFocus() {
		const ids = focusPath;
		if (ids.length === 0) {
			flash("Cannot delete root");
			return;
		}
		const name = focusNode?.title ?? "";
		if (!confirm(`确定删除「${name}」？文件夹内的内容也会一起删掉。`)) return;
		nodes = removeGalleryAtPath(nodes, ids);
		if (!targetId) {
			path = path.slice(0, -1);
			syncUrl();
		}
		await persist();
		closePanel();
		flash("已删除");
	}

	async function deleteChild(id: string, e?: MouseEvent) {
		e?.stopPropagation();
		if (!requireAuth()) return;
		const node = children.find((c) => c.id === id);
		if (!node) return;
		if (!confirm(`确定删除「${node.title}」？`)) return;
		nodes = removeGalleryAtPath(nodes, [...path, id]);
		await persist();
		if (targetId === id) closePanel();
		flash("已删除");
	}

	async function moveChild(index: number, toIndex: number) {
		if (!requireAuth()) return;
		if (index === toIndex) return;
		if (index < 0 || toIndex < 0 || index >= children.length || toIndex >= children.length) {
			return;
		}
		nodes = reorderGalleryChildren(nodes, path, index, toIndex);
		await persist();
		flash(`已调整顺序 · ${toIndex + 1}/${children.length}`);
	}

	async function moveChildBy(index: number, delta: number, e?: MouseEvent) {
		e?.stopPropagation();
		await moveChild(index, index + delta);
	}

	function onReorderDragStart(index: number, e: DragEvent) {
		if (!unlocked) {
			e.preventDefault();
			return;
		}
		e.stopPropagation();
		dragFrom = index;
		e.dataTransfer?.setData("text/folio-reorder", String(index));
		e.dataTransfer!.effectAllowed = "move";
		if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
	}

	function onReorderDragOver(index: number, e: DragEvent) {
		if (!unlocked || dragFrom == null) return;
		e.preventDefault();
		e.stopPropagation();
		if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
		if (dragOver !== index) dragOver = index;
	}

	function onReorderDragLeave(index: number) {
		if (dragOver === index) dragOver = null;
	}

	async function onReorderDrop(index: number, e: DragEvent) {
		if (!unlocked) return;
		e.preventDefault();
		e.stopPropagation();
		const raw = e.dataTransfer?.getData("text/folio-reorder");
		const from = raw !== "" && raw != null ? Number(raw) : dragFrom;
		dragFrom = null;
		dragOver = null;
		if (from == null || !Number.isFinite(from)) return;
		await moveChild(from, index);
	}

	function onReorderDragEnd() {
		dragFrom = null;
		dragOver = null;
	}

	async function applyDraftCover(file: File | undefined) {
		if (!file || !file.type.startsWith("image/")) {
			flash("Please choose an image file");
			return;
		}
		if (!requireAuth()) return;
		try {
			const form = new FormData();
			form.append("file", file);
			const res = await fetch("/api/media/", { method: "POST", body: form });
			const data = (await res.json()) as {
				error?: string;
				media?: { url: string };
			};
			if (!res.ok) {
				flash(data.error || "Upload failed");
				return;
			}
			draftCover = data.media?.url || "";
			draftCoverPos = "50% 50%";
			flash("Cover uploaded — drag to set focus, then save");
		} catch {
			flash("Image upload failed");
		}
	}

	function clearDraftCover() {
		draftCover = "";
		draftCoverPos = "50% 50%";
		flash(draftKind === "folder" ? "Default typewriter cover will be used" : "Cover cleared");
	}

	function onDropCover(e: DragEvent) {
		e.preventDefault();
		modalDrag = false;
		void applyDraftCover(e.dataTransfer?.files?.[0]);
	}

	async function resetTree() {
		if (!requireAuth()) return;
		if (!confirm("Reset to default tree from site config?")) return;
		nodes = cloneGalleryNodes(seedNodes);
		path = [];
		await persist();
		closePanel();
		syncUrl();
		flash("Reset to defaults");
	}

	function jumpToCrumb(index: number) {
		if (index >= crumbs.length - 1) return;
		withStage(() => {
			path = path.slice(0, index);
			syncUrl();
		});
	}

	function padIndex(i: number) {
		return String(i + 1).padStart(2, "0");
	}

	onMount(() => {
		void (async () => {
			await load();
			readUrlPath();
			await refreshAuth();
		})();
		document.addEventListener("folio:tree-back", onTreeBack);
		document.addEventListener("folio:edit-toggle", onEditToggle);
		return () => {
			document.removeEventListener("folio:tree-back", onTreeBack);
			document.removeEventListener("folio:edit-toggle", onEditToggle);
			document.documentElement.classList.remove("folio-modal-open");
		};
	});
</script>

<svelte:window onkeydown={onKey} />

<div class="folio-tree" class:is-editing={unlocked}>
	<div class="folio-tree-stage" class:is-on={stageOn}>
	<header class="folio-mast">
		<div class="folio-mast-row">
			<span class="folio-mast-mark" aria-hidden="true"></span>
			<div class="folio-mast-main">
				{#if crumbs.length > 1}
					<nav class="folio-crumbs" aria-label="路径">
						{#each crumbs as crumb, i}
							{#if i > 0}
								<span class="folio-crumb-sep" aria-hidden="true">/</span>
							{/if}
							{#if i < crumbs.length - 1}
								<button
									type="button"
									class="folio-crumb"
									onclick={() => jumpToCrumb(i)}
								>
									{crumb.title}
								</button>
							{:else}
								<span class="folio-crumb is-here">{crumb.title}</span>
							{/if}
						{/each}
					</nav>
				{:else}
					<p class="folio-mast-kicker">{sectionId}</p>
				{/if}
				<div class="folio-mast-title-row">
					<h1 class="folio-section-heading">{bannerTitle}</h1>
					<p class="folio-mast-meta">
						<span class="folio-mast-count">{String(children.length).padStart(2, "0")}</span>
						<span class="folio-mast-count-label">篇</span>
					</p>
				</div>
			</div>
		</div>
		<div class="folio-mast-rule" aria-hidden="true"></div>
		{#if current?.summary}
			<p class="folio-mast-summary">{current.summary}</p>
		{/if}
	</header>

	{#if unlocked}
		<div class="folio-gallery-toolbar">
			<div class="folio-toolbar-left" role="toolbar" aria-label="Edit actions">
				<button type="button" class="folio-edit-toggle" onclick={openCreate}>新建</button>
				<button
					type="button"
					class="folio-edit-toggle"
					class:is-on={panel === "edit" && !targetId}
					onclick={openEditCurrent}
					disabled={path.length === 0}
				>
					编辑本层
				</button>
				<button
					type="button"
					class="folio-edit-toggle folio-edit-danger"
					onclick={() => {
						targetId = null;
						if (path.length === 0) {
							flash("根目录不能删除");
							return;
						}
						fillDraftFrom(current);
						void deleteFocus();
					}}
					disabled={path.length === 0}
				>
					删除
				</button>
				<button type="button" class="folio-edit-reset" onclick={() => void resetTree()}>重置</button>
			</div>
			<p class="folio-toolbar-hint">拖左侧把手或用 ↑↓ 调整模块顺序</p>
		</div>
	{/if}

	{#if panel === "create" || panel === "edit"}
		<div class="folio-tile folio-editor-panel">
			<h2 class="folio-editor-heading">
				{panel === "create" ? `New under "${bannerTitle}"` : `Edit "${draftTitle}"`}
			</h2>

			{#if panel === "create"}
				<div class="folio-kind-switch" role="group" aria-label="Type">
					<button
						type="button"
						class="folio-kind-btn"
						class:is-on={draftKind === "folder"}
						onclick={() => {
							draftKind = "folder";
							if (!draftTitle || draftTitle === "Untitled Module") draftTitle = "Untitled Folder";
						}}
					>
						Folder
					</button>
					<button
						type="button"
						class="folio-kind-btn"
						class:is-on={draftKind === "module"}
						onclick={() => {
							draftKind = "module";
							if (!draftTitle || draftTitle === "Untitled Folder") draftTitle = "Untitled Module";
						}}
					>
						Module
					</button>
				</div>
				<p class="folio-editor-note">
					{draftKind === "folder"
						? "Folders can nest further. Without a cover, a typewriter title card is used."
						: "Modules hold content and images; they cannot contain children."}
				</p>
			{/if}

						<div
				class="folio-editor-cover"
				class:is-dragover={modalDrag}
				role="group"
				aria-label="Cover"
				ondragover={(e) => {
					e.preventDefault();
					modalDrag = true;
				}}
				ondragleave={() => (modalDrag = false)}
				ondrop={onDropCover}
			>
				{#if draftCover}
					<div class="folio-cover-focus">
						<p class="folio-cover-focus-hint">拖动定位 · 与列表 16:9 裁切一致</p>
						<button
							type="button"
							class="folio-cover-focus-frame"
							class:is-dragging={coverPosDragging}
							aria-label={`封面焦点 ${draftCoverPos}，拖动或方向键调整`}
							onpointerdown={onCoverPosPointerDown}
							onpointermove={onCoverPosPointerMove}
							onpointerup={onCoverPosPointerUp}
							onpointercancel={onCoverPosPointerUp}
							onkeydown={(e) => {
								const step = e.shiftKey ? 8 : 3;
								const { x, y } = draftCoverFocus;
								if (e.key === "ArrowLeft") {
									e.preventDefault();
									draftCoverPos = formatCoverPos(Math.max(0, x - step), y);
								} else if (e.key === "ArrowRight") {
									e.preventDefault();
									draftCoverPos = formatCoverPos(Math.min(100, x + step), y);
								} else if (e.key === "ArrowUp") {
									e.preventDefault();
									draftCoverPos = formatCoverPos(x, Math.max(0, y - step));
								} else if (e.key === "ArrowDown") {
									e.preventDefault();
									draftCoverPos = formatCoverPos(x, Math.min(100, y + step));
								} else if (e.key === " " || e.key === "Enter") {
									e.preventDefault();
								}
							}}
						>
							<img
								src={draftCover}
								alt=""
								draggable="false"
								style={`object-position: ${draftCoverPos}`}
							/>
							<span class="folio-cover-focus-veil" aria-hidden="true"></span>
							<span
								class="folio-cover-focus-dot"
								aria-hidden="true"
								style={`left: ${draftCoverFocus.x}%; top: ${draftCoverFocus.y}%`}
							></span>
						</button>
						<div class="folio-cover-focus-presets" role="group" aria-label="快捷焦点">
							{#each [
								["中", "50% 50%"],
								["上", "50% 20%"],
								["下", "50% 80%"],
								["左", "22% 50%"],
								["右", "78% 50%"],
							] as [label, pos]}
								<button
									type="button"
									class="folio-cover-focus-preset"
									class:is-on={draftCoverPos === pos}
									onclick={() => (draftCoverPos = pos)}
								>
									{label}
								</button>
							{/each}
						</div>
					</div>
				{:else if draftKind === "folder"}
					<div class="folio-ink-cover folio-ink-cover-preview">
						<p class="folio-ink-cover-title">{draftTitle.trim() || "Folder"}</p>
						<span class="folio-ink-cover-hint">Default cover</span>
					</div>
				{:else}
					<div class="folio-editor-cover-empty">Drop a cover image (optional)</div>
				{/if}
				<div class="folio-cover-actions">
					<label class="folio-modal-pick">
						Choose image
						<input
							type="file"
							accept="image/*"
							hidden
							onchange={(e) => {
								const input = e.currentTarget as HTMLInputElement;
								void applyDraftCover(input.files?.[0]);
								input.value = "";
							}}
						/>
					</label>
					{#if draftCover}
						<button type="button" class="folio-modal-pick" onclick={clearDraftCover}>
							Clear
						</button>
					{/if}
				</div>
			</div>

			<label class="folio-editor-field">
				<span>Title</span>
				<input bind:value={draftTitle} placeholder="Name" />
			</label>
			<label class="folio-editor-field">
				<span>Summary</span>
				<textarea rows="2" bind:value={draftSummary} placeholder="一句话总结"></textarea>
			</label>

			<div class="folio-editor-actions">
				<button
					type="button"
					class="folio-btn"
					disabled={saving}
					onclick={() => (panel === "create" ? void saveCreate() : void saveEdit())}
				>
					{saving ? "保存中…" : "保存"}
				</button>
				{#if panel === "edit"}
					<button type="button" class="folio-btn folio-btn-danger" onclick={() => void deleteFocus()}>
						删除
					</button>
				{/if}
				<button type="button" class="folio-btn folio-btn-ghost" onclick={closePanel}>取消</button>
			</div>
		</div>
	{/if}

	{#if children.length === 0 && panel !== "create"}
		<div class="folio-tile folio-empty">
			<div class="folio-empty-mark" aria-hidden="true">空</div>
			<div class="folio-empty-copy">
				<p class="folio-empty-title">此处尚无内容</p>
				<p class="folio-empty-hint">新建文件夹继续分层，或放一个作品模块。</p>
			</div>
			{#if unlocked}
				<button type="button" class="folio-btn" onclick={openCreate}>新建</button>
			{:else}
				<a class="folio-btn" href="/admin/login/">登录后编辑</a>
			{/if}
		</div>
	{:else if children.length > 0}
		<div class="folio-gallery" aria-label={bannerTitle}>
			{#each children as item, i}
				<div
					class="folio-cinema"
					class:is-dragging={dragFrom === i}
					class:is-drop-target={dragOver === i && dragFrom !== i}
					style={`--bento-delay: ${i * 70}ms`}
					ondragover={(e) => onReorderDragOver(i, e)}
					ondragleave={() => onReorderDragLeave(i)}
					ondrop={(e) => void onReorderDrop(i, e)}
				>
					<div
						class="folio-tile folio-gallery-card"
						class:is-folder={item.kind === "folder"}
						class:is-module={item.kind === "module"}
						class:is-selected={targetId === item.id}
						class:has-cover={!!item.coverSrc}
						style={`--tile-accent: ${item.accent || "var(--folio-placeholder)"}`}
						role="button"
						tabindex="0"
						onclick={() => onCardActivate(item)}
						onkeydown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								onCardActivate(item);
							}
						}}
					>
						<span class="folio-card-vignette" aria-hidden="true"></span>
						<span class="folio-card-grain" aria-hidden="true"></span>
						{#if item.coverSrc}
							<img
								src={item.coverSrc}
								alt=""
								class="folio-tile-cover"
								loading={i < 2 ? "eager" : "lazy"}
								decoding="async"
								fetchpriority={i === 0 ? "high" : undefined}
								style={`object-position: ${item.coverPos || "50% 50%"}`}
							/>
						{:else if item.kind === "folder"}
							<FolderCover title={item.title} sectionId={sectionId} index={i} />
						{:else}
							<span class="folio-section-ph" aria-hidden="true">
								<span class="folio-ph-letter">{item.title.slice(0, 1)}</span>
							</span>
						{/if}
						<span class="folio-tile-scrim" aria-hidden="true"></span>
						<span class="folio-card-frame" aria-hidden="true"></span>
						<span class="folio-card-index">{padIndex(i)}</span>
						<span class="folio-kind-badge">{item.kind === "folder" ? "册" : "笺"}</span>

						<div class="folio-card-copy">
							<span class="folio-section-title">{item.title}</span>
						</div>

						<span class="folio-card-cue" aria-hidden="true">
							{item.kind === "folder" ? "翻开" : "展读"}
						</span>

						{#if unlocked}
							<button
								type="button"
								class="folio-card-drag"
								draggable="true"
								title="按住拖动调整顺序"
								aria-label={`拖动调整「${item.title}」的顺序`}
								onclick={(e) => e.stopPropagation()}
								ondragstart={(e) => onReorderDragStart(i, e)}
								ondragend={onReorderDragEnd}
							>
								<span aria-hidden="true">⋮⋮</span>
								<em>拖动排序</em>
							</button>
							<div class="folio-card-actions">
								<button
									type="button"
									class="folio-card-action"
									disabled={i === 0 || saving}
									title="上移"
									aria-label="上移"
									onclick={(e) => void moveChildBy(i, -1, e)}
								>
									↑
								</button>
								<button
									type="button"
									class="folio-card-action"
									disabled={i >= children.length - 1 || saving}
									title="下移"
									aria-label="下移"
									onclick={(e) => void moveChildBy(i, 1, e)}
								>
									↓
								</button>
								<button
									type="button"
									class="folio-card-action"
									onclick={(e) => openEditChild(item.id, e)}
								>
									编辑
								</button>
								<button
									type="button"
									class="folio-card-action is-danger"
									onclick={(e) => void deleteChild(item.id, e)}
								>
									删除
								</button>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
	</div><!-- /.folio-tree-stage -->

	{#if panel === "module" && targetNode}
		<div
			class="folio-sheet-backdrop"
			role="presentation"
			onclick={closePanel}
		>
			<div
				class="folio-sheet"
				role="dialog"
				aria-modal="true"
				aria-label={targetNode.title}
				tabindex="-1"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => e.stopPropagation()}
			>
				<div class="folio-sheet-fiber" aria-hidden="true"></div>
				<div class="folio-sheet-edge" aria-hidden="true"></div>
				<button
					type="button"
					class="folio-sheet-close"
					onclick={closePanel}
					aria-label="合上"
				>
					合上
				</button>

				<header class="folio-sheet-head">
					<span class="folio-sheet-seal" aria-hidden="true">阅</span>
					<div class="folio-sheet-head-text">
						<p class="folio-sheet-kicker">Module · 笺</p>
						<h2 class="folio-sheet-title">{targetNode.title}</h2>
					</div>
				</header>

				{#if targetNode.coverSrc}
					<figure class="folio-sheet-figure">
						<img
							src={targetNode.coverSrc}
							alt=""
							style={`object-position: ${targetNode.coverPos || "50% 50%"}`}
						/>
					</figure>
				{/if}

				{#if targetNode.summary}
					<div class="folio-sheet-rule" aria-hidden="true"></div>
					<p class="folio-sheet-lead">{targetNode.summary}</p>
				{/if}

				<FolioCollage
					collage={targetNode.collage}
					editable={unlocked}
					onChange={(next) => void saveModuleCollage(next)}
					onFlash={flash}
				/>

				{#if unlocked}
					<footer class="folio-sheet-foot">
						<button
							type="button"
							class="folio-btn"
							onclick={() => {
								fillDraftFrom(targetNode);
								panel = "edit";
							}}
						>
							编辑此笺
						</button>
					</footer>
				{/if}
			</div>
		</div>
	{/if}
</div>

{#if toast}
	<div class="folio-edit-toast" role="status">{toast}</div>
{/if}
