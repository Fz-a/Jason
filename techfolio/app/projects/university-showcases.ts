import type { ProjectImage } from "./project-data";

export type ShowcaseSpread =
	| {
			type: "cover";
			kicker: string;
			title: string;
			subtitle: string;
			image?: ProjectImage;
	  }
	| {
			type: "product-hero";
			kicker?: string;
			title: string;
			subtitle?: string;
			image: ProjectImage;
	  }
	| {
			type: "prose";
			heading: string;
			body: string[];
			eyebrow?: string;
	  }
	| {
			type: "feature-list";
			heading: string;
			items: string[];
	  }
	| {
			type: "image-full";
			image: ProjectImage;
			eyebrow?: string;
			heading?: string;
			body?: string[];
			imageTone?: "light" | "dark";
	  }
	| {
			type: "split";
			heading: string;
			body: string[];
			image: ProjectImage;
			imageSide?: "left" | "right";
	  }
	| {
			type: "duo";
			heading?: string;
			eyebrow?: string;
			body?: string[];
			images: [ProjectImage, ProjectImage];
			tone?: "default" | "soft";
			mediaFit?: "contain" | "cover";
	  }
	| {
			type: "quad";
			eyebrow: string;
			heading: string;
			body: string[];
			images: [ProjectImage, ProjectImage, ProjectImage, ProjectImage];
			mediaFit?: "contain" | "cover";
	  }
	| {
			type: "hardware-stage";
			eyebrow: string;
			heading: string;
			body: string[];
			boards: ProjectImage;
			layout: ProjectImage;
	  }
	| {
			type: "phones";
			eyebrow: string;
			heading: string;
			body: string[];
			images: [ProjectImage, ProjectImage];
	  }
	| {
			type: "system-map";
			eyebrow: string;
			heading: string;
			body: string[];
			columns: {
				title: string;
				items: string[];
			}[];
			diagram?: ProjectImage;
	  }
	| {
			type: "cinema-hero";
			kicker: string;
			title: string;
			subtitle: string;
			image: ProjectImage;
	  }
	| {
			type: "mosaic";
			eyebrow: string;
			heading: string;
			body: string[];
			feature: ProjectImage;
			side: ProjectImage;
	  }
	| {
			type: "quote-band";
			quote: string;
			meta: string;
	  };

export type UniversityShowcase = {
	id: string;
	title: string;
	subtitle: string;
	cardImage: ProjectImage;
	/** Short lines shown on card hover — keeps the page denser without extra sections. */
	preview?: string[];
	spreads: ShowcaseSpread[];
};

