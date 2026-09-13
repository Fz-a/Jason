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
			className="scroll-mt-24 bg-[#F7F1E8] pb-16 pt-8 sm:scroll-mt-28 sm:pb-24 sm:pt-10"
		>
			<div className="mx-auto w-full max-w-[1100px] space-y-20 px-6 sm:px-8 md:px-10 lg:px-12 xl:max-w-[1160px] xl:px-14">
				{/* Research Fit */}
				<div>
					<p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]/70">
						{t("fit.kicker")}
					</p>
					<h2 className="mt-4 text-[2rem] font-extrabold tracking-tight text-[#162b26] sm:text-[2.6rem]">
						{t("fit.title")}
					</h2>
					<p className="mt-3 max-w-[34rem] text-[0.88rem] leading-7 text-[#4A5C58]">
						{t("fit.blurb")}
					</p>

					<div className="mt-10 grid grid-cols-1 gap-0 border border-[#0F4C45]/12 lg:grid-cols-2">
						<div className="border-b border-[#0F4C45]/12 px-6 py-7 lg:border-b-0 lg:border-r">
							<p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#0F4C45]/50">
								{t("fit.yours")}
							</p>
							<p className="mt-3 text-[1rem] font-bold leading-7 text-[#162b26]">
								{fit.theirResearch}
							</p>
							<p className="mt-3 text-[0.85rem] leading-6 text-[#4A5C58]">
								{fit.observation}
							</p>
						</div>
						<div className="px-6 py-7">
							<p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#0F4C45]/50">
								{t("fit.mine")}
							</p>
							<p className="mt-3 text-[1rem] font-bold leading-7 text-[#162b26]">
								{fit.myExperience}
							</p>
							<ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
								{fit.myTags.map((tag) => (
									<li
										key={tag}
										className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#0F4C45]/75"
									>
										{tag}
									</li>
								))}
							</ul>
						</div>
					</div>

					<div className="mt-0 border border-t-0 border-[#0F4C45]/12 bg-[#043439] px-6 py-7 text-white">
						<p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/50">
							{t("fit.connect")}
						</p>
						<p className="mt-3 text-[1.05rem] font-bold leading-7">{fit.connection}</p>
						<p className="mt-3 text-[0.85rem] leading-6 text-white/65">{fit.explore}</p>
					</div>
				</div>

				{/* Next */}
				<div>
					<p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]/70">
						{t("next.kicker")}
					</p>
					<h2 className="mt-4 text-[2rem] font-extrabold tracking-tight text-[#162b26] sm:text-[2.6rem]">
						{t("next.title")}
					</h2>

					<ol className="mt-10 space-y-0">
						{STEPS.map((key, i) => {
							const last = i === STEPS.length - 1;
							return (
								<li key={key} className="flex gap-5">
									<div className="flex flex-col items-center">
										<span
											className={`flex h-9 w-9 shrink-0 items-center justify-center text-[0.72rem] font-bold ${
												last
													? "bg-[#043439] text-white"
													: "border border-[#0F4C45]/25 text-[#0F4C45]"
											}`}
										>
											0{i + 1}
										</span>
										{!last ? (
											<span
												aria-hidden
												className="my-1 w-px flex-1 bg-[#0F4C45]/18"
											/>
										) : null}
									</div>
									<div className={!last ? "pb-8" : "pb-0"}>
										<p
											className={`pt-1.5 font-extrabold tracking-tight text-[#162b26] ${
												last ? "text-[1.15rem] sm:text-[1.3rem]" : "text-[1rem]"
											}`}
										>
											{t(`${key}.title`)}
										</p>
										<p className="mt-1.5 max-w-[32rem] text-[0.88rem] leading-6 text-[#4A5C58]">
											{t(`${key}.body`)}
										</p>
									</div>
								</li>
							);
						})}
					</ol>
				</div>
			</div>
		</section>
	);
}
