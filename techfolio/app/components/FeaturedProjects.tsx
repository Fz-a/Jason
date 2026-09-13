"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "../lib/i18n";
import { isCapabilitiesRailActive } from "../lib/capabilities-rail";
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

type GroupId = "work" | "university" | "diy" | "society";

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
	subtitle?: string;
	summary?: string;
	showcase?: UniversityShowcase;
	body?: string[];
	pull?: string;
	helmetImages?: MakeImage[];
	diyItems?: MakeDiyItem[];
	kind: "showcase" | "company" | "helmet" | "diy";
	group: GroupId;
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

function buildCatalog(isZh: boolean, t: (k: string) => string): NavItem[] {
	const work: NavItem[] = [];
	for (const s of workShowcases) {
		work.push({
			key: s.id,
			id: s.id,
			label: s.title,
			section: "Work",
			imageSrc: s.cardImage.src,
			imageAlt: s.cardImage.alt,
			subtitle: s.subtitle,
			summary: firstSpreadBlurb(s),
			showcase: s,
			kind: "showcase",
			group: "work",
		});
	}
	for (const c of workCompanies) {
		if (workShowcases.some((w) => w.id === c.id)) continue;
		work.push({
			key: c.id,
			id: c.id,
			label: isZh ? c.companyZh : c.company,
			section: c.role,
			imageSrc: c.image.src,
			imageAlt: c.image.alt,
			subtitle: isZh ? c.company : c.companyZh,
			summary: c.brief?.[0] ? `${c.summary} ${c.brief[0]}` : c.summary,
			body: [...c.brief],
			kind: "company",
			group: "work",
		});
	}

	const university: NavItem[] = universityProjectShowcases.map((s) => ({
		key: s.id,
		id: s.id,
		label: s.title,
		section: "University",
		imageSrc: s.cardImage.src,
		imageAlt: s.cardImage.alt,
		subtitle: s.subtitle,
		summary: firstSpreadBlurb(s),
		showcase: s,
		kind: "showcase" as const,
		group: "university" as const,
	}));

	const diy: NavItem[] = [];
	const helmet = makeEssay.find((b) => b.type === "helmet");
	if (helmet && helmet.type === "helmet") {
		diy.push({
			key: "smart-helmet",
			id: "smart-helmet",
			label: isZh ? helmet.titleZh : helmet.title,
			section: "MAKE",
			imageSrc: helmet.images[0]?.src ?? "/experience/make/helmet-product.webp",
			imageAlt: helmet.images[0]?.alt ?? helmet.title,
			subtitle: isZh ? helmet.title : helmet.titleZh,
			summary: helmet.pull,
			pull: helmet.pull,
			body: helmet.body,
			helmetImages: [...helmet.images],
			kind: "helmet",
			group: "diy",
		});
	}
	const diyWall = makeEssay.find((b) => b.type === "diy-wall");
	if (diyWall && diyWall.type === "diy-wall") {
		diy.push({
			key: "diy-wall",
			id: "diy-wall",
			label: isZh ? diyWall.titleZh : diyWall.title,
			section: "MAKE · DIY",
			imageSrc: diyWall.items[4]?.image.src ?? diyWall.items[0]?.image.src ?? "",
			imageAlt: diyWall.items[0]?.image.alt ?? diyWall.title,
			subtitle: isZh ? diyWall.title : diyWall.titleZh,
			summary: t("core.diy.lede"),
			diyItems: [...diyWall.items],
			kind: "diy",
			group: "diy",
		});
	}

	const society: NavItem[] = societyShowcases.map((s) => ({
		key: s.id,
		id: s.id,
		label: s.title,
		section: "Society",
		imageSrc: s.cardImage.src,
		imageAlt: s.cardImage.alt,
		subtitle: s.subtitle,
		summary: firstSpreadBlurb(s),
		showcase: s,
		kind: "showcase" as const,
		group: "society" as const,
	}));

	return [...work, ...university, ...diy, ...society];
}

function NavButton({
	item,
	active,
	onSelect,
	compact,
}: {
	item: NavItem;
	active: boolean;
	onSelect: (id: string) => void;
	compact?: boolean;
}) {
	return (
		<button
			type="button"
			data-nav-id={item.id}
			onClick={() => onSelect(item.id)}
			className={`project-nav__item relative z-[1] block w-full text-left transition-colors ${
				compact ? "project-nav__item--compact whitespace-nowrap px-2.5 py-1.5" : "px-2.5 py-[0.34rem]"
			} ${
				active
					? "text-[#043439]"
					: "text-[#0F4C45]/50 hover:text-[#0F4C45]/85"
			}`}
		>
			<span
				className={`${
					compact ? "text-[0.7rem]" : "text-[0.74rem]"
				} leading-snug tracking-tight ${
					active ? "font-semibold" : "font-medium"
				}`}
			>
				{item.label}
			</span>
		</button>
	);
}

