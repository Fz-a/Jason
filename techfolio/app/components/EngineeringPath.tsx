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

				<ol className="eng-path mt-7 sm:mt-8">
					{STEPS.map((key, i) => (
						<li key={key} className="eng-path__step">
							<span className="eng-path__dot" aria-hidden />
							<span className="eng-path__label">{t(key)}</span>
							{i < STEPS.length - 1 ? (
								<span className="eng-path__line" aria-hidden />
							) : null}
						</li>
					))}
				</ol>
			</div>
		</section>
	);
}
