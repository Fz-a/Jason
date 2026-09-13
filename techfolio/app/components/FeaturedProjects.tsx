"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "../lib/i18n";
import { ShowcaseDocument } from "../projects/UniversityShowcase";
import {
	universityProjectShowcases,
	type UniversityShowcase,
} from "../projects/university-showcases";
import { workShowcases } from "../projects/work-showcases";

type CoreProject = {
	id: string;
	n: string;
	titleKey: string;
	capKey: string;
	bodyKey: string;
	tags: readonly string[];
	src: string;
	alt: string;
	showcaseId: string;
	section: string;
};

const CORE: CoreProject[] = [
	{
		id: "rtk",
		n: "01",
		titleKey: "core.rtk.title",
		capKey: "core.rtk.cap",
		bodyKey: "core.rtk.body",
		tags: ["core.rtk.c1", "core.rtk.c2", "core.rtk.c3", "core.rtk.c4", "core.rtk.c5"],
		src: "/experience/work/zongheng/rtk-field.webp",
		alt: "RTK agricultural positioning hardware",
		showcaseId: "rtk",
		section: "Work",
	},
	{
		id: "agv",
		n: "02",
		titleKey: "core.agv.title",
		capKey: "core.agv.cap",
		bodyKey: "core.agv.body",
		tags: ["core.agv.c1", "core.agv.c2", "core.agv.c3", "core.agv.c4", "core.agv.c5"],
		src: "/experience/work/zongheng/agv-yellow.webp",
		alt: "Industrial AGV robotics",
		showcaseId: "agv",
		section: "Work",
	},
	{
		id: "fire",
		n: "03",
		titleKey: "core.fire.title",
		capKey: "core.fire.cap",
		bodyKey: "core.fire.body",
		tags: ["core.fire.c1", "core.fire.c2", "core.fire.c3", "core.fire.c4", "core.fire.c5"],
		src: "/experience/university/fire-warning/camera-jetson.webp",
		alt: "Edge AI fire warning system",
		showcaseId: "fire-warning",
		section: "University",
	},
	{
		id: "wearable",
		n: "04",
		titleKey: "core.wear.title",
		capKey: "core.wear.cap",
		bodyKey: "core.wear.body",
		tags: ["core.wear.c1", "core.wear.c2", "core.wear.c3", "core.wear.c4", "core.wear.c5"],
		src: "/experience/university/smart-clothes/smart-vest.webp",
		alt: "Smart wearable sensing system",
		showcaseId: "smart-clothes",
		section: "University",
	},
];

function findShowcase(id: string): UniversityShowcase | null {
	return (
		universityProjectShowcases.find((s) => s.id === id) ??
		workShowcases.find((s) => s.id === id) ??
		null
	);
}

