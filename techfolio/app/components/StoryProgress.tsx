"use client";

import { useEffect, useState } from "react";
import { useLocale } from "../lib/i18n";

/** Five story chapters — hero is separate, not numbered. */
export const STORY_STAGES = [
	{ id: "experience", key: "story.01", short: "01" },
	{ id: "connection", key: "story.02", short: "02" },
	{ id: "goal", key: "story.03", short: "03" },
	{ id: "research", key: "story.04", short: "04" },
	{ id: "next", key: "story.05", short: "05" },
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
			{/* Desktop: subtle left rail */}
			<nav
				aria-label="Presentation progress"
				className={`pointer-events-none fixed left-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-1 transition-opacity duration-500 xl:flex ${
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
							className="pointer-events-auto group flex items-baseline gap-2 px-1 py-1.5 text-left"
						>
							<span
								className={`font-mono text-[0.65rem] tabular-nums transition ${
									active
										? "font-bold text-[#043439]"
										: i < activeIndex
											? "text-[#0F4C45]/45"
											: "text-[#0F4C45]/28"
								}`}
							>
								{stage.short}
							</span>
							<span
								className={`hidden text-[0.58rem] font-semibold uppercase tracking-[0.16em] transition 2xl:inline ${
									active ? "text-[#043439]" : "text-[#0F4C45]/30"
								}`}
							>
								{t(stage.key)}
							</span>
						</button>
					);
				})}
			</nav>

			{/* Mobile: compact numbers */}
			<nav
				aria-label="Presentation progress"
				className={`pointer-events-none fixed inset-x-0 top-[3.25rem] z-40 flex justify-center px-3 transition-opacity duration-500 sm:top-[3.5rem] xl:hidden ${
					visible ? "opacity-100" : "opacity-0"
				}`}
			>
				<div className="pointer-events-auto flex items-center gap-3 rounded-full border border-[#0F4C45]/10 bg-[#F7F1E8]/90 px-3.5 py-1.5 backdrop-blur-md">
					{STORY_STAGES.map((stage) => {
						const active = stage.id === activeId;
						return (
							<button
								key={stage.id}
								type="button"
								onClick={() => onNavigate(stage.id)}
								aria-label={t(stage.key)}
								className={`font-mono text-[0.68rem] tabular-nums transition ${
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
