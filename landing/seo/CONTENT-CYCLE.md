# The content cycle — how a PrepWise post gets written

The repeatable loop. **Pick a cluster, read the SERP, draft, verify, open a PR.**
Trent merging the PR is the publish act; nothing else publishes anything.

This file is written to be handed to a content task verbatim. If you are an
agent picking up "write a blog post", this is your procedure. Do not improvise a
different one.

Six posts went through it on 2026-07-26 (the S4 batch). Every number and every
gotcha below came out of that run.

---

## Before you start

Read, in this order, and do not skip:

1. [`../references/voice.md`](../references/voice.md) — how PrepWise writes, and
   the words and claims that are banned outright.
2. [`../references/stats.md`](../references/stats.md) — **the only source of
   numbers.** A `TODO(trent: confirm)` row is unusable, not a hint.
3. [`on-page-checklist.md`](./on-page-checklist.md) — every item that applies to
   the page type.
4. [`../references/keyword-clusters.md`](../references/keyword-clusters.md) — the
   backlog you are pulling from.
5. [`../references/used-keywords.md`](../references/used-keywords.md) — what is
   already taken.

---

## Step 1 — Pick a cluster

Take the highest-ranked cluster in
[`keyword-clusters.md`](../references/keyword-clusters.md) that is not marked
CONSUMED and not blocked.

Prefer, in this order:

1. **High intent.** Someone with a problem beats someone browsing.
2. **Links into a use-case page.** A post that points at `/pantry-tracker`,
   `/meal-prep-app`, `/macro-meal-planner` or `/grocery-list-app` moves authority
   to a page that converts. A post that links nowhere is a leaf.
3. **Something we can honestly say.** If the cluster needs a number we do not
   have or a claim we may not make, it stays open. Ranking is not worth a claim
   we cannot make.

Several clusters carry a **blocker line** saying exactly what is missing. Respect
it or clear it; do not write around it.

## Step 2 — Claim the primary, before writing a word

Add the entry to [`used-keywords.md`](../references/used-keywords.md): the
primary, the slug, the source, the date, the secondary table, and an honest
cluster audit saying which secondaries came from research and which were
inferred.

**One primary, one page, ever.** Two pages on the same primary means Google picks
one and the other page's work is wasted.

The register is meant to be **ahead of** the content, not a record of it. Claim
first is the whole discipline.

## Step 3 — Read the SERP. This is not optional

Search the primary. Open the top three results. Record four things:

| What | Why |
|---|---|
| **Format** (guide / listicle / how-to / comparison / tool) | Matching it is most of the ranking decision |
| **Approximate length** | You are targeting within about 20% of their average |
| **Every topic all three cover** | A gap in your draft here is a reason to rank you lower |
| **What none of them does** | This is the only reason your page deserves to exist |

Write all four into the post file's header comment. The next writer needs to be
able to tell a measured decision from a guess, and in six months you will not
remember.

Two findings from the S4 batch worth knowing before you start:

- **The SERP will sometimes tell you the format is wrong for us.** `high protein
  meal prep` is entirely recipe listicles with original food photography. We are
  not a recipe publisher. The answer was to keep a building-block list in the
  middle so the shape reads as familiar, and to win on the part they all skip
  (how a number survives a week). If a format is genuinely unwinnable, change the
  cluster and say why in the register.
- **An institution-heavy SERP raises the bar to credibility, not cleverness.**
  For `how to reduce food waste at home` the page-one results are EPA, FDA, Mayo
  Clinic, NRDC and three university extensions. Cite them and link them. Do not
  try to out-statistic them with figures we do not have.

## Step 4 — Draft

A post is a flat TypeScript file in `content/blog/`, plus one line in
`content/blog/index.ts`. Copy an existing file.

Structure, from [`voice.md`](../references/voice.md):

> direct answer in the first paragraph → why it goes wrong the usual way → the
> concrete method → where PrepWise fits (one paragraph, honest) → FAQ → close on
> a next step, not a summary

Non-negotiables while drafting:

- **The first paragraph answers the query.** The primary keyword appears in it,
  verbatim, inside the first 100 words. No preamble, no scene-setting.
- **The primary keyword also appears in** the title (near the start), the meta
  description, the H1, and the slug.
- **Title 50-60 characters. Description 150-160.** Decoded, so `&amp;` is one
  character. The build gate fails outside those bands.
