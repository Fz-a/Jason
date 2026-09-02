export type MakeImage = {
	src: string;
	alt: string;
	width: number;
	height: number;
	caption?: string;
	fit?: "cover" | "contain";
};

export type MakeDiySlot = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type MakeDiyItem = {
	id: string;
	slot: MakeDiySlot;
	title: string;
	titleZh: string;
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
			titleZh: string;
			pull: string;
			body: string[];
			images: [MakeImage, MakeImage];
	  }
	| {
			type: "diy-wall";
			num: string;
			title: string;
			titleZh: string;
			lede: string;
			items: MakeDiyItem[];
	  };

export const makeEssay: MakeEssayBlock[] = [
	{
		type: "opener",
		kicker: "MAKE · Workbench",
		title: "Things I invent and build myself",
		lede:
			"Helmet first — from bench prototype to public show and roadside booth. Then nine builds from the same desk, arranged like a mood board.",
	},
	{
		type: "helmet",
		num: "01",
		title: "Smart Helmet",
		titleZh: "智能头盔 · 展示与摆摊",
		pull: "Own the problem, the board, and the conversation when strangers stop to ask what it does.",
		body: [
			"The Smart Helmet is the lead MAKE story: a wearable I designed and iterated myself — sensors, firmware, and the loop from desk to something people can put on their head.",
			"Public moments matter as much as the bench. Exhibition floors test whether the story reads in three seconds; booth outreach tests whether a stranger will try it on and ask the next question.",
		],
		images: [
			{
				src: "/experience/make/helmet-show.webp",
				alt: "Smart helmet exhibition / maker faire demo",
				width: 1600,
				height: 900,
				caption: "Helmet showcase — exhibition floor",
			},
			{
				src: "/experience/make/helmet-booth.webp",
				alt: "Smart helmet booth outreach",
				width: 1600,
				height: 900,
				caption: "Helmet booth — roadside / outreach",
			},
		],
	},
	{
		type: "diy-wall",
		num: "02",
		title: "Built on the desk",
		titleZh: "桌面造物",
		lede:
			"Nine builds arranged like an editor's spread — staggered on the surface, aligned underneath by baseline and proportion.",
		items: [
			{
				id: "night-light",
				slot: 1,
				title: "Snowflake Night Light",
				titleZh: "雪花小夜灯",
				image: {
					src: "/experience/make/night-light.webp",
					alt: "DIY snowflake LED night light",
					width: 1200,
					height: 1200,
				},
			},
			{
				id: "heart-domes",
				slot: 2,
				title: "Heart Dome Lights",
				titleZh: "心形玻璃罩小夜灯",
				image: {
					src: "/experience/make/heart-domes.webp",
					alt: "Three heart-shaped LED night lights under glass domes",
					width: 1600,
					height: 900,
				},
			},
			{
				id: "stereo-display",
				slot: 3,
				title: "Hologram Visualizer",
				titleZh: "立体频谱显示",
				image: {
					src: "/experience/make/stereo-display.webp",
					alt: "Pseudo-holographic cube with audio spectrum",
					width: 900,
					height: 1200,
				},
			},
			{
				id: "anime-pcb",
				slot: 4,
				title: "Anime PCB Art",
				titleZh: "动漫灯板",
				image: {
					src: "/experience/make/anime-pcb.webp",
					alt: "Backlit anime illustration PCB panel",
					width: 900,
					height: 1400,
				},
			},
			{
				id: "kb-acrylic",
				slot: 5,
				title: "Acrylic Keyboard",
				titleZh: "亚克力机械键盘",
				image: {
					src: "/experience/make/kb-acrylic.webp",
					alt: "Clear acrylic mechanical keyboard with OLED and red backlight",
					width: 1400,
					height: 900,
				},
			},
			{
				id: "balance-triangle",
				slot: 6,
				title: "Self-Balancing Triangle",
				titleZh: "自平衡三角",
				image: {
					src: "/experience/make/balance-triangle.webp",
					alt: "Self-balancing Reuleaux triangle with ESP32",
					width: 1000,
					height: 1400,
				},
			},
			{
				id: "esp-audio",
				slot: 7,
				title: "ESP32 Audio Proto",
				titleZh: "ESP32 音频板",
				image: {
					src: "/experience/make/esp-audio-board.webp",
					alt: "Live ESP32 audio prototype with blue LED glow",
					width: 1200,
					height: 900,
				},
			},
			{
				id: "pov-ring",
				slot: 8,
				title: "POV Display",
				titleZh: "旋转 POV 显示",
				image: {
					src: "/experience/make/pov-ring.webp",
					alt: "3D-printed persistence-of-vision ring display",
					width: 1400,
					height: 900,
				},
			},
			{
				id: "keyboard",
				slot: 9,
				title: "Shin-chan Numpad",
				titleZh: "蜡笔小新数字键盘",
				image: {
					src: "/experience/make/keyboard.webp",
					alt: "Custom Crayon Shin-chan mechanical numpad",
					width: 1200,
					height: 900,
				},
			},
		],
	},
];
