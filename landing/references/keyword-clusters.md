# Keyword clusters — the PrepWise content pipeline

> The backlog. Every cluster below is a page that has not been written yet, or a
> page that has (marked **CONSUMED**). One cluster becomes one page, and its
> primary is claimed in [`used-keywords.md`](./used-keywords.md) **before**
> anything is written.
>
> **Status:** built by ARCHITECT 2026-07-26 (SEO S4). 22 clusters. Six were
> consumed by the S4 blog batch in the same commit.

---

## How this file was built, and what that is worth

No paid keyword tool exists for PrepWise. Nobody here has a volume number or a
difficulty score for any phrase below, and this file says so per row rather than
implying research that did not happen. Four sources, in descending order of how
much they are worth:

| Source | What it gives | What it does not |
|---|---|---|
| **Google autocomplete** (`suggestqueries.google.com/complete/search`) | Real phrases real people type, ranked by Google's own ordering | No volume, no difficulty, no trend |
| **SERP reading** | Format, length, and topic coverage of the pages that already rank | Nothing about demand |
| **People Also Ask** | The follow-up questions a searcher has, which is FAQ material | Same |
| **Content Lab `competitor_content`** | What competitors post about | Almost nothing, see below |

**Autocomplete is the backbone here.** Every phrase marked `✓ autocomplete` was
returned by Google's own suggestion endpoint on 2026-07-26 for the seed shown in
its cluster. It is evidence that the phrase is typed. It is not evidence that it
is typed *often*.

`(inferred)` means someone derived the phrase from a pattern. It might be right.
It has no source.

### The competitor corpus was close to useless, and that is the finding

`competitor_content` holds 120 rows (Mealime, eMeals, Eat This Much, Prepear,
Plan to Eat and others, Instagram organic, read 2026-07-26). Reading all 120:
they are almost entirely **recipe-of-the-day promotions** — "Herb-Roasted Pork
Tenderloin is new on the Low Carb plan this week", "Try it out, take a photo,
and tag us" — plus seasonal hooks and app-feature teasers.

That is a social-content corpus, not a search corpus. It yielded **no keyword**
that autocomplete had not already given, and it is recorded here with its count
and its date rather than quietly dropped, because an empty source is a finding.
What it *did* confirm is thematic: the category posts constantly about **weekly
prep**, **high protein**, **budget**, **leftovers**, **freezer batches**, and
"no clue what to make today". Those themes shaped which clusters were ranked
first; they did not supply a single phrase.

**The next writer with a real keyword export should re-derive every cluster
below and correct it**, rather than assuming these guesses were right.

---

## How to consume a cluster

1. Pick the highest-ranked unconsumed cluster that fits the page you want.
2. Claim its primary in [`used-keywords.md`](./used-keywords.md), with the
   cluster's secondaries and an honest cluster audit.
3. Search the primary. Read the top three ranking pages. Record their format and
   length in the page file's header comment.
4. Write the page to [`../seo/CONTENT-CYCLE.md`](../seo/CONTENT-CYCLE.md).
5. Come back here and mark the cluster **CONSUMED**, with its slug.

A cluster is a *proposal*. If the SERP says the format is wrong, change the
cluster and say why. Do not write a page that fits the cluster and misses the
search.

---

## The clusters

Ranked by intent strength and by how directly they feed a use-case page. The
`Links to` column is what makes a cluster worth writing: a post that points at
`/pantry-tracker` or `/grocery-list-app` moves authority to a page that converts.

