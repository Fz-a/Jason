export type ProjectImage = {
	src: string;
	alt: string;
	width: number;
	height: number;
	caption?: string;
};

export type ProjectDetailBlock =
	| {
			type: "text";
			title: string;
			body: string[];
	  }
	| {
			type: "list";
			title: string;
			intro?: string;
			items: string[];
	  }
	| {
			type: "split-list-image";
			title: string;
			intro?: string;
			items: string[];
			image: ProjectImage;
	  }
	| {
			type: "split-image-text";
			title: string;
			body: string[];
			image: ProjectImage;
	  }
	| {
			type: "two-column";
			left: { title: string; body: string[] };
			right: { title: string; body: string[] };
	  }
	| {
			type: "figure";
			image: ProjectImage;
	  }
	| {
			type: "gallery";
			title?: string;
			columns?: 1 | 2;
			images: ProjectImage[];
	  };

export type ProjectDetail = {
	slug: string;
	title: string;
	shortTitle: string;
	summary: string;
	cardSummary: string;
	cardImage?: ProjectImage;
	tags: string[];
	links?: { label: string; href: string }[];
	blocks: ProjectDetailBlock[];
};

export const projects: ProjectDetail[] = [
	{
		slug: "university",
		title: "University",
		shortTitle: "University",
		summary:
			"Campus projects and campus departments — smart clothes, fire warning, Robotman, plus 国防教育教导队 and 无人机工作站.",
		cardSummary:
			"Three campus project briefs plus two departments: defense education cadre and drone workstation.",
		cardImage: {
			src: "/experience/university/team-model.webp",
			alt: "University team with smart-city model project",
			width: 1600,
			height: 900,
		},
		tags: ["Projects", "Departments", "Wearable", "ROS", "UAV"],
		blocks: [],
	},
	{
		slug: "work",
		title: "Work",
		shortTitle: "Work",
		summary:
			"Full-time at Guangzhou Zongheng — three landed product lines — plus earlier internships at Moore Creative and CVTE.",
		cardSummary:
			"Zongheng full-time (robots, RTK, AGV), then internships at Moore and CVTE.",
		cardImage: {
			src: "/experience/work/zongheng/company-team.webp",
			alt: "Zongheng company team",
			width: 1024,
			height: 768,
		},
		tags: ["Zongheng", "Moore", "CVTE", "RTK", "AGV", "STM32"],
		blocks: [],
	},
	{
		slug: "society",
		title: "Society",
		shortTitle: "Society",
		summary:
			"Volunteering, maker meetings, and exhibitions — scroll the page; no cards to open. Exhibition product photos for the helmet live under Venture.",
		cardSummary:
			"Volunteer work, maker meetings (星火 / 柴火), and exhibitions — scroll down.",
		cardImage: {
			src: "/experience/society/chaihuo.webp",
			alt: "Chaihuo maker community exchange",
			width: 1600,
			height: 900,
		},
		tags: ["Volunteer", "Maker", "Exhibition"],
		blocks: [],
	},
	{
		slug: "venture",
		title: "Venture",
		shortTitle: "Venture",
		summary:
			"Smart Helmet — scroll the full venture brief, including exhibition and booth moments for the product.",
		cardSummary:
			"Smart Helmet venture — full scroll brief with exhibition / booth stills.",
		cardImage: {
			src: "/experience/society/maker-faire.webp",
			alt: "Smart helmet venture exhibition demo",
			width: 1600,
			height: 900,
		},
		tags: ["Helmet", "Wearable", "Startup", "Hardware"],
		blocks: [],
	},
];

export function getProjectBySlug(slug: string) {
	return projects.find((project) => project.slug === slug);
}
