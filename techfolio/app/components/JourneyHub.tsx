"use client";

import Image from "next/image";
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	type CSSProperties,
	type MouseEvent,
	type PointerEvent,
	type RefObject,
	type TouchEvent,
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
import briefsStore from "../../content/briefs.json";
import { BriefDocument } from "./BriefDocument";
import type { BriefStore } from "../lib/brief-types";
import { useLocale } from "../lib/i18n";


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

const SOCIETY_SECTION_ZH: Record<string, string> = {
	robotman: "社会 · 团队",
	"defense-education": "社会 · 部门",
	"drone-workstation": "社会 · 部门",
	volunteering: "社会 · 志愿",
	exhibitions: "社会 · 展览",
};

const SOCIETY_SECTION_ZH_HANT: Record<string, string> = {
	robotman: "社會 · 團隊",
	"defense-education": "社會 · 部門",
	"drone-workstation": "社會 · 部門",
	volunteering: "社會 · 志願",
	exhibitions: "社會 · 展覽",
};

const WORK_PRODUCT_IDS = new Set(["zongheng-robot", "rtk", "agv"]);

const STAGE_I18N: Record<string, { title: string; whisper: string }> = {
	projects: {
		title: "journey.projects",
		whisper: "journey.projects.whisper",
	},
	companies: {
		title: "journey.companies",
		whisper: "journey.companies.whisper",
	},
	make: { title: "journey.make", whisper: "journey.make.whisper" },
	society: { title: "journey.society", whisper: "journey.society.whisper" },
};

/* ─── Data helpers ──────────────────────────────────────────────────────── */

function cardId(card: HubCard) {
	if (card.kind === "showcase") return card.item.id;
	if (card.kind === "company") return card.item.id;
	if (card.kind === "helmet") return "smart-helmet";
	return "make-diy";
}

