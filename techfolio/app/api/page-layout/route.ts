import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import {
	defaultPageLayout,
	normalizePageLayout,
	type PageLayoutFile,
} from "../../lib/page-layout";

export const runtime = "nodejs";

const LAYOUT_FILE = path.join(process.cwd(), "content", "page-layout.json");

async function readLayout(): Promise<PageLayoutFile> {
	try {
		const raw = await readFile(LAYOUT_FILE, "utf8");
		return normalizePageLayout(JSON.parse(raw));
	} catch {
		return defaultPageLayout();
	}
}

export async function GET() {
	const layout = await readLayout();
	return NextResponse.json(layout);
}

export async function POST(req: Request) {
	try {
		const body = (await req.json()) as unknown;
		const layout = normalizePageLayout(body);
		await writeFile(LAYOUT_FILE, `${JSON.stringify(layout, null, 2)}\n`, "utf8");
		return NextResponse.json({ ok: true, layout });
	} catch (err) {
		const message = err instanceof Error ? err.message : "save failed";
		return NextResponse.json({ ok: false, error: message }, { status: 500 });
	}
}