| # | Primary | Intent | Format | Links to | Status |
|---|---|---|---|---|---|
| 1 | `what can i make with what i have` | informational | how-to + templates | `/pantry-tracker`, `/` | **CONSUMED** → `/blog/what-can-i-make-with-what-i-have` |
| 2 | `how to meal plan for the week` | informational | step guide | `/meal-prep-app`, `/grocery-list-app` | **CONSUMED** → `/blog/how-to-meal-plan-for-the-week` |
| 3 | `meal prep for beginners` | informational | beginner guide | `/meal-prep-app` | **CONSUMED** → `/blog/meal-prep-for-beginners` |
| 4 | `how to meal plan on a budget` | informational | how-to + tactics | `/grocery-list-app`, `/pantry-tracker` | **CONSUMED** → `/blog/how-to-meal-plan-on-a-budget` |
| 5 | `high protein meal prep` | informational | how-to + building blocks | `/macro-meal-planner` | **CONSUMED** → `/blog/high-protein-meal-prep` |
| 6 | `how to reduce food waste at home` | informational | tactics listicle | `/pantry-tracker`, `/grocery-list-app` | **CONSUMED** → `/blog/how-to-reduce-food-waste-at-home` |
| 7 | `how long does meal prep last in the fridge` | informational | direct answer + chart | `/meal-prep-app` | open |
| 8 | `meal planning for two` | informational | how-to | `/meal-prep-app`, `/grocery-list-app` | open |
| 9 | `how to meal plan for one person` | informational | how-to | `/meal-prep-app` | open |
| 10 | `pantry staples list` | informational | listicle | `/pantry-tracker` | open |
| 11 | `freezer meal prep` | informational | how-to | `/meal-prep-app` | open |
| 12 | `how to meal plan for macros` | informational | how-to | `/macro-meal-planner` | open |
| 13 | `what to do with leftovers` | informational | templates listicle | `/pantry-tracker` | open |
| 14 | `how to organize a pantry` | informational | how-to | `/pantry-tracker` | open |
| 15 | `grocery budget for 2` | informational | how-to + numbers | `/grocery-list-app` | open |
| 16 | `meal planning template` | transactional-ish | tool + guide | `/meal-prep-app` | open |
| 17 | `meal prep containers` | commercial | buyer guide | `/meal-prep-app` | open (weak fit) |
| 18 | `sunday meal prep` | informational | routine guide | `/meal-prep-app` | open |
| 19 | `meal prep for weight loss` | informational | careful how-to | `/macro-meal-planner` | open (**claim risk**) |
| 20 | `how to shop without a list` | informational | contrarian how-to | `/grocery-list-app` | open |
| 21 | `best meal planning app for iphone` | commercial | comparison | `/`, all use-case pages | open (**needs care**) |
| 22 | `what can i make with chicken breast` | informational | recipe listicle | `/pantry-tracker` | open (**weak fit**) |

---

### 1. `what can i make with what i have` — **CONSUMED**

- **Seed:** `what can i make with what i have` → autocomplete, 2026-07-26
- **Intent:** informational, at the point of deciding dinner
- **Format:** the SERP is split between **tools** (Supercook, Tesco's recipe
  finder) and **recipe listicles** (Taste of Home "31 Easy Pantry Dinners",
  BuzzFeed). Nobody teaches the method. That gap is the page.
- **Length target:** 1,400–1,700 words (the listicles run long on recipe cards
  and short on prose)
- **Internal links:** `/pantry-tracker` (the inventory that makes this
  answerable), `/` , `/faq`
- **Page:** `/blog/what-can-i-make-with-what-i-have`

| Secondary | Source |
|---|---|
| what can i make with what i have in my fridge | ✓ autocomplete |
| what can i make with what i have in my pantry | ✓ autocomplete |
| what can i cook with what i have | ✓ autocomplete |
| what can i make with these ingredients | ✓ autocomplete |
| what can i make with what i have in my kitchen | ✓ autocomplete |

---

### 2. `how to meal plan for the week` — **CONSUMED**

- **Seed:** `how to meal plan` → autocomplete, 2026-07-26 (first expansion)
- **Intent:** informational
- **Format:** numbered step guide. Every ranking page is one.
- **Length target:** 2,000–2,400 words. Measured: The Girl on Bloor ~2,800,
  Harvard Nutrition Source and Brown Health shorter, The Kitchn mid.
- **Internal links:** `/meal-prep-app`, `/grocery-list-app`, `/pantry-tracker`
- **Page:** `/blog/how-to-meal-plan-for-the-week`

