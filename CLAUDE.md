# PrepWise-Legal — Cloudflare Pages Site

Repo: tmgavron/PrepWise-Legal
Purpose: Legal documents website for PrepWise (Privacy Policy, Terms of Use)
Hosting: Cloudflare Pages (static site, no build step)

---

## Site Structure

```
PrepWise-Legal/
├── index.html       ← Landing page with links to legal docs
├── privacy.html     ← Privacy Policy (effective 2026-03-09)
├── terms.html       ← Terms of Use / EULA (effective 2026-03-09)
├── 404.html         ← Custom 404 error page
├── logo.svg         ← PrepWise logo
├── _headers         ← Cloudflare Pages security headers
├── robots.txt       ← Search engine directives
├── sitemap.xml      ← Sitemap for SEO
├── wrangler.toml    ← Cloudflare Pages project config
└── CLAUDE.md        ← This file
```

## URL Structure

Cloudflare Pages serves clean URLs automatically:
- `/` → index.html
- `/privacy` → privacy.html
- `/terms` → terms.html

Target domain: `legal.prepwise.app`

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
3. Connect to GitHub → select tmgavron/PrepWise-Legal
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
cd ~/repos/PrepWise-Legal
npx wrangler pages dev .
# Serves at http://localhost:8788
```

### Manual Deploy (CLI)

```bash
cd ~/repos/PrepWise-Legal
npx wrangler pages deploy . --project-name=prepwise-legal
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

## Next Phase — Full Website Conversion

Future work to expand beyond legal docs:
- Add marketing landing page (prepwise.app → this site or separate)
- Add support/FAQ pages
- Consider shared CSS file if more pages are added
- Add favicon and Apple touch icons
- Add structured data (JSON-LD) for legal pages
