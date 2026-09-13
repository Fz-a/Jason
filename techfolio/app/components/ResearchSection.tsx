"use client";

import { useLocale } from "../lib/i18n";

const DIRS = [
	{ n: "01", title: "research.d1.title", tech: "research.d1.tech" },
	{ n: "02", title: "research.d2.title", tech: "research.d2.tech" },
	{ n: "03", title: "research.d3.title", tech: "research.d3.tech" },
	{ n: "04", title: "research.d4.title", tech: "research.d4.tech" },
] as const;

export function ResearchSection() {
	const { t } = useLocale();

	return (
		<section
			id="research"
			className="scroll-mt-24 bg-[#F7F1E8] pb-12 pt-14 sm:scroll-mt-28 sm:pb-16 sm:pt-20"
		>
			<div className="mx-auto w-full max-w-[1100px] px-6 sm:px-8 md:px-10 lg:px-12 xl:max-w-[1160px] xl:px-14">
				<p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]/70">
					{t("research.kicker")}
				</p>
				<h2 className="mt-4 max-w-[14ch] text-[2.2rem] font-extrabold leading-[0.98] tracking-tight text-[#162b26] sm:text-[3rem]">
					{t("research.title")}
				</h2>

				{/* Editorial list — not decorative cards */}
				<div className="mt-12 space-y-0 border-t border-[#0F4C45]/15 sm:mt-14">
					{DIRS.map((d) => (
						<div
							key={d.n}
							className="grid grid-cols-[3rem_minmax(0,1fr)] gap-4 border-b border-[#0F4C45]/10 py-7 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-8 sm:py-8"
						>
							<p className="font-mono text-[0.72rem] font-semibold text-[#0F4C45]/40">
								{d.n}
							</p>
							<div>
								<h3 className="text-[1.2rem] font-extrabold tracking-tight text-[#162b26] sm:text-[1.35rem]">
									{t(d.title)}
								</h3>
								<p className="mt-2 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-[#0F4C45]/65">
									{t(d.tech)}
								</p>
							</div>
						</div>
					))}
				</div>

				<div className="mt-14 border-t border-[#0F4C45]/15 pt-10 sm:mt-16">
					<p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#0F4C45]/55">
						{t("research.q.kicker")}
					</p>
					<p className="mt-5 max-w-[40rem] text-[1.25rem] font-bold leading-8 tracking-tight text-[#162b26] sm:text-[1.45rem]">
						{t("research.q.body")}
					</p>
				</div>
			</div>
		</section>
	);
}
