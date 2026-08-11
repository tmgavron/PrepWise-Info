#!/usr/bin/env node
//
// verify-seo.mjs — on-page SEO build gate for prepwise-app.com.
//
//   node scripts/verify-seo.mjs              # check landing/out/
//   node scripts/verify-seo.mjs --dir <path> # check some other export
//   node scripts/verify-seo.mjs --json       # machine-readable report
//   node scripts/verify-seo.mjs --self-test  # fixtures that must pass / must fail
//
// Exit codes:
//   0  every page passed
//   1  at least one page failed a required check   -> the deploy must not run
//   2  the check could not be performed at all (no out/, no HTML, unreadable
//      SITE_URL). Deliberately NOT 0: "I could not tell" must never read as
//      "clean". This is the same reason scripts/verify-live-routing.sh exists
//      at all -- a green step that checked nothing is worse than a red one.
//
// WHY THIS EXISTS
//
// Every check below fails SILENTLY in production. A 40-character title, a
// missing canonical, a JSON-LD block with a trailing comma, an <img> with no
// alt: nothing errors, nothing 500s, the deploy is green, and the page just
// quietly underperforms for months. The only way to notice is to look, and
// nobody looks at every page on every deploy. So the build looks instead.
//
// The checklist this enforces is landing/seo/on-page-checklist.md. Items marked
// [GATE] there are the ones implemented here. Anything needing judgement stays
// a human check and is deliberately NOT approximated by a regex.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const LANDING_ROOT = path.resolve(HERE, "..");

// --- the bar ----------------------------------------------------------------

const TITLE_MIN = 50;
const TITLE_MAX = 60;
const DESC_MIN = 150;
const DESC_MAX = 160;

// prepwise.app belongs to an unrelated exam-prep company. Until 2026-07-26 the
// deployed robots.txt pointed crawlers at their sitemap. It must never appear
// in a canonical, a link, or body copy again. See CLAUDE.md -> "Domain and
// canonical host".
//
// The dot is escaped and \b terminates the match, so this does NOT fire on our
// own www.prepwise-app.com (hyphen, not dot) or on the word "application".
// A self-test case pins exactly that, because an over-eager version of this
// rule would fail every page on the site and get deleted rather than fixed.
const FORBIDDEN_DOMAIN = /prepwise\.app\b/i;

// Pages that are not indexable and have no keyword to rank for. Checking a 404
// against a 50-60 char title bar produces a failure nobody can act on.
const EXEMPT = /(^|\/)(404|_not-found)(\.html|\/index\.html)$/;

// A Google Search Console verification file dropped into landing/public/ lands
// in the export as a top-level google<token>.html. It must NOT ship that way,
// and the reason is invisible from here: Cloudflare's asset binding redirects
// `/x.html` to `/x` (verified live: /404.html -> 307 -> /404), and GSC's
// HTML-file check does not follow redirects. The file would be deployed, look
// present in the repo, and the property would simply never verify.
//
// The token is served from worker/index.js instead, which answers before both
// the apex redirect and the assets. Kept in lockstep with
// GOOGLE_VERIFICATION_RE there. See landing/seo/search-console-setup.md.
const GSC_ASSET = /(^|\/)google[a-z0-9]{6,}\.html$/i;

// schema.org subtypes we accept for each requirement. MobileApplication is a
// subclass of SoftwareApplication; either satisfies the app requirement.
const SCHEMA_ALIASES = {
  App: ["SoftwareApplication", "MobileApplication", "WebApplication"],
  Article: ["Article", "BlogPosting", "NewsArticle", "TechArticle"],
  Organization: ["Organization", "Corporation", "LocalBusiness"],
  WebSite: ["WebSite"],
  BreadcrumbList: ["BreadcrumbList"],
  FAQPage: ["FAQPage"],
};

// --- tiny HTML helpers ------------------------------------------------------
// Regex, not a parser, on purpose: this runs on every build and must not add a
// dependency to the deploy path. Everything it reads (meta tags, <title>,
// <link>, script blocks) is emitted by Next in a predictable shape.

const NAMED_ENTITIES = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  ndash: "–", mdash: "—", hellip: "…", rsquo: "’",
  lsquo: "‘", ldquo: "“", rdquo: "”", middot: "·",
};

/**
 * Decode HTML entities before measuring anything.
 *
 * This is load-bearing, not cosmetic: `&amp;` is FIVE characters in the source
 * and ONE character to Google. Measuring the raw HTML would report the site's
 * own title as 43 characters when it is 39, and every "&" in a title would
 * silently buy four characters of slack against the 60-char ceiling.
 */
export function decodeEntities(s) {
  if (!s) return "";
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&([a-z]+);/gi, (m, name) => NAMED_ENTITIES[name.toLowerCase()] ?? m);
}

function attrs(tag) {
  const out = {};
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+))/g;
  let m;
  while ((m = re.exec(tag)) !== null) {
    out[m[1].toLowerCase()] = decodeEntities(m[3] ?? m[4] ?? m[5] ?? "");
  }
  return out;
}

function tagsOf(html, name) {
  return html.match(new RegExp(`<${name}\\b[^>]*>`, "gi")) || [];
}

/** name/property -> content, for every <meta> on the page. */
function metaMap(html) {
  const out = {};
  for (const tag of tagsOf(html, "meta")) {
    const a = attrs(tag);
    // React renders `charSet` literally; attribute names are case-insensitive
    // in HTML and `attrs()` lowercases them, so this catches both spellings.
    if ("charset" in a) out.charset = a.charset;
    const key = (a.name || a.property || "").toLowerCase();
    if (key) out[key] = a.content ?? "";
  }
  return out;
}

function jsonLdBlocks(html) {
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const out = [];
  let m;
  while ((m = re.exec(html)) !== null) out.push(m[1]);
  return out;
}

/** Every @type on the page, flattened out of @graph and arrays. */
function schemaTypes(html) {
  const types = [];
  const errors = [];
  for (const raw of jsonLdBlocks(html)) {
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      errors.push(err.message);
      continue;
    }
    const walk = (node) => {
      if (Array.isArray(node)) return node.forEach(walk);
      if (!node || typeof node !== "object") return;
      const t = node["@type"];
      if (typeof t === "string") types.push(t);
      else if (Array.isArray(t)) types.push(...t.filter((x) => typeof x === "string"));
      if (Array.isArray(node["@graph"])) node["@graph"].forEach(walk);
      // mainEntity carries the FAQ questions; itemListElement the breadcrumbs.
      for (const key of ["mainEntity", "itemListElement", "hasPart"]) {
        if (node[key]) walk(node[key]);
      }
    };
    walk(parsed);
  }
  return { types, errors };
}

/**
 * EVERY App Store URL on the page, from the markup AND from the JSON-LD.
 *
 * The distinction is the whole point. A page's App Store links are its anchors
 * AND the `installUrl` / `downloadUrl` of its SoftwareApplication node, and the
 * second set is exactly as real as the first: it is what a search engine reads
 * to offer the download. Until 2026-07-27 the two carried different campaign
 * tokens on five pages, because the app node was built once in the root layout
 * with the sitewide default while the anchors carried the page's own token.
 * Nothing errored, both links worked, and installs sourced from the schema
 * landed in the generic bucket instead of the page that earned them.
 *
 * Scanned with one regex over the whole HTML rather than per-surface parsing:
 * an App Store URL is unambiguous wherever it appears, and a check that
 * enumerated only the surfaces we thought of is how the second copy went
 * unnoticed in the first place.
 *
 * TWO escapings have to be undone first, and BOTH are load-bearing:
 *   - `&amp;ct=` in an href attribute (HTML entity)
 *   - `&ct=` in the RSC flight payload Next inlines as `self.__next_f.push`
 *     (JS string escape)
 * The second is why this is not a two-line function. A backslash terminates the
 * URL match, so without unescaping, every page reports a phantom extra link
 * truncated at `?pt=...` with NO ct at all — and the consistency check below
 * would then fail every page on the site, correct ones included. Measured
 * against the real export: 2 of the 7 App Store URLs on the home page are that
 * shape.
 */
export function appStoreUrls(html) {
  const normalized = html.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );
  const out = [];
  const re = /https?:\/\/apps\.apple\.com[^\s"'<>\\)]+/gi;
  let m;
  while ((m = re.exec(normalized)) !== null) out.push(decodeEntities(m[0]));
  return out;
}

/** The `ct` campaign token on an App Store URL, or null if it has none. */
export function campaignTokenOf(url) {
  try {
    return new URL(url).searchParams.get("ct");
  } catch {
    return null;
  }
}

/** The distinct campaign tokens across every App Store URL on the page. */
export function campaignTokensOn(html) {
  return [...new Set(appStoreUrls(html).map(campaignTokenOf))];
}

