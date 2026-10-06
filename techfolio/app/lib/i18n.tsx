"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	type ReactNode,
} from "react";

/** The site is English-only; kept as a named type so call sites stay readable. */
export type Locale = "en";

type Dict = Record<string, string>;

const en: Dict = {
	"nav.archive": "Archive",
	"nav.cv": "CV",
	"nav.music": "Music",
	"music.loading": "Loading player…",
	"music.unavailable": "Folia is not running on this machine",
	"music.guide.title": "How to start the music player",
	"music.guide.intro": "Folia runs locally on your computer. Start it once, then this page plays music directly inside the site. Other devices (without Folia) will always show this guide instead.",
	"music.guide.step1.title": "Install Node 24",
	"music.guide.step1.body": "Folia needs Node 24 or newer. Download it from nodejs.org, or via nvm-windows / Volta.",
	"music.guide.step2.title": "Clone & install",
	"music.guide.step2.body": "Open a terminal (PowerShell/CMD) and run:",
	"music.guide.step3.title": "Start Folia",
	"music.guide.step3.body": "Then start the web player:",
	"music.guide.port": "Folia serves on",
	"music.guide.retry": "Check again",
	"story.01": "Projects",
	"story.02": "Explore",
	"story.03": "Goal",
	"story.04": "Next Steps",
	"agenda.kicker": "Session · Flow",
	"agenda.word": "Agenda",
	"agenda.wordEn": "CONTENT",
	"agenda.title": "How this talk moves.",
	"agenda.blurb":
		"Start from what I have built, then what I want to explore, the longer goal, and the next steps ahead.",
	"agenda.nav": "Talk flow",
	"agenda.hint": "Slow unfold from the left — tap a step to jump",
	"agenda.c1.title": "Projects",
	"agenda.c1.tag": "Experience",
	"agenda.c1.blurb": "Work, campus, make — what I have built.",
	"agenda.c2.title": "Explore",
	"agenda.c2.tag": "Research",
	"agenda.c2.blurb": "What I want to explore in research.",
	"agenda.c3.title": "Goal",
	"agenda.c3.tag": "Direction",
	"agenda.c3.blurb": "Where this path is heading — and why.",
	"agenda.c4.title": "Next Steps",
	"agenda.c4.tag": "Path",
	"agenda.c4.blurb": "What I do next on the path forward.",
	"hero.role": "Electronic Engineer",
	"hero.hello": "Hello",
	"hero.iam": "I am",
	"hero.greetingEnd": ".",
	"hero.enterIntroduce": "Enter Introduce",
	"hero.headline": "From Hardware\nto Intelligent Systems.",
	"hero.blurb":
		"I build systems that connect electronics, embedded systems, robotics and AI.",
	"hero.chip.hardware": "Hardware",
	"hero.chip.electronics": "Electronics",
	"hero.chip.embedded": "Embedded",
	"hero.chip.robotics": "Robotics",
	"hero.chip.ai": "AI",
	"hero.chip.uav": "UAV",
	"hero.projects": "Projects",
	"hero.contact": "Contact",
	"about.kicker": "About",
	"about.heading": "From hardware to intelligent systems.",
	"about.body1":
		"I build systems that connect electronics, embedded systems, robotics and AI — engineering across the whole stack, from board to field.",
	"about.body2":
		"Now I'm turning that experience into research capability: finding meaningful problems, building and validating systems in realistic scenarios. Intelligent agricultural and low-altitude systems are where I'm building that foundation, with graduate research as the next step.",
	"hero.resume": "Resume",
	"hero.scroll": "Scroll",
	"core.kicker": "01 — Projects",
	"core.title": "What I Can Build.",
	"core.blurb": "Browse by section on the right.",
	"core.open": "Open brief",
	"core.open.collection": "Open collection",
	"core.collection": "Collection",
	"core.nav": "Projects",
	"core.diy.lede": "Nine builds from the same desk — open the wall, then tap a tile.",
	"core.group.work": "Work",
	"core.group.companies": "Companies",
	"core.group.university": "University",
	"core.group.diy": "DIY",
	"core.group.society": "Society",
	"projects.hint": "Scroll to explore →",
	"core.rtk.title": "RTK & Agricultural Sensing",
	"core.rtk.cap": "Precise Positioning",
	"core.rtk.c1": "RTK",
	"core.rtk.c2": "GNSS",
	"core.rtk.c3": "LPWAN",
	"core.rtk.c4": "Embedded",
	"core.rtk.desc":
		"Field RTK for farm machinery — positioning that holds up outside the lab.",
	"core.agv.title": "Industrial AGV",
	"core.agv.cap": "Autonomous Operation",
	"core.agv.c1": "Robotics",
	"core.agv.c2": "Navigation",
	"core.agv.c3": "Motion Control",
	"core.agv.desc":
		"Heavy-industry AGV remotes and bring-up — from board to metal floor.",
	"core.fire.title": "Edge AI Fire Warning",
	"core.fire.cap": "Intelligent Perception",
	"core.fire.c1": "Computer Vision",
	"core.fire.c2": "Jetson",
	"core.fire.c3": "ROS",
	"core.fire.c4": "AI",
	"core.fire.desc":
		"Camera-first detection on Jetson — edge AI that confirms flame and alerts.",
	"core.wear.title": "Smart Wearable",
	"core.wear.cap": "Multi-Sensor Systems",
	"core.wear.c1": "Sensors",
	"core.wear.c2": "ESP32",
	"core.wear.c3": "BLE / Wi-Fi",
	"core.wear.c4": "Integration",
	"core.wear.desc":
		"Wearable sensing through board bring-up — vitals, status, and family alerts.",
	"archive.kicker": "Full Project Archive",
	"archive.prompt": "Projects · Work · Experiments · Activities",
	"archive.title": "Full Project Archive",
	"archive.cta": "Full project archive",
	"archive.back": "Back to story",
	"archive.page.blurb":
		"Chronological engineering journey — companies, university projects, make and society. For post-presentation exploration.",
	"conn.kicker": "02 — Direction",
	"conn.title": "Intelligent\nAgricultural\nUAV Systems",
	"conn.bridge": "These projects can converge into one system.",
	"conn.statement":
		"I see UAVs as the next system where my previous engineering experience can converge.",
	"goal.kicker": "03 — Goal",
	"goal.title": "My Goal.",
	"goal.headline": "My Goal.",
	"goal.display.my": "My",
	"goal.display.goal": "Goal.",
	"goal.title.from": "From Experience",
	"goal.title.to": "To Impact.",
	"goal.display.from": "From",
	"goal.display.experience": "Experience",
	"goal.display.to": "To",
	"goal.display.impact": "Impact.",
	"goal.lede":
		"Turn engineering experience into meaningful research,\nand eventually into products that matter.",
	"goal.path.current": "Now",
	"goal.path.grad": "Graduate",
	"goal.path.vision": "Vision",
	"goal.current.kicker": "Current Transition",
	"goal.current.title": "From Engineering\nto Intelligent Agriculture",
	"goal.current.body":
		"This is not a sudden career change. It is a reorientation of what I already know — bringing embedded systems, positioning, robotics and AI into intelligent agricultural applications.",
	"goal.current.from": "Engineering Experience",
	"goal.current.stack": "RTK · Embedded · Robotics · AI · Sensors",
	"goal.current.reorient": "Reorientation",
	"goal.current.to": "Current Research Direction",
	"goal.current.dest": "Intelligent Agricultural UAV Systems",
	"goal.current.note":
		"Agriculture here is the bridge into graduate research — not the boundary of what I will build for life.",
	"goal.grad.kicker": "Graduate Study",
	"goal.grad.title": "Build the Foundation.",
	"goal.grad.lede":
		"Not a checklist of scores — a complete foundation for research: papers, academics, language, and the discipline to go further.",
	"goal.g1.title": "Publish Papers",
	"goal.g1.body": "Build real research experience and produce academic publications.",
	"goal.g2.title": "CET-6 550+",
	"goal.g2.body": "Reach CET-6 score of 550 or above.",
	"goal.g3.title": "IELTS 6.5",
	"goal.g3.body": "Continue improving academic English and reach IELTS 6.5.",
	"goal.g4.title": "GPA A",
	"goal.g4.body": "Maintain strong academic performance and aim for an A-level GPA.",
	"goal.phd.kicker": "Result",
	"goal.phd.title": "PhD-Ready",
	"goal.phd.body":
		"Build the research experience, academic performance and language ability needed to pursue a PhD.",
	"goal.vision.kicker": "Long-Term Vision",
	"goal.vision.bridge": "From Research  →  Real-World Impact",
	"goal.vision.title": "Create something people are happy to have.",
	"goal.vision.p1":
		"Products that bring people a genuine sense of happiness and usefulness.",
	"goal.vision.p2":
		"A product that can be truly helpful when people need it — and when they do not need it, they can simply put it aside without feeling anxious about it.",
	"goal.vision.p3":
		"Agricultural UAV and low-altitude systems are how I build capability now. The long-term aim is to carry that systems thinking into products with real human value.",
	"goal.vision.motto": "Useful when needed.\nQuiet when not needed.",
	"goal.close": "Close",
	"goal.path.nav": "Goal stages",
	"goal.flag.hint": "Select a stage",
	"goal.flag.vision.blurb": "Life Goal.",
	"goal.cue.now": "Engineering Experience →",
	"goal.cue.grad": "Research Direction →",
	"goal.cue.vision": "Product Philosophy →",
	"goal.panel.now.title": "Engineering Experience",
	"goal.panel.now.lede":
		"From embedded systems to intelligent\nrobotics and UAV applications.",
	"goal.panel.now.i1.title": "RTK Positioning",
	"goal.panel.now.i1.tags": "Positioning · Communication · UAV",
	"goal.panel.now.i2.title": "Intelligent AGV",
	"goal.panel.now.i2.tags": "Embedded · ROS · Perception · AI",
	"goal.panel.now.i3.title": "AI Interaction",
	"goal.panel.now.i3.tags": "Voice · LLM · MQTT · Embedded",
	"goal.panel.now.i4.title": "Smart Elderly Care",
	"goal.panel.now.i4.tags": "Sensors · AI · IoT · Product Design",
	"goal.panel.now.cta": "View Projects →",
	"goal.panel.grad.title": "Build the Foundation.",
	"goal.panel.grad.research.label": "Research",
	"goal.panel.grad.research.body":
		"Develop a research direction around\nlow-altitude systems, intelligent UAV\napplications and technology planning.",
	"goal.panel.grad.academic.label": "Academic",
	"goal.panel.grad.academic.l1": "→ Publish research papers",
	"goal.panel.grad.academic.l2": "→ GPA A",
	"goal.panel.grad.academic.l3": "→ Build a foundation for PhD study",
	"goal.panel.grad.english.label": "English",
	"goal.panel.grad.english.l1": "→ CET-6 550+",
	"goal.panel.grad.english.l2": "→ IELTS 6.5",
	"goal.panel.grad.direction.label": "Direction",
	"goal.panel.grad.direction.chain":
		"Engineering Experience\n↓\nLow-Altitude Technology\n↓\nResearch\n↓\nTechnology Planning",
	"goal.panel.grad.footer": "→ PhD-Ready",
	"goal.panel.vision.p1":
		"I want to create products that genuinely bring people a sense of happiness and usefulness — tools that feel natural in everyday life.",
	"goal.panel.vision.p2":
		"Not something people need to constantly think about, manage, or feel anxious about when unused.",
	"goal.panel.vision.p3":
		"Something that simply works when the moment comes — helpful when needed, and easy to set aside when not.",
	"goal.panel.vision.p4":
		"Agricultural UAV and low-altitude systems are how I build capability now. The long-term aim is to carry that systems thinking into products with real human value.",
	"research.kicker": "02 — Explore",
	"research.title": "explore",
	"research.d1.title": "Precise Positioning",
	"research.d1.tech": "RTK + GNSS + Sensor Fusion",
	"research.d1.body":
		"Explore reliable positioning for UAV operations in real agricultural environments.",
	"research.d2.title": "Intelligent Perception",
	"research.d2.tech": "UAV Sensing + Edge AI",
	"research.d2.body":
		"Explore how UAVs can perceive crops, terrain and environmental conditions using onboard sensing and AI.",
	"research.d3.title": "Autonomous Operation",
	"research.d3.tech": "Robotics + Path Planning",
	"research.d3.body":
		"Explore autonomous navigation, planning and task execution.",
	"research.d4.title": "Air–Ground Collaboration",
	"research.d4.tech": "UAV + Ground IoT / AGV",
	"research.d4.body":
		"Explore cooperation between aerial systems and ground sensing / robotic systems.",
	"research.q.kicker": "Current Research Question",
	"research.q.body":
		"How can UAVs, precise positioning, edge AI and ground sensing systems work together to support autonomous agricultural operations?",
	"fit.kicker": "05 — Research Fit",
	"fit.title": "Why this supervisor.",
	"fit.logic":
		"YOUR RESEARCH + MY EXPERIENCE → POTENTIAL RESEARCH CONNECTION",
	"fit.blurb":
		"Customize techfolio/app/lib/research-fit.ts before each meeting. Only verified supervisor information.",
	"fit.mine": "My Experience",
	"fit.yours": "Your Research",
	"fit.recent": "Recent Work",
	"fit.connect": "Potential Connection",
	"next.kicker": "04 — Next Steps",
	"next.title": "Next Step.",
	"next.sub": "From Engineering to Research.",
	"next.blurb":
		"My next step is not simply to learn more technologies. It is to turn engineering experience into research capability: identify a meaningful problem, build a system, experiment, and validate in realistic scenarios.",
	"next.s1.title": "Engineering Experience",
	"next.s2.title": "Build Research Foundation",
	"next.s3.title": "Find a Research Problem",
	"next.s4.title": "Build & Experiment",
	"next.s5.title": "Real-world Validation",
	"next.s6.title": "Intelligent Agricultural UAV Systems",
	"target.kicker": "05 — Contact",
	"journey.kicker": "Archive",
	"journey.title": "Full project archive",
	"journey.projects": "Projects",
	"journey.projects.whisper":
		"From wearables and AGV to RTK — the product line that shaped the path.",
	"journey.companies": "Companies",
	"journey.companies.whisper":
		"Zongheng, CVTE, Moore — hardware to interaction in the field.",
	"journey.make": "MAKE",
	"journey.make.whisper":
		"Smart Helmet and desk builds — shipping outside the day job.",
	"journey.society": "Society",
	"journey.society.whisper":
		"Team, campus, volunteering — practice beyond the lab.",
	"journey.peek": "Open",
	"journey.brief": "Brief",
	"journey.close": "Close",
	"journey.end": "Still making — toward intelligent systems and low-altitude tech.",
	"journey.end.sub": "The path continues.",
	"journey.lightbox.hint": "Scroll to zoom · click outside to close",
	"exp.kicker": "Experience",
	"exp.title": "Where I built",
	"exp.zongheng.role": "Electronic Engineer",
	"exp.zongheng.company": "Guangzhou Zongheng Intelligent Technology",
	"exp.zongheng.tags": "Robotics · AGV · RTK · Embedded · Circuit",
	"exp.cvte.role": "PCB / Hardware Engineering",
	"exp.cvte.company": "CVTE",
	"exp.cvte.tags": "Altium · High-speed · Impedance · SMT",
	"exp.moore.role": "Interactive / New Media",
	"exp.moore.company": "Shenzhen Moore Creative",
	"exp.moore.tags": "TouchDesigner · Sensors · Immersive",
	"skills.label": "Technology",
	"skills.hardware": "Hardware",
	"skills.embedded": "Embedded",
	"skills.robotics": "Robotics",
	"skills.ai": "AI",
	"skills.uav": "UAV / Emerging",
	"contact.kicker": "Contact",
	"contact.title": "Let’s build something thoughtful.",
	"contact.body":
		"I’m always interested in opportunities involving intelligent hardware, embedded systems, robotics, and hands-on making — and in conversations that help those ideas grow.",
	"contact.emailMe": "Email Me",
	"contact.connect": "Connect",
	"contact.email": "Email",
	"contact.based": "Based in",
	"contact.location": "Guangdong, China",
	"contact.locationLabel": "Location",
	"contact.city": "Foshan, Guangdong",
	"contact.profiles": "Profiles",
};

const dictionaries: Record<Locale, Dict> = { en };

type LocaleContextValue = {
	t: (key: string) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);
const CopyOverrideContext = createContext<Dict>({});

export function getDict(locale: Locale): Dict {
	return dictionaries[locale];
}

/** Merge Studio / page-layout copy overrides into `t()`. */
export function CopyOverrideProvider({
	overrides,
	children,
}: {
	overrides: Dict;
	children: ReactNode;
}) {
	return (
		<CopyOverrideContext.Provider value={overrides}>
			{children}
		</CopyOverrideContext.Provider>
	);
}

export function LocaleProvider({ children }: { children: ReactNode }) {
	const value = useMemo<LocaleContextValue>(
		() => ({
			t: (key: string) => dictionaries.en[key] ?? key,
		}),
		[],
	);

	useEffect(() => {
		document.documentElement.lang = "en";
	}, []);

	return (
		<LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
	);
}

export function useLocale() {
	const ctx = useContext(LocaleContext);
	const overrides = useContext(CopyOverrideContext);
	if (!ctx) {
		throw new Error("useLocale must be used within LocaleProvider");
	}
	const t = useCallback(
		(key: string) => overrides[key] ?? ctx.t(key),
		[ctx, overrides],
	);
	return { t };
}
