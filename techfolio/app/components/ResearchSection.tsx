"use client";

import { useLocale } from "../lib/i18n";

const DIRS = [
	{
		n: "01",
		title: "research.d1.title",
		tech: "research.d1.tech",
		purpose: "research.d1.purpose",
	},
	{
		n: "02",
		title: "research.d2.title",
		tech: "research.d2.tech",
		purpose: "research.d2.purpose",
	},
	{
		n: "03",
		title: "research.d3.title",
		tech: "research.d3.tech",
		purpose: "research.d3.purpose",
	},
	{
		n: "04",
		title: "research.d4.title",
		tech: "research.d4.tech",
		purpose: "research.d4.purpose",
	},
] as const;

export function ResearchSection() {
	const { t } = useLocale();

	return (
		<section
			id="research"
			className="scroll-mt-24 bg-[#F7F1E8] pb-10 pt-4 sm:scroll-mt-28 sm:pb-12 sm:pt-6"
		>
			<div className="mx-auto w-full max-w-[1100px] px-6 sm:px-8 md:px-10 lg:px-12 xl:max-w-[1160px] xl:px-14">
				<p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#0F4C45] sm:text-[0.74rem]">
					{t("research.kicker")}
				</p>
				<h2 className="mt-2.5 max-w-[20ch] text-[1.55rem] font-extrabold tracking-tight text-[#162b26] sm:text-[1.9rem]">
					{t("research.title")}
				</h2>
				<p className="mt-2 max-w-[36rem] text-[0.88rem] leading-7 text-[#3E514D]">
					{t("research.blurb")}
				</p>

				<div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
					{DIRS.map((d) => (
						<div
							key={d.n}
							className="rounded-[1.05rem] border border-[#0F4C45]/10 bg-[#FFFCFA] px-4 py-5 sm:px-5"
						>
							<p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#0F4C45]/50">
								{d.n}
							</p>
							<h3 className="mt-1.5 text-[1.05rem] font-extrabold tracking-tight text-[#162b26]">
								{t(d.title)}
							</h3>
							<p className="mt-1.5 text-[0.78rem] font-semibold text-[#0F4C45]">
								{t(d.tech)}
							</p>
							<p className="mt-2 text-[0.82rem] leading-6 text-[#4A5C58]">
								{t(d.purpose)}
							</p>
						</div>
					))}
				</div>

				<div className="mt-7 rounded-[1.05rem] border border-[#0F4C45]/12 bg-[#FFFCFA] px-5 py-6 sm:px-7">
					<p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#0F4C45]/55">
						{t("research.q.kicker")}
					</p>
					<p className="mt-3 max-w-[40rem] text-[1.05rem] font-bold leading-7 tracking-tight text-[#162b26] sm:text-[1.15rem]">
						{t("research.q.body")}
					</p>
					<p className="mt-3 text-[0.78rem] leading-6 text-[#4A5C58]">
						{t("research.q.note")}
					</p>
				</div>
			</div>
		</section>
	);
}
