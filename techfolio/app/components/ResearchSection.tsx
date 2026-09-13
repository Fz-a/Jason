"use client";

import { useLocale } from "../lib/i18n";

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
			<div className="story-slide__body px-6 py-8 sm:px-8 md:px-10 lg:px-12">
				<div className="mx-auto flex w-full max-w-[1100px] flex-col xl:max-w-[1160px]">
					<p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]/70">
						{t("research.kicker")}
					</p>
					<h2 className="mt-2 max-w-[14ch] text-[1.75rem] font-extrabold leading-[0.98] tracking-tight text-[#162b26] sm:text-[2.2rem]">
						{t("research.title")}
					</h2>

					<div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-5 sm:mt-7 sm:grid-cols-2 sm:gap-y-6">
						{DIRS.map((d) => (
							<div
								key={d.n}
								className="min-w-0 border-t border-[#0F4C45]/12 pt-3"
							>
								<p className="font-mono text-[0.62rem] font-semibold text-[#0F4C45]/40">
									{d.n}
								</p>
								<h3 className="mt-1 text-[1rem] font-extrabold tracking-tight text-[#162b26] sm:text-[1.1rem]">
									{t(d.title)}
								</h3>
								<p className="mt-1 text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-[#0F4C45]/60">
									{t(d.tech)}
								</p>
								<p className="mt-1.5 text-[0.8rem] leading-5 text-[#4A5C58] sm:text-[0.84rem] sm:leading-6">
									{t(d.body)}
								</p>
							</div>
						))}
					</div>

					<div className="mt-6 border-t border-[#0F4C45]/12 pt-4">
						<p className="text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-[#0F4C45]/50">
							{t("research.q.kicker")}
						</p>
						<p className="mt-2 max-w-[40rem] text-[1rem] font-bold leading-7 tracking-tight text-[#162b26] sm:text-[1.15rem]">
							{t("research.q.body")}
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
