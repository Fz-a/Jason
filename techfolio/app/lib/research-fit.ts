import type { Locale } from "./i18n";

/**
 * Customize before each supervisor meeting.
 * Do not invent papers or claims — only use verified supervisor info.
 */
export type ResearchFitRow = {
	yours: string;
	mine: string;
};

export const researchFitRows: Record<Locale, ResearchFitRow[]> = {
	en: [
		{ yours: "UAV / Robotics", mine: "AGV / Robotics" },
		{ yours: "Positioning", mine: "RTK" },
		{ yours: "AI Perception", mine: "Jetson / Computer Vision" },
		{ yours: "Intelligent Systems", mine: "Embedded / Integration" },
		{ yours: "Agricultural Systems", mine: "Field Sensing / LPWAN" },
	],
	"zh-Hans": [
		{ yours: "无人机 / 机器人", mine: "AGV / 机器人" },
		{ yours: "定位", mine: "RTK" },
		{ yours: "AI 感知", mine: "Jetson / 计算机视觉" },
		{ yours: "智能系统", mine: "嵌入式 / 系统集成" },
		{ yours: "农业系统", mine: "田间传感 / LPWAN" },
	],
	"zh-Hant": [
		{ yours: "無人機 / 機器人", mine: "AGV / 機器人" },
		{ yours: "定位", mine: "RTK" },
		{ yours: "AI 感知", mine: "Jetson / 電腦視覺" },
		{ yours: "智慧系統", mine: "嵌入式 / 系統整合" },
		{ yours: "農業系統", mine: "田間感測 / LPWAN" },
	],
};
