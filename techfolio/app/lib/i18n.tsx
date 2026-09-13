"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";

export type Locale = "en" | "zh-Hans" | "zh-Hant";

const STORAGE_KEY = "techfolio-locale";

type Dict = Record<string, string>;

const en: Dict = {
	"nav.home": "Home",
	"nav.about": "About",
	"nav.projects": "Projects",
	"nav.contact": "Contact",
	"hero.role": "Electronic Engineer",
	"hero.blurb": "Building intelligent systems from hardware to AI.",
	"hero.chip.electronics": "Electronics",
	"hero.chip.embedded": "Embedded",
	"hero.chip.robotics": "Robotics",
	"hero.chip.ai": "AI",
	"hero.chip.uav": "UAV",
	"hero.projects": "View Projects",
	"hero.contact": "Contact Me",
	"hero.resume": "Download Resume",
	"hero.scroll": "Scroll",
	"about.kicker": "About",
	"about.title": "Electronic Engineer building intelligent systems.",
	"about.body":
		"I come from an electronic information engineering background, with hands-on work in hardware, circuits, embedded systems, intelligent devices, and robotics. My focus has grown from hardware and embedded systems toward robotics, AI interaction, and low-altitude technology — a natural path, not a sudden jump.",
	"featured.kicker": "Featured",
	"featured.title": "Selected projects",
	"featured.view": "View Project",
	"featured.exploring": "Currently Exploring",
	"featured.01.title": "Smart Care Clothing",
	"featured.01.tags": "Embedded · Sensors · AI · Wearable",
	"featured.01.desc":
		"Human-centered wearable care — sensing, fall alerts, and voice interaction. Tested with 60+ older adults; 20+ awards.",
	"featured.02.title": "Intelligent AGV System",
	"featured.02.tags": "AGV · ESP32 · ROS · LiDAR · MQTT",
	"featured.02.desc":
		"Robotics × embedded × AI — Mecanum AGV with LiDAR, sensing, and remote / voice interaction for real industrial use.",
	"featured.03.title": "VXS-100 AI Handheld",
	"featured.03.tags": "MCU · ASR · LLM · TTS · MQTT",
	"featured.03.desc":
		"AI conversation and robot interaction handheld — voice in, LLM, speech out, robot control.",
	"featured.04.title": "Low-Altitude Technology",
	"featured.04.tags": "UAV · RTK · GNSS · LoRa",
	"featured.04.desc":
		"Exploring how electronics, embedded systems, and robotics transfer into UAV and low-altitude applications.",
	"path.kicker": "Path",
	"path.title": "Engineering journey",
	"path.blurb":
		"From electronics to UAV — why an electronic engineer moves into low-altitude technology.",
	"path.s1": "Electronics",
	"path.s2": "Circuit & MCU",
	"path.s3": "Smart Wearable",
	"path.s4": "Embedded",
	"path.s5": "Robotics / AGV",
	"path.s6": "AI Interaction",
	"path.s7": "Low-Altitude",
	"journey.kicker": "Archive",
	"journey.title": "Full project path",
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
	"contact.title": "Let’s build something real.",
	"contact.body":
		"Open to work in electronics, embedded systems, robotics, AI hardware, and low-altitude applications — and to conversations that help those ideas grow.",
	"contact.emailMe": "Email Me",
	"contact.connect": "Connect",
	"contact.email": "Email",
	"contact.based": "Based in",
	"contact.location": "Macao SAR, China",
	"contact.locationLabel": "Location",
	"contact.city": "Foshan, Guangdong",
	"contact.profiles": "Profiles",
	"lang.label": "Language",
};

