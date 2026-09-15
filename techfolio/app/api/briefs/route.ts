import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

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
			return NextResponse.json({ error: "需要 briefs 对象" }, { status: 400 });
		}
		await writeFile(FILE, `${JSON.stringify(body, null, 2)}\n`, "utf8");
		return NextResponse.json({ ok: true, path: "content/briefs.json" });
	} catch (err) {
		const message = err instanceof Error ? err.message : "写入失败";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
