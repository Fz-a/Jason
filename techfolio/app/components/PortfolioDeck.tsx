"use client";

import { gsap } from "gsap";
import Image from "next/image";
import Link from "next/link";
import { Montserrat, Lora } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { HomeScrollPreloader } from "./HomeScrollPreloader";
import { HeroNameFlip } from "./HeroNameFlip";
import { FeaturedProjectsRail } from "./FeaturedProjectsRail";
import { AgendaSection } from "./AgendaSection";
import { AboutSection } from "./AboutSection";
import { GoalSection } from "./GoalSection";
import { ResearchSection } from "./ResearchSection";
import { ResearchFitNext } from "./ResearchFitNext";
import { ContactSection, CONTACT_EMAIL, SOCIAL_LINKS } from "./ContactSection";
import { StoryProgress, STORY_STAGES } from "./StoryProgress";
import { useLocale } from "../lib/i18n";
import {
	PageSectionFrame,
	LayoutText,
	orderedVisible,
} from "../lib/use-page-layout";
import type { PageLayoutFile, PageSectionId } from "../lib/page-layout";
import { avatarDisplaySrc, type AvatarVariant } from "../lib/avatar";

const montserrat = Montserrat({
	subsets: ["latin"],
});

// Editorial serif for body copy — a softer, contrasting voice against Montserrat.
const lora = Lora({
	subsets: ["latin"],
	weight: ["400", "500", "600"],
	display: "swap",
});

const STORY_IDS = STORY_STAGES.map((s) => s.id);

const STUDIO_TAP_COUNT = 5;
const STUDIO_TAP_WINDOW_MS = 1400;

/**
 * The scroll deck shared by the homepage and /Introduce.
 * `sections` limits which page sections render (default: all visible ones).
 */
