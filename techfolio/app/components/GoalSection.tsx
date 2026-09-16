"use client";

import { useEffect, useState } from "react";
import { useLocale } from "../lib/i18n";
import { LayoutText } from "../lib/use-page-layout";

type NodeId = "now" | "grad" | "vision";

const NOW_ITEMS = [
	{ n: "01", title: "goal.panel.now.i1.title", tags: "goal.panel.now.i1.tags" },
	{ n: "02", title: "goal.panel.now.i2.title", tags: "goal.panel.now.i2.tags" },
	{ n: "03", title: "goal.panel.now.i3.title", tags: "goal.panel.now.i3.tags" },
	{ n: "04", title: "goal.panel.now.i4.title", tags: "goal.panel.now.i4.tags" },
] as const;

const GRAD_BLOCKS = [
	{
		label: "goal.panel.grad.research.label",
		body: "goal.panel.grad.research.body",
	},
	{
		label: "goal.panel.grad.academic.label",
		lines: [
			"goal.panel.grad.academic.l1",
			"goal.panel.grad.academic.l2",
			"goal.panel.grad.academic.l3",
		],
	},
	{
		label: "goal.panel.grad.english.label",
		lines: ["goal.panel.grad.english.l1", "goal.panel.grad.english.l2"],
	},
] as const;

const NAV = [
	{
		id: "now" as const,
		num: "01",
		titleKey: "goal.path.current",
		blurbKey: "goal.current.dest",
	},
	{
		id: "grad" as const,
		num: "02",
		titleKey: "goal.path.grad",
		blurbKey: "goal.grad.title",
	},
	{
		id: "vision" as const,
		num: "03",
		titleKey: "goal.path.vision",
		blurbKey: "goal.flag.vision.blurb",
	},
] as const;

/**
 * Split editorial: MY GOAL + left index / right stage pane.
 * Click switches content in place with a quiet fade.
 */
