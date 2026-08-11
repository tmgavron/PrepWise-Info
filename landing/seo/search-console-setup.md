# Google Search Console setup for www.prepwise-app.com

Search Console is the free data source the whole SEO feedback loop runs on:
impressions, queries, position and CTR per page. Nothing else gives us the
actual search terms people used. It only reports data from the day the property
was verified onward and it does not backfill, so the value of doing this is
mostly a function of doing it early.

---

## STATUS: done — verified 2026-07-27

| | |
|---|---|
| Property type | **Domain** (`prepwise-app.com` — covers apex, www, and future subdomains) |
| Method | DNS TXT, added by **Google's automated Cloudflare integration** (see below) |
| Token | `google-site-verification=o4poDJfZ9S_wLd6HiMNLMk621cjBZzDHFheLNdYOL1Q` |
| Sitemap | `https://www.prepwise-app.com/sitemap.xml` submitted, reported Success |

Recorded here because the token exists **only in Cloudflare DNS** — there is no
copy in this repo. If the record is ever lost, this is what to put back.

Confirmed independently on 2026-07-27, not just taken from the console screen:
the TXT record resolves from both `8.8.8.8` and `1.1.1.1`, the SPF and MX
records survived alongside it, and all 10 sitemap URLs answer 200 with zero
redirects and a self-referencing canonical.

**Do not delete that TXT record.** Google re-checks it periodically; removing it
un-verifies the property and stops the search-data feed with no warning
anywhere. `scripts/verify-live-routing.sh` now asserts it on every deploy, which
is the only thing watching it.

The rest of this document is the walkthrough that produced that state. Keep it:
it is still the procedure for Bing, for re-verifying under a different Google
account, and for any future property.

---

## Do this one (Domain property, DNS)

**Use the Domain property.** It covers `prepwise-app.com`, `www.prepwise-app.com`
and every future subdomain in a single property, and it is the method that
survives the site's own routing (see "Why not the HTML file" below). Our DNS is
already at Cloudflare, so it is a two minute job.

### Step 1: create the property

1. Go to **search.google.com/search-console** and sign in with the Google
   account that should own PrepWise's search data.
2. If this is the first property, the "Welcome to Google Search Console" screen
   appears. Otherwise click the **property dropdown** at the top left, then
   **+ Add property**.
3. Pick the **Domain** card (the left one).
4. Type `prepwise-app.com` (no `https://`, no `www.`). Click **Continue**.
5. Google shows a screen titled "Verify domain ownership via DNS record". It
   contains one TXT value that looks like
   `google-site-verification=aBcDeF...`. Click **Copy**. Leave this tab open.

### Step 2: add the TXT record

**Try the automated route first — it is what was actually used on 2026-07-27.**
Because our DNS is at Cloudflare, one of Google's supported providers, the
verification screen offers to add the record for you instead of showing you a
value to copy. Click that button, sign in to Cloudflare if asked, and approve
the permission prompt ("authorize adding the TXT record"). Google writes the
record and verifies in one step; there is nothing to paste and no second tab.

It is also the safer route: it **adds** a record to the apex TXT set rather than
editing anything, so it cannot clobber SPF the way hand-editing can. Verified
afterwards — SPF, MX and DMARC were all intact.

Use the manual steps below only if that button is not offered.

1. Go to **dash.cloudflare.com** and sign in.
2. On the account home, click the **prepwise-app.com** zone.
3. In the left sidebar click **DNS**, then **Records**.
4. Click **+ Add record**.
5. Fill in:
   - **Type:** `TXT`
   - **Name:** `@` (Cloudflare renders this as `prepwise-app.com`)
   - **Content:** paste the `google-site-verification=...` value from step 1.5
   - **TTL:** `Auto`
6. Click **Save**.

There is already a TXT record on the apex (the SPF record,
`v=spf1 include:_spf.mx.cloudflare.net ~all`). That is fine and expected. A
hostname can carry many TXT records. **Do not edit or replace the SPF record**,
add a second one. Overwriting it would break email deliverability for the domain.

### Step 3: verify

1. Back in the Search Console tab, click **Verify**.
2. Cloudflare usually publishes within seconds. If Google says the record was
   not found, wait a minute and click **Verify** again.
3. On success, click **Go to property**.

### Step 4: submit the sitemap

1. In the left sidebar of Search Console, under Indexing, click **Sitemaps**.
2. In "Add a new sitemap", the domain prefix is fixed. Enter the full URL
   `https://www.prepwise-app.com/sitemap.xml` (a Domain property spans both
   hosts, so give it the canonical www URL rather than a bare path).
3. Click **Submit**.
4. The status column should read **Success** within a few minutes, with a
   discovered-pages count. "Couldn't fetch" usually just means Google has not
   read it yet; check again in an hour before treating it as a problem.

The sitemap is generated at build time from `SITE_ROUTES` plus the blog and
use-case content directories, so it stays current on its own. It does not need
resubmitting when a page is added.

### Step 5: tell the agent

