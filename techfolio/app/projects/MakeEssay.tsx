import Image from "next/image";
import {
	makeEssay,
	type MakeDiyItem,
	type MakeDiySlot,
	type MakeEssayBlock,
	type MakeImage,
} from "./make-essay";

function FrameImage({
	image,
	priority = false,
	className = "",
}: {
	image: MakeImage;
	priority?: boolean;
	className?: string;
}) {
	const contain = image.fit === "contain";

	return (
		<figure className={className}>
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

function HelmetBlock({
	block,
}: {
	block: Extract<MakeEssayBlock, { type: "helmet" }>;
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
					<p className="mt-1 text-[0.82rem] tracking-[0.04em] text-[#6A7A76]">
						{block.titleZh}
					</p>
				</div>
			</div>

			<p className="mt-6 max-w-[30rem] border-l-2 border-[#0F4C45]/35 pl-4 text-[1.02rem] font-medium leading-8 text-[#162b26] sm:text-[1.08rem] sm:leading-8">
				{block.pull}
			</p>

			<div className="mt-6 max-w-[42rem] space-y-4 text-[0.92rem] leading-7 text-[#3E514D] sm:text-[0.95rem] sm:leading-[1.8rem]">
				{block.body.map((paragraph) => (
					<p key={paragraph.slice(0, 48)}>{paragraph}</p>
				))}
			</div>

			<div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
				<FrameImage image={block.images[0]} priority />
				<FrameImage image={block.images[1]} className="sm:mt-10" />
			</div>
		</article>
	);
}

/** 24×16 modular grid on a φ canvas — staggered collage with shared baselines. */
const MODULAR_SLOTS: Record<
	MakeDiySlot,
	{
		col: [number, number];
		row: [number, number];
		z: number;
		/** Inner cream frame — flex alignment + mat padding */
		frameClass?: string;
		/** Per-photo scale within its mat */
		imageClass?: string;
	}
> = {
	1: { col: [1, 7], row: [6, 12], z: 2 },
	2: { col: [5, 12], row: [8, 13], z: 3 },
	3: { col: [10, 16], row: [4, 12], z: 2 },
	4: { col: [14, 20], row: [2, 14], z: 4 },
	5: { col: [18, 25], row: [7, 13], z: 2 },
	6: { col: [2, 8], row: [11, 17], z: 5 },
	7: { col: [6, 13], row: [13, 17], z: 3 },
	/** Tall mat — image ~80% width, cream band below */
	8: {
		col: [11, 21],
		row: [11, 17],
		z: 3,
		frameClass: "items-start justify-center px-1 pt-2.5 sm:pt-3.5",
		imageClass: "h-auto w-[80%] object-contain object-top",
	},
	9: { col: [19, 25], row: [12, 17], z: 4 },
};

const COLLAGE_GRID = {
	display: "grid",
	gridTemplateColumns: "repeat(24, minmax(0, 1fr))",
	gridTemplateRows: "repeat(16, minmax(0, 1fr))",
	gap: "6px",
	aspectRatio: "1.618 / 1",
} as const;

function CollageTile({ item }: { item: MakeDiyItem }) {
	const slot = MODULAR_SLOTS[item.slot];
	const frameAlign = slot.frameClass ?? "items-end justify-center";
	const imageClass =
		slot.imageClass ??
		"max-h-full max-w-full object-contain";

	return (
		<figure
			className="group relative min-h-0 min-w-0"
			style={{
				gridColumn: `${slot.col[0]} / ${slot.col[1]}`,
				gridRow: `${slot.row[0]} / ${slot.row[1]}`,
				zIndex: slot.z,
			}}
		>
			<div
				className={`relative flex h-full min-h-0 w-full flex-col bg-[#F7F1E8] p-1 sm:p-1.5 ${frameAlign}`}
			>
				<Image
					src={item.image.src}
					alt={item.image.alt}
					width={item.image.width}
					height={item.image.height}
					sizes={
						item.slot === 8
							? "(max-width: 1024px) 28vw, 220px"
							: "(max-width: 1024px) 22vw, 150px"
					}
					className={`${imageClass} transition-transform duration-700 ease-out group-hover:scale-[1.015]`}
				/>
				<figcaption className="pointer-events-none absolute inset-x-0 bottom-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
					<div className="bg-gradient-to-t from-[#162b26]/78 to-transparent px-2 pb-2 pt-7 text-center">
						<p className="text-[0.56rem] tracking-[0.06em] text-[#F7F1E8]/75">
							{item.titleZh}
						</p>
						<p className="text-[0.68rem] font-semibold leading-tight text-[#F7F1E8]">
							{item.title}
						</p>
					</div>
				</figcaption>
			</div>
		</figure>
	);
}

function MobileTile({ item }: { item: MakeDiyItem }) {
	return (
		<figure className="overflow-hidden bg-[#F7F1E8]">
			<div className="flex aspect-[4/5] items-center justify-center p-2">
				<Image
					src={item.image.src}
					alt={item.image.alt}
					width={item.image.width}
					height={item.image.height}
					className="max-h-full max-w-full object-contain"
				/>
			</div>
		</figure>
	);
}

function DiyWallBlock({
	block,
}: {
	block: Extract<MakeEssayBlock, { type: "diy-wall" }>;
}) {
	const sorted = [...block.items].sort((a, b) => a.slot - b.slot);

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

			<div className="mx-auto mt-10 grid max-w-[21rem] grid-cols-3 gap-2 sm:hidden">
				{sorted.map((item) => (
					<MobileTile key={item.id} item={item} />
				))}
			</div>

			<div className="relative mx-auto mt-12 hidden w-full max-w-[52rem] sm:block">
				<div className="w-full" style={COLLAGE_GRID}>
					{sorted.map((item) => (
						<CollageTile key={item.id} item={item} />
					))}
				</div>
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