| Secondary | Source |
|---|---|
| how to meal plan for the week on a budget | ✓ autocomplete |
| how to meal plan and prep | ✓ autocomplete |
| how to meal plan for a family | ✓ autocomplete |
| weekly meal planning | (inferred) |
| meal planning for the week | ✓ autocomplete (`meal planning for the week`) |

*Boundary: this is the WEEK's process. `how to meal plan from your pantry`
(claimed, post 2) is the pantry-first METHOD. They overlap and are deliberately
kept apart: this post links to that one rather than restating it.*

---

### 3. `meal prep for beginners` — **CONSUMED**

- **Seed:** `meal prep for` → autocomplete, 2026-07-26
- **Intent:** informational, first-timer
- **Format:** beginner guide with a first-week plan. Budget Bytes (~1,800 words,
  11 headings, no FAQ) and Cleveland Clinic (~2,100 words, six numbered steps,
  no FAQ) are the shape.
- **Length target:** 1,700–2,100 words
- **Internal links:** `/meal-prep-app`, `/faq`
- **Page:** `/blog/meal-prep-for-beginners`

| Secondary | Source |
|---|---|
| how to start meal prepping | ✓ autocomplete |
| meal prep for beginners weight loss | ✓ autocomplete |
| easy meal prep for beginners | ✓ autocomplete |
| how to meal prep for the week for beginners | ✓ autocomplete |
| meal prep ideas for the week | ✓ autocomplete |

---

### 4. `how to meal plan on a budget` — **CONSUMED**

- **Seed:** `how to meal plan on a budget` → autocomplete, 2026-07-26
- **Intent:** informational, strong commercial adjacency (people searching this
  are about to change what they buy)
- **Format:** how-to with numbered tactics. Good Cheap Eats (~2,100 words,
  nine H2 tactics **plus an FAQ**) is the closest match; the rest are `.ca`/`.org`
  tip lists.
- **Length target:** 1,800–2,200 words
- **Internal links:** `/grocery-list-app`, `/pantry-tracker`, sibling posts
- **Page:** `/blog/how-to-meal-plan-on-a-budget`

| Secondary | Source |
|---|---|
| how to meal plan on a budget for 2 | ✓ autocomplete |
| how to meal plan on a tight budget | ✓ autocomplete |
| how to meal prep on a budget | ✓ autocomplete |
| grocery budget | ✓ autocomplete |
| how to meal plan on a budget for 1 | ✓ autocomplete |

---

### 5. `high protein meal prep` — **CONSUMED**

- **Seed:** `high protein meal` → autocomplete, 2026-07-26
- **Intent:** informational, fitness-adjacent
- **Format:** the SERP is **all recipe listicles** (CookUnity, HexClad,
  MyProtein, Oh Snap Macros). None of them explains how to hit a protein number
  across a week rather than in one meal. That is the page, with a building-block
  list so the format still reads as familiar.
- **Length target:** 1,600–1,900 words
- **Internal links:** `/macro-meal-planner`, `/meal-prep-app`
- **Page:** `/blog/high-protein-meal-prep`
- **Claim risk:** HIGH. This cluster sits next to weight-loss and muscle-gain
  promises. No outcome claims, no gram targets we cannot source. See
  [`voice.md`](./voice.md) → banned claims.

| Secondary | Source |
|---|---|
| high protein meal prep ideas | ✓ autocomplete |
| high protein meal prep recipes | ✓ autocomplete |
| freezer meal prep high protein | ✓ autocomplete |
| meal prep ideas for the week high protein | ✓ autocomplete |
| high protein meal plan | ✓ autocomplete |

---

### 6. `how to reduce food waste at home` — **CONSUMED**

- **Seed:** `how to reduce food waste` → autocomplete, 2026-07-26
- **Intent:** informational
- **Format:** numbered tactics. The SERP is unusually **institution-heavy**
  (EPA ~2,800 words, FDA, Mayo Clinic, NRDC, three university extensions), which
  means the bar is credibility, not cleverness. Cite them; do not compete with
  them on statistics we do not have.
