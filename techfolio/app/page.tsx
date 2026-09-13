"use client";

import { gsap } from "gsap";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { HomeScrollPreloader } from "./components/HomeScrollPreloader";
import { HeroNameFlip } from "./components/HeroNameFlip";
import { LangSwitch } from "./components/LangSwitch";
import { FeaturedProjects } from "./components/FeaturedProjects";
import { ConnectionSection } from "./components/ConnectionSection";
import { GoalSection } from "./components/GoalSection";
import { ResearchSection } from "./components/ResearchSection";
import { ResearchFitNext } from "./components/ResearchFitNext";
import { StoryProgress, STORY_STAGES } from "./components/StoryProgress";
import { useLocale } from "./lib/i18n";

const montserrat = Montserrat({
  subsets: ["latin"],
});

const STORY_IDS = STORY_STAGES.map((s) => s.id);

const socialLinks = [
  { label: "GitHub", href: "https://github.com/Fz-a" },
  { label: "Gitee", href: "https://gitee.com/Fz_z" },
];

const NAV_SCROLL_OFFSET = 72;
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
    : activeSection === "fit" || activeSection === "contact"
      ? "next"
      : "";

  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (!target) return;

    const scrollRoot = document.scrollingElement ?? document.documentElement;
    const top =
      target.getBoundingClientRect().top +
      scrollRoot.scrollTop -
      NAV_SCROLL_OFFSET;

    scrollRoot.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
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
      "experience",
      "connection",
      "goal",
      "research",
      "fit",
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
      const scrollMarker = window.scrollY + 160;

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
      const storyActive = STORY_IDS.includes(
        current as (typeof STORY_IDS)[number],
      )
        ? current
        : current === "fit" || current === "contact"
          ? "next"
          : "experience";
      const idx = STORY_IDS.indexOf(
        storyActive as (typeof STORY_IDS)[number],
      );

      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        const next = STORY_IDS[Math.min(Math.max(idx, 0) + 1, STORY_IDS.length - 1)];
        scrollToSection(next);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        if (idx <= 0) {
          scrollToSection("home");
        } else {
          scrollToSection(STORY_IDS[idx - 1]);
        }
      } else if (/^[1-5]$/.test(e.key)) {
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
      className={`${montserrat.className} min-h-screen bg-[#F7F1E8] text-[#162b26]`}
    >
      <HomeScrollPreloader />
      <StoryProgress activeId={storyProgressId} onNavigate={scrollToSection} />

      {/* Minimal presentation header */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 safe-pt px-5 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-[1160px] items-center justify-between py-4 sm:py-5">
          <button
            type="button"
            onClick={onStudioTap}
            className="pointer-events-auto cursor-default text-left"
          >
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.2em] text-[#043439]">
              <HeroNameFlip />
            </p>
          </button>
          <div className="pointer-events-auto flex items-center gap-4 sm:gap-6">
            <Link
              href="/archive/"
              className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#0F4C45]/70 transition hover:text-[#043439]"
            >
              {t("nav.archive")} →
            </Link>
            <LangSwitch />
          </div>
        </div>
      </header>

      {/* HERO — not a numbered chapter */}
      <section
        id="home"
        className="relative min-h-[92svh] scroll-mt-10 bg-[#F7F1E8] sm:min-h-[100svh]"
      >
        <div className="mx-auto grid min-h-[calc(92svh-4.5rem)] w-full max-w-[1160px] grid-cols-1 items-center gap-10 px-5 pb-24 pt-[5.5rem] sm:min-h-[calc(100svh-5.5rem)] sm:gap-12 sm:px-8 sm:py-16 md:px-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14 lg:px-12 xl:px-14">
          <div className="order-2 mx-auto w-full max-w-[540px] lg:order-1 lg:max-w-none">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#0F4C45]/65">
              {t("hero.role")}
            </p>

            <h1 className="mt-8 whitespace-pre-line text-[2.6rem] font-extrabold leading-[0.94] tracking-tight text-[#162b26] sm:mt-10 sm:text-[3.8rem] lg:text-[4.4rem] xl:text-[4.8rem]">
              {t("hero.headline")}
            </h1>

            <p className="mt-7 max-w-[28rem] text-[1rem] leading-8 text-[#3E514D] sm:text-[1.05rem]">
              {t("hero.blurb")}
            </p>

            <p className="mt-8 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#0F4C45]/55">
              {(
                [
                  "hero.chip.electronics",
                  "hero.chip.embedded",
                  "hero.chip.robotics",
                  "hero.chip.ai",
                ] as const
              )
                .map((key) => t(key))
                .join(" · ")}
            </p>
          </div>

          <div className="order-1 flex items-center justify-center lg:order-2">
            <div className="relative aspect-[4/5] w-full max-w-[280px] overflow-hidden bg-[#E8E2D8] sm:max-w-[340px] lg:max-w-[400px]">
              <Image
                src="/experience/work/zongheng/rtk-field.webp"
                alt="Engineering field systems"
                fill
                sizes="(max-width: 640px) 280px, 400px"
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center sm:bottom-12">
          <a
            ref={scrollCueRef}
            href="#experience"
            onClick={(event) => handleNavClick(event, "#experience")}
            className="pointer-events-auto flex cursor-pointer flex-col items-center gap-2.5 text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]/55 transition"
          >
            <span
              ref={cueDotRef}
              className="block h-8 w-px bg-[#0F4C45]/30"
            />
            <span ref={cueTextRef}>{t("hero.scroll")}</span>
          </a>
        </div>
      </section>

      <FeaturedProjects />
      <ConnectionSection />
      <GoalSection />
      <ResearchSection />
      <ResearchFitNext />

      {/* Minimal contact — not a major section */}
      <section
        id="contact"
        className="scroll-mt-24 border-t border-[#0F4C45]/10 bg-[#F7F1E8] pb-14 pt-12 sm:pb-16 sm:pt-14"
      >
        <div className="mx-auto w-full max-w-[1100px] px-6 text-center sm:px-8 md:px-10 lg:px-12 xl:max-w-[1160px] xl:px-14">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]/50">
            Jason Chen
          </p>
          <p className="mt-2 text-[1rem] font-extrabold tracking-tight text-[#162b26]">
            {t("hero.role")}
          </p>
          <p className="mt-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#0F4C45]/50">
            {(
              [
                "hero.chip.electronics",
                "hero.chip.embedded",
                "hero.chip.robotics",
                "hero.chip.ai",
              ] as const
            )
              .map((key) => t(key))
              .join(" · ")}
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-5">
            <a
              href="mailto:2260032001@student.must.edu.mo"
              className="text-[0.85rem] font-semibold text-[#0F4C45] underline-offset-4 hover:underline"
            >
              Email
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
        </div>
      </section>

      <footer className="border-t border-[#0F4C45]/08 bg-[#F7F1E8]">
        <div className="mx-auto flex w-full max-w-[1100px] justify-center px-6 py-6 text-center sm:px-8">
          <p className="text-[0.72rem] font-medium tracking-[0.04em] text-[#6B7B77]">
            © 2026 Jason Chen
          </p>
        </div>
      </footer>
    </main>
  );
}
