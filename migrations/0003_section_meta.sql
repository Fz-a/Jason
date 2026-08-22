-- Track intentional empty section trees (so GET does not re-seed)
CREATE TABLE IF NOT EXISTS folio_section_meta (
	section_id TEXT PRIMARY KEY,
	updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
