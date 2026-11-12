import type { NextConfig } from "next";

// Conservative, tested-against-this-app baseline (AGENTS.md Phase 7).
// No nonces: this app is mostly statically rendered, and a nonce-based
// CSP forces dynamic rendering on every page (see Next's CSP guide) —
// a bad trade for a 5-person pilot. Without a nonce, Next.js itself
// (not our code) emits inline <script> tags to stream RSC payload data,
// so script-src needs 'unsafe-inline' too — verified live via browser:
// a strict `script-src 'self'` blocked those and broke every page.
// This matches Next's own documented "Without Nonces" CSP example
// exactly (app/guides/content-security-policy.md). 'unsafe-eval' stays
// dev-only (React's error-stack reconstruction in dev uses eval; not
// used in production builds) — this is the one directive we do NOT
// relax in production, since nothing in this app requires it there.
const isProd = process.env.NODE_ENV === "production";

const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Belt-and-suspenders alongside frame-ancestors above — superseded by
  // CSP in modern browsers but harmless for the few that don't honor it.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()",
  },
  { key: "Content-Security-Policy", value: CSP },
  // HTTPS-only, production-only: Railway terminates TLS in front of the
  // app, so this is safe to send unconditionally once in production —
  // but only once, deliberately not with `preload` (that's a one-way,
  // browser-list-wide commitment we shouldn't make from a config file).
  ...(isProd
    ? [{ key: "Strict-Transport-Security", value: "max-age=15552000; includeSubDomains" }]
    : []),
];

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
