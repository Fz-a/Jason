<script lang="ts">
	import { resolveFolderScene, type FolderScene } from "@/utils/folio-tree";

	interface Props {
		title: string;
		sectionId: string;
		index?: number;
	}

	let { title, sectionId, index = 0 }: Props = $props();

	const scene: FolderScene = $derived(resolveFolderScene(sectionId, title, index));
	const label = $derived(title.trim() || "Folder");
</script>

<div class="folio-ink-cover" data-scene={scene} aria-hidden="true">
	<div class="folio-folder-scene">
		{#if scene === "ink"}
			<svg class="folio-folder-svg" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice">
				<path
					class="folio-folder-cloud c1"
					d="M12 62c10-16 28-24 46-18 8-12 24-16 38-8 16-10 36-2 42 14 12 2 18 12 16 20H12z"
				/>
				<path
					class="folio-folder-cloud c2"
					d="M20 78c8-10 22-14 34-8 6-8 16-10 26-4 12-6 26 0 30 10H20z"
				/>
				<circle class="folio-folder-dot d1" cx="118" cy="28" r="2.2" />
				<circle class="folio-folder-dot d2" cx="128" cy="36" r="1.4" />
			</svg>
		{:else if scene === "circuit"}
			<svg class="folio-folder-svg" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice">
				<g class="folio-folder-circuit">
					<path d="M18 72 H54 V40 H86" />
					<path d="M86 40 H122 V68" />
					<path d="M54 72 V88" />
					<path d="M122 68 H142" />
					<circle cx="54" cy="40" r="3" />
					<circle cx="86" cy="40" r="3" />
					<circle cx="122" cy="68" r="3" />
					<circle class="folio-folder-pulse" cx="54" cy="72" r="2.4" />
				</g>
			</svg>
		{:else if scene === "grid"}
			<svg class="folio-folder-svg" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice">
				<g class="folio-folder-gridlines">
					{#each [24, 48, 72] as y}
						<line x1="12" y1={y} x2="148" y2={y} />
					{/each}
					{#each [40, 80, 120] as x}
						<line x1={x} y1="14" x2={x} y2="90" />
					{/each}
				</g>
				<rect class="folio-folder-scan" x="12" y="14" width="136" height="8" />
			</svg>
		{:else if scene === "folio"}
			<svg class="folio-folder-svg" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice">
				<g class="folio-folder-book">
					<path d="M36 22 H124 V84 H36 Z" />
					<path d="M80 22 V84" />
					<path class="folio-folder-page" d="M80 26 H118 V78 H80" />
				</g>
			</svg>
		{:else if scene === "craft"}
			<svg class="folio-folder-svg" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice">
				<g class="folio-folder-craft">
					<path d="M42 70 L78 34 L88 44 L52 80 Z" />
					<path d="M78 34 L92 20 L102 30 L88 44" />
					<circle class="folio-folder-spark s1" cx="118" cy="30" r="1.6" />
					<circle class="folio-folder-spark s2" cx="128" cy="42" r="1.1" />
					<circle class="folio-folder-spark s3" cx="112" cy="48" r="1.3" />
				</g>
			</svg>
		{:else}
			<span class="folio-folder-cursor"></span>
		{/if}
	</div>
	<p class="folio-ink-cover-title">{label}</p>
	<span class="folio-folder-open">Open</span>
</div>
