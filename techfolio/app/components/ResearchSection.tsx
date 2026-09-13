"use client";

import { useLocale } from "../lib/i18n";

const DIRS = [
	{
		n: "01",
		title: "research.d1.title",
		tech: "research.d1.tech",
		q: "research.d1.q",
	},
	{
		n: "02",
		title: "research.d2.title",
		tech: "research.d2.tech",
		q: "research.d2.q",
	},
	{
		n: "03",
		title: "research.d3.title",
		tech: "research.d3.tech",
		q: "research.d3.q",
	},
	{
		n: "04",
		title: "research.d4.title",
		tech: "research.d4.tech",
		q: "research.d4.q",
	},
] as const;

export function ResearchSection() {
	const { t } = useLocale();

	return (
		<section
			id="research"
			className="scroll-mt-24 bg-[#F7F1E8] pb-16 pt-12 sm:scroll-mt-28 sm:pb-24 sm:pt-16"
		>
			<div className="mx-auto w-full max-w-[1100px] px-6 sm:px-8 md:px-10 lg:px-12 xl:max-w-[1160px] xl:px-14">
				<p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]/70">
					{t("research.kicker")}
				</p>
				<h2 className="mt-4 max-w-[14ch] text-[2.2rem] font-extrabold leading-[0.98] tracking-tight text-[#162b26] sm:text-[3rem]">
					{t("research.title")}
				</h2>
				<p className="mt-4 max-w-[34rem] text-[0.92rem] leading-7 text-[#3E514D]">
					{t("research.blurb")}
				</p>

				<div className="mt-12 space-y-0 border-t border-[#0F4C45]/15">
					{DIRS.map((d) => (
						<div
							key={d.n}
							className="grid grid-cols-1 gap-3 border-b border-[#0F4C45]/12 py-7 sm:grid-cols-[4rem_minmax(0,0.9fr)_minmax(0,1.2fr)] sm:gap-6 sm:py-8"
						>
							<p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#0F4C45]/50">
								{d.n}
							</p>
							<div>
								<h3 className="text-[1.15rem] font-extrabold tracking-tight text-[#162b26]">
									{t(d.title)}
								</h3>
								<p className="mt-2 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-[#0F4C45]/75">
									{t(d.tech)}
								</p>
							</div>
							<p className="text-[0.9rem] leading-7 text-[#4A5C58] sm:pt-0.5">
								{t(d.q)}
							</p>
						</div>
					))}
				</div>

				<div className="mt-12 border border-[#0F4C45]/15 bg-[#FFFCFA] px-6 py-8 sm:px-10 sm:py-10">
					<p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#0F4C45]/55">
						{t("research.q.kicker")}
					</p>
					<p className="mt-4 max-w-[42rem] text-[1.2rem] font-bold leading-8 tracking-tight text-[#162b26] sm:text-[1.4rem]">
						{t("research.q.body")}
					</p>
					<p className="mt-4 text-[0.78rem] leading-6 text-[#6A7A76]">
						{t("research.q.note")}
					</p>
				</div>
			</div>
		</section>
	);
}