export const universityShowcases: UniversityShowcase[] = [
	{
		id: "smart-clothes",
		title: "Smart Clothes for Elderly",
		subtitle: "Wearable monitoring · Mini program · Family alerts",
		preview: [
			"Vest sensing module + Edge/Cloud pipeline",
			"Family mini program for vitals & status",
			"Hardware boards through PCB bring-up",
		],
		cardImage: {
			src: "/experience/university/smart-clothes/smart-vest.webp",
			alt: "Smart monitoring vest",
			width: 1024,
			height: 1024,
		},
		spreads: [
			{
				type: "product-hero",
				kicker: "01 · Product",
				title: "Smart Clothes for Elderly",
				subtitle: "Wearable care that senses, alerts, and stays with the family.",
				image: {
					src: "/experience/university/smart-clothes/smart-vest.webp",
					alt: "Smart monitoring vest",
					width: 1024,
					height: 1024,
					caption: "Everyday form — sensing module in the chest pocket.",
				},
			},
			{
				type: "image-full",
				eyebrow: "02 · Concept",
				heading: "What it is",
				body: [
					"A garment that watches an elder’s body signals in real time, works with a camera when something looks wrong, contacts family, and raises an alarm for a fast response.",
					"Posture, location, heart rate, and temperature stream into a mini program so relatives can follow status without standing next to the device.",
				],
				image: {
					src: "/experience/university/smart-clothes/system-architecture.png",
					alt: "System architecture of the smart elderly care monitoring system",
					width: 2487,
					height: 1089,
					caption: "System overview — sensing, cloud, and family interaction",
				},
				imageTone: "light",
			},
			{
				type: "hardware-stage",
				eyebrow: "03 · Hardware",
				heading: "Boards first",
				body: [
					"Compact wearable modules carry sensing, power, and wireless links—light enough for daily wear, dense enough for vitals and alerts.",
					"PCB layout ties HR and TEMP channels, power control, and IO into one bring-up path.",
				],
				boards: {
					src: "/experience/university/smart-clothes/wearable-module.webp",
					alt: "Wearable PCB module front and back",
					width: 1024,
					height: 743,
					caption: "Wearable module — front / back product views",
				},
				layout: {
					src: "/experience/university/smart-clothes/pcb-layout.webp",
					alt: "PCB layout for the smart monitoring board",
					width: 567,
					height: 360,
					caption: "PCB layout — routing for HR, TEMP, and power",
				},
			},
			{
				type: "duo",
				eyebrow: "04 · Edge & Cloud",
				heading: "From the edge to the cloud",
				body: [
					"Edge compute handles heavier sensing and vision cues. Cloud messaging keeps telemetry live for monitoring and family-facing views.",
				],
				tone: "soft",
				images: [
					{
						src: "/experience/university/smart-clothes/k210-board.webp",
						alt: "K210 edge compute board",
						width: 1024,
						height: 768,
						caption: "Edge — on-device compute",
					},
					{
						src: "/experience/university/smart-clothes/emqx-dashboard.webp",
						alt: "EMQX cloud messaging dashboard",
						width: 567,
						height: 287,
						caption: "Cloud — live messaging & connections",
					},
				],
			},
			{
				type: "phones",
				eyebrow: "05 · Mini Program",
				heading: "Family view",
				body: [
					"Two compact screens for relatives: live status at a glance, and trend charts when they want the story over time.",
				],
				images: [
					{
						src: "/experience/university/smart-clothes/miniapp-status.webp",
						alt: "Mini program status overview",
						width: 284,
						height: 613,
						caption: "Status",
					},
					{
						src: "/experience/university/smart-clothes/miniapp-vitals.webp",
						alt: "Mini program vitals charts",
						width: 287,
						height: 613,
						caption: "Trends",
					},
				],
			},
		],
	},
	{
		id: "fire-warning",
		title: "Early Fire Warning System",
		subtitle: "Deep learning · Jetson · Aliyun IoT · Phone alert",
		preview: [
			"From fire-car robot to camera-first detection",
			"Jetson edge + Aliyun IoT topics",
			"Phone alerts when flame is confirmed",
		],
		cardImage: {
			src: "/experience/university/fire-warning/fire-car-robot.webp",
			alt: "Early fire warning robot car with camera",
			width: 1024,
			height: 750,
		},
		spreads: [
			{
				type: "product-hero",
				kicker: "01 · Product",
				title: "Early Fire Warning System",
				subtitle:
					"Deep-learning smoke and flame detection with cloud upload and automatic phone alerts.",
				image: {
					src: "/experience/university/fire-warning/fire-car-robot.webp",
					alt: "Mobile robot platform with camera and Jetson compute",
					width: 1024,
					height: 750,
					caption: "Phase 1 — mobile platform: car + camera + edge compute.",
				},
			},
			{
				type: "prose",
				eyebrow: "02 · Concept",
				heading: "What it is",
				body: [
					"A deep-learning early fire warning system for factories, warehouses, and campuses: cameras watch for smoke and flame around the clock, then push alerts to the cloud and call emergency contacts.",
					"YOLOv5 (lightened for embedded devices) runs on Jetson-class hardware. When fire is detected, an IoT module reports the camera ID and can dial a preset phone number while the mini program flags the abnormal channel in red.",
				],
			},
			{
				type: "duo",
				eyebrow: "03 · Evolution",
				heading: "From car + camera to pure camera",
				body: [
					"We started on a mobile robot—drive unit, stereo/LiDAR sensing, and onboard compute—so the team could validate detection while moving.",
					"Later we simplified to a fixed Hikvision camera on a tripod with Jetson edge compute and a cellular/IoT board—easier to deploy at scale without the chassis.",
				],
				tone: "soft",
				images: [
					{
						src: "/experience/university/fire-warning/fire-car-robot.webp",
						alt: "Fire-car robot with Mecanum wheels and sensors",
						width: 1024,
						height: 750,
						caption: "Start — vehicle + camera platform",
					},
					{
						src: "/experience/university/fire-warning/camera-jetson.webp",
						alt: "Hikvision camera with Jetson and IoT antenna board",
						width: 1024,
						height: 575,
						caption: "Later — pure camera + edge + modem",
					},
				],
			},
			{
				type: "split",
				heading: "Vision model",
				body: [
					"Flame and smoke samples were collected, cleaned, and labeled (thousands of frames) for YOLOv5 training, then lightened so the model fits embedded runtime with only a small accuracy trade-off.",
					"Detection boxes mark fire and smoke in real scenes—parking lots, industrial chimneys, building exteriors—before the alert path fires.",
				],
				image: {
					src: "/experience/university/fire-warning/detection-dataset.webp",
					alt: "YOLO fire and smoke detection samples with bounding boxes",
					width: 341,
					height: 284,
					caption: "Detection samples — smoke / flame bounding boxes",
				},
				imageSide: "right",
			},
			{
				type: "image-full",
				eyebrow: "04 · Field test",
				heading: "Live detection on the edge",
				body: [
					"On-device runs of the detection script print fire / no-fire lines in real time. Bench tests with a lighter confirmed the pipeline from camera frame to alert trigger.",
				],
				image: {
					src: "/experience/university/fire-warning/lighter-test.webp",
					alt: "Terminal fire detection output with live camera test",
					width: 341,
					height: 284,
					caption: "Bench test — lighter flame vs. detection log",
				},
				imageTone: "light",
			},
			{
				type: "duo",
				eyebrow: "05 · Cloud",
				heading: "Aliyun IoT & MQTT",
				body: [
					"AT-command flows authenticate to Aliyun, then publish fire status over MQTT. Custom topics handle update / error / get for each device.",
				],
				tone: "soft",
				images: [
					{
						src: "/experience/university/fire-warning/mqtt-logs.webp",
						alt: "AT command logs connecting fire_car to Aliyun MQTT",
						width: 341,
						height: 284,
						caption: "Device logs — fire_car MQTT publish",
					},
					{
						src: "/experience/university/fire-warning/aliyun-topics.webp",
						alt: "Aliyun IoT custom topic list for the product",
						width: 341,
						height: 287,
						caption: "Cloud console — custom topic classes",
					},
				],
			},
			{
				type: "duo",
				eyebrow: "06 · Alerts",
				heading: "Phone call & mini program",
				body: [
					"When fire is flagged, the modem can dial an emergency number while the mini program marks the abnormal camera in red for staff on site.",
				],
				tone: "soft",
				images: [
					{
						src: "/experience/university/fire-warning/phone-alert.webp",
						alt: "Phone receiving automated fire alert call",
						width: 341,
						height: 284,
						caption: "Phone alert — AT dial on detect",
					},
					{
						src: "/experience/university/fire-warning/robotapp-cameras.webp",
						alt: "ROBOTAPP camera status grid with one abnormal channel",
						width: 341,
						height: 284,
						caption: "Mini program — camera channels & anomaly",
					},
				],
			},
		],
	},
	{
		id: "robotman",
		title: "Robotman Team",
		subtitle: "萝卜丁 · Competitions · Lab builds · Pitches",
		preview: [
			"Lab builds and campus / Shaoguan pitches",
			"Competition awards on the desk",
			"Team model as the public face of 萝卜丁",
		],
		cardImage: {
			src: "/experience/university/robotman/team-model.webp",
			alt: "Robotman team with project model",
			width: 1024,
			height: 575,
		},
		spreads: [
			{
				type: "product-hero",
				kicker: "01 · Team",
				title: "Robotman · 萝卜丁",
				subtitle:
					"A campus engineering crew behind smart wearables, early fire warning, and competition demos.",
				image: {
					src: "/experience/university/robotman/team-model.webp",
					alt: "Full Robotman team with urban model and handshake",
					width: 1024,
					height: 575,
					caption: "Team portrait — builders around the model.",
				},
			},
			{
				type: "prose",
				eyebrow: "02 · Who we are",
				heading: "Builders first",
				body: [
					"Robotman brings together electronics, embedded software, vision, structure, and storytelling — the same people who moved early fire warning from a robot car to a pure-camera edge box.",
					"Lab nights, pitch rehearsals, and award stages stay one loop: ship the prototype, then tell it clearly.",
				],
			},
			{
				type: "image-full",
				eyebrow: "03 · Identity",
				heading: "The banner",
				body: [
					"ROBOT MAN · 萝卜丁 — the name we carry into contests and demos.",
				],
				image: {
					src: "/experience/university/robotman/robotman-banner.webp",
					alt: "Robotman team holding the ROBOT MAN banner",
					width: 1024,
					height: 575,
					caption: "Team banner — Robotman / 萝卜丁.",
				},
				imageTone: "light",
			},
			{
				type: "quad",
				eyebrow: "04 · Moments",
				heading: "Lab, stage, and harder rooms",
				body: [
					"Bench debug, auditorium pitches, campus contests, and Shaoguan finals — four frames from the same crew.",
				],
				mediaFit: "cover",
				images: [
					{
						src: "/experience/university/robotman/lab-collab.webp",
						alt: "Two teammates debugging together in the robotics lab",
						width: 1024,
						height: 574,
						caption: "Lab — pair debug at the bench",
					},
					{
						src: "/experience/university/robotman/pitch-stage.webp",
						alt: "Three teammates presenting core tech on stage",
						width: 1024,
						height: 768,
						caption: "Stage — product intro & detection metrics",
					},
					{
						src: "/experience/university/robotman/pitch-campus.webp",
						alt: "Team presenting at campus innovation competition",
						width: 1024,
						height: 768,
						caption: "Campus — innovation contest lineup",
					},
					{
						src: "/experience/university/robotman/pitch-shaoguan.webp",
						alt: "Team member presenting at Shaoguan Big Data competition",
						width: 1024,
						height: 682,
						caption: "Shaoguan — big data innovation stage",
					},
				],
			},
			{
				type: "image-full",
				eyebrow: "05 · Awards",
				heading: "Results on the desk",
				body: [
					"China International College Students’ Innovation Competition (2023) Guangdong Division bronze, plus the 14th E-commerce Innovation Challenge second prize — with the project notes still on the bench.",
				],
				image: {
					src: "/experience/university/robotman/awards-desk.webp",
					alt: "Competition award boards, trophy, and project sticky notes on the lab desk",
					width: 1024,
					height: 574,
					caption: "Awards — boards, trophy, and project stickies.",
				},
				imageTone: "light",
			},
		],
	},
];

