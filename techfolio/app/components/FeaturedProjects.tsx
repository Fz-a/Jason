"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "../lib/i18n";
import { ZoomableFrame } from "./ImageLightbox";
import { ShowcaseDocument } from "../projects/UniversityShowcase";
import {
	universityProjectShowcases,
	type UniversityShowcase,
} from "../projects/university-showcases";
import { workCompanies, workShowcases } from "../projects/work-showcases";
import { societyShowcases } from "../projects/society-showcases";
import {
	makeEssay,
	type MakeDiyItem,
	type MakeImage,
} from "../projects/make-essay";
import { overrideCardImage } from "../lib/brief-card";
import { imageFocusStyle } from "../lib/image-focus";
import {
	listProjectCatalog,
	type ProjectCatalogGroup,
} from "../projects/project-catalog";

type GroupId = ProjectCatalogGroup;

const GROUP_META: { id: GroupId; labelKey: string }[] = [
	{ id: "work", labelKey: "core.group.work" },
	{ id: "university", labelKey: "core.group.university" },
	{ id: "diy", labelKey: "core.group.diy" },
	{ id: "society", labelKey: "core.group.society" },
];

type NavItem = {
	key: string;
	id: string;
	label: string;
	section: string;
	imageSrc: string;
	imageAlt: string;
	imageScale?: number;
	imageTx?: number;
	imageTy?: number;
	subtitle?: string;
	summary?: string;
	showcase?: UniversityShowcase;
	body?: string[];
	pull?: string;
	helmetImages?: MakeImage[];
	diyItems?: MakeDiyItem[];
	kind: "showcase" | "company" | "helmet" | "diy";
	group: GroupId;
	/** Static highlight from Studio (project-order starred). */
	starred?: boolean;
};

function firstSpreadBlurb(
	s: Pick<UniversityShowcase, "preview" | "spreads" | "subtitle">,
): string | undefined {
	const parts: string[] = [];
	const push = (line?: string) => {
		const t = line?.trim();
		if (!t || parts.includes(t)) return;
		parts.push(t);
	};

	for (const line of s.preview ?? []) push(line);

	for (const spread of s.spreads) {
		if (parts.length >= 2) break;
		if ("body" in spread && Array.isArray(spread.body)) {
			for (const line of spread.body) {
				push(line);
				if (parts.length >= 2) break;
			}
		}
		if (
			parts.length < 2 &&
			"subtitle" in spread &&
			typeof spread.subtitle === "string"
		) {
			push(
				spread.subtitle !== s.subtitle ? spread.subtitle : undefined,
			);
		}
	}

	return parts.length ? parts.join(" ") : undefined;
}

