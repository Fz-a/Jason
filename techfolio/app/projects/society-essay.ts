export type SocietyImage = {
	src: string;
	alt: string;
	width: number;
	height: number;
	caption?: string;
	fit?: "cover" | "contain";
};

export type SocietyEssayBlock =
	| {
			type: "opener";
			kicker: string;
			title: string;
			lede: string;
	  }
	| {
			type: "chapter";
			num: string;
			title: string;
			titleZh?: string;
			body: string[];
			image?: SocietyImage;
			gallery?: SocietyImage[];
			imageSide?: "left" | "right" | "full";
			pull?: string;
	  }
	| {
			type: "duo-exhibit";
			num: string;
			title: string;
			titleZh?: string;
			body: string[];
			images: [SocietyImage, SocietyImage];
	  };

/**
 * Continuous Society essay — four quiet chapters, one scroll.
 * 1 Volunteer · 2 Xinghuo · 3 Chaihuo · 4 Low-altitude + robot exhibits
 */
export const societyEssay: SocietyEssayBlock[] = [
	{
		type: "opener",
		kicker: "Society",
		title: "Showing up — outside the lab",
		lede:
			"A continuous thread of campus service, maker rooms, and public halls. Not separate boxes — one path of being present with people, tools, and unfinished questions.",
	},
	{
		type: "chapter",
		num: "01",
		title: "Volunteering",
		titleZh: "志愿者证 · 作志愿 · 抗疫",
		body: [
			"Campus volunteering was never a single afternoon. It was a paper trail and a body of work: the Guangdong Voluntary Service Time Certificate as proof — 224 hours and 31 minutes on record — the shifts themselves as practice, and the harder public days of epidemic-response duty (抗疫), in PPE and yellow vests, when showing up meant steadiness more than speeches.",
			"Guiding elders through a phone screen, taking temperatures under blue tents, standing the post with the team: the same lesson as any bench job. You prepare, you hold your place, and you leave the room a little clearer than you found it.",
			"Those hours sit at the start of this Society scroll because they are the ground — service before spectacle, credentials before cameras.",
		],
		image: {
			src: "/experience/society/volunteer-certificate.webp",
			alt: "Guangdong Voluntary Service Time Certificate for Jinyang Chen",
			width: 900,
			height: 1200,
			caption: "广东省志愿服务时间证书 — 224小时31分钟 · 一星志愿者",
			fit: "contain",
		},
		gallery: [
			{
				src: "/experience/society/volunteer-guide.webp",
				alt: "Guiding a resident on a smartphone during volunteer service",
				width: 1200,
				height: 900,
				caption: "作志愿 — walking someone through the screen, one step at a time",
			},
			{
				src: "/experience/society/volunteer-ppe.webp",
				alt: "Temperature screening in PPE during epidemic-response volunteering",
				width: 900,
				height: 1200,
				caption: "抗疫 — PPE, thermometer, and the discipline of a public line",
			},
		],
		imageSide: "right",
		pull:
			"224 hours on paper. Yellow vest and face shield in the field. Showing up was the whole point.",
	},
	{
		type: "chapter",
		num: "02",
		title: "Xinghuo",
		titleZh: "贾立川 · 星火会 · HUBDAY 2025",
		body: [
			"Jia Lichuan’s Xinghuo session — HUBDAY 2025 — opened a different register: less campus duty, more spark. In a bright lobby of makers and listeners, blue pamphlets in hand, phones open, the talk was not about grades but about how practice catches fire when people share unfinished work.",
			"I left with notes that were not assignments: how a story is told, how a board is framed, how curiosity looks when it sits across a table instead of a syllabus.",
			"Xinghuo sits here as the first turn outward — from serving the campus to joining a wider conversation about making.",
		],
		image: {
			src: "/experience/society/xinghuo-hubday.webp",
			alt: "Peers at Xinghuo HUBDAY 2025 reading pamphlets and phones",
			width: 1400,
			height: 1000,
			caption: "星火会 HUBDAY 2025 — spark, pamphlets, and unfinished questions",
		},
		imageSide: "left",
		pull:
			"A spark is small until someone names it in a room full of makers.",
	},
	{
		type: "chapter",
		num: "03",
		title: "Chaihuo",
		titleZh: "柴火创客 · FAB LAB",
		body: [
			"At Chaihuo Makers / Fab Lab Chaihuo the door itself is a statement — flame logo, glass, SMART GREENHOUSE posters, and a workshop that treats making as a social space. Standing there with a thumbs-up was less a souvenir than a reminder: learn where people build.",
			"Inside, the air is denser: benches, demos, questions asked with solder still warm in memory. Builders explain trade-offs, fail in public, and trade notes without waiting for a perfect slide.",
			"If Xinghuo was the spark, Chaihuo was the forge — repeated contact with makers who keep the workbench open.",
		],
		image: {
			src: "/experience/society/chaihuo-entrance.webp",
			alt: "At the entrance of Chaihuo Makers Fab Lab",
			width: 1200,
			height: 1400,
			caption: "柴火创客 CHAIHUO MAKERS — Fab Lab at the door",
		},
		imageSide: "right",
		pull:
			"In maker rooms, the best curriculum is another person’s unfinished build.",
	},
	{
		type: "duo-exhibit",
		num: "04",
		title: "Exhibitions",
		titleZh: "低空经济展 · 机器人展",
		body: [
			"Public halls close the scroll. At the low-altitude / UAV floors — booths like HUANYU AIR with police multi-purpose payloads lined on white counters — industry stages flight systems for a general audience: throwers labeled, walls of specs, a fixed-wing hanging from the truss.",
			"Across the aisle, the robot exhibition puts bodies in the room: a humanoid with a blue visor, quadruped robot dogs, officers standing behind them under a banner for police equipment and UAV prevention technology.",
			"Walking those floors is different from volunteering or maker talk. Here the question is how a field stages itself — what is lit, what is labeled, what is left for the visitor to feel. From campus service, through spark and forge, into the big rooms where technology is put on display.",
		],
		images: [
			{
				src: "/experience/society/huanyu-air-booth.webp",
				alt: "HUANYU AIR booth with police multi-purpose UAV payloads",
				width: 1600,
				height: 900,
				caption: "低空 / 无人机展 — HUANYU AIR · 警用多用途负载",
			},
			{
				src: "/experience/society/robot-police-exhibit.webp",
				alt: "Humanoid and robot dogs at police equipment and UAV exhibition",
				width: 1000,
				height: 1400,
				caption: "机器人展 — 警用装备与无人机防控主题展",
			},
		],
	},
];
