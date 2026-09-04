export type BriefImage = {
	src: string;
	alt: string;
	caption?: string;
};

export type BriefBlock =
	| { id: string; type: "kicker"; text: string }
	| { id: string; type: "heading"; text: string }
	| { id: string; type: "subheading"; text: string }
	| { id: string; type: "pull"; text: string }
	| { id: string; type: "text"; text: string }
	| { id: string; type: "list"; items: string[] }
	| { id: string; type: "image"; image: BriefImage }
	| { id: string; type: "duo"; images: [BriefImage, BriefImage] }
	| {
			id: string;
			type: "tabs";
			tabs: { id: string; label: string; labelEn?: string; blocks: BriefBlock[] }[];
	  };

export type BriefDoc = {
	id: string;
	title: string;
	subtitle?: string;
	section?: string;
	blocks: BriefBlock[];
};

export type BriefStore = Record<string, BriefDoc>;

export const BLOCK_LABELS: Record<BriefBlock["type"], string> = {
	kicker: "Kicker",
	heading: "Heading",
	subheading: "Subheading",
	pull: "Pull quote",
	text: "Paragraph",
	list: "List",
	image: "Image",
	duo: "Image pair",
	tabs: "Tabs",
};

export function newBlockId() {
	return `b_${Math.random().toString(36).slice(2, 10)}`;
}

export function createEmptyBlock(type: BriefBlock["type"]): BriefBlock {
	const id = newBlockId();
	switch (type) {
		case "kicker":
			return { id, type, text: "Section" };
		case "heading":
			return { id, type, text: "Title" };
		case "subheading":
			return { id, type, text: "Subtitle" };
		case "pull":
			return { id, type, text: "One-line highlight." };
		case "text":
			return { id, type, text: "Write the story here." };
		case "list":
			return { id, type, items: ["First point", "Second point"] };
		case "image":
			return {
				id,
				type,
				image: { src: "/experience/work/zongheng/robot-dock.webp", alt: "" },
			};
		case "duo":
			return {
				id,
				type,
				images: [
					{ src: "/experience/work/zongheng/robot-dock.webp", alt: "" },
					{ src: "/experience/work/zongheng/shixun-car.webp", alt: "" },
				],
			};
		case "tabs":
			return {
				id,
				type,
				tabs: [
					{
						id: newBlockId(),
						label: "Part A",
						labelEn: "Part A",
						blocks: [
							{
								id: newBlockId(),
								type: "pull",
								text: "Describe this part.",
							},
						],
					},
					{
						id: newBlockId(),
						label: "Part B",
						labelEn: "Part B",
						blocks: [
							{
								id: newBlockId(),
								type: "pull",
								text: "Describe this part.",
							},
						],
					},
				],
			};
	}
}