export function PortfolioDeck({
	layout: pageLayout,
	sections,
	contactVariant = "compact",
	avatarVariant = "home",
	showEnterIntroduce = true,
}: {
	layout: PageLayoutFile;
	sections?: readonly PageSectionId[];
	/**
	 * `feature` → full contact block, hero CTA opens the /contact/ page.
	 * `compact` → the original slim slide, hero CTA scrolls to it in place.
	 */
	contactVariant?: "feature" | "compact";
	/** Which avatar to show in the hero ("home" | "introduce"). */
	avatarVariant?: AvatarVariant;
	/** Show the hero "Enter Introduce" link (off on /Introduce/ itself). */
	showEnterIntroduce?: boolean;
}) {
	const { t } = useLocale();
	const router = useRouter();
	const fullOrder = orderedVisible(pageLayout);
	const sectionOrder = sections
		? fullOrder.filter((id) => sections.includes(id))
		: fullOrder;
	const deckIds = sectionOrder.filter(
		(id) => id !== "home" && id !== "contact",
	);
	const [activeSection, setActiveSection] = useState("home");
	const scrollCueRef = useRef<HTMLAnchorElement>(null);
	const cueDotRef = useRef<HTMLSpanElement>(null);
	const cueTextRef = useRef<HTMLSpanElement>(null);
	const homeTapRef = useRef({ count: 0, lastAt: 0 });
	const activeSectionRef = useRef(activeSection);
	const deckIdsRef = useRef(deckIds);
	deckIdsRef.current = deckIds;

	useEffect(() => {
		activeSectionRef.current = activeSection;
	}, [activeSection]);

	const storyProgressId = STORY_IDS.includes(
		activeSection as (typeof STORY_IDS)[number],
	)
		? activeSection
		: "";

	// The story rail only makes sense when every stage is on the page.
	const showStory = STORY_IDS.every((id) => sectionOrder.includes(id));

	// Only the feature deck links out; the compact deck keeps contact in place.
	const contactHref = contactVariant === "feature" ? "/contact/" : "#contact";

	const scrollToSection = (sectionId: string) => {
		const target = document.getElementById(sectionId);
		if (!target) return;

		target.scrollIntoView({ behavior: "smooth", block: "start" });
		window.history.replaceState(null, "", `#${sectionId}`);
		setActiveSection(sectionId);
	};

	const handleNavClick = (
		event: React.MouseEvent<HTMLAnchorElement>,
		href: string,
	) => {
		if (!href.startsWith("#")) return;
		event.preventDefault();
		scrollToSection(href.slice(1));
	};

	const onStudioTap = () => {
		const now = Date.now();
		const tap = homeTapRef.current;
		if (now - tap.lastAt > STUDIO_TAP_WINDOW_MS) {
			tap.count = 0;
		}
		tap.count += 1;
		tap.lastAt = now;
		if (tap.count >= STUDIO_TAP_COUNT) {
			tap.count = 0;
			router.push("/studio/");
		}
	};

	useEffect(() => {
		const hash = window.location.hash.slice(1);
		if (!hash || !document.getElementById(hash)) return;
		const timer = window.setTimeout(() => scrollToSection(hash), 100);
		return () => window.clearTimeout(timer);
	}, []);

	const orderKey = sectionOrder.join("|");

	useEffect(() => {
		const sections = sectionOrder
			.map((id) => document.getElementById(id))
			.filter((el): el is HTMLElement => Boolean(el));

		const cue = scrollCueRef.current;
		const cueDot = cueDotRef.current;
		const cueText = cueTextRef.current;
		const animations: gsap.core.Animation[] = [];
		let cueHidden = false;

		const updateActiveSection = () => {
			const nearPageBottom =
				window.innerHeight + window.scrollY >=
				document.documentElement.scrollHeight - 32;
			const scrollMarker = window.scrollY + window.innerHeight * 0.45;

			if (nearPageBottom) {
				setActiveSection("contact");
				return;
			}

			let current = sections[0]?.id ?? "home";
			for (const section of sections) {
				if (section.offsetTop <= scrollMarker) current = section.id;
			}
			setActiveSection(current);
		};

		const onScroll = () => {
			updateActiveSection();
			if (!cue || !cueDot || !cueText) return;
			const shouldHide = window.scrollY > 48;
			if (shouldHide === cueHidden) return;
			cueHidden = shouldHide;
			animations.forEach((a) => a.kill());
			if (shouldHide) {
				animations.push(
					gsap.to(cue, {
						autoAlpha: 0,
						y: 12,
						duration: 0.35,
						ease: "power2.out",
					}),
				);
			} else {
				animations.push(
					gsap.to(cue, {
						autoAlpha: 1,
						y: 0,
						duration: 0.4,
						ease: "power2.out",
					}),
				);
			}
		};

		updateActiveSection();
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", updateActiveSection);

		const onKey = (e: KeyboardEvent) => {
			if (
				e.target instanceof HTMLElement &&
				(e.target.tagName === "INPUT" ||
					e.target.tagName === "TEXTAREA" ||
					e.target.isContentEditable)
			) {
				return;
			}
			const current = activeSectionRef.current;
			const deck = deckIdsRef.current;
			const inDeck = (deck as string[]).includes(current);
			const deckActive = inDeck
				? current
				: current === "home"
					? "home"
					: (deck[0] ?? "agenda");
			const idx =
				deckActive === "home"
					? -1
					: (deck as string[]).indexOf(deckActive);

			if (e.key === "ArrowDown" || e.key === "PageDown") {
				e.preventDefault();
				const next = deck[Math.min(Math.max(idx, -1) + 1, deck.length - 1)];
				if (next) scrollToSection(next);
			} else if (e.key === "ArrowUp" || e.key === "PageUp") {
				e.preventDefault();
				if (idx <= 0) {
					scrollToSection("home");
				} else {
					scrollToSection(deck[idx - 1]!);
				}
			} else if (/^[1-4]$/.test(e.key)) {
				const stage = STORY_IDS[Number(e.key) - 1];
				if (stage && sectionOrder.includes(stage)) scrollToSection(stage);
			}
		};

		window.addEventListener("keydown", onKey);

		return () => {
			animations.forEach((animation) => animation.kill());
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", updateActiveSection);
			window.removeEventListener("keydown", onKey);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps -- orderKey tracks sectionOrder
	}, [orderKey]);

	const nextAfterHome =
		deckIds[0] ?? sectionOrder.find((id) => id !== "home") ?? "agenda";

	const renderSection = (id: PageSectionId): ReactNode => {
		switch (id) {
			case "home":
				return (
					<section id="home" className="story-slide relative bg-[#F7F1E8]">
						<div className="story-slide__body">
							<div className="mx-auto grid h-full w-full max-w-[1160px] flex-1 grid-cols-1 items-center gap-6 px-5 pb-16 pt-[4.5rem] sm:gap-8 sm:px-8 sm:py-10 md:px-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12 lg:px-12 xl:max-w-[1220px] xl:px-14">
								<div className="order-2 mx-auto w-full max-w-[540px] text-left lg:order-1 lg:max-w-none">
									<button
										type="button"
										onClick={onStudioTap}
										className="cursor-default text-left"
									>
									<p className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-[#0F4C45]/60">
										<LayoutText k="hero.role" />
									</p>
								</button>

				<h1 className="mt-7 text-left text-[2.55rem] font-extrabold leading-[0.95] tracking-tight text-[#162b26] sm:mt-9 sm:text-[3.6rem] lg:text-[4.2rem] xl:text-[4.6rem]">
					<span className="hero-name-greeting block">
						<span>{t("hero.hello")}, </span>
						<span>{t("hero.iam")} </span>
					</span>
					<span className="mt-[0.12em] block">
						<HeroNameFlip />
					</span>
				</h1>

							<p className={`mt-6 max-w-[28rem] text-[1rem] leading-8 text-[#3E514D] sm:text-[1.05rem] ${lora.className}`}>
								<LayoutText k="hero.blurb" multiline />
							</p>

									<p className="mt-8 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#0F4C45]/70">
										{(
											[
												"hero.chip.electronics",
												"hero.chip.embedded",
												"hero.chip.robotics",
												"hero.chip.ai",
												"hero.chip.uav",
											] as const
										)
											.map((key) => t(key))
											.join(" · ")}
									</p>

								<div className="mt-8 flex flex-wrap items-center gap-3">
									<Link
										href={contactHref}
										onClick={(event) => handleNavClick(event, contactHref)}
										className="cursor-pointer rounded-full bg-[#043439] px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
									>
										{t("hero.contact")}
									</Link>
									{showEnterIntroduce ? (
										<Link
											href="/Introduce/"
											className="cursor-pointer rounded-full border border-[#0F4C45]/25 px-6 py-2.5 text-sm font-semibold text-[#0F4C45] transition hover:bg-[#0F4C45] hover:text-white"
										>
											{t("hero.enterIntroduce")}
										</Link>
									) : null}
								</div>
								</div>

								<div className="order-1 flex items-center justify-center lg:order-2">
									<div className="hero-avatar relative aspect-square w-full max-w-[240px] sm:max-w-[340px] lg:max-w-[420px]">
										<div className="hero-avatar__frame relative h-full w-full overflow-hidden rounded-full">
											<Image
												src={avatarDisplaySrc(avatarVariant)}
												alt="Jason Chen"
												fill
												sizes="(max-width: 640px) 240px, 420px"
												priority
												className="hero-avatar__img object-cover"
											/>
											<span aria-hidden className="hero-avatar__veil" />
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center sm:bottom-10">
							<a
								ref={scrollCueRef}
								href={`#${nextAfterHome}`}
								onClick={(event) =>
									handleNavClick(event, `#${nextAfterHome}`)
								}
								className="pointer-events-auto flex cursor-pointer flex-col items-center gap-2.5 text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]/72 transition"
							>
								<span
									ref={cueDotRef}
									className="block h-8 w-px bg-[#0F4C45]/35"
								/>
								<span ref={cueTextRef}>{t("hero.scroll")}</span>
							</a>
						</div>
					</section>
				);
			case "agenda":
				return <AgendaSection onNavigate={scrollToSection} />;
			case "about":
				return <AboutSection />;
			case "experience":
				return <FeaturedProjectsRail />;
			case "research":
				return <ResearchSection />;
			case "goal":
				return <GoalSection />;
			case "next":
				return <ResearchFitNext />;
			case "contact":
				return (
					<section id="contact" className="story-slide bg-[#F7F1E8]">
						{contactVariant === "feature" ? (
							<div className="story-slide__body py-10">
								<ContactSection />
							</div>
						) : (
							<div className="story-slide__body px-6 py-10 sm:px-8 md:px-10 lg:px-12">
								<div className="mx-auto flex w-full max-w-[1100px] flex-col items-center justify-center text-center xl:max-w-[1160px]">
									<p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]/70">
										{t("contact.kicker")}
									</p>
									<p className="mt-4 text-[1.15rem] font-extrabold tracking-tight text-[#162b26] sm:text-[1.35rem]">
										Jason Chen
									</p>
									<p className="mt-2 text-[0.95rem] font-medium text-[#4A5C58]">
										{t("hero.role")}
									</p>
									<div className="mt-7 flex flex-wrap items-center justify-center gap-5">
										<a
											href={`mailto:${CONTACT_EMAIL}`}
											className="text-[0.85rem] font-semibold text-[#0F4C45] underline-offset-4 hover:underline"
										>
											{t("contact.email")}
										</a>
										<a
											href="/Jason-Chen-Resume.pdf"
											download="Jason-Chen-Resume.pdf"
											target="_blank"
											rel="noreferrer"
											className="text-[0.85rem] font-semibold text-[#0F4C45] underline-offset-4 hover:underline"
										>
											{t("nav.cv")}
										</a>
										{SOCIAL_LINKS.map((link) => (
											<a
												key={link.label}
												href={link.href}
												target="_blank"
												rel="noreferrer"
												className="text-[0.85rem] font-semibold text-[#0F4C45] underline-offset-4 hover:underline"
											>
												{link.label}
											</a>
										))}
									</div>
									<p className="mt-14 text-[0.72rem] font-medium tracking-[0.04em] text-[#6B7B77]">
										© 2026 Jason Chen
									</p>
								</div>
							</div>
						)}
					</section>
				);
			default:
				return null;
		}
	};

	return (
		<main className={`${montserrat.className} bg-[#F7F1E8] text-[#162b26]`}>
			<HomeScrollPreloader />
			{showStory ? (
				<StoryProgress
					activeId={storyProgressId}
					onNavigate={scrollToSection}
				/>
			) : null}

			{sectionOrder.map((id) => (
				<PageSectionFrame key={id} id={id} layout={pageLayout}>
					{renderSection(id)}
				</PageSectionFrame>
			))}
		</main>
	);
}
