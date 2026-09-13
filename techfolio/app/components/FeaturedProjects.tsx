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

type CoreCard = {
	id: string;
	titleKey: string;
	capKey: string;
	caps: readonly string[];
	src: string;
	alt: string;
	showcaseId: string;
	section: string;
};

const CORE: CoreCard[] = [
	{
		id: "rtk",
		titleKey: "core.rtk.title",
		capKey: "core.rtk.cap",
		caps: ["core.rtk.c1", "core.rtk.c2", "core.rtk.c3", "core.rtk.c4"],
		src: "/experience/work/zongheng/rtk-field.webp",
		alt: "RTK agricultural positioning hardware",
		showcaseId: "rtk",
		section: "Work",
	},
	{
		id: "agv",
		titleKey: "core.agv.title",
		capKey: "core.agv.cap",
		caps: ["core.agv.c1", "core.agv.c2", "core.agv.c3", "core.agv.c4"],
		src: "/experience/work/zongheng/agv-yellow.webp",
		alt: "Industrial AGV robotics",
		showcaseId: "agv",
		section: "Work",
	},
	{
		id: "fire",
		titleKey: "core.fire.title",
		capKey: "core.fire.cap",
		caps: ["core.fire.c1", "core.fire.c2", "core.fire.c3", "core.fire.c4"],
		src: "/experience/university/fire-warning/camera-jetson.webp",
		alt: "Edge AI fire warning system",
		showcaseId: "fire-warning",
		section: "University",
	},
	{
		id: "wearable",
		titleKey: "core.wear.title",
		capKey: "core.wear.cap",
		caps: ["core.wear.c1", "core.wear.c2", "core.wear.c3", "core.wear.c4"],
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

type Props = {
	onOpenArchive: () => void;
};

export function FeaturedProjects({ onOpenArchive }: Props) {
	const { t } = useLocale();
	const [activeId, setActiveId] = useState<string | null>(null);

	const activeCard = CORE.find((w) => w.id === activeId) ?? null;
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
			id="experience"
			className="scroll-mt-24 bg-[#F7F1E8] pb-10 pt-6 sm:scroll-mt-28 sm:pb-12 sm:pt-8"
		>
			<div className="mx-auto w-full max-w-[1100px] px-6 sm:px-8 md:px-10 lg:px-12 xl:max-w-[1160px] xl:px-14">
				<p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#0F4C45] sm:text-[0.74rem]">
					{t("core.kicker")}
				</p>
				<h2 className="mt-2.5 max-w-[18ch] text-[1.55rem] font-extrabold tracking-tight text-[#162b26] sm:text-[1.9rem]">
					{t("core.title")}
				</h2>
				<p className="mt-2 max-w-[32rem] text-[0.88rem] leading-7 text-[#3E514D]">
					{t("core.blurb")}
				</p>

				<div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
					{CORE.map((item, i) => (
						<button
							key={item.id}
							type="button"
							onClick={() => setActiveId(item.id)}
							className="group overflow-hidden rounded-[1.05rem] border border-[#0F4C45]/10 bg-[#FFFCFA] text-left transition hover:border-[#0F4C45]/20"
						>
							<div className="relative aspect-[16/9] overflow-hidden bg-[#E8E2D8]">
								<Image
									src={item.src}
									alt={item.alt}
									fill
									sizes="(max-width: 640px) 100vw, 50vw"
									className="object-cover transition duration-500 group-hover:scale-[1.03]"
								/>
								<span className="absolute left-3 top-3 rounded-full bg-[#043439]/88 px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-white">
									0{i + 1}
								</span>
							</div>
							<div className="px-4 py-4 sm:px-5">
								<p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#0F4C45]/55">
									{t(item.capKey)}
								</p>
								<p className="mt-1 text-[1.05rem] font-extrabold tracking-tight text-[#162b26]">
									{t(item.titleKey)}
								</p>
								<ul className="mt-3 flex flex-wrap gap-1.5">
									{item.caps.map((key) => (
										<li
											key={key}
											className="rounded-full border border-[#0F4C45]/12 bg-[#F7F1E8] px-2.5 py-1 text-[0.68rem] font-semibold text-[#0F4C45]"
										>
											{t(key)}
										</li>
									))}
								</ul>
							</div>
						</button>
					))}
				</div>

				{/* Archive entry — one clear door, not a card grid */}
				<div className="mt-10 border-y border-[#0F4C45]/12 py-8 text-center">
					<p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#0F4C45]/50">
						{t("archive.kicker")}
					</p>
					<h3 className="mt-2 text-[1.15rem] font-extrabold tracking-tight text-[#162b26] sm:text-[1.3rem]">
						{t("archive.title")}
					</h3>
					<p className="mx-auto mt-2 max-w-[28rem] text-[0.84rem] leading-6 text-[#4A5C58]">
						{t("archive.blurb")}
					</p>
					<button
						type="button"
						onClick={onOpenArchive}
						className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#0F4C45] px-5 py-2.5 text-[0.82rem] font-semibold text-[#0F4C45] transition hover:bg-[#0F4C45] hover:text-white"
					>
						{t("archive.cta")}
						<span aria-hidden>→</span>
					</button>
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
