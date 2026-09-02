import Image from "next/image";
import { DiyCarousel } from "./DiyCarousel";
import {
	makeEssay,
	type MakeEssayBlock,
	type MakeImage,
} from "./make-essay";

function FrameImage({
	image,
	priority = false,
	className = "",
	frameClassName = "bg-[#E8EDE8]",
}: {
	image: MakeImage;
	priority?: boolean;
	className?: string;
	frameClassName?: string;
}) {
	const contain = image.fit === "contain";

	return (
		<figure className={className}>
			<div
				className={`overflow-hidden ${
					contain ? `bg-[#F7F1E8] p-3 sm:p-4 ${frameClassName}` : frameClassName
				}`}
			>
				<Image
					src={image.src}
					alt={image.alt}
					width={image.width}
					height={image.height}
					priority={priority}
					className={`h-auto w-full ${
						contain ? "object-contain" : "object-cover"
					}`}
				/>
			</div>
			{image.caption ? (
				<figcaption className="mt-2.5 text-[0.7rem] leading-5 tracking-[0.03em] text-[#7A8A86]">
					{image.caption}
				</figcaption>
			) : null}
		</figure>
	);
}

function HelmetBlock({
	block,
}: {
	block: Extract<MakeEssayBlock, { type: "helmet" }>;
}) {
	const [product, camp, crew] = block.images;

	return (
		<article className="border-t border-[#0F4C45]/10 pt-10 sm:pt-14">
			{/* Intro: classic left copy / right product */}
			<div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
				<div className="lg:col-span-5">
					<div className="flex items-baseline gap-3">
						<span className="font-mono text-[0.72rem] font-semibold tracking-[0.2em] text-[#0F4C45]/7">
							{block.num}
						</span>
						<div>
							<h2 className="text-[1.4rem] font-extrabold tracking-tight text-[#162b26] sm:text-[1.6rem]">
								{block.title}
							</h2>
							<p className="mt-1 text-[0.8rem] tracking-[0.04em] text-[#6A7A76]">
								{block.titleZh}
							</p>
						</div>
					</div>

					<p className="mt-7 max-w-[26rem] text-[1rem] font-medium leading-8 text-[#162b26] sm:text-[1.05rem] sm:leading-8">
						{block.pull}
					</p>

					<div className="mt-5 max-w-[28rem] space-y-3.5 text-[0.9rem] leading-7 text-[#3E514D] sm:text-[0.92rem] sm:leading-[1.75rem]">
						{block.body.map((paragraph) => (
							<p key={paragraph.slice(0, 48)}>{paragraph}</p>
						))}
					</div>
				</div>

				{product ? (
					<div className="lg:col-span-7 lg:pt-1">
						<FrameImage
							image={product}
							priority
							className="mx-auto max-w-[28rem] lg:ml-auto lg:mr-0 lg:max-w-[32rem]"
							frameClassName="bg-[#E4EBE5]"
						/>
					</div>
				) : null}
			</div>

			{/* Booth pair — quiet magazine row */}
			{(camp || crew) && (
				<div className="mt-14 border-t border-[#0F4C45]/08 pt-10 sm:mt-16 sm:pt-12">
					<p className="font-mono text-[0.62rem] font-semibold tracking-[0.22em] text-[#8A9692]">
						Booth
					</p>

					<div className="mt-6 grid grid-cols-1 items-end gap-8 sm:mt-8 sm:grid-cols-12 sm:gap-10">
						{camp ? (
							<FrameImage
								image={camp}
								className="sm:col-span-5"
								frameClassName="bg-[#E4EBE5]"
							/>
						) : null}
						{crew ? (
							<FrameImage
								image={crew}
								className="sm:col-span-7 sm:pb-8"
								frameClassName="bg-[#E4EBE5]"
							/>
						) : null}
					</div>
				</div>
			)}
		</article>
	);
}

function DiyWallBlock({
	block,
}: {
	block: Extract<MakeEssayBlock, { type: "diy-wall" }>;
}) {
	return (
		<article className="border-t border-[#0F4C45]/10 pt-10 sm:pt-14">
			<header className="mx-auto max-w-[32rem] text-center">
				<p className="font-mono text-[0.64rem] font-semibold tracking-[0.28em] text-[#0F4C45]">
					{block.num} · DIY
				</p>
				<h2 className="mt-3 text-[1.5rem] font-extrabold tracking-tight text-[#162b26] sm:text-[1.8rem]">
					{block.title}
				</h2>
				<p className="mt-1 text-[0.82rem] tracking-[0.04em] text-[#6A7A76]">
					{block.titleZh}
				</p>
				<p className="mx-auto mt-4 max-w-[26rem] text-[0.9rem] leading-7 text-[#3E514D] sm:text-[0.94rem] sm:leading-8">
					{block.lede}
				</p>
			</header>

			<div className="mx-auto mt-10 max-w-[56rem]">
				<DiyCarousel items={block.items} />
			</div>
		</article>
	);
}

export function MakeEssay() {
	return (
		<div className="mt-8 overflow-hidden rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] shadow-[0_12px_28px_rgba(22,43,38,0.05)]">
			<div className="px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
				{makeEssay.map((block, index) => {
					if (block.type === "opener") {
						return (
							<header key="opener" className="max-w-[40rem] pb-2">
								<p className="text-[0.64rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]">
									{block.kicker}
								</p>
								<h2 className="mt-3 text-[1.75rem] font-extrabold leading-[1.05] tracking-tight text-[#162b26] sm:text-[2.1rem]">
									{block.title}
								</h2>
								<p className="mt-4 text-[0.95rem] leading-7 text-[#3E514D] sm:text-[1rem] sm:leading-8">
									{block.lede}
								</p>
							</header>
						);
					}

					if (block.type === "helmet") {
						return <HelmetBlock key={`${block.num}-${index}`} block={block} />;
					}

					if (block.type === "diy-wall") {
						return <DiyWallBlock key={`${block.num}-${index}`} block={block} />;
					}

					return null;
				})}

				<p className="mt-12 border-t border-[#0F4C45]/10 pt-8 text-center text-[0.64rem] font-medium tracking-[0.18em] text-[#8A9692]">
					End of MAKE
				</p>
			</div>
		</div>
	);
}