/** Campus product / team projects (first row on University). */
export const universityProjectShowcases = universityShowcases;

/** Campus departments — second row under projects. */
export const universityDepartmentShowcases: UniversityShowcase[] = [
	{
		id: "defense-education",
		title: "国防教育教导队",
		subtitle: "National Defense Education · Campus duty",
		preview: [
			"Organized campus service and drills",
			"Ceremony support under real schedules",
			"Coordination with instructors and peers",
		],
		cardImage: {
			src: "/experience/society/volunteer.webp",
			alt: "National Defense Education cadre campus service",
			width: 1600,
			height: 900,
		},
		spreads: [
			{
				type: "product-hero",
				kicker: "01 · Department",
				title: "国防教育教导队",
				subtitle:
					"National Defense Education Teaching Team — campus duty, drills, and ceremony support with the cadre.",
				image: {
					src: "/experience/society/volunteer.webp",
					alt: "Defense education team campus activity",
					width: 1600,
					height: 900,
					caption: "Campus duty — defense education cadre.",
				},
			},
			{
				type: "prose",
				eyebrow: "02 · Role",
				heading: "What I did",
				body: [
					"In the National Defense Education Teaching Team I took part in organized campus service — drills, ceremony support, and day-to-day coordination with the team.",
					"The role taught discipline, clear communication under schedule pressure, and how to work as one unit with instructors and classmates.",
				],
			},
			{
				type: "feature-list",
				heading: "Focus",
				items: [
					"Campus duty and ceremony support",
					"Team coordination with instructors and peers",
					"Showing up on schedule for public campus moments",
				],
			},
		],
	},
	{
		id: "drone-workstation",
		title: "无人机工作站",
		subtitle: "Drone workstation · Outreach & safety",
		preview: [
			"Publicity and public-facing demos",
			"Flight safety briefings",
			"Making UAVs approachable on campus",
		],
		cardImage: {
			src: "/experience/university/team-model.webp",
			alt: "Drone workstation outreach activity",
			width: 1600,
			height: 900,
		},
		spreads: [
			{
				type: "product-hero",
				kicker: "01 · Department",
				title: "无人机工作站",
				subtitle:
					"Drone workstation — publicity, safety-minded demos, and campus outreach around UAVs.",
				image: {
					src: "/experience/university/team-model.webp",
					alt: "Drone workstation public engagement",
					width: 1600,
					height: 900,
					caption: "Outreach — drone workstation presence.",
				},
			},
			{
				type: "prose",
				eyebrow: "02 · Role",
				heading: "What I did",
				body: [
					"At the drone workstation I helped with publicity and public-facing work — introducing flight safety, demos, and how the team presents robotics to a wider campus audience.",
					"It connected engineering practice with outreach: explain carefully, keep people safe, and make UAVs approachable without dumbing them down.",
				],
			},
			{
				type: "feature-list",
				heading: "Focus",
				items: [
					"Workstation publicity and demos",
					"Safety briefings for public audiences",
					"Bridging UAV tech with campus outreach",
				],
			},
		],
	},
];

/** All five University cards — projects then departments. */
export const universityAllShowcases: UniversityShowcase[] = [
	...universityProjectShowcases,
	...universityDepartmentShowcases,
];

export function getShowcaseById(id: string) {
	return universityAllShowcases.find((item) => item.id === id);
}
