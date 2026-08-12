#!/usr/bin/env bash
# Assert the LIVE routing invariants for prepwise-app.com.
#
# Run in CI after every deploy, and safe to run by hand at any time:
#   bash scripts/verify-live-routing.sh
#
# WHY THIS EXISTS: `wrangler deploy` cannot fail on a config field it does not
# recognise. wrangler 3.90.0 logged `Unexpected fields found in assets field:
# "run_worker_first"` as a WARNING, dropped the field, and exited 0 - so the
# apex redirect was "deployed" and simply absent. A green deploy is not evidence
# that routing is in effect; only the live site is.
#
# Every check below is something that fails SILENTLY in production:
#   - a redirect on /.well-known/ or /r/ breaks recipe-share Universal Links on
#     other people's phones, with no error anywhere
#   - a missing apex redirect quietly re-splits the ranking signal across two
#     hostnames
#   - a wrong-domain sitemap hands our crawl budget to another company's site

set -uo pipefail

APEX="https://prepwise-app.com"
WWW="https://www.prepwise-app.com"

# Resolved from this script's own location so it runs from any cwd (CI invokes
# it from the repo root, a human may not).
REPO_ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)

# Cloudflare finishes propagating a deploy across colos a little after wrangler
# returns, so a check run seconds later can still meet a stale asset on one
# edge. Observed 2026-07-26: 26s after deploy, apex /privacy still answered 200
# while / and /og-image.png already redirected; it passed on the next attempt.
#
# So the whole suite retries as a unit. A flaky guardrail is worse than none - it
# trains everyone to ignore it - and a genuine regression still fails every
# attempt and fails the build.
ATTEMPTS=${VERIFY_ATTEMPTS:-6}
SETTLE_SECONDS=${VERIFY_SETTLE_SECONDS:-15}

# Cloudflare caches by URL, so a freshly deployed redirect can lose a race with
# an asset cached under the old routing. A unique query proves the routing
# itself, and doubles as the query-preservation check the ad attribution chain
# depends on. Re-minted per attempt inside run_all_checks.
failures=0
checks=0
CB=""

pass() { checks=$((checks + 1)); printf '  ok    %s\n' "$1"; }
# Deliberately does NOT count as a check: a skipped assertion proves nothing and
# must not inflate the "all N checks passed" line at the end.
skip() { printf '  skip  %s\n' "$1"; }
fail() {
  checks=$((checks + 1))
  failures=$((failures + 1))
  printf '  FAIL  %s\n     -> %s\n' "$1" "$2"
}

# status_of URL -> "<http_code> <location-or-->"
status_of() {
  curl -sS -o /dev/null -m 20 -w '%{http_code} %{redirect_url}' "$1" 2>/dev/null || echo "000 -"
}

