import assert from "node:assert/strict";
import test from "node:test";
import { canonicalHost, canonicalRedirect } from "./canonical-host.ts";

const base = { pathname: "/modules/abc", search: "?x=1", siteUrl: "https://kitegrip.com", production: true };

test("canonicalHost prefers the configured site url", () => {
  assert.equal(canonicalHost("https://kitegrip.com"), "kitegrip.com");
  assert.equal(canonicalHost("https://school.example.org/"), "school.example.org");
});

test("canonicalHost ignores missing, local and generated addresses", () => {
  for (const url of [undefined, "", "not a url", "http://localhost:3000", "https://web-production-fd720275.up.railway.app"]) {
    assert.equal(canonicalHost(url), "kitegrip.com");
  }
});

test("requests on the generated domain go to the site's own domain, path and query kept", () => {
  assert.equal(
    canonicalRedirect({ ...base, requestHost: "web-production-fd720275.up.railway.app" }),
    "https://kitegrip.com/modules/abc?x=1",
  );
  assert.equal(
    canonicalRedirect({
      ...base,
      requestHost: "web-production-fd720275.up.railway.app",
      pathname: "/api/auth/callback/resend",
      search: "?token=t&email=a%40b.c",
    }),
    "https://kitegrip.com/api/auth/callback/resend?token=t&email=a%40b.c",
  );
});

test("a stale site url pointing at the generated domain does not cause a loop", () => {
  assert.equal(
    canonicalRedirect({ ...base, requestHost: "web-production-fd720275.up.railway.app", siteUrl: "https://web-production-fd720275.up.railway.app" }),
    "https://kitegrip.com/modules/abc?x=1",
  );
});

test("nothing is redirected on the own domain, unknown hosts, health checks or outside production", () => {
  assert.equal(canonicalRedirect({ ...base, requestHost: "kitegrip.com" }), null);
  assert.equal(canonicalRedirect({ ...base, requestHost: "www.kitegrip.com" }), null);
  assert.equal(canonicalRedirect({ ...base, requestHost: "10.0.0.5:8080" }), null);
  assert.equal(canonicalRedirect({ ...base, requestHost: null }), null);
  assert.equal(canonicalRedirect({ ...base, requestHost: "web-production-fd720275.up.railway.app", pathname: "/api/health", search: "" }), null);
  assert.equal(canonicalRedirect({ ...base, requestHost: "web-production-fd720275.up.railway.app", production: false }), null);
});
