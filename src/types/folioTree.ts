export type GalleryNodeKind = "folder" | "module";

/** One cell in a module collage mosaic. */
export type FolioCollageCell = {
	src: string;
	/** CSS object-position，如 "50% 35%" */
	pos?: string;
};

/** 16:9 mosaic under a module sheet. */
export type FolioCollage = {
	layout: string;
	cells: FolioCollageCell[];
};

export type GalleryNode = {
	id: string;
	title: string;
	summary?: string;
	body?: string;
	accent?: string;
	coverSrc?: string;
	/** CSS object-position，如 "50% 35%"，控制封面裁切焦点 */
	coverPos?: string;
	/** folder = 可继续嵌套；module = 展示模块 */
	kind?: GalleryNodeKind;
	/** Module sheet 下方 16:9 拼图 */
	collage?: FolioCollage;
	children?: GalleryNode[];
};