const zhHans: Dict = {
	"nav.home": "首页",
	"nav.about": "关于",
	"nav.projects": "项目",
	"nav.contact": "联系",
	"hero.role": "电子工程师",
	"hero.blurb": "从硬件到人工智能，构建智能系统。",
	"hero.chip.electronics": "电子",
	"hero.chip.embedded": "嵌入式",
	"hero.chip.robotics": "机器人",
	"hero.chip.ai": "人工智能",
	"hero.chip.uav": "无人机",
	"hero.projects": "查看项目",
	"hero.contact": "联系我",
	"hero.resume": "下载简历",
	"hero.scroll": "下滑",
	"about.kicker": "关于",
	"about.title": "构建智能系统的电子工程师。",
	"about.body":
		"我有电子信息工程背景，做过硬件、电路、嵌入式、智能设备与机器人项目。兴趣正从硬件与嵌入式，延伸到机器人、AI 交互与低空技术——这是一条逐步演化的路径，而不是突然跨界。",
	"featured.kicker": "精选",
	"featured.title": "代表项目",
	"featured.view": "查看项目",
	"featured.exploring": "正在探索",
	"featured.01.title": "老年智能服饰",
	"featured.01.tags": "嵌入式 · 传感 · AI · 穿戴",
	"featured.01.desc":
		"面向照护的智能穿戴——监测、跌倒告警与语音交互。60+ 长者实测；20+ 竞赛与创新奖项。",
	"featured.02.title": "智能 AGV 系统",
	"featured.02.tags": "AGV · ESP32 · ROS · 激光雷达 · MQTT",
	"featured.02.desc":
		"机器人 × 嵌入式 × AI——麦克纳姆 AGV，激光雷达与传感，远程 / 语音交互，面向工业场景。",
	"featured.03.title": "VXS-100 AI 手持终端",
	"featured.03.tags": "MCU · 语音识别 · 大模型 · 语音合成 · MQTT",
	"featured.03.desc":
		"AI 对话与机器人交互手持终端——语音进、大模型、语音出、驱动机器人。",
	"featured.04.title": "低空技术",
	"featured.04.tags": "无人机 · RTK · 北斗 · LoRa",
	"featured.04.desc":
		"探索电子、嵌入式与机器人经验如何迁移到无人机与低空应用。",
	"path.kicker": "路径",
	"path.title": "工程成长",
	"path.blurb": "从电子到无人机——为什么电子工程师会走向低空技术。",
	"path.s1": "电子工程",
	"path.s2": "电路与单片机",
	"path.s3": "智能穿戴",
	"path.s4": "嵌入式",
	"path.s5": "机器人 / AGV",
	"path.s6": "AI 交互",
	"path.s7": "低空技术",
	"journey.kicker": "档案",
	"journey.title": "完整项目路径",
	"journey.projects": "项目",
	"journey.projects.whisper": "从穿戴、AGV 到 RTK——串起路径的产品线。",
	"journey.companies": "公司",
	"journey.companies.whisper": "纵横、视源、摩尔——从硬件到现场交互。",
	"journey.make": "造物",
	"journey.make.whisper": "智能头盔与桌上 DIY——工作之外的交付。",
	"journey.society": "社会",
	"journey.society.whisper": "团队、校园与志愿——实验室之外的实践。",
	"journey.peek": "点击打开",
	"journey.brief": "详情",
	"journey.close": "关闭",
	"journey.end": "仍在路上——面向智能系统与低空技术。",
	"journey.end.sub": "旅程继续。",
	"journey.lightbox.hint": "滚轮缩放 · 点击外侧关闭",
	"exp.kicker": "经历",
	"exp.title": "我在哪里做",
	"exp.zongheng.role": "电子工程师",
	"exp.zongheng.company": "广州纵横智能科技",
	"exp.zongheng.tags": "机器人 · AGV · RTK · 嵌入式 · 电路",
	"exp.cvte.role": "PCB / 硬件工程",
	"exp.cvte.company": "视源电子 CVTE",
	"exp.cvte.tags": "Altium · 高速 · 阻抗 · SMT",
	"exp.moore.role": "交互 / 新媒体",
	"exp.moore.company": "深圳摩尔创展",
	"exp.moore.tags": "TouchDesigner · 传感 · 沉浸式",
	"skills.label": "技术",
	"skills.hardware": "硬件",
	"skills.embedded": "嵌入式",
	"skills.robotics": "机器人",
	"skills.ai": "人工智能",
	"skills.uav": "无人机 / 新兴",
	"contact.kicker": "联系",
	"contact.title": "一起把事情做实。",
	"contact.body":
		"对电子、嵌入式、机器人、AI 硬件与低空应用的机会感兴趣，也欢迎能让这些想法继续生长的交流。",
	"contact.emailMe": "发邮件",
	"contact.connect": "连接",
	"contact.email": "邮箱",
	"contact.based": "所在地",
	"contact.location": "中国澳门",
	"contact.locationLabel": "所在地",
	"contact.city": "广东佛山",
	"contact.profiles": "主页",
	"lang.label": "语言",
};

