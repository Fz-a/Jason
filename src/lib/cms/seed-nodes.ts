import type { PortfolioItem, PortfolioSectionId } from "@/types/portfolioConfig";
import type { GalleryNode } from "@/types/folioTree";
import { portfolioConfig } from "@/config";
import { url as siteUrl } from "@/utils/url-utils";

const FOLIO_SECTIONS: PortfolioSectionId[] = [
	"knowledge",
	"projects",
	"works",
	"life",
];

function toNode(item: PortfolioItem): GalleryNode {
	return {
		id: item.id,
		title: item.title,
		summary: item.summary ?? "",
		body: item.body ?? "",
		accent: item.accent,
		coverSrc: item.cover ? siteUrl(item.cover) : undefined,
		kind: item.kind ?? (item.children?.length ? "folder" : "module"),
		children: (item.children ?? []).map(toNode),
	};
}

/** Seed nodes from static portfolioConfig (fallback when D1 empty / unavailable). */
export function seedNodesForSection(sectionId: string): GalleryNode[] {
	if (!FOLIO_SECTIONS.includes(sectionId as PortfolioSectionId)) return [];
	return (portfolioConfig.items[sectionId as PortfolioSectionId] ?? []).map(toNode);
}

export function isFolioSection(sectionId: string): sectionId is PortfolioSectionId {
	return FOLIO_SECTIONS.includes(sectionId as PortfolioSectionId);
}

export { FOLIO_SECTIONS };
