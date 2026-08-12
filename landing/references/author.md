# Author — Trent Gavron

> The byline for all PrepWise content. This file is the source for the author
> card on every post, the `Person` schema in JSON-LD, and the author page when
> it ships.
>
> **Status: DRAFT by ARCHITECT, 2026-07-26.** Everything marked
> `TODO(trent: confirm)` is a credential ARCHITECT has no source for and must
> not guess at. E-E-A-T is the one place where an invented credential is not
> just embarrassing, it is the exact signal Google's quality raters are looking
> for.

---

## Confirmed facts

Verified from real sources on 2026-07-26.

| Field | Value | Source |
|---|---|---|
| Name | Trent Gavron | App Store seller history; `git config user.name` |
| Role | Founder, PrepWise LLC | App Store publisher record |
| Builds | PrepWise, iOS meal planner and pantry tracker | App Store ID 6754949361 |
| Shipped | June 17, 2026 | App Store first-release date |
| Site | https://www.prepwise-app.com | `landing/src/lib/constants.ts` |
| Contact | support@prepwise-app.com | same |

---

## Bio, byline — APPROVED

**Approved verbatim by Trent, 2026-08-11.** This is the sentence rendered in the
author card under every blog post and serialized into `Person.description` in the
JSON-LD. The two must stay byte-identical.

> Founder of PrepWise LLC, the team bringing you the PrepWise App.

Deliberately shorter than the drafts below, and deliberately free of
credentials. It says the one thing that is checkable from the App Store
publisher record and stops. When the `TODO(trent: confirm)` items further down
are filled in, the E-E-A-T detail belongs on an `/about` page that this card can
then link to, not crammed back into three lines under a post.

Consumers, both of which must change together:

- `src/components/blog/AuthorCard.tsx` (visible text)
- `src/lib/schema.ts` -> `authorPerson.description` (JSON-LD)

---

## Bio, short (about 25 words) — for post bylines

**DRAFT:**

> Trent Gavron is the founder of PrepWise, an iPhone meal planner that plans
> around what is already in your pantry. He built it, and he cooks from it.

`TODO(trent: confirm)` — approve, or rewrite in your own words.

---

## Bio, medium (about 60 words) — for the author card under each post

**DRAFT:**

> Trent Gavron built PrepWise after getting tired of meal planners that assumed
> a shopping trip he had not made. PrepWise starts from the pantry instead:
> it tracks what is in the kitchen and works out what that adds up to tonight.
> He shipped it to the App Store in June 2026 and still writes every line of it.

`TODO(trent: confirm)` — two things to check:

1. The origin sentence is a **placeholder**, drawn from PrepWise's product
   positioning rather than from anything you have said. Replace it with the
   real reason (see [`stories.md`](./stories.md), Slot 1).
2. "still writes every line of it" — confirm this is accurate and that you want
   to say it publicly.

---

## Bio, long — for the author page

**DRAFT SKELETON. Do not publish until the `TODO`s are filled.**

> Trent Gavron is the founder of PrepWise LLC and the sole developer of
> PrepWise, an iOS meal planner and pantry tracker that launched on the App
> Store in June 2026.
>
> `TODO(trent: confirm)` — the origin. What made you build it (stories.md Slot 1).
>
> `TODO(trent: confirm)` — professional background. Years writing software?
> Field? Anything cooking-adjacent? This is the paragraph that carries E-E-A-T,
> and it has to be true and checkable.
>
> `TODO(trent: confirm)` — what qualifies you to write about meal planning
> specifically. "I have cooked from a plan every week for N years" is a real
> credential. Guessing at one is not.
>
> He writes about pantry-first meal planning at prepwise-app.com.

### What must NOT go in the bio

- Any nutrition, dietetics, or medical credential. There is none, and implying
  one crosses the same line as the banned claims in [`voice.md`](./voice.md).
- Any chef or culinary qualification.
- Employer or day-job details unless Trent explicitly wants them public.
- Invented years of experience, invented user counts, invented awards.

---

## Person schema (JSON-LD)

Emit this on every post that carries the byline, and on the author page. Do not
add a field the page does not visibly support.

```json
{
  "@type": "Person",
  "@id": "https://www.prepwise-app.com/about#trent",
  "name": "Trent Gavron",
  "jobTitle": "Founder",
  "worksFor": { "@id": "https://www.prepwise-app.com/#organization" },
  "url": "https://www.prepwise-app.com/about",
  "description": "<the short bio above, once approved>"
}
```

Notes:

- `@id` must stay stable forever once published. It is what links every
  `Article.author` to one identity.
- `worksFor` points at the existing `Organization` node in
  `landing/src/app/layout.tsx`. Do not declare a second Organization.
- **`sameAs`** (personal profiles: LinkedIn, X, GitHub):
  `TODO(trent: confirm)` — which, if any, you want linked from the site. This
  is the strongest single E-E-A-T signal available and also the most personal.
  Leave the field out entirely rather than pointing it at a placeholder.
- **`image`** (author headshot): `TODO(trent: confirm)` — needed for the author
  card. No photo means no `image` field; do not substitute the logo.

---

## Author page

Not built yet. When it ships:

- URL: `/about` (add it to `SITE_ROUTES` in `landing/src/lib/constants.ts` so
  the generated sitemap picks it up).
- Every post byline links to it.
- It carries the long bio, the `Person` schema above, and the real story from
  `stories.md` Slot 1.
