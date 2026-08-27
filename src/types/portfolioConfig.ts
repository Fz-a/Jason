export type PortfolioNavLink = {
	label: string;
	labelZh?: string;
	href: string;
};

export type PortfolioSectionId = "knowledge" | "projects" | "works" | "life" | "music";

export type PortfolioMotto = {
	/** Primary line (often Chinese) */
	phrase: string;
	/** Secondary gloss / English */
	gloss?: string;
	href: string;
};

export type PortfolioSection = {
	id: PortfolioSectionId;
	title: string;
	titleZh: string;
	href: string;
	accent?: string;
	cover?: string;
};

export type PortfolioItem = {
	id: string;
	title: string;
	titleZh?: string;
	summary?: string;
	summaryZh?: string;
	/** Longer detail text for section editor */
	body?: string;
	href?: string;
	external?: boolean;
	cover?: string;
	accent?: string;
	/** folder = nestable；module = leaf showcase */
	kind?: "folder" | "module";
	/** Nested entries (knowledge folders, etc.) */
	children?: PortfolioItem[];
};

export type PortfolioSocialLink = {
	label: string;
	href: string;
	/** astro-icon / Iconify name, e.g. simple-icons:github */
	icon: string;
};

export type PortfolioConfig = {
	brand: string;
	brandAccent?: string;
	navLinks: PortfolioNavLink[];
	socialLinks?: PortfolioSocialLink[];
	tagline: string;
	taglineZh?: string;
	/** Hero primary line */
	headline: string;
	headlineStrong?: string;
	/** Hero secondary gloss under headline */
	headlineGloss?: string;
	bio: string;
	bioZh?: string;
	/** Optional home mottos (unused when empty) */
	mottos?: PortfolioMotto[];
	sections: PortfolioSection[];
	items: Record<PortfolioSectionId, PortfolioItem[]>;
	portrait?: string;
	/** Hover greeting animation (GIF / animated WebP) */
	portraitHello?: string;
	contactHref: string;
	contactEyebrow?: string;
	contactTitle?: string;
	/** MiMo home — full-bleed image revealed by pointer wipe (swap via config or CMS export) */
	homeWipeBg?: string;
};
