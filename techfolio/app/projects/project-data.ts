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
			"Electronic Information Engineering at Guangzhou Software Institute — top 5% of my major, hands-on team projects, and 20+ national and provincial awards across embedded systems, PCB design, and robotics.",
		cardSummary:
			"Electronic Information Engineering at Guangzhou Software Institute, top 5%. Led teams on smart wearables and ROS fire-warning systems—PCB, firmware, and pitch decks included. 20+ national and provincial awards.",
		cardImage: {
			src: "/experience/university/awards.webp",
			alt: "National and provincial competition awards with STM32 and deep-learning prototypes",
			width: 1600,
			height: 900,
		},
		tags: ["Embedded", "PCB", "ROS", "Awards"],
		blocks: [
			{
				type: "text",
				title: "Academic Foundation",
				body: [
					"I studied Electronic Information Engineering at Guangzhou Software Institute with a 3.3 GPA, ranking in the top 5% of my major.",
					"Core coursework included circuit analysis, analog electronics, digital logic, embedded systems, and signal processing — building the theoretical base I later applied in competition and industry projects.",
				],
			},
			{
				type: "split-list-image",
				title: "Team Projects",
				intro:
					"Beyond coursework, I led student teams on full-stack hardware projects from concept through demo:",
				items: [
					"Elderly-friendly smart apparel — embedded sensing, firmware, and user-centered design",
					"ROS-based early fire-warning system — sensor fusion, edge alerts, and system integration",
					"PCB schematic and layout, bring-up, and cross-disciplinary coordination",
					"Pitch decks, documentation, and competition submissions",
				],
				image: {
					src: "/experience/university/smart-apparel.webp",
					alt: "Elderly-friendly smart apparel project",
					width: 1600,
					height: 900,
					caption: "Smart apparel prototype — embedded sensing and firmware integration.",
				},
			},
			{
				type: "two-column",
				left: {
					title: "Fire-Warning System",
					body: [
						"Our ROS-based early fire-warning system combined distributed sensing with edge alerts, pushing me to think about reliability, latency, and how software middleware meets real hardware constraints.",
					],
				},
				right: {
					title: "Campus Recognition",
					body: [
						"I served as drone workstation outreach lead and helped teams earn 20+ national and provincial awards — experience that shaped how I communicate technical work to judges and non-engineers alike.",
					],
				},
			},
			{
				type: "figure",
				image: {
					src: "/experience/university/fire-warning.webp",
					alt: "ROS-based early fire-warning system",
					width: 1600,
					height: 900,
					caption: "Early fire-warning system — ROS middleware and sensor integration.",
				},
			},
			{
				type: "gallery",
				title: "Competition & Exhibition",
				columns: 2,
				images: [
					{
						src: "/experience/university/expo.webp",
						alt: "Project exhibition and competition presentation",
						width: 1600,
						height: 900,
						caption: "Competition demo and exhibition setup.",
					},
					{
						src: "/experience/university/smart-apparel.webp",
						alt: "Smart apparel hardware prototype",
						width: 1600,
						height: 900,
						caption: "Wearable hardware bring-up and iteration.",
					},
				],
			},
		],
	},
	{
		slug: "work",
		title: "Work",
		shortTitle: "Work",
		summary:
			"From internships at Zongheng, Moore, and CVTE to full-time electronics engineering — RTK positioning, AGV platforms, AI devices, and the full path from schematic to working prototype.",
		cardSummary:
			"Internships at Zongheng, Moore, and CVTE, now full-time on RTK, AGV, and AI devices—from schematic and layout to bring-up and structural checks.",
		cardImage: {
			src: "/experience/work/team.webp",
			alt: "Engineering team gathering after project delivery",
			width: 1600,
			height: 900,
		},
		tags: ["RTK", "AGV", "Altium", "Prototyping"],
		blocks: [
			{
				type: "text",
				title: "Industry Path",
				body: [
					"Through internships I moved from classroom prototypes toward real product development, then joined Guangzhou Zongheng Intelligent Technology full-time as an electronics engineer.",
					"My work spans schematic and PCB design, component selection, prototyping, debugging, and structural validation — often owning requirements through functional hardware.",
				],
			},
			{
				type: "split-list-image",
				title: "What I've Built",
				intro: "Selected engineering work across internships and full-time roles:",
				items: [
					"Independent 2.4G remote for AGV payload vehicle at Zongheng",
					"Smart greenhouse hardware and field integration",
					"TouchDesigner + sensor systems at Moore Creative",
					"Display PCB layout and high-speed routing at CVTE",
					"RTK modules, AGV platforms, and AI interaction devices in production R&D",
				],
				image: {
					src: "/experience/work/agv-remote.webp",
					alt: "AGV 2.4G remote control hardware",
					width: 1600,
					height: 900,
					caption: "AGV remote — schematic through functional prototype.",
				},
			},
			{
				type: "split-image-text",
				title: "PCB & Layout",
				body: [
					"At CVTE I focused on Altium Designer display layouts — high-speed lines, impedance matching, and SMT-aware placement. That discipline carries into every board I design today.",
				],
				image: {
					src: "/experience/work/pcb-layout.webp",
					alt: "PCB layout in Altium Designer",
					width: 1600,
					height: 900,
				},
			},
			{
				type: "figure",
				image: {
					src: "/experience/work/rtk-module.webp",
					alt: "RTK high-precision positioning module",
					width: 1600,
					height: 900,
					caption: "RTK positioning module — schematic, layout, and bring-up.",
				},
			},
			{
				type: "split-image-text",
				title: "Software-Hardware Interaction",
				body: [
					"At Moore Creative I worked on real-time interaction systems using TouchDesigner and sensor integration — bridging firmware signals with visual and experiential output.",
				],
				image: {
					src: "/experience/work/interactive-visuals.webp",
					alt: "Interactive visuals and sensor integration",
					width: 1600,
					height: 900,
				},
			},
		],
	},
	{
		slug: "society",
		title: "Society",
		shortTitle: "Society",
		summary:
			"Volunteering, maker communities, and campus outreach — bringing more people closer to hardware through demos, safety education, and hands-on events.",
		cardSummary:
			"20+ volunteer sessions, Maker Faire and maker spaces, and campus roles in drone outreach and safety teams—bringing people closer to hardware.",
		cardImage: {
			src: "/experience/society/moto-camp.webp",
			alt: "MOTO CAMP booth — community outreach and hands-on demos",
			width: 1600,
			height: 900,
		},
		tags: ["Volunteering", "Maker", "Campus", "Outreach"],
		blocks: [
			{
				type: "text",
				title: "Community & Outreach",
				body: [
					"I believe hardware becomes meaningful when it reaches people — not only as products, but as something they can see, touch, and understand.",
					"Outside formal work and study, I invest time in volunteer sessions, maker events, and campus roles that lower the barrier to engaging with electronics and robotics.",
				],
			},
			{
				type: "split-list-image",
				title: "Activities",
				intro: "Ways I connect engineering with broader communities:",
				items: [
					"20+ volunteer sessions supporting STEM and community events",
					"Maker Faire and local maker spaces — demos and peer learning",
					"Drone workstation outreach — safety briefings and public engagement",
					"Campus teams bridging engineering projects with non-technical audiences",
				],
				image: {
					src: "/experience/society/volunteer.webp",
					alt: "Volunteer STEM outreach session",
					width: 1600,
					height: 900,
					caption: "Volunteer session — hands-on introduction to hardware.",
				},
			},
			{
				type: "two-column",
				left: {
					title: "Maker Events",
					body: [
						"Maker Faire and maker-space demos let me show prototypes in progress — explaining trade-offs, failures, and iteration in language anyone can follow.",
					],
				},
				right: {
					title: "Why It Matters",
					body: [
						"These experiences sharpen how I explain technical decisions, design for real users, and collaborate across backgrounds — skills that carry directly into product engineering.",
					],
				},
			},
			{
				type: "gallery",
				title: "On the Ground",
				columns: 2,
				images: [
					{
						src: "/experience/society/maker-faire.webp",
						alt: "Maker Faire demonstration",
						width: 1600,
						height: 900,
						caption: "Maker Faire — demo and community engagement.",
					},
					{
						src: "/experience/society/chaihuo.webp",
						alt: "Maker space and community workshop",
						width: 1600,
						height: 900,
						caption: "Maker space collaboration and peer learning.",
					},
				],
			},
		],
	},
	{
		slug: "skills",
		title: "Skills",
		shortTitle: "Skills",
		summary:
			"Altium, embedded development, ROS, Fusion 360, TouchDesigner, and AI-assisted workflows — plus technical writing on GitHub and CSDN.",
		cardSummary:
			"Altium, embedded development, ROS, Fusion 360, TouchDesigner, and AI-assisted workflows. I also share what I learn on GitHub and CSDN.",
		cardImage: {
			src: "/experience/skills/hardware-stack.webp",
			alt: "Embedded STM32 and deep-learning prototypes — hardware and AI toolchain",
			width: 1600,
			height: 900,
		},
		tags: ["Hardware", "Firmware", "AI Tools", "Writing"],
		blocks: [
			{
				type: "text",
				title: "Toolchain Overview",
				body: [
					"My workflow spans schematic capture, PCB layout, firmware bring-up, mechanical checks, and documentation — with AI-assisted tools accelerating review and iteration where they add real leverage.",
				],
			},
			{
				type: "split-list-image",
				title: "Hardware & Firmware",
				items: [
					"Altium Designer — schematic, PCB layout, high-speed and impedance-aware routing",
					"Embedded development — bring-up, debugging, and peripheral integration",
					"ROS — robotics middleware for sensing, navigation, and system orchestration",
					"Prototyping — bench validation, rework, and iteration loops",
				],
				image: {
					src: "/experience/work/pcb-layout.webp",
					alt: "PCB design workflow",
					width: 1600,
					height: 900,
					caption: "Altium layout — from schematic to manufacturable board.",
				},
			},
			{
				type: "two-column",
				left: {
					title: "Design & Interaction",
					body: [
						"Fusion 360 for enclosures and fit checks, TouchDesigner for sensor-driven interaction, and 3D printing for quick structural validation before fabrication.",
					],
				},
				right: {
					title: "Sharing & Writing",
					body: [
						"I document projects on GitHub and publish technical notes on CSDN — turning build logs into resources others can reuse.",
					],
				},
			},
			{
				type: "figure",
				image: {
					src: "/experience/skills/mapping.webp",
					alt: "Geospatial and systems tooling",
					width: 1600,
					height: 900,
					caption: "Systems thinking — connecting data, hardware, and user-facing output.",
				},
			},
			{
				type: "split-image-text",
				title: "Knowledge Base",
				body: [
					"I maintain structured notes and project archives so lessons from one board, one firmware bug, or one field test compound into the next build.",
				],
				image: {
					src: "/experience/skills/knowledge-archive.webp",
					alt: "Technical knowledge archive",
					width: 1600,
					height: 900,
				},
			},
		],
	},
];

export function getProjectBySlug(slug: string) {
	return projects.find((project) => project.slug === slug);
}
