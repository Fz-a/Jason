import type { UniversityShowcase } from "../projects/university-showcases";
import type { BriefBlock, BriefDoc, BriefImage } from "./brief-types";
import { newBlockId } from "./brief-types";

function img(
	image: { src: string; alt: string; caption?: string },
): BriefImage {
	return {
		src: image.src,
		alt: image.alt,
		caption: image.caption,
	};
}

function pushText(blocks: BriefBlock[], paragraphs: string[]) {
	for (const text of paragraphs) {
		blocks.push({ id: newBlockId(), type: "text", text });
	}
}

/** Convert a showcase document into editable brief blocks. */
export function briefFromShowcase(
	item: UniversityShowcase,
	section?: string,
): BriefDoc {
	const blocks: BriefBlock[] = [];

	if (section) {
		blocks.push({ id: newBlockId(), type: "kicker", text: section });
	}
	blocks.push({ id: newBlockId(), type: "heading", text: item.title });
	if (item.subtitle) {
		blocks.push({
			id: newBlockId(),
			type: "subheading",
			text: item.subtitle,
		});
	}

	for (const spread of item.spreads) {
		switch (spread.type) {
			case "cover":
			case "product-hero":
				if (spread.kicker) {
					blocks.push({
						id: newBlockId(),
						type: "kicker",
						text: spread.kicker,
					});
				}
				blocks.push({
					id: newBlockId(),
					type: "heading",
					text: spread.title,
				});
				if (spread.subtitle) {
					blocks.push({
						id: newBlockId(),
						type: "pull",
						text: spread.subtitle,
					});
				}
				if ("image" in spread && spread.image) {
					blocks.push({
						id: newBlockId(),
						type: "image",
						image: img(spread.image),
					});
				}
				break;
			case "prose":
				if (spread.eyebrow) {
					blocks.push({
						id: newBlockId(),
						type: "kicker",
						text: spread.eyebrow,
					});
				}
				blocks.push({
					id: newBlockId(),
					type: "heading",
					text: spread.heading,
				});
				pushText(blocks, spread.body);
				break;
			case "feature-list":
				blocks.push({
					id: newBlockId(),
					type: "heading",
					text: spread.heading,
				});
				blocks.push({
					id: newBlockId(),
					type: "list",
					items: [...spread.items],
				});
				break;
			case "image-full":
				if (spread.eyebrow) {
					blocks.push({
						id: newBlockId(),
						type: "kicker",
						text: spread.eyebrow,
					});
				}
				if (spread.heading) {
					blocks.push({
						id: newBlockId(),
						type: "heading",
						text: spread.heading,
					});
				}
				if (spread.body) pushText(blocks, spread.body);
				blocks.push({
					id: newBlockId(),
					type: "image",
					image: img(spread.image),
				});
				break;
			case "split":
				blocks.push({
					id: newBlockId(),
					type: "heading",
					text: spread.heading,
				});
				pushText(blocks, spread.body);
				blocks.push({
					id: newBlockId(),
					type: "image",
					image: img(spread.image),
				});
				break;
			case "duo":
			case "phones":
				if (spread.eyebrow) {
					blocks.push({
						id: newBlockId(),
						type: "kicker",
						text: spread.eyebrow,
					});
				}
				if (spread.heading) {
					blocks.push({
						id: newBlockId(),
						type: "heading",
						text: spread.heading,
					});
				}
				if (spread.body) pushText(blocks, spread.body);
				blocks.push({
					id: newBlockId(),
					type: "duo",
					images: [img(spread.images[0]), img(spread.images[1])],
				});
				break;
			case "quad":
				if (spread.eyebrow) {
					blocks.push({
						id: newBlockId(),
						type: "kicker",
						text: spread.eyebrow,
					});
				}
				blocks.push({
					id: newBlockId(),
					type: "heading",
					text: spread.heading,
				});
				pushText(blocks, spread.body);
				blocks.push({
					id: newBlockId(),
					type: "duo",
					images: [img(spread.images[0]), img(spread.images[1])],
				});
				blocks.push({
					id: newBlockId(),
					type: "duo",
					images: [img(spread.images[2]), img(spread.images[3])],
				});
				break;
			case "hardware-stage":
				blocks.push({
					id: newBlockId(),
					type: "kicker",
					text: spread.eyebrow,
				});
				blocks.push({
					id: newBlockId(),
					type: "heading",
					text: spread.heading,
				});
				pushText(blocks, spread.body);
				blocks.push({
					id: newBlockId(),
					type: "duo",
					images: [img(spread.boards), img(spread.layout)],
				});
				break;
			default:
				break;
		}
	}

	return {
		id: item.id,
		title: item.title,
		subtitle: item.subtitle,
		section,
		blocks,
	};
}
