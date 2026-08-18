<script lang="ts">
	interface Props {
		src: string;
		name: string;
	}

	let { src, name }: Props = $props();
</script>

<article class="folio-tile folio-portrait" style="--bento-delay: 90ms">
	{#if src}
		<img
			src={src}
			alt={name}
			class="folio-portrait-img"
			loading="eager"
			fetchpriority="high"
			width="2048"
			height="2048"
			draggable="false"
		/>
	{:else}
		<div class="folio-portrait-fallback">{name.slice(0, 1)}</div>
	{/if}
</article>
