export type MakeImage = {
	src: string;
	alt: string;
	width: number;
	height: number;
	caption?: string;
	fit?: "cover" | "contain";
};

export type MakeDiyItem = {
	id: string;
	title: string;
	year: string;
	image: MakeImage;
};

export type MakeEssayBlock =
	| {
			type: "opener";
			kicker: string;
			title: string;
			lede: string;
	  }
	| {
			type: "helmet";
			num: string;
			title: string;
			pull: string;
			body: string[];
			images: MakeImage[];
	  }
	| {
			type: "diy-wall";
			num: string;
			title: string;
			lede: string;
			items: MakeDiyItem[];
	  };

export const makeEssay: MakeEssayBlock[] = [
	{
		type: "opener",
		kicker: "MAKE · Workbench",
		title: "Things I invent and build myself",
		lede:
			"Helmet first — from bench prototype to public show and roadside booth. Then nine builds from the same desk, shown one by one.",
	},
	{
		type: "helmet",
		num: "01",
		title: "Smart Helmet",
		pull: "Own the problem, the board, and the conversation when strangers stop to ask what it does.",
		body: [
			"The Smart Helmet is the lead MAKE story: a wearable I designed and iterated myself — sensors, firmware, and the loop from desk to something people can put on their head.",
			"Public moments matter as much as the bench. Exhibition floors test whether the story reads in three seconds; booth outreach tests whether a stranger will try it on and ask the next question.",
		],
		images: [
			{
				src: "/experience/make/helmet-product.webp",
				alt: "Three smart helmets with LED visor displays lined up on a table",
				width: 1024,
				height: 767,
				caption: "LED visor prototypes",
			},
			{
				src: "/experience/make/helmet-booth-camp.webp",
				alt: "MOTO CAMP booth — talking with visitors at the stall",
				width: 767,
				height: 1024,
				caption: "MOTO CAMP — visitor conversation",
			},
			{
				src: "/experience/make/helmet-booth-crew.webp",
				alt: "Smart helmet roadside booth with crew and bubble wand",
				width: 1024,
				height: 767,
				caption: "Roadside stall — crew",
			},
		],
	},
	{
		type: "diy-wall",
		num: "02",
		title: "Built on the desk",
		lede:
			"Nine builds in a quiet gallery — drag or tap through each piece, framed the way a product shot deserves.",
		items: [
			{
				id: "night-light",
				title: "Snowflake Night Light",
				year: "2024",
				image: {
					src: "/experience/make/night-light.webp",
					alt: "DIY snowflake LED night light",
					width: 1024,
					height: 1024,
				},
			},
			{
				id: "heart-domes",
				title: "Heart Dome Lights",
				year: "2024",
				image: {
					src: "/experience/make/heart-domes.webp",
					alt: "Three heart-shaped LED night lights under glass domes",
					width: 1024,
					height: 767,
				},
			},
			{
				id: "stereo-display",
				title: "Hologram Visualizer",
				year: "2025",
				image: {
					src: "/experience/make/stereo-display.webp",
					alt: "Pseudo-holographic cube with audio spectrum",
					width: 772,
					height: 895,
				},
			},
			{
				id: "anime-pcb",
				title: "Anime PCB Art",
				year: "2025",
				image: {
					src: "/experience/make/anime-pcb.webp",
					alt: "Backlit anime illustration PCB panel",
					width: 711,
					height: 844,
				},
			},
			{
				id: "kb-acrylic",
				title: "Acrylic Keyboard",
				year: "2025",
				image: {
					src: "/experience/make/kb-acrylic.webp",
					alt: "Clear acrylic mechanical keyboard with OLED and red backlight",
					width: 1008,
					height: 501,
				},
			},
			{
				id: "balance-triangle",
				title: "Self-Balancing Triangle",
				year: "2024",
				image: {
					src: "/experience/make/balance-triangle.webp",
					alt: "Self-balancing Reuleaux triangle with ESP32",
					width: 1024,
					height: 905,
				},
			},
			{
				id: "esp-audio",
				title: "ESP32 Audio Proto",
				year: "2024",
				image: {
					src: "/experience/make/esp-audio-board.webp",
					alt: "Live ESP32 audio prototype with blue LED glow",
					width: 1024,
					height: 767,
				},
			},
			{
				id: "pov-ring",
				title: "POV Display",
				year: "2025",
				image: {
					src: "/experience/make/pov-ring.webp",
					alt: "3D-printed persistence-of-vision ring display",
					width: 589,
					height: 665,
				},
			},
			{
				id: "keyboard",
				title: "Shin-chan Numpad",
				year: "2025",
				image: {
					src: "/experience/make/keyboard.webp",
					alt: "Custom Crayon Shin-chan mechanical numpad",
					width: 576,
					height: 1024,
				},
			},
		],
	},
];