const zhHant: Dict = {
	"nav.home": "首頁",
	"nav.about": "關於",
	"nav.projects": "專案",
	"nav.contact": "聯絡",
	"hero.role": "電子工程師",
	"hero.blurb": "從硬體到人工智慧，構建智慧系統。",
	"hero.chip.electronics": "電子",
	"hero.chip.embedded": "嵌入式",
	"hero.chip.robotics": "機器人",
	"hero.chip.ai": "人工智慧",
	"hero.chip.uav": "無人機",
	"hero.projects": "查看專案",
	"hero.contact": "聯絡我",
	"hero.resume": "下載履歷",
	"hero.scroll": "下滑",
	"about.kicker": "關於",
	"about.title": "構建智慧系統的電子工程師。",
	"about.body":
		"我有電子資訊工程背景，做過硬體、電路、嵌入式、智慧裝置與機器人專案。興趣正從硬體與嵌入式，延伸到機器人、AI 互動與低空技術——這是一條逐步演化的路徑，而不是突然跨界。",
	"featured.kicker": "精選",
	"featured.title": "代表專案",
	"featured.view": "查看專案",
	"featured.exploring": "正在探索",
	"featured.01.title": "老年智慧服飾",
	"featured.01.tags": "嵌入式 · 感測 · AI · 穿戴",
	"featured.01.desc":
		"面向照護的智慧穿戴——監測、跌倒告警與語音互動。60+ 長者實測；20+ 競賽與創新獎項。",
	"featured.02.title": "智慧 AGV 系統",
	"featured.02.tags": "AGV · ESP32 · ROS · 光達 · MQTT",
	"featured.02.desc":
		"機器人 × 嵌入式 × AI——麥克納姆 AGV，光達與感測，遠端 / 語音互動，面向工業場景。",
	"featured.03.title": "VXS-100 AI 手持終端",
	"featured.03.tags": "MCU · 語音辨識 · 大模型 · 語音合成 · MQTT",
	"featured.03.desc":
		"AI 對話與機器人互動手持終端——語音進、大模型、語音出、驅動機器人。",
	"featured.04.title": "低空技術",
	"featured.04.tags": "無人機 · RTK · 北斗 · LoRa",
	"featured.04.desc":
		"探索電子、嵌入式與機器人經驗如何遷移到無人機與低空應用。",
	"path.kicker": "路徑",
	"path.title": "工程成長",
	"path.blurb": "從電子到無人機——為什麼電子工程師會走向低空技術。",
	"path.s1": "電子工程",
	"path.s2": "電路與單晶片",
	"path.s3": "智慧穿戴",
	"path.s4": "嵌入式",
	"path.s5": "機器人 / AGV",
	"path.s6": "AI 互動",
	"path.s7": "低空技術",
	"journey.kicker": "檔案",
	"journey.title": "完整專案路徑",
	"journey.projects": "專案",
	"journey.projects.whisper": "從穿戴、AGV 到 RTK——串起路徑的產品線。",
	"journey.companies": "公司",
	"journey.companies.whisper": "縱橫、視源、摩爾——從硬體到現場互動。",
	"journey.make": "造物",
	"journey.make.whisper": "智慧頭盔與桌上 DIY——工作之外的交付。",
	"journey.society": "社會",
	"journey.society.whisper": "團隊、校園與志願——實驗室之外的實踐。",
	"journey.peek": "點擊打開",
	"journey.brief": "詳情",
	"journey.close": "關閉",
	"journey.end": "仍在路上——面向智慧系統與低空技術。",
	"journey.end.sub": "旅程繼續。",
	"journey.lightbox.hint": "滾輪縮放 · 點擊外側關閉",
	"exp.kicker": "經歷",
	"exp.title": "我在哪裡做",
	"exp.zongheng.role": "電子工程師",
	"exp.zongheng.company": "廣州縱橫智慧科技",
	"exp.zongheng.tags": "機器人 · AGV · RTK · 嵌入式 · 電路",
	"exp.cvte.role": "PCB / 硬體工程",
	"exp.cvte.company": "視源電子 CVTE",
	"exp.cvte.tags": "Altium · 高速 · 阻抗 · SMT",
	"exp.moore.role": "互動 / 新媒體",
	"exp.moore.company": "深圳摩爾創展",
	"exp.moore.tags": "TouchDesigner · 感測 · 沉浸式",
	"skills.label": "技術",
	"skills.hardware": "硬體",
	"skills.embedded": "嵌入式",
	"skills.robotics": "機器人",
	"skills.ai": "人工智慧",
	"skills.uav": "無人機 / 新興",
	"contact.kicker": "聯絡",
	"contact.title": "一起把事情做實。",
	"contact.body":
		"對電子、嵌入式、機器人、AI 硬體與低空應用的機會感興趣，也歡迎能讓這些想法繼續生長的交流。",
	"contact.emailMe": "寄信給我",
	"contact.connect": "連接",
	"contact.email": "信箱",
	"contact.based": "所在地",
	"contact.location": "中國澳門",
	"contact.locationLabel": "所在地",
	"contact.city": "廣東佛山",
	"contact.profiles": "主頁",
	"lang.label": "語言",
};

