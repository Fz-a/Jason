"use client";

import Image from "next/image";
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	type CSSProperties,
	type RefObject,
} from "react";
import { InternshipBrief } from "../projects/WorkInternships";
import { ShowcaseDocument } from "../projects/UniversityShowcase";
import { makeEssay } from "../projects/make-essay";
import {
	type UniversityShowcase,
	universityDepartmentShowcases,
	universityProjectShowcases,
} from "../projects/university-showcases";
import { societyShowcases } from "../projects/society-showcases";
import { workCompanies, workShowcases } from "../projects/work-showcases";

/* ─── Types ─────────────────────────────────────────────────────────────── */

type CompanyBrief = (typeof workCompanies)[number];
type HelmetBlock = Extract<(typeof makeEssay)[number], { type: "helmet" }>;
type DiyWallBlock = Extract<(typeof makeEssay)[number], { type: "diy-wall" }>;

type HubCard =
	| { kind: "showcase"; item: UniversityShowcase; section: string }
	| { kind: "company"; item: CompanyBrief }
	| { kind: "helmet"; item: HelmetBlock }
	| { kind: "diy"; item: DiyWallBlock };

type StageBeat = {
	type: "stage";
	id: string;
	phase: string;
	title: string;
	whisper: string;
};

type CardBeat = {
	type: "card";
	card: HubCard;
	side: "left" | "right";
	index: number;
};

type Beat = StageBeat | CardBeat | { type: "end" };

type CardMeta = {
	title: string;
	subtitle: string;
	kindLabel: string;
	image?: { src: string; alt: string; width: number; height: number };
};

const SOCIETY_SECTION: Record<string, string> = {
	robotman: "Society · Team",
	"defense-education": "Society · Dept",
	"drone-workstation": "Society · Dept",
	volunteering: "Society · Volunteer",
	exhibitions: "Society · Exhibit",
};

const WORK_PRODUCT_IDS = new Set(["zongheng-robot", "rtk", "agv"]);

/* ─── Data helpers ──────────────────────────────────────────────────────── */

function cardId(card: HubCard) {
	if (card.kind === "showcase") return card.item.id;
	if (card.kind === "company") return card.item.id;
	if (card.kind === "helmet") return "smart-helmet";
	return "make-diy";
}

function cardMeta(card: HubCard): CardMeta {
	switch (card.kind) {
		case "showcase":
			return {
				title: card.item.title,
				subtitle: card.item.subtitle,
				image: card.item.cardImage,
				kindLabel: card.section,
			};
		case "company":
			return {
				title: card.item.company,
				subtitle: card.item.companyZh,
				image: card.item.image,
				kindLabel: card.item.role,
			};
		case "helmet":
			return {
				title: card.item.title,
				subtitle: card.item.titleZh,
				image: card.item.images[0],
				kindLabel: "MAKE · Venture",
			};
		case "diy":
			return {
				title: "DIY",
				subtitle: card.item.titleZh,
				image: card.item.items[0]?.image,
				kindLabel: "MAKE · Bench",
			};
	}
}

function pickShowcases(ids: string[], pools: UniversityShowcase[]) {
	return ids
		.map((id) => pools.find((item) => item.id === id))
		.filter((item): item is UniversityShowcase => Boolean(item));
}

