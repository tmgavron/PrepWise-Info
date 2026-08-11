# On-page SEO checklist — PrepWise

Canonical on-page reference for prepwise-app.com. **Every content task reads
this file first**, and every page shipped must satisfy every item that applies
to its page type.

Adapted 2026-07-26 from the `jonocatliff/SEO_brief` `on-page-seo.md` checklist.
The original was written for a **local service business** (a plumber): its
NAP, phone, service-area, business-hours, and `LocalBusiness` items do not
apply to PrepWise and have been replaced by the app-business equivalents:
`SoftwareApplication` / `MobileApplication` schema, App Store CTA rules, and
free-tier transparency. Everything structural (headings, schema, E-E-A-T,
accessibility, images, links) is kept.

## The three enforcement layers

| Layer | What it catches | Where |
|---|---|---|
| 1. This checklist | Everything, including judgement calls a machine cannot make | read before writing |
| 2. `verify-seo.mjs` | The mechanically checkable subset, on the built HTML | fails the build |
| 3. Review | Voice, honesty, whether the page is worth publishing | human |

Items marked **[GATE]** are enforced by `landing/scripts/verify-seo.mjs`
against the static export in `landing/out/`. A violation exits non-zero and the
deploy does not run. The rest are on you.

Run it yourself any time:

```bash
cd landing && npm run build          # build gate runs automatically
cd landing && npm run verify:seo     # against the existing out/
```

## Page types

| Type | What it is | Extra requirements |
|---|---|---|
| **home** | `/` | `MobileApplication` or `SoftwareApplication` schema, App Store CTA |
| **faq** | `/faq` | `FAQPage` + `BreadcrumbList`, App Store CTA |
| **blog-index** | `/blog` | `BreadcrumbList` |
| **article** | `/blog/*` | `Article` + `BreadcrumbList` + author byline + FAQ + App Store CTA |
| **use-case** | a top-level keyword page, e.g. `/pantry-tracker` | `WebPage` (referencing the app by `@id`) + `BreadcrumbList` + FAQ + App Store CTA + a **page-level `ct`** |
| **legal** | `/privacy`, `/terms` | base only; no CTA or FAQ requirements |
| **error** | `404`, `_not-found` | exempt from the gate entirely (not indexable) |

`classifyPage()` matches the blog INDEX before the `/blog/*` article rule, and
handles both `blog.html` and `blog/index.html`, so flipping `trailingSlash`
cannot silently regrade two pages.

A use-case page is a top-level HTML file and is therefore indistinguishable from
any other page **by path alone**. `classifyPage()` takes the slug list read from
`content/pages/` as its second argument, so the registry is what identifies
them; without it they grade as an ordinary `page` and quietly skip the extra
requirements.

---

## USE-CASE LANDING PAGES

One page, one keyword cluster, one job-to-be-done. Separate from the home page,
which owns the general "plan my meals" query (registered in
`../references/used-keywords.md`).

- [ ] Content is a flat TS file in `content/pages/`, registered in
      `content/pages/index.ts`. **[GATE]** a file nobody imported fails the
      build (`usecase-unregistered`); so does a registered page that produced no
      HTML (`usecase-not-built`).
- [ ] **[GATE] A page-level App Store campaign token**, declared as `ct` on the
      page object. Shape `lp_<slug-ish>`, lowercase `[a-z0-9_]`, no doubled or
      trailing underscore, **40 characters maximum**.
- [ ] **[GATE] The token actually reaches the rendered App Store href**
      (`usecase-ct-not-rendered`). `sanitizeCt()` truncates silently and a page
      wired without its token still renders a working link, so the only symptom
      of getting it wrong is an App Store row crediting the wrong page months
      later. `src/lib/usecase.ts` asserts the token's SHAPE at build time;
      `verify-seo.mjs` asserts it reached the ARTEFACT.
