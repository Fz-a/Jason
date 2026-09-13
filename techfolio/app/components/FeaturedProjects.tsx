"use client";

import Image from "next/image";
import { useLocale } from "../lib/i18n";

const FEATURED = [
	{
		id: "01",
		titleKey: "featured.01.title",
		tagsKey: "featured.01.tags",
		descKey: "featured.01.desc",
		src: "/experience/university/smart-clothes/smart-vest.webp",
		alt: "Smart care clothing wearable vest",
		exploring: false,
	},
	{
		id: "02",
		titleKey: "featured.02.title",
		tagsKey: "featured.02.tags",
		descKey: "featured.02.desc",
		src: "/experience/work/zongheng/agv-yellow.webp",
		alt: "Industrial AGV robot",
		exploring: false,
	},
	{
		id: "03",
		titleKey: "featured.03.title",
		tagsKey: "featured.03.tags",
		descKey: "featured.03.desc",
		src: "/experience/work/zongheng/vxs-100.webp",
		alt: "VXS-100 AI handheld terminal",
		exploring: false,
	},
	{
		id: "04",
		titleKey: "featured.04.title",
		tagsKey: "featured.04.tags",
		descKey: "featured.04.desc",
		src: "/experience/work/zongheng/rtk-batch.webp",
		alt: "RTK modules for low-altitude and positioning work",
		exploring: true,
	},
] as const;

export function FeaturedProjects() {
	const { t } = useLocale();

	return (
		<section
			id="projects"
			className="scroll-mt-10 bg-[#F7F1E8] pb-10 pt-6 sm:scroll-mt-14 sm:pb-12 sm:pt-8 lg:pb-14 lg:pt-10"
		>
			<div className="mx-auto w-full max-w-[1100px] px-6 sm:px-8 md:px-10 lg:px-12 xl:max-w-[1160px] xl:px-14">
				<p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#0F4C45] sm:text-[0.74rem]">
					{t("featured.kicker")}
				</p>
				<h2 className="mt-3 text-[1.65rem] font-extrabold tracking-tight text-[#162b26] sm:text-[2rem] lg:text-[2.25rem]">
					{t("featured.title")}
				</h2>

				<div className="mt-7 grid grid-cols-1 gap-5 sm:mt-8 sm:grid-cols-2 sm:gap-6">
					{FEATURED.map((item) => (
						<a
							key={item.id}
							href="#journey"
							className="group flex flex-col overflow-hidden rounded-[1.05rem] border border-[#0F4C45]/10 bg-[#FFFCFA] shadow-[0_12px_28px_rgba(22,43,38,0.04)] transition hover:-translate-y-0.5 hover:border-[#0F4C45]/18 hover:shadow-[0_16px_36px_rgba(22,43,38,0.07)]"
						>
							<div className="relative aspect-[4/3] overflow-hidden bg-[#E8E2D8]">
								<Image
									src={item.src}
									alt={item.alt}
									fill
									sizes="(max-width: 640px) 100vw, 50vw"
									className="object-cover transition duration-500 group-hover:scale-[1.03]"
								/>
								{item.exploring ? (
									<span className="absolute left-3 top-3 rounded-full bg-[#043439]/92 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-white">
										{t("featured.exploring")}
									</span>
								) : null}
							</div>
							<div className="flex flex-1 flex-col px-4 py-4 sm:px-5 sm:py-5">
								<p className="text-[0.65rem] font-semibold tracking-[0.2em] text-[#8A9692]">
									{item.id}
								</p>
								<h3 className="mt-1.5 text-[1.05rem] font-extrabold tracking-tight text-[#162b26] sm:text-[1.12rem]">
									{t(item.titleKey)}
								</h3>
								<p className="mt-1.5 text-[0.72rem] font-medium leading-5 text-[#0F4C45]/75">
									{t(item.tagsKey)}
								</p>
								<p className="mt-2.5 flex-1 text-[0.84rem] leading-6 text-[#3E514D]">
									{t(item.descKey)}
								</p>
								<span className="mt-4 text-[0.78rem] font-semibold text-[#043439] transition group-hover:translate-x-0.5">
									{t("featured.view")} →
								</span>
							</div>
						</a>
					))}
				</div>
			</div>
		</section>
	);
}
