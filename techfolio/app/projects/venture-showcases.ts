import type { UniversityShowcase } from "./university-showcases";

export type VentureShowcase = UniversityShowcase;

/**
 * Helmet entrepreneurship project.
 * Exhibition / booth photos that belong to this venture live here.
 */
export const ventureShowcases: VentureShowcase[] = [
	{
		id: "smart-helmet",
		title: "Smart Helmet",
		subtitle: "Small venture · Wearable hardware · Prototype to product",
		cardImage: {
			src: "/experience/society/maker-faire.webp",
			alt: "Smart helmet venture at exhibition / demo",
			width: 1600,
			height: 900,
		},
		spreads: [
			{
				type: "product-hero",
				kicker: "01 · Venture",
				title: "Smart Helmet",
				subtitle:
					"A small entrepreneurship project — designing and iterating a smart helmet from concept toward a working product.",
				image: {
					src: "/experience/society/maker-faire.webp",
					alt: "Helmet venture exhibition / demo presence",
					width: 1600,
					height: 900,
					caption: "Venture presence — exhibition / demo.",
				},
			},
			{
				type: "prose",
				eyebrow: "02 · Why",
				heading: "Why this venture",
				body: [
					"This is my own small startup-style build — separate from campus graded projects and company work — focused on a wearable helmet product people could actually use.",
					"The brief will grow with closer product photos, architecture, and field notes as the prototype matures.",
				],
			},
			{
				type: "duo",
				eyebrow: "03 · Out in public",
				heading: "Shows & booths",
				body: [
					"Exhibition and booth moments for the helmet venture — putting the build in front of real audiences.",
				],
				tone: "soft",
				mediaFit: "cover",
				images: [
					{
						src: "/experience/society/maker-faire.webp",
						alt: "Helmet venture exhibition demo",
						width: 1600,
						height: 900,
						caption: "Exhibition / demo",
					},
					{
						src: "/experience/society/moto-camp.webp",
						alt: "Helmet venture booth outreach",
						width: 1600,
						height: 900,
						caption: "Booth outreach",
					},
				],
			},
			{
				type: "feature-list",
				heading: "What I’m driving",
				items: [
					"Own the problem, hardware choices, and iteration loop",
					"Move from concept and bench prototype toward a clearer product",
					"Document the venture path — including public shows",
				],
			},
		],
	},
];