function buildJourney(): { beats: Beat[]; cards: HubCard[] } {
	const helmet = makeEssay.find(
		(block): block is HelmetBlock => block.type === "helmet",
	);
	const diyWall = makeEssay.find(
		(block): block is DiyWallBlock => block.type === "diy-wall",
	);

	const projectCards: HubCard[] = [
		...workShowcases,
		...pickShowcases(
			["smart-clothes", "fire-warning"],
			universityProjectShowcases,
		),
	].map((item) => ({
		kind: "showcase" as const,
		item,
		section: WORK_PRODUCT_IDS.has(item.id)
			? "Work · Product"
			: "University · Project",
	}));

	const companyCards: HubCard[] = workCompanies.map((item) => ({
		kind: "company" as const,
		item,
	}));

	const makeCards: HubCard[] = [
		...(helmet ? [{ kind: "helmet" as const, item: helmet }] : []),
		...(diyWall ? [{ kind: "diy" as const, item: diyWall }] : []),
	];

	const societyCards: HubCard[] = [
		...pickShowcases(["robotman"], universityProjectShowcases),
		...universityDepartmentShowcases,
		...pickShowcases(["volunteering", "exhibitions"], societyShowcases),
	].map((item) => ({
		kind: "showcase" as const,
		item,
		section: SOCIETY_SECTION[item.id] ?? "Society",
	}));

	let zigzag = 0;
	let momentIndex = 0;
	const mapCards = (list: HubCard[]): CardBeat[] =>
		list.map((card) => {
			momentIndex += 1;
			const side = zigzag % 2 === 0 ? "left" : "right";
			zigzag += 1;
			return { type: "card", card, side, index: momentIndex };
		});

	const stages: { cards: HubCard[]; stage: StageBeat }[] = [
		{
			stage: {
				type: "stage",
				id: "projects",
				phase: "01",
				title: "Projects",
				whisper:
					"Robot, RTK, AGV — then Smart Clothes and Early Fire Warning.",
			},
			cards: projectCards,
		},
		{
			stage: {
				type: "stage",
				id: "companies",
				phase: "02",
				title: "Companies",
				whisper: "Three workplaces — what each one taught in brief.",
			},
			cards: companyCards,
		},
		{
			stage: {
				type: "stage",
				id: "make",
				phase: "03",
				title: "MAKE",
				whisper: "Smart Helmet venture — then the DIY desk builds.",
			},
			cards: makeCards,
		},
		{
			stage: {
				type: "stage",
				id: "society",
				phase: "04",
				title: "Society",
				whisper: "Team, two departments, volunteering, and exhibitions.",
			},
			cards: societyCards,
		},
	];

	const cards = stages.flatMap((entry) => entry.cards);
	const beats: Beat[] = [
		...stages.flatMap(({ stage, cards: stageCards }) => [
			stage,
			...mapCards(stageCards),
		]),
		{ type: "end" },
	];

	return { beats, cards };
}

/* ─── Hooks ─────────────────────────────────────────────────────────────── */

function usePrefersReducedMotion() {
	const [reduced, setReduced] = useState(false);
	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		setReduced(mq.matches);
		const onChange = () => setReduced(mq.matches);
		mq.addEventListener("change", onChange);
		return () => mq.removeEventListener("change", onChange);
	}, []);
	return reduced;
}

function useInViewOnce(enabled: boolean) {
	const ref = useRef<HTMLDivElement>(null);
	const [seen, setSeen] = useState(!enabled);

	useEffect(() => {
		if (!enabled) {
			setSeen(true);
			return;
		}
		const el = ref.current;
		if (!el) return;
		const io = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					setSeen(true);
					io.disconnect();
				}
			},
			{ threshold: 0.22, rootMargin: "0px 0px -6% 0px" },
		);
		io.observe(el);
		return () => io.disconnect();
	}, [enabled]);

	return { ref, seen };
}

function useSpineProgress(
	pathRef: RefObject<HTMLDivElement | null>,
	reduced: boolean,
) {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const path = pathRef.current;
		if (!path || reduced) {
			setProgress(1);
			return;
		}

		const update = () => {
			const rect = path.getBoundingClientRect();
			const view = window.innerHeight;
			const total = rect.height - view * 0.45;
			if (total <= 0) {
				setProgress(1);
				return;
			}
			const raw = (view * 0.55 - rect.top) / total;
			setProgress(Math.min(1, Math.max(0, raw)));
		};

		update();
		window.addEventListener("scroll", update, { passive: true });
		window.addEventListener("resize", update);
		return () => {
			window.removeEventListener("scroll", update);
			window.removeEventListener("resize", update);
		};
	}, [pathRef, reduced]);

	return progress;
}

