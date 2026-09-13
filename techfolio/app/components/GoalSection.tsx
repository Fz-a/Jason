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
				<h2 className="mx-auto mt-10 max-w-[11ch] whitespace-pre-line text-[3rem] font-extrabold leading-[0.92] tracking-tight sm:text-[4.4rem] lg:text-[5.2rem]">
					{t("goal.title")}
				</h2>
				<p className="mt-10 text-[1.35rem] font-semibold tracking-tight text-white/75 sm:text-[1.65rem]">
					{t("goal.tagline")}
				</p>

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
			</div>
		</section>
	);
}
