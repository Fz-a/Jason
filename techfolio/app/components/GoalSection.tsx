"use client";

import { useLocale } from "../lib/i18n";

const FLOW = [
	"goal.flow1",
	"goal.flow2",
	"goal.flow3",
	"goal.flow4",
] as const;

export function GoalSection() {
	const { t } = useLocale();

	return (
		<section
			id="goal"
			className="scroll-mt-24 bg-[#043439] pb-20 pt-16 text-white sm:scroll-mt-28 sm:pb-28 sm:pt-24"
		>
			<div className="mx-auto w-full max-w-[1100px] px-6 text-center sm:px-8 md:px-10 lg:px-12 xl:max-w-[1160px] xl:px-14">
				<p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/45">
					{t("goal.kicker")}
				</p>

				{/* Strongest visual moment — not repeating Direction title */}
				<h2 className="mx-auto mt-12 max-w-[10ch] whitespace-pre-line text-[3.2rem] font-extrabold leading-[0.92] tracking-tight sm:mt-14 sm:text-[4.8rem] lg:text-[5.6rem]">
					{t("goal.title")}
				</h2>

				<div className="mx-auto mt-16 flex max-w-sm flex-col items-center gap-0 sm:mt-20">
					{FLOW.map((key, i) => (
						<div key={key} className="flex flex-col items-center">
							<span className="text-[0.82rem] font-semibold uppercase tracking-[0.22em] text-white/90">
								{t(key)}
							</span>
							{i < FLOW.length - 1 ? (
								<span
									aria-hidden
									className="my-2.5 h-6 w-px bg-white/25"
								/>
							) : null}
						</div>
					))}
				</div>

				<p className="mx-auto mt-12 max-w-[32rem] text-[0.9rem] leading-7 text-white/50">
					{t("goal.body")}
				</p>
			</div>
		</section>
	);
}
