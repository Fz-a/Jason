"use client";

import { useEffect, useState } from "react";
import { useLocale } from "../lib/i18n";

/** Six story chapters — hero is separate. */
export const STORY_STAGES = [
	{ id: "experience", key: "story.01", short: "01" },
	{ id: "direction", key: "story.02", short: "02" },
	{ id: "goal", key: "story.03", short: "03" },
	{ id: "research", key: "story.04", short: "04" },
	{ id: "fit", key: "story.05", short: "05" },
	{ id: "next", key: "story.06", short: "06" },
] as const;

type Props = {
	activeId: string;
	onNavigate: (id: string) => void;
};

export function StoryProgress({ activeId, onNavigate }: Props) {
	const { t } = useLocale();
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const onScroll = () => setVisible(window.scrollY > 120);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const activeIndex = STORY_STAGES.findIndex((s) => s.id === activeId);

	return (
		<>
			{/* Desktop: number + full chapter title */}
			<nav
				aria-label="Presentation progress"
				className={`pointer-events-none fixed left-4 top-1/2 z-40 hidden max-w-[11rem] -translate-y-1/2 flex-col gap-0.5 transition-opacity duration-500 xl:flex ${
					visible ? "opacity-100" : "opacity-0"
				}`}
			>
				{STORY_STAGES.map((stage, i) => {
					const active = stage.id === activeId;
					return (
						<button
							key={stage.id}
							type="button"
							onClick={() => onNavigate(stage.id)}
							className="pointer-events-auto group flex items-start gap-2.5 px-1 py-1.5 text-left"
						>
							<span
								className={`mt-0.5 shrink-0 font-mono text-[0.65rem] tabular-nums transition ${
									active
										? "font-bold text-[#043439]"
										: i < activeIndex
											? "text-[#0F4C45]/50"
											: "text-[#0F4C45]/28"
								}`}
							>
								{stage.short}
							</span>
							<span
								className={`text-[0.68rem] font-semibold leading-snug tracking-tight transition ${
									active
										? "text-[#043439]"
										: "text-[#0F4C45]/40 group-hover:text-[#0F4C45]/70"
								}`}
							>
								{t(stage.key)}
							</span>
						</button>
					);
				})}
			</nav>

			{/* Mobile: compact — numbers with aria labels */}
			<nav
				aria-label="Presentation progress"
				className={`pointer-events-none fixed inset-x-0 top-[3.25rem] z-40 flex justify-center px-3 transition-opacity duration-500 sm:top-[3.5rem] xl:hidden ${
					visible ? "opacity-100" : "opacity-0"
				}`}
			>
				<div className="pointer-events-auto flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-[#0F4C45]/10 bg-[#F7F1E8]/92 px-2.5 py-1.5 backdrop-blur-md sm:gap-2 sm:px-3">
					{STORY_STAGES.map((stage) => {
						const active = stage.id === activeId;
						return (
							<button
								key={stage.id}
								type="button"
								onClick={() => onNavigate(stage.id)}
								aria-label={t(stage.key)}
								title={t(stage.key)}
								className={`shrink-0 font-mono text-[0.65rem] tabular-nums transition ${
									active
										? "font-bold text-[#043439]"
										: "text-[#0F4C45]/35"
								}`}
							>
								{stage.short}
							</button>
						);
					})}
				</div>
			</nav>
		</>
	);
}
