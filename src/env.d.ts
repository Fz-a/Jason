/// <reference types="astro/client" />
/// <reference types="@cloudflare/workers-types" />
/// <reference path="../.astro/types.d.ts" />

interface CmsEnv {
	DB: D1Database;
	MEDIA: R2Bucket;
	CMS_SESSION_SECRET?: string;
	CMS_ADMIN_USERNAME?: string;
	CMS_ADMIN_PASSWORD?: string;
}

type Runtime = import("@astrojs/cloudflare").Runtime<CmsEnv>;

declare namespace App {
	interface Locals extends Runtime {}
}

declare global {
	namespace Cloudflare {
		interface Env extends CmsEnv {}
	}

	interface ImportMetaEnv {
		readonly MEILI_MASTER_KEY: string;
		readonly PUBLIC_DISPLAY_SETTINGS?: string;
		readonly CMS_SESSION_SECRET?: string;
		readonly CMS_ADMIN_USERNAME?: string;
		readonly CMS_ADMIN_PASSWORD?: string;
	}

	interface ITOCManager {
		init: () => void;
		render: () => void;
		attach: () => void;
		cleanup: () => void;
	}

	interface Window {
		SidebarTOC: {
			manager: ITOCManager | null;
		};
		FloatingTOC: {
			btn: HTMLElement | null;
			panel: HTMLElement | null;
			manager: ITOCManager | null;
			isPostPage: () => boolean;
		};
		toggleFloatingTOC: () => void;
		tocInternalNavigation: boolean;
		// biome-ignore lint/suspicious/noExplicitAny: External library without types
		spine: any;
		closeAnnouncement: () => void;
		semifullScrollHandler?: (() => void) | undefined;
		initSemifullScrollDetection?: () => void;
	}
}

export {};
