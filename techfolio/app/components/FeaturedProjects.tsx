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

type CapId = "rtk" | "agv" | "fire" | "wearable";

type CoreCapability = {
	id: CapId;
	n: string;
	titleKey: string;
	capKey: string;
	tags: readonly string[];
	src: string;
	alt: string;
	showcaseId: string;
	section: string;
};

const CORE: CoreCapability[] = [
	{
		id: "rtk",
		n: "01",
		titleKey: "core.rtk.title",
		capKey: "core.rtk.cap",
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
		tags: ["core.agv.c1", "core.agv.c2", "core.agv.c3"],
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
		tags: ["core.fire.c1", "core.fire.c2", "core.fire.c3", "core.fire.c4"],
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
		tags: ["core.wear.c1", "core.wear.c2", "core.wear.c3", "core.wear.c4"],
		src: "/experience/university/smart-clothes/smart-vest.webp",
		alt: "Smart wearable sensing system",
		showcaseId: "smart-clothes",
		section: "University",
	},
];

function MiniVisual({ id }: { id: CapId }) {
	const stroke = "#0F4C45";
	const muted = "rgba(15,76,69,0.35)";
	const common = {
		fill: "none",
		stroke,
		strokeWidth: 1.25,
		strokeLinecap: "round" as const,
		strokeLinejoin: "round" as const,
	};

	if (id === "rtk") {
		return (
			<svg viewBox="0 0 120 88" className="h-full w-full" aria-hidden>
				<circle cx="60" cy="14" r="7" {...common} />
				<text x="60" y="17" textAnchor="middle" fontSize="6" fill={stroke} fontFamily="monospace">
					SAT
				</text>
				<path d="M60 22 v14" stroke={muted} strokeWidth="1" />
				<rect x="42" y="36" width="36" height="16" rx="1" {...common} />
				<text x="60" y="47" textAnchor="middle" fontSize="7" fill={stroke} fontFamily="monospace">
					RTK
				</text>
				<path d="M60 52 v12" stroke={muted} strokeWidth="1" />
				<path d="M48 72 h24 l-4 8 h-16 z" {...common} />
				<text x="60" y="86" textAnchor="middle" fontSize="6" fill={stroke} fontFamily="monospace">
					UAV
				</text>
			</svg>
		);
	}

	if (id === "agv") {
		return (
			<svg viewBox="0 0 120 88" className="h-full w-full" aria-hidden>
				<circle cx="22" cy="44" r="5" {...common} />
				<path d="M28 44 H52" stroke={muted} strokeWidth="1" markerEnd="url(#arrow)" />
				<circle cx="60" cy="44" r="5" {...common} />
				<path d="M66 44 H90" stroke={muted} strokeWidth="1" />
				<circle cx="98" cy="44" r="5" {...common} />
				<path d="M60 50 L72 68" stroke={muted} strokeWidth="1" />
				<rect x="64" y="68" width="20" height="10" rx="1" {...common} />
				<text x="74" y="76" textAnchor="middle" fontSize="6" fill={stroke} fontFamily="monospace">
					AGV
				</text>
			</svg>
		);
	}

	if (id === "fire") {
		return (
			<svg viewBox="0 0 120 88" className="h-full w-full" aria-hidden>
				<rect x="44" y="8" width="32" height="20" rx="1" {...common} />
				<circle cx="60" cy="18" r="5" {...common} />
				<path d="M60 28 v12" stroke={muted} strokeWidth="1" />
				<rect x="40" y="40" width="40" height="18" rx="1" {...common} />
				<text x="60" y="52" textAnchor="middle" fontSize="8" fill={stroke} fontFamily="monospace">
					AI
				</text>
				<path d="M60 58 v10" stroke={muted} strokeWidth="1" />
				<text x="60" y="80" textAnchor="middle" fontSize="7" fill={stroke} fontFamily="monospace">
					DETECT
				</text>
			</svg>
		);
	}

	return (
		<svg viewBox="0 0 120 88" className="h-full w-full" aria-hidden>
			{[18, 36, 54, 72].map((y, i) => (
				<g key={y}>
					<circle cx="28" cy={y} r="4" {...common} />
					<text x="18" y={y + 2.5} textAnchor="end" fontSize="6" fill={stroke} fontFamily="monospace">
						S{i + 1}
					</text>
					<path d={`M34 ${y} H58`} stroke={muted} strokeWidth="1" />
				</g>
			))}
			<path d="M58 18 V72" stroke={muted} strokeWidth="1" />
			<path d="M58 45 H72" stroke={muted} strokeWidth="1" />
			<rect x="72" y="36" width="36" height="18" rx="1" {...common} />
			<text x="90" y="48" textAnchor="middle" fontSize="6" fill={stroke} fontFamily="monospace">
				SYSTEM
			</text>
		</svg>
	);
}

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
			className="scroll-mt-24 bg-[#F7F1E8] pb-14 pt-14 sm:scroll-mt-28 sm:pb-20 sm:pt-16"
		>
			<div className="mx-auto w-full max-w-[1100px] px-6 sm:px-8 md:px-10 lg:px-12 xl:max-w-[1160px] xl:px-14">
				<p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]/70">
					{t("core.kicker")}
				</p>
				<h2 className="mt-4 max-w-[18ch] text-[2rem] font-extrabold leading-[1.05] tracking-tight text-[#162b26] sm:text-[2.6rem]">
					{t("core.title")}
				</h2>
				<p className="mt-4 max-w-[34rem] text-[0.9rem] leading-7 text-[#3E514D]">
					{t("core.blurb")}
				</p>

				{/* Compact capability rows — not a PPT card grid */}
				<div className="mt-12 divide-y divide-[#0F4C45]/12 border-y border-[#0F4C45]/12">
					{CORE.map((item) => (
						<article
							key={item.id}
							className="grid grid-cols-1 gap-6 py-8 sm:py-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-10"
						>
							<button
								type="button"
								onClick={() => setActiveId(item.id)}
								className="group text-left"
							>
								<p className="font-mono text-[0.68rem] text-[#0F4C45]/40">
									{item.n}
								</p>
								<h3 className="mt-2 text-[1.25rem] font-extrabold tracking-tight text-[#162b26] sm:text-[1.45rem]">
									{t(item.capKey)}
								</h3>
								<p className="mt-1.5 text-[0.9rem] font-medium text-[#4A5C58]">
									{t(item.titleKey)}
								</p>
								<p className="mt-3 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#0F4C45]/60">
									{item.tags.map((key) => t(key)).join(" · ")}
								</p>
								<span className="mt-4 inline-block text-[0.75rem] font-semibold text-[#0F4C45]/55 underline-offset-4 group-hover:text-[#0F4C45] group-hover:underline">
									{t("core.open")} →
								</span>
							</button>

							<div className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-4 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-5">
								<div className="aspect-square w-full border border-[#0F4C45]/12 bg-[#FFFCFA] p-1.5">
									<MiniVisual id={item.id} />
								</div>
								<button
									type="button"
									onClick={() => setActiveId(item.id)}
									className="relative aspect-[16/10] w-full overflow-hidden bg-[#E8E2D8]"
								>
									<Image
										src={item.src}
										alt={item.alt}
										fill
										sizes="(max-width: 1024px) 50vw, 360px"
										className="object-cover transition duration-500 hover:scale-[1.02]"
									/>
								</button>
							</div>
						</article>
					))}
				</div>

				{/* Capabilities converge */}
				<div className="mt-14 text-center sm:mt-16">
					<p className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#0F4C45]/55">
						<span>{t("core.rtk.cap")}</span>
						<span aria-hidden className="text-[#0F4C45]/25">
							·
						</span>
						<span>{t("core.agv.cap")}</span>
						<span aria-hidden className="text-[#0F4C45]/25">
							·
						</span>
						<span>{t("core.fire.cap")}</span>
						<span aria-hidden className="text-[#0F4C45]/25">
							·
						</span>
						<span>{t("core.wear.cap")}</span>
					</p>
					<div className="mt-4 flex flex-col items-center" aria-hidden>
						<span className="h-8 w-px bg-[#0F4C45]/25" />
						<span className="mt-1 text-[#0F4C45]/40">↓</span>
					</div>
					<p className="mt-3 text-[1.05rem] font-extrabold tracking-tight text-[#162b26]">
						{t("core.converge.title")}
					</p>
					<div className="mt-3 flex flex-col items-center" aria-hidden>
						<span className="h-6 w-px bg-[#0F4C45]/25" />
						<span className="mt-1 text-[#0F4C45]/40">↓</span>
					</div>
					<p className="mt-3 text-[1.15rem] font-extrabold tracking-tight text-[#043439]">
						{t("core.converge.goal")}
					</p>
					<p className="mx-auto mt-4 max-w-[28rem] text-[0.85rem] leading-6 text-[#6A7A76]">
						{t("core.converge.blurb")}
					</p>
				</div>

				<div className="mt-16 border-t border-[#0F4C45]/10 pt-10 text-center">
					<p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#0F4C45]/45">
						{t("archive.kicker")}
					</p>
					<Link
						href="/archive/"
						className="mt-3 inline-block text-[0.88rem] font-semibold text-[#0F4C45] underline-offset-4 hover:underline"
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
