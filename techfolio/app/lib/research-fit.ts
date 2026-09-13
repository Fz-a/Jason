import type { Locale } from "./i18n";

/**
 * Customize this file before each supervisor meeting.
 * Do not invent papers or claims — keep placeholders honest.
 */
export type ResearchFitCopy = {
	myExperience: string;
	myTags: string[];
	theirResearch: string;
	observation: string;
	connection: string;
	explore: string;
};

export const researchFit: Record<Locale, ResearchFitCopy> = {
	en: {
		myExperience:
			"Built RTK agricultural hardware, AGV robotics, edge-AI perception, and multi-sensor wearables.",
		myTags: ["RTK", "Robotics", "Edge AI", "Embedded", "Sensors"],
		theirResearch:
			"[Supervisor research theme / paper — replace before the meeting]",
		observation:
			"What I noticed while reading: [replace with your specific observation].",
		connection:
			"Potential connection: positioning + perception + autonomy for intelligent agricultural UAV systems.",
		explore:
			"I want to explore how these capabilities can support the supervisor's research direction — open to refining the question together.",
	},
	"zh-Hans": {
		myExperience:
			"做过 RTK 农业硬件、AGV 机器人、边缘 AI 感知与多传感穿戴系统。",
		myTags: ["RTK", "机器人", "边缘 AI", "嵌入式", "传感"],
		theirResearch: "【导师研究方向 / 论文 — 会面前替换】",
		observation: "阅读后我注意到：【替换为你的具体观察】。",
		connection:
			"可能的连接：定位 + 感知 + 自主，面向智能农业无人机系统。",
		explore:
			"希望探索这些能力如何支撑导师研究方向——问题本身愿意与导师一起细化。",
	},
	"zh-Hant": {
		myExperience:
			"做過 RTK 農業硬體、AGV 機器人、邊緣 AI 感知與多感測穿戴系統。",
		myTags: ["RTK", "機器人", "邊緣 AI", "嵌入式", "感測"],
		theirResearch: "【導師研究方向 / 論文 — 會議前替換】",
		observation: "閱讀後我注意到：【替換為你的具體觀察】。",
		connection:
			"可能的連接：定位 + 感知 + 自主，面向智慧農業無人機系統。",
		explore:
			"希望探索這些能力如何支撐導師研究方向——問題本身願意與導師一起細化。",
	},
};