- **Length target:** 1,800–2,200 words
- **Internal links:** `/pantry-tracker`, `/grocery-list-app`, sibling posts
- **Page:** `/blog/how-to-reduce-food-waste-at-home`
- **Claim risk:** the "$1,500 a year" figure is **banned** unless sourced
  directly to USDA or ReFED ([`stats.md`](./stats.md)). Every ranking page prints
  a number; we link theirs instead of inventing ours.

| Secondary | Source |
|---|---|
| how to stop wasting food at home | ✓ autocomplete |
| how to avoid wasting food | ✓ autocomplete |
| how to stop throwing away food | ✓ autocomplete |
| how to prevent wasting food | ✓ autocomplete |
| food waste app | ✓ autocomplete |

---

### 7. `how long does meal prep last in the fridge`

- **Seed:** `how long does meal prep last` → autocomplete, 2026-07-26
- **Intent:** informational, urgent (someone is holding a container)
- **Format:** direct answer in the first sentence, then a storage table. This is
  a featured-snippet cluster: the answer is short and the SERP rewards being
  first with it.
- **Length target:** 900–1,300 words. Short on purpose.
- **Links to:** `/meal-prep-app`
- **Note:** food-safety content. Every time claim links to USDA FoodKeeper or
  FSIS. Nothing here is our opinion.

| Secondary | Source |
|---|---|
| how long does meal prep last in the freezer | ✓ autocomplete |
| how long does meal prep last chicken | ✓ autocomplete |
| how long can meal prep last in fridge | ✓ autocomplete |
| leftovers in fridge 5 days | ✓ autocomplete |

---

### 8. `meal planning for two`

- **Seed:** `meal planning for two` → autocomplete, 2026-07-26
- **Intent:** informational
- **Format:** how-to. The distinct problem is pack sizes: recipes serve four,
  shops sell for six, two people eat for two.
- **Length target:** 1,500–1,900 words
- **Links to:** `/meal-prep-app`, `/grocery-list-app`

| Secondary | Source |
|---|---|
| meal planning for two adults | ✓ autocomplete |
| meal planning for two on a budget | ✓ autocomplete |
| meal planning for two people | ✓ autocomplete |
| meal planning ideas for two | ✓ autocomplete |

---

### 9. `how to meal plan for one person`

- **Seed:** `meal plan for one` → autocomplete, 2026-07-26
- **Intent:** informational
- **Format:** how-to. Same pack-size problem as cluster 8, worse. The honest
  angle is deliberate repetition: cooking one thing three ways.
- **Length target:** 1,500–1,900 words
- **Links to:** `/meal-prep-app`
- **Boundary:** must not become a second `meal planning for two`. If the draft
  could take either title, it is the wrong page.

| Secondary | Source |
|---|---|
| meal plan for one person for a week | ✓ autocomplete |
| meal plan for one person on a budget | ✓ autocomplete |
| meal plan for one person with grocery list | ✓ autocomplete |
| cooking for one | (inferred) |

---

### 10. `pantry staples list`

- **Seed:** `pantry staples` → autocomplete, 2026-07-26
- **Intent:** informational, list-shaped
- **Format:** listicle. Every ranking page is a list, so this one is too.
- **Length target:** 1,200–1,600 words
- **Links to:** `/pantry-tracker`
- **Angle:** most staple lists are aspirational and end up as the food that goes
  stale. The PrepWise version is the shorter list that actually gets cooked.

| Secondary | Source |
|---|---|
| pantry staples to stock up on | ✓ autocomplete |
| pantry staples on a budget | ✓ autocomplete |
| pantry staples for healthy eating | ✓ autocomplete |
| pantry staples recipes | ✓ autocomplete |

---

### 11. `freezer meal prep`

- **Seed:** `freezer meal prep` → autocomplete, 2026-07-26
- **Intent:** informational
- **Format:** how-to plus a list of what freezes well
- **Length target:** 1,500–1,900 words
- **Links to:** `/meal-prep-app`
- **Angle:** the freezer is the part of the kitchen you cannot see, so it is
  where an inventory pays most. Food-safety times link to FoodKeeper.

