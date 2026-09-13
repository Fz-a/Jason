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
			className="scroll-mt-24 bg-[#F7F1E8] pb-20 pt-12 sm:scroll-mt-28 sm:pb-28 sm:pt-16"
		>
			<div className="mx-auto w-full max-w-[1100px] px-6 sm:px-8 md:px-10 lg:px-12 xl:max-w-[1160px] xl:px-14">
				<p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]/70">
					{t("conn.kicker")}
				</p>
				<h2 className="mt-4 max-w-[14ch] whitespace-pre-line text-[2.2rem] font-extrabold leading-[0.98] tracking-tight text-[#162b26] sm:text-[3rem] lg:text-[3.4rem]">
					{t("conn.title")}
				</h2>

				{/* Convergence diagram */}
				<div className="mt-14 sm:mt-20">
					<ul className="mx-auto max-w-xl space-y-0">
						{STREAMS.map((s, i) => (
							<li key={s.from} className="relative flex flex-col items-stretch">
								<div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-4 sm:gap-6">
									<p className="text-right text-[0.95rem] font-medium text-[#4A5C58] sm:text-[1.05rem]">
										{t(s.from)}
									</p>
									<span
										aria-hidden
										className="h-px w-8 bg-[#0F4C45]/30 sm:w-12"
									/>
									<p className="text-[1rem] font-extrabold tracking-tight text-[#162b26] sm:text-[1.15rem]">
										{t(s.to)}
									</p>
								</div>
								{i < STREAMS.length - 1 ? (
									<div className="flex justify-center" aria-hidden>
										<span className="h-3 w-px bg-[#0F4C45]/18" />
									</div>
								) : null}
							</li>
						))}
					</ul>

					<div className="mt-2 flex flex-col items-center" aria-hidden>
						<span className="h-10 w-px bg-[#0F4C45]/25" />
						<span className="mt-1 text-[#0F4C45]/40">↓</span>
					</div>

					<div className="mt-4 text-center">
						<p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#0F4C45]/55">
							{t("conn.merge.kicker")}
						</p>
						<p className="mt-3 text-[1.45rem] font-extrabold tracking-tight text-[#162b26] sm:text-[1.85rem]">
							{t("conn.merge.title")}
						</p>
						<div className="mt-3 flex flex-col items-center" aria-hidden>
							<span className="h-8 w-px bg-[#0F4C45]/25" />
							<span className="mt-1 text-[#0F4C45]/40">↓</span>
						</div>
						<p className="mt-3 text-[1.15rem] font-extrabold tracking-tight text-[#043439] sm:text-[1.35rem]">
							{t("conn.merge.goal")}
						</p>
					</div>
				</div>

				<p className="mx-auto mt-14 max-w-[34rem] text-center text-[1.15rem] font-semibold leading-8 tracking-tight text-[#162b26] sm:mt-16 sm:text-[1.35rem]">
					{t("conn.statement")}
				</p>
			</div>
		</section>
	);
}
