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
		subtitle: "Education robot · IoT teaching",
		cardImage: {
			src: "/experience/work/zongheng/robot-product-main.webp",
			alt: "Zongheng education robot with docking station",
			width: 636,
			height: 553,
		},
		spreads: [
			{
				type: "product-hero",
				kicker: "01 · Product",
				title: "Zongheng Robot",
				subtitle:
					"Education robot for university IoT / Inventing System labs — docking, charge bring-up, fleet demos, and the embedded fundamentals students build on in class.",
				image: {
					src: "/experience/work/zongheng/robot-product-main.webp",
					alt: "Zongheng education robot with docking station",
					width: 636,
					height: 553,
					caption: "Robot — with dock / charge station.",
				},
			},
			{
				type: "image-full",
				eyebrow: "02 · Specs",
				heading: "NAVI-BOT specifications",
				body: [
					"Full parameter sheet for the education fleet — dimensions, sensing, payload, and battery — the same platform used in university IoT and inventing-system labs.",
				],
				image: {
					src: "/experience/work/zongheng/robot-navi-specs.webp",
					alt: "NAVI-BOT education robot specifications sheet",
					width: 1024,
					height: 682,
					caption: "NAVI-BOT — education robot specs",
				},
				imageTone: "light",
			},
			{
				type: "split",
				heading: "Product positioning",
				body: [
					"NAVI-BOT is positioned as an intelligent mobile base for teaching: multi-sensor fusion, LLM voice interaction, and a payload class that fits classroom demos as well as lab projects.",
					"The banner sits beside the fleet story — not as a twin card, but as the go-to-market face of the same chassis students drive in class.",
				],
				image: {
					src: "/experience/work/zongheng/robot-navi-banner.webp",
					alt: "NAVI-BOT education robot product banner",
					width: 1024,
					height: 571,
					caption: "Banner — intelligent mobile base",
				},
				imageSide: "right",
			},
			{
				type: "image-full",
				eyebrow: "03 · Teaching",
				heading: "Lectures around the robot",
				body: [
					"Classroom talks center on Zongheng Robot — IoT practice plus embedded fundamentals for university students.",
				],
				image: {
					src: "/experience/work/zongheng/robot-lecture-iot.webp",
					alt: "Lecture on Zongheng Robot IoT system analysis",
					width: 1024,
					height: 768,
					caption: "Lecture — 纵横机器人 · IoT system analysis",
				},
				imageTone: "light",
			},
		],
	},
	{
		id: "shixun-car",
		title: "实讯小车",
		subtitle: "Shixun · Mecanum training car",
		cardImage: {
			src: "/experience/work/zongheng/shixun-car.webp",
			alt: "Shixun Mecanum training car chassis",
			width: 1024,
			height: 1024,
		},
		spreads: [
			{
				type: "product-hero",
				kicker: "01 · Product",
				title: "实讯小车",
				subtitle:
					"Mecanum training platform for classroom fleets — paired with Zongheng robots for hands-on IoT and motion labs.",
				image: {
					src: "/experience/work/zongheng/shixun-car.webp",
					alt: "Shixun Mecanum training car chassis",
					width: 1024,
					height: 1024,
					caption: "实讯小车 — Mecanum training platform",
				},
			},
			{
				type: "prose",
				eyebrow: "02 · Role",
				heading: "What it is for",
				body: [
					"The Shixun car is the student-facing chassis in the teaching line — docking and charge support for classroom fleets, and a clear platform for embedded / IoT exercises.",
					"It sits beside the Zongheng robot as a separate product in the same education stack, not a single bundled unit.",
				],
			},
			{
				type: "split",
				heading: "ZH_MCar controller",
				body: [
					"Mainboard for the training car — ESP32 wireless, DC12V in, USB-C, and four motor channels (A–D) for mecanum drive.",
					"Designed as the student-facing control board: bring-up, power, and motion on one PCB rather than a pile of modules.",
				],
				image: {
					src: "/experience/work/zongheng/shixun-pcb.webp",
					alt: "ZH_MCar PCB 3D render for the Shixun training car",
					width: 1024,
					height: 583,
					caption: "ZH_MCar — main controller PCB",
				},
				imageSide: "right",
			},
			{
				type: "image-full",
				eyebrow: "03 · Lab",
				heading: "In the teaching room",
				body: [
					"Lab sessions put students around the chassis and laptops — path control, sensing, and bring-up on a real mecanum platform.",
				],
				image: {
					src: "/experience/work/zongheng/lab-teaching.webp",
					alt: "Students learning around Shixun car and laptops",
					width: 1024,
					height: 768,
					caption: "Lab class — hands-on with 实讯小车",
				},
				imageTone: "light",
			},
		],
	},
	{
		id: "vxs-100",
		title: "VXS-100",
		subtitle: "Handheld voice module · Robot & 实讯 control",
		cardImage: {
			src: "/experience/work/zongheng/vxs-100.webp",
			alt: "Three VXS-100 handheld voice modules standing side by side",
			width: 1024,
			height: 768,
		},
		spreads: [
			{
				type: "product-hero",
				kicker: "01 · Product",
				title: "VXS-100 handheld module",
				subtitle:
					"Handheld voice module for Shixun cars and Zongheng robots — the bridge between instructor demos and student labs.",
				image: {
					src: "/experience/work/zongheng/vxs-100.webp",
					alt: "Three VXS-100 handheld voice modules standing side by side",
					width: 1024,
					height: 768,
					caption: "VXS-100 — Standard Voice Module",
				},
			},
			{
				type: "split",
				heading: "Faceplate & marking",
				body: [
					"Front panel layout for the handheld voice module — brand lockup, VXS-100 title, speaker grille, and company line on an 85 mm tall plate.",
					"Clear silkscreen keeps the remote readable in a teaching demo without looking like a generic enclosure.",
				],
				image: {
					src: "/experience/work/zongheng/vxs-100-faceplate.webp",
					alt: "VXS-100 faceplate drawing with dimensions",
					width: 883,
					height: 765,
					caption: "Faceplate — 85 mm height, grille & LED hole",
				},
				imageSide: "right",
			},
			{
				type: "image-full",
				eyebrow: "02 · Enclosure",
				heading: "Exploded aluminum body",
				body: [
					"Extruded aluminum shell with end caps pulled apart — finned sides, diagonal grille, and ports for antenna / USB bring-up.",
				],
				image: {
					src: "/experience/work/zongheng/vxs-100-explode.webp",
					alt: "Exploded 3D view of the VXS-100 aluminum enclosure",
					width: 1024,
					height: 455,
					caption: "Enclosure — explode view",
				},
				imageTone: "light",
			},
			{
				type: "split",
				heading: "Open chassis",
				body: [
					"Front open view of the assembled unit — USB-C, status LEDs, and board edge visible inside the silver shell.",
					"Antenna mount on the end cap keeps the handheld radio link ready for robot and 实讯 demos.",
				],
				image: {
					src: "/experience/work/zongheng/vxs-100-open.webp",
					alt: "VXS-100 open enclosure showing internal PCB and ports",
					width: 884,
					height: 910,
					caption: "Open chassis — USB-C and LED indicators",
				},
				imageSide: "left",
			},
			{
				type: "image-full",
				eyebrow: "03 · Board",
				heading: "Main PCB",
				body: [
					"Controller board with one-click boot, battery and USB power rails, mic path, and reset / IO0 buttons — the electronics behind the handheld voice module.",
				],
				image: {
					src: "/experience/work/zongheng/vxs-100-pcb.webp",
					alt: "VXS-100 main PCB 3D render",
					width: 772,
					height: 1024,
					caption: "PCB — power, boot, and I/O",
				},
				imageTone: "light",
			},
		],
	},
	{
		id: "rtk",
		title: "RTK Positioning",
		subtitle: "Beidou · Farm machinery · Path & coverage",
		cardImage: {
			src: "/experience/work/zongheng/rtk-base-field.webp",
			alt: "RTK base station on tripod at a field site",
			width: 1024,
			height: 569,
		},
		spreads: [
			{
				type: "product-hero",
				kicker: "01 · Product",
				title: "RTK High-Precision Positioning",
				subtitle:
					"Beidou agricultural machinery operation detection — base and rover stations for centimeter-level path and coverage in the field.",
				image: {
					src: "/experience/work/zongheng/rtk-base-field.webp",
					alt: "RTK base station on tripod at a field site",
					width: 1024,
					height: 569,
					caption: "Base station — field deploy on tripod",
				},
			},
			{
				type: "split",
				heading: "Mobile measurement station",
				body: [
					"Industrial aluminum RTK unit with GNSS antenna and 4G link — the same chassis used as a high-precision mobile measurement station for farm and survey work.",
					"Panel LEDs report network and power at a glance so bring-up stays simple on site.",
				],
				image: {
					src: "/experience/work/zongheng/rtk-unit-desk.webp",
					alt: "RTK high-precision mobile measurement station on a desk",
					width: 481,
					height: 359,
					caption: "RTK高精度流动测量站 — desk view",
				},
				imageSide: "right",
			},
			{
				type: "image-full",
				eyebrow: "02 · Rover",
				heading: "RTK rover station",
				body: [
					"Centimeter-level RTK differentials, multi-source fusion positioning, flexible mounts for UAVs / autonomy / smart farm machines, and NRTK / CORS account support.",
				],
				image: {
					src: "/experience/work/zongheng/rtk-rover-mount.webp",
					alt: "RTK rover station mounted on agricultural machinery",
					width: 656,
					height: 584,
					caption: "Rover — tractor / machine mount",
				},
				imageTone: "light",
			},
			{
				type: "image-full",
				eyebrow: "03 · Base",
				heading: "RTK base station",
				body: [
					"Multi-constellation (Beidou / GPS / GLONASS / Galileo), L1 + L5 dual-frequency reception, live LED status for link and power, and a self-built mode for fast independent deploy.",
				],
				image: {
					src: "/experience/work/zongheng/rtk-base-card.webp",
					alt: "RTK base station on tripod with feature summary",
					width: 656,
					height: 584,
					caption: "Base — multi-constellation field station",
				},
				imageTone: "light",
			},
			{
				type: "image-full",
				eyebrow: "04 · Hardware",
				heading: "Enclosure & interfaces",
				body: [
					"150 × 75 × 83 mm aluminum body with side heat-sink fins — RTK antenna, 4G antenna, external power under the blue cap, and a front power switch with status LEDs.",
				],
				image: {
					src: "/experience/work/zongheng/rtk-dims-sheet.webp",
					alt: "RTK unit dimension drawing and interface callouts",
					width: 621,
					height: 1024,
					caption: "Mechanical — dimensions and ports",
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