export function GoalSection() {
	const { t } = useLocale();
	const [active, setActive] = useState<NodeId>("now");
	const [visible, setVisible] = useState(true);

	const select = (id: NodeId) => {
		if (id === active) return;
		setVisible(false);
		window.setTimeout(() => {
			setActive(id);
			setVisible(true);
		}, 220);
	};

	useEffect(() => {
		setVisible(true);
	}, []);

	const goProjects = () => {
		document
			.getElementById("experience")
			?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<section id="goal" className="goal-slide story-slide bg-[#043439] text-white">
			<div className="story-slide__body goal-slide__body !justify-start px-5 py-6 sm:px-8 sm:py-7 md:px-11 lg:px-14 lg:py-9">
				<div className="goal-split mx-auto flex h-full w-full max-w-[1180px] flex-col xl:max-w-[1260px]">
					{/* Title — slightly lower */}
					<header className="shrink-0 pt-[2.5vh] sm:pt-[3.5vh] lg:pt-[4.5vh]">
						<p className="text-[0.58rem] font-medium uppercase tracking-[0.3em] text-white/34">
							<LayoutText k="goal.kicker" />
						</p>
						<h2 className="mt-3 text-[clamp(2.5rem,6.5vw,5.25rem)] font-semibold uppercase leading-[0.94] tracking-[-0.045em] text-white">
							<LayoutText k="goal.headline" />
						</h2>
						<p className="mt-4 max-w-[22rem] text-[0.74rem] leading-[1.65] text-white/34">
							<LayoutText k="goal.lede" multiline />
						</p>
					</header>

					{/* Golden-ratio split: ~38.2% | 61.8% */}
					<div className="goal-split__body mt-5 flex min-h-0 flex-1 flex-col gap-8 lg:mt-2 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.618fr)] lg:items-stretch lg:gap-0">
						{/* Left: three titles — slightly lower, vertically centered as a group */}
						<nav
							aria-label={t("goal.path.nav")}
							className="goal-split__navlist flex shrink-0 flex-col justify-center gap-11 self-stretch pb-[8vh] pt-[2vh] sm:gap-12 lg:gap-14 lg:pb-[10vh] lg:pt-[3vh] lg:pr-8 xl:pr-10"
						>
							{NAV.map((item) => {
								const on = active === item.id;
								return (
									<button
										key={item.id}
										type="button"
										aria-current={on ? "true" : undefined}
										onClick={() => select(item.id)}
										className={`goal-split__nav group w-full max-w-[17rem] text-left transition duration-[420ms] ease-out ${
											on
												? "translate-x-1 opacity-100"
												: "opacity-35 hover:opacity-70"
										}`}
									>
										<p className="flex items-baseline gap-2 text-[0.55rem] font-medium uppercase tracking-[0.2em] text-white/40">
											<span className="w-5 shrink-0 font-mono tabular-nums text-white/28">
												{item.num}
											</span>
											<span>
												— <LayoutText k={item.titleKey} />
											</span>
										</p>
										<p
											className={`mt-2 pl-7 text-[0.95rem] font-semibold leading-snug tracking-[-0.015em] sm:text-[1.05rem] ${
												on ? "text-white" : "text-white/70"
											}`}
										>
											<LayoutText k={item.blurbKey} />
										</p>
									</button>
								);
							})}
						</nav>

						{/* Right: detail — shifted right/up, fully centered in the pane */}
						<div className="goal-split__stage relative flex min-h-0 min-w-0 items-center justify-center self-stretch border-t border-white/[0.08] pt-7 lg:border-t-0 lg:border-l lg:border-white/[0.1] lg:pt-0 lg:pl-24 lg:pr-2 xl:pl-32 xl:pr-4 2xl:pl-36">
							<div
								className={`goal-split__pane w-full max-w-[28rem] -translate-y-12 transition-opacity duration-[420ms] ease-out sm:-translate-y-14 lg:-translate-y-16 ${
									visible ? "opacity-100" : "opacity-0"
								}`}
							>
								{active === "now" ? (
									<div>
										<p className="text-[0.55rem] font-medium uppercase tracking-[0.22em] text-white/32">
											01 — {t("goal.path.current")}
										</p>
										<h3 className="mt-3 text-[clamp(1.35rem,2.2vw,1.85rem)] font-semibold uppercase leading-[1.1] tracking-[-0.03em] text-white">
											{t("goal.panel.now.title")}
										</h3>
										<p className="mt-3 max-w-[26rem] whitespace-pre-line text-[0.8rem] leading-[1.65] text-white/40">
											{t("goal.panel.now.lede")}
										</p>
										<ul className="mt-7 space-y-4">
											{NOW_ITEMS.map((item) => (
												<li
													key={item.n}
													className="grid grid-cols-[1.5rem_1fr] gap-2.5"
												>
													<span className="pt-0.5 font-mono text-[0.6rem] text-white/28">
														{item.n}
													</span>
													<span>
														<span className="block text-[0.88rem] font-medium text-white/85">
															{t(item.title)}
														</span>
														<span className="mt-0.5 block text-[0.64rem] text-white/30">
															{t(item.tags)}
														</span>
													</span>
												</li>
											))}
										</ul>
										<button
											type="button"
											onClick={goProjects}
											className="mt-8 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[#F7F1E8] transition hover:opacity-70"
										>
											{t("goal.panel.now.cta")}
										</button>
									</div>
								) : null}

								{active === "grad" ? (
									<div>
										<p className="text-[0.55rem] font-medium uppercase tracking-[0.22em] text-white/32">
											02 — {t("goal.path.grad")}
										</p>
										<h3 className="mt-3 text-[clamp(1.35rem,2.2vw,1.85rem)] font-semibold uppercase leading-[1.1] tracking-[-0.03em] text-white">
											{t("goal.panel.grad.title")}
										</h3>
										{GRAD_BLOCKS.map((block) => (
											<div key={block.label} className="mt-5">
												<p className="text-[0.55rem] font-medium uppercase tracking-[0.18em] text-white/30">
													{t(block.label)}
												</p>
												{"body" in block && block.body ? (
													<p className="mt-2 max-w-[26rem] whitespace-pre-line text-[0.8rem] leading-[1.6] text-white/55">
														{t(block.body)}
													</p>
												) : null}
												{"lines" in block && block.lines
													? block.lines.map((line) => (
															<p
																key={line}
																className="mt-1.5 text-[0.8rem] leading-6 text-white/55"
															>
																{t(line)}
															</p>
														))
													: null}
											</div>
										))}
										<div className="mt-5">
											<p className="text-[0.55rem] font-medium uppercase tracking-[0.18em] text-white/30">
												{t("goal.panel.grad.direction.label")}
											</p>
											<p className="mt-2 whitespace-pre-line text-[0.78rem] leading-[1.7] text-white/45">
												{t("goal.panel.grad.direction.chain")}
											</p>
										</div>
										<p className="mt-7 text-[1rem] font-semibold tracking-[-0.02em] text-[#F7F1E8]">
											{t("goal.panel.grad.footer")}
										</p>
									</div>
								) : null}

								{active === "vision" ? (
									<div>
										<p className="text-[0.55rem] font-medium uppercase tracking-[0.22em] text-white/32">
											03 — {t("goal.path.vision")}
										</p>
										<h3 className="mt-4 max-w-[14ch] text-[clamp(1.45rem,2.6vw,2.15rem)] font-semibold uppercase leading-[1.1] tracking-[-0.03em] text-white">
											<LayoutText k="goal.vision.title" multiline />
										</h3>
										<p className="mt-5 max-w-[26rem] text-[0.84rem] leading-[1.7] text-white/45">
											<LayoutText k="goal.panel.vision.p1" multiline />
										</p>
										<p className="mt-4 max-w-[26rem] text-[0.84rem] leading-[1.7] text-white/40">
											<LayoutText k="goal.panel.vision.p2" multiline />
										</p>
										<p className="mt-4 max-w-[26rem] text-[0.84rem] leading-[1.7] text-white/40">
											<LayoutText k="goal.panel.vision.p3" multiline />
										</p>
										<p className="mt-4 max-w-[26rem] text-[0.84rem] leading-[1.7] text-white/40">
											<LayoutText k="goal.panel.vision.p4" multiline />
										</p>
										<p className="mt-8 whitespace-pre-line text-[0.68rem] font-medium uppercase leading-5 tracking-[0.2em] text-white/55">
											{t("goal.vision.motto")}
										</p>
									</div>
								) : null}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
