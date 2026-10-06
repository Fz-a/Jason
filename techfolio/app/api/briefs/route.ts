import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FILE = path.join(process.cwd(), "content", "briefs.json");

export async function GET() {
	try {
		const raw = await readFile(FILE, "utf8");
		return NextResponse.json(JSON.parse(raw));
	} catch {
		return NextResponse.json({});
	}
}

export async function POST(req: Request) {
	try {
		const body = await req.json();
		if (!body || typeof body !== "object" || Array.isArray(body)) {
			return NextResponse.json({ error: "Missing briefs object" }, { status: 400 });
		}
		await writeFile(FILE, `${JSON.stringify(body, null, 2)}\n`, "utf8");
		return NextResponse.json({ ok: true, path: "content/briefs.json" });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Write failed";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
