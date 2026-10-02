"use client";

import { useLocale } from "../lib/i18n";

const ABOUT_CHIPS = [
	"hero.chip.electronics",
	"hero.chip.embedded",
	"hero.chip.robotics",
	"hero.chip.ai",
	"hero.chip.uav",
] as const;

/**
 * About slide — a short bio composed from the hero / goal / next copy.
 * Used as the homepage's second page.
 */
export function AboutSection() {
	const { t } = useLocale();

	return (
		<section id="about" className="story-slide bg-[#F7F1E8]">
			<div className="story-slide__body px-6 py-10 sm:px-8 md:px-10 lg:px-12">
				<div className="mx-auto flex w-full max-w-[1100px] flex-col items-center text-center xl:max-w-[1160px]">
					<p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]/70">
						{t("about.kicker")}
					</p>

					<h2 className="mt-3.5 max-w-[18ch] text-[1.9rem] font-extrabold leading-[1.04] tracking-tight text-[#162b26] sm:text-[2.4rem] lg:text-[2.8rem]">
						{t("about.heading")}
					</h2>

					<p className="mt-6 max-w-[34rem] text-[1rem] leading-8 text-[#3E514D] sm:text-[1.05rem]">
						{t("about.body1")}
					</p>

					<p className="mt-4 max-w-[34rem] text-[1rem] leading-8 text-[#3E514D] sm:text-[1.05rem]">
						{t("about.body2")}
					</p>

					<p className="mt-8 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#0F4C45]/70">
						{ABOUT_CHIPS.map((key) => t(key)).join(" · ")}
					</p>
				</div>
			</div>
		</section>
	);
}
