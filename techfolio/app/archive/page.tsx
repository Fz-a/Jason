"use client";

import { Montserrat } from "next/font/google";
import Link from "next/link";
import { JourneyHub } from "../components/JourneyHub";
import { LangSwitch } from "../components/LangSwitch";
import { useLocale } from "../lib/i18n";

const montserrat = Montserrat({
	subsets: ["latin"],
});

export default function ArchivePage() {
	const { t } = useLocale();

	return (
		<main
			className={`${montserrat.className} min-h-screen bg-[#F7F1E8] text-[#162b26]`}
		>
			<header className="sticky top-0 z-40 border-b border-[#0F4C45]/10 bg-[#F7F1E8]/92 backdrop-blur-md">
				<div className="mx-auto flex w-full max-w-[1100px] items-center justify-between px-6 py-4 sm:px-8 md:px-10 lg:px-12 xl:max-w-[1160px] xl:px-14">
					<div>
						<p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#0F4C45]/55">
							{t("archive.kicker")}
						</p>
						<h1 className="mt-1 text-[1.2rem] font-extrabold tracking-tight">
							{t("archive.title")}
						</h1>
					</div>
					<div className="flex items-center gap-3">
						<LangSwitch />
						<Link
							href="/#experience"
							className="rounded-full border border-[#0F4C45]/20 px-4 py-2 text-[0.78rem] font-semibold text-[#0F4C45] transition hover:bg-[#043439] hover:text-white"
						>
							{t("archive.back")}
						</Link>
					</div>
				</div>
			</header>

			<div className="mx-auto w-full max-w-[1100px] px-6 py-8 sm:px-8 md:px-10 lg:px-12 xl:max-w-[1160px] xl:px-14">
				<p className="mb-8 max-w-[36rem] text-[0.9rem] leading-7 text-[#4A5C58]">
					{t("archive.page.blurb")}
				</p>
				<JourneyHub />
			</div>

			<footer className="border-t border-[#0F4C45]/10 py-8 text-center text-[0.72rem] text-[#6B7B77]">
				© 2026 Jason Chen
			</footer>
		</main>
	);
}
