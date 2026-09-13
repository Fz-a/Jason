"use client";

import { useLocale } from "../lib/i18n";

const STREAMS = [
	{ from: "conn.s1.from", to: "conn.s1.to" },
	{ from: "conn.s2.from", to: "conn.s2.to" },
	{ from: "conn.s3.from", to: "conn.s3.to" },
	{ from: "conn.s4.from", to: "conn.s4.to" },
] as const;

export function ConnectionSection() {
	const { t } = useLocale();

	return (
		<section
			id="connection"
			className="scroll-mt-24 bg-[#F7F1E8] pb-16 pt-8 sm:scroll-mt-28 sm:pb-24 sm:pt-12"
		>
			<div className="mx-auto w-full max-w-[1100px] px-6 sm:px-8 md:px-10 lg:px-12 xl:max-w-[1160px] xl:px-14">
				<p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]/70">
					{t("conn.kicker")}
				</p>
				<h2 className="mt-4 max-w-[14ch] whitespace-pre-line text-[2.2rem] font-extrabold leading-[0.98] tracking-tight text-[#162b26] sm:text-[3rem] lg:text-[3.4rem]">
					{t("conn.title")}
				</h2>
				<p className="mt-5 max-w-[36rem] text-[1.05rem] font-semibold leading-8 text-[#162b26]/85">
					{t("conn.statement")}
				</p>

				<div className="mt-12 grid grid-cols-1 gap-0 border-t border-[#0F4C45]/15 sm:mt-16">
					{STREAMS.map((s) => (
						<div
							key={s.from}
							className="grid grid-cols-1 items-baseline gap-2 border-b border-[#0F4C45]/12 py-5 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:gap-6"
						>
							<p className="text-[0.88rem] font-medium text-[#4A5C58]">
								{t(s.from)}
							</p>
							<p aria-hidden className="hidden text-[#0F4C45]/30 sm:block">
								——
							</p>
							<p className="text-[1.05rem] font-extrabold tracking-tight text-[#162b26] sm:text-right">
								{t(s.to)}
							</p>
						</div>
					))}
				</div>

				<div className="mt-10 flex flex-col items-center text-center" aria-hidden>
					<span className="h-8 w-px bg-[#0F4C45]/25" />
					<span className="mt-1 text-[#0F4C45]/40">↓</span>
				</div>

				<div className="mt-2 text-center">
					<p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#0F4C45]/55">
						{t("conn.merge.kicker")}
					</p>
					<p className="mt-3 text-[1.55rem] font-extrabold tracking-tight text-[#162b26] sm:text-[2rem]">
						{t("conn.merge.title")}
					</p>
					<p className="mx-auto mt-3 max-w-[32rem] text-[0.9rem] leading-7 text-[#4A5C58]">
						{t("conn.merge.body")}
					</p>
				</div>
			</div>
		</section>
	);
}
