"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "../lib/i18n";

const STEPS = [
	{
		id: "experience",
		num: "01",
		titleKey: "agenda.c1.title",
		blurbKey: "agenda.c1.blurb",
		tagKey: "agenda.c1.tag",
		tone: "a",
	},
	{
		id: "goal",
		num: "02",
		titleKey: "agenda.c2.title",
		blurbKey: "agenda.c2.blurb",
		tagKey: "agenda.c2.tag",
		tone: "b",
	},
	{
		id: "research",
		num: "03",
		titleKey: "agenda.c3.title",
		blurbKey: "agenda.c3.blurb",
		tagKey: "agenda.c3.tag",
		tone: "c",
	},
	{
		id: "next",
		num: "04",
		titleKey: "agenda.c4.title",
		blurbKey: "agenda.c4.blurb",
		tagKey: "agenda.c4.tag",
		tone: "d",
	},
] as const;

type Props = {
	onNavigate?: (id: string) => void;
};

export function AgendaSection({ onNavigate }: Props) {
	const { t } = useLocale();
	const rootRef = useRef<HTMLElement>(null);
	const [visible, setVisible] = useState(false);
	const [hot, setHot] = useState<string | null>(null);

	useEffect(() => {
		const el = rootRef.current;
		if (!el) return;
		const io = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) setVisible(true);
			},
			{ threshold: 0.25 },
		);
		io.observe(el);
		return () => io.disconnect();
	}, []);

	const go = (id: string) => {
		if (onNavigate) onNavigate(id);
		else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<section
			ref={rootRef}
			id="agenda"
			className={`agenda-slide story-slide relative overflow-hidden bg-[#043439] ${
				visible ? "agenda-slide--in" : ""
			}`}
		>
			<div className="story-slide__body relative z-[1] flex flex-col px-0 py-0">
				{/* Title strip */}
				<div className="agenda-slide__head shrink-0 px-6 pt-7 sm:px-10 sm:pt-9 lg:px-14">
					<p className="flex items-baseline gap-3">
						<span className="text-[1.85rem] font-extrabold tracking-tight text-white sm:text-[2.35rem]">
							{t("agenda.word")}
						</span>
						<span className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-white/40">
							/ {t("agenda.wordEn")}
						</span>
					</p>
				</div>

				{/* Chevron flow */}
				<nav
					aria-label={t("agenda.nav")}
					className="agenda-chevrons relative mt-5 flex min-h-0 flex-1 items-stretch px-0 sm:mt-6"
				>
					{STEPS.map((step, i) => {
						const isHot = hot === step.id;
						const isFirst = i === 0;
						return (
							<button
								key={step.id}
								type="button"
								className={`agenda-chevron agenda-chevron--${step.tone} group relative flex min-h-0 min-w-0 flex-1 cursor-pointer flex-col items-center justify-center text-center text-white outline-none focus-visible:z-30 ${
									isHot ? "agenda-chevron--hot" : ""
								} ${isFirst ? "agenda-chevron--first" : ""}`}
								style={{ ["--i" as string]: String(i) }}
								onClick={() => go(step.id)}
								onMouseEnter={() => setHot(step.id)}
								onMouseLeave={() => setHot(null)}
								onFocus={() => setHot(step.id)}
								onBlur={() => setHot(null)}
							>
								<span className="agenda-chevron__shade pointer-events-none absolute inset-0" />
								<span className="relative z-[1] flex flex-col items-center px-4 sm:px-5 md:px-6">
									<span
										className={`font-mono text-[2.4rem] font-extrabold leading-none tracking-tight sm:text-[3.2rem] md:text-[3.8rem] lg:text-[4.2rem] ${
											step.tone === "d" ? "text-[#123834]" : "text-white"
										}`}
									>
										{step.num}
									</span>
									<span
										className={`mt-4 text-[1.05rem] font-extrabold tracking-tight sm:mt-5 sm:text-[1.25rem] md:text-[1.4rem] ${
											step.tone === "d" ? "text-[#123834]" : "text-white"
										}`}
									>
										{t(step.titleKey)}
									</span>
									<span
										className={`mt-3 max-w-[13rem] text-[0.72rem] font-medium leading-5 tracking-[0.02em] sm:mt-3.5 sm:text-[0.78rem] sm:leading-6 ${
											step.tone === "d"
												? "text-[#123834]/38"
												: "text-white/32"
										}`}
									>
										{t(step.blurbKey)}
									</span>
								</span>
							</button>
						);
					})}
				</nav>

				<p className="agenda-slide__hint shrink-0 px-6 py-4 text-[0.58rem] font-medium uppercase tracking-[0.2em] text-white/28 sm:px-10 lg:px-14">
					{t("agenda.hint")}
				</p>
			</div>
		</section>
	);
}
