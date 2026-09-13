"use client";

import { useLocale } from "../lib/i18n";

const TAGS = [
	"target.tag1",
	"target.tag2",
	"target.tag3",
	"target.tag4",
	"target.tag5",
] as const;

export function TargetSection() {
	const { t } = useLocale();

	return (
		<section
			id="target"
			className="scroll-mt-24 bg-[#F7F1E8] pb-10 pt-4 sm:scroll-mt-28 sm:pb-12 sm:pt-6"
		>
			<div className="mx-auto w-full max-w-[1100px] px-6 sm:px-8 md:px-10 lg:px-12 xl:max-w-[1160px] xl:px-14">
				<p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#0F4C45] sm:text-[0.74rem]">
					{t("target.kicker")}
				</p>

				<div className="mt-6 rounded-[1.2rem] border border-[#0F4C45]/14 bg-[#043439] px-6 py-10 text-center text-white sm:px-10 sm:py-14">
					<p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/50">
						{t("target.logic")}
					</p>
					<h2 className="mx-auto mt-4 max-w-[16ch] text-[1.75rem] font-extrabold leading-[1.1] tracking-tight sm:text-[2.35rem] lg:text-[2.7rem]">
						{t("target.title")}
					</h2>
					<p className="mt-4 text-[1.05rem] font-semibold text-white/80 sm:text-[1.15rem]">
						{t("target.tagline")}
					</p>
					<p className="mx-auto mt-4 max-w-[34rem] text-[0.88rem] leading-7 text-white/65">
						{t("target.body")}
					</p>
					<div className="mt-7 flex flex-wrap justify-center gap-2">
						{TAGS.map((key) => (
							<span
								key={key}
								className="rounded-full border border-white/15 bg-white/[0.08] px-3.5 py-1.5 text-[0.72rem] font-semibold text-white/85"
							>
								{t(key)}
							</span>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
