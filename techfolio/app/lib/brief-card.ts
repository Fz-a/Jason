import briefsStore from "../../content/briefs.json";
import type { BriefImage, BriefStore } from "./brief-types";

const STORE = briefsStore as BriefStore;

/** Studio-saved homepage / stage cover, if present. */
export function overrideCardImage(id: string): BriefImage | undefined {
	const img = STORE[id]?.cardImage;
	return img?.src ? img : undefined;
}
