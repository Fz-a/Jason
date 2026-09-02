import { makeEssay } from "../projects/make-essay";
import { projects } from "../projects/project-data";
import { societyEssay } from "../projects/society-essay";
import {
	universityAllShowcases,
	type UniversityShowcase,
} from "../projects/university-showcases";
import {
	workCompanyIntro,
	workInternships,
	workShowcases,
} from "../projects/work-showcases";

function pushUnique(target: string[], src?: string) {
	if (!src || target.includes(src)) return;
	target.push(src);
}

function collectShowcaseHeroes(items: UniversityShowcase[], limitPerItem = 2) {
	const urls: string[] = [];
	for (const item of items) {
		pushUnique(urls, item.cardImage?.src);
		let taken = 0;
		for (const spread of item.spreads) {
			if (taken >= limitPerItem) break;
			if (spread.type === "product-hero") {
				pushUnique(urls, spread.image.src);
				taken += 1;
			} else if (spread.type === "image-full") {
				pushUnique(urls, spread.image.src);
				taken += 1;
			} else if (spread.type === "duo") {
				pushUnique(urls, spread.images[0]?.src);
				pushUnique(urls, spread.images[1]?.src);
				taken += 2;
			}
		}
	}
	return urls;
}

function collectSocietyEssayUrls() {
	const urls: string[] = [];
	for (const block of societyEssay) {
		if (block.type === "chapter" && block.image) {
			pushUnique(urls, block.image.src);
		}
		if (block.type === "duo-exhibit") {
			for (const image of block.images) pushUnique(urls, image.src);
		}
	}
	return urls;
}

function collectMakeEssayUrls() {
	const urls: string[] = [];
	for (const block of makeEssay) {
		if (block.type === "helmet") {
			for (const image of block.images) pushUnique(urls, image.src);
		}
		if (block.type === "diy-wall") {
			for (const item of block.items) pushUnique(urls, item.image.src);
		}
	}
	return urls;
}

/** Homepage project cards — warm these first while scrolling. */
export function getHomeCardImageUrls(): string[] {
	const urls: string[] = [];
	for (const project of projects) {
		pushUnique(urls, project.cardImage?.src);
	}
	return urls;
}

/**
 * Detail-page covers and first heroes — warm after the user starts scrolling
 * so opening University / Work / Society / MAKE feels instant.
 */
export function getDetailWarmImageUrls(): string[] {
	const urls: string[] = [];

	for (const src of getHomeCardImageUrls()) pushUnique(urls, src);

	pushUnique(urls, workCompanyIntro.image.src);
	for (const src of collectShowcaseHeroes(universityAllShowcases, 2)) {
		pushUnique(urls, src);
	}
	for (const src of collectShowcaseHeroes(workShowcases, 2)) {
		pushUnique(urls, src);
	}
	for (const src of collectSocietyEssayUrls()) {
		pushUnique(urls, src);
	}
	for (const src of collectMakeEssayUrls()) {
		pushUnique(urls, src);
	}
	for (const item of workInternships) {
		pushUnique(urls, item.image.src);
	}

	return urls;
}

/** Deeper stills — second wave after Projects is in view. */
export function getDetailDeepImageUrls(): string[] {
	const urls: string[] = [];
	const warm = new Set(getDetailWarmImageUrls());

	const pools = [...universityAllShowcases, ...workShowcases];

	for (const item of pools) {
		for (const spread of item.spreads) {
			if ("image" in spread && spread.image?.src) {
				if (!warm.has(spread.image.src)) pushUnique(urls, spread.image.src);
			}
			if ("images" in spread && Array.isArray(spread.images)) {
				for (const image of spread.images) {
					if (image?.src && !warm.has(image.src)) pushUnique(urls, image.src);
				}
			}
		}
	}

	return urls;
}

export function preloadImage(src: string): Promise<void> {
	return new Promise((resolve) => {
		const img = new window.Image();
		img.decoding = "async";
		img.onload = () => resolve();
		img.onerror = () => resolve();
		img.src = src;
	});
}

export async function preloadImages(
	urls: string[],
	concurrency = 3,
): Promise<void> {
	const unique = [...new Set(urls.filter(Boolean))];
	if (unique.length === 0) return;

	let cursor = 0;

	const worker = async () => {
		while (cursor < unique.length) {
			const index = cursor;
			cursor += 1;
			await preloadImage(unique[index]);
		}
	};

	const pool = Math.min(concurrency, unique.length);
	await Promise.all(Array.from({ length: pool }, () => worker()));
}
