"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "../lib/i18n";
import { isCapabilitiesRailActive } from "../lib/capabilities-rail";

export const STORY_STAGES = [
	{ id: "experience", key: "story.01", short: "01" },
	{ id: "research", key: "story.02", short: "02" },
	{ id: "goal", key: "story.03", short: "03" },
	{ id: "next", key: "story.04", short: "04" },
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
	/** Dark teal story slides need light rail type */
	const onDark = activeId === "goal";
	const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
	const [pill, setPill] = useState({ top: 0, height: 0 });

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

	// Measure the active row so the pill can slide onto it.
	const syncPill = () => {
		const el = itemRefs.current[activeIndex];
		if (!el) return;
		setPill({ top: el.offsetTop, height: el.offsetHeight });
	};
	useEffect(() => {
		syncPill();
		window.addEventListener("resize", syncPill);
		return () => window.removeEventListener("resize", syncPill);
		// eslint-disable-next-line react-hooks/exhaustive-deps -- index is the trigger
	}, [activeIndex, visible]);

	const railDim = onDark ? "rgba(247,241,232,0.42)" : "rgba(15,76,69,0.45)";

	return (
		<>
			<nav
				aria-label="Presentation progress"
				className={`fixed left-6 top-1/2 z-40 hidden xl:block ${
					visible
						? "story-rail--in opacity-100"
						: "pointer-events-none opacity-0"
				}`}
				style={{
					transform: "translateY(-50%)",
					transition: "opacity 500ms ease",
				}}
			>
				<div className="relative">
					{/* the sliding pill — one dark lozenge that glides between rows */}
					<span
						aria-hidden
						className="story-rail__pill absolute left-0 w-[3.1rem] rounded-full"
						style={{
							transform: `translateY(${pill.top}px)`,
							height: pill.height
								? `${pill.height}px`
								: "1.75rem",
							background: onDark ? "#F7F1E8" : "#043439",
							opacity: activeIndex < 0 ? 0 : 1,
						}}
					/>
					{STORY_STAGES.map((stage, i) => {
						const active = stage.id === activeId;
						return (
							<button
								key={stage.id}
								ref={(el) => {
									itemRefs.current[i] = el;
								}}
								type="button"
								onClick={() => onNavigate(stage.id)}
								tabIndex={visible ? 0 : -1}
								className={`relative flex h-7 w-[3.1rem] items-center gap-1.5 rounded-full pl-2.5 pr-2 text-left transition-colors duration-300 ${
									visible ? "pointer-events-auto" : "pointer-events-none"
								}`}
							>
								<span
									className={`font-mono text-[0.6rem] tabular-nums transition-colors duration-300 ${
										active ? "font-bold" : "font-medium"
									}`}
									style={{
										color: active
											? onDark
												? "#043439"
												: "#F7F1E8"
											: railDim,
									}}
								>
									{stage.short}
								</span>
								<span
									className={`whitespace-nowrap text-[0.68rem] tracking-tight transition-all duration-300 ${
										active ? "font-semibold" : "font-medium"
									}`}
									style={{
										color: active
											? onDark
												? "#043439"
												: "#F7F1E8"
											: railDim,
										opacity: active ? 1 : 0.72,
									}}
								>
									{t(stage.key)}
								</span>
							</button>
						);
					})}
				</div>
				{/* frame hairline tying the rows together */}
				<span
					aria-hidden
					className="mt-1 block transition-colors duration-500"
					style={{
						width: "3.1rem",
						height: 1,
						background: onDark
							? "rgba(247,241,232,0.22)"
							: "rgba(15,76,69,0.16)",
					}}
				/>
			</nav>

			<nav
				aria-label="Presentation progress"
				className={`fixed inset-x-0 top-[3.25rem] z-40 flex justify-center px-3 sm:top-[3.5rem] xl:hidden ${
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
								className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[0.65rem] font-semibold tabular-nums transition-colors duration-300 ${
									active
										? "bg-[#043439] text-[#F7F1E8]"
										: "text-[#0F4C45]/40"
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