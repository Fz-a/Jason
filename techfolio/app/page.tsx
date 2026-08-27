"use client";

import { gsap } from "gsap";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { HeroNameFlip } from "./components/HeroNameFlip";

const montserrat = Montserrat({
  subsets: ["latin"],
});

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/brittnebaila",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/brittnedanielle/",
  },
];

const aboutTitle = "Exploration, immersion, and execution.";

const aboutContent = {
  en: {
    paragraphs: [
      "During my undergraduate studies in Electronic Information Engineering at Guangzhou Software Institute, I ranked in the top 5% of my major with a 3.3 GPA. Beyond coursework in circuit analysis, analog electronics, and embedded systems, I led student teams on projects from elderly-friendly smart apparel to ROS-based early fire-warning systems—handling embedded hardware, PCB design, firmware, and cross-disciplinary coordination. Our teams earned more than 20 national and provincial awards.",
      "Through internships, I gradually moved closer to real product development. At Guangzhou Zongheng Intelligent Technology, I independently designed a 2.4G remote for an AGV payload vehicle and contributed to smart greenhouse hardware. At Shenzhen Moore Creative Technology, I worked on software-hardware interaction systems using TouchDesigner and sensor integration. At Guangzhou CVTE, I focused on display PCB layout in Altium Designer, including high-speed routing and impedance matching.",
      "After graduating, I joined Guangzhou Zongheng Intelligent Technology as an electronics engineer, working on RTK high-precision positioning modules, AGV mobile platforms, and AI interaction devices. My work spans schematic and PCB design, prototyping, debugging, and structural validation with Fusion 360 and 3D printing, often carrying products from requirements through functional prototypes. This industry experience strengthened my execution and system integration skills, and clarified my next step: pursuing graduate study in intelligent hardware under faculty mentorship.",
    ],
  },
  zhHans: {
    paragraphs: [
      "本科就读于广州软件学院电子信息工程专业，GPA 3.3，专业排名前 5%。除电路分析、模拟电子技术、嵌入式系统等课程学习外，我带领团队完成适老化智能服饰、基于 ROS 的早期火灾预警系统等项目，负责嵌入式硬件、PCB 设计、固件开发与跨学科协调。还曾担任无人机工作站宣传负责人，团队累计获 20 余项国家级、省级奖项。",
      "通过实习，我逐步接近真实产品开发。在广州纵横智能技术有限公司，独立完成 AGV 载重小车 2.4G 遥控器设计，并参与智慧农业大棚硬件开发。在深圳摩尔创展科技有限公司，使用 TouchDesigner 及传感器集成，参与软硬件交互系统研发。在广州视源电子科技股份有限公司，专注 Altium Designer 显示屏电路板 Layout，掌握高速线、阻抗匹配及 SMT 规范。",
      "毕业后入职广州纵横智能技术有限公司担任电子工程师，参与 RTK 高精度定位模块、AGV 移动平台及 AI 交互设备等研发。工作涵盖原理图与 PCB 设计、器件选型、打样调试，以及 Fusion 360 与 3D 打印的结构验证，常负责从需求到可用原型的完整流程。这段产业经历强化了执行力与系统集成能力，也让我更明确下一步：在导师指导下攻读研究生，在智能硬件方向建立更扎实的科研基础。",
    ],
  },
  zhHant: {
    paragraphs: [
      "本科就讀於廣州軟件學院電子信息工程專業，GPA 3.3，專業排名前 5%。除電路分析、模擬電子技術、嵌入式系統等課程學習外，我帶領團隊完成適老化智能服飾、基於 ROS 的早期火災預警系統等項目，負責嵌入式硬件、PCB 設計、固件開發與跨學科協調。還曾擔任無人機工作站宣傳負責人，團隊累計獲 20 餘項國家級、省級獎項。",
      "通過實習，我逐步接近真實產品開發。在廣州縱橫智能技術有限公司，獨立完成 AGV 載重小車 2.4G 遙控器設計，並參與智慧農業大棚硬件開發。在深圳摩爾創展科技有限公司，使用 TouchDesigner 及傳感器集成，參與軟硬件交互系統研發。在廣州視源電子科技股份有限公司，專注 Altium Designer 顯示屏電路板 Layout，掌握高速線、阻抗匹配及 SMT 規範。",
      "畢業後入職廣州縱橫智能技術有限公司擔任電子工程師，參與 RTK 高精度定位模組、AGV 移動平台及 AI 交互設備等研發。工作涵蓋原理圖與 PCB 設計、器件選型、打樣調試，以及 Fusion 360 與 3D 打印的結構驗證，常負責從需求到可用原型的完整流程。這段產業經歷強化了執行力與系統集成能力，也讓我更明確下一步：在導師指導下攻讀研究生，在智能硬件方向建立更紮實的科研基礎。",
    ],
  },
} as const;

