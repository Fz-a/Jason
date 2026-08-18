/**
 * Vercel serverless — POST /api/folio-buddy-chat
 * Env: FOLIO_BUDDY_API_KEY (or OPENAI_API_KEY), FOLIO_BUDDY_API_BASE, FOLIO_BUDDY_MODEL
 */
import fs from "node:fs";
import path from "node:path";

function readKb() {
	const dir = path.join(process.cwd(), "public", "folio-buddy", "kb");
	if (!fs.existsSync(dir)) return "";
	const parts = [];
	for (const name of fs.readdirSync(dir)) {
		if (!name.endsWith(".md")) continue;
		parts.push(`## ${name}\n${fs.readFileSync(path.join(dir, name), "utf8")}`);
	}
	return parts.join("\n\n");
}

function localAnswer(message, kb) {
	const q = String(message || "").toLowerCase();
	const chunks = kb
		.split(/^##\s+/m)
		.map((s) => s.trim())
		.filter(Boolean);
	let best = chunks[0] || "我还在学习站主的故事。请先在 public/folio-buddy/kb/ 里补充知识库。";
	let score = -1;
	for (const c of chunks) {
		const head = c.slice(0, 40).toLowerCase();
		const body = c.toLowerCase();
		let s = 0;
		for (const w of q.split(/[^\p{L}\p{N}]+/u).filter((x) => x.length > 1)) {
			if (body.includes(w)) s += 2;
			if (head.includes(w)) s += 1;
		}
		if (s > score) {
			score = s;
			best = c;
		}
	}
	const excerpt = best.replace(/^[\w.-]+\n/, "").trim().slice(0, 520);
	return score <= 0
		? "我暂时只在本地知识库里找到有限信息。你可以问「你是谁」「经历」「本站」，或稍后配置 FOLIO_BUDDY_API_KEY 启用完整 AI。"
		: `根据站主留下的笔记：\n\n${excerpt}`;
}

export default async function handler(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");
	if (req.method === "OPTIONS") return res.status(204).end();
	if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

	const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
	const message = String(body.message || "").trim();
	const history = Array.isArray(body.history) ? body.history.slice(-8) : [];
	if (!message) return res.status(400).json({ error: "empty message" });

	const kb = readKb();
	const key = process.env.FOLIO_BUDDY_API_KEY || process.env.OPENAI_API_KEY;
	const base = (process.env.FOLIO_BUDDY_API_BASE || "https://api.openai.com/v1").replace(/\/$/, "");
	const model = process.env.FOLIO_BUDDY_MODEL || "gpt-4o-mini";

	if (!key) {
		return res.status(200).json({ reply: localAnswer(message, kb), source: "kb" });
	}

	const system = [
		"你是本站的墨趣伙伴：语气安定、祥和、带一点喜悦，简洁有温度。",
		"只依据下方知识库与常识回答；不知道就坦诚说，并邀请访客去对应栏目逛逛。",
		"不要编造站主未提供的经历。用中文回答，除非对方用英文。",
		"",
		"# 知识库",
		kb || "（知识库为空）",
	].join("\n");

	const messages = [
		{ role: "system", content: system },
		...history
			.filter((m) => m && (m.role === "user" || m.role === "assistant") && m.content)
			.map((m) => ({ role: m.role, content: String(m.content).slice(0, 2000) })),
		{ role: "user", content: message.slice(0, 2000) },
	];

	try {
		const r = await fetch(`${base}/chat/completions`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${key}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ model, messages, temperature: 0.6, max_tokens: 700 }),
		});
		const data = await r.json();
		if (!r.ok) {
			return res.status(200).json({
				reply: localAnswer(message, kb),
				source: "kb-fallback",
				error: data?.error?.message || r.statusText,
			});
		}
		const reply = data?.choices?.[0]?.message?.content?.trim() || localAnswer(message, kb);
		return res.status(200).json({ reply, source: "ai" });
	} catch (err) {
		return res.status(200).json({
			reply: localAnswer(message, kb),
			source: "kb-fallback",
			error: String(err?.message || err),
		});
	}
}