Resume the task from the dashboard. Paste into the resume note which property
type you created (Domain or URL-prefix) and whether the sitemap shows Success.
A screenshot is fine. The API read-back that would let an agent confirm this
itself needs OAuth, which belongs to the later feedback-loop work, not here.

What the agent can confirm without OAuth, and did on 2026-07-27: that the TXT
record resolves from public resolvers, that SPF/MX/DMARC survived, and that
every URL the sitemap advertises answers 200 with no redirect and a
self-referencing canonical. That last one matters because a sitemap listing a
redirecting or non-canonical URL is not an error at submit time — it surfaces
days later as "Page with redirect" or "Alternate page with proper canonical
tag" under Indexing, with nothing pointing at the sitemap as the cause.

---

## Why not the HTML file method

Google's other option is to download a `google<token>.html` file and put it at
the site root. **On this site the obvious way of doing that fails silently, so
do not use it unless the DNS route is unavailable.**

Cloudflare's asset serving redirects `/anything.html` to the extensionless
`/anything`. Verified live on 2026-07-26:

```
curl -sI https://www.prepwise-app.com/privacy.html   ->  307 -> /privacy
curl -sI https://www.prepwise-app.com/404.html       ->  307 -> /404
```

Google's HTML-file check does not follow redirects. So dropping the token into
`landing/public/` produces a deploy that is green, a file that is visibly in the
repo, and a property that never verifies, reported as if the file were missing.

`landing/scripts/verify-seo.mjs` now **fails the build** if a `google*.html`
file appears in the static export (`gsc-verification-asset`), so that mistake
cannot ship.

### If you do need the HTML file route

The token is served from the worker instead, which answers before both the apex
redirect and the static assets:

1. In Search Console, choose the **URL prefix** property type and enter
   `https://www.prepwise-app.com`.
2. Choose the **HTML file** verification method. Do not download the file. Just
   copy its **filename**, for example `google1234567890abcdef.html`.
3. Paste that filename into the task resume note, or add it directly to
   `GOOGLE_VERIFICATION_FILES` in `worker/index.js`:

   ```js
   export const GOOGLE_VERIFICATION_FILES = ['google1234567890abcdef.html'];
   ```

4. Commit and push to `main`. GitHub Actions deploys automatically, and
   `scripts/verify-live-routing.sh` then asserts on the live site that the file
   answers 200 with no redirect on both hosts and carries the exact
   verification string.
5. Once the deploy is green, click **Verify** in Search Console.

The worker derives the file's body (`google-site-verification: <filename>`)
from the filename, because that is exactly what Google generates and checks for.
There is nothing else to paste.

**Leave old entries in the array.** Google re-checks verification periodically
and removing the file un-verifies the property, which stops the data feed
without any warning.

---

## Bing Webmaster Tools (optional, five minutes)

Worth doing because it is nearly free: Bing imports Google's verification, so
there is no second DNS record to add. Go to
**bing.com/webmasters**, sign in, and on the "Add your site" screen choose
**Import from Google Search Console** rather than "Add a site manually". Grant
the read access it asks for, pick `prepwise-app.com` from the list of imported
properties, and Bing carries over both the verification and the submitted
sitemap. This also covers DuckDuckGo, which is served by Bing's index. If the
import path ever fails, the manual fallback is the same shape as Google's: add
the TXT record Bing shows you in Cloudflare DNS, following Step 2 above.

---

## What is already done, so nobody redoes it

| Thing | State |
|---|---|
| `robots.txt` | Generated, allows crawling, points at the www sitemap |
| `sitemap.xml` | Generated from `SITE_ROUTES` plus the blog and use-case content |
| Canonical host | Every page canonicals to `www.prepwise-app.com`, apex 301s there |
| Wrong-domain references | Gated: `prepwise.app` fails the build and the live check |
| Worker token route | In place, empty by default, tested |
| Build gate against the broken file method | In place (`gsc-verification-asset`) |
| Live post-deploy assertion for a configured token | In place, prints `skip` while none is set |
| Domain property verified | **Done 2026-07-27** (DNS TXT, via Google's Cloudflare integration) |
| Sitemap submitted | **Done 2026-07-27**, status Success |
| Live assertion that the DNS token still exists | In place, runs on every deploy |
| Live assertion that SPF survived | In place, runs on every deploy |

Verification and sitemap submission were the only steps that needed a human, and
that is a property of Google's console rather than of anything here. Both are
done; nothing in this document is outstanding.

The last two rows exist because the ownership proof lives outside this repo, in
Cloudflare DNS. Nothing about a deploy touches it, but a DNS cleanup or a zone
migration can, and the failure is silent — Google just stops reporting. The
check queries DNS over HTTPS from Google's own resolver, so it needs no
`dig` in CI, and it deliberately matches *any* `google-site-verification=`
value: re-verifying under a different Google account legitimately rotates the
token, and pinning a copy here would be a second source of truth that
false-alarms. The failure it guards is the record being deleted. If the resolver
itself cannot be reached the check prints `skip` rather than failing the
deploy — a flaky guardrail trains everyone to ignore it.
