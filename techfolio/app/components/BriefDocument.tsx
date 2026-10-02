"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import type { BriefBlock, BriefDoc, BriefImage } from "../lib/brief-types";
import { imageFocusStyle } from "../lib/image-focus";

function Figure({ image }: { image: BriefImage }) {
	const contain = image.fit === "contain";
	return (
		<figure className="group overflow-hidden rounded-2xl bg-[#F4F5F2] ring-1 ring-[#162b26]/5 shadow-[0_1px_2px_rgba(22,43,38,0.04)] transition-shadow duration-500 hover:shadow-[0_18px_40px_-18px_rgba(22,43,38,0.35)]">
			<div className="relative aspect-[4/3] overflow-hidden">
				<Image
					src={image.src}
					alt={image.alt || ""}
					fill
					sizes="700px"
					className={
						contain
							? "object-contain transition-transform duration-700 group-hover:scale-[1.02]"
							: "object-cover transition-transform duration-700 group-hover:scale-[1.03]"
					}
					style={contain ? undefined : imageFocusStyle(image)}
				/>
			</div>
			{image.caption ? (
				<figcaption className="flex items-baseline gap-2.5 px-4 py-3 text-[0.74rem] text-[#7E8B87]">
					<span className="h-px w-4 shrink-0 translate-y-[-0.25em] bg-[#0F4C45]/30" />
					<span>{image.caption}</span>
				</figcaption>
			) : null}
		</figure>
	);
}

function Blocks({ blocks }: { blocks: BriefBlock[] }) {
	const out: ReactNode[] = [];
	let i = 0;
	let flip = false;

	const isTextLike = (b: BriefBlock) => b.type === "text" || b.type === "list";
	const isImage = (b: BriefBlock) => b.type === "image";

	while (i < blocks.length) {
		const block = blocks[i];

		// pull immediately followed by a single image → full-width hero
		// (image on top, pull quote overlaid at the base)
		if (block.type === "pull" && i + 1 < blocks.length && isImage(blocks[i + 1])) {
			const pull = block;
			const img = blocks[i + 1] as Extract<BriefBlock, { type: "image" }>;
			out.push(<Hero key={block.id} pull={pull.text} image={img.image} />);
			i += 2;
			continue;
		}

		// text/list + image → side-by-side split, alternating sides
		if (isTextLike(block) && i + 1 < blocks.length && isImage(blocks[i + 1])) {
			const text = block;
			const img = blocks[i + 1] as Extract<BriefBlock, { type: "image" }>;
			out.push(<Split key={block.id} text={text} image={img.image} flip={flip} />);
			flip = !flip;
			i += 2;
			continue;
		}

		// image + text/list → side-by-side split, alternating sides
		if (isImage(block) && i + 1 < blocks.length && isTextLike(blocks[i + 1])) {
			const img = block as Extract<BriefBlock, { type: "image" }>;
			const text = blocks[i + 1];
			out.push(<Split key={block.id} text={text} image={img.image} flip={!flip} />);
			flip = !flip;
			i += 2;
			continue;
		}

		// a lone pull (not followed by an image) → centered statement band
		if (block.type === "pull") {
			out.push(<Statement key={block.id} text={block.text} />);
			i += 1;
			continue;
		}

		// single image not fused with text → full-width feature image
		if (isImage(block)) {
			const img = block as Extract<BriefBlock, { type: "image" }>;
			out.push(<Feature key={block.id} image={img.image} />);
			i += 1;
			continue;
		}

		out.push(<Block key={block.id} block={block} />);
		i += 1;
	}

	return <>{out}</>;
}

// Full-width hero: image with the pull quote overlaid on a soft gradient base.
function Hero({ pull, image }: { pull: string; image: BriefImage }) {
	return (
		<figure className="mt-8 overflow-hidden rounded-2xl ring-1 ring-[#162b26]/5 shadow-[0_1px_2px_rgba(22,43,38,0.04)]">
			<div className="relative aspect-[16/10] overflow-hidden">
				<Image
					src={image.src}
					alt={image.alt || ""}
					fill
					sizes="720px"
					className="object-cover"
					style={imageFocusStyle(image)}
				/>
				<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0F2A24]/85 via-[#0F2A24]/40 to-transparent p-5 pt-16 sm:p-7 sm:pt-20">
					<p className="max-w-xl text-[1.05rem] font-medium leading-snug text-white/95 sm:text-[1.2rem]">
						{pull}
					</p>
				</div>
			</div>
		</figure>
	);
}

// Centered statement band for a lone pull quote.
function Statement({ text }: { text: string }) {
	return (
		<div className="mt-9 px-2 py-3 text-center">
			<p className="mx-auto max-w-lg text-[1.35rem] font-semibold leading-[1.5] tracking-tight text-[#0F4C45] sm:text-[1.5rem]">
				{text}
			</p>
			<span className="mx-auto mt-4 block h-px w-10 bg-[#0F4C45]/30" />
		</div>
	);
}

// Full-width single image (feature), slightly asymmetric with a max width so
// it doesn't feel identical to every other full image.
function Feature({ image }: { image: BriefImage }) {
	return (
		<div className="mt-8">
			<Figure image={image} />
		</div>
	);
}

