import type { UniversityShowcase } from "./university-showcases";

export type SocietyShowcase = UniversityShowcase;

/** Society = volunteering + maker meetings + exhibitions (text). Helmet exhibition photos live under MAKE. */
export const societyShowcases: SocietyShowcase[] = [
	{
		id: "volunteering",
		title: "Volunteering",
		subtitle: "Anti-fraud · Flag raising · Team support",
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
					"Anti-fraud talks, flag raising, and showing up with the volunteer team for shared campus duties.",
				image: {
					src: "/experience/society/volunteer.webp",
					alt: "Volunteer session on campus",
					width: 1600,
					height: 900,
					caption: "Volunteer duty — with the team.",
				},
			},
			{
				type: "prose",
				eyebrow: "02 · Focus",
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
					"Campus anti-fraud education and student briefings",
					"Flag-raising and ceremony support",
					"Shared duties with fellow volunteers",
				],
			},
		],
	},
	{
		id: "maker-meetings",
		title: "Maker Meetings",
		subtitle: "星火会 · 柴火创客交流",
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
				title: "Creator meetings",
				subtitle:
					"Talks and maker exchanges — Xinghuo and Chaihuo — where builds leave the classroom and meet other makers.",
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
				heading: "星火会 & 柴火创客",
				body: [
					"I attended Jia Lichuan’s Xinghuo session (贾立川 · 星火会) — a focused exchange around making and practice beyond the classroom.",
					"At Chaihuo (柴火) maker exchanges I met builders, watched demos, and traded notes on how projects leave the lab and meet people.",
				],
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
		subtitle: "Art shows · Public viewing",
		cardImage: {
			src: "/experience/society/chaihuo.webp",
			alt: "Exhibition and art-show presence",
			width: 1600,
			height: 900,
		},
		spreads: [
			{
				type: "prose",
				eyebrow: "01 · Exhibit",
				heading: "Exhibitions & art shows",
				body: [
					"I also go to art exhibitions and public shows — watching how work is staged for non-specialist audiences, and how a piece holds attention in a room.",
					"Photo documentation for this thread will come later; helmet exhibition stills live under MAKE.",
				],
			},
			{
				type: "feature-list",
				heading: "Practice",
				items: [
					"Attend art and public exhibitions",
					"Study how work is framed for general audiences",
					"Keep society activity separate from the MAKE product story",
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
			src: "/experience/society/volunteer.webp",
			alt: "Safe Campus Service Team on duty",
			width: 1600,
			height: 900,
		},
		spreads: [
			{
				type: "product-hero",
				kicker: "01 · Service",
				title: "Safe Campus Service Team",
				subtitle:
					"Campus safety and public-service duty — standing posts, guiding people, and keeping shared routines running with the team.",
				image: {
					src: "/experience/society/volunteer.webp",
					alt: "Safe Campus Service Team activity",
					width: 1600,
					height: 900,
					caption: "On duty — with the campus service team.",
				},
			},
			{
				type: "prose",
				eyebrow: "02 · Role",
				heading: "What the work looked like",
				body: [
					"Safe Campus Service Team shifts meant being present for public campus moments — guiding, explaining, and keeping order when schedules were shared and visible.",
					"The emphasis was reliability: arrive on time, stay through the post, and work as one unit with classmates under real campus pressure.",
				],
			},
			{
				type: "duo",
				eyebrow: "03 · On site",
				heading: "People-facing duty",
				body: [
					"From one-to-one guidance to harder public days — service that asked for steadiness more than speeches.",
				],
				tone: "soft",
				mediaFit: "cover",
				images: [
					{
						src: "/experience/society/volunteer-guide.webp",
						alt: "Guiding a resident during campus service",
						width: 1600,
						height: 900,
						caption: "Guidance — helping on site",
					},
					{
						src: "/experience/society/volunteer-ppe.webp",
						alt: "Public-service duty in protective gear",
						width: 1600,
						height: 900,
						caption: "Public duty — when showing up mattered most",
					},
				],
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
			src: "/experience/university/drone/workshop.webp",
			alt: "Students assembling a drone at the workstation bench",
			width: 1024,
			height: 768,
		},
		spreads: [
			{
				type: "product-hero",
				kicker: "01 · Workstation",
				title: "Drone Workstation",
				subtitle:
					"Bench builds, safety-minded demos, and campus outreach around UAVs.",
				image: {
					src: "/experience/university/drone/workshop.webp",
					alt: "Team soldering and assembling a quadcopter on the bench",
					width: 1024,
					height: 768,
					caption: "Bench — drone build in progress",
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
				type: "duo",
				eyebrow: "03 · Practice",
				heading: "Bench and briefing",
				body: [
					"Close work on the airframe, then turning that craft into a clear story for classmates and visitors.",
				],
				tone: "soft",
				mediaFit: "cover",
				images: [
					{
						src: "/experience/university/drone/soldering-close.webp",
						alt: "Close-up of soldering a drone power board",
						width: 1024,
						height: 1024,
						caption: "Detail — soldering the board",
					},
					{
						src: "/experience/university/drone/presentation.webp",
						alt: "Presenting drone workstation materials at the podium",
						width: 1024,
						height: 768,
						caption: "Briefing — workstation presentation",
					},
				],
			},
			{
				type: "image-full",
				eyebrow: "04 · Team",
				heading: "The people behind the frames",
				body: [
					"The workstation is a crew first — then the drones.",
				],
				image: {
					src: "/experience/university/drone/team.webp",
					alt: "Drone workstation team group photo",
					width: 1024,
					height: 768,
					caption: "Team — workstation crew",
				},
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