/**
 * The words `references/voice.md` bans outright from user-facing copy.
 *
 * This was an honour-system checklist item until 2026-07-26, when two of the
 * six posts in the S4 batch shipped a drafted `unlock` and `leverage` that a
 * grep caught and three careful re-reads did not. That is the definition of a
 * check that belongs in the gate: decidable from the built HTML, no judgement
 * required. The rest of voice.md (rhythm, honesty, whether a sentence would
 * read identically for a competitor) still needs a human and stays a checklist
 * item.
 *
 * Only the unambiguous SaaS-vocabulary half of the list is enforced here.
 * Deliberately NOT included: the banned CLAIMS (cure, treat, diagnose, FDA
 * approved), because those are already enforced in code on the ad and script
 * side (`content-lab/lib/brand-guardrail.js` PROHIBITED_PHRASES) and several of
 * them are legitimate words in a sentence that reports the ban. A page must be
 * able to say what it does not claim.
 *
 * Matched on VISIBLE TEXT only, so a class name, a URL, an inlined script or a
 * JSON-LD blob cannot trip it. Verified clean across all 16 exported pages on
 * the day it was added, so it is a floor rather than a migration.
 */
export const BANNED_COPY_TERMS = [
  "unlock", "leverage", "seamless", "seamlessly", "effortless", "effortlessly",
  "game-changer", "game changer", "empower", "synergy", "cutting-edge",
  "world-class", "best-in-class", "revolutionize", "revolutionise",
  "comprehensive", "holistic", "utilize", "utilise",
];

/**
 * Body text as a reader sees it: scripts, styles, JSON-LD and every tag
 * removed, entities decoded. Attribute values are dropped with their tags,
 * which is what keeps a URL or a CSS class out of the copy checks.
 */
export function visibleText(html) {
  const body = (html.match(/<body[^>]*>([\s\S]*)<\/body>/i) || [, html])[1];
  return decodeEntities(
    body
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<[^>]*>/g, " ")
  ).replace(/\s+/g, " ").trim();
}

/** Banned terms present in the visible copy, lowercased and deduped. */
export function bannedCopyTerms(html) {
  const text = visibleText(html).toLowerCase();
  return BANNED_COPY_TERMS.filter((term) => {
    // Word-bounded so "unlock" does not fire on "unlocked" only by accident of
    // substring: both are banned, but "utilise" must not fire inside a longer
    // unrelated word, and a hyphenated term needs its own boundary handling.
    const escaped = term.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    return new RegExp(`(^|[^a-z])${escaped}[a-z]*([^a-z]|$)`).test(text);
  });
}

function headingTexts(html) {
  const out = [];
  const re = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    out.push(decodeEntities(m[2].replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim());
  }
  return out;
}

/**
 * A 1x1 hidden analytics beacon (the Meta Pixel `<noscript>` fallback). It is
 * the textbook decorative image, and warning about it on every single build
 * would train everyone to ignore this tool's output.
 */
function isTrackingPixel(a) {
  return a.width === "1" && a.height === "1";
}

/** True when the page visibly renders an FAQ section. */
export function hasFaqSection(html) {
  return headingTexts(html).some((t) =>
    /^faqs?$/i.test(t) || /frequently asked questions/i.test(t)
  );
}

/**
 * True when the page links to the canonical FAQ page.
 *
 * This is what lets a page render an FAQ EXCERPT without carrying FAQPage
 * schema. The rule the site follows is "one FAQPage per site, owned by /faq";
 * a page that shows a few questions and points at the owner is correct, and a
 * page that shows questions and points nowhere is an orphaned answer block.
 * The other half of the rule (nobody else may declare FAQPage) is enforced
 * across pages in run().
 */