function buildCatalog(t: (k: string) => string): NavItem[] {
	const workById = new Map(workShowcases.map((s) => [s.id, s]));
	const uniById = new Map(universityProjectShowcases.map((s) => [s.id, s]));
	const societyById = new Map(societyShowcases.map((s) => [s.id, s]));
	const companyById = new Map<string, (typeof workCompanies)[number]>(
		workCompanies.map((c) => [c.id, c]),
	);
	const helmet = makeEssay.find((b) => b.type === "helmet");
	const diyWall = makeEssay.find((b) => b.type === "diy-wall");

	const items: NavItem[] = [];

	for (const entry of listProjectCatalog()) {
		const cover = overrideCardImage(entry.id);

		if (entry.kind === "showcase") {
			const s =
				workById.get(entry.id) ??
				uniById.get(entry.id) ??
				societyById.get(entry.id);
			if (!s) continue;
			items.push({
				key: s.id,
				id: s.id,
				label: s.title,
				section:
					entry.group === "work"
						? "Work"
						: entry.group === "university"
							? "University"
							: entry.group === "diy"
								? "MAKE"
								: "Society",
				imageSrc: cover?.src ?? s.cardImage.src,
				imageAlt: cover?.alt || s.cardImage.alt,
				imageScale: cover?.scale,
				imageTx: cover?.tx,
				imageTy: cover?.ty,
				subtitle: s.subtitle,
				summary: firstSpreadBlurb(s),
				showcase: s,
				kind: "showcase",
				group: entry.group,
				starred: Boolean(entry.starred),
			});
			continue;
		}

		if (entry.kind === "company") {
			const c = companyById.get(entry.id);
			if (!c) continue;
			items.push({
				key: c.id,
				id: c.id,
				label: c.company,
				section: c.role,
				imageSrc: cover?.src ?? c.image.src,
				imageAlt: cover?.alt || c.image.alt,
				imageScale: cover?.scale,
				imageTx: cover?.tx,
				imageTy: cover?.ty,
				subtitle: c.company,
				summary: c.brief?.[0] ? `${c.summary} ${c.brief[0]}` : c.summary,
				body: [...c.brief],
				kind: "company",
				group: entry.group,
				starred: Boolean(entry.starred),
			});
			continue;
		}

		if (entry.kind === "helmet" && helmet && helmet.type === "helmet") {
			const hCover = cover ?? overrideCardImage("smart-helmet");
			items.push({
				key: "smart-helmet",
				id: "smart-helmet",
				label: helmet.title,
				section: "MAKE",
				imageSrc:
					hCover?.src ??
					helmet.images[0]?.src ??
					"/experience/make/helmet-product.webp",
				imageAlt: hCover?.alt || helmet.images[0]?.alt || helmet.title,
				imageScale: hCover?.scale,
				imageTx: hCover?.tx,
				imageTy: hCover?.ty,
				subtitle: helmet.title,
				summary: helmet.pull,
				pull: helmet.pull,
				body: helmet.body,
				helmetImages: [...helmet.images],
				kind: "helmet",
				group: entry.group,
				starred: Boolean(entry.starred),
			});
			continue;
		}

		if (entry.kind === "diy" && diyWall && diyWall.type === "diy-wall") {
			const dCover =
				cover ??
				overrideCardImage("make-diy") ??
				overrideCardImage("diy-wall");
			items.push({
				key: "diy-wall",
				id: "diy-wall",
				label: diyWall.title,
				section: "MAKE · DIY",
				imageSrc:
					dCover?.src ??
					diyWall.items[4]?.image.src ??
					diyWall.items[0]?.image.src ??
					"",
				imageAlt:
					dCover?.alt || diyWall.items[0]?.image.alt || diyWall.title,
				imageScale: dCover?.scale,
				imageTx: dCover?.tx,
				imageTy: dCover?.ty,
				subtitle: diyWall.title,
				summary: t("core.diy.lede"),
				diyItems: [...diyWall.items],
				kind: "diy",
				group: entry.group,
				starred: Boolean(entry.starred),
			});
		}
	}

	return items;
}

function DiyGrid({
	items,
	onOpen,
}: {
	items: MakeDiyItem[];
	onOpen: (item: MakeDiyItem) => void;
}) {
	return (
		<div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
			{items.map((diy) => (
				<button
					key={diy.id}
					type="button"
					onClick={() => onOpen(diy)}
					className="group overflow-hidden bg-[#E8E2D8] text-left transition hover:opacity-95"
				>
					<div className="relative aspect-square">
						<Image
							src={diy.image.src}
							alt={diy.image.alt}
							fill
							sizes="180px"
							className="object-cover transition duration-500 group-hover:scale-[1.03]"
						/>
					</div>
					<div className="px-2 py-2 sm:px-2.5">
						<p className="truncate text-[0.7rem] font-semibold tracking-tight text-[#162b26]">
							{diy.title}
						</p>
						<p className="mt-0.5 font-mono text-[0.56rem] tracking-[0.1em] text-[#0F4C45]/40">
							{diy.year}
						</p>
					</div>
				</button>
			))}
		</div>
	);
}

