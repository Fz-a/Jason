import Image from "next/image";
import {
	societyEssay,
	type SocietyEssayBlock,
	type SocietyImage,
} from "./society-essay";

function EssayImage({
	image,
	priority = false,
	frameClassName = "",
}: {
	image: SocietyImage;
	priority?: boolean;
	frameClassName?: string;
}) {
	const contain = image.fit === "contain";

	return (
		<figure className={frameClassName}>
			<div
				className={`overflow-hidden ${
					contain ? "bg-[#F7F1E8] p-3 sm:p-4" : "bg-[#E8EDE8]"
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
				<figcaption className="mt-2.5 text-[0.72rem] leading-5 tracking-[0.02em] text-[#6A7A76]">
					{image.caption}
				</figcaption>
			) : null}
		</figure>
	);
}

function ChapterBlock({
	block,
}: {
	block: Extract<SocietyEssayBlock, { type: "chapter" }>;
}) {
	const side = block.imageSide ?? "right";
	const hasImage = Boolean(block.image);
	const gallery = block.gallery ?? [];

	return (
		<article className="border-t border-[#0F4C45]/10 pt-10 sm:pt-14">
			<div className="flex items-baseline gap-3">
				<span className="font-mono text-[0.72rem] font-semibold tracking-[0.2em] text-[#0F4C45]/7">
					{block.num}
				</span>
				<div>
					<h2 className="text-[1.45rem] font-extrabold tracking-tight text-[#162b26] sm:text-[1.7rem]">
						{block.title}
					</h2>
					{block.titleZh ? (
						<p className="mt-1 text-[0.82rem] tracking-[0.04em] text-[#6A7A76]">
							{block.titleZh}
						</p>
					) : null}
				</div>
			</div>

			{block.pull ? (
				<p className="mt-6 max-w-[30rem] border-l-2 border-[#0F4C45]/35 pl-4 text-[1.02rem] font-medium leading-8 text-[#162b26] sm:text-[1.08rem] sm:leading-8">
					{block.pull}
				</p>
			) : null}

			{hasImage && side === "full" && block.image ? (
				<div className="mt-8">
					<EssayImage image={block.image} />
				</div>
			) : null}

			{hasImage && side !== "full" && block.image ? (
				<div
					className={`mt-8 grid grid-cols-1 items-start gap-8 lg:gap-10 ${
						side === "left"
							? "lg:grid-cols-[1.05fr_0.95fr]"
							: "lg:grid-cols-[0.95fr_1.05fr]"
					}`}
				>
					{side === "left" ? (
						<>
							<EssayImage image={block.image} />
							<div className="space-y-4 text-[0.92rem] leading-7 text-[#3E514D] sm:text-[0.95rem] sm:leading-[1.8rem]">
								{block.body.map((paragraph) => (
									<p key={paragraph.slice(0, 48)}>{paragraph}</p>
								))}
							</div>
						</>
					) : (
						<>
							<div className="space-y-4 text-[0.92rem] leading-7 text-[#3E514D] sm:text-[0.95rem] sm:leading-[1.8rem]">
								{block.body.map((paragraph) => (
									<p key={paragraph.slice(0, 48)}>{paragraph}</p>
								))}
							</div>
							<EssayImage image={block.image} />
						</>
					)}
				</div>
			) : (
				<div className="mt-6 max-w-[40rem] space-y-4 text-[0.92rem] leading-7 text-[#3E514D] sm:text-[0.95rem] sm:leading-[1.8rem]">
					{block.body.map((paragraph) => (
						<p key={paragraph.slice(0, 48)}>{paragraph}</p>
					))}
				</div>
			)}

			{gallery.length > 0 ? (
				<div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
					{gallery.map((image, index) => (
						<EssayImage
							key={image.src}
							image={image}
							frameClassName={index === 1 ? "sm:mt-10" : ""}
						/>
					))}
				</div>
			) : null}
		</article>
	);
}

function DuoExhibitBlock({
	block,
}: {
	block: Extract<SocietyEssayBlock, { type: "duo-exhibit" }>;
}) {
	return (
		<article className="border-t border-[#0F4C45]/10 pt-10 sm:pt-14">
			<div className="flex items-baseline gap-3">
				<span className="font-mono text-[0.72rem] font-semibold tracking-[0.2em] text-[#0F4C45]/7">
					{block.num}
				</span>
				<div>
					<h2 className="text-[1.45rem] font-extrabold tracking-tight text-[#162b26] sm:text-[1.7rem]">
						{block.title}
					</h2>
					{block.titleZh ? (
						<p className="mt-1 text-[0.82rem] tracking-[0.04em] text-[#6A7A76]">
							{block.titleZh}
						</p>
					) : null}
				</div>
			</div>

			<div className="mt-6 max-w-[42rem] space-y-4 text-[0.92rem] leading-7 text-[#3E514D] sm:text-[0.95rem] sm:leading-[1.8rem]">
				{block.body.map((paragraph) => (
					<p key={paragraph.slice(0, 48)}>{paragraph}</p>
				))}
			</div>

			<div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
				{block.images.map((image, index) => (
					<EssayImage
						key={image.src}
						image={image}
						frameClassName={index === 1 ? "sm:mt-10" : ""}
					/>
				))}
			</div>
		</article>
	);
}

export function SocietyEssay() {
	return (
		<div className="mt-8 overflow-hidden rounded-[1.25rem] border border-[#0F4C45]/12 bg-[#DDE7DE] shadow-[0_12px_28px_rgba(22,43,38,0.05)]">
			<div className="px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
				{societyEssay.map((block, index) => {
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

					if (block.type === "chapter") {
						return <ChapterBlock key={`${block.num}-${index}`} block={block} />;
					}

					if (block.type === "duo-exhibit") {
						return (
							<DuoExhibitBlock key={`${block.num}-${index}`} block={block} />
						);
					}

					return null;
				})}

				<p className="mt-12 border-t border-[#0F4C45]/10 pt-8 text-center text-[0.64rem] font-medium tracking-[0.18em] text-[#8A9692]">
					End of Society
				</p>
			</div>
		</div>
	);
}
