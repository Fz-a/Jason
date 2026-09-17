"use client";

import Image from "next/image";
import { LayoutText } from "../lib/use-page-layout";

const STEPS = [
	"next.s1",
	"next.s2",
	"next.s3",
	"next.s4",
	"next.s5",
	"next.s6",
] as const;

/** Next Steps: My Goal–sized title left, path stacked on the right. */
export function ResearchFitNext() {
	return (
		<section id="next" className="story-slide bg-[#F7F1E8]">
			<div className="story-slide__body !justify-start px-5 py-6 sm:px-8 sm:py-7 md:px-11 lg:px-14 lg:py-9">
				<div className="mx-auto flex h-full w-full max-w-[1180px] flex-col xl:max-w-[1260px]">
					<div className="flex min-h-0 flex-1 flex-col gap-10 pt-[2.5vh] sm:pt-[3.5vh] lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-0 lg:pt-[4.5vh]">
						<header className="shrink-0 lg:pr-8 xl:pr-12">
							<p className="text-[0.58rem] font-medium uppercase tracking-[0.3em] text-[#0F4C45]/55">
								<LayoutText k="next.kicker" />
							</p>
							<h2 className="mt-3 text-[clamp(2.5rem,6.5vw,5.25rem)] font-semibold uppercase leading-[0.94] tracking-[-0.045em] text-[#162b26]">
								<LayoutText k="next.title" />
							</h2>
							<p className="mt-4 max-w-[20rem] text-[0.95rem] font-semibold leading-snug tracking-[-0.015em] text-[#162b26]/80">
								<LayoutText k="next.sub" />
							</p>
							<p className="mt-3 max-w-[22rem] text-[0.74rem] leading-[1.65] text-[#4A5C58]">
								<LayoutText k="next.blurb" multiline />
							</p>
							<figure className="mt-6 hidden lg:block lg:translate-y-[3.625rem]">
								<Image
									src="/next-steps-lineart.webp?v=3"
									alt="Line-art diagram of the path ahead: foundations in knowledge, software and hardware craft, and autonomous spraying for agriculture."
									width={1400}
									height={700}
									className="h-auto w-full max-w-[36.5rem] select-none"
								/>
							</figure>
						</header>

						<ol className="w-full max-w-[22rem] self-end translate-y-8 sm:translate-y-12 lg:ml-auto lg:mr-2 lg:max-w-[24rem] lg:-translate-x-[3.5rem] lg:translate-y-[8.4375rem] lg:self-start xl:mr-8 2xl:mr-14">
							{STEPS.map((key, i) => {
								const last = i === STEPS.length - 1;
								return (
									<li key={key} className="flex gap-4">
										<div className="flex flex-col items-center">
											<span
												className={`flex h-7 w-7 shrink-0 items-center justify-center font-mono text-[0.62rem] font-bold ${
													last
														? "bg-[#043439] text-white"
														: "text-[#0F4C45]/45"
												}`}
											>
												0{i + 1}
											</span>
											{!last ? (
												<span
													aria-hidden
													className="my-0.5 w-px flex-1 bg-[#0F4C45]/15"
												/>
											) : null}
										</div>
										<div className={!last ? "pb-9 sm:pb-10 lg:pb-12" : "pb-0"}>
											<p
												className={`pt-0.5 font-extrabold tracking-tight text-[#162b26] ${
													last
														? "text-[1.05rem] sm:text-[1.2rem]"
														: "text-[0.92rem] sm:text-[1rem]"
												}`}
											>
												<LayoutText k={`${key}.title`} />
											</p>
										</div>
									</li>
								);
							})}
						</ol>
					</div>
				</div>
			</div>
		</section>
	);
}