export function linksToFaqPage(html) {
  return /href=["'](?:https?:\/\/[^"']*)?\/faq(?:[/#?"']|["'])/i.test(html);
}

// --- page classification ----------------------------------------------------

/**
 * @param {string} rel path relative to the export root, POSIX separators.
 * @param {string[]} [knownSlugs] slugs from content/pages/. A use-case page is
 *   a TOP-LEVEL html file, indistinguishable from any other by path alone, so
 *   the registry is what tells them apart. Defaults to none, which keeps the
 *   old two-argument-free behaviour for every existing caller and test.
 * @returns {"exempt"|"home"|"faq"|"blog-index"|"article"|"legal"|"use-case"|"page"}
 */
export function classifyPage(rel, knownSlugs = []) {
  const p = rel.replace(/^\.?\//, "");
  if (EXEMPT.test("/" + p)) return "exempt";
  if (/^faq(\.html|\/index\.html)$/.test(p)) return "faq";
  for (const slug of knownSlugs) {
    if (p === `${slug}.html` || p === `${slug}/index.html`) return "use-case";
  }
  // Matched BEFORE the /^blog\// article rule so the index is never graded
  // against the Article requirements. Both filename shapes are handled because
  // which one Next emits depends on `trailingSlash`, and a change to that
  // setting must not silently reclassify two pages.
  if (/^blog(\.html|\/index\.html)$/.test(p)) return "blog-index";
  if (/^blog\//.test(p)) return "article";
  if (/^(privacy|terms)(\.html|\/index\.html)$/.test(p)) return "legal";
  if (p === "index.html") return "home";
  return "page";
}

// --- the checks -------------------------------------------------------------

const err = (code, message) => ({ level: "error", code, message });
const warn = (code, message) => ({ level: "warn", code, message });

/**
 * @returns {Array<{level:"error"|"warn", code:string, message:string}>}
 */
export function checkPage({ rel, html, type, siteUrl }) {
  const findings = [];
  if (type === "exempt") return findings;

  const meta = metaMap(html);

  // -- HEAD / METADATA
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!titleMatch) {
    findings.push(err("title-missing", "no <title> tag"));
  } else {
    const title = decodeEntities(titleMatch[1]).trim();
    if (title.length < TITLE_MIN || title.length > TITLE_MAX) {
      findings.push(err(
        "title-length",
        `title is ${title.length} chars, need ${TITLE_MIN}-${TITLE_MAX}: "${title}"`
      ));
    }
  }

  const desc = (meta["description"] || "").trim();
  if (!desc) {
    findings.push(err("description-missing", "no meta description"));
  } else if (desc.length < DESC_MIN || desc.length > DESC_MAX) {
    findings.push(err(
      "description-length",
      `meta description is ${desc.length} chars, need ${DESC_MIN}-${DESC_MAX}`
    ));
  }

  const canonicals = tagsOf(html, "link")
    .map(attrs)
    .filter((a) => (a.rel || "").toLowerCase() === "canonical")
    .map((a) => a.href || "");
  if (canonicals.length === 0) {
    findings.push(err("canonical-missing", "no <link rel=canonical>"));
  } else if (canonicals.length > 1) {
    findings.push(err("canonical-duplicate", `${canonicals.length} canonical links`));
  } else if (!canonicals[0].startsWith(siteUrl)) {
    findings.push(err(
      "canonical-host",
      `canonical "${canonicals[0]}" is not on ${siteUrl}`
    ));
  }

  for (const [key, code] of [
    ["og:title", "og-title"],
    ["og:description", "og-description"],
    ["og:image", "og-image"],
    ["og:url", "og-url"],
    ["og:type", "og-type"],
    ["twitter:card", "twitter-card"],
  ]) {
    if (!meta[key]) findings.push(err(code, `missing ${key}`));
  }
  if (meta["twitter:card"] && meta["twitter:card"] !== "summary_large_image") {
    findings.push(err(
      "twitter-card-type",
      `twitter:card is "${meta["twitter:card"]}", expected summary_large_image`
    ));
  }

  if (!/<html[^>]*\slang=/i.test(html)) findings.push(err("html-lang", "<html> has no lang attribute"));
  if (!meta["viewport"]) findings.push(err("viewport", "no viewport meta tag"));
  if (!("charset" in meta)) findings.push(err("charset", "no charset meta tag"));

  // -- HEADINGS
  const h1s = (html.match(/<h1\b[^>]*>/gi) || []).length;
  if (h1s !== 1) findings.push(err("h1-count", `${h1s} <h1> tags, expected exactly 1`));

  // -- IMAGES
  let decorative = 0;
  for (const tag of tagsOf(html, "img")) {
    const a = attrs(tag);
    if (!("alt" in a)) {
      const src = a.src || "(no src)";
      findings.push(err("img-alt", `<img> with no alt attribute: ${src}`));
    } else if (a.alt.trim() === "" && !isTrackingPixel(a)) {
      // alt="" is CORRECT for a purely decorative image, so this is a warning
      // and not a failure. It is still reported, because "decorative" has to be
      // a decision someone made rather than an alt attribute someone forgot.
      decorative += 1;
    }
  }
  if (decorative) {
    findings.push(warn(
      "img-alt-empty",
      `${decorative} image(s) with alt="" (valid only if purely decorative)`
    ));
  }

  // -- SCHEMA
  const { types, errors } = schemaTypes(html);
  for (const e of errors) findings.push(err("jsonld-parse", `JSON-LD does not parse: ${e}`));

  const has = (group) => SCHEMA_ALIASES[group].some((t) => types.includes(t));
  const required = ["Organization", "WebSite"];
  if (type === "home") required.push("App");
  if (type === "article") required.push("Article", "BreadcrumbList");
  if (type === "faq") required.push("FAQPage", "BreadcrumbList");
  if (type === "blog-index") required.push("BreadcrumbList");
  // A use-case page requires the app node too: it is a product page, and the
  // sitewide graph in layout.tsx is what it references by @id rather than
  // declaring a second copy of the product per landing page.
  if (type === "use-case") required.push("App", "BreadcrumbList");
  for (const group of required) {
    if (!has(group)) {
      findings.push(err(
        "schema-missing",
        `no ${SCHEMA_ALIASES[group].join("/")} in JSON-LD (required for ${type} pages)`
      ));
    }
  }
  // An FAQ section either OWNS the schema or POINTS AT the page that does.
  // See linksToFaqPage() for why the second branch is a rule and not a loophole.
  if (hasFaqSection(html) && !has("FAQPage") && !linksToFaqPage(html)) {
    findings.push(err(
      "schema-faq",
      "page renders an FAQ section with no FAQPage JSON-LD and no link to /faq"
    ));
  }

  // -- APP STORE CTA
  // PrepWise has no phone number and no premises; the App Store click is the
  // conversion event, which is why this replaces the source checklist's
  // click-to-call / NAP items.
  if (type === "home" || type === "article" || type === "faq" || type === "use-case") {
    if (!/apps\.apple\.com/i.test(html)) {
      findings.push(err("appstore-cta", "no App Store link on the page"));
    }
  }

  // -- BANNED COPY VOCABULARY (references/voice.md)
  //
  // LEGAL pages are exempt, for the same reason the checklist exempts them from
  // the CTA and FAQ requirements: they are a different register with a
  // different author. "auto-renewing subscription plans that unlock premium
  // features" in /terms is standard App Store subscription language, not
  // marketing copy dressed up, and rewriting legal boilerplate to satisfy a
  // voice rule would be the tail wagging the dog.
  const banned = type === "legal" ? [] : bannedCopyTerms(html);
  if (banned.length) {
    findings.push(err(
      "banned-copy",
      `visible copy uses ${banned.map((t) => `"${t}"`).join(", ")}, banned by ` +
        "references/voice.md. Rewrite the sentence; do not work around it"
    ));
  }

  // ONE PAGE, ONE CAMPAIGN TOKEN.
  //
  // `ct` is the join key into App Store Connect, so a page emitting two of them
  // splits its own installs across two rows. This is the EXHAUSTIVE form of the
  // per-page token check: the use-case check below asserts the expected token
  // REACHED the page, which a single correct anchor satisfies and which
  // therefore cannot see a second App Store URL carrying a different one. That
  // is precisely the shape that shipped — three correct anchors beside a
  // JSON-LD installUrl advertising the sitewide default.
  //
  // It needs no registry and no expected value, so it covers the pages whose
  // token is a literal in the page source (/faq) and the ones that legitimately
  // use the default (/ and /blog) as well as the ones with a registry entry.
  const tokens = campaignTokensOn(html);
  if (tokens.length > 1) {
    const urls = appStoreUrls(html);
    findings.push(err(
      "appstore-ct-inconsistent",
      `page emits ${urls.length} App Store link(s) carrying ${tokens.length} different campaign tokens ` +
      `(${tokens.map((t) => (t === null ? "(no ct)" : `"${t}"`)).join(", ")}); ` +
      "installs from this page would split across that many App Store Connect rows"
    ));
  }

  // -- WRONG DOMAIN
  if (FORBIDDEN_DOMAIN.test(html)) {
    findings.push(err(
      "wrong-domain",
      'page references "prepwise.app", which is NOT our domain (ours is prepwise-app.com)'
    ));
  }

  return findings.map((f) => ({ ...f, page: rel }));
}

// --- runner -----------------------------------------------------------------

function readSiteUrl() {
  // One source of truth. If constants.ts moves or the export is renamed we want
  // a loud exit-2, not a check silently graded against a stale literal.
  const file = path.join(LANDING_ROOT, "src", "lib", "constants.ts");
  const src = fs.readFileSync(file, "utf8");
  const m = src.match(/export\s+const\s+SITE_URL\s*=\s*["']([^"']+)["']/);
  if (!m) throw new Error(`could not read SITE_URL from ${file}`);
  return m[1].replace(/\/+$/, "");
}

/**
 * The blog registry drift check.
 *
 * `content/blog/index.ts` is a hand-maintained list of posts. A hand-maintained
 * list is fine only next to something that notices when it drifts: a post file
 * that nobody imported is a page that silently never ships, and nothing else in
 * the build reports it (the file compiles, the site builds, the deploy is
 * green, the post does not exist).
 *
 * Also asserts the App Store campaign token stays inside App Store Connect's
 * 40-character limit. `sanitizeCt()` truncates SILENTLY, so a long slug would
 * produce a token that no longer joins an install back to the post that earned
 * it, with no error anywhere.
 *
 * @returns {Array} findings, empty when there is no blog at all.
 */
export function checkBlogRegistry(outDir, landingRoot = LANDING_ROOT) {
  const dir = path.join(landingRoot, "content", "blog");
  if (!fs.existsSync(dir)) return [];

  const findings = [];
  const page = "content/blog/index.ts";
  const indexPath = path.join(dir, "index.ts");
  if (!fs.existsSync(indexPath)) {
    return [{ ...err("blog-registry-missing", "content/blog/ exists but has no index.ts"), page }];
  }
  const indexSrc = fs.readFileSync(indexPath, "utf8");

  const postFiles = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".ts") && f !== "index.ts");

  for (const file of postFiles) {
    const base = file.replace(/\.ts$/, "");
    if (!new RegExp(`["'\`]\\./${base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'\`]`).test(indexSrc)) {
      findings.push({
        ...err(
          "blog-post-unregistered",
          `content/blog/${file} is not imported by index.ts, so the post does not exist on the site`
        ),
        page,
      });
      continue;
    }

    const src = fs.readFileSync(path.join(dir, file), "utf8");
    const slugMatch = src.match(/slug:\s*["']([^"']+)["']/);
    if (!slugMatch) {
      findings.push({ ...err("blog-post-no-slug", `content/blog/${file} declares no slug`), page });
      continue;
    }
    const slug = slugMatch[1];

    const ct = `blog-${slug}`;
    if (ct.length > 40) {
      findings.push({
        ...err(
          "blog-ct-too-long",
          `campaign token "${ct}" is ${ct.length} chars; App Store Connect truncates ct at 40 and the install stops joining back to the post`
        ),
        page,
      });
    }

    const builtPath = [
      path.join(outDir, "blog", `${slug}.html`),
      path.join(outDir, "blog", slug, "index.html"),
    ].find((p) => fs.existsSync(p));
    if (!builtPath) {
      findings.push({
        ...err(
          "blog-post-not-built",
          `post "${slug}" is registered but produced no HTML; check generateStaticParams`
        ),
        page,
      });
      continue;
    }

    // Same exhaustive rule the use-case pages get: every App Store URL on the
    // post, markup and JSON-LD alike, carries the post's own token.
    findings.push(...checkRenderedCampaignToken({
      html: fs.readFileSync(builtPath, "utf8"),
      expectedCt: ct,
      kind: "blog",
      label: `/blog/${slug}`,
      page: `blog/${slug}.html`,
    }));
  }

  return findings;
}

// --- use-case landing pages -------------------------------------------------

/** The slugs declared in content/pages/, read without importing TypeScript. */
export function listUseCaseSlugs(landingRoot = LANDING_ROOT) {
  const dir = path.join(landingRoot, "content", "pages");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".ts") && f !== "index.ts")
    .map((f) => {
      const src = fs.readFileSync(path.join(dir, f), "utf8");
      const m = src.match(/slug:\s*["']([^"']+)["']/);
      return m ? m[1] : null;
    })
    .filter(Boolean);
}

/**
 * Assert EVERY App Store URL on a built page carries `expectedCt`.
 *
 * Two findings, not one, because they are two different problems:
 *   - nothing carries it  -> the token never reached the page at all
 *   - something else does -> the page emits two tokens for the same action
 *
 * The second is the one a presence check cannot see. Skipped when the token is
 * over App Store Connect's 40-character ceiling: `sanitizeCt()` truncates
 * SILENTLY, so the rendered token legitimately differs from the declared one
 * and the *-ct-too-long finding already names the real problem.
 *
 * @param kind "usecase" | "blog", used as the finding-code prefix.
 */