function cardMeta(
	card: HubCard,
	locale: "en" | "zh-Hans" | "zh-Hant",
): CardMeta {
	const isZh = locale !== "en";
	const sectionZh =
		locale === "zh-Hant" ? SOCIETY_SECTION_ZH_HANT : SOCIETY_SECTION_ZH;

	switch (card.kind) {
		case "showcase": {
			const section = isZh
				? WORK_PRODUCT_IDS.has(card.item.id)
					? locale === "zh-Hant"
						? "工作 · 產品"
						: "工作 · 产品"
					: (sectionZh[card.item.id] ??
						(locale === "zh-Hant" ? "社會" : "社会"))
				: card.section;
			return {
				title: card.item.title,
				subtitle: card.item.subtitle,
				image: card.item.cardImage,
				kindLabel: section,
			};
		}
		case "company":
			return isZh
				? {
						title: card.item.companyZh,
						subtitle: card.item.company,
						image: card.item.image,
						kindLabel:
							card.item.role === "Full-time"
								? locale === "zh-Hant"
									? "全職"
									: "全职"
								: locale === "zh-Hant"
									? "實習"
									: "实习",
					}
				: {
						title: card.item.company,
						subtitle: card.item.companyZh,
						image: card.item.image,
						kindLabel: card.item.role,
					};
		case "helmet":
			return {
				title: isZh ? card.item.titleZh : card.item.title,
				subtitle: isZh ? card.item.title : card.item.titleZh,
				image: card.item.images[0],
				kindLabel:
					locale === "zh-Hant"
						? "造物 · 創業"
						: locale === "zh-Hans"
							? "造物 · 创业"
							: "MAKE · Venture",
			};
		case "diy":
			return {
				title: "DIY",
				subtitle: card.item.titleZh,
				image: card.item.items[0]?.image,
				kindLabel:
					locale === "zh-Hant"
						? "造物 · 工作台"
						: locale === "zh-Hans"
							? "造物 · 工作台"
							: "MAKE · Bench",
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
	onHover,
	onLeave,
}: {
	meta: CardMeta;
	active: boolean;
	dimmed: boolean;
	align: "left" | "right";
	index: number;
	onCommit: () => void;
	onHover: () => void;
	onLeave: () => void;
}) {
	const { t } = useLocale();
	const mark = String(index).padStart(2, "0");
	const sideEnd = align === "left";

	return (
		<button
			type="button"
			onClick={onCommit}
			onMouseEnter={onHover}
			onFocus={onHover}
			onMouseLeave={onLeave}
			onBlur={onLeave}
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
					{t("journey.peek")}
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
	onHover,
	onLeave,
}: {
	beat: CardBeat;
	active: boolean;
	dimmed: boolean;
	reducedMotion: boolean;
	onCommit: () => void;
	onHover: () => void;
	onLeave: () => void;
}) {
	const { locale } = useLocale();
	const meta = cardMeta(beat.card, locale);
	const { ref, seen } = useInViewOnce(!reducedMotion);

	const moment = (align: "left" | "right") => (
		<MomentCard
			meta={meta}
			align={align}
			index={beat.index}
			active={active}
			dimmed={dimmed}
			onCommit={onCommit}
			onHover={onHover}
			onLeave={onLeave}
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
	const { t } = useLocale();
	const copy = STAGE_I18N[beat.id];
	const title = copy ? t(copy.title) : beat.title;
	const whisper = copy ? t(copy.whisper) : beat.whisper;

	return (
		<div
			id={`journey-stage-${beat.id}`}
			className="relative z-[1] scroll-mt-28 flex flex-col items-center py-9 text-center sm:scroll-mt-32 sm:py-11"
		>
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
						{title}
					</h2>
					<p className="mx-auto mt-2.5 max-w-[22rem] text-[0.92rem] leading-7 text-[#5C6F6A] sm:text-[0.95rem]">
						{whisper}
					</p>
				</div>
			</div>
		</div>
	);
}

function useActiveStage(stageIds: string[]) {
	const [active, setActive] = useState(stageIds[0] ?? "");

	useEffect(() => {
		if (stageIds.length === 0) return;

		const nodes = stageIds
			.map((id) => document.getElementById(`journey-stage-${id}`))
			.filter((el): el is HTMLElement => Boolean(el));

		if (nodes.length === 0) return;

		const update = () => {
			const marker = window.innerHeight * 0.32;
			let current = stageIds[0] ?? "";
			for (const node of nodes) {
				const top = node.getBoundingClientRect().top;
				if (top <= marker) {
					current = node.id.replace("journey-stage-", "");
				}
			}
			setActive(current);
		};

		update();
		window.addEventListener("scroll", update, { passive: true });
		window.addEventListener("resize", update);
		return () => {
			window.removeEventListener("scroll", update);
			window.removeEventListener("resize", update);
		};
	}, [stageIds]);

	return active;
}

/** Show rail only while the About section occupies the viewport. */
function useAboutLocked() {
	const [locked, setLocked] = useState(false);

	useEffect(() => {
		const about = document.getElementById("about");
		if (!about) return;

		const update = () => {
			const rect = about.getBoundingClientRect();
			const vh = window.innerHeight;
			// Locked when About covers a meaningful band of the screen
			const entered = rect.top < vh * 0.55;
			const stillHere = rect.bottom > vh * 0.35;
			setLocked(entered && stillHere);
		};

		update();
		window.addEventListener("scroll", update, { passive: true });
		window.addEventListener("resize", update);
		return () => {
			window.removeEventListener("scroll", update);
			window.removeEventListener("resize", update);
		};
	}, []);

	return locked;
}

function StageRail({
	stages,
	activeId,
	visible,
}: {
	stages: StageBeat[];
	activeId: string;
	visible: boolean;
}) {
	const { t } = useLocale();
	const jump = (id: string) => {
		const el = document.getElementById(`journey-stage-${id}`);
		el?.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	return (
		<nav
			aria-label="Journey stages"
			aria-hidden={!visible}
			className={`journey-stage-rail fixed left-4 top-1/2 z-30 hidden lg:left-6 lg:block xl:left-8 ${
				visible ? "is-visible" : ""
			}`}
		>
			<ul className="relative flex flex-col gap-5 pl-3">
				<span
					aria-hidden
					className="absolute bottom-1.5 left-[0.2rem] top-1.5 w-px bg-[#0F4C45]/12"
				/>
				{stages.map((stage) => {
					const isActive = activeId === stage.id;
					const copy = STAGE_I18N[stage.id];
					const title = copy ? t(copy.title) : stage.title;
					return (
						<li key={stage.id}>
							<button
								type="button"
								onClick={() => jump(stage.id)}
								aria-current={isActive ? "true" : undefined}
								disabled={!visible}
								tabIndex={visible ? 0 : -1}
								className={`group relative flex items-center gap-3 text-left transition-all duration-500 journey-ease ${
									isActive
										? "translate-x-0 opacity-100"
										: "translate-x-0 opacity-45 hover:opacity-80"
								}`}
							>
								<span
									aria-hidden
									className={`relative z-[1] block rounded-full transition-all duration-500 journey-ease ${
										isActive
											? "h-2 w-2 bg-[#0F4C45] shadow-[0_0_0_4px_rgba(15,76,69,0.12)]"
											: "h-1.5 w-1.5 bg-[#0F4C45]/35 group-hover:bg-[#0F4C45]/55"
									}`}
								/>
								<span className="flex flex-col">
									<span
										className={`font-mono text-[0.52rem] tracking-[0.2em] transition-colors duration-500 ${
											isActive ? "text-[#0F4C45]/55" : "text-[#0F4C45]/35"
										}`}
									>
										{stage.phase}
									</span>
									<span
										className={`text-[0.78rem] font-semibold tracking-tight transition-colors duration-500 ${
											isActive ? "text-[#0F4C45]" : "text-[#162b26]/55"
										}`}
									>
										{title}
									</span>
								</span>
							</button>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}

function HelmetBrief({ item }: { item: HelmetBlock }) {
	return (
		<article className="bg-white/90 px-7 py-9 text-[#111] sm:px-11 sm:py-11">
			<p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#8A9692]">
				MAKE · Venture
			</p>
			<p className="mt-1 font-mono text-[0.62rem] tracking-[0.2em] text-[#8A9692]">
				{item.num}
			</p>
			<h3 className="mt-4 text-[1.6rem] font-extrabold tracking-tight text-[#162b26] sm:text-[1.7rem]">
				{item.title}
			</h3>
			<p className="mt-1.5 text-[0.95rem] text-[#6A7A76]">{item.titleZh}</p>
			<p className="mt-5 text-[1.02rem] font-medium leading-8 text-[#0F4C45]">
				{item.pull}
			</p>
			{item.body.map((paragraph) => (
				<p
					key={paragraph.slice(0, 28)}
					className="mt-3.5 text-[1rem] leading-8 text-[#333]"
				>
					{paragraph}
				</p>
			))}
			<div className="mt-7 grid gap-3.5 sm:grid-cols-2">
				{item.images.map((image) => (
					<figure key={image.src} className="overflow-hidden bg-[#F5F5F3]">
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
							<figcaption className="px-3 py-2.5 text-[0.74rem] text-[#8A9692]">
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
		<article className="bg-white/90 px-7 py-9 text-[#111] sm:px-11 sm:py-11">
			<p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#8A9692]">
				MAKE · DIY
			</p>
			<p className="mt-1 font-mono text-[0.62rem] tracking-[0.2em] text-[#8A9692]">
				{item.num}
			</p>
			<h3 className="mt-4 text-[1.6rem] font-extrabold tracking-tight text-[#162b26] sm:text-[1.7rem]">
				{item.title}
			</h3>
			<p className="mt-1.5 text-[0.95rem] text-[#6A7A76]">{item.titleZh}</p>
			<p className="mt-5 text-[1rem] leading-8 text-[#333]">{item.lede}</p>
			<p className="mt-6 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#8A9692]">
				Scroll for each build
			</p>
			<ul className="mt-4 space-y-8">
				{item.items.map((diy, index) => (
					<li key={diy.id} className="border-t border-black/[0.06] pt-6">
						<p className="font-mono text-[0.62rem] tracking-[0.18em] text-[#8A9692]">
							{String(index + 1).padStart(2, "0")} · {diy.year}
						</p>
						<div className="relative mt-3 aspect-[4/3] overflow-hidden bg-[#F5F5F3]">
							<Image
								src={diy.image.src}
								alt={diy.image.alt}
								fill
								sizes="560px"
								className="object-contain p-4"
							/>
						</div>
						<h4 className="mt-4 text-[1.22rem] font-extrabold tracking-tight text-[#162b26]">
							{diy.title}
						</h4>
						<p className="mt-1 text-[0.95rem] text-[#6A7A76]">{diy.titleZh}</p>
					</li>
				))}
			</ul>
		</article>
	);
}


const BRIEF_OVERRIDES = briefsStore as BriefStore;

function BriefBody({ card }: { card: HubCard }) {
	const id = cardId(card);
	const override = BRIEF_OVERRIDES[id];
	if (override) return <BriefDocument doc={override} />;

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

function clamp(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, value));
}

function touchDistance(
	a: { clientX: number; clientY: number },
	b: { clientX: number; clientY: number },
) {
	const dx = a.clientX - b.clientX;
	const dy = a.clientY - b.clientY;
	return Math.hypot(dx, dy);
}

function BriefLightbox({
	shot,
	onClose,
}: {
	shot: { src: string; alt: string } | null;
	onClose: () => void;
}) {
	const open = !!shot;
	const stageRef = useRef<HTMLElement>(null);
	const [scale, setScale] = useState(1);
	const [offset, setOffset] = useState({ x: 0, y: 0 });
	const scaleRef = useRef(1);
	const offsetRef = useRef({ x: 0, y: 0 });
	const dragRef = useRef<{ x: number; y: number } | null>(null);
	const pinchRef = useRef<{ startDist: number; startScale: number } | null>(
		null,
	);
	const { t } = useLocale();

	useEffect(() => {
		scaleRef.current = scale;
		if (
			scale <= 1.02 &&
			(offsetRef.current.x !== 0 || offsetRef.current.y !== 0)
		) {
			offsetRef.current = { x: 0, y: 0 };
			setOffset({ x: 0, y: 0 });
		}
	}, [scale]);

	useEffect(() => {
		offsetRef.current = offset;
	}, [offset]);

	useEffect(() => {
		setScale(1);
		setOffset({ x: 0, y: 0 });
		scaleRef.current = 1;
		offsetRef.current = { x: 0, y: 0 };
		dragRef.current = null;
		pinchRef.current = null;
	}, [shot?.src]);

	useEffect(() => {
		if (!open) return;
		const stage = stageRef.current;
		if (!stage) return;

		const onWheel = (event: WheelEvent) => {
			event.preventDefault();
			const next = clamp(
				scaleRef.current * (1 - event.deltaY * 0.0018),
				1,
				3.5,
			);
			scaleRef.current = next;
			setScale(next);
		};

		const onTouchMove = (event: globalThis.TouchEvent) => {
			if (event.touches.length !== 2 || !pinchRef.current) return;
			event.preventDefault();
			const [a, b] = [event.touches[0], event.touches[1]];
			if (!a || !b || pinchRef.current.startDist <= 0) return;
			const ratio = touchDistance(a, b) / pinchRef.current.startDist;
			const next = clamp(pinchRef.current.startScale * ratio, 1, 3.5);
			scaleRef.current = next;
			setScale(next);
		};

		stage.addEventListener("wheel", onWheel, { passive: false });
		stage.addEventListener("touchmove", onTouchMove, { passive: false });
		return () => {
			stage.removeEventListener("wheel", onWheel);
			stage.removeEventListener("touchmove", onTouchMove);
		};
	}, [open, shot?.src]);

	const onPointerDown = (event: PointerEvent<HTMLImageElement>) => {
		if (scaleRef.current <= 1.02) return;
		event.currentTarget.setPointerCapture(event.pointerId);
		dragRef.current = {
			x: event.clientX - offsetRef.current.x,
			y: event.clientY - offsetRef.current.y,
		};
	};

	const onPointerMove = (event: PointerEvent<HTMLImageElement>) => {
		if (!dragRef.current) return;
		setOffset({
			x: event.clientX - dragRef.current.x,
			y: event.clientY - dragRef.current.y,
		});
	};

	const onPointerUp = (event: PointerEvent<HTMLImageElement>) => {
		if (dragRef.current) {
			event.currentTarget.releasePointerCapture(event.pointerId);
		}
		dragRef.current = null;
	};

	const onTouchStart = (event: TouchEvent) => {
		if (event.touches.length !== 2) return;
		const [a, b] = [event.touches[0], event.touches[1]];
		if (!a || !b) return;
		pinchRef.current = {
			startDist: touchDistance(a, b),
			startScale: scaleRef.current,
		};
		dragRef.current = null;
	};

	const onTouchEnd = () => {
		pinchRef.current = null;
	};

	const onDoubleClick = (event: MouseEvent<HTMLImageElement>) => {
		event.stopPropagation();
		const next = scaleRef.current > 1.4 ? 1 : 2.2;
		scaleRef.current = next;
		setScale(next);
		if (next === 1) setOffset({ x: 0, y: 0 });
	};

	return (
		<div
			className={`journey-lightbox ${open ? "is-open" : ""}`}
			aria-hidden={!open}
			role={open ? "dialog" : undefined}
			aria-modal={open || undefined}
			aria-label={open ? "Enlarged image" : undefined}
		>
			<button
				type="button"
				aria-label="Close enlarged image"
				className="journey-lightbox__scrim"
				onClick={onClose}
				tabIndex={open ? 0 : -1}
			/>
			{shot ? (
				<figure
					ref={stageRef}
					className="journey-lightbox__stage"
					onClick={onClose}
					onTouchStart={onTouchStart}
					onTouchEnd={onTouchEnd}
					onTouchCancel={onTouchEnd}
				>
					<div className="journey-lightbox__frame">
						{/* Native img: src already comes from Next/Image output */}
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={shot.src}
							alt={shot.alt}
							draggable={false}
							className={`journey-lightbox__img ${scale > 1.02 ? "is-zoomed" : ""}`}
							style={
								{
									"--lb-scale": scale,
									"--lb-x": `${offset.x}px`,
									"--lb-y": `${offset.y}px`,
								} as CSSProperties
							}
							onClick={(event) => event.stopPropagation()}
							onDoubleClick={onDoubleClick}
							onPointerDown={onPointerDown}
							onPointerMove={onPointerMove}
							onPointerUp={onPointerUp}
							onPointerCancel={onPointerUp}
						/>
					</div>
					<p aria-hidden className="journey-lightbox__hint">
						{t("journey.lightbox.hint")}
					</p>
				</figure>
			) : null}
		</div>
	);
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
	const { t } = useLocale();
	const visible = open && card;
	const [zoom, setZoom] = useState<{ src: string; alt: string } | null>(null);
	const currentCardId = card ? cardId(card) : null;

	useEffect(() => {
		setZoom(null);
	}, [open, currentCardId]);

	useEffect(() => {
		if (!open) return;
		const onKey = (event: KeyboardEvent) => {
			if (event.key !== "Escape") return;
			if (zoom) {
				event.preventDefault();
				setZoom(null);
				return;
			}
			onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, zoom, onClose]);

	const openZoom = useCallback((event: MouseEvent<HTMLElement>) => {
		const target = event.target as HTMLElement | null;
		if (!target) return;
		const img = target.closest("img");
		if (!img?.src) return;
		event.preventDefault();
		event.stopPropagation();
		setZoom({
			src: img.currentSrc || img.src,
			alt: img.alt || "Expanded image",
		});
	}, []);

	return (
		<div
			className={`journey-overlay fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8 ${
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
				className={`journey-drawer relative z-10 flex max-h-[min(90vh,60rem)] w-full max-w-[42rem] flex-col overflow-hidden sm:max-w-[46rem] lg:max-w-[50rem] ${
					visible ? "is-open" : ""
				}`}
				onClick={(event) => event.stopPropagation()}
			>
				<div className="flex shrink-0 items-center justify-between border-b border-[#0F4C45]/10 px-6 py-4 sm:px-8">
					<p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#0F4C45]/55">
						{t("journey.brief")}
					</p>
					<button
						type="button"
						onClick={onClose}
						className="rounded-full px-3.5 py-1.5 text-[0.8rem] font-semibold text-[#0F4C45] transition-colors duration-300 hover:bg-[#0F4C45]/10"
					>
						{t("journey.close")}
					</button>
				</div>
				<div
					className="journey-brief-zoomable min-h-0 flex-1 overflow-y-auto overscroll-contain"
					onClick={openZoom}
				>
					{card ? (
						<div
							key={currentCardId}
							className="journey-brief-enter journey-brief-body"
						>
							<BriefBody card={card} />
						</div>
					) : null}
				</div>
			</aside>

			<BriefLightbox shot={zoom} onClose={() => setZoom(null)} />
		</div>
	);
}

/* ─── Main ──────────────────────────────────────────────────────────────── */

export function JourneyHub() {
	const { t } = useLocale();
	const { beats, cards } = useMemo(() => buildJourney(), []);
	const stages = useMemo(
		() => beats.filter((beat): beat is StageBeat => beat.type === "stage"),
		[beats],
	);
	const stageIds = useMemo(() => stages.map((stage) => stage.id), [stages]);
	const activeStage = useActiveStage(stageIds);
	const aboutLocked = useAboutLocked();

	const [activeId, setActiveId] = useState<string | null>(null);
	const [open, setOpen] = useState(false);
	const paneRef = useRef<HTMLElement>(null);
	const pathRef = useRef<HTMLDivElement>(null);
	const hoverTimer = useRef<number | null>(null);
	const reduced = usePrefersReducedMotion();
	const progress = useSpineProgress(pathRef, reduced);

	const activeCard = cards.find((card) => cardId(card) === activeId) ?? null;
	const railVisible = aboutLocked && !open;

	const clearTimers = useCallback(() => {
		if (hoverTimer.current !== null) {
			window.clearTimeout(hoverTimer.current);
			hoverTimer.current = null;
		}
	}, []);

	const openBrief = useCallback(
		(id: string, immediate = false) => {
			clearTimers();
			const apply = () => {
				setActiveId(id);
				setOpen(true);
			};
			if (immediate || reduced || open) {
				apply();
				return;
			}
			hoverTimer.current = window.setTimeout(apply, 220);
		},
		[clearTimers, open, reduced],
	);

	const close = useCallback(() => {
		clearTimers();
		setOpen(false);
	}, [clearTimers]);

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

	useEffect(() => () => clearTimers(), [clearTimers]);

	return (
		<div className="relative">
			<StageRail
				stages={stages}
				activeId={activeStage}
				visible={railVisible}
			/>

			<div
				ref={pathRef}
				className={`relative mx-auto max-w-[54rem] transition-opacity duration-500 journey-ease ${
					open ? "opacity-[0.48]" : "opacity-100"
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
											{t("journey.end")}
										</p>
										<p className="mt-1.5 text-[0.8rem] tracking-[0.04em] text-[#6A7A76]">
											{t("journey.end.sub")}
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
								onCommit={() => openBrief(id, true)}
								onHover={() => openBrief(id)}
								onLeave={clearTimers}
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
