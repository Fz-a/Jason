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
	"nav.contact": "Contact",
	"hero.role": "Electronic Engineer",
	"hero.tags": "AI · Robotics · Intelligent Hardware",
	"hero.hello": "Hello",
	"hero.iam": "I am",
	"hero.blurb":
		"I turn ideas into real-world products through hardware, software, AI, and robotics.",
	"hero.resume": "Download Resume",
	"hero.contact": "Contact Me",
	"hero.scroll": "Scroll",
	"contact.kicker": "Contact",
	"contact.title": "Let’s build something thoughtful.",
	"contact.body":
		"I’m always interested in opportunities involving intelligent hardware, embedded systems, robotics, and hands-on making — and in conversations that help those ideas grow.",
	"contact.emailMe": "Email Me",
	"contact.connect": "Connect",
	"contact.email": "Email",
	"contact.based": "Based in",
	"contact.location": "Macao SAR, China",
	"contact.locationLabel": "Location",
	"contact.city": "Foshan, Guangdong",
	"contact.profiles": "Profiles",
	"journey.projects": "Projects",
	"journey.projects.whisper":
		"Robot, RTK, AGV — then Smart Clothes and Early Fire Warning.",
	"journey.companies": "Companies",
	"journey.companies.whisper":
		"Three workplaces — what each one taught in brief.",
	"journey.make": "MAKE",
	"journey.make.whisper":
		"Smart Helmet venture — then the DIY desk builds.",
	"journey.society": "Society",
	"journey.society.whisper":
		"Team, two departments, volunteering, and exhibitions.",
	"journey.peek": "Peek brief",
	"journey.brief": "Brief",
	"journey.close": "Close",
	"journey.end": "Still making — graduate study in intelligent hardware.",
	"journey.end.sub": "The path continues.",
	"journey.lightbox.hint": "Scroll to zoom · click outside to close",
	"lang.label": "Language",
};

const zhHans: Dict = {
	"nav.home": "首页",
	"nav.about": "关于",
	"nav.contact": "联系",
	"hero.role": "电子工程师",
	"hero.tags": "人工智能 · 机器人 · 智能硬件",
	"hero.hello": "你好",
	"hero.iam": "我是",
	"hero.blurb":
		"我把想法做成能落地的产品——硬件、软件、人工智能与机器人。",
	"hero.resume": "下载简历",
	"hero.contact": "联系我",
	"hero.scroll": "下滑",
	"contact.kicker": "联系",
	"contact.title": "一起把事情做得更有分量。",
	"contact.body":
		"我始终对智能硬件、嵌入式、机器人与动手造物的机会感兴趣，也欢迎能让这些想法继续生长的交流。",
	"contact.emailMe": "发邮件",
	"contact.connect": "连接",
	"contact.email": "邮箱",
	"contact.based": "所在地",
	"contact.location": "中国澳门",
	"contact.locationLabel": "所在地",
	"contact.city": "广东佛山",
	"contact.profiles": "主页",
	"journey.projects": "项目",
	"journey.projects.whisper":
		"机器人、RTK、AGV，再到智慧穿戴与早期火情预警。",
	"journey.companies": "公司",
	"journey.companies.whisper": "三处工作——各自留下的一页摘要。",
	"journey.make": "造物",
	"journey.make.whisper": "智能头盔创业，再到桌上的 DIY。",
	"journey.society": "社会",
	"journey.society.whisper": "团队、两个部门、志愿与展览。",
	"journey.peek": "查看详情",
	"journey.brief": "详情",
	"journey.close": "关闭",
	"journey.end": "仍在路上——智能硬件方向的研究生学习。",
	"journey.end.sub": "旅程继续。",
	"journey.lightbox.hint": "滚轮缩放 · 点击外侧关闭",
	"lang.label": "语言",
};

const zhHant: Dict = {
	"nav.home": "首頁",
	"nav.about": "關於",
	"nav.contact": "聯絡",
	"hero.role": "電子工程師",
	"hero.tags": "人工智慧 · 機器人 · 智慧硬體",
	"hero.hello": "你好",
	"hero.iam": "我是",
	"hero.blurb":
		"我把想法做成能落地的產品——硬體、軟體、人工智慧與機器人。",
	"hero.resume": "下載履歷",
	"hero.contact": "聯絡我",
	"hero.scroll": "下滑",
	"contact.kicker": "聯絡",
	"contact.title": "一起把事情做得更有分量。",
	"contact.body":
		"我始終對智慧硬體、嵌入式、機器人與動手造物的機會感興趣，也歡迎能讓這些想法繼續生長的交流。",
	"contact.emailMe": "寄信給我",
	"contact.connect": "連接",
	"contact.email": "信箱",
	"contact.based": "所在地",
	"contact.location": "中國澳門",
	"contact.locationLabel": "所在地",
	"contact.city": "廣東佛山",
	"contact.profiles": "主頁",
	"journey.projects": "專案",
	"journey.projects.whisper":
		"機器人、RTK、AGV，再到智慧穿戴與早期火情預警。",
	"journey.companies": "公司",
	"journey.companies.whisper": "三處工作——各自留下的一頁摘要。",
	"journey.make": "造物",
	"journey.make.whisper": "智慧頭盔創業，再到桌上的 DIY。",
	"journey.society": "社會",
	"journey.society.whisper": "團隊、兩個部門、志願與展覽。",
	"journey.peek": "查看詳情",
	"journey.brief": "詳情",
	"journey.close": "關閉",
	"journey.end": "仍在路上——智慧硬體方向的研究生學習。",
	"journey.end.sub": "旅程繼續。",
	"journey.lightbox.hint": "滾輪縮放 · 點擊外側關閉",
	"lang.label": "語言",
};

const dictionaries: Record<Locale, Dict> = {
	en,
	"zh-Hans": zhHans,
	"zh-Hant": zhHant,
};

export const LOCALE_OPTIONS: { id: Locale; short: string; title: string }[] = [
	{ id: "en", short: "EN", title: "English" },
	{ id: "zh-Hans", short: "简", title: "简体中文" },
	{ id: "zh-Hant", short: "繁", title: "繁體中文" },
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