- **Slug under 35 characters.** The App Store `ct` token is `blog-<slug>` and it
  is silently truncated at 40, which would break install attribution with no
  error anywhere.
- **Every number traces to [`stats.md`](../references/stats.md).** If it is not
  there, it does not go on the page, and a `TODO(trent: confirm)` row is not a
  hint. Rephrase without it.
- **At most one story** ([`stories.md`](../references/stories.md)) and **at most
  one opinion** ([`opinions.md`](../references/opinions.md)). Never invented.
  Note as of 2026-07-26 every story slot is still empty, so the honest number of
  stories in a post today is zero.
- **3 to 5 internal links in the body**, in the prose where they are relevant,
  not in a block at the end. The `internalLinks` array at the bottom is the
  related-reading block and is **in addition** to those, never instead of them.
- **2 to 3 external links** to authoritative sources. `.gov` and `.edu` are worth
  more than a competitor's blog, and you may never cite a competitor's App Store
  listing.
- **4 to 8 FAQ questions** from People Also Ask and autocomplete, not invented.
  FAQ answers take **no markup**: the identical string is rendered and serialized
  into the schema, and keeping them the same string is what makes that structural
  rather than a promise.
- **Say who PrepWise is not for.** Every post. It is the strongest credibility
  signal available and it is also true.
- **No em dashes. No exclamation marks. No emoji.** Standing PrepWise-Info rules.

Inline markup in body copy is `[label](/href)` and `**bold**`, and nothing else.
External links get `target="_blank"` and `rel="noopener noreferrer"`
automatically.

Length: do not pad to cross the 1,500-word table-of-contents threshold. Below it
a TOC is furniture between the reader and the answer. If the SERP says 1,200
words, write 1,200.

## Step 5 — Delete the AI tells

Re-read the draft against [`voice.md`](../references/voice.md) → "Tells that it's
AI-written". Where you find one, **delete the paragraph and write it again**. Do
not patch it.

The two that survive longest, from the S4 batch, are the banned SaaS vocabulary
sneaking into a heading (`unlock`, `leverage` — both were caught by a mechanical
scan, not by reading) and the closing paragraph that restates the opening.

A mechanical scan is worth 30 seconds:

```bash
grep -inE "unlock|leverage|seamless|effortless|comprehensive|game-changer|—|!" content/blog/<file>.ts
```

It catches the vocabulary. It cannot catch a paragraph that would read
identically for a competitor's app, which is the more important test and the one
only you can run.

## Step 6 — Register and build

```bash
cd landing
# add one line to content/blog/index.ts
npm run build     # next build + scripts/verify-seo.mjs, which FAILS on a violation
```

The gate catches two things nothing else would: **a post file nobody imported**
(compiles, deploys green, does not exist) and **a slug whose `ct` would be
truncated**.

Green output looks like:

```
verify-seo: N page(s) checked, 2 skipped (error pages), 0 error(s), 0 warning(s)
verify-seo: ok
```

Confirm the new routes appear in the build output as static.

## Step 7 — Mark the cluster consumed

Go back to [`keyword-clusters.md`](../references/keyword-clusters.md) and mark
the cluster **CONSUMED** with its slug, in both the summary table and the
cluster's own section. A backlog that does not record what was taken is a backlog
that gets written twice.

## Step 8 — Open a PR. Do not merge

Branch, commit, push, open the PR against `main`.

```
[ARCHITECT] seo - <what>: <post slugs>
```

The PR description carries **one review summary per post**:

- the cluster it came from and the primary keyword claimed
- the SERP: what the top three were, their format, their length
- this post's length and how that compares
- which internal and external links it carries
- which opinion or story it used, if any
- an explicit confirmation of the checklist items a machine cannot check

**The task completes with the PR open.** Trent merging is the publish act, and
auto-deploy does the rest. An agent that merges its own content PR has removed
the only review step in the pipeline.

---

## The three enforcement layers, restated

| Layer | Catches | When |
|---|---|---|
| This cycle and the checklist | Everything, including the judgement calls | while writing |
| `scripts/verify-seo.mjs` | The mechanically checkable subset, on built HTML | build, blocking |
| Trent's review of the PR | Voice, honesty, whether it is worth publishing | before merge |

Layer 2 is the only one that cannot be talked out of a decision, which is why
anything decidable from the built HTML belongs in it rather than here. If you
find yourself relying on remembering something, that is a candidate check: add it
to `verify-seo.mjs` with a passing and a failing fixture, and mark the checklist
item **[GATE]**.