- [ ] **[GATE] EVERY App Store URL on the page carries it, JSON-LD included**
      (`usecase-ct-mismatch`, and `appstore-ct-inconsistent` sitewide). The rule
      above is a PRESENCE check, and presence is satisfied by one correct
      anchor — it cannot see a SECOND App Store URL on the same page carrying a
      different token. That is exactly what shipped on 2026-07-27: four
      use-case pages and `/faq` rendered correct `ct=lp_*` anchors beside a
      JSON-LD `installUrl`/`downloadUrl` advertising the sitewide default,
      because the app node was built once in the root layout, which has no
      dynamic segment and therefore cannot know which page is rendering. Both
      links work, nothing errors, and an install a search engine sources from
      the schema lands in the generic bucket. Build the graph with
      `siteGraph(pageCt, …)` from `src/lib/schema.ts` and the two cannot drift.
- [ ] **[GATE] No two pages share a token** (`usecase-ct-duplicate`). Their
      installs would merge into one App Store row and neither number would be
      real.
- [ ] An incoming ad's `utm_content` still OVERRIDES the page token. Paid
      attribution is the one with money riding on it; never invert that order.
      See `~/command-system/marketing/UTM-PLAYBOOK.md`.
- [ ] The `notFor` block is a REQUIRED field on the page type, not a section
      someone remembers to write. See `../references/voice.md`.
- [ ] Before writing: search the primary keyword, read the top-3 ranking pages,
      and match their format and length to within about 20%. Record what you
      found in the page file's header comment and in the register's cluster
      audit, so the next writer can tell a measured decision from a guess.

---

## HEAD / METADATA

- [ ] **[GATE] Title tag: 50-60 characters**, primary keyword near the start.
      Measured on the DECODED text, so `&amp;` counts as one character.
- [ ] **[GATE] Meta description: 150-160 characters**, primary keyword + the
      benefit + a soft CTA. Decoded, same as above.
- [ ] **[GATE] Canonical URL** present, absolute, and on `https://www.prepwise-app.com`.
      One source of truth: `SITE_URL` in `src/lib/constants.ts`.
- [ ] **[GATE] Open Graph:** `og:title`, `og:description`, `og:image`, `og:url`, `og:type`.
      The image is 1200x630 (`/og-image.png`, generated by
      `scripts/make-brand-assets.py`).
- [ ] **[GATE] Twitter Card:** `twitter:card=summary_large_image` plus title,
      description, image.
- [ ] **[GATE] `lang` attribute** on `<html>` (`lang="en"`).
- [ ] **[GATE] Viewport meta** (Next emits this; the gate asserts it survived).
- [ ] **[GATE] Charset meta.**
- [ ] **[GATE] No `prepwise.app` anywhere.** That domain belongs to an unrelated
      company. See the repo `CLAUDE.md` → "Domain and canonical host".
- [ ] Favicon and `apple-touch-icon` present.
- [ ] Page is in `SITE_ROUTES` (`src/lib/constants.ts`) so the generated sitemap
      includes it, with a real content `lastModified` date, not the build date.

## URL STRUCTURE

- [ ] **Slug under 60 characters**, lowercase, hyphens only, never underscores.
- [ ] **Primary keyword in the slug.**
- [ ] No stop words unless they are needed for sense.
- [ ] Logical hierarchy: `/blog/<post-slug>` for articles, top-level for
      product and legal pages.
- [ ] The primary keyword is registered in
      [`../references/used-keywords.md`](../references/used-keywords.md)
      **before** the page is written. One primary, one page, ever.

## HEADINGS

- [ ] **[GATE] Exactly one H1** per page, containing the primary keyword.
- [ ] Logical H2 → H3 hierarchy, never skipping a level.
- [ ] H2s use supporting keywords and real questions from the cluster.
- [ ] No keyword stuffing. If a heading reads like it was written for a crawler,
      rewrite it.
- [ ] Headings are statements, not labels (see
      [`../references/voice.md`](../references/voice.md)).

## COPY / BODY

- [ ] **Primary keyword in the first 100 words.**
- [ ] **The first paragraph answers the query directly.** No preamble.
- [ ] **Length within 20% of the top-3 results** for the primary keyword. Check
      the SERP; do not pad to a word count.
