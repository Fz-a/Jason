/**
 * Research Fit — customize per supervisor meeting.
 * Only insert verified professor information. Never invent papers or claims.
 *
 * Before each meeting, edit this file (or swap locale blocks).
 */
import type { Locale } from "./i18n";

export type ResearchFitConfig = {
	/** Leave empty or use placeholder until verified */
	professor: string;
	/** Verified research interests / lab direction */
	researchAreas: string[];
	/** Verified recent projects / papers — placeholders OK */
	recentWork: string[];
	/** Your matching capabilities (stable across meetings) */
	matchingExperience: string[];
	/** Short formula shown as convergence chips */
	connectionFormula: string[];
	/** One-paragraph potential connection — keep honest */
	potentialConnection: string;
};

export const researchFit: Record<Locale, ResearchFitConfig> = {
	en: {
		professor: "[Supervisor name — replace before meeting]",
		researchAreas: [
			"[Research area 1 — replace with verified topic]",
			"[Research area 2]",
			"[Research area 3]",
		],
		recentWork: [
			"[Relevant paper / project — replace only if verified]",
			"[Lab direction or recent work — replace if verified]",
		],
		matchingExperience: [
			"RTK / GNSS",
			"Embedded Systems",
			"Robotics / AGV",
			"Edge AI",
			"Sensor Integration",
			"UAV-related exploration",
		],
		connectionFormula: [
			"RTK",
			"Sensor Fusion",
			"UAV",
			"Agricultural Perception",
		],
		potentialConnection:
			"Where verified supervisor topics overlap with positioning, perception and autonomy — a possible path toward intelligent agricultural UAV systems. Refine together; do not treat as a fixed thesis.",
	},
	"zh-Hans": {
		professor: "【导师姓名 — 会面前替换】",
		researchAreas: [
			"【研究方向 1 — 仅填已核实内容】",
			"【研究方向 2】",
			"【研究方向 3】",
		],
		recentWork: [
			"【相关论文 / 项目 — 仅填已核实】",
			"【实验室方向 / 近期工作 — 仅填已核实】",
		],
		matchingExperience: [
			"RTK / GNSS",
			"嵌入式系统",
			"机器人 / AGV",
			"边缘 AI",
			"传感集成",
			"无人机相关探索",
		],
		connectionFormula: ["RTK", "传感融合", "无人机", "农业感知"],
		potentialConnection:
			"在已核实的导师方向与定位、感知、自主能力的交集处，探索通向智能农业无人机系统的可能路径。与导师一起细化，不作最终课题定论。",
	},
	"zh-Hant": {
		professor: "【導師姓名 — 會議前替換】",
		researchAreas: [
			"【研究方向 1 — 僅填已核實內容】",
			"【研究方向 2】",
			"【研究方向 3】",
		],
		recentWork: [
			"【相關論文 / 專案 — 僅填已核實】",
			"【實驗室方向 / 近期工作 — 僅填已核實】",
		],
		matchingExperience: [
			"RTK / GNSS",
			"嵌入式系統",
			"機器人 / AGV",
			"邊緣 AI",
			"感測整合",
			"無人機相關探索",
		],
		connectionFormula: ["RTK", "感測融合", "無人機", "農業感知"],
		potentialConnection:
			"在已核實的導師方向與定位、感知、自主能力的交集處，探索通向智慧農業無人機系統的可能路徑。與導師一起細化，不作最終課題定論。",
	},
};