type AboutLang = keyof typeof aboutContent;

const aboutLangOptions: { id: AboutLang; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "zhHant", label: "繁" },
  { id: "zhHans", label: "简" },
];

const projectsTitle = "Mind and Hand.";
const projectsSubtitle = (
  <>
    Knowing and building in equal measure —
    <br />
    guided by systems thinking, driven by hands-on iteration, and bound by one
    rule:
    <br />
    understanding only matters when it survives contact with real hardware.
  </>
);

const experienceCards = [
  {
    title: "University",
    summary:
      "Electronic Information Engineering at Guangzhou Software Institute, top 5%. Led teams on smart wearables and ROS fire-warning systems—PCB, firmware, and pitch decks included. 20+ national and provincial awards.",
    tags: ["Embedded", "PCB", "ROS", "Awards"],
  },
  {
    title: "Work",
    summary:
      "Internships at Zongheng, Moore, and CVTE, now full-time on RTK, AGV, and AI devices—from schematic and layout to bring-up and structural checks.",
    tags: ["RTK", "AGV", "Altium", "Prototyping"],
  },
  {
    title: "Society",
    summary:
      "20+ volunteer sessions, Maker Faire and maker spaces, and campus roles in drone outreach and safety teams—bringing people closer to hardware.",
    tags: ["Volunteering", "Maker", "Campus", "Outreach"],
  },
  {
    title: "Skills",
    summary:
      "Altium, embedded development, ROS, Fusion 360, TouchDesigner, and AI-assisted workflows. I also share what I learn on GitHub and CSDN.",
    tags: ["Hardware", "Firmware", "AI Tools", "Writing"],
  },
] as const;

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

function LinkedInIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
    >
      <path d="M6.94 8.5a1.72 1.72 0 1 1 0-3.44 1.72 1.72 0 0 1 0 3.44ZM8.5 18.5H5.38V9.63H8.5v8.87ZM18.62 18.5H15.5v-4.32c0-1.03-.02-2.36-1.44-2.36-1.44 0-1.66 1.13-1.66 2.29v4.39H9.28V9.63h2.99v1.21h.04c.42-.79 1.43-1.62 2.95-1.62 3.15 0 3.73 2.08 3.73 4.79v4.49ZM20.18 2H3.82A1.8 1.8 0 0 0 2 3.79v16.42C2 21.2 2.8 22 3.79 22h16.39A1.8 1.8 0 0 0 22 20.21V3.79A1.8 1.8 0 0 0 20.18 2Z" />
    </svg>
  );
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

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [aboutLang, setAboutLang] = useState<AboutLang>("en");
  const scrollCueRef = useRef<HTMLAnchorElement>(null);
  const cueDotRef = useRef<HTMLSpanElement>(null);
  const cuePebbleRef = useRef<HTMLSpanElement>(null);
  const cueTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const homeSection = document.getElementById("home");
    const aboutSection = document.getElementById("about");
    const projectsSection = document.getElementById("projects");
    const contactSection = document.getElementById("contact");

    const cue = scrollCueRef.current;
    const cueDot = cueDotRef.current;
    const cuePebble = cuePebbleRef.current;
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

      if (projectsSection && scrollMarker >= projectsSection.offsetTop) {
        setActiveSection("projects");
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

    if (cue && cueDot && cuePebble && cueText) {
      gsap.set(cue, { autoAlpha: 1, y: 0, scale: 1 });

      animations.push(
        gsap.to(cue, {
          y: -8,
          duration: 1.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        })
      );

      animations.push(
        gsap.to(cueDot, {
          y: 11,
          duration: 1.15,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        })
      );

      animations.push(
        gsap.to(cuePebble, {
          x: 4,
          y: 2,
          rotation: 10,
          duration: 1.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
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
      className={`${montserrat.className} min-h-screen overflow-x-hidden bg-[#F7F1E8] text-[#162b26]`}
    >
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-5 lg:px-8">
        <div className="mx-auto flex w-fit items-center justify-center rounded-full border border-[#0F4C45]/15 bg-[#F7F1E8]/92 p-1.5 shadow-[0_14px_40px_rgba(22,43,38,0.08)] backdrop-blur-md">
          <nav aria-label="Primary">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`block rounded-full px-4 py-2 text-[0.8rem] font-semibold transition sm:px-4.5 sm:py-2.5 sm:text-[0.83rem] lg:px-5 lg:py-2.5 lg:text-[0.88rem] ${
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
      </header>

      <section
        id="home"
        className="relative min-h-screen scroll-mt-10 bg-[#F7F1E8] sm:scroll-mt-14"
      >
        <div className="mx-auto grid min-h-[calc(100vh-5.5rem)] w-full max-w-[1160px] grid-cols-1 items-center gap-8 px-6 pb-8 pt-20 sm:px-8 sm:py-10 md:px-10 md:py-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8 lg:px-12 lg:py-10 xl:max-w-[1220px] xl:gap-10 xl:px-14">
          <div className="mx-auto w-full max-w-[420px] text-left">
            <div className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45] sm:text-[0.74rem] lg:text-[0.8rem]">
              <p>Electronic Engineer</p>
              <p className="mt-1 tracking-[0.22em]">
                AI · Robotics · Intelligent Hardware
              </p>
            </div>

            <h1 className="text-[2.15rem] font-extrabold leading-[0.95] tracking-tight sm:text-[2.9rem] md:text-[3.5rem] lg:text-[3.9rem] xl:text-[4.35rem]">
              <span className="block">Hello</span>
              <span className="hero-name-greeting">
                I am <HeroNameFlip />
              </span>
            </h1>

            <p className="mt-5 max-w-[28rem] text-[0.96rem] leading-7 text-[#3E514D] lg:text-[1rem] lg:leading-[1.9rem]">
              I turn ideas into real-world products through hardware, software,
              AI, and robotics.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="/Brittne%20Valdivia%20-%202026%20SWE%20Resume.docx"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[#043439] px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 lg:px-7 lg:py-3 lg:text-[0.92rem]"
              >
                Download Resume
              </a>

              <a
                href="#contact"
                className="rounded-full border border-[#0F4C45] px-6 py-2.5 text-sm font-semibold text-[#0F4C45] transition hover:bg-[#0F4C45] hover:text-white lg:px-7 lg:py-3 lg:text-[0.92rem]"
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
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#0F4C45]/15 bg-[#F7F1E8] text-[#0F4C45] transition hover:-translate-y-0.5 hover:border-[#0F4C45]/25 hover:bg-[#0F4C45] hover:text-white"
                >
                  {link.label === "GitHub" ? <GitHubIcon /> : <LinkedInIcon />}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Image
              src="/avatar2.png"
              alt="Jason Chen"
              width={1500}
              height={1414}
              priority
              className="h-auto w-full max-w-[300px] object-contain drop-shadow-xl transition-transform sm:max-w-[380px] md:max-w-[460px] lg:max-w-[560px] xl:max-w-[620px]"
            />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-12 flex justify-center sm:bottom-16">
          <a
            ref={scrollCueRef}
            href="#about"
            className="pointer-events-auto flex flex-col items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]/72 transition"
          >
            <span className="relative flex h-10 w-8 items-start justify-center">
              <span className="absolute top-0 h-6 w-6 rounded-full bg-[#0F4C45]" />
              <span className="absolute top-[0.8rem] h-4.5 w-4.5 rounded-full bg-[#F7F1E8]" />
              <span className="absolute bottom-[0.15rem] h-4.5 w-4.5 rotate-45 rounded-[0.25rem] bg-[#0F4C45]" />
              <span
                ref={cueDotRef}
                className="absolute bottom-0 h-2 w-2 rounded-full bg-[#0F4C45]/20 blur-[1px]"
              />
            </span>
            <span ref={cueTextRef}>Scroll</span>
          </a>
        </div>
      </section>

      <section
        id="about"
        className="scroll-mt-10 bg-[#F7F1E8] pb-16 pt-7 sm:scroll-mt-14 sm:pb-20 sm:pt-9 lg:pb-24 lg:pt-12"
      >
        <div className="mx-auto flex w-full max-w-[1100px] justify-center px-6 sm:px-8 md:px-10 lg:px-12 xl:max-w-[1160px] xl:px-14">
          <div className="relative w-full max-w-[860px] rounded-[1.15rem] border border-[#0F4C45]/12 bg-[#DDE7DE] p-5 text-center shadow-[0_16px_34px_rgba(22,43,38,0.06)] sm:p-6 lg:p-7">
            <div
              className="absolute right-4 top-4 sm:right-5 sm:top-5 lg:right-6 lg:top-6"
              role="group"
              aria-label="About language"
            >
              <div className="inline-flex rounded-full border border-[#0F4C45]/15 bg-[#F7F1E8]/90 p-0.5 text-[0.62rem] font-semibold shadow-sm backdrop-blur-sm sm:text-[0.68rem]">
                {aboutLangOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setAboutLang(option.id)}
                    aria-pressed={aboutLang === option.id}
                    className={`rounded-full px-2 py-1 transition sm:px-2.5 ${
                      aboutLang === option.id
                        ? "bg-[#043439] text-white shadow-[0_6px_14px_rgba(4,52,57,0.18)]"
                        : "text-[#0F4C45] hover:bg-[#0F4C45]/8"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#0F4C45] sm:text-[0.74rem] lg:text-[0.78rem]">
              About
            </p>

            <h2 className="mx-auto mt-3.5 max-w-[12ch] text-[1.75rem] font-extrabold leading-[0.97] tracking-tight sm:text-[2.15rem] lg:text-[2.55rem]">
              {aboutTitle}
            </h2>

            <div
              className={`mt-5 space-y-4 text-[0.88rem] leading-6.5 text-[#3E514D] lg:text-[0.94rem] lg:leading-[1.72rem] ${
                aboutLang !== "en" ? "about-section-card__body--zh" : ""
              }`}
            >
              {aboutContent[aboutLang].paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="projects"
        className="scroll-mt-10 bg-[#DDE7DE] pb-20 pt-10 sm:scroll-mt-14 sm:pb-24 sm:pt-12 lg:pb-28 lg:pt-16"
      >
        <div className="mx-auto w-full max-w-[1060px] px-6 sm:px-8 md:px-10 lg:px-10 xl:max-w-[1320px] xl:px-12">
          <div className="max-w-[780px]">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45] sm:text-[0.78rem] lg:text-[0.82rem]">
              Projects
            </p>

            <h2 className="mt-4 whitespace-nowrap text-[2rem] font-extrabold leading-[0.96] tracking-tight sm:text-[2.5rem] lg:text-[3rem]">
              {projectsTitle}
            </h2>

            <p className="mt-5 text-[0.95rem] leading-7 text-[#3E514D] lg:text-[1rem] lg:leading-[1.85rem]">
              {projectsSubtitle}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 lg:mt-10 lg:gap-4 xl:gap-4">
            {experienceCards.map((card) => (
              <article
                key={card.title}
                className="group block w-full rounded-[1.05rem] border border-[#0F4C45]/12 bg-[#F7F1E8] p-3.5 text-center shadow-[0_14px_28px_rgba(22,43,38,0.05)] transition duration-200 hover:-translate-y-1 hover:border-[#0F4C45]/22 hover:shadow-[0_18px_34px_rgba(22,43,38,0.08)] sm:p-4"
              >
                <div className="mb-3 overflow-hidden rounded-[0.9rem] bg-[#EEF3EE]">
                  <div className="relative flex h-[120px] items-center justify-center sm:h-[140px] xl:h-[155px]">
                    <span className="text-[2rem] font-extrabold tracking-tight text-[#0F4C45]/28 transition-colors duration-200 group-hover:text-[#0F4C45]/42 sm:text-[2.35rem]">
                      {card.title}
                    </span>
                  </div>
                </div>

                <h3 className="text-[0.95rem] font-extrabold tracking-tight text-[#162b26] transition-colors duration-200 group-hover:text-[#0F4C45] sm:text-[1rem]">
                  {card.title}
                </h3>
                <p className="mt-2 text-[0.72rem] leading-5 text-[#3E514D] sm:text-[0.76rem]">
                  {card.summary}
                </p>

                <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#0F4C45]/15 bg-[#F7F1E8] px-2 py-1 text-[0.62rem] font-semibold text-[#0F4C45] sm:text-[0.66rem]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
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
              I’m always interested in opportunities involving front-end
              development, user-focused design, accessibility, and creative
              digital problem-solving.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <a
                href="mailto:brittnebaila@gmail.com"
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
                    href="mailto:brittnebaila@gmail.com"
                    className="mt-1.5 inline-block text-[0.9rem] font-semibold text-[#162b26] transition hover:text-[#0F4C45] sm:text-[0.95rem]"
                  >
                    brittnebaila@gmail.com
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
                    Bellevue, WA
                  </p>
                  </div>
                </div>

                <div className="border-t border-[#0F4C45]/10 pt-4">
                  <p className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[#6B7B77]">
                    Profiles
                  </p>

                  <div className="mt-3 flex items-center gap-2.5">
                    <a
                      href="https://github.com/brittnebaila"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="GitHub"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-[#0F4C45]/12 bg-[#F7F1E8] text-[#0F4C45] transition hover:-translate-y-0.5 hover:bg-[#0F4C45] hover:text-white"
                    >
                      <GitHubIcon />
                    </a>

                    <a
                      href="https://www.linkedin.com/in/brittnedanielle/"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="LinkedIn"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-[#0F4C45]/12 bg-[#F7F1E8] text-[#0F4C45] transition hover:-translate-y-0.5 hover:bg-[#0F4C45] hover:text-white"
                    >
                      <LinkedInIcon />
                    </a>
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
