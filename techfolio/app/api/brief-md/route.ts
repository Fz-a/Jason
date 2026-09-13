import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const DIR = path.join(process.cwd(), "content", "briefs-md");

function safeId(id: string) {
	return id.replace(/[^\w\-]+/g, "-").replace(/^-|-$/g, "") || "untitled";
}

export async function GET(req: Request) {
	const url = new URL(req.url);
	const id = url.searchParams.get("id");
	if (!id) {
		return NextResponse.json({ error: "缺少 id" }, { status: 400 });
	}
	try {
		const file = path.join(DIR, `${safeId(id)}.md`);
		const markdown = await readFile(file, "utf8");
		return NextResponse.json({ id: safeId(id), markdown });
	} catch {
		return NextResponse.json({ error: "文件不存在" }, { status: 404 });
	}
}

export async function POST(req: Request) {
	try {
		const body = (await req.json()) as { id?: string; markdown?: string };
		if (!body.id || typeof body.markdown !== "string") {
			return NextResponse.json({ error: "需要 id 与 markdown" }, { status: 400 });
		}
		const id = safeId(body.id);
		await mkdir(DIR, { recursive: true });
		const file = path.join(DIR, `${id}.md`);
		await writeFile(file, body.markdown.replace(/\r\n/g, "\n"), "utf8");
		return NextResponse.json({ ok: true, path: `content/briefs-md/${id}.md` });
	} catch (err) {
		const message = err instanceof Error ? err.message : "写入失败";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
