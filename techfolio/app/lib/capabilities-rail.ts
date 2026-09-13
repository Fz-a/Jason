/**
 * Capabilities right-rail visibility with hysteresis:
 * — appear later when scrolling into the section
 * — disappear earlier when scrolling away
 */
export function isCapabilitiesRailActive(
	rect: DOMRect,
	vh: number,
	wasActive: boolean,
): boolean {
	if (wasActive) {
		// Exit early: hide once the section is mostly leaving the viewport
		return rect.top < vh * 0.7 && rect.bottom > vh * 0.36;
	}
	// Enter late: wait until the section is well into view
	return rect.top < vh * 0.36 && rect.bottom > vh * 0.52;
}
