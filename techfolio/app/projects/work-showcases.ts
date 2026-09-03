import type { UniversityShowcase } from "./university-showcases";

export type WorkShowcase = UniversityShowcase;

/** Page-level company intro — shown above the three project cards. */
export const workCompanyIntro = {
	kicker: "Guangzhou Zongheng",
	title: "Company",
	body: [
		"Guangzhou Zongheng Intelligent Technology builds landed hardware for education and industry — robots for university IoT labs, Beidou RTK for farm machines, and heavy-industry AGVs.",
		"I work here as an electronics engineer on boards, remotes, and bring-up. The three projects below are shipped lines with field results and commercial return.",
	],
	image: {
		src: "/experience/work/zongheng/company-team.webp",
		alt: "Zongheng company members group photo",
		width: 1024,
		height: 768,
		caption: "Company team — Guangzhou Zongheng Intelligent Technology.",
	},
} as const;

export const workShowcases: WorkShowcase[] = [
	{
		id: "zongheng-robot",
		title: "Zongheng Robot",
		subtitle: "实讯小车 · VXS-100 · IoT teaching",
		cardImage: {
			src: "/experience/work/zongheng/robot-dock.webp",
			alt: "Zongheng robot with docking station",
			width: 636,
			height: 553,
		},
		spreads: [
			{
				type: "product-hero",
				kicker: "01 · Product",
				title: "Zongheng Robot + 实讯小车",
				subtitle:
					"Education robot paired with the Shixun training car — IoT / Inventing System and embedded fundamentals for university students.",
				image: {
					src: "/experience/work/zongheng/robot-dock.webp",
					alt: "Zongheng robot with docking station",
					width: 636,
					height: 553,
					caption: "Robot — with dock / charge station.",
				},
			},
			{
				type: "duo",
				eyebrow: "02 · Platform",
				heading: "Robot + 实讯小车",
				body: [
					"The Zongheng education robot pairs with the Shixun (实讯) Mecanum training car — docking / charge support for classroom fleets and hands-on IoT labs.",
				],
				tone: "soft",
				mediaFit: "contain",
				images: [
					{
						src: "/experience/work/zongheng/robot-dock.webp",
						alt: "Zongheng robot with docking station",
						width: 636,
						height: 553,
						caption: "Robot — with dock / charge station",
					},
					{
						src: "/experience/work/zongheng/shixun-car.webp",
						alt: "Shixun Mecanum training car chassis",
						width: 1024,
						height: 1024,
						caption: "实讯小车 — Mecanum training platform",
					},
				],
			},
			{
				type: "image-full",
				eyebrow: "03 · Control",
				heading: "VXS-100 handheld voice module",
				body: [
					"VX-X / VXS-100 is the handheld control unit used to operate the Shixun car and Zongheng robots — the bridge between instructor demos and student labs.",
				],
				image: {
					src: "/experience/work/zongheng/vxs-100.webp",
					alt: "VXS-100 handheld voice modules from Zongheng Robotics",
					width: 1024,
					height: 768,
					caption: "VXS-100 — handheld control for robot & 实讯小车.",
				},
				imageTone: "light",
			},
			{
				type: "duo",
				eyebrow: "04 · Teaching",
				heading: "Lectures around the robot",
				body: [
					"Classroom talks and lab sessions center on Zongheng Robot — IoT / Inventing System practice plus embedded fundamentals for university students.",
				],
				tone: "soft",
				mediaFit: "cover",
				images: [
					{
						src: "/experience/work/zongheng/lecture-zongheng.webp",
						alt: "Lecture on Zongheng Robot IoT system analysis",
						width: 1024,
						height: 768,
						caption: "Lecture — 纵横机器人 · IoT system analysis",
					},
					{
						src: "/experience/work/zongheng/lab-teaching.webp",
						alt: "Students learning around Shixun car and laptops",
						width: 1024,
						height: 768,
						caption: "Lab class — hands-on with 实讯小车",
					},
				],
			},
		],
	},
	{
		id: "rtk",
		title: "RTK Positioning",
		subtitle: "Beidou · Farm machinery · Path & coverage",
		cardImage: {
			src: "/experience/work/zongheng/rtk-batch.webp",
			alt: "Batch of Beidou agricultural RTK detection units",
			width: 1024,
			height: 767,
		},
		spreads: [
			{
				type: "product-hero",
				kicker: "01 · Product",
				title: "RTK High-Precision Positioning",
				subtitle:
					"Beidou agricultural machinery operation detection — landed hardware with production volume and field profit.",
				image: {
					src: "/experience/work/zongheng/rtk-batch.webp",
					alt: "Production batch of RTK Beidou farm units",
					width: 1024,
					height: 767,
					caption: "Production batch — 北斗农机作业检测系统.",
				},
			},
			{
				type: "prose",
				eyebrow: "02 · Concept",
				heading: "What it does",
				body: [
					"RTK units give farm machines high-precision real-time positioning so operators can see the working path and spot gaps — places not yet sown, sprayed, or covered in the job pass.",
					"GNSS / Beidou positioning plus 4G wireless keeps telemetry live from the field back to monitoring.",
				],
			},
			{
				type: "duo",
				eyebrow: "03 · Hardware",
				heading: "Station and field mount",
				body: [
					"Industrial RTK mobile stations for bring-up and tractor-mounted units for real agricultural work.",
				],
				tone: "soft",
				mediaFit: "contain",
				images: [
					{
						src: "/experience/work/zongheng/rtk-station.webp",
						alt: "RTK high precision mobile measurement station",
						width: 481,
						height: 359,
						caption: "Station — RTK高精度流动测量站",
					},
					{
						src: "/experience/work/zongheng/rtk-tractor.webp",
						alt: "RTK unit mounted on agricultural tractor in the field",
						width: 476,
						height: 855,
						caption: "Field — tractor-mounted RTK in operation",
					},
				],
			},
			{
				type: "image-full",
				eyebrow: "04 · Outcome",
				heading: "Already landed",
				body: [
					"Shipped in volume for agricultural fleets — a production-ready positioning product with measurable field results and commercial return.",
				],
				image: {
					src: "/experience/work/zongheng/rtk-batch.webp",
					alt: "Multiple powered RTK units on the bench",
					width: 1024,
					height: 767,
					caption: "Ship-ready units — powered indicators on the bench.",
				},
				imageTone: "light",
			},
		],
	},
	{
		id: "agv",
		title: "AGV & Remote",
		subtitle: "Heavy industry · Metal scheduling · STM32 2.4G remote",
		cardImage: {
			src: "/experience/work/zongheng/agv-yellow.webp",
			alt: "Yellow industrial AGV for metal scheduling",
			width: 1024,
			height: 576,
		},
		spreads: [
			{
				type: "product-hero",
				kicker: "01 · Product",
				title: "Industrial AGV",
				subtitle:
					"Heavy-duty Mecanum AGV for metal scheduling on the factory floor — landed and in productive use.",
				image: {
					src: "/experience/work/zongheng/agv-yellow.webp",
					alt: "Yellow AGV with diamond-plate deck and Mecanum wheels",
					width: 1024,
					height: 576,
					caption: "AGV — heavy industry metal scheduling platform.",
				},
			},
			{
				type: "prose",
				eyebrow: "02 · Role",
				heading: "What I built",
				body: [
					"I designed the AGV remote hardware at Zongheng — an STM32-based 2.4G industrial handset for driving this vehicle in metal-scheduling workflows.",
					"Joystick, status display, antenna, and rugged frame: from schematic through a working controller that the team uses in lab and floor tests.",
				],
			},
			{
				type: "duo",
				eyebrow: "03 · Control",
				heading: "2.4G STM32 remote",
				body: [
					"Custom remote paired with the yellow AGV — the hardware contribution I owned for this product line.",
				],
				tone: "soft",
				mediaFit: "contain",
				images: [
					{
						src: "/experience/work/zongheng/agv-remote.webp",
						alt: "Industrial AGV remote controller with joystick",
						width: 810,
						height: 607,
						caption: "Remote — STM32 · 2.4G handset",
					},
					{
						src: "/experience/work/zongheng/agv-team-test.webp",
						alt: "Team testing yellow AGV with red remote in the lab",
						width: 1024,
						height: 768,
						caption: "Test — crew on AGV with remote in hand",
					},
				],
			},
			{
				type: "image-full",
				eyebrow: "04 · Outcome",
				heading: "On the floor",
				body: [
					"Built for heavy-industry metal scheduling — a large Mecanum AGV already deployed where payload and reliability matter, with commercial results behind it.",
				],
				image: {
					src: "/experience/work/zongheng/agv-yellow.webp",
					alt: "Close-up of industrial yellow AGV",
					width: 1024,
					height: 576,
					caption: "AGV deck and Mecanum drive — production hardware.",
				},
				imageTone: "light",
			},
		],
	},
];