- [ ] Short paragraphs, 1 to 4 sentences.
- [ ] Readability around 8th to 10th grade.
- [ ] Active voice, second person.
- [ ] Bold sparingly; bullets and numbered lists where they earn their place.
- [ ] **Every number traces to
      [`../references/stats.md`](../references/stats.md).** A number that is not
      in that file does not go on the page. A `TODO(trent: confirm)` value is
      unusable, not a suggestion.
- [ ] At most one story (from [`../references/stories.md`](../references/stories.md))
      and at most one opinion (from
      [`../references/opinions.md`](../references/opinions.md)).
- [ ] The page says somewhere who PrepWise is **not** for. See `voice.md`.
- [ ] **[GATE] No banned SaaS vocabulary in visible copy** (`banned-copy`):
      unlock, leverage, seamless, effortless, game-changer, empower, synergy,
      cutting-edge, world-class, best-in-class, revolutionize, comprehensive,
      holistic, utilize, and their obvious inflections. Matched on the rendered
      text only, so a class name, a URL or a script cannot trip it, and **legal
      pages are exempt** (different register, different author). Added
      2026-07-26 after two posts in one batch shipped a drafted `unlock` and
      `leverage` that three re-reads missed and a grep caught.
      The banned CLAIMS (cure, treat, FDA approved) are deliberately NOT in the
      gate: they are enforced in code on the ad and script side, and a page must
      be able to state what PrepWise does not claim.
- [ ] Re-read against `voice.md` → "Tells that it's AI-written" and delete
      anything that matches. The gate catches the vocabulary. It cannot catch a
      paragraph that would read identically for a competitor's app, which is the
      more important test.

## APP STORE CTA (home and article pages)

Replaces the original checklist's phone / click-to-call / service-area items.
PrepWise has no phone number and no premises; the conversion event is an App
Store click.

- [ ] **[GATE] At least one App Store link** on the page (home and article
      types). It comes from `APP_STORE_URL` in `src/lib/constants.ts`, never
      hand-written.
- [ ] **Primary CTA above the fold** on the home page.
- [ ] CTA repeated at least once more in long content, at a natural decision
      point rather than mid-argument.
- [ ] The link goes through `buildAppStoreUrl()` (`src/lib/analytics.ts`) so
      the `ct` attribution token survives. A hand-written App Store URL breaks
      install attribution silently. See the UTM playbook in
      `~/command-system/marketing/UTM-PLAYBOOK.md`.
- [ ] **[GATE] ONE PAGE, ONE CAMPAIGN TOKEN** (`appstore-ct-inconsistent`).
      `ct` is the join key into App Store Connect, so a page emitting two of
      them splits its own installs across two rows. The gate enumerates every
      `apps.apple.com` URL in the built HTML — anchors AND the JSON-LD
      `installUrl`/`downloadUrl`, which is a real download link a crawler will
      offer — and fails the build if they do not all agree. Applies to pages
      that legitimately use the default token (`/`, `/blog`, the legal pages)
      as well as the ones with a token of their own.
- [ ] **State the platform: iPhone / iOS only.** Never "available on mobile".
- [ ] **State the price honestly:** free to download; Pro is $6.99/month or
      $39.99/year with a 7-day trial. Free-tier limits (15 recipes, 20 AI
      messages a day) are printed where price is discussed.
- [ ] No fabricated urgency, no fake scarcity, no countdown.

## TRUST SIGNALS (replaces "reviews, licences, years in business")

- [ ] Publisher named as **PrepWise LLC**.
- [ ] Privacy policy and terms linked from the footer of every page.
- [ ] **Never publish a star rating without its rating count**, and see
      `stats.md` on why neither is publishable yet.
- [ ] **No `aggregateRating` in JSON-LD** unless the page visibly displays real
      ratings sourced from the App Store. Inventing one is a manual-action risk.
- [ ] No testimonial that a real person did not say and agree to.

## FAQ SECTION (every article)

