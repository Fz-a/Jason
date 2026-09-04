"use client";

import Image from "next/image";
import { useState } from "react";
import type { BriefBlock, BriefDoc, BriefImage } from "../lib/brief-types";

function Figure({ image }: { image: BriefImage }) {
	return (
		<figure className="overflow-hidden bg-[#F5F5F3]">
			<div className="relative aspect-[4/3]">
				<Image
					src={image.src}
					alt={image.alt || ""}
					fill
					sizes="420px"
					className="object-cover"
				/>
			</div>
			{image.caption ? (
				<figcaption className="px-3 py-2.5 text-[0.74rem] text-[#8A9692]">
					{image.caption}
				</figcaption>
			) : null}
		</figure>
	);
}

function Blocks({ blocks }: { blocks: BriefBlock[] }) {
	return (
		<>
			{blocks.map((block) => (
				<Block key={block.id} block={block} />
			))}
		</>
	);
}

function Block({ block }: { block: BriefBlock }) {
	switch (block.type) {
		case "kicker":
			return (
				<p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#8A9692]">
					{block.text}
				</p>
			);
		case "heading":
			return (
				<h3 className="mt-4 text-[1.6rem] font-extrabold tracking-tight text-[#162b26] sm:text-[1.7rem]">
					{block.text}
				</h3>
			);
		case "subheading":
			return (
				<p className="mt-1.5 text-[0.95rem] text-[#6A7A76]">{block.text}</p>
			);
		case "pull":
			return (
				<p className="mt-5 text-[1.02rem] font-medium leading-8 text-[#0F4C45]">
					{block.text}
				</p>
			);
		case "text":
			return (
				<p className="mt-3.5 text-[1rem] leading-8 text-[#333]">{block.text}</p>
			);
		case "list":
			return (
				<ul className="mt-4 space-y-2">
					{block.items.map((item) => (
						<li
							key={item}
							className="flex gap-2.5 text-[1rem] leading-8 text-[#333]"
						>
							<span className="mt-[0.85em] h-1 w-1 shrink-0 rounded-full bg-[#0F4C45]/45" />
							<span>{item}</span>
						</li>
					))}
				</ul>
			);
		case "image":
			return (
				<div className="mt-7">
					<Figure image={block.image} />
				</div>
			);
		case "duo":
			return (
				<div className="mt-7 grid gap-3.5 sm:grid-cols-2">
					{block.images.map((image) => (
						<Figure key={image.src + image.alt} image={image} />
					))}
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
		<div className="mt-8">
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
			<div key={active.id} className="journey-part-enter mt-7">
				<Blocks blocks={active.blocks} />
			</div>
		</div>
	);
}

export function BriefDocument({ doc }: { doc: BriefDoc }) {
	const hasKicker = doc.blocks.some((block) => block.type === "kicker");
	const hasHeading = doc.blocks.some((block) => block.type === "heading");

	return (
		<article className="bg-white/90 px-7 py-9 text-[#111] sm:px-11 sm:py-11">
			{doc.section && !hasKicker ? (
				<p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#8A9692]">
					{doc.section}
				</p>
			) : null}
			{!hasHeading ? (
				<>
					<h3 className="mt-4 text-[1.6rem] font-extrabold tracking-tight text-[#162b26] sm:text-[1.7rem]">
						{doc.title}
					</h3>
					{doc.subtitle ? (
						<p className="mt-1.5 text-[0.95rem] text-[#6A7A76]">{doc.subtitle}</p>
					) : null}
				</>
			) : null}
			<Blocks blocks={doc.blocks} />
		</article>
	);
}
