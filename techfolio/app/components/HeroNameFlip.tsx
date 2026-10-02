"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

const EN = "Jason";
const ZH = "陈进阳";

/** Seconds the name rests between rolls (roll ≈ 0.6s → ~3s cycle). */
const HOLD = 2.45;

function Chars({ text, lang }: { text: string; lang: "en" | "zh" }) {
	return (
		<span
			className={`hero-name-roll__line hero-name-roll__line--${lang}`}
			aria-hidden="true"
		>
			{text.split("").map((ch, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: static char list
				<span key={i} className="hero-name-roll__char">
					{ch === " " ? "\u00A0" : ch}
				</span>
			))}
		</span>
	);
}

/**
 * Rolling-text name cycler (GSAP "rolling text" style): each character rolls
 * like a slot machine — the active word's chars tumble out the top while the
 * next word's chars roll in from below, staggered left-to-right. Auto-swaps
 * every ~3s and loops forever.
 */
export function HeroNameFlip() {
	const rootRef = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		const root = rootRef.current;
		if (!root) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		const ctx = gsap.context(() => {
			const en = gsap.utils.toArray<HTMLElement>(
				".hero-name-roll__line--en .hero-name-roll__char",
			);
			const zh = gsap.utils.toArray<HTMLElement>(
				".hero-name-roll__line--zh .hero-name-roll__char",
			);
			// ZH waits below the viewport mask.
			gsap.set(zh, { yPercent: 160, rotation: -14 });

			gsap.timeline({ repeat: -1, defaults: { ease: "power3.inOut" } })
				// EN rolls out the top, ZH rolls in from below (LTR wave).
				.to(en, {
					yPercent: -160,
					rotation: 14,
					duration: 0.55,
					stagger: 0.045,
				})
				.to(
					zh,
					{ yPercent: 0, rotation: 0, duration: 0.55, stagger: 0.045 },
					"<0.08",
				)
				// …hold ~3s…
				.to({}, { duration: HOLD })
				// Park EN below the mask, then ZH out / EN in.
				.set(en, { yPercent: 160, rotation: -14 })
				.to(zh, {
					yPercent: -160,
					rotation: 14,
					duration: 0.55,
					stagger: 0.045,
				})
				.to(
					en,
					{ yPercent: 0, rotation: 0, duration: 0.55, stagger: 0.045 },
					"<0.08",
				)
				.to({}, { duration: HOLD });
		}, root);

		return () => ctx.revert();
	}, []);

	return (
		<span
			ref={rootRef}
			aria-label={`${EN} (${ZH})`}
			className="hero-name-roll relative inline-flex items-center"
		>
			<span className="hero-name-roll__shell">
				<span className="hero-name-roll__sizer" aria-hidden="true">
					<span className="hero-name-roll__sizer-en">{EN}</span>
					<span className="hero-name-roll__sizer-zh">{ZH}</span>
				</span>
				<span className="hero-name-roll__viewport">
					<Chars text={EN} lang="en" />
					<Chars text={ZH} lang="zh" />
				</span>
			</span>
		</span>
	);
}
