import folioStaticSeed from "@/constants/folio-static-seed.json";
import type { PortfolioItem, PortfolioSectionId } from "@/types/portfolioConfig";
import type { GalleryNode } from "@/types/folioTree";
import { portfolioConfig } from "@/config";
import { normalizeGalleryNode } from "@/utils/folio-tree";
import { url as siteUrl } from "@/utils/url-utils";

type FolioStaticSeed = {
	trees?: Partial<Record<PortfolioSectionId, GalleryNode[]>>;
};

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

/** Seed nodes for static HTML (exported CMS) or portfolioConfig fallback. */
export function seedNodesForSection(sectionId: string): GalleryNode[] {
	if (!FOLIO_SECTIONS.includes(sectionId as PortfolioSectionId)) return [];
	const sid = sectionId as PortfolioSectionId;
	const exported = (folioStaticSeed as FolioStaticSeed).trees?.[sid];
	if (exported !== undefined) {
		return exported.map(normalizeGalleryNode);
	}
	return (portfolioConfig.items[sid] ?? []).map(toNode);
}

export function isFolioSection(sectionId: string): sectionId is PortfolioSectionId {
	return FOLIO_SECTIONS.includes(sectionId as PortfolioSectionId);
}

export { FOLIO_SECTIONS };