function checkRenderedCampaignToken({ html, expectedCt, kind, label, page }) {
  if (expectedCt.length > 40) return [];

  const findings = [];
  const urls = appStoreUrls(html);
  const carrying = urls.filter((u) => campaignTokenOf(u) === expectedCt);
  const wrong = urls.filter((u) => campaignTokenOf(u) !== expectedCt);

  if (carrying.length === 0) {
    findings.push({
      ...err(
        `${kind}-ct-not-rendered`,
        `no App Store link on ${label} carries ct=${expectedCt} (found ${urls.length} link(s)); ` +
        "organic installs from this page would report under the sitewide default token"
      ),
      page,
    });
  }
  if (wrong.length) {
    const seen = [...new Set(wrong.map(campaignTokenOf))]
      .map((t) => (t === null ? "(no ct)" : `"${t}"`))
      .join(", ");
    findings.push({
      ...err(
        `${kind}-ct-mismatch`,
        `${wrong.length} of ${urls.length} App Store link(s) on ${label} carry ${seen} instead of ` +
        `"${expectedCt}". Both links work and nothing errors, so this is invisible: check the ` +
        "JSON-LD installUrl/downloadUrl, which is a real App Store link a crawler will offer"
      ),
      page,
    });
  }
  return findings;
}

/**
 * The use-case landing page drift check.
 *
 * Two things it asserts that nothing else can.
 *
 * 1. The registry. `content/pages/index.ts` is hand-maintained, exactly like the
 *    blog's, and a page file nobody imported is a page that silently never
 *    ships: the file compiles, the build is green, the URL 404s.
 *
 * 2. **The campaign token actually reached the rendered App Store link.**
 *    `src/lib/usecase.ts` asserts the token's SHAPE at build time, but it cannot
 *    know whether the template passed it through to the href. If a page is added
 *    without wiring `pageCt`, every organic install from it reports under the
 *    sitewide default token, the link still works, and there is no error
 *    anywhere - the only symptom is an App Store row that credits the wrong
 *    page, months later. One check guards the declaration, this one the artefact.
 *
 * @returns {Array} findings, empty when there are no use-case pages at all.
 */
export function checkUseCasePages(outDir, landingRoot = LANDING_ROOT) {
  const dir = path.join(landingRoot, "content", "pages");
  if (!fs.existsSync(dir)) return [];

  const findings = [];
  const page = "content/pages/index.ts";
  const indexPath = path.join(dir, "index.ts");
  if (!fs.existsSync(indexPath)) {
    return [{ ...err("usecase-registry-missing", "content/pages/ exists but has no index.ts"), page }];
  }
  const indexSrc = fs.readFileSync(indexPath, "utf8");

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".ts") && f !== "index.ts");
  const seenCt = new Map();

  for (const file of files) {
    const base = file.replace(/\.ts$/, "");
    if (!new RegExp(`["'\`]\\./${base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'\`]`).test(indexSrc)) {
      findings.push({
        ...err(
          "usecase-unregistered",
          `content/pages/${file} is not imported by index.ts, so the page does not exist on the site`
        ),
        page,
      });
      continue;
    }

    const src = fs.readFileSync(path.join(dir, file), "utf8");
    const slug = (src.match(/slug:\s*["']([^"']+)["']/) || [])[1];
    const ct = (src.match(/\bct:\s*["']([^"']+)["']/) || [])[1];
    if (!slug) {
      findings.push({ ...err("usecase-no-slug", `content/pages/${file} declares no slug`), page });
      continue;
    }
    if (!ct) {
      findings.push({
        ...err("usecase-no-ct", `content/pages/${file} declares no App Store campaign token (ct)`),
        page,
      });
      continue;
    }

    // Shape and ceiling. sanitizeCt() truncates at 40 SILENTLY, so a long token
    // yields an install row that no longer joins back to the page.
    if (!/^lp_[a-z0-9_]*[a-z0-9]$/.test(ct) || ct.includes("__")) {
      findings.push({
        ...err(
          "usecase-ct-shape",
          `campaign token "${ct}" must be lowercase lp_[a-z0-9_], no doubled or trailing underscore`
        ),
        page,
      });
    }
    if (ct.length > 40) {
      findings.push({
        ...err(
          "usecase-ct-too-long",
          `campaign token "${ct}" is ${ct.length} chars; App Store Connect truncates ct at 40 and the install stops joining back to the page`
        ),
        page,
      });
    }
    if (seenCt.has(ct)) {
      findings.push({
        ...err(
          "usecase-ct-duplicate",
          `pages "${seenCt.get(ct)}" and "${slug}" share the campaign token "${ct}"; their installs would merge into one App Store row`
        ),
        page,
      });
    }
    seenCt.set(ct, slug);

    const builtPath = [
      path.join(outDir, `${slug}.html`),
      path.join(outDir, slug, "index.html"),
    ].find((p) => fs.existsSync(p));
    if (!builtPath) {
      findings.push({
        ...err(
          "usecase-not-built",
          `page "${slug}" is registered but produced no HTML; check generateStaticParams`
        ),
        page,
      });
      continue;
    }

    findings.push(...checkRenderedCampaignToken({
      html: fs.readFileSync(builtPath, "utf8"),
      expectedCt: ct,
      kind: "usecase",
      label: `/${slug}`,
      page: `${slug}.html`,
    }));
  }

  return findings;
}

/**
 * A finding if `rel` is a Google Search Console verification file, else null.
 *
 * Not folded into classifyPage(): this is not a page type to grade leniently,
 * it is a file that must not exist in the export at all.
 */
export function gscVerificationFinding(rel) {
  if (!GSC_ASSET.test(rel)) return null;
  return {
    level: "error",
    code: "gsc-verification-asset",
    page: rel,
    message:
      `${rel} is a Google Search Console verification file in the static export. ` +
      "Cloudflare's asset binding redirects /x.html to /x and GSC does not follow " +
      "redirects, so this deploys green and the property never verifies. Delete it " +
      "from landing/public/ and add the filename to GOOGLE_VERIFICATION_FILES in " +
      "worker/index.js instead (see landing/seo/search-console-setup.md).",
  };
}

function htmlFiles(dir) {
  const out = [];
  const walk = (abs, rel) => {
    for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
      if (entry.name === "_next" || entry.name.startsWith(".")) continue;
      const childAbs = path.join(abs, entry.name);
      const childRel = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) walk(childAbs, childRel);
      else if (entry.name.endsWith(".html")) out.push(childRel);
    }
  };
  walk(dir, "");
  return out.sort();
}

