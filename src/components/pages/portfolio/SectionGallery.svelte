<script lang="ts">
	import { onMount } from "svelte";
	import FolderCover from "@/components/pages/portfolio/FolderCover.svelte";
	import type { GalleryNode, GalleryNodeKind } from "@/types/folioTree";
	import {
		cloneGalleryNodes,
		findGalleryNode,
		removeGalleryAtPath,
		updateGalleryAtPath,
	} from "@/utils/folio-tree";

	interface Props {
		sectionId: string;
		sectionLabel: string;
		homeHref: string;
		seedNodes: GalleryNode[];
	}

	let { sectionId, sectionLabel, homeHref, seedNodes }: Props = $props();

	const storageKey = $derived(`folio-section-tree:v4:${sectionId}`);
	const authKey = "folio-edit-unlocked";
	/** Local-only edit gate (client-visible by design for this static folio). */
	const EDIT_PASSWORD = "284655";

	type Stored = { nodes: GalleryNode[] };
	type Panel = "none" | "create" | "edit" | "auth" | "module";

	let nodes = $state<GalleryNode[]>([]);
	let path = $state<string[]>([]);
	let unlocked = $state(false);
	let panel = $state<Panel>("none");
	let targetId = $state<string | null>(null);
	let toast = $state("");
	let modalDrag = $state(false);
	let passwordInput = $state("");
	let authError = $state("");
	let authLeaving = $state(false);

	let draftKind = $state<GalleryNodeKind>("folder");
	let draftTitle = $state("");
	let draftSummary = $state("");
	let draftBody = $state("");
	let draftCover = $state("");
	let stageOn = $state(true);
	let navLock = false;

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

	function load() {
		try {
			const raw = localStorage.getItem(storageKey);
			if (raw) {
				const parsed = JSON.parse(raw) as Stored;
				if (Array.isArray(parsed.nodes)) {
					nodes = cloneGalleryNodes(parsed.nodes);
					return;
				}
			}
		} catch {
			/* seed */
		}
		nodes = cloneGalleryNodes(seedNodes);
	}

	function persist() {
		try {
			localStorage.setItem(storageKey, JSON.stringify({ nodes }));
		} catch {
			flash("Storage full — compress the image and retry");
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
		if (panel === "auth") {
			closeAuth();
			return;
		}
		panel = "none";
		targetId = null;
		modalDrag = false;
		passwordInput = "";
		authError = "";
	}

	function closeAuth() {
		if (panel !== "auth" || authLeaving) return;
		authLeaving = true;
		window.setTimeout(() => {
			panel = "none";
			authLeaving = false;
			passwordInput = "";
			authError = "";
			targetId = null;
			document.documentElement.classList.remove("folio-modal-open");
		}, 200);
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
	}

	function openAuth() {
		authLeaving = false;
		panel = "auth";
		passwordInput = "";
		authError = "";
		targetId = null;
		document.documentElement.classList.add("folio-modal-open");
		queueMicrotask(() => {
			document.getElementById("folio-auth-input")?.focus();
		});
	}

	function tryUnlock() {
		if (passwordInput === EDIT_PASSWORD) {
			unlocked = true;
			sessionStorage.setItem(authKey, "1");
			passwordInput = "";
			authError = "";
			syncEditFab();
			flash("Editing unlocked");
			closeAuth();
			return;
		}
		authError = "Wrong password";
	}

	function lockEdit() {
		unlocked = false;
		sessionStorage.removeItem(authKey);
		closePanel();
		syncEditFab();
		flash("Editing locked");
	}

	function syncEditFab() {
		const sync = (
			window as Window & { folioSyncEditFab?: (u: boolean) => void }
		).folioSyncEditFab;
		sync?.(unlocked);
	}

	function onEditToggle(e: Event) {
		e.preventDefault();
		if (unlocked) lockEdit();
		else openAuth();
	}

	function openCreate() {
		if (!unlocked) {
			openAuth();
			return;
		}
		targetId = null;
		draftKind = "folder";
		draftTitle = "Untitled Folder";
		draftSummary = "";
		draftBody = "";
		draftCover = "";
		panel = "create";
	}

	function openEditCurrent() {
		if (!unlocked) {
			openAuth();
			return;
		}
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
		if (!unlocked) {
			openAuth();
			return;
		}
		targetId = id;
		fillDraftFrom(children.find((c) => c.id === id) ?? null);
		panel = "edit";
	}

	function patchAt(ids: string[], patch: Partial<GalleryNode>) {
		if (ids.length === 0) return;
		nodes = updateGalleryAtPath(nodes, ids, (n) => ({ ...n, ...patch }));
		persist();
	}

	function saveCreate() {
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
		persist();
		closePanel();
		flash(kind === "folder" ? "Folder created" : "Module created");
		if (kind === "folder") enterFolder(child.id);
		else openModule(child.id);
	}

	function saveEdit() {
		const ids = focusPath;
		if (ids.length === 0) {
			flash("Cannot edit root");
			return;
		}
		const kind = draftKind;
		patchAt(ids, {
			title:
				draftTitle.trim() ||
				(kind === "folder" ? "Untitled Folder" : "Untitled Module"),
			summary: draftSummary.trim(),
			body: draftBody.trim(),
			coverSrc: draftCover || undefined,
			kind,
			children: kind === "folder" ? focusNode?.children ?? [] : undefined,
		});
		closePanel();
		flash("Saved");
	}

	function deleteFocus() {
		const ids = focusPath;
		if (ids.length === 0) {
			flash("Cannot delete root");
			return;
		}
		const name = focusNode?.title ?? "";
		if (!confirm(`Delete "${name}"? Folders and nested items will be removed.`)) return;
		nodes = removeGalleryAtPath(nodes, ids);
		if (!targetId) {
			path = path.slice(0, -1);
			syncUrl();
		}
		persist();
		closePanel();
		flash("Deleted");
	}

	function deleteChild(id: string, e?: MouseEvent) {
		e?.stopPropagation();
		if (!unlocked) {
			openAuth();
			return;
		}
		const node = children.find((c) => c.id === id);
		if (!node) return;
		if (!confirm(`Delete "${node.title}"?`)) return;
		nodes = removeGalleryAtPath(nodes, [...path, id]);
		persist();
		if (targetId === id) closePanel();
		flash("Deleted");
	}

	async function fileToDataUrl(file: File): Promise<string> {
		const bitmap = await createImageBitmap(file);
		const max = 1600;
		const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
		const w = Math.round(bitmap.width * scale);
		const h = Math.round(bitmap.height * scale);
		const canvas = document.createElement("canvas");
		canvas.width = w;
		canvas.height = h;
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("canvas");
		ctx.drawImage(bitmap, 0, 0, w, h);
		bitmap.close();
		return canvas.toDataURL("image/jpeg", 0.88);
	}

	async function applyDraftCover(file: File | undefined) {
		if (!file || !file.type.startsWith("image/")) {
			flash("Please choose an image file");
			return;
		}
		try {
			draftCover = await fileToDataUrl(file);
			flash("Cover selected — save to apply");
		} catch {
			flash("Image processing failed");
		}
	}

	function clearDraftCover() {
		draftCover = "";
		flash(draftKind === "folder" ? "Default typewriter cover will be used" : "Cover cleared");
	}

	function onDropCover(e: DragEvent) {
		e.preventDefault();
		modalDrag = false;
		void applyDraftCover(e.dataTransfer?.files?.[0]);
	}

	function resetTree() {
		if (!unlocked) {
			openAuth();
			return;
		}
		if (!confirm("Reset to default tree? Local changes will be cleared.")) return;
		localStorage.removeItem(storageKey);
		nodes = cloneGalleryNodes(seedNodes);
		path = [];
		closePanel();
		syncUrl();
		flash("Reset to defaults");
	}

	onMount(() => {
		load();
		readUrlPath();
		unlocked = sessionStorage.getItem(authKey) === "1";
		syncEditFab();
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
	<header class="folio-tile folio-section-banner">
		<div class="folio-section-banner-ink" aria-hidden="true"></div>
		<div class="folio-section-banner-main">
			<h1 class="folio-section-heading">{bannerTitle}</h1>
		</div>
	</header>

	{#if unlocked}
		<div class="folio-gallery-toolbar">
			<div class="folio-toolbar-left" role="toolbar" aria-label="Edit actions">
				<button type="button" class="folio-edit-toggle" onclick={openCreate}>New</button>
				<button
					type="button"
					class="folio-edit-toggle"
					class:is-on={panel === "edit" && !targetId}
					onclick={openEditCurrent}
					disabled={path.length === 0}
				>
					Edit
				</button>
				<button
					type="button"
					class="folio-edit-toggle folio-edit-danger"
					onclick={() => {
						targetId = null;
						if (path.length === 0) {
							flash("Cannot delete root");
							return;
						}
						fillDraftFrom(current);
						deleteFocus();
					}}
					disabled={path.length === 0}
				>
					Delete
				</button>
				<button type="button" class="folio-edit-reset" onclick={resetTree}>Reset</button>
			</div>
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
					<img src={draftCover} alt="" />
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
				<textarea rows="2" bind:value={draftSummary} placeholder="Short blurb for the list"></textarea>
			</label>
			<label class="folio-editor-field">
				<span>Details</span>
				<textarea rows="8" bind:value={draftBody} placeholder="Body, notes, details…"></textarea>
			</label>

			<div class="folio-editor-actions">
				<button
					type="button"
					class="folio-btn"
					onclick={() => (panel === "create" ? saveCreate() : saveEdit())}
				>
					Save
				</button>
				{#if panel === "edit"}
					<button type="button" class="folio-btn folio-btn-danger" onclick={deleteFocus}>
						Delete
					</button>
				{/if}
				<button type="button" class="folio-btn folio-btn-ghost" onclick={closePanel}>Cancel</button>
			</div>
		</div>
	{/if}

	{#if current?.body && panel === "none"}
		<div class="folio-tile folio-node-body">
			<p class="folio-node-body-text">{current.body}</p>
		</div>
	{/if}

	{#if children.length === 0 && panel !== "create"}
		<div class="folio-tile folio-empty">
			<svg class="folio-empty-scene" viewBox="0 0 120 40" aria-hidden="true">
				<path
					d="M8 28c8-12 22-18 36-12 6-8 18-10 28-4 12-6 26 0 30 10H8z"
					fill="currentColor"
					opacity="0.12"
				/>
			</svg>
			<p>This folder is empty.</p>
			{#if unlocked}
				<button type="button" class="folio-btn" onclick={openCreate}>New</button>
			{:else}
				<button type="button" class="folio-btn" onclick={openAuth}>Unlock to create</button>
			{/if}
		</div>
	{:else if children.length > 0}
		<div class="folio-gallery" aria-label={bannerTitle}>
			{#each children as item, i}
				<div
					class="folio-tile folio-gallery-card"
					class:is-folder={item.kind === "folder"}
					class:is-module={item.kind === "module"}
					class:is-selected={targetId === item.id}
					style={`--bento-delay: ${i * 40}ms; --tile-accent: ${item.accent || "var(--folio-placeholder)"}`}
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
					{#if item.coverSrc}
						<img src={item.coverSrc} alt="" class="folio-tile-cover" loading="lazy" />
					{:else if item.kind === "folder"}
						<FolderCover title={item.title} sectionId={sectionId} index={i} />
					{:else}
						<span class="folio-section-ph" aria-hidden="true"></span>
					{/if}
					<span class="folio-tile-scrim" aria-hidden="true"></span>
					<span class="folio-kind-badge">{item.kind === "folder" ? "Folder" : "Module"}</span>
					{#if item.kind === "module"}
						<span class="folio-section-title">{item.title}</span>
						{#if item.summary}
							<span class="folio-gallery-summary">{item.summary}</span>
						{/if}
					{/if}
					{#if item.kind === "folder" && (item.children?.length ?? 0) > 0}
						<span class="folio-gallery-meta">{item.children?.length} items</span>
					{/if}

					{#if unlocked}
						<div class="folio-card-actions">
							<button
								type="button"
								class="folio-card-action"
								onclick={(e) => openEditChild(item.id, e)}
							>
								Edit
							</button>
							<button
								type="button"
								class="folio-card-action is-danger"
								onclick={(e) => deleteChild(item.id, e)}
							>
								Del
							</button>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
	</div><!-- /.folio-tree-stage -->

	{#if panel === "auth"}
		<div
			class="folio-auth-backdrop"
			class:is-leaving={authLeaving}
			role="presentation"
			onclick={closeAuth}
		>
			<div
				class="folio-auth-modal"
				role="dialog"
				aria-modal="true"
				aria-labelledby="folio-auth-title"
				tabindex="-1"
				onclick={(e) => e.stopPropagation()}
			>
				<button
					type="button"
					class="folio-modal-close"
					onclick={closeAuth}
					aria-label="Close"
				>
					×
				</button>
				<h2 id="folio-auth-title" class="folio-editor-heading">Unlock editing</h2>
				<p class="folio-editor-note">Enter password to create folders / modules and edit content.</p>
				<label class="folio-editor-field">
					<span>Password</span>
					<input
						id="folio-auth-input"
						type="password"
						bind:value={passwordInput}
						placeholder="Edit password"
						autocomplete="current-password"
						onkeydown={(e) => {
							if (e.key === "Enter") tryUnlock();
						}}
					/>
				</label>
				{#if authError}
					<p class="folio-auth-error">{authError}</p>
				{/if}
				<div class="folio-editor-actions">
					<button type="button" class="folio-btn" onclick={tryUnlock}>Confirm</button>
					<button type="button" class="folio-btn folio-btn-ghost" onclick={closeAuth}>Cancel</button>
				</div>
			</div>
		</div>
	{/if}

	{#if panel === "module" && targetNode}
		<div
			class="folio-module-backdrop"
			role="presentation"
			onclick={closePanel}
		>
			<div
				class="folio-tile folio-module-zoom"
				role="dialog"
				aria-modal="true"
				aria-label={targetNode.title}
				tabindex="-1"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => e.stopPropagation()}
			>
				<button
					type="button"
					class="folio-modal-close"
					onclick={closePanel}
					aria-label="Close"
				>
					×
				</button>
				<span class="folio-kind-tag">Module</span>
				<h2 class="folio-module-zoom-title">{targetNode.title}</h2>
				{#if targetNode.coverSrc}
					<img class="folio-view-cover" src={targetNode.coverSrc} alt="" />
				{/if}
				{#if targetNode.summary}
					<p class="folio-module-zoom-summary">{targetNode.summary}</p>
				{/if}
				{#if targetNode.body}
					<p class="folio-module-zoom-body">{targetNode.body}</p>
				{:else}
					<p class="folio-editor-note">No details yet.</p>
				{/if}
				{#if unlocked}
					<div class="folio-editor-actions">
						<button
							type="button"
							class="folio-btn"
							onclick={() => {
								fillDraftFrom(targetNode);
								panel = "edit";
							}}
						>
							Edit
						</button>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

{#if toast}
	<div class="folio-edit-toast" role="status">{toast}</div>
{/if}
