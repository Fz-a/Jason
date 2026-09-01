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
];
