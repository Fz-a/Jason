"use client";

import { useLocale } from "../lib/i18n";
import { researchFit } from "../lib/research-fit";

const STEPS = [
	"next.s1",
	"next.s2",
	"next.s3",
	"next.s4",
	"next.s5",
	"next.s6",
] as const;

export function ResearchFitNext() {
	const { t, locale } = useLocale();
	const fit = researchFit[locale] ?? researchFit.en;

	return (
		<>
			<section id="fit" className="story-slide bg-[#F7F1E8]">
				<div className="story-slide__body px-6 py-8 sm:px-8 md:px-10 lg:px-12">
					<div className="mx-auto flex w-full max-w-[1100px] flex-col xl:max-w-[1160px]">
						<p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]/70">
							{t("fit.kicker")}
						</p>
						<h2 className="mt-2 text-[1.65rem] font-extrabold tracking-tight text-[#162b26] sm:text-[2rem]">
							{t("fit.title")}
						</h2>
						<p className="mt-1.5 max-w-[36rem] text-[0.82rem] leading-6 text-[#4A5C58]">
							{t("fit.logic")}
						</p>

						{fit.professor ? (
							<p className="mt-2 text-[0.76rem] font-medium text-[#6A7A76]">
								{fit.professor}
							</p>
						) : null}

						<div className="mt-5 grid grid-cols-1 gap-0 border border-[#0F4C45]/12 lg:grid-cols-2">
							<div className="border-b border-[#0F4C45]/12 px-4 py-4 lg:border-b-0 lg:border-r sm:px-5 sm:py-5">
								<p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[#0F4C45]/45">
									{t("fit.yours")}
								</p>
								<ul className="mt-2.5 space-y-1">
									{fit.researchAreas.map((item) => (
										<li
											key={item}
											className="text-[0.82rem] leading-5 text-[#162b26]"
										>
											{item}
										</li>
									))}
								</ul>
								{fit.recentWork.length > 0 ? (
									<>
										<p className="mt-3 text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[#0F4C45]/45">
											{t("fit.recent")}
										</p>
										<ul className="mt-1.5 space-y-1">
											{fit.recentWork.slice(0, 2).map((item) => (
												<li
													key={item}
													className="text-[0.74rem] leading-5 text-[#4A5C58]"
												>
													{item}
												</li>
											))}
										</ul>
									</>
								) : null}
							</div>

							<div className="px-4 py-4 sm:px-5 sm:py-5">
								<p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[#0F4C45]/45">
									{t("fit.mine")}
								</p>
								<ul className="mt-2.5 space-y-1">
									{fit.matchingExperience.map((item) => (
										<li
											key={item}
											className="text-[0.82rem] font-semibold leading-5 text-[#162b26]"
										>
											{item}
										</li>
									))}
								</ul>
							</div>
						</div>

						<div className="border border-t-0 border-[#0F4C45]/12 bg-[#043439] px-4 py-4 text-white sm:px-5 sm:py-5">
							<p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-white/45">
								{t("fit.connect")}
							</p>
							<p className="mt-2 max-w-[40rem] text-[0.88rem] font-medium leading-6 text-white/90">
								{fit.potentialConnection}
							</p>
						</div>
					</div>
				</div>
			</section>

			<section id="next" className="story-slide bg-[#F7F1E8]">
				<div className="story-slide__body px-6 py-8 sm:px-8 md:px-10 lg:px-12">
					<div className="mx-auto flex w-full max-w-[1100px] flex-col xl:max-w-[1160px]">
						<p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]/70">
							{t("next.kicker")}
						</p>
						<h2 className="mt-2 max-w-[12ch] whitespace-pre-line text-[1.75rem] font-extrabold leading-[0.98] tracking-tight text-[#162b26] sm:text-[2.3rem]">
							{t("next.title")}
						</h2>
						<p className="mt-2 max-w-[36rem] text-[0.84rem] leading-6 text-[#4A5C58]">
							{t("next.blurb")}
						</p>

						<ol className="mt-6 max-w-xl space-y-0 sm:mt-8">
							{STEPS.map((key, i) => {
								const last = i === STEPS.length - 1;
								return (
									<li key={key} className="flex gap-4">
										<div className="flex flex-col items-center">
											<span
												className={`flex h-7 w-7 shrink-0 items-center justify-center font-mono text-[0.62rem] font-bold ${
													last
														? "bg-[#043439] text-white"
														: "text-[#0F4C45]/45"
												}`}
											>
												0{i + 1}
											</span>
											{!last ? (
												<span
													aria-hidden
													className="my-0.5 w-px flex-1 bg-[#0F4C45]/15"
												/>
											) : null}
										</div>
										<div className={!last ? "pb-4" : "pb-0"}>
											<p
												className={`pt-0.5 font-extrabold tracking-tight text-[#162b26] ${
													last
														? "text-[1.02rem] sm:text-[1.15rem]"
														: "text-[0.9rem]"
												}`}
											>
												{t(`${key}.title`)}
											</p>
										</div>
									</li>
								);
							})}
						</ol>
					</div>
				</div>
			</section>
		</>
	);
}