- [ ] 4 to 8 questions taken from People Also Ask and real search data, not
      invented. Record where each came from: `content/faq.ts` carries a
      `source` and a `provenance` per question, because "questions real people
      ask" is a claim, and an unsourced claim is indistinguishable from a
      question invented to have something to answer.
- [ ] Direct answers, 2 to 4 sentences each, answer first.
- [ ] **[GATE] ONE `FAQPage` on the site, and `/faq` owns it.** Two surfaces
      publishing the same answers as schema is how Google picks one and
      discards the other page's work, which is the cannibalisation the
      used-keywords register exists to prevent. `verify-seo.mjs` fails the
      build if more than one exported page declares `FAQPage`.
- [ ] **[GATE] An FAQ section elsewhere links to `/faq`.** A page that renders
      questions either OWNS the schema or POINTS AT the page that does; a page
      that does neither is an orphaned answer block. This is what lets the home
      page and each blog post carry an FAQ without a second `FAQPage` node.
- [ ] The schema's questions and answers match the visible text. Google treats
      schema-only FAQ content as a violation. The site guarantees this
      structurally rather than by review: an FAQ answer is PLAIN TEXT in
      `content/`, and the same string is rendered and serialized into the
      schema. Keep it that way, and keep markup out of FAQ answers.

## IMAGES

- [ ] **[GATE] Every `<img>` has an `alt` attribute.** Empty `alt=""` is
      allowed only for genuinely decorative images; the gate reports them so the
      choice is deliberate.
- [ ] Alt text describes the image, with the keyword only where it is natural.
- [ ] Descriptive hyphenated filenames (`pantry-availability-indicator.webp`,
      not `IMG_2831.png`).
- [ ] WebP or optimised PNG, under 200 KB where possible.
- [ ] Width and height set, to prevent layout shift.
- [ ] `loading="lazy"` below the fold. Next `<Image>` handles this; raw `<img>`
      does not.
- [ ] A featured image suitable for social sharing.

## INTERNAL LINKS

- [ ] 3 to 5 internal links per article, in the body copy where they are
      relevant, not in a block at the end.
- [ ] Descriptive anchor text. Never "click here" or "read more".
- [ ] Link to the home page and to at least one related article.
- [ ] Breadcrumbs on article pages, with `BreadcrumbList` schema.

## EXTERNAL LINKS

- [ ] 2 to 3 links to authoritative sources (.gov, .edu, a named study, a
      primary source) on any article that cites a fact.
- [ ] `rel="noopener"` on anything opening in a new tab.
- [ ] `rel="nofollow"` on sponsored or affiliate links.
- [ ] **Never link to a competitor's app listing** as a citation.

## SCHEMA MARKUP (JSON-LD)

- [ ] **[GATE] All JSON-LD on the page parses.** A syntax error means Google
      sees no schema at all, and nothing else reports it.
- [ ] **[GATE] `Organization` and `WebSite`** site-wide. They come from
      `siteGraph()` in `src/lib/schema.ts`, which EVERY page calls — NOT from
      `src/app/layout.tsx`, which deliberately emits no JSON-LD at all. A page
      that forgets to call it fails the build on `schema-missing`.
- [ ] **[GATE] `MobileApplication` (or `SoftwareApplication`) on the home page**,
      with `applicationCategory`, `operatingSystem`, `offers`, `installUrl`.
      This replaces the original checklist's `LocalBusiness` item. Its
      `installUrl`/`downloadUrl` carry the PAGE's campaign token — see
      "ONE PAGE, ONE CAMPAIGN TOKEN" in the App Store CTA section.
- [ ] **[GATE] `Article` on every `/blog/*` page**, with `author`,
      `datePublished`, `dateModified`, `headline`, `image`.
- [ ] **[GATE] `BreadcrumbList` on every `/blog/*` page.**
- [ ] **[GATE] `FAQPage` on `/faq`, and nowhere else** (see the FAQ section).
- [ ] `Person` for the author byline, using the stable `@id` in
      [`../references/author.md`](../references/author.md). Built by
      `src/lib/schema.ts`; it omits `url`, `image`, and `sameAs` because /about,
      a headshot, and the profile links do not exist yet.
