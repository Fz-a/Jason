import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { GalleryNode } from "@/types/folioTree";
import { hashPassword, newId, verifyPassword } from "@/lib/cms/auth";
import { seedNodesForSection } from "@/lib/cms/seed-nodes";

type Store = {
	users: Array<{ id: string; username: string; password_hash: string }>;
	sessions: Array<{ id: string; user_id: string; expires_at: string }>;
	trees: Record<string, GalleryNode[]>;
	media: Array<{
		id: string;
		r2_key: string;
		url: string;
		mime: string;
		size: number;
		created_at: string;
		dataUrl?: string;
	}>;
};

const DATA_DIR = join(process.cwd(), ".data");
const STORE_PATH = join(DATA_DIR, "folio-cms-local.json");

function emptyStore(): Store {
	return { users: [], sessions: [], trees: {}, media: [] };
}

export function isLocalCmsEnabled(): boolean {
	try {
		return (
			import.meta.env.DEV === true ||
			process.env.CMS_LOCAL === "1" ||
			process.env.CMS_LOCAL === "true"
		);
	} catch {
		return false;
	}
}

export function readLocalStore(): Store {
	try {
		if (!existsSync(STORE_PATH)) return emptyStore();
		return JSON.parse(readFileSync(STORE_PATH, "utf8")) as Store;
	} catch {
		return emptyStore();
	}
}

export function writeLocalStore(store: Store): void {
	mkdirSync(DATA_DIR, { recursive: true });
	writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

export function localGetTree(section: string): GalleryNode[] {
	const store = readLocalStore();
	// Key present (even []) means user saved this section — do not re-seed
	if (Object.hasOwn(store.trees, section)) {
		return store.trees[section] ?? [];
	}
	return seedNodesForSection(section);
}

export function localPutTree(section: string, nodes: GalleryNode[]): GalleryNode[] {
	const store = readLocalStore();
	store.trees[section] = nodes;
	writeLocalStore(store);
	return nodes;
}

export async function localEnsureAdmin(username: string, password: string): Promise<void> {
	const store = readLocalStore();
	const existing = store.users.find((u) => u.username === username);
	if (existing) {
		// Keep solo-admin hash aligned with CMS_ADMIN_PASSWORD in .env
		if (!(await verifyPassword(password, existing.password_hash))) {
			existing.password_hash = await hashPassword(password);
			writeLocalStore(store);
		}
		return;
	}
	store.users.push({
		id: newId("user"),
		username,
		password_hash: await hashPassword(password),
	});
	writeLocalStore(store);
}

export async function localLogin(
	username: string,
	password: string,
): Promise<{ id: string; username: string; sessionId: string } | null> {
	await localEnsureAdmin(
		process.env.CMS_ADMIN_USERNAME || "admin",
		process.env.CMS_ADMIN_PASSWORD || "284655",
	);
	const store = readLocalStore();
	const user = store.users.find((u) => u.username === username);
	if (!user || !(await verifyPassword(password, user.password_hash))) return null;
	const sessionId = newId("sess");
	const expires = new Date(Date.now() + 14 * 86400_000).toISOString();
	store.sessions = store.sessions.filter((s) => new Date(s.expires_at).getTime() > Date.now());
	store.sessions.push({ id: sessionId, user_id: user.id, expires_at: expires });
	writeLocalStore(store);
	return { id: user.id, username: user.username, sessionId };
}

export function localGetUser(
	sessionId: string | null,
): { id: string; username: string } | null {
	if (!sessionId) return null;
	const store = readLocalStore();
	const sess = store.sessions.find((s) => s.id === sessionId);
	if (!sess || new Date(sess.expires_at).getTime() < Date.now()) return null;
	const user = store.users.find((u) => u.id === sess.user_id);
	if (!user) return null;
	return { id: user.id, username: user.username };
}

export function localLogout(sessionId: string | null): void {
	if (!sessionId) return;
	const store = readLocalStore();
	store.sessions = store.sessions.filter((s) => s.id !== sessionId);
	writeLocalStore(store);
}

export async function localUpload(file: File): Promise<{
	id: string;
	r2_key: string;
	url: string;
	mime: string;
	size: number;
	created_at: string;
}> {
	const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
	if (!allowed.has(file.type)) throw new Error("Only JPEG, PNG, WebP, or GIF images are allowed");
	if (file.size > 5 * 1024 * 1024) throw new Error("Image must be 5MB or smaller");

	const id = newId("media");
	const buf = Buffer.from(await file.arrayBuffer());
	const dataUrl = `data:${file.type};base64,${buf.toString("base64")}`;
	const url = `/api/media/file/?id=${encodeURIComponent(id)}`;
	const row = {
		id,
		r2_key: `local/${id}`,
		url,
		mime: file.type,
		size: file.size,
		created_at: new Date().toISOString(),
		dataUrl,
	};
	const store = readLocalStore();
	store.media.unshift(row);
	writeLocalStore(store);
	return {
		id: row.id,
		r2_key: row.r2_key,
		url: row.url,
		mime: row.mime,
		size: row.size,
		created_at: row.created_at,
	};
}

export function localListMedia() {
	return readLocalStore().media.map(({ dataUrl: _, ...rest }) => rest);
}

export function localGetMedia(id: string) {
	return readLocalStore().media.find((m) => m.id === id) ?? null;
}

export { STORE_PATH };
