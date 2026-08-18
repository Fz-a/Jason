const STORAGE_KEY = "folio-music-favs";

export type FavTrack = {
	url?: string;
	name?: string;
	artist?: string;
};

export function trackKey(track: FavTrack | null | undefined): string {
	if (!track) return "";
	if (track.url) return track.url;
	return `${track.name || ""}|${track.artist || ""}`;
}

export function loadFavs(): string[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		const parsed = raw ? JSON.parse(raw) : [];
		return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
	} catch {
		return [];
	}
}

export function saveFavs(keys: string[]): void {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
}

export function isFav(track: FavTrack | null | undefined, keys = loadFavs()): boolean {
	const k = trackKey(track);
	return !!k && keys.includes(k);
}

export function toggleFav(track: FavTrack | null | undefined): string[] {
	const k = trackKey(track);
	if (!k) return loadFavs();
	const cur = loadFavs();
	const next = cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k];
	saveFavs(next);
	return next;
}
