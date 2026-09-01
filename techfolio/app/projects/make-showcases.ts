import type { UniversityShowcase } from "./university-showcases";

export type MakeShowcase = UniversityShowcase;

/**
 * MAKE — helmet venture + future DIY builds that show a love of electronics.
 * Exhibition / booth photos for the helmet live here for now.
 */
export const makeShowcases: MakeShowcase[] = [
	{
		id: "smart-helmet",
		title: "Smart Helmet",
		subtitle: "MAKE · Wearable hardware · Prototype to product",
		cardImage: {
			src: "/experience/society/maker-faire.webp",
			alt: "Smart helmet at exhibition / demo",
			width: 1600,
			height: 900,
		},
		spreads: [
			{
				type: "product-hero",
				kicker: "01 · MAKE",
				title: "Smart Helmet",
				subtitle:
					"A build from the MAKE desk — designing and iterating a smart helmet from concept toward a working product.",
				image: {
					src: "/experience/society/maker-faire.webp",
					alt: "Helmet exhibition / demo presence",
					width: 1600,
					height: 900,
					caption: "Out in public — exhibition / demo.",
				},
			},
			{
				type: "prose",
				eyebrow: "02 · Why",
				heading: "Why this build",
				body: [
					"This sits under MAKE: things I invent and assemble myself — separate from campus graded work and company shipping — focused on a wearable helmet people could actually use.",
					"The brief will grow with closer product photos, architecture, and field notes as the prototype matures. DIY builds will join this same MAKE track.",
				],
			},
			{
				type: "duo",
				eyebrow: "03 · Out in public",
				heading: "Shows & booths",
				body: [
					"Exhibition and booth moments for the helmet — putting the build in front of real audiences.",
				],
				tone: "soft",
				mediaFit: "cover",
				images: [
					{
						src: "/experience/society/maker-faire.webp",
						alt: "Helmet exhibition demo",
						width: 1600,
						height: 900,
						caption: "Exhibition / demo",
					},
					{
						src: "/experience/society/moto-camp.webp",
						alt: "Helmet booth outreach",
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
					"Document the MAKE path — including public shows",
				],
			},
		],
	},
];