expect_redirect() { # name url expected_location
  local got code loc
  got=$(status_of "$2")
  code=${got%% *}
  loc=${got#* }
  if [ "$code" = "301" ] && [ "$loc" = "$3" ]; then
    pass "$1"
  else
    fail "$1" "got $code -> ${loc:-<none>}; expected 301 -> $3"
  fi
}

# Split on the FIRST colon only. A value can legitimately contain ": " (alt-svc
# does), and FS=": " would silently truncate it into a passing-looking prefix.
expect_header() { # name url header-name expected-substring
  local value
  value=$(curl -sS -m 20 -o /dev/null -D - "$2" 2>/dev/null \
    | tr -d '\r' | awk -v h="$(printf '%s' "$3" | tr 'A-Z' 'a-z')" '
        { i = index($0, ":"); if (i == 0) next
          n = tolower(substr($0, 1, i - 1)); v = substr($0, i + 1)
          sub(/^ +/, "", v)
          if (n == h) { print v; exit } }')
  if [ -z "$value" ]; then
    fail "$1" "$3 absent"
  elif [ "${value#*"$4"}" = "$value" ]; then
    fail "$1" "$3 is '$value'; expected to contain '$4'"
  else
    pass "$1"
  fi
}

expect_no_redirect() { # name url
  local got code loc
  got=$(status_of "$2")
  code=${got%% *}
  loc=${got#* }
  # 404 is fine here: an unknown share id legitimately renders the worker's
  # "recipe unavailable" page. What must never happen is a redirect.
  if [ -n "$loc" ] && [ "$loc" != "-" ]; then
    fail "$1" "REDIRECTED to $loc (must be served directly)"
  elif [ "$code" = "000" ]; then
    fail "$1" "request failed (no response)"
  else
    pass "$1 [$code]"
  fi
}

expect_200() { # name url
  local got code
  got=$(status_of "$2")
  code=${got%% *}
  if [ "$code" = "200" ]; then pass "$1"; else fail "$1" "got $code, expected 200"; fi
}

run_all_checks() {
  failures=0
  checks=0
  # Fresh cache-buster per attempt so a retry cannot be answered by an entry
  # the previous attempt just created.
  CB="cb=$(date +%s)-$RANDOM"

  echo "== apex canonicalises to www =="
  expect_redirect "apex / -> www" "$APEX/?$CB" "$WWW/?$CB"
  expect_redirect "apex /privacy -> www" "$APEX/privacy?$CB" "$WWW/privacy?$CB"
  # An existing static asset must ALSO redirect. This is the exact check that
  # catches a dropped run_worker_first: without it the asset worker answers first
  # and our code never runs.
  expect_redirect "apex asset /og-image.png -> www" "$APEX/og-image.png?$CB" "$WWW/og-image.png?$CB"
  expect_redirect "apex preserves utm_content" \
    "$APEX/?utm_content=verify_probe_v1" "$WWW/?utm_content=verify_probe_v1"

  echo "== apex exemptions must NEVER redirect =="
  # Apple fetches the AASA from the exact host in the link and does not follow
  # redirects. The iOS app registers applinks:prepwise-app.com (the APEX).
  expect_no_redirect "apex AASA served directly" "$APEX/.well-known/apple-app-site-association"
  # Recipe-share links were minted on the apex.
  expect_no_redirect "apex /r/<id> served directly" "$APEX/r/verify-probe-invalid-id"

  echo "== www serves the site and never redirects =="
  expect_200 "www /" "$WWW/"
  expect_200 "www /privacy" "$WWW/privacy"
  expect_200 "www /terms" "$WWW/terms"
  # Added with the S3a FAQ + blog scaffold. A new route can build, pass the SEO
  # gate, and still 404 live if the worker or the asset routing swallows it, so
  # every crawlable top-level route is asserted here rather than assumed.
  expect_200 "www /faq" "$WWW/faq"
  expect_200 "www /blog" "$WWW/blog"
  expect_no_redirect "www AASA served directly" "$WWW/.well-known/apple-app-site-association"

  echo "== security headers are actually being served =="
  # These lived in a `_headers` at the repo ROOT, which the asset binding never
  # reads, so the site served NONE of them from launch until 2026-08-11 while
  # CLAUDE.md documented all four as configured. Nothing reported it: a missing
  # response header is invisible in a deploy log, in the build, and in the
  # browser. Asserting them live is the only thing that can tell the difference
  # between "configured" and "in effect".
  expect_header "www X-Frame-Options" "$WWW/" "X-Frame-Options" "DENY"
  expect_header "www X-Content-Type-Options" "$WWW/" "X-Content-Type-Options" "nosniff"
  expect_header "www Referrer-Policy" "$WWW/" "Referrer-Policy" "strict-origin-when-cross-origin"
  expect_header "www Permissions-Policy" "$WWW/" "Permissions-Policy" "camera=()"
  expect_header "www HSTS" "$WWW/" "Strict-Transport-Security" "max-age="

  echo "== AASA content is intact on both hosts =="
  aasa_apex=$(curl -sS -m 20 "$APEX/.well-known/apple-app-site-association" 2>/dev/null)
  aasa_www=$(curl -sS -m 20 "$WWW/.well-known/apple-app-site-association" 2>/dev/null)
  if printf '%s' "$aasa_apex" | grep -q '2DDFX89NYB.com.prepwise.mobile'; then
    pass "apex AASA names our app id"
  else
    fail "apex AASA names our app id" "appID missing from apex AASA"
  fi
  if [ "$aasa_apex" = "$aasa_www" ]; then
    pass "AASA identical on apex and www"
  else
    fail "AASA identical on apex and www" "apex and www AASA differ"
  fi

  echo "== apex TXT set (Search Console ownership + email auth) =="
  # The Domain property was verified by DNS on 2026-07-27, so the ownership
  # proof lives ONLY in Cloudflare DNS - there is no artefact in this repo that
  # proves it and nothing else watches it. Google re-checks periodically and
  # silently un-verifies the property if the record disappears, which stops the
  # entire search-data feed with no error anywhere.
  #
  # Queried over DoH rather than `dig` so this needs no dnsutils in CI, and
  # answered by Google's own resolver - the closest available proxy for what
  # Google's verifier actually sees.
  txt_json=$(curl -sS -m 20 -H 'accept: application/dns-json' \
    'https://dns.google/resolve?name=prepwise-app.com&type=TXT' 2>/dev/null)
  txt_records=$(printf '%s' "$txt_json" | node -e '
    let s = "";
    process.stdin.on("data", d => (s += d)).on("end", () => {
      try {
        const j = JSON.parse(s);
        if (j.Status !== 0) process.exit(3);
        console.log((j.Answer || [])
          .filter(a => a.type === 16)
          .map(a => a.data.replace(/^"|"$/g, ""))
          .join("\n"));
      } catch { process.exit(3); }
    });' 2>/dev/null)
  doh_rc=$?
  if [ "$doh_rc" -ne 0 ]; then
    # Cannot tell, so assert nothing. A third-party resolver blip must not fail
    # a deploy - a flaky guardrail trains everyone to ignore it.
    skip "apex TXT set unreadable (DoH query failed) - GSC token and SPF not checked"
  else
    # Matches ANY google-site-verification value rather than a pinned token:
    # re-verifying under a different Google account legitimately rotates it, and
    # a pinned copy here would be a second source of truth that fails spuriously.
    # The failure actually being guarded is the record being DELETED. The value
    # is echoed so a rotation is still visible in the CI log.
    if printf '%s\n' "$txt_records" | grep -q '^google-site-verification='; then
      found=$(printf '%s\n' "$txt_records" | grep '^google-site-verification=' | head -1)
      pass "apex carries a Search Console verification TXT (${found:0:52}...)"
    else
      fail "apex carries a Search Console verification TXT" \
        "no google-site-verification TXT on prepwise-app.com - the Domain property will un-verify and the search-data feed stops silently. Re-add it; see landing/seo/search-console-setup.md"
    fi
    # Same record SET as the token above, which is why this is asserted here: the
    # apex TXT set carries both, and the way people break SPF is by REPLACING a
    # TXT record while managing the verification one instead of adding alongside.
    if printf '%s\n' "$txt_records" | grep -q '^v=spf1'; then
      pass "apex SPF record intact"
    else
      fail "apex SPF record intact" \
        "no v=spf1 TXT on prepwise-app.com - email deliverability for the domain breaks. A TXT record was probably replaced instead of added alongside."
    fi
  fi

  echo "== Google Search Console verification files =="
  # Read the configured tokens out of the worker rather than restating them here:
  # a second list is a second place to forget. Node is already a build
  # dependency, and worker/index.js has no side effects at module scope.
  gsc_tokens=$(node -e \
    "import('$REPO_ROOT/worker/index.js').then(m=>console.log(m.GOOGLE_VERIFICATION_FILES.join(' ')))" \
    2>/dev/null)
  if [ -z "$gsc_tokens" ]; then
    # NOT a pass. Nothing was checked, and printing "ok" for that is how a
    # guardrail turns into decoration.
    skip "no GSC token configured yet (GOOGLE_VERIFICATION_FILES in worker/index.js is empty)"
  else
    for token in $gsc_tokens; do
      # GSC does not follow redirects, and Cloudflare's asset binding 307s
      # /x.html -> /x. If either host redirects, the property silently fails to
      # verify and the SEO feedback loop has no data source.
      expect_no_redirect "www /$token served directly" "$WWW/$token"
      expect_no_redirect "apex /$token served directly" "$APEX/$token"
      expect_200 "www /$token" "$WWW/$token"
      body=$(curl -sS -m 20 "$WWW/$token" 2>/dev/null)
      if [ "$body" = "google-site-verification: $token" ]; then
        pass "$token body is the exact verification string"
      else
        fail "$token body is the exact verification string" "got: ${body:0:80}"
      fi
    done
  fi

  echo "== generated SEO files point at www only =="
  robots=$(curl -sS -m 20 "$WWW/robots.txt" 2>/dev/null)
  sitemap=$(curl -sS -m 20 "$WWW/sitemap.xml" 2>/dev/null)
  if printf '%s' "$robots" | grep -q "Sitemap: $WWW/sitemap.xml"; then
    pass "robots.txt points at the www sitemap"
  else
    fail "robots.txt points at the www sitemap" "got: $(printf '%s' "$robots" | tr '\n' ' ')"
  fi
  # prepwise.app is NOT our domain. It belongs to an unrelated company, and the
  # deployed robots.txt pointed crawlers at their sitemap until 2026-07-26.
  for f in robots sitemap; do
    body=$([ "$f" = robots ] && printf '%s' "$robots" || printf '%s' "$sitemap")
    if printf '%s' "$body" | grep -qE 'https://(www\.)?prepwise\.app|legal\.prepwise\.app'; then
      fail "$f.xml/txt free of the wrong domain" "references prepwise.app, which we do not own"
    else
      pass "$f free of the wrong domain"
    fi
  done
}

for attempt in $(seq 1 "$ATTEMPTS"); do
  if [ "$attempt" -gt 1 ]; then
    echo "-- retry $attempt/$ATTEMPTS after ${SETTLE_SECONDS}s (deploy may still be propagating) --"
    sleep "$SETTLE_SECONDS"
  fi
  # Called directly, NOT via $(...): command substitution runs the function in a
  # subshell, so `failures` would never propagate back and this guard would
  # always "pass". A vacuous check is the one failure mode a guardrail cannot have.
  run_all_checks
  [ "$failures" -eq 0 ] && break
done

echo
if [ "$failures" -gt 0 ]; then
  echo "FAILED $failures of $checks live routing checks"
  exit 1
fi
echo "ok - all $checks live routing checks passed"