export function FeaturedProjects() {
	const { t } = useLocale();
	const [activeId, setActiveId] = useState<string | null>(null);
	const active = CORE.find((p) => p.id === activeId) ?? null;
	const showcase = active ? findShowcase(active.showcaseId) : null;

	useEffect(() => {
		if (!activeId) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setActiveId(null);
		};
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", onKey);
		return () => {
			document.body.style.overflow = prev;
			window.removeEventListener("keydown", onKey);
		};
	}, [activeId]);

	return (
		<section
			id="experience"
			className="scroll-mt-24 bg-[#F7F1E8] pb-16 pt-10 sm:scroll-mt-28 sm:pb-24 sm:pt-16"
		>
			<div className="mx-auto w-full max-w-[1100px] px-6 sm:px-8 md:px-10 lg:px-12 xl:max-w-[1160px] xl:px-14">
				<p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]/70">
					{t("core.kicker")}
				</p>
				<h2 className="mt-4 max-w-[12ch] whitespace-pre-line text-[2.4rem] font-extrabold leading-[0.95] tracking-tight text-[#162b26] sm:text-[3.2rem] lg:text-[3.6rem]">
					{t("core.title")}
				</h2>
				<p className="mt-5 max-w-[34rem] text-[0.95rem] leading-7 text-[#3E514D]">
					{t("core.blurb")}
				</p>

				<div className="mt-14 space-y-20 sm:mt-20 sm:space-y-28">
					{CORE.map((item, i) => (
						<article
							key={item.id}
							className={`grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14 ${
								i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
							}`}
						>
							<button
								type="button"
								onClick={() => setActiveId(item.id)}
								className="group relative aspect-[16/10] w-full overflow-hidden rounded-[0.35rem] bg-[#E8E2D8] text-left"
							>
								<Image
									src={item.src}
									alt={item.alt}
									fill
									sizes="(max-width: 1024px) 100vw, 50vw"
									className="object-cover transition duration-700 group-hover:scale-[1.03]"
								/>
							</button>

							<div>
								<p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]/55">
									{item.n}
								</p>
								<h3 className="mt-3 text-[1.55rem] font-extrabold tracking-tight text-[#162b26] sm:text-[1.85rem]">
									{t(item.titleKey)}
								</h3>
								<p className="mt-3 text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-[#0F4C45]">
									{t(item.capKey)}
								</p>
								<p className="mt-4 max-w-[28rem] text-[0.9rem] leading-7 text-[#4A5C58]">
									{t(item.bodyKey)}
								</p>
								<ul className="mt-5 flex flex-wrap gap-x-3 gap-y-1.5">
									{item.tags.map((key) => (
										<li
											key={key}
											className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#0F4C45]/75"
										>
											{t(key)}
										</li>
									))}
								</ul>
								<button
									type="button"
									onClick={() => setActiveId(item.id)}
									className="mt-6 text-[0.8rem] font-semibold text-[#0F4C45] underline-offset-4 transition hover:underline"
								>
									{t("core.open")}
								</button>
							</div>
						</article>
					))}
				</div>

				<div className="mt-20 border-t border-[#0F4C45]/12 pt-12 text-center sm:mt-28">
					<p className="text-[0.95rem] text-[#4A5C58]">{t("archive.prompt")}</p>
					<p className="mt-2 text-[1.25rem] font-extrabold tracking-tight text-[#162b26] sm:text-[1.45rem]">
						{t("archive.title")}
					</p>
					<Link
						href="/archive/"
						className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#0F4C45] px-6 py-2.5 text-[0.82rem] font-semibold text-[#0F4C45] transition hover:bg-[#043439] hover:text-white"
					>
						{t("archive.cta")}
						<span aria-hidden>→</span>
					</Link>
				</div>
			</div>

			{active && showcase ? (
				<div className="fixed inset-0 z-50 flex items-end justify-center bg-[#162b26]/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-6">
					<button
						type="button"
						aria-label={t("journey.close")}
						className="absolute inset-0 cursor-pointer border-0 bg-transparent"
						onClick={() => setActiveId(null)}
					/>
					<div
						role="dialog"
						aria-modal="true"
						className="relative z-10 flex max-h-[88vh] w-full max-w-[46rem] flex-col overflow-hidden rounded-t-2xl bg-[#F7F1E8] shadow-2xl sm:rounded-2xl"
					>
						<div className="flex shrink-0 items-center justify-between border-b border-[#0F4C45]/10 px-5 py-3.5">
							<p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#0F4C45]/50">
								Brief
							</p>
							<button
								type="button"
								onClick={() => setActiveId(null)}
								className="text-[0.78rem] font-semibold text-[#6A7A76] hover:text-[#0F4C45]"
							>
								{t("journey.close")}
							</button>
						</div>
						<div className="min-h-0 flex-1 overflow-y-auto">
							<ShowcaseDocument
								item={showcase}
								sectionLabel={active.section}
								className="shadow-none"
							/>
						</div>
					</div>
				</div>
			) : null}
		</section>
	);
}
