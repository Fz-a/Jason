"use client";

import { useLocale } from "../lib/i18n";

const FLOW = [
	"target.flow1",
	"target.flow2",
	"target.flow3",
	"target.flow4",
] as const;

export function TargetSection() {
	const { t } = useLocale();

	return (
		<section
			id="target"
			className="scroll-mt-24 bg-[#043439] pb-20 pt-14 text-white sm:scroll-mt-28 sm:pb-28 sm:pt-20"
		>
			<div className="mx-auto w-full max-w-[1100px] px-6 text-center sm:px-8 md:px-10 lg:px-12 xl:max-w-[1160px] xl:px-14">
				<p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/50">
					{t("target.kicker")}
				</p>
				<h2 className="mx-auto mt-8 max-w-[12ch] whitespace-pre-line text-[2.8rem] font-extrabold leading-[0.95] tracking-tight sm:text-[4rem] lg:text-[4.8rem]">
					{t("target.title")}
				</h2>
				<p className="mt-8 text-[1.25rem] font-semibold tracking-tight text-white/80 sm:text-[1.5rem]">
					{t("target.tagline")}
				</p>

				<div className="mx-auto mt-14 flex max-w-xl flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:mt-16">
					{FLOW.map((key, i) => (
						<span key={key} className="flex items-center gap-3">
							<span className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-white/85">
								{t(key)}
							</span>
							{i < FLOW.length - 1 ? (
								<span aria-hidden className="text-white/35">
									→
								</span>
							) : null}
						</span>
					))}
				</div>

				<p className="mx-auto mt-10 max-w-[34rem] text-[0.88rem] leading-7 text-white/55">
					{t("target.body")}
				</p>
			</div>
		</section>
	);
}
