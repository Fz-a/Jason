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
			"One continuous scroll — volunteering (certificate, service, 抗疫), Jia Lichuan’s Xinghuo HUBDAY, Chaihuo Fab Lab, then low-altitude UAV and robot exhibitions.",
		cardSummary:
			"Volunteer service, Xinghuo & Chaihuo, low-altitude UAV and robot exhibitions — one Society scroll.",
		cardImage: {
			src: "/experience/society/volunteer-guide.webp",
			alt: "Campus volunteering",
			width: 1200,
			height: 900,
		},
		tags: ["Volunteer", "Xinghuo", "Chaihuo", "Exhibition"],
		blocks: [],
	},
	{
		slug: "make",
		title: "MAKE",
		shortTitle: "MAKE",
		summary:
			"Smart Helmet first — exhibition and booth — then nine DIY builds in a product carousel.",
		cardSummary:
			"MAKE — Smart Helmet plus nine DIY electronics from the workbench.",
		cardImage: {
			src: "/experience/make/helmet-product.webp",
			alt: "MAKE — smart helmet exhibition demo",
			width: 1600,
			height: 900,
		},
		tags: ["Helmet", "DIY", "Electronics", "Hardware"],
		blocks: [],
	},
];

export function getProjectBySlug(slug: string) {
	return projects.find((project) => project.slug === slug);
}
