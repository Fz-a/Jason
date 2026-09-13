"use client";

import { useLocale } from "../lib/i18n";
import { researchFit } from "../lib/research-fit";

const STEPS = [
	"next.s1",
	"next.s2",
	"next.s3",
	"next.s4",
	"next.s5",
] as const;

export function ResearchFitNext() {
	const { t, locale } = useLocale();
	const fit = researchFit[locale] ?? researchFit.en;

	return (
		<section
			id="next"
			className="scroll-mt-24 bg-[#F7F1E8] pb-10 pt-4 sm:scroll-mt-28 sm:pb-12 sm:pt-6"
		>
			<div className="mx-auto w-full max-w-[1100px] space-y-10 px-6 sm:px-8 md:px-10 lg:px-12 xl:max-w-[1160px] xl:px-14">
				{/* Research Fit — customizable per supervisor */}
				<div>
					<p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#0F4C45] sm:text-[0.74rem]">
						{t("fit.kicker")}
					</p>
					<h2 className="mt-2.5 max-w-[20ch] text-[1.55rem] font-extrabold tracking-tight text-[#162b26] sm:text-[1.9rem]">
						{t("fit.title")}
					</h2>
					<p className="mt-2 max-w-[36rem] text-[0.88rem] leading-7 text-[#3E514D]">
						{t("fit.blurb")}
					</p>

					<div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
						<div className="rounded-[1.05rem] border border-[#0F4C45]/10 bg-[#FFFCFA] px-5 py-5">
							<p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#0F4C45]/50">
								{t("fit.mine")}
							</p>
							<p className="mt-2 text-[0.95rem] font-bold text-[#162b26]">
								{fit.myExperience}
							</p>
							<ul className="mt-3 flex flex-wrap gap-1.5">
								{fit.myTags.map((tag) => (
									<li
										key={tag}
										className="rounded-full border border-[#0F4C45]/12 bg-[#F7F1E8] px-2.5 py-1 text-[0.68rem] font-semibold text-[#0F4C45]"
									>
										{tag}
									</li>
								))}
							</ul>
						</div>

						<div className="rounded-[1.05rem] border border-[#0F4C45]/10 bg-[#FFFCFA] px-5 py-5">
							<p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#0F4C45]/50">
								{t("fit.yours")}
							</p>
							<p className="mt-2 text-[0.95rem] font-bold text-[#162b26]">
								{fit.theirResearch}
							</p>
							<p className="mt-2 text-[0.82rem] leading-6 text-[#4A5C58]">
								{fit.observation}
							</p>
						</div>
					</div>

					<div className="mt-4 rounded-[1.05rem] border border-[#0F4C45]/14 bg-[#043439] px-5 py-5 text-white">
						<p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white/55">
							{t("fit.connect")}
						</p>
						<p className="mt-2 text-[0.95rem] font-bold leading-7">
							{fit.connection}
						</p>
						<p className="mt-3 text-[0.82rem] leading-6 text-white/70">
							{fit.explore}
						</p>
					</div>
				</div>

				{/* Next steps */}
				<div>
					<p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#0F4C45] sm:text-[0.74rem]">
						{t("next.kicker")}
					</p>
					<h2 className="mt-2.5 text-[1.55rem] font-extrabold tracking-tight text-[#162b26] sm:text-[1.9rem]">
						{t("next.title")}
					</h2>

					<ol className="mt-6 space-y-0">
						{STEPS.map((key, i) => (
							<li key={key} className="flex gap-4">
								<div className="flex flex-col items-center">
									<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#043439] text-[0.68rem] font-bold text-white">
										0{i + 1}
									</span>
									{i < STEPS.length - 1 ? (
										<span
											aria-hidden
											className="my-1 w-px flex-1 bg-[#0F4C45]/18"
										/>
									) : null}
								</div>
								<div className={i < STEPS.length - 1 ? "pb-5" : ""}>
									<p className="pt-1.5 text-[0.92rem] font-bold text-[#162b26]">
										{t(`${key}.title`)}
									</p>
									<p className="mt-1 text-[0.82rem] leading-6 text-[#4A5C58]">
										{t(`${key}.body`)}
									</p>
								</div>
							</li>
						))}
					</ol>
				</div>
			</div>
		</section>
	);
}
