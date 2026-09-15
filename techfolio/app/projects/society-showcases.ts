import type { UniversityShowcase } from "./university-showcases";

export type SocietyShowcase = UniversityShowcase;

/** Society = volunteering + maker meetings + exhibitions (text). Helmet exhibition photos live under MAKE. */
export const societyShowcases: SocietyShowcase[] = [
	{
		id: "volunteering",
		title: "Volunteering",
		subtitle: "Certificate · Service · Epidemic response",
		cardImage: {
			src: "/experience/society/volunteer.webp",
			alt: "Volunteer team activity",
			width: 1600,
			height: 900,
		},
		spreads: [
			{
				type: "product-hero",
				kicker: "01 · Volunteer",
				title: "Campus volunteering",
				subtitle:
					"Anti-fraud talks, flag raising, and showing up with the volunteer team — with a provincial service record behind the shifts.",
				image: {
					src: "/experience/society/volunteer.webp",
					alt: "Volunteer session on campus",
					width: 1600,
					height: 900,
					caption: "Volunteer duty — with the team.",
				},
			},
			{
				type: "image-full",
				eyebrow: "02 · Record",
				heading: "Guangdong Voluntary Service Time Certificate",
				body: [
					"Official provincial record — 224 hours 31 minutes on file, registered in Foshan, one-star volunteer. Paper proof that the shifts were real.",
				],
				image: {
					src: "/experience/society/volunteer-certificate.webp",
					alt: "Guangdong Voluntary Service Time Certificate for Jinyang Chen",
					width: 665,
					height: 926,
					caption: "证书 — 224小时31分钟 · 一星志愿者",
				},
				imageTone: "light",
			},
			{
				type: "split",
				heading: "Epidemic-response duty",
				body: [
					"抗疫 shifts meant PPE, a thermometer, and a public line — temperature screening under blue tents when showing up was the whole point.",
					"Same lesson as any bench job: prepare, hold your place, leave the line a little clearer than you found it.",
				],
				image: {
					src: "/experience/society/volunteer-ppe-screen.webp",
					alt: "Temperature screening in PPE during epidemic-response volunteering",
					width: 1024,
					height: 682,
					caption: "抗疫 — PPE screening on campus",
				},
				imageSide: "right",
			},
			{
				type: "prose",
				eyebrow: "03 · Focus",
				heading: "What we did together",
				body: [
					"Anti-fraud education (防诈骗) sessions helped students spot common scams — practical briefings more than slogans.",
					"Flag-raising (升旗) and related ceremony support meant showing up on time, standing the post, and keeping the program running with the rest of the volunteer team.",
				],
			},
			{
				type: "feature-list",
				heading: "Volunteer threads",
				items: [
					"Provincial service certificate — 224h 31m on record",
					"Campus anti-fraud education and student briefings",
					"Flag-raising, ceremony support, and epidemic-response duty",
				],
			},
		],
	},
	{
		id: "xinghuo",
		title: "Xinghuo HUBDAY",
		subtitle: "星火会 · Open-source hardware · Shenzhen 2025",
		cardImage: {
			src: "/experience/society/xinghuo-peers.webp",
			alt: "Peers at Xinghuo HUBDAY 2025 reading pamphlets and phones",
			width: 1024,
			height: 684,
		},
		spreads: [
			{
				type: "product-hero",
				kicker: "01 · Xinghuo",
				title: "星火会 HUBDAY 2025",
				subtitle:
					"The 3rd Open Source Hardware Xinghuo Meeting & Electronic Engineers Conference — Shenzhen, 24 May 2025.",
				image: {
					src: "/experience/society/xinghuo-peers.webp",
					alt: "Peers at Xinghuo HUBDAY 2025 reading pamphlets and phones",
					width: 1024,
					height: 684,
					caption: "HUBDAY 2025 — pamphlets, phones, unfinished questions",
				},
			},
			{
				type: "split",
				heading: "Badge on",
				body: [
					"Entry pass for 星火会 HUBDAY 2025 — photo livestream, Shenzhen. Showing up as an attendee in a room of builders and EDA / open-hardware people.",
				],
				image: {
					src: "/experience/society/xinghuo-badge.webp",
					alt: "Xinghuo HUBDAY 2025 event badge on a lanyard",
					width: 767,
					height: 1024,
					caption: "Badge — 2025.05.24 · 深圳",
				},
				imageSide: "right",
			},
			{
				type: "image-full",
				eyebrow: "02 · Hall",
				heading: "Main stage",
				body: [
					"第三届开源硬件星火会暨电子工程师大会 — JLCPCB / EasyEDA / OSHW Hub on the wall. Less campus duty, more spark: how practice catches fire when people share unfinished work.",
				],
				image: {
					src: "/experience/society/xinghuo-stage.webp",
					alt: "Main stage screen for the 3rd Open Source Hardware Xinghuo Meeting",
					width: 767,
					height: 1024,
					caption: "Stage — open-source hardware · electronic engineers",
				},
				imageTone: "light",
			},
			{
				type: "image-full",
				eyebrow: "03 · Floor",
				heading: "Check-in line",
				body: [
					"Registration desk, yellow tote, branded blue shirts — the floor where makers and students queue into the same day.",
				],
				image: {
					src: "/experience/society/xinghuo-checkin.webp",
					alt: "Check-in desk at Xinghuo HUBDAY 2025",
					width: 1024,
					height: 684,
					caption: "Check-in — HUBDAY floor",
				},
				imageTone: "light",
			},
			{
				type: "feature-list",
				heading: "Why it matters",
				items: [
					"Open-source hardware community beyond graded projects",
					"Hear builders and EDA / OSHW platforms in one hall",
					"Notes that are curiosity, not assignments",
				],
			},
		],
	},
	{
		id: "maker-meetings",
		title: "Chaihuo Makers",
		subtitle: "柴火创客 · Fab Lab exchange",
		cardImage: {
			src: "/experience/society/chaihuo.webp",
			alt: "Chaihuo maker community exchange",
			width: 1600,
			height: 900,
		},
		spreads: [
			{
				type: "product-hero",
				kicker: "01 · Maker",
				title: "柴火创客",
				subtitle:
					"Maker exchanges at Chaihuo — where builds leave the classroom and meet other makers at the Fab Lab door.",
				image: {
					src: "/experience/society/chaihuo.webp",
					alt: "Chaihuo maker space exchange",
					width: 1600,
					height: 900,
					caption: "Chaihuo — maker exchange and peer learning.",
				},
			},
			{
				type: "prose",
				eyebrow: "02 · Sessions",
				heading: "In the maker room",
				body: [
					"At Chaihuo (柴火) maker exchanges I met builders, watched demos, and traded notes on how projects leave the lab and meet people.",
					"If Xinghuo was the spark, Chaihuo was the forge — repeated contact with makers who keep the workbench open.",
				],
			},
			{
				type: "image-full",
				eyebrow: "03 · Door",
				heading: "At the Fab Lab door",
				body: [
					"柴火创客 CHAIHUO MAKERS — Fab Lab at the entrance. Showing up where builders keep the workbench open, not only where grades are posted.",
				],
				image: {
					src: "/experience/society/chaihuo-entrance.webp",
					alt: "At the entrance of Chaihuo Makers Fab Lab",
					width: 1024,
					height: 768,
					caption: "柴火创客 — Fab Lab entrance",
				},
				imageTone: "light",
			},
			{
				type: "feature-list",
				heading: "Why these matter",
				items: [
					"Hear builders and mentors outside a graded project",
					"Trade notes on prototypes and process",
					"Keep a habit of learning in public maker rooms",
				],
			},
		],
	},
	{
		id: "exhibitions",
		title: "Exhibitions",
		subtitle: "Low-altitude · Police UAV · Robotics",
		cardImage: {
			src: "/experience/society/exhibit-huanyu-air.webp",
			alt: "HUANYU AIR police multi-purpose UAV payload exhibition booth",
			width: 783,
			height: 1024,
		},
		spreads: [
			{
				type: "product-hero",
				kicker: "01 · Exhibit",
				title: "Public halls for tech on display",
				subtitle:
					"Low-altitude economy and police UAV / robotics floors — watching how hardware is staged for non-specialist audiences.",
				image: {
					src: "/experience/society/exhibit-huanyu-air.webp",
					alt: "HUANYU AIR police multi-purpose UAV payload exhibition booth",
					width: 783,
					height: 1024,
					caption: "HUANYU AIR — police multi-purpose payload booth",
				},
			},
			{
				type: "image-full",
				eyebrow: "02 · Robotics",
				heading: "Police equipment & UAV control floor",
				body: [
					"Humanoid and robot dogs under the banner for practical police gear and UAV prevention tech — bodies in the room, not only slides on a wall.",
				],
				image: {
					src: "/experience/society/exhibit-police-robots.webp",
					alt: "Humanoid and robot dogs at police equipment and UAV exhibition",
					width: 755,
					height: 1024,
					caption: "警用装备 · 人形与机器狗现场",
				},
				imageTone: "light",
			},
			{
				type: "prose",
				eyebrow: "03 · Practice",
				heading: "Why walk the floors",
				body: [
					"Walking those halls is different from volunteering or maker talk — here the question is how a field stages itself: what is lit, what is labeled, what is left for the visitor to feel.",
				],
			},
			{
				type: "feature-list",
				heading: "Focus",
				items: [
					"Low-altitude / UAV payload exhibitions",
					"Police robotics and public demos",
					"How tech is framed for general audiences",
				],
			},
		],
	},
	{
		id: "safe-campus-service",
		title: "Safe Campus Service Team",
		subtitle: "Campus safety · Public service · Team duty",
		preview: [
			"Campus safety and public-service shifts",
			"Showing up on schedule with the team",
			"Steady support for shared campus routines",
		],
		cardImage: {
			src: "/experience/society/safe-campus-camera.webp",
			alt: "Safe Campus Service Team member photographing on campus in a yellow vest",
			width: 1024,
			height: 683,
		},
		spreads: [
			{
				type: "product-hero",
				kicker: "01 · Service",
				title: "Safe Campus Service Team",
				subtitle:
					"Campus safety and public-service duty — yellow vest on, camera ready, standing posts and keeping shared routines running with the team.",
				image: {
					src: "/experience/society/safe-campus-camera.webp",
					alt: "Safe Campus Service Team member photographing on campus in a yellow vest",
					width: 1024,
					height: 683,
					caption: "On duty — documenting campus service.",
				},
			},
			{
				type: "split",
				heading: "Field presence",
				body: [
					"Public campus moments meant being visible and useful — wet ground, barrier tape, and a vest that told people who to ask.",
					"Reliability first: arrive on time, stay through the post, work as one unit under real campus pressure.",
				],
				image: {
					src: "/experience/society/safe-campus-side.webp",
					alt: "Volunteer photographer in yellow vest shooting on a wet campus plaza",
					width: 1024,
					height: 683,
					caption: "Side view — camera on, vest on",
				},
				imageSide: "right",
			},
			{
				type: "image-full",
				eyebrow: "02 · Team",
				heading: "People around the table",
				body: [
					"Service was also belonging — birthday cake, shared gestures, and the small rituals that keep a team together between shifts.",
				],
				image: {
					src: "/experience/society/safe-campus-party.webp",
					alt: "Safe Campus Service Team gathering around a cake",
					width: 1024,
					height: 682,
					caption: "Team night — cake and crew",
				},
				imageTone: "light",
			},
			{
				type: "split",
				heading: "Speaking for the work",
				body: [
					"Classroom briefings and team talks — microphone in hand, slides on the wall — so the next cohort knew what the post actually asked for.",
				],
				image: {
					src: "/experience/society/safe-campus-speak.webp",
					alt: "Presenting about campus service team work in a classroom",
					width: 1024,
					height: 682,
					caption: "Briefing — sharing how the team runs",
				},
				imageSide: "left",
			},
			{
				type: "image-full",
				eyebrow: "03 · Recognition",
				heading: "Excellent volunteer",
				body: [
					"2022–2023 Excellent Volunteer award — yellow vest, certificate in hand, proof that showing up was noticed.",
				],
				image: {
					src: "/experience/society/safe-campus-award.webp",
					alt: "Holding an Excellent Volunteer award certificate in a yellow vest",
					width: 1024,
					height: 768,
					caption: "奖状 — 优秀志愿者",
				},
				imageTone: "light",
			},
			{
				type: "image-full",
				eyebrow: "04 · Formation",
				heading: "With the wider campus corps",
				body: [
					"Group portrait with National Defense Education Instructor Team — yellow vests beside the green formation, one campus service story under a shared flag.",
				],
				image: {
					src: "/experience/society/safe-campus-group.webp",
					alt: "Large group photo of Safe Campus Service Team with defense education corps",
					width: 1024,
					height: 768,
					caption: "Group — 平安校园 · 国防教育教导队",
				},
				imageTone: "light",
			},
			{
				type: "feature-list",
				heading: "Focus",
				items: [
					"Campus safety and public-service posts",
					"Team coordination under real schedules",
					"Clear, calm help for people on campus",
				],
			},
		],
	},
	{
		id: "drone-workstation",
		title: "Drone Workstation",
		subtitle: "UAV lab · Outreach & flight safety",
		preview: [
			"Publicity and public-facing demos",
			"Flight safety briefings",
			"Making UAVs approachable on campus",
		],
		cardImage: {
			src: "/experience/society/drone-ws-present.webp",
			alt: "Presenting drone workstation plans at the classroom podium",
			width: 1024,
			height: 768,
		},
		spreads: [
			{
				type: "product-hero",
				kicker: "01 · Workstation",
				title: "Drone Workstation",
				subtitle:
					"Bench builds, safety-minded demos, and campus outreach around UAVs — from podium briefings to the blue table.",
				image: {
					src: "/experience/society/drone-ws-present.webp",
					alt: "Presenting drone workstation plans at the classroom podium",
					width: 1024,
					height: 768,
					caption: "Briefing — 无人机工作站 at the podium",
				},
			},
			{
				type: "image-full",
				eyebrow: "02 · Bench",
				heading: "Around the blue table",
				body: [
					"Crew around unfinished frames — pointing, asking, wiring. The workstation is a room where UAVs get built in public.",
				],
				image: {
					src: "/experience/society/drone-ws-table.webp",
					alt: "Students gathered around a blue table assembling drones",
					width: 1024,
					height: 767,
					caption: "Lab — team build session",
				},
				imageTone: "light",
			},
			{
				type: "split",
				heading: "Hands on the board",
				body: [
					"Close soldering on the power plate — red arms, XT60, iron on the joint. Detail work that turns a kit into a flyer.",
				],
				image: {
					src: "/experience/society/drone-ws-solder.webp",
					alt: "Close-up of soldering a drone power board on the bench",
					width: 1024,
					height: 1024,
					caption: "Detail — soldering the frame",
				},
				imageSide: "right",
			},
			{
				type: "image-full",
				eyebrow: "03 · Crew",
				heading: "The people behind the frames",
				body: [
					"Workstation first means people — the crew that shows up to build, brief, and fly.",
				],
				image: {
					src: "/experience/society/drone-ws-team.webp",
					alt: "Drone workstation team group photo in the classroom",
					width: 1024,
					height: 768,
					caption: "Team — workstation crew",
				},
				imageTone: "light",
			},
			{
				type: "split",
				heading: "Airframe in progress",
				body: [
					"Large quad on the blue table — multimeter, spare arms, iron in use. Build sessions that stay safety-minded even when the frame is still open.",
				],
				image: {
					src: "/experience/society/drone-ws-build.webp",
					alt: "Students assembling a large quadcopter with soldering and multimeter",
					width: 1024,
					height: 768,
					caption: "Build — quadcopter on the bench",
				},
				imageSide: "left",
			},
			{
				type: "image-full",
				eyebrow: "04 · Bring-up",
				heading: "Controller and screen",
				body: [
					"Transmitter in hand, GCS on the monitor, lit quad on the desk — the last loop from bench wiring to a controllable aircraft.",
				],
				image: {
					src: "/experience/society/drone-ws-bench.webp",
					alt: "Students with drone remote and computer configuring a powered quadcopter",
					width: 1024,
					height: 768,
					caption: "Bring-up — radio, GCS, and a live frame",
				},
				imageTone: "light",
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
