<script lang="ts">
	import { onMount, tick } from "svelte";

	interface Props {
		text: string;
	}

	/** Archimedean spiral (Spiral Search) beside the headline. */
	function buildInkSpiralPath(): string {
		const turns = 3.1;
		const baseR = 5.2;
		const amp = 6.8;
		const pulse = 1.1;
		const scale = 0.82;
		const steps = 88;
		let d = "";
		for (let i = 0; i <= steps; i++) {
			const progress = i / steps;
			const t = progress * Math.PI * 2;
			const angle = t * turns;
			const radius = baseR + (1 - Math.cos(t)) * (amp + pulse * 0.35);
			const x = 50 + Math.cos(angle) * radius * scale;
			const y = 50 + Math.sin(angle) * radius * scale;
			d += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
		}
		return d;
	}

	const inkSpiralPath = buildInkSpiralPath();

	let { text }: Props = $props();
	let root = $state<HTMLElement | null>(null);
	let spiralPathEl = $state<SVGPathElement | null>(null);
	let mx = $state(0.5);
	let my = $state(0.5);
	let revealed = $state(false);
	let spiralDrawn = $state(false);

	onMount(() => {
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const timers: number[] = [];

		timers.push(
			window.setTimeout(() => {
				revealed = true;
			}, 180),
		);

		void (async () => {
			await tick();
			const path = spiralPathEl;
			if (!path) {
				spiralDrawn = true;
				return;
			}

			const len = path.getTotalLength();
			path.style.strokeDasharray = `${len}`;
			path.style.strokeDashoffset = `${len}`;

			if (reduce) {
				path.style.strokeDashoffset = "0";
				spiralDrawn = true;
				return;
			}

			// Force paint at hidden state, then ease the stroke in.
			path.getBoundingClientRect();
			timers.push(
				window.setTimeout(() => {
					path.style.transition = "stroke-dashoffset 1.45s cubic-bezier(0.22, 1, 0.36, 1)";
					path.style.strokeDashoffset = "0";
					spiralDrawn = true;
				}, 80),
			);
		})();

		return () => {
			for (const id of timers) window.clearTimeout(id);
		};
	});

	function onMove(e: PointerEvent) {
		if (!root) return;
		const r = root.getBoundingClientRect();
		mx = (e.clientX - r.left) / r.width;
		my = (e.clientY - r.top) / r.height;
	}
</script>

<article
	class="folio-tile folio-hero"
	class:is-revealed={revealed}
	class:has-ink-spiral={spiralDrawn}
	bind:this={root}
	style={`--bento-delay: 40ms; --mx: ${mx}; --my: ${my}`}
	onpointermove={onMove}
>
	<svg class="folio-cloud folio-cloud-a" viewBox="0 0 160 72" aria-hidden="true">
		<path
			fill="currentColor"
			d="M28 48c-10 0-18-6-18-14s8-14 18-12c2-10 12-16 22-14 4-8 14-12 24-8 8-6 20-4 26 4 12-2 22 6 22 16 10 0 18 8 16 18H28z"
			opacity="0.12"
		></path>
		<path
			fill="none"
			stroke="currentColor"
			stroke-width="1.4"
			d="M34 50c-8-.5-14-5-14-11 0-6 5-11 13-10 1-8 9-13 18-11 4-6 12-9 20-6 7-5 17-3 22 4 10-1 18 6 17 14"
			opacity="0.5"
		></path>
	</svg>
	<svg class="folio-cloud folio-cloud-b" viewBox="0 0 120 56" aria-hidden="true">
		<path
			fill="none"
			stroke="currentColor"
			stroke-width="1.2"
			d="M18 40c-6 0-12-4-12-9s5-9 12-8c1-7 8-11 15-9 3-5 10-8 16-5 5-4 13-3 17 3 8-1 14 4 14 11"
			opacity="0.35"
		></path>
	</svg>

	<svg class="folio-ink-spiral" viewBox="0 0 100 100" aria-hidden="true">
		<path
			class="folio-ink-spiral-path"
			bind:this={spiralPathEl}
			fill="none"
			d={inkSpiralPath}
		></path>
	</svg>

	<div class="folio-ink-wash" aria-hidden="true"></div>

	<h1 class="folio-headline folio-headline-zh">
		{#each [...text] as char, i}
			<span class="folio-char" style={`--i: ${i}`}>{char}</span>
		{/each}
	</h1>
	<span class="folio-brush-line" aria-hidden="true"></span>
</article>
