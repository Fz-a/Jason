"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocale } from "../lib/i18n";
import { ShowcaseDocument } from "../projects/UniversityShowcase";
import {
	universityProjectShowcases,
	type UniversityShowcase,
} from "../projects/university-showcases";
import { workShowcases } from "../projects/work-showcases";

type WorkCard = {
	id: string;
	titleKey: string;
	tagsKey: string;
	src: string;
	alt: string;
	exploring?: boolean;
	showcaseId: string;
	section: string;
};

const WORK: WorkCard[] = [
	{
		id: "clothes",
		titleKey: "work.clothes.title",
		tagsKey: "work.clothes.tags",
		src: "/experience/university/smart-clothes/smart-vest.webp",
		alt: "Smart care clothing wearable vest",
		showcaseId: "smart-clothes",
		section: "University",
	},
	{
		id: "agv",
		titleKey: "work.agv.title",
		tagsKey: "work.agv.tags",
		src: "/experience/work/zongheng/agv-yellow.webp",
		alt: "Industrial AGV",
		showcaseId: "agv",
		section: "Work",
	},
	{
		id: "vxs",
		titleKey: "work.vxs.title",
		tagsKey: "work.vxs.tags",
		src: "/experience/work/zongheng/vxs-100.webp",
		alt: "VXS-100 AI handheld",
		showcaseId: "zongheng-robot",
		section: "Work",
	},
	{
		id: "low-altitude",
		titleKey: "work.uav.title",
		tagsKey: "work.uav.tags",
		src: "/experience/work/zongheng/rtk-batch.webp",
		alt: "RTK and low-altitude related hardware",
		exploring: true,
		showcaseId: "rtk",
		section: "Work",
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

	const activeCard = WORK.find((w) => w.id === activeId) ?? null;
	const activeShowcase = activeCard
		? findShowcase(activeCard.showcaseId)
		: null;

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
			id="projects"
			className="scroll-mt-10 bg-[#F7F1E8] pb-8 pt-4 sm:scroll-mt-14 sm:pb-10 sm:pt-6"
		>
			<div className="mx-auto w-full max-w-[1100px] px-6 sm:px-8 md:px-10 lg:px-12 xl:max-w-[1160px] xl:px-14">
				<p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#0F4C45] sm:text-[0.74rem]">
					{t("work.kicker")}
				</p>
				<h2 className="mt-2 text-[1.35rem] font-extrabold tracking-tight text-[#162b26] sm:text-[1.55rem]">
					{t("work.title")}
				</h2>

				<div className="mt-5 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
					{WORK.map((item) => (
						<button
							key={item.id}
							type="button"
							onClick={() => setActiveId(item.id)}
							className="group overflow-hidden rounded-xl border border-[#0F4C45]/10 bg-[#FFFCFA] text-left transition hover:border-[#0F4C45]/18"
						>
							<div className="relative aspect-[16/10] overflow-hidden bg-[#E8E2D8]">
								<Image
									src={item.src}
									alt={item.alt}
									fill
									sizes="(max-width: 640px) 100vw, 25vw"
									className="object-cover transition duration-400 group-hover:scale-[1.03]"
								/>
								{item.exploring ? (
									<span className="absolute left-2 top-2 rounded-full bg-[#043439]/90 px-2 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-white">
										{t("featured.exploring")}
									</span>
								) : null}
							</div>
							<div className="px-3 py-2.5">
								<p className="text-[0.88rem] font-extrabold tracking-tight text-[#162b26]">
									{t(item.titleKey)}
								</p>
								<p className="mt-0.5 text-[0.68rem] font-medium text-[#0F4C45]/70">
									{t(item.tagsKey)}
								</p>
							</div>
						</button>
					))}
				</div>
			</div>

			{activeCard && activeShowcase ? (
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
								item={activeShowcase}
								sectionLabel={activeCard.section}
								className="shadow-none"
							/>
						</div>
					</div>
				</div>
			) : null}
		</section>
	);
}
