import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import {
	defaultProjectCatalog,
	applyProjectOrder,
	isProjectCatalogGroup,
	PROJECT_GROUP_LABEL_ZH,
	type ProjectCatalogGroup,
	type ProjectOrderFile,
} from "../../projects/project-catalog";

export const runtime = "nodejs";

const ORDER_FILE = path.join(process.cwd(), "content", "project-order.json");
const LEGACY_FILE = path.join(process.cwd(), "content", "studio-catalog.json");

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
	groups?: Record<string, ProjectCatalogGroup>;
	customs?: CatalogEntry[];
};

function normalizeGroups(
	raw: unknown,
): Record<string, ProjectCatalogGroup> {
	if (!raw || typeof raw !== "object") return {};
	const out: Record<string, ProjectCatalogGroup> = {};
	for (const [id, g] of Object.entries(raw as Record<string, unknown>)) {
		if (typeof g === "string" && isProjectCatalogGroup(g)) out[id] = g;
	}
	return out;
}

async function readOrderFile(): Promise<ProjectOrderFile> {
	try {
		const raw = await readFile(ORDER_FILE, "utf8");
		const data = JSON.parse(raw) as ProjectOrderFile;
		return {
			order: Array.isArray(data.order)
				? data.order.filter((id) => typeof id === "string")
				: [],
			hidden: Array.isArray(data.hidden)
				? data.hidden.filter((id) => typeof id === "string")
				: [],
			groups: normalizeGroups(data.groups),
		};
	} catch {
		return { order: [], hidden: [], groups: {} };
	}
}

function entriesForClient(order: ProjectOrderFile): CatalogEntry[] {
	return applyProjectOrder(defaultProjectCatalog(), order).map((e) => ({
		id: e.id,
		title: e.id,
		group: PROJECT_GROUP_LABEL_ZH[e.group],
		source: e.kind,
	}));
}

export async function GET() {
	const order = await readOrderFile();
	return NextResponse.json({
		items: entriesForClient(order),
		hidden: order.hidden,
		order: order.order,
		groups: order.groups ?? {},
	} satisfies CatalogPersist);
}

export async function POST(req: Request) {
	try {
		const body = (await req.json()) as CatalogPersist;
		if (!Array.isArray(body.hidden)) {
			return NextResponse.json({ error: "格式无效" }, { status: 400 });
		}

		const orderFromBody =
			Array.isArray(body.order) && body.order.length > 0
				? body.order.filter((id) => typeof id === "string")
				: Array.isArray(body.items)
					? body.items
							.filter((c) => c && typeof c.id === "string")
							.filter(
								(c) =>
									c.source !== "custom" && !String(c.id).startsWith("custom_"),
							)
							.map((c) => c.id)
					: [];

		const hidden = body.hidden.filter((id) => typeof id === "string");
		const groups = normalizeGroups(body.groups);
		const payload: ProjectOrderFile = {
			order: orderFromBody,
			hidden,
			groups,
		};
		await writeFile(ORDER_FILE, `${JSON.stringify(payload, null, "\t")}\n`, "utf8");

		const items = entriesForClient(payload);
		const legacy: CatalogPersist = {
			items,
			hidden,
			order: payload.order,
			groups: payload.groups,
		};
		await writeFile(
			LEGACY_FILE,
			`${JSON.stringify(legacy, null, "\t")}\n`,
			"utf8",
		);

		return NextResponse.json({ ok: true });
	} catch (err) {
		const message = err instanceof Error ? err.message : "保存失败";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
