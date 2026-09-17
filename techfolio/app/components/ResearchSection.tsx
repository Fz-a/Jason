"use client";

import Image from "next/image";

import { useLocale } from "../lib/i18n";
import { LayoutText } from "../lib/use-page-layout";

const DIRS = [
	{
		n: "01",
		title: "research.d1.title",
		tech: "research.d1.tech",
		img: "/research/d1.webp?v=2",
		alt: "Satellite beams positioning signals down to a drone over a crosshair-marked field.",
	},
	{
		n: "02",
		title: "research.d2.title",
		tech: "research.d2.tech",
		img: "/research/d2.webp?v=2",
		alt: "Drone scans crop rows with dotted sensing waves beside a microchip.",
	},
	{
		n: "03",
		title: "research.d3.title",
		tech: "research.d3.tech",
		img: "/research/d3.webp?v=2",
		alt: "Field rover follows a planned dotted route to a destination flag.",
	},
	{
		n: "04",
		title: "research.d4.title",
		tech: "research.d4.tech",
		img: "/research/d4.webp?v=2",
		alt: "Drone linked by a dashed line to a ground rover and sensor posts.",
	},
] as const;

export function ResearchSection() {
	const { t } = useLocale();

	return (
		<section id="research" className="story-slide bg-[#F7F1E8]">
			<div className="story-slide__body !justify-start px-5 py-6 sm:px-8 sm:py-7 md:px-11 lg:px-14 lg:py-9">
				<div className="mx-auto flex h-full w-full max-w-[1180px] flex-col xl:max-w-[1260px]">
					<header className="shrink-0 pt-[2.5vh] sm:pt-[3.5vh] lg:pt-[4.5vh]">
						<p className="text-[0.58rem] font-medium uppercase tracking-[0.3em] text-[#0F4C45]/55">
							<LayoutText k="research.kicker" />
						</p>
						<h2 className="mt-3 max-w-[16ch] text-[clamp(2.5rem,6.5vw,5.25rem)] font-semibold uppercase leading-[0.94] tracking-[-0.045em] text-[#162b26]">
							<LayoutText k="research.title" />
						</h2>
					</header>

					<div className="flex min-h-0 flex-1 flex-col justify-center pb-[4vh] pt-4 lg:pb-[6vh]">
					<div className="grid grid-cols-2 gap-x-6 gap-y-10 xl:grid-cols-4 xl:gap-x-8">
						{DIRS.map((d) => (
							<figure
								key={d.n}
								className="flex flex-col items-center text-center"
							>
								<Image
									src={d.img}
									alt={d.alt}
									width={768}
									height={768}
									className="h-32 w-full object-contain select-none sm:h-40 xl:h-44"
								/>
								<figcaption className="mt-5 px-1">
									<p className="font-mono text-[0.62rem] font-semibold tracking-[0.25em] text-[#0F4C45]/60">
										{d.n}
									</p>
									<p className="mt-2 text-[1rem] font-extrabold leading-tight tracking-tight text-[#162b26]">
										<LayoutText k={d.title} />
									</p>
									<p className="mt-1.5 text-[0.66rem] font-medium text-[#4A5C58]">
										{t(d.tech)}
									</p>
								</figcaption>
							</figure>
						))}
					</div>
				</div>
			</div>
		</div>
	</section>
	);
}
