"use client";

import { useLocale } from "../lib/i18n";
import { researchFitRows } from "../lib/research-fit";

const STEPS = [
	"next.s1",
	"next.s2",
	"next.s3",
	"next.s4",
	"next.s5",
] as const;

export function ResearchFitNext() {
	const { t, locale } = useLocale();
	const rows = researchFitRows[locale] ?? researchFitRows.en;

	return (
		<>
			{/* Research Fit — after Research, before Next */}
			<section
				id="fit"
				className="scroll-mt-24 bg-[#F7F1E8] pb-12 pt-4 sm:scroll-mt-28 sm:pb-16"
			>
				<div className="mx-auto w-full max-w-[1100px] px-6 sm:px-8 md:px-10 lg:px-12 xl:max-w-[1160px] xl:px-14">
					<p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]/70">
						{t("fit.kicker")}
					</p>
					<div className="mt-6 flex flex-col items-start gap-1 text-[0.85rem] font-semibold uppercase tracking-[0.14em] text-[#0F4C45]/55 sm:flex-row sm:items-center sm:gap-4">
						<span>{t("fit.yours")}</span>
						<span aria-hidden className="text-[#0F4C45]/35">
							↕
						</span>
						<span>{t("fit.mine")}</span>
						<span aria-hidden className="hidden text-[#0F4C45]/35 sm:inline">
							↓
						</span>
						<span className="text-[#043439]">{t("fit.connect")}</span>
					</div>

					<div className="mt-10 border-t border-[#0F4C45]/15">
						<div className="hidden grid-cols-2 gap-8 border-b border-[#0F4C45]/10 py-3 sm:grid">
							<p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#0F4C45]/45">
								{t("fit.yours")}
							</p>
							<p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#0F4C45]/45">
								{t("fit.mine")}
							</p>
						</div>
						{rows.map((row) => (
							<div
								key={row.yours}
								className="grid grid-cols-1 gap-1 border-b border-[#0F4C45]/10 py-4 sm:grid-cols-2 sm:gap-8"
							>
								<p className="text-[0.95rem] font-medium text-[#4A5C58]">
									<span className="mr-2 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[#0F4C45]/40 sm:hidden">
										{t("fit.yours")}
									</span>
									{row.yours}
								</p>
								<p className="text-[0.95rem] font-extrabold text-[#162b26]">
									<span className="mr-2 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[#0F4C45]/40 sm:hidden">
										{t("fit.mine")}
									</span>
									{row.mine}
								</p>
							</div>
						))}
					</div>
					<p className="mt-6 max-w-[36rem] text-[0.8rem] leading-6 text-[#6A7A76]">
						{t("fit.blurb")}
					</p>
				</div>
			</section>

			{/* 05 — NEXT */}
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
													: "text-[#0F4C45]/50"
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
									<div className={!last ? "pb-10" : "pb-0"}>
										<p
											className={`pt-1 font-extrabold tracking-tight text-[#162b26] ${
												last
													? "text-[1.2rem] sm:text-[1.4rem]"
													: "text-[1rem]"
											}`}
										>
											{t(`${key}.title`)}
										</p>
										<p className="mt-1.5 max-w-[28rem] text-[0.88rem] leading-6 text-[#4A5C58]">
											{t(`${key}.body`)}
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
