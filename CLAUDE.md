# PrepWise-Info — Cloudflare Pages Site

Repo: tmgavron/PrepWise-Info
Purpose: PrepWise public website — legal documents + marketing landing page
Hosting: Cloudflare Pages (static site for root, Next.js for landing/)

## VECTOR Agent Access

VECTOR (Marketing agent) has read/write access to this repository for content editing.
- Focus areas: `PrepWise-Info`, `Landing Page`
- Working directory: `~/repos/PrepWise-Info/`
- Commit format: `[VECTOR] <description>`
- Auto-deploys on push to main

### Editable by VECTOR
- `landing/src/components/*.tsx` — marketing copy, headlines, CTAs, features
- `landing/src/app/page.tsx` — page structure
- `landing/src/app/globals.css` — styles
- `landing/src/components/constants.ts` — shared content
- `landing/public/` — marketing assets
- `index.html` — info page content
- `robots.txt`, `sitemap.xml` — SEO

### NOT editable by VECTOR
- `wrangler.toml`, `_headers` — deployment/security config
- `landing/next.config.ts`, `landing/package.json` — build config

---

## Site Structure

```
PrepWise-Info/
├── landing/                ← Next.js landing page application (deployed via wrangler.toml)
│   ├── src/app/
│   │   ├── layout.tsx      ← Root layout (metadata, fonts, dark theme)
│   │   ├── page.tsx        ← Home page (hero, features, how-it-works, stats, email capture)
│   │   ├── privacy/page.tsx ← Privacy Policy (integrated route)
│   │   ├── terms/page.tsx  ← Terms of Use / EULA (integrated route)
│   │   └── globals.css     ← Tailwind theme + brand colors
│   ├── src/components/     ← Navbar, Hero, Features, HowItWorks, Stats, EmailCapture, Footer
│   ├── src/lib/constants.ts ← Nav links, legal links, features, steps, stats
│   └── public/
│       ├── logo.svg        ← PrepWise production logo
│       └── screenshots/    ← Hero section screenshots
├── index.html              ← Legacy legal docs landing (legal.prepwise.app)
├── privacy.html            ← Legacy Privacy Policy (standalone HTML)
├── terms.html              ← Legacy Terms of Use (standalone HTML)
├── 404.html                ← Custom 404 error page
├── logo.svg                ← PrepWise logo (source asset)
├── _headers                ← Cloudflare Pages security headers
├── robots.txt              ← Search engine directives
├── sitemap.xml             ← Sitemap for SEO
├── wrangler.toml           ← Cloudflare Pages config (serves landing/out/)
└── CLAUDE.md               ← This file
```

## URL Structure

Landing app (Next.js static export via wrangler.toml → landing/out/):
- `/` → Home (landing page)
- `/privacy` → Privacy Policy (integrated into landing app)
- `/terms` → Terms of Use (integrated into landing app)

Legacy static HTML (legal.prepwise.app, kept for backward compatibility):
- `index.html` → Legal docs index
- `privacy.html` → Privacy Policy
- `terms.html` → Terms of Use

## Design

- Font: system font stack (-apple-system, BlinkMacSystemFont, etc.)
- Brand color: #1b2d4f (dark navy header)
- Link color: #2563eb
- Background: #f9f9f9
- Max content width: 760px (legal docs), 480px (index)

## Deployment

### Cloudflare Pages Setup (one-time)

1. Log in to Cloudflare dashboard
2. Go to Workers & Pages → Create application → Pages
3. Connect to GitHub → select tmgavron/PrepWise-Info
4. Build settings:
   - Build command: (leave empty — pure static)
   - Build output directory: `/`
   - Root directory: `/`
5. Deploy

### Custom Domain

After initial deployment:
1. In Cloudflare Pages project → Custom domains
2. Add `legal.prepwise.app`
3. DNS record will be auto-created if prepwise.app is on Cloudflare

### Local Development

```bash
cd ~/repos/PrepWise-Info
npx wrangler pages dev .
# Serves at http://localhost:8788
```

### Manual Deploy (CLI)

```bash
cd ~/repos/PrepWise-Info
npx wrangler pages deploy . --project-name=prepwise-info
```

Requires `wrangler login` first (browser-based OAuth).

## Security Headers

Configured in `_headers`:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()
- HTML: 1 hour cache
- Logo: 7 day immutable cache

## Updating Legal Documents

1. Edit the HTML file directly (privacy.html or terms.html)
2. Update the "Last Updated" date in the `.meta` paragraph
3. Update `sitemap.xml` lastmod dates
4. Commit and push — Cloudflare Pages auto-deploys on push to main

## Next Phase — Enhancements

Future work:
- Add support/FAQ pages as integrated routes
- Add structured data (JSON-LD) for legal pages
- Replace App Store badge placeholder with official Apple badge
- Integrate real app screenshots into Hero phone mockups
- Finalize social media URLs when accounts are created
