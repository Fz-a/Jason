"use client";

import { useEffect, useState } from "react";
import { useLocale } from "../lib/i18n";
import { isCapabilitiesRailActive } from "../lib/capabilities-rail";

export const STORY_STAGES = [
	{ id: "experience", key: "story.01", short: "01" },
	{ id: "direction", key: "story.02", short: "02" },
	{ id: "goal", key: "story.03", short: "03" },
	{ id: "research", key: "story.04", short: "04" },
	{ id: "fit", key: "story.05", short: "05" },
	{ id: "next", key: "story.06", short: "06" },
	{ id: "target", key: "story.07", short: "07" },
] as const;

type Props = {
	activeId: string;
	onNavigate: (id: string) => void;
};

export function StoryProgress({ activeId, onNavigate }: Props) {
	const { t } = useLocale();
	const [scrolled, setScrolled] = useState(false);
	/** Soften left rail while the tall Projects block owns the viewport */
	const [inProjects, setInProjects] = useState(false);

	useEffect(() => {
		const el = () => document.getElementById("experience");
		let raf = 0;
		const update = () => {
			raf = 0;
			setScrolled(window.scrollY > 120);
			const section = el();
			if (!section) {
				setInProjects(false);
				return;
			}
			const r = section.getBoundingClientRect();
			const vh = window.innerHeight;
			setInProjects((prev) => {
				const next = isCapabilitiesRailActive(r, vh, prev);
				return prev === next ? prev : next;
			});
		};
		const onScroll = () => {
			if (!raf) raf = requestAnimationFrame(update);
		};
		update();
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll);
		return () => {
			if (raf) cancelAnimationFrame(raf);
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
		};
	}, []);

	const activeIndex = STORY_STAGES.findIndex((s) => s.id === activeId);
	const shouldShow = scrolled && !inProjects;
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (!shouldShow) {
			setVisible(false);
			return;
		}
		const timer = window.setTimeout(() => setVisible(true), 120);
		return () => window.clearTimeout(timer);
	}, [shouldShow]);

	return (
		<>
			<nav
				aria-label="Presentation progress"
				className={`pointer-events-none fixed left-4 top-1/2 z-40 hidden max-w-[10.5rem] -translate-y-1/2 flex-col gap-0.5 xl:flex ${
					visible ? "opacity-100" : "pointer-events-none opacity-0"
				}`}
				style={{ transition: "opacity 700ms ease" }}
			>
				{STORY_STAGES.map((stage, i) => {
					const active = stage.id === activeId;
					return (
						<button
							key={stage.id}
							type="button"
							onClick={() => onNavigate(stage.id)}
							tabIndex={visible ? 0 : -1}
							className={`group flex items-start gap-2.5 px-1 py-1.5 text-left ${
								visible ? "pointer-events-auto" : "pointer-events-none"
							}`}
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

			<nav
				aria-label="Presentation progress"
				className={`pointer-events-none fixed inset-x-0 top-[3.25rem] z-40 flex justify-center px-3 sm:top-[3.5rem] xl:hidden ${
					visible ? "opacity-100" : "pointer-events-none opacity-0"
				}`}
				style={{ transition: "opacity 700ms ease" }}
			>
				<div
					className={`flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-[#0F4C45]/10 bg-[#F7F1E8]/92 px-2.5 py-1.5 backdrop-blur-md sm:gap-2 sm:px-3 ${
						visible ? "pointer-events-auto" : "pointer-events-none"
					}`}
				>
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
