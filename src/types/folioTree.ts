export type GalleryNodeKind = "folder" | "module";

export type GalleryNode = {
	id: string;
	title: string;
	summary?: string;
	body?: string;
	accent?: string;
	coverSrc?: string;
	/** folder = 可继续嵌套；module = 展示模块 */
	kind?: GalleryNodeKind;
	children?: GalleryNode[];
};