function SpotlightCard({
	item,
	onOpen,
	canOpen,
	openLabel,
}: {
	item: NavItem;
	onOpen: () => void;
	canOpen: boolean;
	openLabel: string;
}) {
	return (
		<div className="relative flex h-full min-h-[16rem] flex-col">
			<div className="relative min-h-[11rem] flex-1">
				<Image
					src={item.imageSrc}
					alt={item.imageAlt}
					fill
					sizes="(max-width: 1024px) 100vw, 560px"
					className="object-cover"
					priority
					style={imageFocusStyle({
						scale: item.imageScale,
						tx: item.imageTx,
						ty: item.imageTy,
					})}
				/>
				<span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#162b26]/85 via-[#162b26]/25 to-transparent" />
				<div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-5 sm:p-7">
					<span className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-[#F7F1E8]/70">
						{item.section}
					</span>
					<h3 className="text-[1.5rem] font-extrabold leading-[1.05] tracking-tight text-white sm:text-[1.9rem]">
						{item.label}
					</h3>
				</div>
			</div>

			<div className="shrink-0 px-5 pb-5 pt-3 sm:px-7 sm:pb-7">
				{item.summary ? (
					<p className="line-clamp-2 text-[0.86rem] leading-6 text-[#3E514D]">
						{item.summary}
					</p>
				) : null}
				{canOpen ? (
					<button
						type="button"
						onClick={onOpen}
						className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#0F4C45] px-5 py-2 text-[0.78rem] font-semibold text-white transition hover:bg-[#043439]"
					>
						{openLabel}
						<span aria-hidden>→</span>
					</button>
				) : null}
			</div>
		</div>
	);
}

export function FeaturedProjects() {
	const { t } = useLocale();
	const sectionRef = useRef<HTMLElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const spotlightRef = useRef<HTMLDivElement>(null);
	const catalog = useMemo(() => buildCatalog(t), [t]);
	const [selectedId, setSelectedId] = useState<string>(
		() => catalog[0]?.id ?? "rtk",
	);
	const [panelOpen, setPanelOpen] = useState(false);
	const [diyFocus, setDiyFocus] = useState<MakeDiyItem | null>(null);

	const groups = useMemo(
		() =>
			GROUP_META.map((g) => ({
				...g,
				items: catalog.filter((n) => n.group === g.id),
			})).filter((g) => g.items.length > 0),
		[catalog],
	);

	// Cards in a single list (groups flattened, grouped order preserved) for
	// the FLIP carousel track.
	const cards = useMemo(() => groups.flatMap((g) => g.items), [groups]);

	const selected =
		catalog.find((n) => n.id === selectedId) ?? catalog[0] ?? null;

	const canOpen = Boolean(
		selected &&
			(selected.showcase ||
				selected.kind === "helmet" ||
				selected.kind === "diy" ||
				(selected.kind === "company" && selected.body?.length)),
	);

	useEffect(() => {
		const locked = panelOpen || Boolean(diyFocus);
		const onKey = (e: KeyboardEvent) => {
			if (e.key !== "Escape") return;
			if (diyFocus) setDiyFocus(null);
			else if (panelOpen) setPanelOpen(false);
		};

		document.body.style.overflow = locked ? "hidden" : "";
		if (locked) window.addEventListener("keydown", onKey);

		return () => {
			window.removeEventListener("keydown", onKey);
			document.body.style.overflow = "";
		};
	}, [panelOpen, diyFocus]);

	// GSAP — reveal the track when the section scrolls into view.
	useEffect(() => {
		gsap.registerPlugin(ScrollTrigger);
		const el = sectionRef.current;
		if (!el) return;
		const ctx = gsap.context(() => {
			ScrollTrigger.create({
				trigger: el,
				start: "top 70%",
				once: true,
				onEnter: () => {
					gsap.from(".flip-carousel__card", {
						autoAlpha: 0,
						y: 24,
						scale: 0.94,
						duration: 0.6,
						stagger: 0.04,
						ease: "power2.out",
						immediateRender: false,
						clearProps: "all",
					});
				},
			});
		}, el);
		return () => ctx.revert();
	}, []);

	// GSAP Flip — clicking a card FLIPs a ghost of it into the spotlight
	// position (React-safe: the real spotlight re-renders behind the ghost,
	// then the ghost fades out).
	const select = (id: string) => {
		const track = trackRef.current;
		const spotlight = spotlightRef.current;
		const incoming = track?.querySelector<HTMLElement>(
			`[data-card-id="${id}"]`,
		);

		if (!incoming || !spotlight) {
			setSelectedId(id);
			return;
		}

		if (id === selectedId) return;

		// Clone the clicked thumbnail to animate it into the spotlight.
		const ghost = incoming.cloneNode(true) as HTMLElement;
		ghost.setAttribute("aria-hidden", "true");
		ghost.classList.add("flip-carousel__ghost");
		document.body.appendChild(ghost);

		const from = incoming.getBoundingClientRect();
		gsap.set(ghost, {
			position: "fixed",
			left: from.left,
			top: from.top,
			width: from.width,
			height: from.height,
			margin: 0,
			zIndex: 80,
			pointerEvents: "none",
		});

		const to = spotlight.getBoundingClientRect();

		// Swap the state so the spotlight re-renders with the new card.
		setSelectedId(id);
		setPanelOpen(false);
		setDiyFocus(null);

		gsap.to(ghost, {
			left: to.left,
			top: to.top,
			width: to.width,
			height: to.height,
			borderRadius: "1rem",
			duration: 0.6,
			ease: "power2.inOut",
			onComplete: () => {
				ghost.remove();
			},
		});
	};

	const openSelected = () => {
		if (canOpen) setPanelOpen(true);
	};

	const openLabel =
		selected?.kind === "helmet" || selected?.kind === "diy"
			? t("core.open.collection")
			: t("core.open");

	return (
		<section
			ref={sectionRef}
			id="experience"
			className="story-slide relative bg-[#F7F1E8]"
		>
			<div className="story-slide__body px-5 py-6 sm:px-8 sm:py-8 md:px-11 lg:px-14">
				<div className="mx-auto flex h-full w-full max-w-[1180px] flex-col xl:max-w-[1240px]">
					<header className="shrink-0">
						<p className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]/60">
							{t("core.kicker")}
						</p>
						<h2 className="mt-2 text-[1.7rem] font-extrabold leading-[1.02] tracking-tight text-[#162b26] sm:text-[2.2rem] lg:text-[2.6rem]">
							{t("core.title")}
						</h2>
					</header>

					<div className="relative mt-4 flex min-h-0 flex-1 flex-col gap-4 lg:flex-row lg:gap-6">
						{/* Spotlight — the active card lives here */}
						<div
							ref={spotlightRef}
							className="flip-carousel__spotlight relative shrink-0 overflow-hidden rounded-2xl bg-[#E8E2D8] shadow-[0_18px_50px_rgb(22_43_38_/_0.16)] lg:w-[46%]"
						>
							{selected ? (
								<SpotlightCard
									item={selected}
									onOpen={openSelected}
									canOpen={canOpen}
									openLabel={openLabel}
								/>
							) : null}
						</div>

						{/* Track of cards */}
						<div
							ref={trackRef}
							className="flip-carousel__track relative flex min-h-0 flex-1 flex-wrap content-start gap-2.5 sm:gap-3 lg:overflow-y-auto"
						>
							{cards.map((item) => (
								<div
									key={item.key}
									data-card-id={item.id}
									className="flip-carousel__card group relative aspect-[4/5] w-[calc(50%-0.3125rem)] cursor-pointer overflow-hidden rounded-xl bg-[#E8E2D8] text-left sm:w-[calc(33.333%-0.5rem)] lg:w-[calc(25%-0.5625rem)]"
									onClick={() => select(item.id)}
									onDoubleClick={openSelected}
									role="button"
									tabIndex={0}
									onKeyDown={(e) => {
										if (e.key === "Enter") select(item.id);
									}}
								>
									<Image
										src={item.imageSrc}
										alt={item.imageAlt}
										fill
										sizes="220px"
										className="object-cover transition duration-500 group-hover:scale-[1.05]"
										style={imageFocusStyle({
											scale: item.imageScale,
											tx: item.imageTx,
											ty: item.imageTy,
										})}
									/>
									<span
										aria-hidden
										className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#162b26]/72 via-transparent to-transparent"
									/>
									<span className="flip-carousel__card-label absolute inset-x-0 bottom-0 px-2.5 py-2">
										<span className="block truncate text-[0.7rem] font-semibold leading-tight text-white">
											{item.label}
										</span>
										<span className="mt-0.5 block truncate text-[0.56rem] uppercase tracking-[0.12em] text-[#F7F1E8]/60">
											{item.section}
										</span>
									</span>
									{item.starred ? (
										<span
											aria-hidden
											className="absolute right-2 top-1.5 text-[0.75rem] leading-none text-white drop-shadow"
										>
											★
										</span>
									) : null}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			{panelOpen && selected ? (
				<div className="fixed inset-0 z-50 flex items-end justify-center bg-[#162b26]/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-6">
					<button
						type="button"
						aria-label={t("journey.close")}
						className="absolute inset-0 cursor-pointer border-0 bg-transparent"
						onClick={() => setPanelOpen(false)}
					/>
					<div
						role="dialog"
						aria-modal="true"
						className="relative z-10 flex max-h-[88vh] w-full max-w-[46rem] flex-col overflow-hidden rounded-t-2xl bg-[#F7F1E8] shadow-2xl sm:rounded-2xl"
					>
						<div className="flex shrink-0 items-center justify-between border-b border-[#0F4C45]/10 px-5 py-3.5">
							<p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#0F4C45]/50">
								{selected.kind === "helmet" || selected.kind === "diy"
									? t("core.collection")
									: "Brief"}
							</p>
							<button
								type="button"
								onClick={() => setPanelOpen(false)}
								className="text-[0.78rem] font-semibold text-[#6A7A76] hover:text-[#0F4C45]"
							>
								{t("journey.close")}
							</button>
						</div>
						<div className="min-h-0 flex-1 overflow-y-auto">
							{selected.showcase ? (
								<ShowcaseDocument
									item={selected.showcase}
									sectionLabel={selected.section}
									className="shadow-none"
								/>
							) : null}

							{selected.kind === "company" && selected.body ? (
								<article className="px-6 py-8 sm:px-9 sm:py-10">
									<p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#0F4C45]/45">
										{selected.section}
									</p>
									<h3 className="mt-3 text-[1.45rem] font-extrabold tracking-tight text-[#162b26]">
										{selected.label}
									</h3>
									{selected.subtitle ? (
										<p className="mt-1.5 text-[0.9rem] text-[#6A7A76]">
											{selected.subtitle}
										</p>
									) : null}
									<div className="mt-5 space-y-3">
										{selected.body.map((line) => (
											<p
												key={line.slice(0, 24)}
												className="text-[0.95rem] leading-7 text-[#3E514D]"
											>
												{line}
											</p>
										))}
									</div>
								</article>
							) : null}

							{selected.kind === "helmet" ? (
								<article className="px-6 py-8 sm:px-9 sm:py-10">
									<p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#0F4C45]/45">
										MAKE · {t("core.collection")}
									</p>
									<h3 className="mt-3 text-[1.45rem] font-extrabold tracking-tight text-[#162b26]">
										{selected.label}
									</h3>
									{selected.pull ? (
										<p className="mt-5 max-w-[36rem] text-[1rem] font-medium leading-8 text-[#0F4C45]">
											{selected.pull}
										</p>
									) : null}
									{selected.body?.map((line) => (
										<p
											key={line.slice(0, 24)}
											className="mt-3.5 max-w-[40rem] text-[0.95rem] leading-7 text-[#3E514D]"
										>
											{line}
										</p>
									))}

									{(() => {
										const [product, camp, crew] =
											selected.helmetImages ?? [];
										return (
											<div className="mt-9 space-y-10">
												{product ? (
													<figure className="overflow-hidden bg-[#E8E2D8]">
														<ZoomableFrame
															image={{
																src: product.src,
																alt: product.alt,
																width: product.width,
																height: product.height,
																caption: product.caption,
															}}
															className="block w-full"
														>
															<div className="relative aspect-[16/10] sm:aspect-[2/1]">
																<Image
																	src={product.src}
																	alt={product.alt}
																	fill
																	sizes="(max-width: 720px) 100vw, 640px"
																	className="object-cover transition group-hover/zoom:opacity-95"
																	priority
																/>
															</div>
														</ZoomableFrame>
														{product.caption ? (
															<figcaption className="px-3 py-2.5 text-[0.74rem] text-[#6A7A76]">
																{product.caption}
															</figcaption>
														) : null}
													</figure>
												) : null}

												{(camp || crew) ? (
													<section>
														<p className="font-mono text-[0.62rem] font-semibold tracking-[0.22em] text-[#8A9692]">
															Booth
														</p>
														<p className="mt-2 max-w-[32rem] text-[0.88rem] leading-6 text-[#5A6561]">
															Exhibition floor and roadside stall — the
															same helmet, two public tests.
														</p>
														<div className="mt-5 grid grid-cols-1 items-start gap-5 sm:grid-cols-12 sm:gap-6">
															{camp ? (
																<figure className="overflow-hidden bg-[#E8E2D8] sm:col-span-5 sm:mt-0">
																	<ZoomableFrame
																		image={{
																			src: camp.src,
																			alt: camp.alt,
																			width: camp.width,
																			height: camp.height,
																			caption: camp.caption,
																		}}
																		className="block w-full"
																	>
																		<div className="relative aspect-[3/4]">
																			<Image
																				src={camp.src}
																				alt={camp.alt}
																				fill
																				sizes="280px"
																				className="object-cover transition group-hover/zoom:opacity-95"
																			/>
																		</div>
																	</ZoomableFrame>
																	{camp.caption ? (
																		<figcaption className="px-3 py-2.5 text-[0.74rem] text-[#6A7A76]">
																			{camp.caption}
																		</figcaption>
																	) : null}
																</figure>
															) : null}
															{crew ? (
																<figure className="overflow-hidden bg-[#E8E2D8] sm:col-span-7 sm:mt-10">
																	<ZoomableFrame
																		image={{
																			src: crew.src,
																			alt: crew.alt,
																			width: crew.width,
																			height: crew.height,
																			caption: crew.caption,
																		}}
																		className="block w-full"
																	>
																		<div className="relative aspect-[4/3]">
																			<Image
																				src={crew.src}
																				alt={crew.alt}
																				fill
																				sizes="360px"
																				className="object-cover transition group-hover/zoom:opacity-95"
																			/>
																		</div>
																	</ZoomableFrame>
																	{crew.caption ? (
																		<figcaption className="px-3 py-2.5 text-[0.74rem] text-[#6A7A76]">
																			{crew.caption}
																		</figcaption>
																	) : null}
																</figure>
															) : null}
														</div>
													</section>
												) : null}
											</div>
										);
									})()}
								</article>
							) : null}

							{selected.kind === "diy" && selected.diyItems ? (
								<article className="px-6 py-8 sm:px-9 sm:py-10">
									<p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#0F4C45]/45">
										MAKE · DIY
									</p>
									<h3 className="mt-3 text-[1.45rem] font-extrabold tracking-tight text-[#162b26]">
										{selected.label}
									</h3>
									<p className="mt-4 text-[0.9rem] leading-7 text-[#3E514D]">
										{t("core.diy.lede")}
									</p>
									<div className="mt-6">
										<DiyGrid
											items={selected.diyItems}
											onOpen={setDiyFocus}
										/>
									</div>
								</article>
							) : null}
						</div>
					</div>
				</div>
			) : null}

			{diyFocus ? (
				<div className="fixed inset-0 z-[60] flex items-end justify-center bg-[#162b26]/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-6">
					<button
						type="button"
						aria-label={t("journey.close")}
						className="absolute inset-0 cursor-pointer border-0 bg-transparent"
						onClick={() => setDiyFocus(null)}
					/>
					<div
						role="dialog"
						aria-modal="true"
						className="relative z-10 w-full max-w-[28rem] overflow-hidden rounded-t-2xl bg-[#F7F1E8] shadow-2xl sm:rounded-2xl"
					>
						<div className="flex items-center justify-between border-b border-[#0F4C45]/10 px-5 py-3.5">
							<p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#0F4C45]/50">
								DIY · {diyFocus.year}
							</p>
							<button
								type="button"
								onClick={() => setDiyFocus(null)}
								className="text-[0.78rem] font-semibold text-[#6A7A76] hover:text-[#0F4C45]"
							>
								{t("journey.close")}
							</button>
						</div>
						<div className="relative aspect-square bg-[#E8E2D8]">
							<Image
								src={diyFocus.image.src}
								alt={diyFocus.image.alt}
								fill
								sizes="448px"
								className="object-contain p-6"
							/>
						</div>
						<div className="px-5 py-4">
							<p className="text-[1.05rem] font-extrabold tracking-tight text-[#162b26]">
								{diyFocus.title}
							</p>
							<p className="mt-1 text-[0.85rem] text-[#4A5C58]">
								{diyFocus.title}
							</p>
						</div>
					</div>
				</div>
			) : null}
		</section>
	);
}