- [ ] Every node that references another uses `@id`, so the graph is one
      identity rather than several duplicates.

## E-E-A-T SIGNALS

- [ ] Author byline with a real name on every article.
- [ ] Author bio with real credentials, from `author.md`. **Never invent a
      credential**, and never imply a nutrition or medical qualification.
- [ ] Byline links to the author page.
- [ ] Published date shown on the page.
- [ ] "Last updated" date shown when content is revised, and the matching
      `lastModified` bumped in `SITE_ROUTES`.
- [ ] Real numbers, real opinions, real stories, from the `references/` files.
- [ ] Sources cited and linked for any third-party fact.
- [ ] The page is honest about what the app does not do.

## ACCESSIBILITY

- [ ] Semantic HTML5: `<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`.
- [ ] ARIA labels on interactive elements that need them.
- [ ] Colour contrast meets WCAG AA (4.5:1 for body text).
- [ ] Visible focus indicators on everything interactive.
- [ ] Alt text on all images (see IMAGES).
- [ ] Descriptive link text.
- [ ] Skip-to-content link for keyboard users.
- [ ] Inline links in body copy are underlined, not colour-only.

## MOBILE

- [ ] Responsive at 320px through desktop, no horizontal scroll.
- [ ] Touch targets at least 48x48px.
- [ ] Body text at least 16px.
- [ ] No intrusive interstitials.

## SOCIAL PREVIEW

- [ ] Open Graph image 1200x630, under 1 MB.
- [ ] `og:description` may differ from the meta description where a
      more conversational line converts better.
- [ ] Preview rendered and checked before publishing.

## LONG-FORM (1500+ words)

- [ ] Table of contents with anchor links.
- [ ] Jump links for each H2.
- [ ] Back-to-top control.

All three are automatic: `needsTableOfContents()` in `src/lib/blog.ts` counts
the words the reader actually sees and the template renders the TOC and the
per-section back-to-top links above the threshold. Do NOT pad a post to cross
it. Below 1500 words a TOC is furniture between the reader and the answer.

---

## PUBLISHING A BLOG POST

**The end-to-end procedure lives in [`CONTENT-CYCLE.md`](./CONTENT-CYCLE.md)**:
pick a cluster, claim the primary, read the SERP, draft, verify, open a PR. This
section is the mechanical part of it.

A post is a flat TypeScript file in `content/blog/`, plus one line in
`content/blog/index.ts`. No CMS and no MDX toolchain: the post is data, the
template renders it, `next build` writes the HTML.

1. Claim the primary in
   [`../references/used-keywords.md`](../references/used-keywords.md) FIRST.
2. Copy an existing file in `content/blog/` and fill it in. `title` is 50-60
   characters, `description` 150-160, both decoded.
3. Register it in `content/blog/index.ts`.
4. `npm run build`. The route is generated by `generateStaticParams`, the
   sitemap picks the post up from the content directory (NOT from
   `SITE_ROUTES`), and the gate checks it as an `article`.

Two things the gate catches that nothing else would:

- **A post file nobody imported.** It compiles, the build is green, the deploy
  is green, and the post does not exist. `blog-post-unregistered`.
- **A slug whose App Store campaign token would be truncated.** `ct` is capped
  at 40 characters and `sanitizeCt()` cuts silently, so an over-long slug
  produces installs that no longer join back to the post that earned them.
  `blog-ct-too-long`. Keep the slug under 35 characters.

Inline markup in body copy is `[label](/href)` and `**bold**`, and nothing
else. External links get `target="_blank"` and `rel="noopener noreferrer"`
automatically. FAQ answers take NO markup, because the same string goes into
the JSON-LD.

---

## Adding a check to the gate

If a checklist item can be decided from the built HTML with no judgement, it
belongs in `landing/scripts/verify-seo.mjs` rather than here as an honour-system
item. Add the check, add a passing and a failing fixture to its `--self-test`,
and mark the item **[GATE]** above.

If deciding it needs a human, leave it here and say why.
