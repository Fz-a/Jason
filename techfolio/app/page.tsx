"use client";

import { gsap } from "gsap";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { HomeScrollPreloader } from "./components/HomeScrollPreloader";
import { JourneyHub } from "./components/JourneyHub";
import { HeroNameFlip } from "./components/HeroNameFlip";

const montserrat = Montserrat({
  subsets: ["latin"],
});

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/Fz-a",
  },
  {
    label: "Gitee",
    href: "https://gitee.com/Fz_z",
  },
  {
    label: "CSDN",
    href: "https://blog.csdn.net/weixin_63844594",
  },
];

function GitHubIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
    >
      <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.88-2.78.62-3.37-1.2-3.37-1.2-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.09 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.71.12 2.51.36 1.91-1.32 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.71 1.03 1.62 1.03 2.74 0 3.96-2.34 4.82-4.57 5.08.36.32.69.95.69 1.92 0 1.39-.01 2.5-.01 2.84 0 .27.18.6.69.49A10.25 10.25 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function GiteeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[1.05rem] w-[1.05rem]"
      fill="currentColor"
    >
      <path d="M11.984 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.016 0zm6.09 5.333c.328 0 .593.266.592.593v1.482a.594.594 0 0 1-.593.592H9.777c-.982 0-1.778.796-1.778 1.778v5.63c0 .327.266.592.593.592h5.63c.982 0 1.778-.796 1.778-1.778v-.296a.593.593 0 0 0-.592-.593h-4.15a.592.592 0 0 1-.592-.592v-1.482a.593.593 0 0 1 .593-.592h6.815c.327 0 .593.265.593.592v3.408a4 4 0 0 1-4 4H5.926a.593.593 0 0 1-.593-.593V9.778a4.444 4.444 0 0 1 4.445-4.444h8.296Z" />
    </svg>
  );
}

function CSDNIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[1.05rem] w-[1.05rem]"
      fill="currentColor"
    >
      <path d="M4.693 13.638c-.497.568-1.363.63-1.712.63-.648 0-1.144-.164-1.474-.488-.313-.307-.478-.76-.489-1.346-.025-1.358.744-2.762 2.074-2.762.635 0 1.124.455 1.311.644a.337.337 0 0 0 .282.099.38.38 0 0 0 .241-.159c.068-.087.135-.237.138-.401s-.057-.344-.243-.49a2.642 2.642 0 0 0-1.668-.591c-.819 0-1.627.376-2.218 1.033-.621.691-.953 1.63-.935 2.646.015.815.282 1.5.773 1.982.528.518 1.3.791 2.235.791 1.097 0 1.776-.325 2.154-.597a.584.584 0 0 0 .24-.456.702.702 0 0 0-.208-.497c-.23-.248-.448-.101-.503-.037ZM9.663 11.488a7.471 7.471 0 0 0-.698-.248c-.157-.048-.309-.091-.45-.131-.922-.26-1.027-.5-1.017-.68.022-.363.515-.853 1.352-.792.607.045 1.015.509 1.205.781.149.214.371.135.434.095a.602.602 0 0 0 .309-.514.626.626 0 0 0-.209-.488 2.654 2.654 0 0 0-3.347-.273c-.456.323-.744.772-.77 1.202-.064 1.061 1.015 1.366 1.803 1.588.214.061.429.127.667.202 1.14.357 1.173.717 1.092 1.267-.082.556-.696.834-1.685.761-1.029-.076-1.464-.61-1.612-.901-.05-.098-.205-.248-.413-.156-.514.229-.473.731-.26.993.339.416 1.15 1.035 2.667 1.035 1.734 0 2.255-.875 2.378-1.64.092-.572-.022-1.028-.348-1.396-.236-.267-.592-.495-1.101-.706ZM16.44 9.323c-.598-.431-1.393-.61-2.36-.532-.712.058-1.274.243-1.335.263l-.006.002a.437.437 0 0 0-.297.379l-.47 5.201a.337.337 0 0 0 .247.35l.072.02.066.018.086.021a7.914 7.914 0 0 0 1.64.183c.972 0 1.765-.23 2.36-.684.764-.583 1.141-1.5 1.118-2.725-.021-1.135-.398-1.974-1.121-2.495Zm-.662 4.461c-.836.639-2.09.562-2.677.481a.128.128 0 0 1-.109-.137l.397-4.248a.113.113 0 0 1 .086-.1c.999-.241 1.777-.168 2.312.218.189.137.348.331.471.568.176.339.277.765.286 1.234.017.916-.24 1.583-.765 1.984ZM23.967 10.41a1.92 1.92 0 0 0-.432-.919c-.399-.465-1.029-.689-1.848-.689-.734 0-1.372.228-1.947.799.007-.086.019-.159.018-.223s-.017-.116-.066-.163c-.048-.045-.077-.067-.127-.077-.05-.01-.122-.008-.256-.006a.587.587 0 0 0-.589.54s-.325 3.874-.428 5.165a.308.308 0 0 0 .073.228.36.36 0 0 0 .26.131h.387a.224.224 0 0 0 .226-.205l.273-2.929.014-.147a1.902 1.902 0 0 1 .082-.412c.014-.045.03-.092.047-.14.245-.694.803-1.72 1.971-1.694.84.018 1.449.455 1.385 1.114-.101 1.034-.266 3.1-.358 4.14-.019.209.182.273.252.273h.304a.442.442 0 0 0 .444-.404s.185-2.127.294-3.352l.048-.532a1.959 1.959 0 0 0-.026-.5Z" />
    </svg>
  );
}

