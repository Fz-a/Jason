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
	"hero.projects": "View Work",
	"hero.contact": "Contact Me",
	"hero.resume": "Download Resume",
	"hero.scroll": "Scroll",
	"hero.project.kicker": "Featured work",
	"hero.project.title": "Smart Care Clothing",
	"hero.project.tags": "Embedded · AI · Smart Wearable",
	"hero.project.view": "View in journey",
	"about.kicker": "About",
	"about.title": "Electronic Engineer building intelligent systems.",
	"about.body":
		"I come from an electronic information engineering background, with hands-on work in hardware, circuits, embedded systems, intelligent devices, and robotics. My focus has grown from hardware and embedded systems toward robotics, AI interaction, and low-altitude technology — a natural path, not a sudden jump.",
	"work.kicker": "Work",
	"work.title": "Selected work",
	"featured.exploring": "Currently Exploring",
	"work.clothes.title": "Smart Care Clothing",
	"work.clothes.tags": "Embedded · AI · Wearable",
	"work.agv.title": "Intelligent AGV",
	"work.agv.tags": "Robotics · ROS · Embedded",
	"work.vxs.title": "VXS-100 AI Handheld",
	"work.vxs.tags": "AI · Hardware · HRI",
	"work.uav.title": "Low-Altitude / UAV",
	"work.uav.tags": "UAV · RTK · Exploring",
	"path.kicker": "Path",
	"path.title": "Target & Direction",
	"path.blurb": "Connecting what I have built with where I want to go.",
	"path.exp.kicker": "01 · Experience",
	"path.exp.title": "What I have built",
	"path.exp.body":
		"University foundations in electronics and embedded systems, then professional work integrating robotics, AGV, AI interaction and positioning into complete systems.",
	"path.uni.kicker": "University",
	"path.uni.title": "Foundation",
	"path.uni.circuit": "Circuit / MCU",
	"path.uni.wearable": "Smart Wearable",
	"path.uni.opencv": "OpenCV",
	"path.uni.gesture": "Gesture / Nano",
	"path.uni.embedded": "Embedded Systems",
	"path.pro.kicker": "Professional",
	"path.pro.title": "System building",
	"path.pro.robotics": "Robotics",
	"path.pro.agv": "AGV",
	"path.pro.ai": "AI Interaction",
	"path.pro.rtk": "RTK Positioning",
	"path.pro.system": "System Integration",
	"path.conn.kicker": "02 · Connection",
	"path.conn.title": "How the pieces transfer",
	"path.conn.body":
		"Prior capabilities can be combined and transferred into low-altitude contexts — exploring, applying and integrating rather than claiming industry expertise.",
	"path.bring.1.title": "RTK + UAV",
	"path.bring.1.body": "Precise positioning",
	"path.bring.2.title": "Robotics + AI",
	"path.bring.2.body": "Autonomous operation",
	"path.bring.3.title": "Embedded + Communication",
	"path.bring.3.body": "Remote control & telemetry",
	"path.bring.4.title": "Sensors + AI",
	"path.bring.4.body": "Intelligent perception",
	"path.bring.5.title": "System Integration",
	"path.bring.5.body": "Complete application systems",
	"path.target.kicker": "03 · Target",
	"path.target.title": "Low-altitude applications",
	"path.target.body":
		"Not a sudden switch — a natural next step: connecting prior hardware, robotics and AI experience into UAV and low-altitude use cases.",
	"path.app.uav": "UAV Positioning",
	"path.app.delivery": "Delivery Logistics",
	"path.app.systems": "Intelligent Systems",
	"path.research.kicker": "04 · Research Direction",
	"path.research.title": "Where I want to go",
	"path.research.body":
		"For the master's stage, I am clarifying a research direction around low-altitude intelligent systems — how positioning, autonomy, perception and embedded integration can work together in real applications.",
	"path.research.item1":
		"Explore UAV positioning and navigation with RTK and multi-sensor fusion.",
	"path.research.item2":
		"Connect robotics / AI interaction experience to autonomous low-altitude operation.",
	"path.research.item3":
		"Build toward integrated application systems, not isolated modules.",
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
	"hero.projects": "查看作品",
	"hero.contact": "联系我",
	"hero.resume": "下载简历",
	"hero.scroll": "下滑",
	"hero.project.kicker": "代表作品",
	"hero.project.title": "老年智能服饰",
	"hero.project.tags": "嵌入式 · AI · 智能穿戴",
	"hero.project.view": "在路径中查看",
	"about.kicker": "关于",
	"about.title": "构建智能系统的电子工程师。",
	"about.body":
		"我有电子信息工程背景，做过硬件、电路、嵌入式、智能设备与机器人项目。兴趣正从硬件与嵌入式，延伸到机器人、AI 交互与低空技术——这是一条逐步演化的路径，而不是突然跨界。",
	"work.kicker": "作品",
	"work.title": "精选项目",
	"featured.exploring": "正在探索",
	"work.clothes.title": "老年智能服饰",
	"work.clothes.tags": "嵌入式 · AI · 穿戴",
	"work.agv.title": "智能 AGV",
	"work.agv.tags": "机器人 · ROS · 嵌入式",
	"work.vxs.title": "VXS-100 AI 手持",
	"work.vxs.tags": "AI · 硬件 · 人机交互",
	"work.uav.title": "低空 / 无人机",
	"work.uav.tags": "无人机 · RTK · 探索中",
	"path.kicker": "路径",
	"path.title": "目标与方向",
	"path.blurb": "把已经做过的事，连接到我想去的地方。",
	"path.exp.kicker": "01 · 经验",
	"path.exp.title": "我已经构建的",
	"path.exp.body":
		"大学阶段积累电子、嵌入式与智能设备基础；工作后把机器人、AGV、AI 交互与定位组合进完整系统。",
	"path.uni.kicker": "大学",
	"path.uni.title": "基础能力",
	"path.uni.circuit": "电路 / 单片机",
	"path.uni.wearable": "智能穿戴",
	"path.uni.opencv": "OpenCV",
	"path.uni.gesture": "手势 / Nano",
	"path.uni.embedded": "嵌入式系统",
	"path.pro.kicker": "职业",
	"path.pro.title": "系统构建",
	"path.pro.robotics": "机器人",
	"path.pro.agv": "AGV",
	"path.pro.ai": "AI 交互",
	"path.pro.rtk": "RTK 定位",
	"path.pro.system": "系统集成",
	"path.conn.kicker": "02 · 连接",
	"path.conn.title": "能力如何迁移",
	"path.conn.body":
		"已有能力可以组合并迁移到低空场景——强调探索、应用与整合，而不是声称已是行业专家。",
	"path.bring.1.title": "RTK + 无人机",
	"path.bring.1.body": "精准定位",
	"path.bring.2.title": "机器人 + AI",
	"path.bring.2.body": "自主运行",
	"path.bring.3.title": "嵌入式 + 通信",
	"path.bring.3.body": "遥控与遥测",
	"path.bring.4.title": "传感 + AI",
	"path.bring.4.body": "智能感知",
	"path.bring.5.title": "系统集成",
	"path.bring.5.body": "完整应用系统",
	"path.target.kicker": "03 · 目标",
	"path.target.title": "低空应用",
	"path.target.body":
		"不是突然转行——而是自然延伸：把已有的硬件、机器人与 AI 经验，连接到无人机与低空场景。",
	"path.app.uav": "无人机定位",
	"path.app.delivery": "配送物流",
	"path.app.systems": "智能系统",
	"path.research.kicker": "04 · 研究方向",
	"path.research.title": "我想去的地方",
	"path.research.body":
		"在硕士阶段，我正把研究方向聚焦到低空智能系统——探索定位、自主、感知与嵌入式集成如何在真实应用中协同工作。",
	"path.research.item1": "探索结合 RTK 与多传感融合的无人机定位与导航。",
	"path.research.item2": "把机器人 / AI 交互经验连接到低空自主运行。",
	"path.research.item3": "面向完整应用系统，而不是孤立模块。",
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
	"hero.projects": "查看作品",
	"hero.contact": "聯絡我",
	"hero.resume": "下載履歷",
	"hero.scroll": "下滑",
	"hero.project.kicker": "代表作品",
	"hero.project.title": "老年智慧服飾",
	"hero.project.tags": "嵌入式 · AI · 智慧穿戴",
	"hero.project.view": "在路徑中查看",
	"about.kicker": "關於",
	"about.title": "構建智慧系統的電子工程師。",
	"about.body":
		"我有電子資訊工程背景，做過硬體、電路、嵌入式、智慧裝置與機器人專案。興趣正從硬體與嵌入式，延伸到機器人、AI 互動與低空技術——這是一條逐步演化的路徑，而不是突然跨界。",
	"work.kicker": "作品",
	"work.title": "精選專案",
	"featured.exploring": "正在探索",
	"work.clothes.title": "老年智慧服飾",
	"work.clothes.tags": "嵌入式 · AI · 穿戴",
	"work.agv.title": "智慧 AGV",
	"work.agv.tags": "機器人 · ROS · 嵌入式",
	"work.vxs.title": "VXS-100 AI 手持",
	"work.vxs.tags": "AI · 硬體 · 人機互動",
	"work.uav.title": "低空 / 無人機",
	"work.uav.tags": "無人機 · RTK · 探索中",
	"path.kicker": "路徑",
	"path.title": "目標與方向",
	"path.blurb": "把已經做過的事，連接到我想去的地方。",
	"path.exp.kicker": "01 · 經驗",
	"path.exp.title": "我已經構建的",
	"path.exp.body":
		"大學階段累積電子、嵌入式與智慧裝置基礎；工作後把機器人、AGV、AI 互動與定位組裝進完整系統。",
	"path.uni.kicker": "大學",
	"path.uni.title": "基礎能力",
	"path.uni.circuit": "電路 / 單晶片",
	"path.uni.wearable": "智慧穿戴",
	"path.uni.opencv": "OpenCV",
	"path.uni.gesture": "手勢 / Nano",
	"path.uni.embedded": "嵌入式系統",
	"path.pro.kicker": "職業",
	"path.pro.title": "系統構建",
	"path.pro.robotics": "機器人",
	"path.pro.agv": "AGV",
	"path.pro.ai": "AI 互動",
	"path.pro.rtk": "RTK 定位",
	"path.pro.system": "系統整合",
	"path.conn.kicker": "02 · 連接",
	"path.conn.title": "能力如何遷移",
	"path.conn.body":
		"已有能力可以組合並遷移到低空場景——強調探索、應用與整合，而不是聲稱已是產業專家。",
	"path.bring.1.title": "RTK + 無人機",
	"path.bring.1.body": "精準定位",
	"path.bring.2.title": "機器人 + AI",
	"path.bring.2.body": "自主運行",
	"path.bring.3.title": "嵌入式 + 通訊",
	"path.bring.3.body": "遙控與遙測",
	"path.bring.4.title": "感測 + AI",
	"path.bring.4.body": "智慧感知",
	"path.bring.5.title": "系統整合",
	"path.bring.5.body": "完整應用系統",
	"path.target.kicker": "03 · 目標",
	"path.target.title": "低空應用",
	"path.target.body":
		"不是突然轉行——而是自然延伸：把已有的硬體、機器人與 AI 經驗，連接到無人機與低空場景。",
	"path.app.uav": "無人機定位",
	"path.app.delivery": "配送物流",
	"path.app.systems": "智慧系統",
	"path.research.kicker": "04 · 研究方向",
	"path.research.title": "我想去的地方",
	"path.research.body":
		"在碩士階段，我正把研究方向聚焦到低空智慧系統——探索定位、自主、感知與嵌入式整合如何在真實應用中協同工作。",
	"path.research.item1": "探索結合 RTK 與多感測融合的無人機定位與導航。",
	"path.research.item2": "把機器人 / AI 互動經驗連接到低空自主運行。",
	"path.research.item3": "面向完整應用系統，而不是孤立模組。",
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
