const SESSION_COOKIE = "folio_cms_session";
const SESSION_DAYS = 14;

function bytesToBase64(bytes: Uint8Array): string {
	let binary = "";
	for (const b of bytes) binary += String.fromCharCode(b);
	return btoa(binary);
}

function base64ToBytes(b64: string): Uint8Array {
	const binary = atob(b64);
	const out = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
	return out;
}

export async function hashPassword(password: string, salt?: Uint8Array): Promise<string> {
	const saltBytes = salt ?? crypto.getRandomValues(new Uint8Array(16));
	const keyMaterial = await crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(password),
		"PBKDF2",
		false,
		["deriveBits"],
	);
	const bits = await crypto.subtle.deriveBits(
		{
			name: "PBKDF2",
			salt: saltBytes as BufferSource,
			iterations: 100_000,
			hash: "SHA-256",
		},
		keyMaterial,
		256,
	);
	return `pbkdf2:100000:${bytesToBase64(saltBytes)}:${bytesToBase64(new Uint8Array(bits))}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
	const parts = stored.split(":");
	if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
	const iterations = Number(parts[1]);
	if (!Number.isFinite(iterations) || iterations < 1) return false;
	const salt = base64ToBytes(parts[2]!);
	const expected = parts[3]!;
	const keyMaterial = await crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(password),
		"PBKDF2",
		false,
		["deriveBits"],
	);
	const bits = await crypto.subtle.deriveBits(
		{
			name: "PBKDF2",
			salt: salt as BufferSource,
			iterations,
			hash: "SHA-256",
		},
		keyMaterial,
		256,
	);
	const actual = bytesToBase64(new Uint8Array(bits));
	if (actual.length !== expected.length) return false;
	let ok = 0;
	for (let i = 0; i < actual.length; i++) {
		ok |= actual.charCodeAt(i) ^ expected.charCodeAt(i);
	}
	return ok === 0;
}

export function newId(prefix = ""): string {
	const id = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
	return prefix ? `${prefix}_${id}` : id;
}

function parseCookies(header: string | null): Record<string, string> {
	if (!header) return {};
	const out: Record<string, string> = {};
	for (const part of header.split(";")) {
		const idx = part.indexOf("=");
		if (idx < 0) continue;
		const k = part.slice(0, idx).trim();
		const v = part.slice(idx + 1).trim();
		if (k) out[k] = decodeURIComponent(v);
	}
	return out;
}

export function getSessionIdFromRequest(request: Request): string | null {
	const cookies = parseCookies(request.headers.get("cookie"));
	return cookies[SESSION_COOKIE] || null;
}

export function sessionCookieHeader(
	sessionId: string,
	opts: { secure?: boolean; maxAgeSec?: number } = {},
): string {
	const maxAgeSec = opts.maxAgeSec ?? SESSION_DAYS * 86400;
	const parts = [
		`${SESSION_COOKIE}=${encodeURIComponent(sessionId)}`,
		"Path=/",
		"HttpOnly",
		"SameSite=Lax",
		`Max-Age=${maxAgeSec}`,
	];
	if (opts.secure !== false) parts.push("Secure");
	return parts.join("; ");
}

export function clearSessionCookieHeader(secure = true): string {
	return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? "; Secure" : ""}`;
}

export function requestIsSecure(request: Request): boolean {
	const url = new URL(request.url);
	if (url.protocol === "https:") return true;
	const proto = request.headers.get("x-forwarded-proto");
	return proto === "https";
}

export type CmsUser = {
	id: string;
	username: string;
};

export async function createSession(db: D1Database, userId: string): Promise<string> {
	const id = newId("sess");
	const expires = new Date(Date.now() + SESSION_DAYS * 86400_000).toISOString();
	await db
		.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)")
		.bind(id, userId, expires)
		.run();
	return id;
}

export async function destroySession(db: D1Database, sessionId: string): Promise<void> {
	await db.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionId).run();
}

export async function getUserFromSession(
	db: D1Database,
	sessionId: string | null,
): Promise<CmsUser | null> {
	if (!sessionId) return null;
	const row = await db
		.prepare(
			`SELECT u.id AS id, u.username AS username, s.expires_at AS expires_at
			 FROM sessions s
			 JOIN users u ON u.id = s.user_id
			 WHERE s.id = ?`,
		)
		.bind(sessionId)
		.first<{ id: string; username: string; expires_at: string }>();
	if (!row) return null;
	if (new Date(row.expires_at).getTime() < Date.now()) {
		await destroySession(db, sessionId);
		return null;
	}
	return { id: row.id, username: row.username };
}

export async function requireUser(
	db: D1Database,
	request: Request,
): Promise<CmsUser | Response> {
	const user = await getUserFromSession(db, getSessionIdFromRequest(request));
	if (!user) {
		return new Response(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
			headers: { "Content-Type": "application/json; charset=utf-8" },
		});
	}
	return user;
}

export async function findUserByUsername(
	db: D1Database,
	username: string,
): Promise<{ id: string; username: string; password_hash: string } | null> {
	return (
		(await db
			.prepare("SELECT id, username, password_hash FROM users WHERE username = ?")
			.bind(username)
			.first<{ id: string; username: string; password_hash: string }>()) ?? null
	);
}

export async function ensureAdminUser(
	db: D1Database,
	username: string,
	password: string,
): Promise<void> {
	const existing = await findUserByUsername(db, username);
	if (existing) return;
	const id = newId("user");
	const password_hash = await hashPassword(password);
	await db
		.prepare("INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)")
		.bind(id, username, password_hash)
		.run();
}
