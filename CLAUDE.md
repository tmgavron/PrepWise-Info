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
- `landing/content/faq.ts` — FAQ questions and answers (keep `source` +
  `provenance` on every question; answers stay PLAIN TEXT, see "SEO content")
- `landing/content/blog/*.ts` — blog posts, one file per post, plus the one-line
  registration in `landing/content/blog/index.ts`
- `landing/src/app/globals.css` — styles
- `landing/src/components/constants.ts` — shared content
- `landing/public/` — marketing assets
- `index.html` — info page content

### NOT editable by VECTOR
- `wrangler.toml`, `_headers`, `worker/index.js` — deployment/routing/security config
- `landing/next.config.ts`, `landing/package.json` — build config
- `landing/src/app/robots.ts`, `landing/src/app/sitemap.ts` — GENERATED SEO files
  (see below). Adding a page means adding it to `SITE_ROUTES` in
  `landing/src/lib/constants.ts`, not hand-editing XML.
- `landing/src/lib/constants.ts` → `SITE_URL` / `SITE_ROUTES` — canonical host

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
│   │   ├── robots.ts       ← GENERATES out/robots.txt at build time
│   │   └── sitemap.ts      ← GENERATES out/sitemap.xml at build time
│   ├── src/lib/constants.ts ← SITE_URL, SITE_ROUTES, nav/legal links, features
│   ├── scripts/make-brand-assets.py ← regenerates og-image, apple-touch-icon, favicon.ico, icon-192
│   └── public/
│       ├── logo.svg        ← PrepWise production logo
│       ├── og-image.png    ← 1200x630 social card (generated, committed)
│       ├── apple-touch-icon.png ← 180x180 iOS icon (generated, committed)
│       ├── favicon.ico     ← 6-entry ICO, 16→192 (generated, committed)
│       ├── icon-192.png    ← 192x192 PNG favicon (generated, committed)
│       ├── .well-known/    ← apple-app-site-association (Universal Links)
│       └── screenshots/    ← Hero section screenshots
├── index.html              ← Legacy legal docs landing (NOT deployed - see below)
├── privacy.html            ← Legacy Privacy Policy (standalone HTML)
├── terms.html              ← Legacy Terms of Use (standalone HTML)
├── 404.html                ← Custom 404 error page
├── logo.svg                ← PrepWise logo (source asset)
├── worker/
│   └── index.js            ← Worker for /r/{shareId} recipe-share OG preview pages
├── _headers                ← Cloudflare Pages security headers
├── wrangler.toml           ← Cloudflare Workers config (worker + landing/out assets)
└── CLAUDE.md               ← This file
```

## URL Structure

Landing app (Next.js static export via wrangler.toml → landing/out/):
- `/` → Home (landing page)
- `/faq` → FAQ (the site's ONE `FAQPage` schema — see "The FAQ and the blog")
- `/blog` → Blog index
- `/blog/<slug>` → Blog post, generated from `landing/content/blog/`
- `/<use-case>` → Use-case landing page, generated from `landing/content/pages/`
  (`/meal-prep-app`, `/pantry-tracker`, `/macro-meal-planner`,
  `/grocery-list-app`) — see "Use-case landing pages"
- `/privacy` → Privacy Policy (integrated into landing app)
- `/terms` → Terms of Use (integrated into landing app)

Recipe-share preview worker (`worker/index.js`, runs only for `/r/*` via
`run_worker_first`): renders an Open Graph preview page for PrepWise
recipe-share Universal Links (`/r/{shareId}`) so iMessage/Slack show the
recipe title, author, and image. Looks the share up through the public
`get-shared-recipe` Supabase edge function (PROD first, then QA so TestFlight
QA shares preview during testing). Revoked/unknown ids render a 404
"recipe unavailable" page. The `/.well-known/apple-app-site-association`
file stays a static asset - tapping a link on a phone with PrepWise
installed still opens the app directly and never hits this page.

Legacy static HTML at the repo ROOT — **NOT DEPLOYED**. `wrangler.toml` serves
assets from `./landing/out` only, so nothing at the repo root is reachable on the
live site. These were written for a `legal.prepwise.app` host that does not
resolve (verified 2026-07-26: `dig legal.prepwise.app` returns nothing).
- `index.html` → Legal docs index
- `privacy.html` → Privacy Policy
- `terms.html` → Terms of Use

The live legal pages are the Next.js routes `/privacy` and `/terms`. The root
copies are kept only as source history; their canonicals now point at the real
`www.prepwise-app.com` routes so they cannot leak the wrong domain if anything
ever does deploy them.

---

## Domain and canonical host

**Canonical host: `https://www.prepwise-app.com`.** One source of truth:
`SITE_URL` in `landing/src/lib/constants.ts`. `metadataBase`, every per-page
`alternates.canonical`, `robots.ts`, `sitemap.ts` and the JSON-LD all derive
from it.

**`prepwise.app` is NOT our domain.** It belongs to an unrelated exam-prep
company (verified: their AASA names Apple team `NLZRSDAJSX`; ours is
`2DDFX89NYB`). Until 2026-07-26 the deployed `robots.txt` pointed crawlers at
`https://prepwise.app/sitemap.xml` and the sitemap listed `https://prepwise.app/`
i.e. we were handing our crawl budget to someone else's site. Never write that
hostname into a canonical, sitemap, link, or config.

### robots.txt and sitemap.xml are GENERATED

`landing/src/app/robots.ts` and `landing/src/app/sitemap.ts` emit
`out/robots.txt` and `out/sitemap.xml` at build time. The four hand-kept files
(`robots.txt`, `sitemap.xml` at the repo root and under `landing/public/`) were
DELETED. They had drifted onto two different wrong hostnames and the root pair
was never deployed at all.

To add a page to the sitemap, add it to `SITE_ROUTES` in
`landing/src/lib/constants.ts`. `lastModified` there is a real CONTENT date, not
the build date; bump it when the page's content actually changes.

Both files carry `export const dynamic = "force-static"`. They are GET Route
Handlers, and under `output: "export"` the build FAILS without it.

### Apex → www redirect, and the two exemptions

`prepwise-app.com` (apex) 301s to `www.prepwise-app.com`, preserving path and
query, from `worker/index.js`. **Two paths are exempt and must stay exempt:**

| Path | Why it must NOT redirect |
|---|---|
| `/r/*` | Recipe-share Universal Links were minted on the APEX. The iOS app registers `associatedDomains: ['applinks:prepwise-app.com']` (apex only). |
| `/.well-known/*` | Apple requires the AASA to be served from the exact host in the link with **no redirect**. A redirect here silently breaks Universal Links for every existing share. |

`/.well-known/*` is exempted at the ROUTING layer (`!/.well-known/*` in
`run_worker_first`), so it is served straight from static assets and a worker bug
cannot take Universal Links down. `/r/*` is handled inside the worker, before the
redirect branch.

The redirect preserves the query string because the ad attribution chain depends
on it (`utm_content` → App Store `ct` token; see `landing/src/lib/analytics.ts`).

### Every `.html` asset 307s to its extensionless path

Cloudflare's asset binding serves `/privacy.html` as a **307 to `/privacy`**.
Verified live 2026-07-26 on `/privacy.html`, `/terms.html`, `/faq.html`,
`/blog.html` and `/404.html`. Nothing configures this; it is the default
`html_handling` mode, and it is what makes the clean URLs work.

It also means **a file that must be fetched at an exact `.html` URL cannot be
shipped as a static asset**. The case that bites is Google Search Console's
HTML-file verification: GSC does not follow redirects, so the token deploys
green, sits visibly in the repo, and the property never verifies. `html_handling
= "none"` is not the fix either, since it would 404 every clean URL on the site.

Such a file is served from `worker/index.js` instead, which answers before both
the apex redirect and the assets. Today that is
`GOOGLE_VERIFICATION_FILES` (empty until Trent creates the property). It is
placed ahead of the apex redirect on purpose, so the file resolves on the apex
AND on www with no redirect and satisfies whichever property type gets created.

Two guards, because the failure is invisible from the deploy output:
`verify-seo.mjs` fails the build on a `google*.html` in the export
(`gsc-verification-asset`), and `verify-live-routing.sh` asserts any configured
token answers 200, unredirected, on both hosts with the exact body. With no
token configured it prints `skip`, not `ok`.

Setup walkthrough: [`landing/seo/search-console-setup.md`](landing/seo/search-console-setup.md).

### The wrangler version pin is load-bearing

`.github/workflows/deploy.yml` pins `wranglerVersion: "4.114.0"`. **Do not remove
it and do not go below 4.x.**

`cloudflare/wrangler-action@v3` defaults to **wrangler 3.90.0**, which does not
know the `assets.run_worker_first` field. It does not fail on it. It logs

```
▲ [WARNING] Processing wrangler.toml configuration:
    - Unexpected fields found in assets field: "run_worker_first"
```

…drops the field, and exits 0. The deploy is green and the routing config is
simply absent, so the asset worker answers first and our worker only ever sees
paths that are not static assets.

Observed 2026-07-26: with the field dropped, `prepwise-app.com/zz-nonexistent`
301'd correctly while `prepwise-app.com/privacy` and `/og-image.png` returned
200 — the redirect appeared "half working". The pre-existing `["/r/*"]` rule had
been inert since the day it was written for the same reason; `/r/*` worked only
because a share id is not a static asset, so the default fallback ran the worker
anyway.

### Post-deploy verification

`scripts/verify-live-routing.sh` asserts the live invariants (apex redirects
including for an existing ASSET, both exemptions served directly, AASA identical
on both hosts and naming our app id, generated SEO files free of `prepwise.app`).
It runs as the last step of the deploy workflow and is safe to run by hand:

```bash
bash scripts/verify-live-routing.sh
```

It exists because `wrangler deploy` **cannot fail on a config field it does not
recognise**. A green deploy is not evidence that routing is in effect; only the
live site is.

## Design

- Font: system font stack (-apple-system, BlinkMacSystemFont, etc.)
- Brand color: #1b2d4f (dark navy header)
- Link color: #2563eb
- Background: #f9f9f9
- Max content width: 760px (legal docs), 480px (index)

## Copy Style

- Never use em dashes (—) in user-facing copy — marketing text, headings, legal
  docs, meta descriptions. Use plain hyphens (-) or restructure the sentence.

---

## SEO content — read before writing ANY page

Three things exist so that no PrepWise page can ship below the bar, regardless
of who or what wrote it.

### 1. `landing/references/` — the voice and fact layer

Read these before writing any blog post, landing page, meta description, or
App Store copy. They are what stop the output reading like every other
AI-written page in the results.

| File | What it is |
|---|---|
| `references/voice.md` | How PrepWise writes. Banned words, banned claims, the AI-tells to delete on sight. |
| `references/stats.md` | **The only numbers you may publish.** Every row is VERIFIED with a source, or it is `TODO(trent: confirm)` and unusable. |
| `references/opinions.md` | Founder takes. One per page, maximum, always backed by a number or a mechanism. |
| `references/stories.md` | Real anecdotes. **Stubs today.** Never invent one. |
| `references/author.md` | Trent's byline, bio, and `Person` schema. Never invent a credential. |
| `references/used-keywords.md` | The register of claimed primary keywords. One primary, one page, ever. |

**The hard rule: a number that is not in `stats.md` does not go on the page.**
Not rounded, not "approximately", not "studies show". A `TODO(trent: confirm)`
value is a gap to write around, not a suggestion.

The banned-claim list in `voice.md` is the same list enforced in code for
PrepWise ads and scripts (`~/command-system/content-lab/lib/brand-guardrail.js`),
so search, social, and paid all say the same thing.

### 1b. `landing/seo/search-console-setup.md` — the measurement side

How the site gets verified in Google Search Console and Bing, what is already
wired, and why the HTML-file verification method needs the worker rather than
`landing/public/`. Read it before touching anything to do with site
verification.

**Verified 2026-07-27** as a **Domain** property, by DNS TXT on the apex. That
record is the ownership proof and it exists **only in Cloudflare DNS** — there
is no copy in this repo, Google re-checks it periodically, and deleting it
un-verifies the property and stops the search-data feed silently. The token is
written down in that doc so it can be restored, and
`scripts/verify-live-routing.sh` asserts on every deploy both that it is still
present and that the SPF record sharing that TXT set survived.

### 2. `landing/seo/on-page-checklist.md` — the checklist

Adapted for an app business from the `jonocatliff/SEO_brief` reference: the
local-business items (NAP, phone, service area, `LocalBusiness` schema) are
replaced by `SoftwareApplication` schema and App Store CTA rules. Everything
structural is kept.

### 3. `landing/scripts/verify-seo.mjs` — the build gate

The mechanically checkable subset of that checklist, run against the static
export. **It fails the build**, which means it blocks the deploy.

```bash
cd landing
npm run build          # next build && verify-seo  (the gate is chained in here)
npm run verify:seo     # check the existing out/ without rebuilding
npm run test:seo       # the checker's own fixtures (must-pass and must-fail)
node scripts/verify-seo.mjs --json
```

Exit codes: `0` clean, `1` violations, **`2` could not check at all** (no
`out/`, no HTML, unreadable `SITE_URL`). 2 is deliberately not 0, for the same
reason `verify-live-routing.sh` exists: a green step that checked nothing is
worse than a red one.

What it asserts per page: title 50-60 chars and meta description 150-160 (both
measured DECODED, so `&amp;` counts as one character), exactly one `<h1>`, a
single canonical on `www.prepwise-app.com`, the full Open Graph and Twitter card
set, `lang`/`viewport`/`charset`, JSON-LD that parses with the right schema
types for the page type, an `alt` attribute on every `<img>`, an App Store link
on marketing pages, no `prepwise.app` reference, and no two pages sharing a
title or description.

`404.html` and `_not-found.html` are exempt: they are not indexable and have no
keyword to rank for.

**The gate is chained inside the `build` script, not added as a separate CI
step.** A separate step can be deleted by a future edit to `deploy.yml` and
nothing would notice, because a page with a 39-character title deploys
perfectly happily.

**Adding a page means:** claim its primary in `used-keywords.md` first, write it
against the checklist, add it to `SITE_ROUTES` in `landing/src/lib/constants.ts`
so the generated sitemap picks it up, and let the gate check it.

### The favicon Google shows beside the result (2026-08-11)

**There must be exactly ONE place that declares icons: `icons` in
`src/app/layout.tsx`.** Do not add `src/app/favicon.*` or `src/app/icon.*`. The
App Router treats those as metadata files and auto-injects a `<link rel="icon">`
**ahead of** everything in that block, silently taking over the first icon link
on the page, which is the one Google reads.

That is exactly what shipped until 2026-08-11: `src/app/favicon.ico` held a
16x16 + 32x32 ICO and Next announced it as `sizes="256x256"`. The 534x534 file
sitting in `public/favicon.ico` was never served, and was a PNG with an `.ico`
extension anyway. Browser tabs looked right (a tab picks the best of the four
links); Google showed the default globe.

Two rules, both from Search Central's "Define a favicon":

1. **Every icon 48px or larger must be a multiple of 48.** `FAVICON_SIZES` in
   `make-brand-assets.py` is `[16, 32, 48, 96, 144, 192]` for that reason, and
   the largest entry is 192 rather than the conventional 256 so that whichever
   entry Google reads is compliant. A `/icon-192.png` ships alongside it.
2. **The favicon URL must be stable.** `/favicon.ico` and `/icon-192.png` are
   permanent. Re-point them at new art if the brand changes; do not rename them.

The icons are generated, not hand-made: `python3 landing/scripts/make-brand-assets.py`
rebuilds all four from `public/brand/prepwise-icon.png` and is byte-reproducible.

A favicon change takes days to weeks to appear in results, and only after Google
re-crawls the home page. Request indexing for `/` in Search Console after
deploying one; there is no other way to hurry it, and nothing in CI can verify
it because the choice happens on Google's side.

### The FAQ and the blog (S3a, 2026-07-26)

**Content is flat TypeScript in `landing/content/`, not a CMS.** `content/faq.ts`
is the FAQ; `content/blog/<slug>.ts` is one post per file, registered in
`content/blog/index.ts`. A post is data, the template renders it, `next build`
writes the HTML. Full workflow: `landing/seo/on-page-checklist.md` →
"Publishing a blog post".

Four rules that are load-bearing rather than stylistic:

1. **ONE `FAQPage` on the site, and `/faq` owns it.** The home page and every
   blog post render an FAQ section with NO schema and a link to `/faq`. Two
   surfaces publishing the same answers as schema is how Google picks one and
   discards the other page's work. `verify-seo.mjs` enforces BOTH halves: more
   than one page declaring `FAQPage` is `faqpage-duplicate`, and an FAQ section
   with neither the schema nor a `/faq` link is `schema-faq`.
2. **An FAQ answer is PLAIN TEXT.** The same string is rendered on the page and
   serialized into the JSON-LD, so schema text and visible text cannot drift.
   Google treats schema-only FAQ content as a violation. Keep markup out of
   `answer` fields; blog body copy gets a deliberately tiny inline vocabulary
   (`[label](/href)` and `**bold**`) and nothing else.
3. **Blog posts are enumerated by `sitemap.ts` from the content directory, NOT
   listed in `SITE_ROUTES`.** `/faq` and `/blog` are in `SITE_ROUTES`; the posts
   are not. A post's `updatedAt` is already a real content date shown on the
   page, so the sitemap and the byline cannot disagree.
4. **`content/blog/index.ts` is hand-maintained and therefore DRIFT-CHECKED.**
   `verify-seo.mjs` fails the build when a file in `content/blog/` is not
   imported there (`blog-post-unregistered` — otherwise the post compiles, the
   deploy is green, and the page simply does not exist), when a registered post
   produced no HTML (`blog-post-not-built`), and when a slug would push the App
   Store campaign token past 40 characters (`blog-ct-too-long` — `sanitizeCt()`
   truncates SILENTLY, so an over-long slug yields installs that no longer join
   back to the post that earned them).

**Page-level App Store attribution.** `useAppStore(pageCt)` takes a page-level
`ct` token ("faq", "blog-<slug>"), baked into the STATIC HTML rather than
applied at hydration. An incoming ad's `utm_content` still overrides it, because
paid attribution is the one with money riding on it. Convention and the golden
rule: `~/command-system/marketing/UTM-PLAYBOOK.md`.

**The author card and `Person` schema use ONLY the confirmed-facts section of
`references/author.md`.** Its draft bios are still `TODO(trent: confirm)`, and
an author bio is the worst place on a site to publish an unapproved sentence.
`Person` omits `url`, `image`, and `sameAs` because `/about`, a headshot, and
the profile links do not exist; the `@id` (`/about#trent`) is fixed by
`author.md` and must stay stable forever.

**FAQ provenance.** Each question in `content/faq.ts` carries `source` and
`provenance`. When the page was written (2026-07-26) the ops `support_tickets`
table had ZERO rows and the App Store had ONE review, so most questions are
labelled `paa` and are INFERRED from category search patterns rather than
scraped from a PAA box. That label is the honest one; re-mine both sources
before the S4 batch and upgrade the labels that earn it.

### Use-case landing pages (S3b, 2026-07-26)

Keyword-targeted product pages, separate from the home page: one page per
keyword cluster, one job-to-be-done each. The app-business equivalent of the SEO
brief's city/service pages.

Same shape as the blog. Content is a flat TS file in `landing/content/pages/`,
registered in `content/pages/index.ts`, rendered by the ROOT dynamic segment
`src/app/[useCase]/page.tsx` with `dynamicParams = false`. Types and the
campaign-token rule live in `src/lib/usecase.ts`. Live today:
`/meal-prep-app`, `/pantry-tracker`, `/macro-meal-planner`, `/grocery-list-app`.

Five things that are load-bearing rather than stylistic:

1. **Each page declares its own App Store campaign token** (`ct: "lp_pantry"`),
   used when the visit carries NO ad `utm_content`. That is what makes an
   ORGANIC install attributable to the page that earned it instead of to one
   sitewide token. **An incoming ad's `utm_content` still overrides it** — paid
   attribution is the one with money riding on it, and that order must never be
   inverted. Convention: `~/command-system/marketing/UTM-PLAYBOOK.md` §7.
2. **The token is checked TWICE, on purpose.** `src/lib/usecase.ts` asserts the
   SHAPE at module load (lowercase `lp_[a-z0-9_]`, <= 40 chars, unique), which
   under `output: "export"` fails the build. `verify-seo.mjs` then asserts the
   token actually reached the rendered App Store href
   (`usecase-ct-not-rendered`). Neither check can do the other's job: a page
   wired without its `pageCt` still renders a perfectly working link, and the
   only symptom is an App Store row crediting the wrong page months later.
3. **`Navbar` takes a `pageCt` prop.** It renders the FIRST App Store link on
   the page; without the token that button's installs report under the sitewide
   default. Any new page type must pass it.
4. **The registry is hand-maintained and therefore DRIFT-CHECKED**, exactly like
   the blog's: `usecase-unregistered` (file nobody imported),
   `usecase-not-built` (registered, produced no HTML), `usecase-ct-duplicate`
   (two pages sharing a token merges their installs into one App Store row).
5. **A use-case page is a top-level HTML file**, so `classifyPage()` cannot
   identify one by path. It takes the slug list read from `content/pages/` as a
   second argument; without it the page grades as an ordinary `page` and skips
   the extra requirements silently.

They also follow rules that already existed and are worth restating because they
are easy to break here: the pages are **enumerated by `sitemap.ts` from the
content directory, NOT listed in `SITE_ROUTES`** (each carries a real
`updatedAt`, so a second list is a second place to forget); the footer's
"Solutions" block is DERIVED from the same registry rather than hand-listed; and
they render an FAQ section with **no `FAQPage` schema**, linking to `/faq`
instead, because `/faq` owns the site's single `FAQPage` node.

**Page-level `openGraph` REPLACES the root layout's, it does not merge.** Any
page that sets its own must restate `images` (import `OG_IMAGE` from
`src/lib/constants.ts`) and `twitter`. Not doing so is why `/privacy` and
`/terms` shipped with no `og:image` at all until 2026-07-26.

---

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

Both `prepwise-app.com` and `www.prepwise-app.com` are attached to the Worker.
Keep BOTH attached: the apex must keep answering directly so the worker can 301
it and so `/r/*` + `/.well-known/*` resolve there. See "Domain and canonical
host" above.

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

The LIVE legal pages are `landing/src/app/privacy/page.tsx` and
`landing/src/app/terms/page.tsx`. The root `privacy.html` / `terms.html` are not
deployed (see "Site Structure") and editing them changes nothing on the site.

1. Edit the route file under `landing/src/app/<privacy|terms>/page.tsx`
2. Update the `lastUpdated` prop passed to `LegalLayout`
3. Update the matching `lastModified` in `SITE_ROUTES`
   (`landing/src/lib/constants.ts`) so the generated sitemap stays honest
4. Commit and push. GitHub Actions builds `landing/` and deploys via wrangler.

## Next Phase — Enhancements

Future work:
- Add support/FAQ pages as integrated routes
- Add structured data (JSON-LD) for legal pages
- Replace App Store badge placeholder with official Apple badge
- Integrate real app screenshots into Hero phone mockups
- Finalize social media URLs when accounts are created
