<script lang="ts">
	import { onMount, tick } from "svelte";

	interface Props {
		text: string;
	}

	/**
	 * Rose Three — r = a cos(3θ).
	 * Sized to stay secondary to the headline, but still readable as ink.
	 */
	const ROSE = {
		particleCount: 32,
		trailSpan: 0.24,
		durationMs: 6000,
		rotationDurationMs: 36000,
		pulseDurationMs: 5200,
		strokeWidth: 1.25,
		roseA: 8.6,
		roseABoost: 0.35,
		roseBreathBase: 0.76,
		roseBreathBoost: 0.16,
		roseScale: 2.85,
	} as const;

	function rosePoint(progress: number, detailScale: number) {
		const t = progress * Math.PI * 2;
		const a = ROSE.roseA + detailScale * ROSE.roseABoost;
		const r =
			a * (ROSE.roseBreathBase + detailScale * ROSE.roseBreathBoost) * Math.cos(3 * t);
		return {
			x: 50 + Math.cos(t) * r * ROSE.roseScale,
			y: 50 + Math.sin(t) * r * ROSE.roseScale,
		};
	}

	function normalizeProgress(progress: number) {
		return ((progress % 1) + 1) % 1;
	}

	function getDetailScale(time: number) {
		const pulseProgress = (time % ROSE.pulseDurationMs) / ROSE.pulseDurationMs;
		const pulseAngle = pulseProgress * Math.PI * 2;
		return 0.78 + ((Math.sin(pulseAngle + 0.55) + 1) / 2) * 0.22;
	}

	function getRotation(time: number) {
		return -((time % ROSE.rotationDurationMs) / ROSE.rotationDurationMs) * 360;
	}

	function buildRosePath(detailScale: number, steps = 360) {
		return Array.from({ length: steps + 1 }, (_, index) => {
			const point = rosePoint(index / steps, detailScale);
			return `${index === 0 ? "M" : "L"}${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
		}).join(" ");
	}

	let { text }: Props = $props();
	let root = $state<HTMLElement | null>(null);
	let roseGroup = $state<SVGGElement | null>(null);
	let rosePath = $state<SVGPathElement | null>(null);
	let mx = $state(0.5);
	let my = $state(0.5);
	let revealed = $state(false);
	let roseReady = $state(false);

	const particleSlots = Array.from({ length: ROSE.particleCount }, (_, i) => i);

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
			const group = roseGroup;
			const path = rosePath;
			if (!group || !path) {
				roseReady = true;
				return;
			}

			const dots = Array.from(group.querySelectorAll<SVGCircleElement>(".folio-ink-rose-dot"));

			if (reduce) {
				path.setAttribute("d", buildRosePath(0.85));
				path.setAttribute("opacity", "0.35");
				for (const dot of dots) dot.setAttribute("opacity", "0");
				roseReady = true;
				return;
			}

			const startedAt = performance.now();
			roseReady = true;

			const render = (now: number) => {
				if (cancelled) return;
				const time = now - startedAt;
				const progress = (time % ROSE.durationMs) / ROSE.durationMs;
				const detailScale = getDetailScale(time);
				group.setAttribute("transform", `rotate(${getRotation(time)} 50 50)`);
				path.setAttribute("d", buildRosePath(detailScale));

				for (let index = 0; index < dots.length; index++) {
					const node = dots[index];
					if (!node) continue;
					const tailOffset = index / Math.max(1, ROSE.particleCount - 1);
					const point = rosePoint(
						normalizeProgress(progress - tailOffset * ROSE.trailSpan),
						detailScale,
					);
					const fade = (1 - tailOffset) ** 0.56;
					node.setAttribute("cx", point.x.toFixed(2));
					node.setAttribute("cy", point.y.toFixed(2));
					node.setAttribute("r", (0.45 + fade * 1.15).toFixed(2));
					node.setAttribute("opacity", (0.08 + fade * 0.55).toFixed(3));
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
	class:has-ink-rose={roseReady}
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
		<g bind:this={roseGroup}>
			<path
				class="folio-ink-rose-path"
				bind:this={rosePath}
				fill="none"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width={ROSE.strokeWidth}
				opacity="0.2"
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