/* ─── UI pieces ─────────────────────────────────────────────────────────── */

function MomentCard({
	meta,
	active,
	dimmed,
	align,
	index,
	onCommit,
}: {
	meta: CardMeta;
	active: boolean;
	dimmed: boolean;
	align: "left" | "right";
	index: number;
	onCommit: () => void;
}) {
	const mark = String(index).padStart(2, "0");
	const sideEnd = align === "left";

	return (
		<button
			type="button"
			onClick={onCommit}
			className={`journey-moment group relative w-full max-w-[18.5rem] cursor-pointer text-left outline-none sm:max-w-[20.5rem] ${
				sideEnd ? "sm:ml-auto sm:text-right" : "sm:mr-auto sm:text-left"
			} ${dimmed ? "is-dimmed" : ""} ${active ? "is-active" : ""}`}
			aria-pressed={active}
		>
			<span
				aria-hidden
				className={`journey-moment__mark pointer-events-none absolute -top-3.5 font-mono text-[0.64rem] tracking-[0.26em] ${
					sideEnd ? "right-0" : "left-0"
				}`}
			>
				{mark}
			</span>

			<div className="journey-moment__frame relative aspect-[16/10] overflow-hidden">
				{meta.image ? (
					<Image
						src={meta.image.src}
						alt={meta.image.alt}
						fill
						sizes="340px"
						className="journey-moment__image object-cover"
					/>
				) : null}
				<span aria-hidden className="journey-moment__veil" />
				<span
					aria-hidden
					className={`journey-moment__hint absolute bottom-3.5 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-white/90 ${
						sideEnd ? "right-3.5" : "left-3.5"
					}`}
				>
					Open brief
				</span>
			</div>

			<div className="pt-3.5">
				<p className="journey-moment__kind text-[0.64rem] font-semibold uppercase tracking-[0.2em]">
					{meta.kindLabel}
				</p>
				<p className="journey-moment__title mt-1.5 text-[1.05rem] font-semibold tracking-tight sm:text-[1.12rem]">
					{meta.title}
				</p>
				<p className="journey-moment__sub mt-1.5 line-clamp-2 text-[0.78rem] leading-5 sm:text-[0.82rem] sm:leading-[1.35rem]">
					{meta.subtitle}
				</p>
			</div>
		</button>
	);
}

function SpineNode({ active }: { active?: boolean }) {
	return (
		<span
			className={`journey-spine-node relative z-[1] flex h-5 w-5 shrink-0 items-center justify-center ${
				active ? "journey-spine-node--pulse" : ""
			}`}
		>
			<span
				className={`absolute inset-0 rounded-full transition-all duration-700 journey-ease ${
					active ? "scale-100 bg-[#0F4C45]/18" : "scale-50 bg-transparent"
				}`}
			/>
			<span
				className={`relative block rounded-full transition-all duration-500 journey-ease ${
					active
						? "h-3 w-3 bg-[#0F4C45]"
						: "h-2.5 w-2.5 border border-[#0F4C45]/50 bg-[#F7F1E8]"
				}`}
			/>
		</span>
	);
}

