"use client";

import { gsap } from "gsap";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { HomeScrollPreloader } from "./components/HomeScrollPreloader";
import { HeroNameFlip } from "./components/HeroNameFlip";
import { FeaturedProjects } from "./components/FeaturedProjects";
import { AgendaSection } from "./components/AgendaSection";
import { GoalSection } from "./components/GoalSection";
import { ResearchSection } from "./components/ResearchSection";
import { ResearchFitNext } from "./components/ResearchFitNext";
import { StoryProgress, STORY_STAGES } from "./components/StoryProgress";
import { useLocale } from "./lib/i18n";
import avatarSettings from "../content/avatar.json";

const montserrat = Montserrat({
  subsets: ["latin"],
});

const STORY_IDS = STORY_STAGES.map((s) => s.id);
/** Full deck order including agenda (between home and Projects). */
const DECK_IDS = ["agenda", ...STORY_IDS] as const;

const socialLinks = [
  { label: "GitHub", href: "https://github.com/Fz-a" },
  { label: "Gitee", href: "https://gitee.com/Fz_z" },
];

const STUDIO_TAP_COUNT = 5;
const STUDIO_TAP_WINDOW_MS = 1400;

export default function Home() {
  const { t } = useLocale();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("home");
  const scrollCueRef = useRef<HTMLAnchorElement>(null);
  const cueDotRef = useRef<HTMLSpanElement>(null);
  const cueTextRef = useRef<HTMLSpanElement>(null);
  const homeTapRef = useRef({ count: 0, lastAt: 0 });
  const activeSectionRef = useRef(activeSection);

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  const storyProgressId = STORY_IDS.includes(
    activeSection as (typeof STORY_IDS)[number],
  )
    ? activeSection
    : "";

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

  useEffect(() => {
    const sections = [
      "home",
      "agenda",
      "experience",
      "goal",
      "research",
      "next",
      "contact",
    ]
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

      let current = "home";
      for (const section of sections) {
        if (scrollMarker >= section.offsetTop) {
          current = section.id;
        }
      }
      setActiveSection(current);
    };

    if (cue && cueDot && cueText) {
      gsap.set(cue, { autoAlpha: 1, y: 0, scale: 1 });
      animations.push(
        gsap.to(cue, {
          y: -6,
          duration: 1.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        }),
      );
      animations.push(
        gsap.to(cueDot, {
          scaleY: 0.65,
          transformOrigin: "top center",
          duration: 1.15,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        }),
      );
      animations.push(
        gsap.to(cueText, {
          opacity: 0.55,
          duration: 1.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        }),
      );
    }

    const onScroll = () => {
      updateActiveSection();
      if (!cue) return;
      if (window.scrollY > 36 && !cueHidden) {
        cueHidden = true;
        gsap.to(cue, {
          autoAlpha: 0,
          y: -12,
          scale: 0.94,
          duration: 0.35,
          ease: "power2.out",
        });
      } else if (window.scrollY <= 36 && cueHidden) {
        cueHidden = false;
        gsap.to(cue, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          ease: "power2.out",
        });
      }
    };

    updateActiveSection();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const current = activeSectionRef.current;
      const deckActive = DECK_IDS.includes(
        current as (typeof DECK_IDS)[number],
      )
        ? current
        : current === "home"
          ? "home"
          : "agenda";
      const idx =
        deckActive === "home"
          ? -1
          : DECK_IDS.indexOf(deckActive as (typeof DECK_IDS)[number]);

      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        const next = DECK_IDS[Math.min(Math.max(idx, -1) + 1, DECK_IDS.length - 1)];
        if (next) scrollToSection(next);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        if (idx <= 0) {
          scrollToSection("home");
        } else {
          scrollToSection(DECK_IDS[idx - 1]!);
        }
      } else if (/^[1-4]$/.test(e.key)) {
        const stage = STORY_IDS[Number(e.key) - 1];
        if (stage) scrollToSection(stage);
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      animations.forEach((animation) => animation.kill());
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateActiveSection);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <main
      className={`${montserrat.className} bg-[#F7F1E8] text-[#162b26]`}
    >
      <HomeScrollPreloader />
      <StoryProgress activeId={storyProgressId} onNavigate={scrollToSection} />

      {/* HERO — restored classic intro (Hello / circular portrait / CTAs) */}
      <section id="home" className="story-slide relative bg-[#F7F1E8]">
        <div className="story-slide__body">
        <div className="mx-auto grid h-full w-full max-w-[1160px] flex-1 grid-cols-1 items-center gap-6 px-5 pb-16 pt-[4.5rem] sm:gap-8 sm:px-8 sm:py-10 md:px-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12 lg:px-12 xl:max-w-[1220px] xl:px-14">
          <div className="order-2 mx-auto w-full max-w-[540px] text-left lg:order-1 lg:max-w-none">
            <button
              type="button"
              onClick={onStudioTap}
              className="cursor-default text-left"
            >
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]">
                <span className="hero-name-greeting">
                  <span>{t("hero.hello")}, </span>
                  <span>{t("hero.iam")} </span>
                  <HeroNameFlip />
                </span>
              </p>
              <p className="mt-2 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-[#0F4C45]/60">
                {t("hero.role")}
              </p>
            </button>

            <h1 className="mt-7 whitespace-pre-line text-[2.55rem] font-extrabold leading-[0.95] tracking-tight text-[#162b26] sm:mt-9 sm:text-[3.6rem] lg:text-[4.2rem] xl:text-[4.6rem]">
              {t("hero.headline")}
            </h1>

            <p className="mt-6 max-w-[28rem] text-[1rem] leading-8 text-[#3E514D] sm:text-[1.05rem]">
              {t("hero.blurb")}
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
              <a
                href="#contact"
                onClick={(event) => handleNavClick(event, "#contact")}
                className="cursor-pointer rounded-full bg-[#043439] px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {t("hero.contact")}
              </a>
            </div>
          </div>

          <div className="order-1 flex items-center justify-center lg:order-2">
            <div className="hero-avatar relative aspect-square w-full max-w-[240px] sm:max-w-[340px] lg:max-w-[420px]">
              <div className="hero-avatar__frame relative h-full w-full overflow-hidden rounded-full">
                <Image
                  src={
                    avatarSettings.v
                      ? `${avatarSettings.src}?v=${avatarSettings.v}`
                      : avatarSettings.src
                  }
                  alt="Jason Chen"
                  fill
                  sizes="(max-width: 640px) 240px, 420px"
                  priority
                  className="hero-avatar__img object-cover"
                  style={
                    avatarSettings.source
                      ? undefined
                      : {
                          transform: `translate(${avatarSettings.tx ?? 0}%, ${avatarSettings.ty ?? 0}%) scale(${avatarSettings.scale})`,
                          transformOrigin: "center center",
                        }
                  }
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
            href="#agenda"
            onClick={(event) => handleNavClick(event, "#agenda")}
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

      <AgendaSection onNavigate={scrollToSection} />
      <FeaturedProjects />
      <GoalSection />
      <ResearchSection />
      <ResearchFitNext />

      {/* Contact (+ footer inside same viewport so snap stays aligned) */}
      <section id="contact" className="story-slide bg-[#F7F1E8]">
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
                href="mailto:2260032001@student.must.edu.mo"
                className="text-[0.85rem] font-semibold text-[#0F4C45] underline-offset-4 hover:underline"
              >
                Email
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
              {socialLinks.map((link) => (
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
      </section>
    </main>
  );
}
