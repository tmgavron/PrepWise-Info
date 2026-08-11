// Cloudflare Worker for PrepWise recipe-share link previews.
//
// Runs ONLY for /r/* (see run_worker_first in wrangler.toml); every other path
// falls through to the static assets in landing/out. When someone pastes a
// https://prepwise-app.com/r/{shareId} link into iMessage/Slack/etc., the
// preview bot fetches this page and reads the Open Graph tags we render from
// the share's frozen snapshot (via the public get-shared-recipe edge function).
// Humans without the app installed land here too and get a lightweight recipe
// preview card. Users WITH the app never see this page - iOS routes the
// Universal Link straight into PrepWise.
//
// The share lookup tries PROD first, then the QA project, so links created
// from QA TestFlight builds also render previews during testing. Both anon
// keys are public client keys (they ship inside the app binaries).

const SUPABASE_ENVS = [
  {
    name: 'prod',
    url: 'https://xhrzdhakkieuphccygxc.supabase.co',
    anonKey:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhocnpkaGFra2lldXBoY2N5Z3hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzNzAwNjQsImV4cCI6MjA3NTk0NjA2NH0.q9Kzp6Rzpnh5__JIJ16kbFvzx7ZIkdgnOFMponwaoUs',
  },
  {
    name: 'qa',
    url: 'https://gkknbvzyapjjnmenjbfp.supabase.co',
    anonKey:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdra25idnp5YXBqam5tZW5qYmZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzODg5MjQsImV4cCI6MjA5Nzk2NDkyNH0.R_3tfbbWQlTnHMEXFfIdzevyVwQ3mfMJwlkun0KkcO8',
  },
];

const SHARE_ID_RE = /^\/r\/([A-Za-z0-9_-]{6,64})\/?$/;

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function fetchShare(shareId) {
  for (const env of SUPABASE_ENVS) {
    try {
      const res = await fetch(
        `${env.url}/functions/v1/get-shared-recipe?shareId=${encodeURIComponent(shareId)}`,
        {
          headers: {
            apikey: env.anonKey,
            Authorization: `Bearer ${env.anonKey}`,
          },
        },
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.recipe) return data;
      }
    } catch (_) {
      // network hiccup on one env - fall through and try the next
    }
  }
  return null;
}