function BeatRow({
	beat,
	active,
	dimmed,
	reducedMotion,
	onCommit,
}: {
	beat: CardBeat;
	active: boolean;
	dimmed: boolean;
	reducedMotion: boolean;
	onCommit: () => void;
}) {
	const meta = cardMeta(beat.card);
	const { ref, seen } = useInViewOnce(!reducedMotion);

	const moment = (align: "left" | "right") => (
		<MomentCard
			meta={meta}
			align={align}
			index={beat.index}
			active={active}
			dimmed={dimmed}
			onCommit={onCommit}
		/>
	);

	return (
		<div
			ref={ref}
			className={`journey-reveal relative z-[1] ${seen ? "is-seen" : ""}`}
			style={
				{
					"--reveal-x": beat.side === "left" ? "-16px" : "16px",
				} as CSSProperties
			}
		>
			<div className="flex items-start justify-center gap-4 py-6 sm:hidden">
				<div className="flex w-5 shrink-0 justify-center pt-9">
					<SpineNode active={active} />
				</div>
				{moment("right")}
			</div>

			<div className="hidden grid-cols-[minmax(0,1fr)_2.25rem_minmax(0,1fr)] items-center py-7 sm:grid">
				<div className="flex justify-end pr-7">
					{beat.side === "left" ? moment("left") : (
						<span
							aria-hidden
							className="block h-px w-12 max-w-[30%] bg-[#0F4C45]/08"
						/>
					)}
				</div>
				<div className="relative flex items-center justify-center">
					<span
						aria-hidden
						className={`absolute top-1/2 h-px -translate-y-1/2 transition-all duration-700 journey-ease ${
							beat.side === "left" ? "right-full" : "left-full"
						} ${active ? "w-11 bg-[#0F4C45]/45" : "w-7 bg-[#0F4C45]/14"}`}
					/>
					<SpineNode active={active} />
				</div>
				<div className="flex justify-start pl-7">
					{beat.side === "right" ? moment("right") : (
						<span
							aria-hidden
							className="block h-px w-12 max-w-[30%] bg-[#0F4C45]/08"
						/>
					)}
				</div>
			</div>
		</div>
	);
}

function StageBlock({ beat }: { beat: StageBeat }) {
	return (
		<div className="relative z-[1] flex flex-col items-center py-9 text-center sm:py-11">
			<span className="flex h-4 w-4 shrink-0 items-center justify-center">
				<span className="h-3 w-3 rounded-full border-[1.5px] border-[#0F4C45] bg-[#F7F1E8] shadow-[0_0_0_6px_#F7F1E8]" />
			</span>
			<div className="relative mt-4 w-full max-w-[22rem] sm:max-w-[26rem]">
				<span
					aria-hidden
					className="pointer-events-none absolute left-1/2 top-[-0.65rem] bottom-[-0.65rem] z-0 w-5 -translate-x-1/2 bg-[#F7F1E8]"
				/>
				<div className="journey-stage-frame relative z-[1] px-5 py-4 sm:px-7 sm:py-5">
					<p className="font-mono text-[0.64rem] tracking-[0.28em] text-[#0F4C45]/55">
						{beat.phase}
					</p>
					<h2 className="mt-1.5 text-[1.85rem] font-extrabold tracking-tight text-[#162b26] sm:text-[2.25rem]">
						{beat.title}
					</h2>
					<p className="mx-auto mt-2.5 max-w-[22rem] text-[0.92rem] leading-7 text-[#5C6F6A] sm:text-[0.95rem]">
						{beat.whisper}
					</p>
				</div>
			</div>
		</div>
	);
}

function HelmetBrief({ item }: { item: HelmetBlock }) {
	return (
		<article className="bg-white/90 px-6 py-8 text-[#111] sm:px-10 sm:py-10">
			<p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#8A9692]">
				MAKE · Venture
			</p>
			<p className="mt-1 font-mono text-[0.58rem] tracking-[0.2em] text-[#8A9692]">
				{item.num}
			</p>
			<h3 className="mt-4 text-[1.45rem] font-extrabold tracking-tight text-[#162b26]">
				{item.title}
			</h3>
			<p className="mt-1 text-[0.88rem] text-[#6A7A76]">{item.titleZh}</p>
			<p className="mt-4 text-[0.95rem] font-medium leading-7 text-[#0F4C45]">
				{item.pull}
			</p>
			{item.body.map((paragraph) => (
				<p
					key={paragraph.slice(0, 28)}
					className="mt-3 text-[0.92rem] leading-7 text-[#333]"
				>
					{paragraph}
				</p>
			))}
			<div className="mt-6 grid gap-3 sm:grid-cols-2">
				{item.images.map((image) => (
					<figure key={image.src} className="overflow-hidden bg-[#F5F5F3]">
						<div className="relative aspect-[4/3]">
							<Image
								src={image.src}
								alt={image.alt}
								fill
								sizes="280px"
								className="object-cover"
							/>
						</div>
						{image.caption ? (
							<figcaption className="px-3 py-2 text-[0.68rem] text-[#8A9692]">
								{image.caption}
							</figcaption>
						) : null}
					</figure>
				))}
			</div>
		</article>
	);
}

