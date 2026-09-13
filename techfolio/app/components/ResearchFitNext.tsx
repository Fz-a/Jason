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
			{/* 05 — RESEARCH FIT */}
			<section
				id="fit"
				className="scroll-mt-24 bg-[#F7F1E8] pb-16 pt-10 sm:scroll-mt-28 sm:pb-20 sm:pt-14"
			>
				<div className="mx-auto w-full max-w-[1100px] px-6 sm:px-8 md:px-10 lg:px-12 xl:max-w-[1160px] xl:px-14">
					<p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]/70">
						{t("fit.kicker")}
					</p>
					<h2 className="mt-4 text-[2rem] font-extrabold tracking-tight text-[#162b26] sm:text-[2.6rem]">
						{t("fit.title")}
					</h2>
					<p className="mt-3 max-w-[36rem] text-[0.9rem] leading-7 text-[#4A5C58]">
						{t("fit.logic")}
					</p>

					{/* Logic strip */}
					<div className="mt-8 flex flex-col gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#0F4C45]/55 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
						<span>{t("fit.yours")}</span>
						<span aria-hidden className="hidden text-[#0F4C45]/30 sm:inline">
							+
						</span>
						<span>{t("fit.mine")}</span>
						<span aria-hidden className="text-[#0F4C45]/30">
							↓
						</span>
						<span className="text-[#043439]">{t("fit.connect")}</span>
					</div>

					{fit.professor ? (
						<p className="mt-6 text-[0.85rem] font-medium text-[#6A7A76]">
							{fit.professor}
						</p>
					) : null}

					{/* Two columns */}
					<div className="mt-10 grid grid-cols-1 gap-0 border border-[#0F4C45]/12 lg:grid-cols-2">
						<div className="border-b border-[#0F4C45]/12 px-6 py-8 lg:border-b-0 lg:border-r">
							<p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#0F4C45]/45">
								{t("fit.yours")}
							</p>
							<ul className="mt-5 space-y-3">
								{fit.researchAreas.map((item) => (
									<li
										key={item}
										className="text-[0.95rem] leading-6 text-[#162b26]"
									>
										{item}
									</li>
								))}
							</ul>
							{fit.recentWork.length > 0 ? (
								<>
									<p className="mt-8 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#0F4C45]/45">
										{t("fit.recent")}
									</p>
									<ul className="mt-3 space-y-2">
										{fit.recentWork.map((item) => (
											<li
												key={item}
												className="text-[0.85rem] leading-6 text-[#4A5C58]"
											>
												{item}
											</li>
										))}
									</ul>
								</>
							) : null}
						</div>

						<div className="px-6 py-8">
							<p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#0F4C45]/45">
								{t("fit.mine")}
							</p>
							<ul className="mt-5 space-y-3">
								{fit.matchingExperience.map((item) => (
									<li
										key={item}
										className="text-[0.95rem] font-semibold leading-6 text-[#162b26]"
									>
										{item}
									</li>
								))}
							</ul>
						</div>
					</div>

					{/* Potential connection */}
					<div className="border border-t-0 border-[#0F4C45]/12 bg-[#043439] px-6 py-8 text-white sm:px-8">
						<p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/45">
							{t("fit.connect")}
						</p>
						<p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-white/80">
							{fit.connectionFormula.map((chip, i) => (
								<span key={chip} className="inline-flex items-center gap-2">
									{chip}
									{i < fit.connectionFormula.length - 1 ? (
										<span aria-hidden className="text-white/35">
											+
										</span>
									) : null}
								</span>
							))}
						</p>
						<p className="mt-5 max-w-[40rem] text-[1rem] font-medium leading-7 text-white/90">
							{fit.potentialConnection}
						</p>
					</div>

					<p className="mt-5 text-[0.78rem] leading-6 text-[#6A7A76]">
						{t("fit.blurb")}
					</p>
				</div>
			</section>

			{/* 06 — NEXT */}
			<section
				id="next"
				className="scroll-mt-24 bg-[#F7F1E8] pb-20 pt-8 sm:scroll-mt-28 sm:pb-28 sm:pt-12"
			>
				<div className="mx-auto w-full max-w-[1100px] px-6 sm:px-8 md:px-10 lg:px-12 xl:max-w-[1160px] xl:px-14">
					<p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]/70">
						{t("next.kicker")}
					</p>
					<h2 className="mt-4 max-w-[12ch] whitespace-pre-line text-[2.2rem] font-extrabold leading-[0.98] tracking-tight text-[#162b26] sm:text-[3rem]">
						{t("next.title")}
					</h2>
					<p className="mt-5 max-w-[36rem] text-[0.92rem] leading-7 text-[#4A5C58]">
						{t("next.blurb")}
					</p>

					<ol className="mt-12 max-w-xl space-y-0">
						{STEPS.map((key, i) => {
							const last = i === STEPS.length - 1;
							return (
								<li key={key} className="flex gap-5">
									<div className="flex flex-col items-center">
										<span
											className={`flex h-8 w-8 shrink-0 items-center justify-center font-mono text-[0.68rem] font-bold ${
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
												className="my-1 w-px flex-1 bg-[#0F4C45]/15"
											/>
										) : null}
									</div>
									<div className={!last ? "pb-9" : "pb-0"}>
										<p
											className={`pt-1 font-extrabold tracking-tight text-[#162b26] ${
												last
													? "text-[1.2rem] sm:text-[1.4rem]"
													: "text-[1rem]"
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
			</section>
		</>
	);
}