export const workInternships = [
	{
		id: "moore",
		role: "Internship",
		company: "Shenzhen Moore Creative",
		companyZh: "深圳摩尔创展科技",
		summary:
			"Software–hardware interaction systems — TouchDesigner with sensor integration for real-time experiential output.",
		highlights: [
			"TouchDesigner + sensor pipelines",
			"Realtime interaction prototypes",
			"Bridging firmware signals to visuals",
		],
		brief: [
			"At Shenzhen Moore Creative Technology I worked on software–hardware interaction systems — connecting sensors and firmware signals into TouchDesigner scenes for realtime experiential output.",
			"The focus was prototyping the bridge between physical input and visual / interactive response, not just a screen demo.",
		],
		image: {
			src: "/experience/work/interactive-visuals.webp",
			alt: "Interactive visuals and sensor integration at Moore Creative",
			width: 1600,
			height: 900,
			caption: "Interaction prototype — sensors into TouchDesigner visuals.",
		},
	},
	{
		id: "cvte",
		role: "Internship",
		company: "Guangzhou CVTE",
		companyZh: "广州视源电子",
		summary:
			"Display PCB layout in Altium Designer — high-speed routing, impedance matching, and SMT-aware placement.",
		highlights: [
			"Altium display board layout",
			"High-speed lines & impedance",
			"SMT-ready placement discipline",
		],
		brief: [
			"At Guangzhou CVTE (视源电子) I focused on display PCB layout in Altium Designer — high-speed routing, impedance matching, and placement that stays SMT-ready.",
			"That layout discipline still shows up in every board I design after this internship.",
		],
		image: {
			src: "/experience/work/pcb-layout.webp",
			alt: "PCB layout work in Altium Designer at CVTE",
			width: 1600,
			height: 900,
			caption: "Display PCB layout — Altium high-speed routing.",
		},
	},
] as const;

/** Full-time company + internships — used on the About journey Companies stage. */
export const workCompanies = [
	{
		id: "zongheng",
		role: "Full-time",
		company: "Guangzhou Zongheng",
		companyZh: "广州纵横智能科技",
		summary:
			"Electronics engineer on education robots, Beidou RTK, and industrial AGV remotes — boards, bring-up, and field results.",
		highlights: [
			"Education robots & IoT teaching fleets",
			"Beidou RTK for farm machinery",
			"Heavy-industry AGV remotes & bring-up",
		],
		brief: [
			...workCompanyIntro.body,
			"Day to day I own board bring-up, remotes, and the path from prototype to something that stays working in the field.",
		],
		image: workCompanyIntro.image,
	},
	...workInternships,
] as const;