function run(argv) {
  const dirArg = argv.indexOf("--dir");
  const outDir = dirArg !== -1 ? path.resolve(argv[dirArg + 1]) : path.join(LANDING_ROOT, "out");
  const asJson = argv.includes("--json");

  let siteUrl;
  try {
    siteUrl = readSiteUrl();
  } catch (e) {
    console.error(`verify-seo: ${e.message}`);
    return 2;
  }

  if (!fs.existsSync(outDir)) {
    console.error(`verify-seo: export directory not found: ${outDir}`);
    console.error("verify-seo: run `npm run build` first.");
    return 2;
  }

  const files = htmlFiles(outDir);
  if (files.length === 0) {
    // An empty corpus proves nothing. Reporting "0 violations" here would be a
    // green light earned by checking nothing at all.
    console.error(`verify-seo: no HTML files found in ${outDir}`);
    return 2;
  }

  const findings = [];
  const checked = [];
  const seenTitle = new Map();
  const seenDesc = new Map();
  const faqPages = [];
  const slugs = listUseCaseSlugs();

  for (const rel of files) {
    // Before classification: this file has no title, no canonical and no h1, so
    // grading it as a page buries the one actionable finding under eight
    // unactionable ones.
    const gsc = gscVerificationFinding(rel);
    if (gsc) {
      findings.push(gsc);
      continue;
    }
    const type = classifyPage(rel, slugs);
    const html = fs.readFileSync(path.join(outDir, rel), "utf8");
    if (type === "exempt") continue;
    checked.push({ rel, type });
    findings.push(...checkPage({ rel, html, type, siteUrl }));
    if (schemaTypes(html).types.includes("FAQPage")) faqPages.push(rel);

    // Cross-page duplicates. Two pages sharing a title or description are two
    // pages competing for the same query; Google picks one and the other
    // page's work is wasted. Same failure the used-keywords register exists to
    // prevent, caught here for the cases it slips past.
    const record = (map, value) => {
      if (!value) return;
      if (!map.has(value)) map.set(value, []);
      map.get(value).push(rel);
    };
    record(seenTitle, decodeEntities((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ""])[1]).trim());
    record(seenDesc, (metaMap(html).description || "").trim());
  }

  for (const [label, map, code] of [
    ["title", seenTitle, "title-duplicate"],
    ["meta description", seenDesc, "description-duplicate"],
  ]) {
    for (const [value, pages] of map) {
      if (pages.length > 1) {
        findings.push({
          level: "error",
          code,
          page: pages.join(", "),
          message: `${pages.length} pages share the same ${label}: "${value.slice(0, 60)}..."`,
        });
      }
    }
  }

  // ONE FAQPage per site. Two surfaces publishing the same answers as schema is
  // how Google ends up choosing one of them and discarding the other page's
  // work, which is the same failure the used-keywords register exists to
  // prevent. The dedicated /faq page owns it; everything else links to it.
  if (faqPages.length > 1) {
    findings.push({
      level: "error",
      code: "faqpage-duplicate",
      page: faqPages.join(", "),
      message:
        `${faqPages.length} pages declare FAQPage JSON-LD; exactly one page (/faq) may own it. ` +
        "An FAQ excerpt elsewhere links to /faq instead.",
    });
  }

  findings.push(...checkBlogRegistry(outDir));
  findings.push(...checkUseCasePages(outDir));

  const errors = findings.filter((f) => f.level === "error");
  const warnings = findings.filter((f) => f.level === "warn");

  if (asJson) {
    console.log(JSON.stringify({
      ok: errors.length === 0,
      outDir,
      siteUrl,
      pagesChecked: checked,
      skipped: files.filter((f) => classifyPage(f, slugs) === "exempt"),
      errors,
      warnings,
    }, null, 2));
    return errors.length === 0 ? 0 : 1;
  }

  const byPage = new Map();
  for (const f of findings) {
    if (!byPage.has(f.page)) byPage.set(f.page, []);
    byPage.get(f.page).push(f);
  }
  for (const [page, list] of byPage) {
    console.log(`\n  ${page}`);
    for (const f of list) {
      console.log(`    ${f.level === "error" ? "FAIL" : "warn"}  [${f.code}] ${f.message}`);
    }
  }

  const skipped = files.length - checked.length;
  console.log(
    `\nverify-seo: ${checked.length} page(s) checked` +
    (skipped ? `, ${skipped} skipped (error pages)` : "") +
    `, ${errors.length} error(s), ${warnings.length} warning(s)`
  );

  if (errors.length) {
    console.error(
      "\nverify-seo: FAILED. The deploy is blocked until these are fixed.\n" +
      "Checklist and rationale: landing/seo/on-page-checklist.md"
    );
    return 1;
  }
  console.log("verify-seo: ok");
  return 0;
}

// --- self-test --------------------------------------------------------------