function Split({
	text,
	image,
	flip,
}: {
	text: BriefBlock;
	image: BriefImage;
	flip: boolean;
}) {
	return (
		<div className="mt-8 grid items-center gap-5 sm:grid-cols-12">
			<div
				className={flip ? "sm:order-2 sm:col-span-5" : "sm:col-span-5"}
			>
				<div className="[&>*:first-child]:mt-0">
					<Block block={text} />
				</div>
			</div>
			<div
				className={flip ? "sm:order-1 sm:col-span-7" : "sm:col-span-7"}
			>
				<Figure image={image} />
			</div>
		</div>
	);
}

function Block({ block }: { block: BriefBlock }) {
	switch (block.type) {
		case "kicker":
			return (
				<div className="mt-10 flex items-center gap-3">
					<span className="h-px w-8 bg-[#0F4C45]/25" />
					<p className="text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-[#8A9692]">
						{block.text}
					</p>
				</div>
			);
		case "heading":
			return (
				<h3 className="mt-5 text-[1.75rem] font-extrabold leading-tight tracking-[-0.02em] text-[#162b26] sm:text-[1.9rem]">
					{block.text}
				</h3>
			);
		case "subheading":
			return (
				<p className="mt-2 text-[0.98rem] leading-relaxed text-[#6A7A76]">
					{block.text}
				</p>
			);
		case "pull":
			return (
				<blockquote className="mt-6 border-l-2 border-[#0F4C45] pl-5">
					<p className="text-[1.18rem] font-medium leading-[1.7] text-[#0F4C45] sm:text-[1.28rem]">
						{block.text}
					</p>
				</blockquote>
			);
		case "text":
			return (
				<p className="mt-4 text-[1rem] leading-[1.85] text-[#3A4542]">{block.text}</p>
			);
		case "list":
			return (
				<ul className="mt-5 space-y-2.5">
					{block.items.map((item) => (
						<li
							key={item}
							className="flex gap-3 text-[1rem] leading-[1.75] text-[#3A4542]"
						>
							<span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F4C45]" />
							<span>{item}</span>
						</li>
					))}
				</ul>
			);
		case "image":
			return (
				<div className="mt-8">
					<Figure image={block.image} />
				</div>
			);
		case "duo":
			return (
				<div className="mt-8 grid items-start gap-4 sm:grid-cols-12">
					<div className="sm:col-span-7">
						<Figure image={block.images[0]} />
					</div>
					<div className="sm:col-span-5 sm:mt-12">
						<Figure image={block.images[1]} />
					</div>
				</div>
			);
		case "tabs":
			return <TabsBlock block={block} />;
	}
}

function TabsBlock({
	block,
}: {
	block: Extract<BriefBlock, { type: "tabs" }>;
}) {
	const [tabId, setTabId] = useState(block.tabs[0]?.id ?? "");
	const active = block.tabs.find((tab) => tab.id === tabId) ?? block.tabs[0];
	if (!active) return null;

	return (
		<div className="mt-10">
			<div
				role="tablist"
				aria-label="Sections"
				className="flex flex-wrap gap-1 border-b border-[#0F4C45]/10"
			>
				{block.tabs.map((tab) => {
					const selected = tab.id === active.id;
					return (
						<button
							key={tab.id}
							type="button"
							role="tab"
							aria-selected={selected}
							onClick={() => setTabId(tab.id)}
							className={`relative -mb-px px-3.5 py-2.5 text-left transition-colors duration-500 ${
								selected
									? "text-[#0F4C45]"
									: "text-[#6A7A76] hover:text-[#0F4C45]/80"
							}`}
						>
							<span className="block text-[0.86rem] font-semibold tracking-tight">
								{tab.label}
							</span>
							{tab.labelEn ? (
								<span className="mt-0.5 block font-mono text-[0.56rem] tracking-[0.18em] opacity-70">
									{tab.labelEn}
								</span>
							) : null}
							<span
								aria-hidden
								className={`absolute inset-x-2 bottom-0 h-px origin-left bg-[#0F4C45] transition-transform duration-500 ${
									selected ? "scale-x-100" : "scale-x-0"
								}`}
							/>
						</button>
					);
				})}
			</div>
			<div key={active.id} className="journey-part-enter mt-8 [&>*:first-child]:mt-0">
				<Blocks blocks={active.blocks} />
			</div>
		</div>
	);
}

export function BriefDocument({ doc }: { doc: BriefDoc }) {
	const hasKicker = doc.blocks.some((block) => block.type === "kicker");
	const hasHeading = doc.blocks.some((block) => block.type === "heading");

	return (
		<article className="bg-white/90 px-7 py-10 text-[#111] [&>*:first-child]:mt-0 sm:px-11 sm:py-12">
			{doc.section && !hasKicker ? (
				<p className="text-[0.66rem] font-semibold uppercase tracking-[0.28em] text-[#8A9692]">
					{doc.section}
				</p>
			) : null}
			{!hasHeading ? (
				<>
					<h3 className="mt-4 text-[1.75rem] font-extrabold leading-tight tracking-[-0.02em] text-[#162b26] sm:text-[1.9rem]">
						{doc.title}
					</h3>
					{doc.subtitle ? (
						<p className="mt-2 text-[0.98rem] leading-relaxed text-[#6A7A76]">
							{doc.subtitle}
						</p>
					) : null}
				</>
			) : null}
			<Blocks blocks={doc.blocks} />
		</article>
	);
}
