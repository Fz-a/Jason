"use client";

import { useLocale } from "../lib/i18n";

const STEPS = [
	"path.s1",
	"path.s2",
	"path.s3",
	"path.s4",
	"path.s5",
	"path.s6",
	"path.s7",
] as const;

export function EngineeringPath() {
	const { t } = useLocale();

	return (
		<section
			id="path"
			className="scroll-mt-10 bg-[#F7F1E8] pb-8 pt-2 sm:scroll-mt-14 sm:pb-10"
		>
			<div className="mx-auto w-full max-w-[1100px] px-6 sm:px-8 md:px-10 lg:px-12 xl:max-w-[1160px] xl:px-14">
				<p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#0F4C45] sm:text-[0.74rem]">
					{t("path.kicker")}
				</p>
				<h2 className="mt-3 text-[1.55rem] font-extrabold tracking-tight text-[#162b26] sm:text-[1.85rem]">
					{t("path.title")}
				</h2>
				<p className="mt-2.5 max-w-[36rem] text-[0.88rem] leading-6.5 text-[#3E514D]">
					{t("path.blurb")}
				</p>

				<ol className="mt-7 flex flex-col gap-0 sm:mt-8 md:flex-row md:flex-wrap md:items-center md:gap-x-1 md:gap-y-3">
					{STEPS.map((key, i) => (
						<li key={key} className="flex items-center gap-2.5 md:gap-1.5">
							<span className="flex items-center gap-2.5 py-2 md:py-0">
								<span
									aria-hidden
									className="h-2 w-2 shrink-0 rounded-full bg-[#0F4C45]"
								/>
								<span className="text-[0.88rem] font-semibold text-[#162b26] md:text-[0.8rem]">
									{t(key)}
								</span>
							</span>
							{i < STEPS.length - 1 ? (
								<span
									aria-hidden
									className="ml-[0.2rem] hidden text-[#0F4C45]/35 md:inline md:px-1"
								>
									→
								</span>
							) : null}
							{i < STEPS.length - 1 ? (
								<span
									aria-hidden
									className="ml-[0.3rem] h-4 w-px bg-[#0F4C45]/18 md:hidden"
								/>
							) : null}
						</li>
					))}
				</ol>
			</div>
		</section>
	);
}
