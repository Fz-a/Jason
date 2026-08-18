<script lang="ts">
	import { onMount } from "svelte";

	type Petal = {
		id: number;
		x: number;
		delay: number;
		dur: number;
		size: number;
		drift: number;
		rot: number;
	};

	let petals = $state<Petal[]>([]);
	let enabled = $state(true);

	onMount(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			enabled = false;
			return;
		}
		petals = Array.from({ length: 7 }, (_, i) => ({
			id: i,
			x: 8 + ((i * 13) % 84),
			delay: i * 0.85,
			dur: 11 + (i % 4) * 1.6,
			size: 7 + (i % 3) * 2.5,
			drift: (i % 2 === 0 ? 1 : -1) * (18 + (i % 3) * 8),
			rot: 20 + i * 17,
		}));
	});
</script>

{#if enabled}
	<div class="folio-petals" aria-hidden="true">
		{#each petals as p}
			<span
				class="folio-petal"
				style={`
					--x: ${p.x}%;
					--delay: ${p.delay}s;
					--dur: ${p.dur}s;
					--size: ${p.size}px;
					--drift: ${p.drift}px;
					--rot: ${p.rot}deg;
				`}
			></span>
		{/each}
	</div>
{/if}
