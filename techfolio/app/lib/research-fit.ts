/**
 * Research Fit — customize per supervisor meeting.
 * Only insert verified professor information. Never invent papers or claims.
 *
 * Before each meeting, edit this file.
 */

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

export const researchFit: ResearchFitConfig = {
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
};
