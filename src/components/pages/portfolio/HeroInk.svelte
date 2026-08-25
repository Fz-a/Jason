<script lang="ts">
	import { onMount, tick } from "svelte";

	interface Props {
		text: string;
	}

	/** Quiet particle trails that travel along the cloud outlines. */
	const TRAIL = {
		countA: 22,
		countB: 16,
		span: 0.34,
		durationMs: 7800,
		durationMsB: 9200,
	} as const;

	const CLOUD_STROKE_A =
		"M34 50c-8-.5-14-5-14-11 0-6 5-11 13-10 1-8 9-13 18-11 4-6 12-9 20-6 7-5 17-3 22 4 10-1 18 6 17 14";
	const CLOUD_STROKE_B =
		"M18 40c-6 0-12-4-12-9s5-9 12-8c1-7 8-11 15-9 3-5 10-8 16-5 5-4 13-3 17 3 8-1 14 4 14 11";

	function normalizeProgress(progress: number) {
		return ((progress % 1) + 1) % 1;
	}

	function placeTrail(
		path: SVGPathElement,
		dots: SVGCircleElement[],
		progress: number,
		span: number,
	) {
		const len = path.getTotalLength();
		if (len <= 0 || dots.length === 0) return;
		for (let index = 0; index < dots.length; index++) {
			const node = dots[index];
			if (!node) continue;
			const tailOffset = index / Math.max(1, dots.length - 1);
			const t = normalizeProgress(progress - tailOffset * span);
			const point = path.getPointAtLength(t * len);
			const fade = (1 - tailOffset) ** 0.56;
			node.setAttribute("cx", point.x.toFixed(2));
			node.setAttribute("cy", point.y.toFixed(2));
			node.setAttribute("r", (0.55 + fade * 1.35).toFixed(2));
			node.setAttribute("opacity", (0.06 + fade * 0.48).toFixed(3));
		}
	}

	let { text }: Props = $props();
	let root = $state<HTMLElement | null>(null);
	let guideA = $state<SVGPathElement | null>(null);
	let guideB = $state<SVGPathElement | null>(null);
	let mx = $state(0.5);
	let my = $state(0.5);
	let revealed = $state(false);

	const slotsA = Array.from({ length: TRAIL.countA }, (_, i) => i);
	const slotsB = Array.from({ length: TRAIL.countB }, (_, i) => i);

	onMount(() => {
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		let raf = 0;
		let cancelled = false;
		const revealTimer = window.setTimeout(() => {
			revealed = true;
		}, 180);

		void (async () => {
			await tick();
			if (cancelled) return;
			const pathA = guideA;
			const pathB = guideB;
			if (!pathA || !pathB || !root) return;

			const dotsA = Array.from(
				root.querySelectorAll<SVGCircleElement>(".folio-cloud-trail-a .folio-cloud-dot"),
			);
			const dotsB = Array.from(
				root.querySelectorAll<SVGCircleElement>(".folio-cloud-trail-b .folio-cloud-dot"),
			);

			if (reduce) {
				// Static soft dots along the midpoints of each trail.
				placeTrail(pathA, dotsA, 0.55, TRAIL.span);
				placeTrail(pathB, dotsB, 0.4, TRAIL.span);
				for (const node of [...dotsA, ...dotsB]) {
					node.setAttribute("opacity", "0.22");
					node.setAttribute("r", "0.9");
				}
				return;
			}

			const startedAt = performance.now();
			const render = (now: number) => {
				if (cancelled) return;
				const time = now - startedAt;
				const progressA = (time % TRAIL.durationMs) / TRAIL.durationMs;
				const progressB = (time % TRAIL.durationMsB) / TRAIL.durationMsB;
				placeTrail(pathA, dotsA, progressA, TRAIL.span);
				placeTrail(pathB, dotsB, progressB, TRAIL.span);
				raf = requestAnimationFrame(render);
			};
			raf = requestAnimationFrame(render);
		})();

		return () => {
			cancelled = true;
			window.clearTimeout(revealTimer);
			cancelAnimationFrame(raf);
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
	bind:this={root}
	style={`--bento-delay: 40ms; --mx: ${mx}; --my: ${my}`}
	onpointermove={onMove}
>
	<svg class="folio-cloud folio-cloud-a" viewBox="0 0 160 72" aria-hidden="true">
		<path
			class="folio-cloud-fill"
			fill="currentColor"
			d="M28 48c-10 0-18-6-18-14s8-14 18-12c2-10 12-16 22-14 4-8 14-12 24-8 8-6 20-4 26 4 12-2 22 6 22 16 10 0 18 8 16 18H28z"
			opacity="0.1"
		></path>
		<path
			class="folio-cloud-guide"
			bind:this={guideA}
			fill="none"
			stroke="currentColor"
			stroke-width="1.15"
			stroke-linecap="round"
			stroke-linejoin="round"
			opacity="0.22"
			d={CLOUD_STROKE_A}
		></path>
		<g class="folio-cloud-trail folio-cloud-trail-a">
			{#each slotsA as _}
				<circle class="folio-cloud-dot" fill="currentColor" cx="0" cy="0" r="0" opacity="0"
				></circle>
			{/each}
		</g>
	</svg>

	<svg class="folio-cloud folio-cloud-b" viewBox="0 0 120 56" aria-hidden="true">
		<path
			class="folio-cloud-guide"
			bind:this={guideB}
			fill="none"
			stroke="currentColor"
			stroke-width="1.05"
			stroke-linecap="round"
			stroke-linejoin="round"
			opacity="0.18"
			d={CLOUD_STROKE_B}
		></path>
		<g class="folio-cloud-trail folio-cloud-trail-b">
			{#each slotsB as _}
				<circle class="folio-cloud-dot" fill="currentColor" cx="0" cy="0" r="0" opacity="0"
				></circle>
			{/each}
		</g>
	</svg>

	<div class="folio-ink-wash" aria-hidden="true"></div>

	<h1 class="folio-headline folio-headline-zh">
		{#each [...text] as char, i}
			<span class="folio-char" style={`--i: ${i}`}>{char}</span>
		{/each}
	</h1>
	<span class="folio-brush-line" aria-hidden="true"></span>
</article>
