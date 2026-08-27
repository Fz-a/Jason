export type FolioMediaItem = {
	id: string;
	url: string;
	mime?: string;
	size?: number;
	created_at?: string;
};

/** Parse CMS media id from API or static portfolio URLs. */
export function parseMediaId(url: string): string | null {
	if (!url) return null;
	try {
		const parsed = new URL(url, "https://local.invalid");
		const id = parsed.searchParams.get("id");
		if (id) return decodeURIComponent(id);
	} catch {
		/* ignore */
	}
	const apiMatch = url.match(/[?&]id=([^&]+)/);
	if (apiMatch?.[1]) return decodeURIComponent(apiMatch[1]);
	const staticMatch = url.match(/\/portfolio\/cms\/(media_[^./?#]+)/);
	if (staticMatch?.[1]) return staticMatch[1];
	return null;
}

function extFromMime(mime?: string, url?: string) {
	if (mime === "image/png") return "png";
	if (mime === "image/webp") return "webp";
	if (mime === "image/gif") return "gif";
	if (mime === "image/jpeg") return "jpg";
	const pathMatch = url?.match(/\.([a-z0-9]+)(?:\?|$)/i);
	if (pathMatch?.[1]) return pathMatch[1].toLowerCase();
	return "jpg";
}

export function mediaDownloadHref(item: Pick<FolioMediaItem, "id" | "url" | "mime">) {
	const id = item.id || parseMediaId(item.url);
	if (id) {
		return `/api/media/file/?id=${encodeURIComponent(id)}&download=1`;
	}
	return item.url;
}

export function mediaDownloadFilename(item: Pick<FolioMediaItem, "id" | "url" | "mime">) {
	const id = item.id || parseMediaId(item.url);
	if (id) return `${id}.${extFromMime(item.mime, item.url)}`;
	const tail = item.url.split("/").pop()?.split("?")[0];
	return tail && tail.includes(".") ? tail : "image.jpg";
}

export async function downloadFolioMedia(
	item: Pick<FolioMediaItem, "id" | "url" | "mime">,
) {
	const href = mediaDownloadHref(item);
	const filename = mediaDownloadFilename(item);
	try {
		const res = await fetch(href);
		if (!res.ok) throw new Error("download failed");
		const blob = await res.blob();
		const objectUrl = URL.createObjectURL(blob);
		const anchor = document.createElement("a");
		anchor.href = objectUrl;
		anchor.download = filename;
		anchor.rel = "noopener";
		document.body.appendChild(anchor);
		anchor.click();
		anchor.remove();
		URL.revokeObjectURL(objectUrl);
		return true;
	} catch {
		const anchor = document.createElement("a");
		anchor.href = href;
		anchor.download = filename;
		anchor.rel = "noopener";
		anchor.target = "_blank";
		document.body.appendChild(anchor);
		anchor.click();
		anchor.remove();
		return false;
	}
}
