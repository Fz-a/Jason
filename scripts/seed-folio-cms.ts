/**
 * Seed Folio CMS into Cloudflare D1 (local or remote).
 *
 * Usage:
 *   CMS_ADMIN_PASSWORD=... pnpm db:seed
 *   CMS_ADMIN_PASSWORD=... pnpm db:seed:remote
 *
 * Requires wrangler + migrations applied (`pnpm db:migrate`).
 */
import { execFileSync } from "node:child_process";
import { createHash, randomBytes, pbkdf2Sync } from "node:crypto";
import { writeFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { portfolioConfig } from "../src/config/portfolioConfig";
import type { PortfolioItem, PortfolioSectionId } from "../src/types/portfolioConfig";

const SECTIONS: PortfolioSectionId[] = ["knowledge", "projects", "works", "life"];
const remote = process.argv.includes("--remote");
const username = process.env.CMS_ADMIN_USERNAME || "admin";
const password = process.env.CMS_ADMIN_PASSWORD || "284655";

type Flat = {
	id: string;
	section_id: string;
	parent_id: string | null;
	kind: string;
	title: string;
	summary: string;
	body: string;
	cover_url: string | null;
	accent: string | null;
	sort_order: number;
};

function sqlString(s: string): string {
	return `'${s.replace(/'/g, "''")}'`;
}

function hashPassword(pw: string): string {
	const salt = randomBytes(16);
	const derived = pbkdf2Sync(pw, salt, 100_000, 32, "sha256");
	return `pbkdf2:100000:${Buffer.from(salt).toString("base64")}:${Buffer.from(derived).toString("base64")}`;
}

function flatten(
	sectionId: string,
	items: PortfolioItem[],
	parentId: string | null,
): Flat[] {
	const out: Flat[] = [];
	items.forEach((item, i) => {
		const kind = item.kind ?? (item.children?.length ? "folder" : "module");
		out.push({
			id: item.id,
			section_id: sectionId,
			parent_id: parentId,
			kind,
			title: item.title,
			summary: item.summary ?? "",
			body: item.body ?? "",
			cover_url: item.cover ? item.cover : null,
			accent: item.accent ?? null,
			sort_order: i,
		});
		if (kind === "folder" && item.children?.length) {
			out.push(...flatten(sectionId, item.children, item.id));
		}
	});
	return out;
}

function main() {
	const lines: string[] = [];
	lines.push("DELETE FROM folio_nodes;");
	lines.push("DELETE FROM sessions;");

	const userId = createHash("sha256").update(`user:${username}`).digest("hex").slice(0, 16);
	const passwordHash = hashPassword(password);
	lines.push(
		`INSERT OR REPLACE INTO users (id, username, password_hash) VALUES (${sqlString(`user_${userId}`)}, ${sqlString(username)}, ${sqlString(passwordHash)});`,
	);

	for (const sectionId of SECTIONS) {
		const items = portfolioConfig.items[sectionId] ?? [];
		const flat = flatten(sectionId, items, null);
		for (const n of flat) {
			lines.push(
				`INSERT INTO folio_nodes (id, section_id, parent_id, kind, title, summary, body, cover_url, accent, sort_order) VALUES (${sqlString(n.id)}, ${sqlString(n.section_id)}, ${n.parent_id ? sqlString(n.parent_id) : "NULL"}, ${sqlString(n.kind)}, ${sqlString(n.title)}, ${sqlString(n.summary)}, ${sqlString(n.body)}, ${n.cover_url ? sqlString(n.cover_url) : "NULL"}, ${n.accent ? sqlString(n.accent) : "NULL"}, ${n.sort_order});`,
			);
		}
	}

	const sqlPath = join(tmpdir(), `folio-cms-seed-${Date.now()}.sql`);
	writeFileSync(sqlPath, lines.join("\n"), "utf8");

	const args = [
		"d1",
		"execute",
		"jason-folio-cms",
		"--file",
		sqlPath,
		"--config",
		"wrangler.jsonc",
	];
	if (remote) args.push("--remote");
	else args.push("--local");

	try {
		execFileSync("pnpm", ["exec", "wrangler", ...args], {
			stdio: "inherit",
			cwd: process.cwd(),
			shell: true,
		});
		console.log(
			`\nSeeded admin user "${username}" (password from CMS_ADMIN_PASSWORD or default "changeme").`,
		);
		console.log(`Sections: ${SECTIONS.join(", ")}`);
	} finally {
		try {
			unlinkSync(sqlPath);
		} catch {
			/* ignore */
		}
	}
}

main();
