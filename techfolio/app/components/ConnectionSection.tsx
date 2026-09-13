"use client";

import { useLocale } from "../lib/i18n";

/**
 * Direction — where the projects lead.
 * Typography-led; no flowchart.
 */
export function ConnectionSection() {
	const { t } = useLocale();

	return (
		<section id="direction" className="story-slide bg-[#F7F1E8]">
			<div className="story-slide__body px-6 py-12 sm:px-8 md:px-10 lg:px-12">
				<div className="mx-auto w-full max-w-[1100px] xl:max-w-[1160px]">
					<p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]/70">
						{t("conn.kicker")}
					</p>

					<p className="mt-8 max-w-[40rem] text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-[#0F4C45]/45">
						{[
							t("core.rtk.cap"),
							t("core.agv.cap"),
							t("core.fire.cap"),
							t("core.wear.cap"),
						].join("  ·  ")}
					</p>

					<p className="mt-5 text-[0.85rem] font-medium text-[#6A7A76]">
						{t("conn.bridge")}
					</p>

					<h2 className="mt-8 max-w-[11ch] whitespace-pre-line text-[2.8rem] font-extrabold leading-[0.94] tracking-tight text-[#162b26] sm:mt-10 sm:text-[4rem] lg:text-[4.6rem]">
						{t("conn.title")}
					</h2>

					<p className="mt-10 max-w-[34rem] text-[1.15rem] font-semibold leading-8 tracking-tight text-[#162b26] sm:text-[1.3rem]">
						{t("conn.statement")}
					</p>
				</div>
			</div>
		</section>
	);
}
