// Regression tests for the routing decisions in worker/index.js: the apex -> www
// redirect, and the Google Search Console verification file.
//
// Run: node worker/apex-redirect.test.mjs
//
// (The filename still says apex-redirect because .github/workflows/deploy.yml
// runs this exact path. Adding a second file would mean a second thing to
// remember to wire in, and a test nobody runs is worse than no test.)
//
// This exists because the redirect sits in front of TWO things that fail
// SILENTLY and are only noticed by users:
//
//   1. /r/* recipe-share Universal Links. They were minted on the APEX, and the
//      iOS app registers `applinks:prepwise-app.com` (apex only). A redirect
//      here sends an existing share to a host the app does not claim.
//   2. /.well-known/apple-app-site-association. Apple fetches it from the exact
//      host in the link and does NOT follow redirects. A redirect breaks
//      Universal Links for every share already in the wild.
//
// Neither breakage produces an error anywhere. The link just stops opening the
// app, on other people's phones. Hence a test rather than a careful reading.

import assert from "node:assert/strict";
import { apexRedirect, googleVerificationResponse, GOOGLE_VERIFICATION_FILES } from "./index.js";

let passed = 0;
const failures = [];
// An async check that is not awaited fails as an unhandled rejection AFTER the
// report has already printed "ok". Pending promises are collected here and
// settled before anything is reported, so an async case cannot pass vacuously.
const pending = [];

function check(name, fn) {
  const record = (err) => failures.push(`${name}: ${err.message}`);
  try {
    const result = fn();
    if (result && typeof result.then === "function") {
      pending.push(result.then(() => { passed += 1; }, record));
      return;
    }
    passed += 1;
  } catch (err) {
    record(err);
  }
}

/** null => fall through to normal handling; otherwise the Location header. */
function redirectFor(href) {
  const res = apexRedirect(new URL(href));
  if (res === null) return null;
  assert.equal(res.status, 301, `expected 301 for ${href}, got ${res.status}`);
  return res.headers.get("location");
}

// --- the exemptions: these must NEVER redirect ------------------------------

for (const path of [
  "/.well-known/apple-app-site-association",
  "/.well-known/assetlinks.json",
]) {
  check(`apex ${path} is not redirected`, () => {
    assert.equal(redirectFor(`https://prepwise-app.com${path}`), null);
  });
}

for (const path of [
  "/r/abc123",
  "/r/abc123/",
  "/r/test-invalid-id",
  "/r/A_very-long_share-id-0123456789",
  "/r", // bare /r, no trailing slash
  "/r/", // /r/ with nothing after it
  "/r/xy", // too short for SHARE_ID_RE, still a share-namespace path
]) {
  check(`apex ${path} is not redirected`, () => {
    assert.equal(redirectFor(`https://prepwise-app.com${path}`), null);
  });
}

check("a share link keeps its query on the apex", () => {
  assert.equal(redirectFor("https://prepwise-app.com/r/abc123?utm_source=x"), null);
});

// A path that merely STARTS with the letters is not in the share namespace and
// must still be canonicalised.
check("/recipes is redirected (not confused with /r/)", () => {
  assert.equal(
    redirectFor("https://prepwise-app.com/recipes"),
    "https://www.prepwise-app.com/recipes"
  );
});

check("/.well-knownish is redirected (prefix must be the real segment)", () => {
  assert.equal(
    redirectFor("https://prepwise-app.com/.well-knownish"),
    "https://www.prepwise-app.com/.well-knownish"
  );
});

// --- the redirect itself ----------------------------------------------------

check("apex root redirects to www root", () => {
  assert.equal(redirectFor("https://prepwise-app.com/"), "https://www.prepwise-app.com/");
});

check("apex preserves the path", () => {
  assert.equal(
    redirectFor("https://prepwise-app.com/privacy"),
    "https://www.prepwise-app.com/privacy"
  );
});

// The ad attribution chain depends on this: utm_content survives the hop and
// becomes the App Store `ct` token. Dropping the query silently unattributes
// every paid install that lands on the apex.
check("apex preserves the query string", () => {
  assert.equal(
    redirectFor("https://prepwise-app.com/?utm_content=ig_img_meal_prep_v1"),
    "https://www.prepwise-app.com/?utm_content=ig_img_meal_prep_v1"
  );
});

