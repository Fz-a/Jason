-- Folio CMS schema (Cloudflare D1)

CREATE TABLE IF NOT EXISTS users (
	id TEXT PRIMARY KEY,
	username TEXT NOT NULL UNIQUE,
	password_hash TEXT NOT NULL,
	created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
	id TEXT PRIMARY KEY,
	user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	expires_at TEXT NOT NULL,
	created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS media (
	id TEXT PRIMARY KEY,
	r2_key TEXT NOT NULL UNIQUE,
	url TEXT NOT NULL,
	mime TEXT NOT NULL,
	size INTEGER NOT NULL,
	created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS folio_nodes (
	id TEXT PRIMARY KEY,
	section_id TEXT NOT NULL,
	parent_id TEXT,
	kind TEXT NOT NULL CHECK (kind IN ('folder', 'module')),
	title TEXT NOT NULL,
	summary TEXT NOT NULL DEFAULT '',
	body TEXT NOT NULL DEFAULT '',
	cover_media_id TEXT REFERENCES media(id) ON DELETE SET NULL,
	cover_url TEXT,
	accent TEXT,
	sort_order INTEGER NOT NULL DEFAULT 0,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_folio_section_parent
	ON folio_nodes(section_id, parent_id, sort_order);

CREATE TABLE IF NOT EXISTS posts (
	id TEXT PRIMARY KEY,
	slug TEXT NOT NULL UNIQUE,
	title TEXT NOT NULL,
	body_md TEXT NOT NULL DEFAULT '',
	status TEXT NOT NULL DEFAULT 'draft'
		CHECK (status IN ('draft', 'published', 'archived')),
	published_at TEXT,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
