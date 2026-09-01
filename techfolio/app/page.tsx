"use client";

import { gsap } from "gsap";
import Image from "next/image";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { HeroNameFlip } from "./components/HeroNameFlip";
import { projects } from "./projects/project-data";

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
    <br className="hidden sm:block" />
    <span className="sm:hidden"> </span>
    guided by systems thinking, driven by hands-on iteration, and bound by one
    rule:
    <br className="hidden sm:block" />
    <span className="sm:hidden"> </span>
    understanding only matters when it survives contact with real hardware.
  </>
);

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
  const [aboutLang, setAboutLang] = useState<AboutLang>("en");
  const scrollCueRef = useRef<HTMLAnchorElement>(null);
  const cueDotRef = useRef<HTMLSpanElement>(null);
  const cuePebbleRef = useRef<HTMLSpanElement>(null);
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
      className={`${montserrat.className} min-h-screen bg-[#F7F1E8] text-[#162b26]`}
    >
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
                href="/Brittne%20Valdivia%20-%202026%20SWE%20Resume.docx"
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
            className="pointer-events-auto flex cursor-pointer flex-col items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-[#0F4C45]/72 transition"
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

            <h2 className="mt-4 text-[1.85rem] font-extrabold leading-[0.96] tracking-tight sm:whitespace-nowrap sm:text-[2.5rem] lg:text-[3rem]">
              {projectsTitle}
            </h2>

            <p className="mt-5 text-[0.95rem] leading-7 text-[#3E514D] lg:text-[1rem] lg:leading-[1.85rem]">
              {projectsSubtitle}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3.5 sm:gap-4 md:grid-cols-2 xl:grid-cols-4 lg:mt-10 lg:gap-4 xl:gap-4">
            {projects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}/`}
                className="group block w-full cursor-pointer rounded-[1.05rem] border border-[#0F4C45]/12 bg-[#F7F1E8] p-3 text-left shadow-[0_14px_28px_rgba(22,43,38,0.05)] transition duration-200 hover:-translate-y-1 hover:border-[#0F4C45]/22 hover:shadow-[0_18px_34px_rgba(22,43,38,0.08)] sm:p-4 sm:text-center"
              >
                <div className="mb-3 overflow-hidden rounded-[0.9rem] bg-[#EEF3EE]">
                  <div className="relative h-[160px] sm:h-[140px] xl:h-[155px]">
                    {project.cardImage ? (
                      <Image
                        src={project.cardImage.src}
                        alt={project.cardImage.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-4 text-center">
                        <span className="text-[2rem] font-extrabold tracking-tight text-[#0F4C45]/28 transition-colors duration-200 group-hover:text-[#0F4C45]/42 sm:text-[2.35rem]">
                          {project.shortTitle}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-[1rem] font-extrabold tracking-tight text-[#162b26] transition-colors duration-200 group-hover:text-[#0F4C45] sm:text-[1rem]">
                  {project.title}
                </h3>
                <p className="mt-2 text-[0.78rem] leading-5 text-[#3E514D] sm:text-[0.76rem]">
                  {project.cardSummary}
                </p>

                <div className="mt-3 flex flex-wrap justify-start gap-1.5 sm:justify-center">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#0F4C45]/15 bg-[#F7F1E8] px-2 py-1 text-[0.62rem] font-semibold text-[#0F4C45] sm:text-[0.66rem]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
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
                    className="mt-1.5 inline-block text-[0.9rem] font-semibold text-[#162b26] transition hover:text-[#0F4C45] sm:text-[0.95rem]"
                  >
                    2260032001@student.must.edu.mo
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
