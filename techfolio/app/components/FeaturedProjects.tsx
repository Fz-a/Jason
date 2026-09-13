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
		tags: ["core.rtk.c1", "core.rtk.c2", "core.rtk.c3", "core.rtk.c4"],
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
		tags: ["core.agv.c1", "core.agv.c2", "core.agv.c3", "core.agv.c4"],
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
		tags: [
			"core.fire.c1",
			"core.fire.c2",
			"core.fire.c3",
			"core.fire.c4",
			"core.fire.c5",
		],
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
		tags: ["core.wear.c1", "core.wear.c2", "core.wear.c3", "core.wear.c4"],
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
			className="scroll-mt-24 bg-[#F7F1E8] pb-16 pt-14 sm:scroll-mt-28 sm:pb-24 sm:pt-20"
		>
			<div className="mx-auto w-full max-w-[1100px] px-6 sm:px-8 md:px-10 lg:px-12 xl:max-w-[1160px] xl:px-14">
				<p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]/70">
					{t("core.kicker")}
				</p>
				<h2 className="mt-4 max-w-[14ch] whitespace-pre-line text-[2.4rem] font-extrabold leading-[0.95] tracking-tight text-[#162b26] sm:text-[3.2rem] lg:text-[3.6rem]">
					{t("core.title")}
				</h2>
				<p className="mt-5 max-w-[34rem] text-[0.95rem] leading-7 text-[#3E514D]">
					{t("core.blurb")}
				</p>

				{/* Vertical editorial sequence — not a card grid */}
				<div className="mt-16 space-y-24 sm:mt-24 sm:space-y-32">
					{CORE.map((item) => (
						<article key={item.id} className="max-w-[52rem]">
							<p className="font-mono text-[0.72rem] font-semibold tracking-[0.08em] text-[#0F4C45]/45">
								{item.n}
							</p>
							<p className="mt-4 text-[0.78rem] font-semibold uppercase tracking-[0.22em] text-[#0F4C45]">
								{t(item.capKey)}
							</p>
							<h3 className="mt-2 text-[1.65rem] font-extrabold tracking-tight text-[#162b26] sm:text-[2rem]">
								{t(item.titleKey)}
							</h3>
							<p className="mt-4 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#0F4C45]/65">
								{item.tags.map((key) => t(key)).join(" · ")}
							</p>

							<button
								type="button"
								onClick={() => setActiveId(item.id)}
								className="group relative mt-8 aspect-[16/10] w-full overflow-hidden bg-[#E8E2D8] text-left"
							>
								<Image
									src={item.src}
									alt={item.alt}
									fill
									sizes="(max-width: 1024px) 100vw, 720px"
									className="object-cover transition duration-700 group-hover:scale-[1.02]"
								/>
							</button>

							<p className="mt-6 max-w-[36rem] text-[0.95rem] leading-7 text-[#4A5C58]">
								{t(item.bodyKey)}
							</p>
							<button
								type="button"
								onClick={() => setActiveId(item.id)}
								className="mt-4 text-[0.78rem] font-semibold text-[#0F4C45]/70 underline-offset-4 transition hover:text-[#0F4C45] hover:underline"
							>
								{t("core.open")}
							</button>
						</article>
					))}
				</div>

				{/* Quiet archive entry */}
				<div className="mt-24 border-t border-[#0F4C45]/10 pt-14 text-center sm:mt-32">
					<p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#0F4C45]/45">
						{t("archive.kicker")}
					</p>
					<p className="mt-3 text-[1.15rem] font-extrabold tracking-tight text-[#162b26]">
						{t("archive.title")}
					</p>
					<p className="mt-2 text-[0.85rem] text-[#6A7A76]">
						{t("archive.prompt")}
					</p>
					<Link
						href="/archive/"
						className="mt-6 inline-block text-[0.82rem] font-semibold text-[#0F4C45] underline-offset-4 transition hover:underline"
					>
						{t("archive.cta")} →
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