function pageShell({ headExtra, body }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${headExtra}
<style>
  body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f9f9f9;color:#1b2d4f;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px;box-sizing:border-box}
  .card{background:#fff;border-radius:16px;box-shadow:0 4px 24px rgba(27,45,79,.08);max-width:420px;width:100%;overflow:hidden;text-align:center}
  .card img.hero{width:100%;aspect-ratio:1.6;object-fit:cover;display:block}
  .card .inner{padding:24px}
  h1{font-size:22px;margin:0 0 4px;line-height:1.3}
  .byline{color:#5b6b80;font-size:15px;margin:0 0 16px}
  .meta{color:#5b6b80;font-size:14px;margin:0 0 20px}
  .cta{display:inline-block;background:#1b2d4f;color:#fff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 22px;border-radius:10px}
  .brand{margin-top:18px;font-size:13px;color:#8fa0b6}
</style>
</head>
<body>
${body}
</body>
</html>`;
}

function renderRecipePage(shareId, data) {
  const recipe = data.recipe || {};
  const title = (recipe.title || 'Shared Recipe').trim();
  const author = (data.authorDisplayName || recipe.author || 'A PrepWise Cook').trim();
  const image = typeof recipe.image === 'string' && /^https:\/\//.test(recipe.image) ? recipe.image : null;
  const pageTitle = `${title} by ${author}`;
  const canonical = `https://prepwise-app.com/r/${shareId}`;

  const metaBits = [];
  if (recipe.durationMin) metaBits.push(`${recipe.durationMin} min`);
  if (recipe.calories) metaBits.push(`${recipe.calories} cal`);
  const ingredientCount = Array.isArray(recipe.ingredients) ? recipe.ingredients.length : 0;
  if (ingredientCount) metaBits.push(`${ingredientCount} ingredients`);
  const description = metaBits.length
    ? `${metaBits.join(' · ')} · View this recipe in PrepWise.`
    : 'View this recipe in PrepWise.';

  const e = escapeHtml;
  const headExtra = [
    `<title>${e(pageTitle)}</title>`,
    `<link rel="canonical" href="${e(canonical)}">`,
    `<meta name="description" content="${e(description)}">`,
    `<meta property="og:type" content="article">`,
    `<meta property="og:site_name" content="PrepWise">`,
    `<meta property="og:title" content="${e(pageTitle)}">`,
    `<meta property="og:description" content="${e(description)}">`,
    `<meta property="og:url" content="${e(canonical)}">`,
    image ? `<meta property="og:image" content="${e(image)}">` : '',
    `<meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}">`,
    `<meta name="twitter:title" content="${e(pageTitle)}">`,
    `<meta name="twitter:description" content="${e(description)}">`,
    image ? `<meta name="twitter:image" content="${e(image)}">` : '',
  ].filter(Boolean).join('\n');

  const body = `<div class="card">
  ${image ? `<img class="hero" src="${e(image)}" alt="${e(title)}">` : ''}
  <div class="inner">
    <h1>${e(title)}</h1>
    <p class="byline">by ${e(author)}</p>
    <p class="meta">${e(metaBits.join(' · ') || 'A recipe shared from PrepWise')}</p>
    <a class="cta" href="${e(canonical)}">Open in PrepWise</a>
    <p class="brand">Don't have the app yet? PrepWise is coming to the App Store soon.</p>
  </div>
</div>`;

  return new Response(pageShell({ headExtra, body }), {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      // Short cache so revoked shares stop previewing quickly.
      'Cache-Control': 'public, max-age=300',
    },
  });
}

function renderGonePage() {
  const headExtra = [
    '<title>Recipe unavailable - PrepWise</title>',
    '<meta property="og:site_name" content="PrepWise">',
    '<meta property="og:title" content="Recipe unavailable">',
    '<meta property="og:description" content="This shared recipe link is no longer active.">',
    '<meta name="robots" content="noindex">',
  ].join('\n');
  const body = `<div class="card"><div class="inner">
  <h1>This recipe isn't available</h1>
  <p class="meta">The link may have been turned off by its owner or is no longer valid.</p>
  <p class="brand">PrepWise - smart meal planning</p>
</div></div>`;
  return new Response(pageShell({ headExtra, body }), {
    status: 404,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=60',
    },
  });
}

// --- Google Search Console verification -------------------------------------
//
// GSC's HTML-FILE method fetches https://<host>/google<token>.html and expects a
// 200 whose body is exactly `google-site-verification: google<token>.html`. It
// does NOT follow redirects; a redirect is reported as a verification failure.
//
// DROPPING THE FILE INTO landing/public/ DOES NOT WORK HERE, and it fails in a
// way that reads like the file is simply missing. Cloudflare's asset binding
// runs html_handling in its default mode, which redirects `/anything.html` to
// the extensionless `/anything`. Verified live 2026-07-26:
//
//   curl -sI https://www.prepwise-app.com/404.html   ->  307 -> /404
//
// So the token is served HERE instead, ahead of both the apex redirect and the
// assets. landing/scripts/verify-seo.mjs fails the build if a google*.html file
// shows up in the static export, so the path that does not work cannot ship.
//
// Serving it BEFORE the apex redirect is deliberate: the file then resolves on
// the apex AND on www with no redirect, so it satisfies a Domain property, a www
// URL-prefix property, or an apex URL-prefix property equally. Whichever one
// Trent creates in the console, this works.
//
// TO ADD A TOKEN: paste the filename GSC shows you (e.g.
// 'google1234567890abcdef.html') into the array below, commit, push. The deploy
// is automatic; then press Verify in the console. Leave old entries in place -
// GSC re-checks verification periodically and removing the file un-verifies the
// property, which silently stops the data the SEO feedback loop runs on.
//
// Full walkthrough: landing/seo/search-console-setup.md
export const GOOGLE_VERIFICATION_FILES = [];

// Shape guard, kept in lockstep with GSC_ASSET in landing/scripts/verify-seo.mjs.
// Membership in the array above is the real gate; this exists so an entry that
// is not a verification filename (say 'privacy.html') can never shadow a real
// page of the site.
const GOOGLE_VERIFICATION_RE = /^google[a-z0-9]{6,}\.html$/;

/**
 * Serve a configured Google Search Console verification file, or null to fall
 * through to normal handling.
 *
 * The body is derived from the filename because that IS the file's content -
 * GSC generates `google-site-verification: <filename>` and checks for exactly
 * that string. Deriving it means the two can never drift apart.
 */
export function googleVerificationResponse(url, files = GOOGLE_VERIFICATION_FILES) {
  const name = url.pathname.slice(1);
  if (!GOOGLE_VERIFICATION_RE.test(name)) return null;
  if (!files.includes(name)) return null;
  return new Response(`google-site-verification: ${name}`, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}

// Canonical host. The apex 301s here so one hostname carries the ranking
// signal; keep in lockstep with SITE_URL in landing/src/lib/constants.ts.
const CANONICAL_HOST = 'www.prepwise-app.com';
const APEX_HOST = 'prepwise-app.com';

/**
 * Apex -> www redirect, with the two exemptions that must NEVER redirect.
 *
 * Returns a 301 Response, or null to fall through to normal handling.
 *
 * ONLY the bare apex is redirected. Anything else (the canonical host itself, a
 * *.workers.dev preview, a Cloudflare preview alias, localhost during
 * `wrangler dev`) falls through untouched - a host allowlist here would break
 * previews, and redirecting an unknown host risks bouncing traffic we do not
 * understand.
 *
 * Exemptions:
 *   /r/*          recipe-share Universal Links were minted on the APEX, and the
 *                 iOS app registers applinks:prepwise-app.com (apex only).
 *   /.well-known/* the AASA must resolve on the apex with no redirect. This is
 *                 belt-and-braces: wrangler.toml already routes /.well-known/*
 *                 to the asset worker so this code never sees it.
 */
export function apexRedirect(url) {
  if (url.hostname !== APEX_HOST) return null;
  if (url.pathname === '/r' || url.pathname.startsWith('/r/')) return null;
  if (url.pathname.startsWith('/.well-known/')) return null;

  const target = new URL(url);
  target.hostname = CANONICAL_HOST;
  // url.search carries the query verbatim, which the ad attribution chain
  // depends on: utm_content survives the hop and becomes the App Store `ct`
  // token (see landing/src/lib/analytics.ts). Dropping it would silently
  // unattribute every paid install that lands on the apex.
  return Response.redirect(target.toString(), 301);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Before the apex redirect on purpose: GSC does not follow redirects, and
    // this way the token verifies on whichever host the property was created
    // for. See GOOGLE_VERIFICATION_FILES above.
    const verification = googleVerificationResponse(url);
    if (verification) return verification;

    const redirect = apexRedirect(url);
    if (redirect) return redirect;

    const match = url.pathname.match(SHARE_ID_RE);
    if (!match) {
      // Every non-share path now reaches the worker (run_worker_first = "/*"),
      // so this is the normal case, not a fallback: serve the static asset.
      return env.ASSETS.fetch(request);
    }
    const data = await fetchShare(match[1]);
    return data ? renderRecipePage(match[1], data) : renderGonePage();
  },
};
