# Folio CMS (Cloudflare D1 + R2)

Works-set section trees (Knowledge / Projects / University / DIY) are stored in **Cloudflare D1**. Image uploads go to **R2**. Auth uses HttpOnly session cookies.

## Local development (no Cloudflare account needed)

Default `pnpm dev` uses a **local JSON store** at `.data/folio-cms-local.json` when D1 is not bound:

1. `pnpm dev`
2. Open http://localhost:4321/admin/login/
3. Sign in with `admin` / `changeme` (override with `CMS_ADMIN_PASSWORD`)
4. Edit trees on `/knowledge/` etc., or upload at `/admin/media/`

## Cloudflare local (D1 + R2 via Wrangler)

1. Create remote resources once (replace ids in `wrangler.jsonc`):

```bash
pnpm exec wrangler d1 create jason-folio-cms
pnpm exec wrangler r2 bucket create jason-folio-media
```

2. Apply migrations & seed:

```bash
pnpm db:migrate
CMS_ADMIN_PASSWORD='your-strong-password' pnpm db:seed
```

3. Run Astro with Cloudflare bindings:

```bash
pnpm dev:cf
```

## Production (Pages)

1. Bind D1 (`DB`) and R2 (`MEDIA`) to the Pages project (same names as `wrangler.jsonc`).
2. Set secrets / vars:
   - `CMS_ADMIN_USERNAME` (optional, default `admin`)
   - `CMS_ADMIN_PASSWORD` (seed only; rotate after first seed)
   - `CMS_SESSION_SECRET` (optional reserved)
3. Migrate & seed remote:

```bash
pnpm db:migrate:remote
CMS_ADMIN_PASSWORD='...' pnpm db:seed:remote
```

4. Build with:

```bash
pnpm build:cf
```

(`CF_WORKERS=1` / `build:cf` turns on platform proxy for production-shaped local runs; hybrid `output: "static"` keeps most pages prerendered while API routes stay SSR.)

## API

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/auth/login/` | public |
| POST | `/api/auth/logout/` | public |
| GET | `/api/auth/me/` | public |
| GET | `/api/folio/?section=knowledge` | public |
| PUT | `/api/folio/?section=knowledge` | session |
| GET/POST | `/api/media/` | session |
| GET | `/api/media/file/?id=…` | public |

Sections: `knowledge`, `projects`, `works`, `life`.

## Scripts

| Script | Purpose |
|--------|---------|
| `pnpm dev` | Astro dev; CMS uses `.data/` JSON if D1 unbound |
| `pnpm dev:cf` | Dev with Wrangler platform proxy (D1/R2) |
| `pnpm build:cf` | Production build with `CF_WORKERS=1` |
| `pnpm db:migrate` | Apply D1 migrations (local) |
| `pnpm db:migrate:remote` | Apply D1 migrations (remote) |
| `pnpm db:seed` | Seed admin + folio trees (local D1) |
| `pnpm db:seed:remote` | Seed remote D1 |

Default seed login: **admin** / **changeme** (override with `CMS_ADMIN_PASSWORD`).

## Notes

- Blog `posts` table exists for a later editor; not wired in the UI yet.
- Prefer Cloudflare Pages for CMS deploys (`pnpm build:cf` / `pnpm pages:build` + D1/R2 bindings).
- **Cloudflare Pages build command must be** `pnpm pages:build` (or `pnpm build:cf`), **not** plain `pnpm build`.
  Plain `pnpm build` skips the Cloudflare adapter → `/api/folio` 404 and the live site keeps looking “stuck”.
- After each deploy, open `/folio-deploy.txt` — if missing or stale, Pages did not publish the latest commit.
- Do not commit `.data/`, `.wrangler/`, or secrets.
- On Windows PowerShell, set seed password with:  
  `$env:CMS_ADMIN_PASSWORD='secret'; pnpm exec tsx scripts/seed-folio-cms.ts --remote`

