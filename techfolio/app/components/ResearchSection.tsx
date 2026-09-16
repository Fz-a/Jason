"use client";

import { useLocale } from "../lib/i18n";
import { LayoutText } from "../lib/use-page-layout";

const DIRS = [
	{
		n: "01",
		title: "research.d1.title",
		tech: "research.d1.tech",
		body: "research.d1.body",
	},
	{
		n: "02",
		title: "research.d2.title",
		tech: "research.d2.tech",
		body: "research.d2.body",
	},
	{
		n: "03",
		title: "research.d3.title",
		tech: "research.d3.tech",
		body: "research.d3.body",
	},
	{
		n: "04",
		title: "research.d4.title",
		tech: "research.d4.tech",
		body: "research.d4.body",
	},
] as const;

export function ResearchSection() {
	const { t } = useLocale();

	return (
		<section id="research" className="story-slide bg-[#F7F1E8]">
			<div className="story-slide__body !justify-start px-5 py-6 sm:px-8 sm:py-7 md:px-11 lg:px-14 lg:py-9">
				<div className="mx-auto flex h-full w-full max-w-[1180px] flex-col xl:max-w-[1260px]">
					<header className="shrink-0 pt-[2.5vh] sm:pt-[3.5vh] lg:pt-[4.5vh]">
						<p className="text-[0.58rem] font-medium uppercase tracking-[0.3em] text-[#0F4C45]/55">
							<LayoutText k="research.kicker" />
						</p>
						<h2 className="mt-3 max-w-[16ch] text-[clamp(2.5rem,6.5vw,5.25rem)] font-semibold uppercase leading-[0.94] tracking-[-0.045em] text-[#162b26]">
							<LayoutText k="research.title" />
						</h2>
					</header>

					<div className="flex min-h-0 flex-1 flex-col justify-center pb-[4vh] pt-4 lg:pb-[6vh]">
						<div className="grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2 sm:gap-y-6">
							{DIRS.map((d) => (
								<div
									key={d.n}
									className="min-w-0 border-t border-[#0F4C45]/12 pt-3"
								>
									<p className="font-mono text-[0.62rem] font-semibold text-[#0F4C45]/40">
										{d.n}
									</p>
									<h3 className="mt-1 text-[1rem] font-extrabold tracking-tight text-[#162b26] sm:text-[1.1rem]">
										<LayoutText k={d.title} />
									</h3>
									<p className="mt-1 text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-[#0F4C45]/60">
										{t(d.tech)}
									</p>
									<p className="mt-1.5 text-[0.8rem] leading-5 text-[#4A5C58] sm:text-[0.84rem] sm:leading-6">
										<LayoutText k={d.body} multiline />
									</p>
								</div>
							))}
						</div>

						<div className="mt-8 border-t border-[#0F4C45]/12 pt-4 sm:mt-10">
							<p className="text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-[#0F4C45]/50">
								<LayoutText k="research.q.kicker" />
							</p>
							<p className="mt-2 max-w-[40rem] text-[1rem] font-bold leading-7 tracking-tight text-[#162b26] sm:text-[1.15rem]">
								<LayoutText k="research.q.body" multiline />
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