check("apex preserves a multi-param query on a subpath", () => {
  assert.equal(
    redirectFor("https://prepwise-app.com/terms?utm_source=ig&utm_campaign=launch_jul26"),
    "https://www.prepwise-app.com/terms?utm_source=ig&utm_campaign=launch_jul26"
  );
});

check("apex preserves the fragment-free encoded query", () => {
  assert.equal(
    redirectFor("https://prepwise-app.com/?ct=Landing%20Page%20Download%20Button"),
    "https://www.prepwise-app.com/?ct=Landing%20Page%20Download%20Button"
  );
});

// --- everything that is NOT the bare apex falls through ---------------------

for (const host of [
  "www.prepwise-app.com", // already canonical: redirecting would loop
  "prepwiseinfo.workers.dev",
  "prepwise-info.pages.dev",
  "localhost:8788",
  "prepwise-app.com.evil.example", // suffix lookalike, not our apex
  "notprepwise-app.com",
]) {
  check(`${host} is not redirected`, () => {
    assert.equal(redirectFor(`http://${host}/privacy`), null);
  });
}

// --- Google Search Console verification file --------------------------------
//
// The whole point of serving this from the worker is that GSC does not follow
// redirects and Cloudflare's asset binding 307s `/x.html` -> `/x`. So the two
// properties that matter are: the response is a direct 200 with the exact body,
// and it happens BEFORE the apex redirect can touch it.

const TOKEN = "google1234567890abcdef.html";

/** Response for a path, using an explicit token list. null => falls through. */
function verificationFor(href, files = [TOKEN]) {
  return googleVerificationResponse(new URL(href), files);
}

check("a configured token is served as a direct 200 with the exact body", async () => {
  for (const host of ["www.prepwise-app.com", "prepwise-app.com"]) {
    const res = verificationFor(`https://${host}/${TOKEN}`);
    assert.ok(res, `no response on ${host}`);
    assert.equal(res.status, 200, `status on ${host}`);
    assert.equal(await res.text(), `google-site-verification: ${TOKEN}`, `body on ${host}`);
  }
});

// The apex redirect is what would break verification if the handler ran after
// it. Assert the ordering property directly rather than trusting the read.
check("the token is exempt from the apex redirect", () => {
  const url = new URL(`https://prepwise-app.com/${TOKEN}`);
  assert.ok(verificationFor(url.href), "verification must answer first");
  assert.ok(apexRedirect(url), "sanity: the apex redirect would otherwise fire here");
});

check("an unconfigured token falls through (no blanket google*.html handler)", () => {
  assert.equal(verificationFor("https://www.prepwise-app.com/googledeadbeefdead.html"), null);
});

// A non-verification filename in the array must never shadow a real page. This
// is why the shape guard exists at all - membership alone would let one typo
// take a live route off the site.
for (const bad of ["privacy.html", "index.html", "faq.html", "og-image.png"]) {
  check(`${bad} cannot be served as a verification file`, () => {
    assert.equal(verificationFor(`https://www.prepwise-app.com/${bad}`, [bad]), null);
  });
}

for (const path of [
  "/blog/googleabc123456.html", // only the site root, not a nested path
  "/google.html",               // no token at all
  "/googleabc.html",            // too short to be a real token
  "/GOOGLE1234567890abcdef.html", // GSC filenames are lowercase
]) {
  check(`${path} is not treated as a verification file`, () => {
    assert.equal(verificationFor(`https://www.prepwise-app.com${path}`, [path.slice(1)]), null);
  });
}

// The shipped default. An accidentally-committed token would serve a stranger's
// verification string from our domain, which is a real (if unlikely) way to hand
// someone else Search Console access to the site.
check("every shipped entry is a well-formed verification filename", () => {
  assert.ok(Array.isArray(GOOGLE_VERIFICATION_FILES), "must be an array");
  for (const name of GOOGLE_VERIFICATION_FILES) {
    assert.match(name, /^google[a-z0-9]{6,}\.html$/, `bad entry: ${name}`);
  }
});

// --- report -----------------------------------------------------------------

await Promise.all(pending);

if (failures.length) {
  console.error(`FAIL ${failures.length} of ${passed + failures.length}`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`ok - ${passed} apex-redirect cases passed`);
