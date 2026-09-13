"use client";

import { useEffect, useState } from "react";
import { useLocale } from "../lib/i18n";

export const STORY_STAGES = [
	{ id: "home", key: "story.01", short: "01" },
	{ id: "experience", key: "story.02", short: "02" },
	{ id: "connection", key: "story.03", short: "03" },
	{ id: "target", key: "story.04", short: "04" },
	{ id: "research", key: "story.05", short: "05" },
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
		const onScroll = () => setVisible(window.scrollY > 80);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const activeIndex = Math.max(
		0,
		STORY_STAGES.findIndex((s) => s.id === activeId),
	);

	return (
		<>
			{/* Desktop: left rail */}
			<nav
				aria-label="Presentation progress"
				className={`pointer-events-none fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-0.5 transition-opacity duration-300 xl:flex ${
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
							className={`pointer-events-auto group flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition ${
								active ? "bg-[#043439]/8" : "hover:bg-[#0F4C45]/6"
							}`}
						>
							<span
								className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.62rem] font-bold ${
									active
										? "bg-[#043439] text-white"
										: i < activeIndex
											? "bg-[#0F4C45]/20 text-[#0F4C45]"
											: "border border-[#0F4C45]/20 text-[#0F4C45]/45"
								}`}
							>
								{stage.short}
							</span>
							<span
								className={`hidden text-[0.62rem] font-semibold uppercase tracking-[0.14em] 2xl:block ${
									active ? "text-[#043439]" : "text-[#0F4C45]/45"
								}`}
							>
								{t(stage.key)}
							</span>
						</button>
					);
				})}
			</nav>

			{/* Mobile / tablet: top compact bar */}
			<nav
				aria-label="Presentation progress"
				className={`pointer-events-none fixed inset-x-0 top-[3.6rem] z-40 flex justify-center px-3 transition-opacity duration-300 sm:top-[4.2rem] xl:hidden ${
					visible ? "opacity-100" : "opacity-0"
				}`}
			>
				<div className="pointer-events-auto flex items-center gap-1 rounded-full border border-[#0F4C45]/12 bg-[#F7F1E8]/92 px-2.5 py-1.5 shadow-[0_8px_24px_rgba(22,43,38,0.08)] backdrop-blur-md sm:gap-1.5 sm:px-3">
					{STORY_STAGES.map((stage, i) => {
						const active = stage.id === activeId;
						return (
							<button
								key={stage.id}
								type="button"
								onClick={() => onNavigate(stage.id)}
								aria-label={t(stage.key)}
								className="flex items-center gap-1"
							>
								<span
									className={`flex h-5 w-5 items-center justify-center rounded-full text-[0.58rem] font-bold transition sm:h-6 sm:w-6 sm:text-[0.62rem] ${
										active
											? "bg-[#043439] text-white"
											: "text-[#0F4C45]/50"
									}`}
								>
									{stage.short}
								</span>
								{i < STORY_STAGES.length - 1 ? (
									<span
										aria-hidden
										className={`h-px w-2 sm:w-3 ${
											i < activeIndex ? "bg-[#0F4C45]/35" : "bg-[#0F4C45]/15"
										}`}
									/>
								) : null}
							</button>
						);
					})}
				</div>
			</nav>
		</>
	);
}