function DiyGrid({
	items,
	isZh,
	onOpen,
}: {
	items: MakeDiyItem[];
	isZh: boolean;
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
							{isZh ? diy.titleZh : diy.title}
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

function DiyCollagePreview({ items }: { items: MakeDiyItem[] }) {
	const tiles = items.slice(0, 9);
	return (
		<div className="grid aspect-square w-full grid-cols-3 gap-1 bg-[#E8E2D8] p-1 sm:gap-1.5 sm:p-1.5">
			{tiles.map((diy) => (
				<div key={diy.id} className="relative overflow-hidden bg-[#DDD6CC]">
					<Image
						src={diy.image.src}
						alt=""
						fill
						sizes="120px"
						className="object-cover"
					/>
				</div>
			))}
		</div>
	);
}

export function FeaturedProjects() {
	const { t, isZh } = useLocale();
	const sectionRef = useRef<HTMLElement>(null);
	const catalog = useMemo(() => buildCatalog(isZh, t), [isZh, t]);
	const [selectedId, setSelectedId] = useState<string>(
		() => catalog[0]?.id ?? "rtk",
	);
	const [panelOpen, setPanelOpen] = useState(false);
	const [railVisible, setRailVisible] = useState(false);
	const [diyFocus, setDiyFocus] = useState<MakeDiyItem | null>(null);
	const [pill, setPill] = useState({
		top: 0,
		height: 0,
		ready: false,
	});
	const railTrackRef = useRef<HTMLDivElement>(null);

	const groups = useMemo(
		() =>
			GROUP_META.map((g) => ({
				...g,
				items: catalog.filter((n) => n.group === g.id),
			})).filter((g) => g.items.length > 0),
		[catalog],
	);

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
		const el = sectionRef.current;
		if (!el) return;
		let raf = 0;
		const update = () => {
			raf = 0;
			const r = el.getBoundingClientRect();
			const vh = window.innerHeight;
			setRailVisible((prev) => {
				const show = isCapabilitiesRailActive(r, vh, prev);
				return prev === show ? prev : show;
			});
		};
		const onScroll = () => {
			if (!raf) raf = requestAnimationFrame(update);
		};
		update();
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll);
		return () => {
			if (raf) cancelAnimationFrame(raf);
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
		};
	}, []);

	useEffect(() => {
		if (!panelOpen && !diyFocus) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				if (diyFocus) setDiyFocus(null);
				else setPanelOpen(false);
			}
		};
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", onKey);
		return () => {
			document.body.style.overflow = prev;
			window.removeEventListener("keydown", onKey);
		};
	}, [panelOpen, diyFocus]);

	useLayoutEffect(() => {
		const syncPill = () => {
			const track = railTrackRef.current;
			if (!track) return;
			const btn = track.querySelector(
				`[data-nav-id="${selectedId}"]`,
			) as HTMLElement | null;
			if (!btn) {
				setPill((p) => ({ ...p, ready: false }));
				return;
			}
			const trackRect = track.getBoundingClientRect();
			const btnRect = btn.getBoundingClientRect();
			setPill({
				top: btnRect.top - trackRect.top + track.scrollTop,
				height: btnRect.height,
				ready: true,
			});
		};

		syncPill();
		window.addEventListener("resize", syncPill);
		return () => window.removeEventListener("resize", syncPill);
	}, [selectedId, groups, railVisible]);

	const select = (id: string) => {
		setSelectedId(id);
		setPanelOpen(false);
		setDiyFocus(null);
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
			<aside
				aria-hidden={!railVisible}
				className={`pointer-events-none fixed inset-y-0 right-2 z-30 hidden w-[12.75rem] items-center xl:flex 2xl:right-5 2xl:w-[14rem] ${
					railVisible ? "opacity-100" : "opacity-0"
				}`}
				style={{ transition: "opacity 260ms ease-out" }}
			>
				<nav
					aria-label={t("core.nav")}
					className={`project-nav w-full pr-1 ${
						railVisible ? "pointer-events-auto" : "pointer-events-none"
					}`}
				>
					<div ref={railTrackRef} className="project-nav__track relative">
						<span
							aria-hidden
							className={`project-nav__pill ${
								pill.ready ? "project-nav__pill--ready" : ""
							}`}
							style={{
								transform: `translate3d(0, ${pill.top}px, 0)`,
								height: pill.height,
							}}
						/>
						<div className="space-y-[1.15rem]">
							{groups.map((group) => (
								<div key={group.id}>
									<p className="mb-1.5 px-2.5 text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-[#0F4C45]/42">
										{t(group.labelKey)}
									</p>
									<ul className="project-nav__list">
										{group.items.map((item) => (
											<li key={item.key}>
												<NavButton
													item={item}
													active={item.id === selectedId}
													onSelect={select}
												/>
											</li>
										))}
									</ul>
								</div>
							))}
						</div>
					</div>
				</nav>
			</aside>

			<div className="story-slide__body xl:pr-[15rem] 2xl:pr-[16.5rem]">
				<div className="mx-auto flex h-full w-full max-w-[1180px] flex-col justify-center xl:max-w-[1240px]">
					<nav
						aria-label={t("core.nav")}
						className="shrink-0 space-y-2 px-6 pt-4 sm:px-8 md:px-10 lg:px-12 xl:hidden"
					>
						{groups.map((group) => (
							<div key={group.id}>
								<p className="mb-1 px-0.5 text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-[#0F4C45]/40">
									{t(group.labelKey)}
								</p>
								<ul className="-mx-1 flex w-full gap-0.5 overflow-x-auto pb-1">
									{group.items.map((item) => (
										<li key={item.key} className="shrink-0">
											<NavButton
												item={item}
												active={item.id === selectedId}
												onSelect={select}
												compact
											/>
										</li>
									))}
								</ul>
							</div>
						))}
					</nav>

					{selected ? (
						<article key={selected.id} className="project-stage">
							<header className="project-stage__head">
								<p className="project-stage__eyebrow">
									{selected.section}
									{selected.kind === "helmet" || selected.kind === "diy"
										? ` · ${t("core.collection")}`
										: null}
								</p>
								<h2 className="project-stage__title">{selected.label}</h2>
							</header>

							<button
								type="button"
								onClick={() => (canOpen ? setPanelOpen(true) : undefined)}
								className={`project-stage__media group ${
									selected.kind === "diy" ? "project-stage__media--diy" : ""
								}`}
							>
								{selected.kind === "diy" && selected.diyItems ? (
									<div className="absolute inset-0 transition duration-700 group-hover:scale-[1.02]">
										<DiyCollagePreview items={selected.diyItems} />
									</div>
								) : (
									<Image
										src={selected.imageSrc}
										alt={selected.imageAlt}
										fill
										sizes="(max-width: 900px) 100vw, 55vw"
										priority
										className="object-cover transition duration-700 group-hover:scale-[1.02]"
									/>
								)}
							</button>

							{selected.summary || selected.subtitle ? (
								<p className="project-stage__body">
									{selected.summary &&
									selected.summary !== selected.subtitle
										? selected.summary
										: selected.subtitle}
								</p>
							) : null}

							{canOpen ? (
								<button
									type="button"
									onClick={() => setPanelOpen(true)}
									className="project-stage__open"
								>
									{openLabel}
									<span className="project-stage__open-arrow" aria-hidden>
										→
									</span>
								</button>
							) : null}
						</article>
					) : null}
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
										<p className="mt-5 text-[1rem] font-medium leading-8 text-[#0F4C45]">
											{selected.pull}
										</p>
									) : null}
									{selected.body?.map((line) => (
										<p
											key={line.slice(0, 24)}
											className="mt-3.5 text-[0.95rem] leading-7 text-[#3E514D]"
										>
											{line}
										</p>
									))}
									{selected.helmetImages?.length ? (
										<div className="mt-7 grid gap-3 sm:grid-cols-2">
											{selected.helmetImages.map((image) => (
												<figure
													key={image.src}
													className="overflow-hidden bg-[#E8E2D8]"
												>
													<div className="relative aspect-[4/3]">
														<Image
															src={image.src}
															alt={image.alt}
															fill
															sizes="320px"
															className="object-cover"
														/>
													</div>
													{image.caption ? (
														<figcaption className="px-3 py-2.5 text-[0.74rem] text-[#6A7A76]">
															{image.caption}
														</figcaption>
													) : null}
												</figure>
											))}
										</div>
									) : null}
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
											isZh={isZh}
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
								{isZh ? diyFocus.titleZh : diyFocus.title}
							</p>
							<p className="mt-1 text-[0.85rem] text-[#4A5C58]">
								{isZh ? diyFocus.title : diyFocus.titleZh}
							</p>
						</div>
					</div>
				</div>
			) : null}
		</section>
	);
}
