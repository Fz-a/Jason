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
	  };

export type UniversityShowcase = {
	id: string;
	title: string;
	subtitle: string;
	cardImage: ProjectImage;
	spreads: ShowcaseSpread[];
};

export const universityShowcases: UniversityShowcase[] = [
	{
		id: "smart-clothes",
		title: "Smart Clothes for Elderly",
		subtitle: "Wearable monitoring · Mini program · Family alerts",
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
		subtitle: "ROS · Sensor fusion · Edge alerts",
		cardImage: {
			src: "/experience/university/fire-warning.webp",
			alt: "Early fire warning system",
			width: 1600,
			height: 900,
		},
		spreads: [
			{
				type: "cover",
				kicker: "University Project 02",
				title: "Early Fire\nWarning System",
				subtitle:
					"ROS-based early detection with sensor fusion and edge alerts for faster response.",
				image: {
					src: "/experience/university/fire-warning.webp",
					alt: "Fire warning prototype",
					width: 1600,
					height: 900,
				},
			},
			{
				type: "prose",
				heading: "Problem",
				body: [
					"Fires escalate in minutes. Waiting for smoke to fill a room is often too late—especially in labs, workshops, and shared campus spaces.",
					"This project aimed for earlier signals: fuse sensors at the edge, raise alerts locally, and keep latency low enough for people to act.",
				],
			},
			{
				type: "feature-list",
				heading: "System Focus",
				items: [
					"ROS middleware for modular sensing and nodes",
					"Sensor fusion for early anomaly cues",
					"Edge alerts before cloud round-trips",
					"Bring-up, debugging, and demo reliability under real constraints",
				],
			},
			{
				type: "image-full",
				image: {
					src: "/experience/university/fire-warning.webp",
					alt: "Fire warning hardware demo",
					width: 1600,
					height: 900,
					caption: "Prototype demo — sensing path into ROS nodes",
				},
			},
			{
				type: "split",
				heading: "From Hardware to Middleware",
				body: [
					"The hard part was not a single sensor reading—it was reliability across nodes: noise, false positives, and how firmware signals become actionable alerts.",
					"Working in ROS pushed the team to treat software and hardware as one system, with latency and failure modes designed in from the start.",
				],
				image: {
					src: "/experience/university/expo.webp",
					alt: "Project exhibition",
					width: 1600,
					height: 900,
					caption: "Exhibition and competition presentation",
				},
				imageSide: "right",
			},
			{
				type: "prose",
				heading: "Outcome",
				body: [
					"The system became a full-stack learning loop: PCB and firmware bring-up, ROS integration, and pitching the story to judges—the same path later used on wearable and robotics projects.",
				],
			},
		],
	},
	{
		id: "robotman",
		title: "Robotman Team",
		subtitle: "Competition · Collaboration · Campus makers",
		cardImage: {
			src: "/experience/university/team-model.webp",
			alt: "Robotman team with project model",
			width: 1024,
			height: 575,
		},
		spreads: [
			{
				type: "cover",
				kicker: "University Project 03",
				title: "Robotman\nTeam",
				subtitle:
					"A student engineering crew building prototypes, competing nationally, and shipping demos together.",
				image: {
					src: "/experience/university/team-model.webp",
					alt: "Team with smart-city model",
					width: 1024,
					height: 575,
				},
			},
			{
				type: "prose",
				heading: "Who We Are",
				body: [
					"Robotman is the university team behind smart wearables, fire-warning systems, and campus robotics demos—roles spanning PCB, firmware, mechanical structure, and pitch decks.",
					"The handshake in the lab photo is the point: projects only ship when hardware, software, and storytelling move as one.",
				],
			},
			{
				type: "image-full",
				image: {
					src: "/experience/university/team-model.webp",
					alt: "Team group photo with model",
					width: 1024,
					height: 575,
					caption: "Team milestone — model build and collaboration",
				},
			},
			{
				type: "feature-list",
				heading: "How We Work",
				items: [
					"Cross-discipline ownership: electronics, embedded, structure, demo",
					"Iterate in the lab—prototype, fail, revise, present",
					"National and provincial competitions as hard deadlines",
					"Teach and show: exhibitions, outreach, and peer learning",
				],
			},
			{
				type: "duo",
				heading: "Awards & Demos",
				images: [
					{
						src: "/experience/university/awards.webp",
						alt: "Competition awards and prototypes",
						width: 1600,
						height: 900,
						caption: "Competition boards and hardware on the bench",
					},
					{
						src: "/experience/university/expo.webp",
						alt: "Exhibition booth",
						width: 1600,
						height: 900,
						caption: "Public demo and exhibition setup",
					},
				],
			},
			{
				type: "split",
				heading: "What It Taught Me",
				body: [
					"Leading and contributing inside Robotman sharpened system thinking: schematic to demo, teammate handoffs, and explaining trade-offs to non-engineers.",
					"Those habits carried into internships and full-time electronics work—still the same loop of build, measure, and tell the story clearly.",
				],
				image: {
					src: "/experience/university/smart-apparel.webp",
					alt: "Team hardware prototype",
					width: 1600,
					height: 900,
					caption: "Hardware iteration from the team pipeline",
				},
				imageSide: "left",
			},
		],
	},
];

export function getShowcaseById(id: string) {
	return universityShowcases.find((item) => item.id === id);
}
