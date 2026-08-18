import {
	type NavBarConfig,
	type NavBarLink,
	type NavBarSearchConfig,
	NavBarSearchMethod,
} from "../types/navBarConfig";

// ============================================================================
// 导航栏配置 - 根据顺序动态生成导航栏链接
// NavBar Configuration - Dynamically generate navigation bar links based on order
// ============================================================================
const getDynamicNavBarConfig = (): NavBarConfig => {
	const links: NavBarLink[] = [
		LinkPresets.Home,
		LinkPresets.Knowledge,
		LinkPresets.Projects,
		LinkPresets.Works,
		LinkPresets.Life,
		LinkPresets.Guestbook,
	];

	return { links } as NavBarConfig;
};

// 导航搜索配置
export const navBarSearchConfig: NavBarSearchConfig = {
	method: NavBarSearchMethod.PageFind,
};

// ============================================================================
// 链接预设 - 可自由自定义导航栏链接的名称、图标和URL
// Link Presets - Allows free customization of the name, icon, and URL of navigation bar links
// ============================================================================
export const LinkPresets: Record<string, NavBarLink> = {
	Home: {
		name: "Home",
		url: "/",
		icon: "material-symbols:home",
	},
	Knowledge: {
		name: "Knowledge",
		url: "/knowledge/",
		icon: "material-symbols:menu-book",
	},
	Projects: {
		name: "Projects",
		url: "/projects/",
		icon: "material-symbols:deployed-code",
	},
	Works: {
		name: "University",
		url: "/works/",
		icon: "material-symbols:palette",
	},
	Life: {
		name: "DIY",
		url: "/life/",
		icon: "material-symbols:favorite",
	},
	Blog: {
		name: "Blog",
		url: "/blog/",
		icon: "material-symbols:article",
	},
	Archive: {
		name: "Archive",
		url: "/archive/",
		icon: "material-symbols:archive",
	},
	Categories: {
		name: "Categories",
		url: "/categories/",
		icon: "material-symbols:folder-open-rounded",
	},
	Tags: {
		name: "Tags",
		url: "/tags/",
		icon: "material-symbols:tag-rounded",
	},
	Friends: {
		name: "Friends",
		url: "/friends/",
		icon: "material-symbols:link-2-rounded",
		pageKey: "friends",
	},
	Guestbook: {
		name: "Contact",
		url: "/guestbook/",
		icon: "material-symbols:chat",
		pageKey: "guestbook",
	},
	Dynamic: {
		name: "Dynamic",
		url: "/dynamic/",
		icon: "material-symbols:forum-rounded",
		pageKey: "dynamic",
	},
	Gallery: {
		name: "Gallery",
		url: "/gallery/",
		icon: "material-symbols:photo-library",
		pageKey: "gallery",
	},
	Booknav: {
		name: "Bookmarks",
		url: "/booknav/",
		icon: "material-symbols:bookmarks",
		pageKey: "booknav",
	},
	Bilibili: {
		name: "Bilibili",
		url: "/bilibili/",
		icon: "fa7-brands:bilibili",
		pageKey: "bilibili",
	},
	Bangumi: {
		name: "Bangumi",
		url: "/bangumi/",
		icon: "material-symbols:movie",
		pageKey: "bangumi",
	},
	VNDB: {
		name: "VNDB",
		url: "/vndb/",
		icon: "material-symbols:chrome-reader-mode-rounded",
		pageKey: "vndb",
	},
	MAL: {
		name: "AnimeList",
		url: "/myanimelist/",
		icon: "material-symbols:menu-book",
		pageKey: "mal",
	},
	Sponsor: {
		name: "Sponsor",
		url: "/sponsor/",
		icon: "material-symbols:favorite",
		pageKey: "sponsor",
	},
	About: {
		name: "About",
		url: "/about/",
		icon: "material-symbols:person",
	},
};

export const navBarConfig: NavBarConfig = getDynamicNavBarConfig();
