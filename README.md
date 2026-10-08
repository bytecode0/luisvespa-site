# luisvespa.com

Personal engineering site — Next.js (App Router), TypeScript, Tailwind CSS. Fully static.

## Edit

| What | Where |
| --- | --- |
| Email, LinkedIn, GitHub, site URL, CV path | `src/config/site.ts` (links still set to `REPLACE-ME` are hidden) |
| CV PDF | replace `public/cv/luis-vespa-cv.pdf` |
| All facts: roles, skills, security, pipeline, case studies, notes, Ask Luis answers | `src/content/profile.ts` |

Case-study sections set to `null` show an "Add real … here" placeholder until filled in.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build    # production build
```

Deploys as-is to Vercel or any static/Node host.

## Environments

| Environment | Git branch | Domain | Variables |
| --- | --- | --- | --- |
| Pre-production | `preprod` | `pre.luisvespa.com` | none on Vercel (automatic from `VERCEL_ENV` / `VERCEL_GIT_COMMIT_REF`) |
| Production | `main` | `www.luisvespa.com` | none (defaults) |

Outside Vercel, `NEXT_PUBLIC_SITE_ENV=preproduction` and `NEXT_PUBLIC_SITE_URL` do the same (see `.env.example`).

Pre-production is never indexed (robots.txt `Disallow: /`, `noindex` meta tag and `X-Robots-Tag` header)
and shows a small `PRE-PRODUCTION` badge. See `.env.example`.

## Deploy (Vercel)

1. Push this repo to a personal GitHub repository.
2. Vercel → Add New → Project → import the repository (framework: Next.js, defaults are fine).
3. No environment variables needed: every non-production deploy is automatically pre-production.
4. Settings → Domains: add `pre.luisvespa.com` and assign it to the Git branch `preprod`.
   At your domain registrar, create `CNAME pre → cname.vercel-dns.com`.
5. Every push to `preprod` deploys pre-production. Production = merge `preprod` into `main`
   and add `luisvespa.com` / `www.luisvespa.com` to the project.
