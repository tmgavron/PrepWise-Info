<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# PrepWise content rules

Before writing ANY page, post, headline, or meta description in this app:

1. Read `references/voice.md` (how PrepWise writes, and the words and claims
   that are banned outright).
2. Read `references/stats.md`. **It is the only source of numbers.** A figure
   that is not in that file does not go on the page; a `TODO(trent: confirm)`
   row is unusable, not a hint.
3. Read `seo/on-page-checklist.md` and satisfy every item that applies to the
   page type.
4. Claim the primary keyword in `references/used-keywords.md` BEFORE writing.
   One primary, one page, ever. The backlog of unclaimed clusters is
   `references/keyword-clusters.md`.

Writing a blog post? `seo/CONTENT-CYCLE.md` is the whole procedure, start to
PR, and it supersedes improvising one.

Never invent a statistic, a user count, a rating, a testimonial, a story, or an
author credential.

`npm run build` runs `scripts/verify-seo.mjs` and FAILS on a violation, so a
page below the bar cannot deploy. Run `npm run verify:seo` any time to check the
current `out/`. Full rationale: repo root `CLAUDE.md` -> "SEO content".
