// JSON-LD builders for the pages that need more than the sitewide graph in
// layout.tsx (Organization + WebSite + MobileApplication).
//
// Every node here references the sitewide nodes by @id rather than redeclaring
// them, so the whole site is ONE identity to a crawler instead of a new
// Organization per page.

import { withCampaignToken } from "@/lib/analytics";
import {
  APP_STORE_URL,
  SITE_DESCRIPTION,
  SITE_URL,
  SOCIAL_LINKS,
} from "@/lib/constants";
import type { BlogPost } from "@/lib/blog";
import type { UseCasePage } from "@/lib/usecase";

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

// The two other sitewide nodes. Referenced by @id from per-page nodes so the
// whole site stays ONE identity and ONE product to a crawler, rather than a
// second Organization and a second app per page.
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const APP_ID = `${SITE_URL}/#app`;

// --- the sitewide nodes -----------------------------------------------------
//
// These used to be built in app/layout.tsx and emitted in their own script tag
// on every page. They moved here so the app node can take the PAGE's App Store
// campaign token: the root layout has no dynamic segment and therefore cannot
// know which page is rendering, so a node built there can only ever carry the
// sitewide default. See appNode() for why that mattered.

const organizationNode = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "PrepWise",
  legalName: "PrepWise LLC",
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/logo.svg`,
  sameAs: [SOCIAL_LINKS.instagram, SOCIAL_LINKS.tiktok, SOCIAL_LINKS.twitter],
} as const;

const webSiteNode = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: "PrepWise",
  url: `${SITE_URL}/`,
  description: SITE_DESCRIPTION,
  inLanguage: "en-US",
  publisher: { "@id": ORGANIZATION_ID },
} as const;

/**
 * The product node.
 *
 * `installUrl` / `downloadUrl` are the MACHINE-READABLE copy of the same App
 * Store link the page renders, and they must carry the SAME campaign token.
 * They did not until 2026-07-27: the node was built once in layout.tsx with the
 * sitewide default, so /meal-prep-app rendered three anchors with
 * `ct=lp_meal_prep_app` and one JSON-LD node advertising the sitewide token for
 * the identical action. Both links work and nothing errors, so the split is
 * invisible; the only symptom is an install sourced from a search result
 * landing in the generic bucket instead of the page that earned it.
 *
 * `ct` is the join key into App Store Connect, so one page must emit exactly
 * one token. `pageCt` is omitted only for pages that genuinely have none (the
 * home page, /blog, the legal pages), which then fall back to the default token
 * already baked into APP_STORE_URL — the same token their anchors carry.
 *
 * NOTE: no `aggregateRating`, deliberately. Google requires review markup to
 * reflect ratings actually shown on the page, and inventing one is a
 * manual-action risk, not a shortcut worth taking.
 */
export function appNode(pageCt?: string) {
  const storeUrl = withCampaignToken(APP_STORE_URL, pageCt);
  return {
    "@type": "MobileApplication",
    "@id": APP_ID,
    name: "PrepWise",
    description: SITE_DESCRIPTION,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "iOS",
    url: `${SITE_URL}/`,
    installUrl: storeUrl,
    downloadUrl: storeUrl,
    screenshot: `${SITE_URL}/og-image.png`,
    publisher: { "@id": ORGANIZATION_ID },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };
}

/**
 * The author identity. `@id` is fixed by references/author.md and must stay
 * stable forever: it is what ties every Article.author to one person.
 *
 * Deliberately minimal. `url`, `image`, and `sameAs` are omitted because the
 * /about page, a headshot, and the profile links do not exist yet, and the
 * checklist's rule is that a schema field must be backed by something the page
 * actually supports. The description uses only the CONFIRMED facts in
 * references/author.md, not its draft bios, which are still awaiting Trent.
 */
export const PERSON_ID = `${SITE_URL}/about#trent`;

export const authorPerson = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Trent Gavron",
  jobTitle: "Founder",
  worksFor: { "@id": ORGANIZATION_ID },
  description:
    "Founder of PrepWise LLC. He built PrepWise, an iPhone meal planner and pantry tracker, and shipped it to the App Store in June 2026.",
} as const;

export type Crumb = { name: string; path: string };

/** `path` is site-relative, e.g. "/blog". The last crumb is the current page. */
export function breadcrumbList(crumbs: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${crumb.path}`,
    })),
  };
}

export function articleJsonLd(post: BlogPost) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.h1,
    name: post.title,
    description: post.description,
    image: `${SITE_URL}${post.hero.src}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    inLanguage: "en-US",
    author: { "@id": PERSON_ID },
    publisher: { "@id": ORGANIZATION_ID },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: [post.primaryKeyword, ...post.secondaryKeywords].join(", "),
  };
}

/**
 * A use-case landing page.
 *
 * `about` points at the sitewide MobileApplication node by @id rather than
 * redeclaring a SoftwareApplication per page: four pages each declaring their
 * own copy of the app is four products to a crawler, and the whole reason the
 * sitewide graph carries an @id is so a page can reference it instead.
 *
 * No FAQPage node, deliberately, even though the page renders questions. /faq
 * owns the site's single FAQPage and this page links to it; see
 * seo/on-page-checklist.md -> "FAQ SECTION".
 */
export function jsonLdForUseCase(page: UseCasePage) {
  const url = `${SITE_URL}/${page.slug}`;
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: page.title,
    description: page.description,
    inLanguage: "en-US",
    dateModified: page.updatedAt,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": APP_ID },
    primaryImageOfPage: `${SITE_URL}${page.screenshot.src}`,
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/**
 * Wrap a set of nodes in one @graph. One script tag per page, one graph.
 *
 * NOT exported: a page calling this directly would ship a graph with no
 * Organization, no WebSite and no app node, which is the shape the sitewide
 * nodes moved out of layout.tsx to prevent. `siteGraph()` is the entry point.
 */
function graph(nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

/**
 * The whole graph for one page: the three sitewide nodes plus whatever this
 * page adds. EVERY page calls this — Organization and WebSite are required on
 * every page by scripts/verify-seo.mjs, so a page that forgets fails the build
 * rather than shipping a thinner graph than its neighbours.
 *
 * @param pageCt the page's App Store campaign token, or undefined for a page
 *   that has none and should use the sitewide default. Whatever is passed here
 *   MUST be the same token the page's rendered App Store links carry;
 *   verify-seo.mjs enumerates both and fails the build when they disagree.
 */
export function siteGraph(pageCt: string | undefined, nodes: object[] = []) {
  return graph([organizationNode, webSiteNode, appNode(pageCt), ...nodes]);
}