const dictionaries: Record<Locale, Dict> = {
	en,
	"zh-Hans": zhHans,
	"zh-Hant": zhHant,
};

export const LOCALE_OPTIONS: { id: Locale; short: string; title: string }[] = [
	{ id: "en", short: "EN", title: "English" },
	{ id: "zh-Hant", short: "繁", title: "繁體中文" },
	{ id: "zh-Hans", short: "简", title: "简体中文" },
];

type LocaleContextValue = {
	locale: Locale;
	setLocale: (locale: Locale) => void;
	t: (key: string) => string;
	isZh: boolean;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readStoredLocale(): Locale {
	if (typeof window === "undefined") return "en";
	const stored = window.localStorage.getItem(STORAGE_KEY);
	if (stored === "en" || stored === "zh-Hans" || stored === "zh-Hant") {
		return stored;
	}
	const lang = window.navigator.language.toLowerCase();
	if (lang.startsWith("zh")) {
		if (
			lang.includes("tw") ||
			lang.includes("hk") ||
			lang.includes("hant") ||
			lang.includes("mo")
		) {
			return "zh-Hant";
		}
		return "zh-Hans";
	}
	return "en";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
	const [locale, setLocaleState] = useState<Locale>("en");
	const [ready, setReady] = useState(false);

	useEffect(() => {
		setLocaleState(readStoredLocale());
		setReady(true);
	}, []);

	const setLocale = useCallback((next: Locale) => {
		setLocaleState(next);
		window.localStorage.setItem(STORAGE_KEY, next);
		document.documentElement.lang =
			next === "en" ? "en" : next === "zh-Hans" ? "zh-Hans" : "zh-Hant";
	}, []);

	useEffect(() => {
		if (!ready) return;
		document.documentElement.lang =
			locale === "en" ? "en" : locale === "zh-Hans" ? "zh-Hans" : "zh-Hant";
	}, [locale, ready]);

	const value = useMemo<LocaleContextValue>(() => {
		const dict = dictionaries[locale];
		return {
			locale,
			setLocale,
			t: (key: string) => dict[key] ?? dictionaries.en[key] ?? key,
			isZh: locale !== "en",
		};
	}, [locale, setLocale]);

	return (
		<LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
	);
}

export function useLocale() {
	const ctx = useContext(LocaleContext);
	if (!ctx) {
		throw new Error("useLocale must be used within LocaleProvider");
	}
	return ctx;
}