function DiyBrief({ item }: { item: DiyWallBlock }) {
	return (
		<article className="bg-white/90 px-6 py-8 text-[#111] sm:px-10 sm:py-10">
			<p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#8A9692]">
				MAKE · DIY
			</p>
			<p className="mt-1 font-mono text-[0.58rem] tracking-[0.2em] text-[#8A9692]">
				{item.num}
			</p>
			<h3 className="mt-4 text-[1.45rem] font-extrabold tracking-tight text-[#162b26]">
				{item.title}
			</h3>
			<p className="mt-1 text-[0.88rem] text-[#6A7A76]">{item.titleZh}</p>
			<p className="mt-4 text-[0.92rem] leading-7 text-[#333]">{item.lede}</p>
			<p className="mt-5 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#8A9692]">
				Scroll for each build
			</p>
			<ul className="mt-4 space-y-8">
				{item.items.map((diy, index) => (
					<li key={diy.id} className="border-t border-black/[0.06] pt-6">
						<p className="font-mono text-[0.58rem] tracking-[0.18em] text-[#8A9692]">
							{String(index + 1).padStart(2, "0")} · {diy.year}
						</p>
						<div className="relative mt-3 aspect-[4/3] overflow-hidden bg-[#F5F5F3]">
							<Image
								src={diy.image.src}
								alt={diy.image.alt}
								fill
								sizes="520px"
								className="object-contain p-4"
							/>
						</div>
						<h4 className="mt-4 text-[1.12rem] font-extrabold tracking-tight text-[#162b26]">
							{diy.title}
						</h4>
						<p className="mt-1 text-[0.88rem] text-[#6A7A76]">{diy.titleZh}</p>
					</li>
				))}
			</ul>
		</article>
	);
}

function BriefBody({ card }: { card: HubCard }) {
	if (card.kind === "showcase") {
		return (
			<ShowcaseDocument
				item={card.item}
				sectionLabel={card.section}
				className="shadow-none"
			/>
		);
	}
	if (card.kind === "company") {
		return <InternshipBrief item={card.item} className="shadow-none" />;
	}
	if (card.kind === "helmet") return <HelmetBrief item={card.item} />;
	return <DiyBrief item={card.item} />;
}

function BriefOverlay({
	open,
	card,
	paneRef,
	onClose,
}: {
	open: boolean;
	card: HubCard | null;
	paneRef: RefObject<HTMLElement | null>;
	onClose: () => void;
}) {
	const visible = open && card;

	return (
		<div
			className={`journey-overlay fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 ${
				visible ? "is-open pointer-events-auto" : "pointer-events-none"
			}`}
		>
			<button
				type="button"
				aria-label="Close brief"
				className="journey-scrim absolute inset-0 cursor-pointer border-0"
				onClick={onClose}
			/>
			<aside
				ref={paneRef}
				inert={!open}
				aria-hidden={!open}
				role="dialog"
				aria-modal="true"
				aria-label="Journey brief"
				className={`journey-drawer relative z-10 flex max-h-[min(84vh,52rem)] w-full max-w-[36rem] flex-col overflow-hidden lg:max-w-[38rem] ${
					visible ? "is-open" : ""
				}`}
				onClick={(event) => event.stopPropagation()}
			>
				<div className="flex shrink-0 items-center justify-between border-b border-[#0F4C45]/10 px-5 py-3.5 sm:px-6">
					<p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#0F4C45]/55">
						Brief
					</p>
					<button
						type="button"
						onClick={onClose}
						className="rounded-full px-3 py-1 text-[0.74rem] font-semibold text-[#0F4C45] transition-colors duration-300 hover:bg-[#0F4C45]/10"
					>
						Close
					</button>
				</div>
				<div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
					{card ? (
						<div key={cardId(card)} className="journey-brief-enter">
							<BriefBody card={card} />
						</div>
					) : null}
				</div>
			</aside>
		</div>
	);
}

