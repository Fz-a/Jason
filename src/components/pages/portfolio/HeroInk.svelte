<script lang="ts">
	import { onMount, tick } from "svelte";

	interface Props {
		text: string;
	}

	/**
	 * Cardioid Heart — r = a(1 + cos θ), rotated into a heart.
	 * Size/placement stay quiet via CSS (.folio-ink-rose).
	 */
	const CURVE = {
		particleCount: 40,
		trailSpan: 0.3,
		durationMs: 6200,
		pulseDurationMs: 5200,
		strokeWidth: 1.3,
		cardioidA: 8.8,
		cardioidPulse: 0.8,
		cardioidScale: 2.15,
	} as const;

	function curvePoint(progress: number, detailScale: number) {
		const t = progress * Math.PI * 2;
		const a = CURVE.cardioidA + detailScale * CURVE.cardioidPulse;
		const r = a * (1 + Math.cos(t));
		const baseX = Math.cos(t) * r;
		const baseY = Math.sin(t) * r;
		return {
			x: 50 - baseY * CURVE.cardioidScale,
			y: 50 - baseX * CURVE.cardioidScale,
		};
	}

	function normalizeProgress(progress: number) {
		return ((progress % 1) + 1) % 1;
	}

	function getDetailScale(time: number) {
		const pulseProgress = (time % CURVE.pulseDurationMs) / CURVE.pulseDurationMs;
		const pulseAngle = pulseProgress * Math.PI * 2;
		return 0.52 + ((Math.sin(pulseAngle + 0.55) + 1) / 2) * 0.48;
	}

	function buildCurvePath(detailScale: number, steps = 420) {
		return Array.from({ length: steps + 1 }, (_, index) => {
			const point = curvePoint(index / steps, detailScale);
			return `${index === 0 ? "M" : "L"}${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
		}).join(" ");
	}

	let { text }: Props = $props();
	let root = $state<HTMLElement | null>(null);
	let curveGroup = $state<SVGGElement | null>(null);
	let curvePath = $state<SVGPathElement | null>(null);
	let mx = $state(0.5);
	let my = $state(0.5);
	let revealed = $state(false);
	let curveReady = $state(false);

	const particleSlots = Array.from({ length: CURVE.particleCount }, (_, i) => i);

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
			const group = curveGroup;
			const path = curvePath;
			if (!group || !path) {
				curveReady = true;
				return;
			}

			const dots = Array.from(group.querySelectorAll<SVGCircleElement>(".folio-ink-rose-dot"));

			if (reduce) {
				path.setAttribute("d", buildCurvePath(0.75));
				path.setAttribute("opacity", "0.32");
				for (const dot of dots) dot.setAttribute("opacity", "0");
				curveReady = true;
				return;
			}

			const startedAt = performance.now();
			curveReady = true;

			const render = (now: number) => {
				if (cancelled) return;
				const time = now - startedAt;
				const progress = (time % CURVE.durationMs) / CURVE.durationMs;
				const detailScale = getDetailScale(time);
				path.setAttribute("d", buildCurvePath(detailScale));

				for (let index = 0; index < dots.length; index++) {
					const node = dots[index];
					if (!node) continue;
					const tailOffset = index / Math.max(1, CURVE.particleCount - 1);
					const point = curvePoint(
						normalizeProgress(progress - tailOffset * CURVE.trailSpan),
						detailScale,
					);
					const fade = (1 - tailOffset) ** 0.56;
					node.setAttribute("cx", point.x.toFixed(2));
					node.setAttribute("cy", point.y.toFixed(2));
					node.setAttribute("r", (0.4 + fade * 1.05).toFixed(2));
					node.setAttribute("opacity", (0.07 + fade * 0.52).toFixed(3));
				}
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
	class:has-ink-rose={curveReady}
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

	<svg class="folio-ink-rose" viewBox="0 0 100 100" overflow="visible" aria-hidden="true">
		<g bind:this={curveGroup}>
			<path
				class="folio-ink-rose-path"
				bind:this={curvePath}
				fill="none"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width={CURVE.strokeWidth}
				opacity="0.18"
			></path>
			{#each particleSlots as _}
				<circle class="folio-ink-rose-dot" fill="currentColor" cx="50" cy="50" r="0" opacity="0"
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
