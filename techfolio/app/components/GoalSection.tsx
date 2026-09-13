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
		<section id="goal" className="story-slide bg-[#043439] text-white">
			<div className="story-slide__body px-6 py-10 sm:px-8 md:px-10 lg:px-12">
				<div className="mx-auto w-full max-w-[1100px] text-center xl:max-w-[1160px]">
					<p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/45">
						{t("goal.kicker")}
					</p>

					<h2 className="mx-auto mt-6 max-w-[10ch] whitespace-pre-line text-[2.6rem] font-extrabold leading-[0.92] tracking-tight sm:mt-8 sm:text-[3.8rem] lg:text-[4.6rem]">
						{t("goal.title")}
					</h2>

					<div className="mx-auto mt-8 flex max-w-sm flex-col items-center gap-0 sm:mt-10">
						{FLOW.map((key, i) => (
							<div key={key} className="flex flex-col items-center">
								<span className="text-[0.78rem] font-semibold uppercase tracking-[0.22em] text-white/90">
									{t(key)}
								</span>
								{i < FLOW.length - 1 ? (
									<span
										aria-hidden
										className="my-2 h-5 w-px bg-white/25"
									/>
								) : null}
							</div>
						))}
					</div>

					<p className="mx-auto mt-8 max-w-[32rem] text-[0.86rem] leading-7 text-white/50">
						{t("goal.body")}
					</p>
				</div>
			</div>
		</section>
	);
}
