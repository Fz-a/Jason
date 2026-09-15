import type { BriefImage } from "./brief-types";
import type { CSSProperties } from "react";

export const IMAGE_FOCUS_MIN = 1;
export const IMAGE_FOCUS_MAX = 2.8;

export function clampFocus(n: number, min: number, max: number) {
	return Math.min(max, Math.max(min, n));
}

export function panLimit(scale: number) {
	return 12 + (scale - 1) * 48;
}

export function normalizeImageFocus(
	img: Pick<BriefImage, "scale" | "tx" | "ty"> | undefined | null,
): { scale: number; tx: number; ty: number } {
	const scale = clampFocus(
		Number(img?.scale ?? 1) || 1,
		IMAGE_FOCUS_MIN,
		IMAGE_FOCUS_MAX,
	);
	const limit = panLimit(scale);
	return {
		scale,
		tx: clampFocus(Number(img?.tx ?? 0) || 0, -limit, limit),
		ty: clampFocus(Number(img?.ty ?? 0) || 0, -limit, limit),
	};
}

/** CSS transform for cover-fit frames (stage, cards, brief figures). */
export function imageFocusStyle(
	img: Pick<BriefImage, "scale" | "tx" | "ty"> | undefined | null,
): CSSProperties {
	const { scale, tx, ty } = normalizeImageFocus(img);
	if (scale === 1 && tx === 0 && ty === 0) {
		return { objectFit: "cover", objectPosition: "center" };
	}
	return {
		objectFit: "cover",
		objectPosition: "center",
		transform: `translate(${tx}%, ${ty}%) scale(${scale})`,
		transformOrigin: "center center",
	};
}

export function hasCustomFocus(
	img: Pick<BriefImage, "scale" | "tx" | "ty"> | undefined | null,
) {
	const f = normalizeImageFocus(img);
	return f.scale !== 1 || f.tx !== 0 || f.ty !== 0;
}

export function withFocus(
	img: BriefImage,
	focus: { scale: number; tx: number; ty: number },
): BriefImage {
	const n = normalizeImageFocus(focus);
	return {
		...img,
		scale: n.scale === 1 ? undefined : n.scale,
		tx: n.tx === 0 ? undefined : n.tx,
		ty: n.ty === 0 ? undefined : n.ty,
	};
}
