"use client";

import { useLocale } from "../lib/i18n";

const STREAMS = [
	{ from: "conn.s1.from", to: "conn.s1.to" },
	{ from: "conn.s2.from", to: "conn.s2.to" },
	{ from: "conn.s3.from", to: "conn.s3.to" },
	{ from: "conn.s4.from", to: "conn.s4.to" },
] as const;

const CAPS = [
	"conn.cap1",
	"conn.cap2",
	"conn.cap3",
	"conn.cap4",
	"conn.cap5",
] as const;

export function ConnectionSection() {
	const { t } = useLocale();

	return (
		<section
			id="connection"
			className="scroll-mt-24 bg-[#F7F1E8] pb-10 pt-4 sm:scroll-mt-28 sm:pb-12 sm:pt-6"
		>
			<div className="mx-auto w-full max-w-[1100px] px-6 sm:px-8 md:px-10 lg:px-12 xl:max-w-[1160px] xl:px-14">
				<p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#0F4C45] sm:text-[0.74rem]">
					{t("conn.kicker")}
				</p>
				<h2 className="mt-2.5 max-w-[22ch] text-[1.55rem] font-extrabold tracking-tight text-[#162b26] sm:text-[1.9rem]">
					{t("conn.title")}
				</h2>
				<p className="mt-2 max-w-[36rem] text-[0.88rem] leading-7 text-[#3E514D]">
					{t("conn.blurb")}
				</p>

				{/* Four streams → capabilities */}
				<div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
					{STREAMS.map((s) => (
						<div
							key={s.from}
							className="rounded-[1rem] border border-[#0F4C45]/10 bg-[#FFFCFA] px-4 py-4 text-center"
						>
							<p className="text-[0.78rem] font-semibold text-[#4A5C58]">
								{t(s.from)}
							</p>
							<p aria-hidden className="my-2 text-[#0F4C45]/35">
								↓
							</p>
							<p className="text-[0.95rem] font-extrabold tracking-tight text-[#162b26]">
								{t(s.to)}
							</p>
						</div>
					))}
				</div>

				{/* Convergence */}
				<div className="mt-6 flex flex-col items-center" aria-hidden>
					<span className="h-5 w-px bg-[#0F4C45]/22" />
					<span className="text-[0.7rem] text-[#0F4C45]/40">↓</span>
				</div>

				<div className="rounded-[1.05rem] border border-[#0F4C45]/12 bg-[#043439] px-5 py-6 text-center text-white sm:px-8 sm:py-7">
					<p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/55">
						{t("conn.merge.kicker")}
					</p>
					<p className="mt-2 text-[1.2rem] font-extrabold tracking-tight sm:text-[1.4rem]">
						{t("conn.merge.title")}
					</p>
					<div className="mt-5 flex flex-wrap justify-center gap-2">
						{CAPS.map((key) => (
							<span
								key={key}
								className="rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[0.72rem] font-semibold text-white/85"
							>
								{t(key)}
							</span>
						))}
					</div>
					<p className="mx-auto mt-5 max-w-[32rem] text-[0.82rem] leading-6 text-white/70">
						{t("conn.merge.body")}
					</p>
				</div>
			</div>
		</section>
	);
}