function selfTest() {
  const SITE = "https://www.prepwise-app.com";
  let passed = 0;
  const failures = [];
  const check = (name, fn) => {
    try { fn(); passed += 1; } catch (e) { failures.push(`${name}: ${e.message}`); }
  };
  const assert = (cond, msg) => { if (!cond) throw new Error(msg); };

  // A page that satisfies every required check. Every failing fixture below is
  // this page with exactly ONE thing broken, so a test can only fail for the
  // reason it names.
  const GOOD_TITLE = "PrepWise: AI Meal Planner and Pantry Tracker for iPhone"; // 54
  const GOOD_DESC =
    "PrepWise plans your meals from the food already in your pantry, tracks " +
    "macros for every recipe, and writes the shopping list. Free on iPhone."; // 140 -> padded below
  const desc = (GOOD_DESC + " Try it today.").slice(0, 155);

  const goodPage = (over = {}) => {
    const o = {
      title: GOOD_TITLE,
      description: desc,
      canonical: `${SITE}/`,
      h1: "<h1>Meal planning that starts with your pantry</h1>",
      img: '<img src="/a.png" alt="PrepWise pantry screen"/>',
      jsonld: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          { "@type": "Organization", name: "PrepWise" },
          { "@type": "WebSite", name: "PrepWise" },
          { "@type": "MobileApplication", name: "PrepWise" },
        ],
      }),
      body: '<a href="https://apps.apple.com/app/apple-store/id6754949361">Download</a>',
      extraHead: "",
      ...over,
    };
    return `<!DOCTYPE html><html lang="en"><head><meta charSet="utf-8"/>` +
      `<meta name="viewport" content="width=device-width, initial-scale=1"/>` +
      `<title>${o.title}</title>` +
      `<meta name="description" content="${o.description}"/>` +
      `<link rel="canonical" href="${o.canonical}"/>` +
      `<meta property="og:title" content="${o.title}"/>` +
      `<meta property="og:description" content="${o.description}"/>` +
      `<meta property="og:image" content="${SITE}/og-image.png"/>` +
      `<meta property="og:url" content="${o.canonical}"/>` +
      `<meta property="og:type" content="website"/>` +
      `<meta name="twitter:card" content="summary_large_image"/>` +
      o.extraHead +
      `<script type="application/ld+json">${o.jsonld}</script>` +
      `</head><body>${o.h1}${o.img}${o.body}</body></html>`;
  };

  const run1 = (html, type = "home") =>
    checkPage({ rel: "index.html", html, type, siteUrl: SITE });
  const codes = (html, type) => run1(html, type).filter((f) => f.level === "error").map((f) => f.code);

  const APP_LINK = (ct) =>
    `<a href="https://apps.apple.com/app/apple-store/id6754949361?pt=128248695&amp;ct=${ct}&amp;mt=8">Download</a>`;

  // --- the fixture that MUST pass
  check("a compliant page produces no errors", () => {
    const found = codes(goodPage());
    assert(found.length === 0, `expected none, got ${JSON.stringify(found)}`);
  });

  check("title in the fixture really is within 50-60", () => {
    assert(GOOD_TITLE.length >= TITLE_MIN && GOOD_TITLE.length <= TITLE_MAX,
      `fixture title is ${GOOD_TITLE.length} chars`);
    assert(desc.length >= DESC_MIN && desc.length <= DESC_MAX,
      `fixture description is ${desc.length} chars`);
  });

  // --- fixtures that MUST fail, one broken thing each
  const mustFail = [
    ["title-length", goodPage({ title: "PrepWise" })],
    ["title-length", goodPage({ title: "P".repeat(61) })],
    ["description-length", goodPage({ description: "Too short." })],
    ["description-length", goodPage({ description: "x".repeat(161) })],
    ["canonical-missing", goodPage({ canonical: null }).replace(/<link rel="canonical"[^>]*>/, "")],
    ["canonical-host", goodPage({ canonical: "https://prepwise-app.com/" })],
    ["h1-count", goodPage({ h1: "" })],
    ["h1-count", goodPage({ h1: "<h1>One</h1><h1>Two</h1>" })],
    ["img-alt", goodPage({ img: '<img src="/no-alt.png"/>' })],
    ["jsonld-parse", goodPage({ jsonld: '{"@type": "Organization",}' })],
    ["schema-missing", goodPage({ jsonld: JSON.stringify({ "@type": "Organization" }) })],
    ["appstore-cta", goodPage({ body: "<p>no cta here</p>" })],
    ["wrong-domain", goodPage({ body: '<a href="https://prepwise.app/">oops</a>' })],
    ["og-image", goodPage().replace(/<meta property="og:image"[^>]*>/, "")],
    ["twitter-card", goodPage().replace(/<meta name="twitter:card"[^>]*>/, "")],
    ["html-lang", goodPage().replace('<html lang="en">', "<html>")],
    ["viewport", goodPage().replace(/<meta name="viewport"[^>]*>/, "")],
    ["charset", goodPage().replace(/<meta charSet="utf-8"\/>/, "")],
  ];
  for (const [code, html] of mustFail) {
    check(`fixture fails with ${code}`, () => {
      const found = codes(html);
      assert(found.includes(code), `expected ${code}, got ${JSON.stringify(found)}`);
    });
  }

  // --- the false-positive guard on the wrong-domain rule.
  // An over-eager version of this rule fires on our OWN host and fails every
  // page on the site, which gets the rule deleted instead of the bug fixed.
  check("our own www.prepwise-app.com does not trip the wrong-domain rule", () => {
    const html = goodPage({
      body: `<a href="${SITE}/privacy">Privacy</a><a href="https://prepwise-app.com/r/x">share</a>` +
            `<p>the PrepWise application is free</p>` +
            `<a href="https://apps.apple.com/app/apple-store/id6754949361">Download</a>`,
    });
    assert(!codes(html).includes("wrong-domain"), "false positive on our own domain");
  });

  // --- entity decoding is measured, not the raw source
  // --- banned copy vocabulary (references/voice.md)
  check("a banned word in visible copy is an error", () => {
    const found = codes(goodPage({
      body: "<p>This unlocks your week.</p>" +
        '<a href="https://apps.apple.com/app/apple-store/id6754949361">Download</a>',
    }));
    assert(found.includes("banned-copy"), `expected banned-copy, got ${JSON.stringify(found)}`);
  });

  check("every banned term is detected in prose", () => {
    for (const term of BANNED_COPY_TERMS) {
      assert(bannedCopyTerms(`<html><body><p>We ${term} the kitchen.</p></body></html>`).includes(term),
        `"${term}" was not detected`);
    }
  });

  check("a banned word in a URL, class name or script does not trip it", () => {
    const html = goodPage({
      body:
        '<div class="seamless-grid"><a href="/blog/unlock-your-pantry">A post</a>' +
        '<a href="https://apps.apple.com/app/apple-store/id6754949361">Download</a></div>' +
        '<script>const comprehensive = 1;</script>',
    });
    assert(!codes(html).includes("banned-copy"), `false positive: ${JSON.stringify(codes(html))}`);
  });

  check("visibleText drops JSON-LD, so schema text cannot trip a copy rule", () => {
    const html = '<html><body><script type="application/ld+json">{"x":"seamless"}</script>' +
      '<p>Plain copy.</p></body></html>';
    assert(bannedCopyTerms(html).length === 0, "JSON-LD leaked into visible text");
    assert(visibleText(html) === "Plain copy.", `got "${visibleText(html)}"`);
  });

  check("legal pages are exempt from the copy vocabulary rule", () => {
    const html = goodPage({ body: "<p>Subscriptions unlock premium features.</p>" });
    assert(codes(html, "legal").includes("banned-copy") === false, "legal should be exempt");
    assert(codes(html, "article").includes("banned-copy"), "a non-legal page must still fail");
  });

  check("the banned list is the SaaS vocabulary only, not the banned CLAIMS", () => {
    // A page must be able to state what PrepWise does not claim. The claim ban
    // is enforced on the ad/script side; duplicating it here would make the
    // honest sentence unpublishable.
    for (const claim of ["cure", "diagnose", "clinically proven", "fda approved"]) {
      assert(!BANNED_COPY_TERMS.includes(claim), `"${claim}" must not be in BANNED_COPY_TERMS`);
    }
  });

  check("entities are decoded before the title is measured", () => {
    const raw = "PrepWise: AI Meal Planner &amp; Pantry Tracker for iPhone"; // 57 raw, 53 decoded
    assert(raw.length === 57, `raw is ${raw.length}`);
    assert(decodeEntities(raw).length === 53, `decoded to ${decodeEntities(raw).length}`);
    assert(!codes(goodPage({ title: raw })).includes("title-length"), "should be in range once decoded");
  });

  // --- FAQ schema is required only when an FAQ is actually rendered
  check("an FAQ heading with no FAQPage schema fails", () => {
    const html = goodPage({ h1: "<h1>Title</h1><h2>Frequently asked questions</h2>" });
    assert(codes(html).includes("schema-faq"), "expected schema-faq");
  });
  check("no FAQ section means no FAQPage requirement", () => {
    assert(!codes(goodPage()).includes("schema-faq"), "unexpected schema-faq");
  });
  check("FAQPage schema satisfies a rendered FAQ", () => {
    const html = goodPage({
      h1: "<h1>Title</h1><h2>FAQ</h2>",
      jsonld: JSON.stringify({
        "@graph": [
          { "@type": "Organization" }, { "@type": "WebSite" },
          { "@type": "MobileApplication" }, { "@type": "FAQPage" },
        ],
      }),
    });
    assert(!codes(html).includes("schema-faq"), "expected FAQPage to satisfy it");
  });

  // --- the FAQ excerpt rule: own the schema, or link to the page that does
  check("an FAQ section with a link to /faq needs no FAQPage schema", () => {
    const html = goodPage({
      h1: '<h1>Title</h1><h2>Frequently asked questions</h2>',
      body:
        '<a href="/faq">Read the full PrepWise FAQ</a>' +
        '<a href="https://apps.apple.com/app/apple-store/id6754949361">Download</a>',
    });
    assert(!codes(html).includes("schema-faq"), `unexpected schema-faq: ${JSON.stringify(codes(html))}`);
  });
  check("an FAQ section with neither schema nor a /faq link still fails", () => {
    const html = goodPage({
      h1: "<h1>Title</h1><h2>FAQ</h2>",
      body:
        '<a href="/blog">Blog</a>' +
        '<a href="https://apps.apple.com/app/apple-store/id6754949361">Download</a>',
    });
    assert(codes(html).includes("schema-faq"), "expected schema-faq");
  });
  check("linksToFaqPage does not match /faq-something", () => {
    assert(linksToFaqPage('<a href="/faq">x</a>'), "site-relative");
    assert(linksToFaqPage('<a href="/faq#billing">x</a>'), "with fragment");
    assert(linksToFaqPage('<a href="https://www.prepwise-app.com/faq">x</a>'), "absolute");
    assert(!linksToFaqPage('<a href="/faq-archive">x</a>'), "false positive on /faq-archive");
    assert(!linksToFaqPage('<a href="/blog">x</a>'), "false positive on /blog");
  });

  // --- page classification
  check("error pages are exempt, real pages are not", () => {
    assert(classifyPage("404.html") === "exempt", "404.html");
    assert(classifyPage("_not-found.html") === "exempt", "_not-found.html");
    assert(classifyPage("index.html") === "home", "index.html");
    assert(classifyPage("privacy.html") === "legal", "privacy.html");
    assert(classifyPage("terms.html") === "legal", "terms.html");
    assert(classifyPage("blog/how-to-meal-plan.html") === "article", "blog page");
    assert(classifyPage("about.html") === "page", "about.html");
  });
  check("the blog index is not graded as an article, either filename shape", () => {
    assert(classifyPage("blog.html") === "blog-index", "blog.html");
    assert(classifyPage("blog/index.html") === "blog-index", "blog/index.html");
    assert(classifyPage("blog/a-post/index.html") === "article", "nested post");
  });
  check("the FAQ page has its own type, either filename shape", () => {
    assert(classifyPage("faq.html") === "faq", "faq.html");
    assert(classifyPage("faq/index.html") === "faq", "faq/index.html");
  });

  // --- the FAQ and blog-index page types carry their own schema requirements
  check("an faq page without FAQPage + BreadcrumbList fails", () => {
    const found = codes(goodPage(), "faq");
    assert(found.filter((c) => c === "schema-missing").length === 2,
      `expected 2 schema-missing, got ${JSON.stringify(found)}`);
  });
  check("a complete faq page passes", () => {
    const html = goodPage({
      jsonld: JSON.stringify({
        "@graph": [
          { "@type": "Organization" }, { "@type": "WebSite" },
          { "@type": "FAQPage" }, { "@type": "BreadcrumbList" },
        ],
      }),
    });
    const found = codes(html, "faq");
    assert(found.length === 0, `expected none, got ${JSON.stringify(found)}`);
  });
  check("an faq page with no App Store link fails", () => {
    const html = goodPage({
      body: "<p>no cta</p>",
      jsonld: JSON.stringify({
        "@graph": [
          { "@type": "Organization" }, { "@type": "WebSite" },
          { "@type": "FAQPage" }, { "@type": "BreadcrumbList" },
        ],
      }),
    });
    assert(codes(html, "faq").includes("appstore-cta"), "expected appstore-cta");
  });
  check("the blog index needs BreadcrumbList but not Article or a CTA", () => {
    const bare = codes(goodPage({ body: "<p>index</p>" }), "blog-index");
    assert(bare.includes("schema-missing"), "expected schema-missing for BreadcrumbList");
    const html = goodPage({
      body: "<p>index</p>",
      jsonld: JSON.stringify({
        "@graph": [
          { "@type": "Organization" }, { "@type": "WebSite" }, { "@type": "BreadcrumbList" },
        ],
      }),
    });
    const found = codes(html, "blog-index");
    assert(found.length === 0, `expected none, got ${JSON.stringify(found)}`);
  });

  // --- the blog registry drift check
  const withTempBlog = (fn) => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "verify-seo-"));
    try {
      fs.mkdirSync(path.join(root, "content", "blog"), { recursive: true });
      fs.mkdirSync(path.join(root, "out", "blog"), { recursive: true });
      return fn(root);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  };
  const writePost = (root, file, slug) =>
    fs.writeFileSync(
      path.join(root, "content", "blog", file),
      `export const post = { slug: "${slug}", title: "t" };\n`
    );
  const writeBuiltPost = (root, slug) =>
    fs.writeFileSync(
      path.join(root, "out", "blog", `${slug}.html`),
      `<html><body>${APP_LINK(`blog-${slug}`)}</body></html>`
    );
  const writeIndex = (root, files) =>
    fs.writeFileSync(
      path.join(root, "content", "blog", "index.ts"),
      files.map((f, i) => `import { post as p${i} } from "./${f}";`).join("\n") +
        `\nexport const POSTS = [${files.map((_, i) => `p${i}`).join(", ")}];\n`
    );
  const registryCodes = (root) =>
    checkBlogRegistry(path.join(root, "out"), root).map((f) => f.code);

  check("a registered, built post produces no registry findings", () => {
    withTempBlog((root) => {
      writePost(root, "a-post.ts", "a-post");
      writeIndex(root, ["a-post"]);
      writeBuiltPost(root, "a-post");
      const found = registryCodes(root);
      assert(found.length === 0, `expected none, got ${JSON.stringify(found)}`);
    });
  });
  check("a post file nobody imported is caught", () => {
    withTempBlog((root) => {
      writePost(root, "a-post.ts", "a-post");
      writePost(root, "orphan.ts", "orphan");
      writeIndex(root, ["a-post"]);
      writeBuiltPost(root, "a-post");
      assert(registryCodes(root).includes("blog-post-unregistered"), "expected blog-post-unregistered");
    });
  });
  check("a registered post that produced no HTML is caught", () => {
    withTempBlog((root) => {
      writePost(root, "a-post.ts", "a-post");
      writeIndex(root, ["a-post"]);
      assert(registryCodes(root).includes("blog-post-not-built"), "expected blog-post-not-built");
    });
  });
  check("a slug whose campaign token would be truncated is caught", () => {
    withTempBlog((root) => {
      const slug = "a".repeat(36); // "blog-" + 36 = 41 > 40
      writePost(root, "long.ts", slug);
      writeIndex(root, ["long"]);
      fs.writeFileSync(path.join(root, "out", "blog", `${slug}.html`), "<html></html>");
      assert(registryCodes(root).includes("blog-ct-too-long"), "expected blog-ct-too-long");
    });
  });
  check("a nested post directory counts as built", () => {
    withTempBlog((root) => {
      writePost(root, "a-post.ts", "a-post");
      writeIndex(root, ["a-post"]);
      fs.mkdirSync(path.join(root, "out", "blog", "a-post"), { recursive: true });
      fs.writeFileSync(
        path.join(root, "out", "blog", "a-post", "index.html"),
        `<html><body>${APP_LINK("blog-a-post")}</body></html>`
      );
      assert(registryCodes(root).length === 0, "nested index.html should count");
    });
  });
  check("no content/blog directory means no registry findings", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "verify-seo-"));
    try {
      assert(checkBlogRegistry(path.join(root, "out"), root).length === 0, "expected none");
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
  // --- use-case landing pages
  check("a use-case page is classified only when the registry names its slug", () => {
    assert(classifyPage("meal-prep-app.html", ["meal-prep-app"]) === "use-case", "flat file");
    assert(classifyPage("meal-prep-app/index.html", ["meal-prep-app"]) === "use-case", "nested");
    // Without the registry it is an ordinary page, which is what keeps every
    // pre-existing caller of the one-argument form behaving as before.
    assert(classifyPage("meal-prep-app.html") === "page", "no registry means no reclassification");
    assert(classifyPage("faq.html", ["faq"]) === "faq", "faq still wins over the registry");
    assert(classifyPage("404.html", ["404"]) === "exempt", "exempt still wins over the registry");
  });
  check("a use-case page needs App + BreadcrumbList and an App Store link", () => {
    const bare = codes(goodPage(), "use-case");
    assert(bare.includes("schema-missing"), `expected schema-missing, got ${JSON.stringify(bare)}`);
    const full = goodPage({
      jsonld: JSON.stringify({
        "@graph": [
          { "@type": "Organization" }, { "@type": "WebSite" },
          { "@type": "MobileApplication" }, { "@type": "BreadcrumbList" },
        ],
      }),
    });
    assert(codes(full, "use-case").length === 0, `expected none, got ${JSON.stringify(codes(full, "use-case"))}`);
    const noCta = goodPage({
      body: "<p>no cta</p>",
      jsonld: JSON.stringify({
        "@graph": [
          { "@type": "Organization" }, { "@type": "WebSite" },
          { "@type": "MobileApplication" }, { "@type": "BreadcrumbList" },
        ],
      }),
    });
    assert(codes(noCta, "use-case").includes("appstore-cta"), "expected appstore-cta");
  });

  const withTempPages = (fn) => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "verify-seo-uc-"));
    try {
      fs.mkdirSync(path.join(root, "content", "pages"), { recursive: true });
      fs.mkdirSync(path.join(root, "out"), { recursive: true });
      return fn(root);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  };
  const writeUseCase = (root, file, slug, ct) =>
    fs.writeFileSync(
      path.join(root, "content", "pages", file),
      `export const page = { slug: "${slug}", ct: "${ct}", title: "t" };\n`
    );
  const writePagesIndex = (root, files) =>
    fs.writeFileSync(
      path.join(root, "content", "pages", "index.ts"),
      files.map((f, i) => `import { page as p${i} } from "./${f}";`).join("\n") +
        `\nexport const USE_CASE_PAGES = [${files.map((_, i) => `p${i}`).join(", ")}];\n`
    );
  const writeBuilt = (root, slug, ct) =>
    fs.writeFileSync(path.join(root, "out", `${slug}.html`), `<html><body>${APP_LINK(ct)}</body></html>`);
  const ucCodes = (root) =>
    checkUseCasePages(path.join(root, "out"), root).map((f) => f.code);

  check("a registered, built page whose ct reached the link produces no findings", () => {
    withTempPages((root) => {
      writeUseCase(root, "a-page.ts", "a-page", "lp_a_page");
      writePagesIndex(root, ["a-page"]);
      writeBuilt(root, "a-page", "lp_a_page");
      const found = ucCodes(root);
      assert(found.length === 0, `expected none, got ${JSON.stringify(found)}`);
    });
  });
  check("a page file nobody imported is caught", () => {
    withTempPages((root) => {
      writeUseCase(root, "a-page.ts", "a-page", "lp_a_page");
      writeUseCase(root, "orphan.ts", "orphan", "lp_orphan");
      writePagesIndex(root, ["a-page"]);
      writeBuilt(root, "a-page", "lp_a_page");
      assert(ucCodes(root).includes("usecase-unregistered"), "expected usecase-unregistered");
    });
  });
  check("a registered page that produced no HTML is caught", () => {
    withTempPages((root) => {
      writeUseCase(root, "a-page.ts", "a-page", "lp_a_page");
      writePagesIndex(root, ["a-page"]);
      assert(ucCodes(root).includes("usecase-not-built"), "expected usecase-not-built");
    });
  });
  // THE one this check exists for: the page ships, the link works, and every
  // organic install from it is credited to the sitewide default token instead.
  check("a page whose ct never reached the rendered App Store link is caught", () => {
    withTempPages((root) => {
      writeUseCase(root, "a-page.ts", "a-page", "lp_a_page");
      writePagesIndex(root, ["a-page"]);
      writeBuilt(root, "a-page", "Landing%20Page%20Download%20Button");
      assert(ucCodes(root).includes("usecase-ct-not-rendered"), "expected usecase-ct-not-rendered");
    });
  });
  // THE shape this check was extended for. The page renders three correct
  // anchors AND one App Store URL carrying the sitewide default (the JSON-LD
  // installUrl/downloadUrl the root layout used to build). The presence check
  // above is satisfied by the three good anchors and reports nothing at all.
  check("a wrong-token sibling beside correct anchors is caught", () => {
    withTempPages((root) => {
      writeUseCase(root, "a-page.ts", "a-page", "lp_a_page");
      writePagesIndex(root, ["a-page"]);
      fs.writeFileSync(
        path.join(root, "out", "a-page.html"),
        "<html><body>" +
          APP_LINK("lp_a_page") + APP_LINK("lp_a_page") + APP_LINK("lp_a_page") +
          '<script type="application/ld+json">' +
          JSON.stringify({
            "@graph": [{
              "@type": "MobileApplication",
              installUrl: "https://apps.apple.com/app/apple-store/id6754949361?pt=128248695&ct=Landing%20Page%20Download%20Button&mt=8",
              downloadUrl: "https://apps.apple.com/app/apple-store/id6754949361?pt=128248695&ct=Landing%20Page%20Download%20Button&mt=8",
            }],
          }) +
          "</script></body></html>"
      );
      const found = ucCodes(root);
      assert(found.includes("usecase-ct-mismatch"), `expected usecase-ct-mismatch, got ${JSON.stringify(found)}`);
      // The presence check must stay quiet: proving it alone could not have
      // caught this is the reason the exhaustive form exists.
      assert(!found.includes("usecase-ct-not-rendered"),
        "the presence check is satisfied here — that is the point of this case");
    });
  });
  check("the same page with the right token everywhere passes", () => {
    withTempPages((root) => {
      writeUseCase(root, "a-page.ts", "a-page", "lp_a_page");
      writePagesIndex(root, ["a-page"]);
      fs.writeFileSync(
        path.join(root, "out", "a-page.html"),
        "<html><body>" + APP_LINK("lp_a_page") +
          '<script type="application/ld+json">' +
          JSON.stringify({
            "@graph": [{
              "@type": "MobileApplication",
              installUrl: "https://apps.apple.com/app/apple-store/id6754949361?pt=128248695&ct=lp_a_page&mt=8",
              downloadUrl: "https://apps.apple.com/app/apple-store/id6754949361?pt=128248695&ct=lp_a_page&mt=8",
            }],
          }) +
          "</script></body></html>"
      );
      const found = ucCodes(root);
      assert(found.length === 0, `expected none, got ${JSON.stringify(found)}`);
    });
  });
  check("App Store URLs are found in JSON-LD as well as in href attributes", () => {
    // The href carries `&amp;`, the JSON-LD carries a bare `&`. Both must decode
    // to the same token or the check reports a difference that is not real.
    const html =
      APP_LINK("lp_x") +
      '<script type="application/ld+json">{"installUrl":' +
      '"https://apps.apple.com/app/apple-store/id6754949361?pt=128248695&ct=lp_x&mt=8"}</script>';
    const urls = appStoreUrls(html);
    assert(urls.length === 2, `expected 2 urls, got ${urls.length}: ${JSON.stringify(urls)}`);
    assert(campaignTokensOn(html).length === 1,
      `expected one token, got ${JSON.stringify(campaignTokensOn(html))}`);
    assert(campaignTokenOf(urls[0]) === "lp_x", campaignTokenOf(urls[0]));
  });
  check("two campaign tokens on one page is a page-level failure", () => {
    const mixed = goodPage({
      body: APP_LINK("faq") +
        '<script type="application/ld+json">{"downloadUrl":' +
        '"https://apps.apple.com/app/apple-store/id6754949361?ct=Landing%20Page%20Download%20Button"}</script>',
    });
    assert(codes(mixed, "faq").includes("appstore-ct-inconsistent"),
      `expected appstore-ct-inconsistent, got ${JSON.stringify(codes(mixed, "faq"))}`);
    // A page whose links all agree must NOT trip it, whatever the token is.
    const one = goodPage({ body: APP_LINK("faq") + APP_LINK("faq") });
    assert(!codes(one, "faq").includes("appstore-ct-inconsistent"), "false positive on a consistent page");
    const bare = goodPage({ body: '<a href="https://apps.apple.com/app/apple-store/id6754949361">D</a>' });
    assert(!codes(bare).includes("appstore-ct-inconsistent"), "false positive on a single untokened link");
  });
  check("a blog post whose JSON-LD carries the wrong token is caught", () => {
    withTempBlog((root) => {
      writePost(root, "a-post.ts", "a-post");
      writeIndex(root, ["a-post"]);
      fs.writeFileSync(
        path.join(root, "out", "blog", "a-post.html"),
        "<html><body>" + APP_LINK("blog-a-post") +
          '<script type="application/ld+json">{"installUrl":' +
          '"https://apps.apple.com/app/apple-store/id6754949361?ct=Landing%20Page%20Download%20Button"}</script>' +
          "</body></html>"
      );
      assert(registryCodes(root).includes("blog-ct-mismatch"), "expected blog-ct-mismatch");
    });
  });

  check("a malformed or over-long campaign token is caught", () => {
    withTempPages((root) => {
      writeUseCase(root, "a.ts", "a", "LP_Shouty");
      writeUseCase(root, "b.ts", "b", `lp_${"x".repeat(38)}`);
      writePagesIndex(root, ["a", "b"]);
      writeBuilt(root, "a", "LP_Shouty");
      writeBuilt(root, "b", `lp_${"x".repeat(38)}`);
      const found = ucCodes(root);
      assert(found.includes("usecase-ct-shape"), `expected usecase-ct-shape, got ${JSON.stringify(found)}`);
      assert(found.includes("usecase-ct-too-long"), `expected usecase-ct-too-long, got ${JSON.stringify(found)}`);
    });
  });
  check("two pages sharing a campaign token is caught", () => {
    withTempPages((root) => {
      writeUseCase(root, "a.ts", "a", "lp_same");
      writeUseCase(root, "b.ts", "b", "lp_same");
      writePagesIndex(root, ["a", "b"]);
      writeBuilt(root, "a", "lp_same");
      writeBuilt(root, "b", "lp_same");
      assert(ucCodes(root).includes("usecase-ct-duplicate"), "expected usecase-ct-duplicate");
    });
  });
  check("no content/pages directory means no use-case findings", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "verify-seo-uc-"));
    try {
      assert(checkUseCasePages(path.join(root, "out"), root).length === 0, "expected none");
      assert(listUseCaseSlugs(root).length === 0, "expected no slugs");
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  // --- the Google Search Console verification file must not ship as an asset
  check("a GSC verification file in the export is a build failure", () => {
    const found = gscVerificationFinding("google1234567890abcdef.html");
    assert(found, "expected a finding");
    assert(found.code === "gsc-verification-asset", found.code);
    assert(found.level === "error", "must fail the build, not warn");
    // The message has to carry the fix. The failure mode it prevents is
    // invisible from the build output, so "this file is wrong" is not enough.
    assert(/worker\/index\.js/.test(found.message), "message must name the fix");
  });
  check("the GSC rule does not fire on real pages", () => {
    for (const rel of [
      "index.html", "privacy.html", "faq.html", "blog.html",
      "grocery-list-app.html", "blog/how-to-meal-plan-for-the-week.html",
      "google.html",          // no token
      "googleabc.html",       // too short to be a token
      "google-analytics.html", // a hyphen means it is a content slug, not a token
    ]) {
      assert(gscVerificationFinding(rel) === null, `false positive on ${rel}`);
    }
  });
  // Without the early `continue` the file would be graded as an ordinary page
  // and produce ~8 unactionable findings around the one that matters. Pin the
  // premise: classifyPage does NOT exempt it on its own.
  check("classifyPage alone would grade a GSC file as a normal page", () => {
    assert(classifyPage("google1234567890abcdef.html") === "page",
      "if this ever becomes 'exempt', the GSC guard is silently dead");
  });

  check("an exempt page is never checked", () => {
    const found = checkPage({ rel: "404.html", html: "<html></html>", type: "exempt", siteUrl: SITE });
    assert(found.length === 0, `expected none, got ${JSON.stringify(found)}`);
  });

  // --- article pages carry the extra schema requirement
  check("a blog page without Article/BreadcrumbList fails", () => {
    const found = codes(goodPage(), "article");
    assert(found.filter((c) => c === "schema-missing").length === 2,
      `expected 2 schema-missing, got ${JSON.stringify(found)}`);
  });
  check("a legal page needs no App schema and no App Store CTA", () => {
    const html = goodPage({
      jsonld: JSON.stringify({ "@graph": [{ "@type": "Organization" }, { "@type": "WebSite" }] }),
      body: "<p>legal text</p>",
    });
    const found = codes(html, "legal");
    assert(found.length === 0, `expected none, got ${JSON.stringify(found)}`);
  });

  // --- empty alt is a warning, not a failure
  check('alt="" is a warning, not an error', () => {
    const found = run1(goodPage({ img: '<img src="/deco.png" alt=""/>' }));
    assert(found.every((f) => f.level === "warn"), "should not be an error");
    assert(found.some((f) => f.code === "img-alt-empty"), "expected the warning");
  });
  check("a 1x1 tracking pixel is not reported at all", () => {
    const html = goodPage({
      img: '<img src="/a.png" alt="PrepWise pantry screen"/>' +
           '<img height="1" width="1" style="display:none" alt="" src="https://www.facebook.com/tr?id=1"/>',
    });
    assert(run1(html).length === 0, `expected none, got ${JSON.stringify(run1(html))}`);
  });

  if (failures.length) {
    console.error(`FAIL ${failures.length} of ${passed + failures.length} verify-seo self-tests`);
    for (const f of failures) console.error(`  - ${f}`);
    return 1;
  }
  console.log(`ok - ${passed} verify-seo self-test cases passed`);
  return 0;
}

// --- entry ------------------------------------------------------------------

// Only when executed directly. The named exports above exist so this file can
// be imported by a future test without the import itself exiting the process.
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const argv = process.argv.slice(2);
  process.exit(argv.includes("--self-test") ? selfTest() : run(argv));
}