| Secondary | Source |
|---|---|
| freezer meal prep ideas | ✓ autocomplete |
| freezer meal prep high protein | ✓ autocomplete |
| freezer meal prep recipes | ✓ autocomplete |
| freezer meal prep containers | ✓ autocomplete |

---

### 12. `how to meal plan for macros`

- **Seed:** `how to meal plan` → autocomplete, 2026-07-26
- **Intent:** informational
- **Format:** how-to
- **Length target:** 1,600–2,000 words
- **Links to:** `/macro-meal-planner`
- **Boundary:** `/macro-meal-planner` owns `macro tracking meal planner`
  (commercial). This is the method post that links to it. **Claim risk: HIGH** —
  same rules as cluster 5.

| Secondary | Source |
|---|---|
| how to meal plan for weight loss | ✓ autocomplete (**handle carefully**) |
| calorie and macro meal planning | (inferred) |
| macro meal prep | (inferred) |
| counting macros meal plan | (inferred) |

---

### 13. `what to do with leftovers`

- **Seed:** `what to do with leftover` → autocomplete, 2026-07-26
- **Intent:** informational, immediate
- **Format:** templates listicle. Autocomplete is dominated by
  ingredient-specific tails (rotisserie chicken, rice, mashed potatoes), so the
  post is a set of transformations rather than recipes.
- **Length target:** 1,400–1,800 words
- **Links to:** `/pantry-tracker`
- **Note:** the ingredient tails are each their own future post if this one
  ranks. Do not try to cover them all here.

| Secondary | Source |
|---|---|
| what to do with leftover rotisserie chicken | ✓ autocomplete |
| what to do with leftover rice | ✓ autocomplete |
| what to do with leftover chicken | ✓ autocomplete |
| leftovers in fridge 5 days | ✓ autocomplete |

---

### 14. `how to organize a pantry`

- **Seed:** `how to organize a pantry` → autocomplete, 2026-07-26
- **Intent:** informational — but read the tails before writing. They are almost
  all **shelving and storage** (`deep shelves`, `wire shelves`, `dollar tree`),
  which is home-organisation intent, not meal-planning intent.
- **Format:** how-to with photos we do not have
- **Length target:** 1,400–1,800 words
- **Links to:** `/pantry-tracker`
- **Status:** open, but **ranked low deliberately.** High volume, poor fit. If it
  is written, it must earn its place by being about *finding food again*, not
  about baskets.

| Secondary | Source |
|---|---|
| how to organize a pantry closet | ✓ autocomplete |
| how to organize a pantry cabinet | ✓ autocomplete |
| pantry organization ideas | ✓ autocomplete |
| how to organize a pantry with deep shelves | ✓ autocomplete |

---

### 15. `grocery budget for 2`

- **Seed:** `grocery budget` → autocomplete, 2026-07-26 (the tails are almost
  entirely household sizes: 1, 2, 3, 4, 5, 6)
- **Intent:** informational, number-seeking
- **Format:** how-to with real figures
- **Length target:** 1,400–1,800 words
- **Links to:** `/grocery-list-app`
- **Blocker:** this cluster is **about a number we do not have.** The only
  honest version cites the USDA Food Plans monthly cost reports directly and
  links them. Do not publish a household grocery figure of our own.

| Secondary | Source |
|---|---|
| grocery budget for 1 | ✓ autocomplete |
| grocery budget for family of 4 | ✓ autocomplete |
| grocery budget calculator | ✓ autocomplete |
| grocery budget app | ✓ autocomplete |

---

### 16. `meal planning template`

- **Seed:** `meal plan template` → autocomplete, 2026-07-26
- **Intent:** transactional. The tails are all file formats: `google sheets`,
  `printable`, `pdf`, `excel`, `google docs`, `free editable`.
- **Format:** a page that **gives the template away**, plus the guide
- **Length target:** 1,000–1,400 words around a real downloadable artefact
- **Links to:** `/meal-prep-app`
- **Blocker:** needs an actual template file. A post about a template that has
  no template is the worst kind of SEO page. Build the artefact first.

