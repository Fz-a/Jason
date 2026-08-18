# Folio buddy AI (optional)

Copy to `.env` / Vercel / Cloudflare env when you want full LLM answers.
Without a key, chat still works via local knowledge files in `public/folio-buddy/kb/`.

```
FOLIO_BUDDY_API_KEY=
FOLIO_BUDDY_API_BASE=https://api.openai.com/v1
FOLIO_BUDDY_MODEL=gpt-4o-mini
```

Compatible with OpenAI-style `/chat/completions` providers (OpenAI, OpenRouter, etc.).
Set `FOLIO_BUDDY_API_BASE` to the provider base URL (no trailing slash required).
