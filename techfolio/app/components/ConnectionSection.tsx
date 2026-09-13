"use client";

import { useLocale } from "../lib/i18n";

const INPUTS = [
	"conn.in1",
	"conn.in2",
	"conn.in3",
	"conn.in4",
] as const;

export function ConnectionSection() {
	const { t } = useLocale();

	return (
		<section
			id="direction"
			className="scroll-mt-24 bg-[#F7F1E8] pb-20 pt-12 sm:scroll-mt-28 sm:pb-28 sm:pt-16"
		>
			<div className="mx-auto w-full max-w-[1100px] px-6 sm:px-8 md:px-10 lg:px-12 xl:max-w-[1160px] xl:px-14">
				<p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]/70">
					{t("conn.kicker")}
				</p>

				{/* Direction target — immediately visible */}
				<h2 className="mt-8 max-w-[12ch] whitespace-pre-line text-[2.6rem] font-extrabold leading-[0.95] tracking-tight text-[#162b26] sm:mt-10 sm:text-[3.6rem] lg:text-[4.2rem]">
					{t("conn.title")}
				</h2>

				{/* Experience → UAV → Applications */}
				<div className="mt-14 flex flex-col items-center text-center sm:mt-16">
					<p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-[#0F4C45]/70">
						{INPUTS.map((key, i) => (
							<span key={key} className="inline-flex items-center gap-2">
								{t(key)}
								{i < INPUTS.length - 1 ? (
									<span aria-hidden className="text-[#0F4C45]/30">
										+
									</span>
								) : null}
							</span>
						))}
					</p>
					<div className="mt-4 flex flex-col items-center" aria-hidden>
						<span className="h-8 w-px bg-[#0F4C45]/25" />
						<span className="mt-1 text-[#0F4C45]/40">↓</span>
					</div>
					<p className="mt-3 text-[1.25rem] font-extrabold tracking-tight text-[#162b26] sm:text-[1.45rem]">
						{t("conn.mid")}
					</p>
					<div className="mt-3 flex flex-col items-center" aria-hidden>
						<span className="h-8 w-px bg-[#0F4C45]/25" />
						<span className="mt-1 text-[#0F4C45]/40">↓</span>
					</div>
					<p className="mt-3 max-w-[16ch] whitespace-pre-line text-[1.1rem] font-extrabold tracking-tight text-[#043439] sm:text-[1.3rem]">
						{t("conn.apps")}
					</p>
				</div>

				<p className="mx-auto mt-14 max-w-[36rem] text-center text-[1.1rem] font-semibold leading-8 tracking-tight text-[#162b26] sm:mt-16 sm:text-[1.25rem]">
					{t("conn.statement")}
				</p>
			</div>
		</section>
	);
}
