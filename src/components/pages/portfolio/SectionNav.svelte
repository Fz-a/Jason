<script lang="ts">
	export type SectionNavItem = {
		id: string;
		title: string;
		href: string;
		accent?: string;
	};

	interface Props {
		items: SectionNavItem[];
	}

	/** Hardcoded seal previews — always served from /public/portfolio */
	const COVERS: Record<string, string> = {
		knowledge: "/portfolio/nav-knowledge.jpg",
		projects: "/portfolio/nav-projects.jpg",
		works: "/portfolio/nav-works.jpg",
		life: "/portfolio/nav-life.jpg",
	};

	let { items }: Props = $props();
	let activeId = $state(items[0]?.id ?? "knowledge");

	let active = $derived(items.find((item) => item.id === activeId) ?? items[0]);
</script>

<div class="folio-section-nav">
	<div class="folio-section-preview" aria-hidden="true">
		{#each items as item}
			{@const src = COVERS[item.id]}
			<div
				class="folio-section-preview-frame"
				class:is-active={item.id === active?.id}
				style={`--tile-accent: ${item.accent || "var(--folio-placeholder)"};${src ? ` background-image: url('${src}');` : ""}`}
			>
				{#if src}
					<img
						src={src}
						alt=""
						class="folio-section-preview-img"
						width="1280"
						height="800"
						decoding="async"
					/>
				{:else}
					<span class="folio-section-preview-ph"></span>
				{/if}
			</div>
		{/each}
	</div>

	<nav class="folio-project-list" aria-label="Sections">
		{#each items as item}
			<a
				href={item.href}
				class="folio-project-link"
				class:is-active={item.id === activeId}
				onmouseenter={() => (activeId = item.id)}
				onfocus={() => (activeId = item.id)}
			>
				<span class="folio-project-name">{item.title}</span>
				<span class="folio-ink-mark" aria-hidden="true"></span>
			</a>
		{/each}
	</nav>
</div>