function SocialIcon({ label }: { label: string }) {
  switch (label) {
    case "GitHub":
      return <GitHubIcon />;
    case "Gitee":
      return <GiteeIcon />;
    case "CSDN":
      return <CSDNIcon />;
    default:
      return null;
  }
}

function EmailIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6.5h16v11H4z" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
    >
      <path d="M12 2.75A6.25 6.25 0 0 0 5.75 9c0 4.35 5.18 10.72 5.4 10.99a1.1 1.1 0 0 0 1.7 0c.22-.27 5.4-6.64 5.4-10.99A6.25 6.25 0 0 0 12 2.75Zm0 8.9A2.65 2.65 0 1 1 12 6.35a2.65 2.65 0 0 1 0 5.3Z" />
    </svg>
  );
}

const NAV_SCROLL_OFFSET = 72;

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const scrollCueRef = useRef<HTMLAnchorElement>(null);
  const cueDotRef = useRef<HTMLSpanElement>(null);
  const cueTextRef = useRef<HTMLSpanElement>(null);

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
    href: string
  ) => {
    if (!href.startsWith("#")) return;
    event.preventDefault();
    scrollToSection(href.slice(1));
  };

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash || !document.getElementById(hash)) return;
    const timer = window.setTimeout(() => scrollToSection(hash), 100);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const homeSection = document.getElementById("home");
    const aboutSection = document.getElementById("about");
    const contactSection = document.getElementById("contact");

    const cue = scrollCueRef.current;
    const cueDot = cueDotRef.current;
    const cueText = cueTextRef.current;
    const animations: gsap.core.Animation[] = [];
    let cueHidden = false;

    const updateActiveSection = () => {
      const nearPageBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 32;
      const scrollMarker = window.scrollY + 140;

      if (
        nearPageBottom ||
        (contactSection && scrollMarker >= contactSection.offsetTop)
      ) {
        setActiveSection("contact");
        return;
      }

      if (aboutSection && scrollMarker >= aboutSection.offsetTop) {
        setActiveSection("about");
        return;
      }

      if (homeSection) {
        setActiveSection("home");
      }
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
        })
      );

      animations.push(
        gsap.to(cueDot, {
          scaleY: 0.65,
          transformOrigin: "top center",
          duration: 1.15,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        })
      );

      animations.push(
        gsap.to(cueText, {
          opacity: 0.55,
          duration: 1.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        })
      );
    }

    const onScroll = () => {
      updateActiveSection();

      if (!cue) {
        return;
      }

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

    return () => {
      animations.forEach((animation) => animation.kill());
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  return (
    <main
      className={`${montserrat.className} min-h-screen bg-[#F7F1E8] text-[#162b26]`}
    >
      <HomeScrollPreloader />
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 safe-pt px-3 sm:px-6 sm:pt-5 lg:px-8">
        <div className="pointer-events-auto mx-auto flex max-w-[calc(100vw-1.5rem)] justify-center sm:max-w-none">
          <div className="nav-scroll max-w-full overflow-x-auto rounded-full border border-[#0F4C45]/15 bg-[#F7F1E8]/92 p-1 shadow-[0_14px_40px_rgba(22,43,38,0.08)] backdrop-blur-md sm:p-1.5">
            <nav aria-label="Primary">
              <ul className="flex w-max items-center gap-0.5 sm:gap-1">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={(event) => handleNavClick(event, item.href)}
                      className={`block cursor-pointer rounded-full px-3 py-1.5 text-[0.72rem] font-semibold transition sm:px-4.5 sm:py-2.5 sm:text-[0.83rem] lg:px-5 lg:py-2.5 lg:text-[0.88rem] ${
                        activeSection === item.href.slice(1)
                          ? "bg-[#043439] text-white shadow-[0_10px_24px_rgba(4,52,57,0.22)]"
                          : "text-[#0F4C45] hover:bg-[#0F4C45]/8"
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <section
        id="home"
        className="relative min-h-[100svh] scroll-mt-10 bg-[#F7F1E8] sm:min-h-screen sm:scroll-mt-14"
      >
        <div className="mx-auto grid min-h-[calc(100svh-5rem)] w-full max-w-[1160px] grid-cols-1 items-center gap-6 px-5 pb-24 pt-[4.75rem] sm:min-h-[calc(100vh-5.5rem)] sm:gap-8 sm:px-8 sm:py-10 md:px-10 md:py-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8 lg:px-12 lg:py-10 xl:max-w-[1220px] xl:gap-10 xl:px-14">
          <div className="order-2 mx-auto w-full max-w-[420px] text-left lg:order-1">
            <div className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-[#0F4C45] sm:text-[0.74rem] sm:tracking-[0.28em] lg:text-[0.8rem]">
              <p>Electronic Engineer</p>
              <p className="mt-1 tracking-[0.18em] sm:tracking-[0.22em]">
                AI · Robotics · Intelligent Hardware
              </p>
            </div>

            <h1 className="text-[1.95rem] font-extrabold leading-[0.95] tracking-tight sm:text-[2.9rem] md:text-[3.5rem] lg:text-[3.9rem] xl:text-[4.35rem]">
              <span className="block">Hello</span>
              <span className="hero-name-greeting">
                I am <HeroNameFlip />
              </span>
            </h1>

            <p className="mt-4 max-w-[28rem] text-[0.92rem] leading-7 text-[#3E514D] sm:mt-5 sm:text-[0.96rem] lg:text-[1rem] lg:leading-[1.9rem]">
              I turn ideas into real-world products through hardware, software,
              AI, and robotics.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5 sm:mt-7 sm:gap-3">
              <a
                href="/Jason-Chen-Resume.pdf"
                download="Jason-Chen-Resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[#043439] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 sm:px-6 lg:px-7 lg:py-3 lg:text-[0.92rem]"
              >
                Download Resume
              </a>

              <a
                href="#contact"
                onClick={(event) => handleNavClick(event, "#contact")}
                className="cursor-pointer rounded-full border border-[#0F4C45] px-5 py-2.5 text-sm font-semibold text-[#0F4C45] transition hover:bg-[#0F4C45] hover:text-white sm:px-6 lg:px-7 lg:py-3 lg:text-[0.92rem]"
              >
                Contact Me
              </a>
            </div>

            <div className="mt-4 flex items-center gap-2.5">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#0F4C45]/15 bg-[#F7F1E8] text-[#0F4C45] transition hover:-translate-y-0.5 hover:border-[#0F4C45]/25 hover:bg-[#0F4C45] hover:text-white"
                >
                  <SocialIcon label={link.label} />
                </a>
              ))}
            </div>
          </div>

          <div className="order-1 flex items-center justify-center lg:order-2">
            <div className="relative aspect-square w-full max-w-[220px] overflow-hidden rounded-full bg-white drop-shadow-xl sm:max-w-[380px] md:max-w-[460px] lg:max-w-[560px] xl:max-w-[620px]">
              <div className="absolute inset-x-0 bottom-0 flex justify-center">
                <Image
                  src="/avatar2.png"
                  alt="Jason Chen"
                  width={1024}
                  height={1024}
                  priority
                  className="aspect-square w-[90%] object-cover object-[center_18%]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center sm:bottom-16">
          <a
            ref={scrollCueRef}
            href="#about"
            onClick={(event) => handleNavClick(event, "#about")}
            className="pointer-events-auto flex cursor-pointer flex-col items-center gap-2.5 text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]/72 transition"
          >
            <span
              ref={cueDotRef}
              className="block h-8 w-px bg-[#0F4C45]/35"
            />
            <span ref={cueTextRef}>Scroll</span>
          </a>
        </div>
      </section>

      <section
        id="about"
        className="scroll-mt-10 bg-[#F7F1E8] pb-16 pt-8 sm:scroll-mt-14 sm:pb-20 sm:pt-10 lg:pb-24 lg:pt-14"
      >
        <div className="mx-auto w-full max-w-[1100px] px-6 sm:px-8 md:px-10 lg:px-12 xl:max-w-[1160px] xl:px-14">
          <JourneyHub />
        </div>
      </section>

      <section
        id="contact"
        className="scroll-mt-10 bg-[#F7F1E8] pb-16 pt-7 sm:scroll-mt-14 sm:pb-20 sm:pt-9 lg:pb-24 lg:pt-12"
      >
        <div className="mx-auto grid w-full max-w-[1100px] grid-cols-1 gap-8 px-6 sm:px-8 md:px-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(260px,0.6fr)] lg:gap-12 lg:px-12 xl:max-w-[1160px] xl:gap-14 xl:px-14">
          <div className="max-w-[610px]">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#0F4C45] sm:text-[0.74rem] lg:text-[0.78rem]">
              Contact
            </p>

            <h2 className="mt-3.5 max-w-[10ch] text-[1.75rem] font-extrabold leading-[0.97] tracking-tight sm:text-[2.15rem] lg:text-[2.55rem]">
              Let’s build something thoughtful.
            </h2>

            <p className="mt-4 max-w-[31rem] text-[0.88rem] leading-6.5 text-[#3E514D] lg:text-[0.94rem] lg:leading-[1.72rem]">
              I’m always interested in opportunities involving intelligent
              hardware, embedded systems, robotics, and hands-on making — and in
              conversations that help those ideas grow.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <a
                href="mailto:2260032001@student.must.edu.mo"
                className="rounded-full bg-[#043439] px-5 py-2 text-[0.82rem] font-semibold text-white transition hover:opacity-90 lg:px-6 lg:py-2.5 lg:text-[0.88rem]"
              >
                Email Me
              </a>
            </div>
          </div>

          <aside className="lg:pt-5">
            <div className="rounded-[1.15rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-4.5 shadow-[0_16px_34px_rgba(22,43,38,0.05)] sm:p-5">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#0F4C45] sm:text-[0.74rem]">
                Connect
              </p>

              <div className="mt-5 space-y-4 text-[#162b26]">
                <div className="flex items-start gap-3">
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#0F4C45]/12 bg-[#F7F1E8] text-[#0F4C45]">
                    <EmailIcon />
                  </span>

                  <div>
                    <p className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[#6B7B77]">
                      Email
                    </p>
                    <a
                      href="mailto:2260032001@student.must.edu.mo"
                      className="mt-1.5 block text-[0.9rem] font-semibold text-[#162b26] transition hover:text-[#0F4C45] sm:text-[0.95rem]"
                    >
                      2260032001@student.must.edu.mo
                    </a>
                    <a
                      href="mailto:1106467336@qq.com"
                      className="mt-1.5 block text-[0.9rem] font-semibold text-[#162b26] transition hover:text-[#0F4C45] sm:text-[0.95rem]"
                    >
                      1106467336@qq.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#0F4C45]/12 bg-[#F7F1E8] text-[#0F4C45]">
                    <LocationIcon />
                  </span>

                  <div>
                  <p className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[#6B7B77]">
                    Location
                  </p>
                  <p className="mt-1.5 text-[0.9rem] font-semibold sm:text-[0.95rem]">
                    Foshan, Guangdong
                  </p>
                  </div>
                </div>

                <div className="border-t border-[#0F4C45]/10 pt-4">
                  <p className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[#6B7B77]">
                    Profiles
                  </p>

                  <div className="mt-3 flex items-center gap-2.5">
                    {socialLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={link.label}
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#0F4C45]/12 bg-[#F7F1E8] text-[#0F4C45] transition hover:-translate-y-0.5 hover:bg-[#0F4C45] hover:text-white"
                      >
                        <SocialIcon label={link.label} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <footer className="border-t border-[#0F4C45]/10 bg-[#F7F1E8]">
        <div className="mx-auto flex w-full max-w-[1100px] justify-center px-6 py-6 text-center sm:px-8 md:px-10 lg:px-12 xl:max-w-[1160px] xl:px-14">
          <p className="text-[0.72rem] font-medium tracking-[0.04em] text-[#6B7B77] sm:text-[0.78rem]">
            © 2026 Brittne Valdivia. Built with Next.js and Tailwind CSS.
          </p>
        </div>
      </footer>
    </main>
  );
}