/* ─── Main ──────────────────────────────────────────────────────────────── */

export function JourneyHub() {
	const { beats, cards } = useMemo(() => buildJourney(), []);
	const [activeId, setActiveId] = useState<string | null>(null);
	const [open, setOpen] = useState(false);
	const paneRef = useRef<HTMLElement>(null);
	const pathRef = useRef<HTMLDivElement>(null);
	const reduced = usePrefersReducedMotion();
	const progress = useSpineProgress(pathRef, reduced);

	const activeCard = cards.find((card) => cardId(card) === activeId) ?? null;

	const openBrief = useCallback((id: string) => {
		setActiveId(id);
		setOpen(true);
	}, []);

	const close = useCallback(() => setOpen(false), []);

	useEffect(() => {
		if (!open) return;
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open]);

	useEffect(() => {
		if (!open) return;
		paneRef.current?.scrollTo({ top: 0, behavior: "smooth" });
	}, [activeId, open]);

	useEffect(() => {
		if (!open) return;
		const previous = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = previous;
		};
	}, [open]);

	return (
		<div className="relative">
			<div
				ref={pathRef}
				className={`relative mx-auto max-w-[54rem] transition-[opacity,filter] duration-700 journey-ease ${
					open ? "opacity-[0.55]" : "opacity-100"
				}`}
			>
				<span
					aria-hidden
					className="pointer-events-none absolute left-1/2 top-24 h-[42rem] w-[min(100%,28rem)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(15,76,69,0.06),transparent_70%)]"
				/>
				<span
					aria-hidden
					className="absolute bottom-6 left-1/2 top-10 w-px -translate-x-1/2 bg-[#0F4C45]/10"
				/>
				<span
					aria-hidden
					className="absolute left-1/2 top-10 w-px origin-top -translate-x-1/2 bg-gradient-to-b from-[#0F4C45] via-[#0F4C45]/80 to-[#0F4C45]/35 transition-[height] duration-150 ease-out"
					style={{ height: `calc((100% - 4rem) * ${progress})` }}
				/>

				<div>
					{beats.map((beat) => {
						if (beat.type === "stage") {
							return <StageBlock key={`stage-${beat.id}`} beat={beat} />;
						}
						if (beat.type === "end") {
							return (
								<div
									key="end"
									className="relative z-[1] flex flex-col items-center pt-10 text-center sm:pt-12"
								>
									<span className="flex h-4 w-4 shrink-0 items-center justify-center">
										<span className="h-2.5 w-2.5 rounded-full bg-[#0F4C45]" />
									</span>
									<div className="mt-3">
										<p className="text-[1rem] font-medium leading-7 text-[#0F4C45] sm:text-[1.05rem]">
											Still making — graduate study in intelligent hardware.
										</p>
										<p className="mt-1.5 text-[0.8rem] tracking-[0.04em] text-[#6A7A76]">
											The path continues.
										</p>
									</div>
								</div>
							);
						}

						const id = cardId(beat.card);
						const isActive = open && activeId === id;
						return (
							<BeatRow
								key={`card-${id}`}
								beat={beat}
								active={isActive}
								dimmed={open && !isActive}
								reducedMotion={reduced}
								onCommit={() => openBrief(id)}
							/>
						);
					})}
				</div>
			</div>

			<BriefOverlay
				open={open}
				card={activeCard}
				paneRef={paneRef}
				onClose={close}
			/>
		</div>
	);
}
