"use client";

import { Montserrat } from "next/font/google";
import Link from "next/link";
import { ContactSection } from "../components/ContactSection";
import { useLocale } from "../lib/i18n";

const montserrat = Montserrat({
	subsets: ["latin"],
});

export default function ContactPage() {
	const { t } = useLocale();

	return (
		<main
			className={`${montserrat.className} min-h-screen bg-[#F7F1E8] text-[#162b26]`}
		>
			<header className="sticky top-0 z-40 border-b border-[#0F4C45]/10 bg-[#F7F1E8]/92 backdrop-blur-md">
				<div className="mx-auto flex w-full max-w-[1100px] items-center justify-between px-6 py-4 sm:px-8 md:px-10 lg:px-12 xl:max-w-[1160px] xl:px-14">
					<div>
						<p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#0F4C45]/55">
							{t("hero.role")}
						</p>
						<h1 className="mt-1 text-[1.2rem] font-extrabold tracking-tight">
							Jason Chen
						</h1>
					</div>
					<Link
						href="/"
						className="rounded-full border border-[#0F4C45]/20 px-4 py-2 text-[0.78rem] font-semibold text-[#0F4C45] transition hover:bg-[#043439] hover:text-white"
					>
						{t("archive.back")}
					</Link>
				</div>
			</header>

			<section className="bg-[#F7F1E8] pb-16 pt-10 sm:pb-20 sm:pt-12 lg:pb-24 lg:pt-16">
				<ContactSection />
			</section>
		</main>
	);
}
