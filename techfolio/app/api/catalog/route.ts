import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const FILE = path.join(process.cwd(), "content", "studio-catalog.json");

type CatalogEntry = {
	id: string;
	title: string;
	group: string;
	source: string;
};

export type CatalogPersist = {
	items: CatalogEntry[];
	hidden: string[];
	order?: string[];
	customs?: CatalogEntry[];
};

export async function GET() {
	try {
		const raw = await readFile(FILE, "utf8");
		return NextResponse.json(JSON.parse(raw) as CatalogPersist);
	} catch {
		return NextResponse.json({
			items: [],
			hidden: [],
		} satisfies CatalogPersist);
	}
}

export async function POST(req: Request) {
	try {
		const body = (await req.json()) as CatalogPersist;
		if (!Array.isArray(body.hidden)) {
			return NextResponse.json({ error: "格式无效" }, { status: 400 });
		}
		const items = Array.isArray(body.items)
			? body.items
					.filter(
						(c) =>
							c &&
							typeof c.id === "string" &&
							typeof c.title === "string" &&
							typeof c.group === "string",
					)
					.map((c) => ({
						id: c.id,
						title: c.title,
						group: c.group,
						source: typeof c.source === "string" ? c.source : "custom",
					}))
			: [];
		const payload: CatalogPersist = {
			items,
			hidden: body.hidden.filter((id) => typeof id === "string"),
		};
		await writeFile(FILE, `${JSON.stringify(payload, null, "\t")}\n`, "utf8");
		return NextResponse.json({ ok: true });
	} catch (err) {
		const message = err instanceof Error ? err.message : "保存失败";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