| Secondary | Source |
|---|---|
| meal plan template google sheets | ✓ autocomplete |
| meal plan template printable | ✓ autocomplete |
| meal plan template free | ✓ autocomplete |
| meal plan template pdf | ✓ autocomplete |

---

### 17. `meal prep containers`

- **Seed:** `freezer meal prep` → autocomplete tail, 2026-07-26
- **Intent:** commercial, product
- **Format:** buyer guide
- **Status:** open, **weak fit.** We sell software, we have no affiliate
  programme, and every ranking page is monetised by one. A page here would be
  written to rank rather than to help. Recorded so nobody proposes it twice.

---

### 18. `sunday meal prep`

- **Seed:** `sunday meal prep` → autocomplete, 2026-07-26
- **Intent:** informational, ritual-shaped
- **Format:** routine guide, timeboxed
- **Length target:** 1,400–1,800 words
- **Links to:** `/meal-prep-app`
- **Boundary:** overlaps cluster 3 heavily. Write it only as *the two-hour
  Sunday*, i.e. a schedule, or fold it into cluster 3 as a section.

| Secondary | Source |
|---|---|
| sunday meal prep ideas | ✓ autocomplete |
| sunday meal prep for the week | ✓ autocomplete |
| sunday meal prep plan | ✓ autocomplete |

---

### 19. `meal prep for weight loss`

- **Seed:** `meal prep for` → autocomplete, first expansion, 2026-07-26
- **Intent:** informational, very high demand
- **Status:** open, **highest claim risk in this file.** PrepWise may not make
  outcome claims of any kind ([`voice.md`](./voice.md)): no "lose N lbs", no
  "guaranteed", nothing that reads as a promise. The only publishable version is
  about **planning mechanics** (portioning, protein, consistency) with the
  outcome question handed to a named authority and linked.
- If it cannot be written that way, do not write it. Ranking is not worth a
  claim we cannot make.

| Secondary | Source |
|---|---|
| meal prep for weight loss for beginners | (inferred) |
| how to meal plan for weight loss | ✓ autocomplete |
| meal prep ideas for the week weight loss | ✓ autocomplete |

---

### 20. `how to shop without a list`

- **Seed:** (inferred) — the inverse of cluster 4's tactics
- **Intent:** informational
- **Status:** open, **speculative.** No autocomplete evidence. Kept because it is
  the one contrarian angle in the set and it argues for the product's actual
  mechanic (the list is the gap, not the plan). Verify demand before writing.

---

### 21. `best meal planning app for iphone`

- **Intent:** commercial, comparison
- **Status:** open, **needs care.** Comparison pages rank, and this one would
  point at every use-case page at once. But
  [`opinions.md`](./opinions.md) rule 3 forbids attacking a named competitor, and
  [`on-page-checklist.md`](../seo/on-page-checklist.md) forbids linking a
  competitor's App Store listing as a citation. A comparison that criticises the
  *approach* rather than the company is publishable. One that ranks by being
  rude is not.
- **Also:** it would compete with the home page's `ai meal planner` unless the
  primary keeps `for iphone` in it.

---

### 22. `what can i make with chicken breast`

- **Seed:** `what can i make with` → autocomplete, 2026-07-26 (the whole first
  page of tails is single ingredients: ground beef, chicken breast, ground
  turkey, rotisserie chicken)
- **Intent:** informational, enormous demand
- **Status:** open, **weak fit.** These are recipe queries and the SERP is
  recipe sites with photographs of food. PrepWise is not a recipe publisher and
  cannot win a page whose ranking factor is fifty original photographs.
- Recorded because the pattern matters: **the single-ingredient tail is where
  the volume is, and it is the part of this category we are structurally worst
  at.** If that changes, this is the door.

---

## Coverage, honestly

- 22 clusters. 6 consumed. 16 open.
- **11** are blocked or downgraded by something real: a missing artefact
  (16), a number we do not have (15), a claim we may not make (19, 12), a format
  we cannot produce (22, 17), an intent mismatch (14), an unverified seed (20),
  or an overlap with an existing page (18, 8/9 with each other).
- Recording those with their reason is the point. An unfiltered list of 40
  keywords would look like more coverage and be worth less.
