# Production readiness — audit and changes

Audit performed before the December 2026 five-person pilot. Scope: make
the existing, already-live app observable, diagnosable, and safer to
operate — not a redesign or feature addition. See `VIBE_OPS_HANDOFF.md`
for product/IA context; this document is operational, not editorial.

Priority: **P0** = would cause a silent/undiagnosable failure or a real
security gap during the pilot. **P1** = meaningfully improves operability
but pilot can run without it. **P2** = follow-up, out of scope for this PR.

| Area | Current state (before this PR) | Risk | Chosen fix | Priority |
|---|---|---|---|---|
| Health check | No `/api/health` endpoint. Railway has nothing to poll. | A crashed app or dead DB connection isn't detected until a human notices. | `GET /api/health`: app + bounded `SELECT 1` DB check, 200/503, no-store, no internal detail in the body. | P0 |
| Logging | `console.error`/none; no structured fields, no correlation ID, several call sites log raw data implicitly (none currently log secrets, but nothing prevents it either). | A failure during the pilot is hard to trace back to a specific request; a future change could accidentally log a token/email/DB URL. | `src/lib/logger.ts`: JSON-in-prod structured logger, `redact()` + `maskEmail()` helpers, correlation IDs on health/apply/magic-link/submission paths. | P0 |
| Error UX | No `app/error.tsx`, `global-error.tsx`, or `not-found.tsx` anywhere. An uncaught error in a Server Component shows Next's default error overlay/blank page; `/admin` and `/studio` have no DB-failure fallback. | Any unhandled error (including a transient DB hiccup) is a dead end for a pilot user or the author in `/admin`. | Root `error.tsx` + `global-error.tsx` + `not-found.tsx`, plus section-local `admin/error.tsx` and `studio/error.tsx`. On-brand copy, no stack traces, surfaces Next's built-in error `digest` as a support reference. | P0 |
| Environment access | `DATABASE_URL`/R2 vars read ad hoc via `process.env.X!`/direct access across `prisma.ts`, `r2.ts`; no guard against a server secret being imported into a Client Component. | A missing `DATABASE_URL` fails with a cryptic adapter error instead of a clear one; R2 misconfiguration throws instead of degrading; nothing stops a future accidental client-side import of a secret. | `src/lib/env.ts` (server-only, lazy) + `env-schema.ts` (pure, tested). R2 becomes a quiet no-op when unconfigured (`isR2Configured`). `.env.example` added (didn't exist in the repo before). | P0 |
| Error monitoring (Sentry) | Not installed. | None currently — just no remote visibility beyond Railway's own log viewer. | **Not added.** `@sentry/nextjs` + Next.js 16 + Turbopack compatibility is mixed as of this writing (see citation below); no Sentry account/DSN exists and creating one is out of scope (paid service / external account). Documented as a follow-up; local structured logging + correlation IDs + `/api/health` cover this pilot's scale. | P1 (documented, not implemented) |
| Security headers | None set anywhere (no `headers()` in `next.config.ts`, no proxy/middleware). | Missing clickjacking protection, MIME-sniffing protection, no CSP at all. | `next.config.ts` `headers()`: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, a `self`-only CSP (`frame-ancestors 'none'`, `object-src 'none'`, `form-action 'self'`), HSTS in production only. No nonce (would force dynamic rendering app-wide — a bad trade for a mostly-static site). `script-src`/`style-src` both need `'unsafe-inline'`: first-pass testing with a strict `script-src 'self'` broke every page in the browser, because Next.js itself (not our code) streams RSC payload data via inline `<script>` tags without a nonce present. This matches Next's own documented non-nonce CSP example exactly. `'unsafe-eval'` stays dev-only. | P0 |
| Public mutation resilience (`/apply`) | Honeypot + find-then-create idempotency-by-email already implemented (pre-existing, documented in-code as "not production-grade, appropriate for this pilot size"). No structured logging. | Already reasonable for 5–10 submissions; the only real gap was invisibility (can't tell from logs whether a submission landed, was deduped, or failed). | Kept the existing honeypot/idempotency design (did **not** add a DB-level `UNIQUE` constraint — see note below). Added correlation-ID logging for submit/duplicate/honeypot/failure, extracted into a pure, unit-tested `processApplicationSubmission`. | P1 |
| Magic-link email delivery | Default Auth.js Resend `sendVerificationRequest`: no timeout (hangs as long as `fetch` takes), throws the raw provider error on failure (reaches Auth.js's default, unstyled error page — no custom `pages.error`). | A slow/unreachable Resend could hang a sign-in request indefinitely; a failure wasn't logged anywhere or shown on-brand. | Custom `sendVerificationRequest` (`src/lib/magic-link-send.ts`) with an 8s bounded timeout, safe logging (masked email, no token), neutral thrown message. Added `/auth/error` page (`pages.error`) with copy that doesn't confirm/deny account existence. | P0 |
| CI | No `.github/workflows` at all. | Nothing catches a broken build, type error, or lint failure before merge. | `.github/workflows/ci.yml`: install → prisma generate/validate → lint → tsc → unit tests → build. Placeholder, unreachable `DATABASE_URL`; no migrate/db push/email in CI. | P0 |
| Dependency maintenance | No Dependabot config. | Security patches for Next/Prisma/Auth.js/etc. aren't surfaced automatically. | `.github/dependabot.yml`: weekly npm + GitHub Actions updates, grouped minor/patch, 5 open-PR cap, no auto-merge. | P1 |
| Node version pinning | No `engines` field; nothing pins Node in CI. | Could silently build on an EOL or mismatched Node version (e.g. Node 20 reaches end-of-life in 2026; Prisma 7 requires `^20.19 \|\| ^22.12 \|\| >=24`). | Added `"engines": {"node": "22.x"}` to `package.json`; CI pins Node 22 via `actions/setup-node`. **Changes the Node version Railway will build with on the next deploy — flagged as a manual verification item below, not applied.** | P1 |
| Operational runbook | None. | Nobody other than the original implementer knows how to check a Railway deploy, trace a failure, or safely roll back. | `docs/production-runbook.md` — see Phase 10. | P1 |
| `robots.txt` / `sitemap.ts` | Already correctly disallow `/admin`, `/studio`, `/modules`, `/stream`, `/auth`, `/api`, `/preview`; sitemap only lists genuinely public routes. `NEXT_PUBLIC_SITE_URL` falls back to a placeholder `vabeops.example.com` if unset. | None found — already correct. | No change. | — |
| Tests | `node --test` on `*.test.ts`; two existing suites (`validation`, `studio-permissions`), both pure/dependency-free. | Good existing pattern — extended rather than replaced. | Followed the same pattern for all new testable logic (health, logger, env-schema, apply-application, magic-link-send, magic-link-email). | — |

## Explicitly not done in this PR (and why)

- **DB-level `UNIQUE` constraint on `Application.email`.** Would close the
  theoretical race window in the find-then-create duplicate check, but
  adding a unique index via `prisma db push` (the documented Railway
  pre-deploy command — this repo doesn't use `prisma migrate deploy`)
  would fail the deploy if any duplicate emails already exist in
  production, and we were explicitly barred from reading/querying
  production data to check. Follow-up: have a human check
  `SELECT email, count(*) FROM "Application" GROUP BY email HAVING
  count(*) > 1` before adding this constraint.
- **Sentry / error monitoring SDK.** See table above and Phase 6 of
  `AGENTS.md`. Compatibility with Next.js 16 + Turbopack looks broadly
  workable per Sentry's own blog post, but at least one Turbopack-related
  loader issue has been filed against `sentry-javascript`
  ([getsentry/sentry-javascript#24650](https://github.com/getsentry/sentry-javascript/issues/24650)),
  and this repo has no Sentry account/DSN to actually validate against.
  Given the pilot's scale (5 people), the local structured logger +
  correlation IDs + `/api/health` are judged sufficient for now.
- **Nonce-based CSP.** Would force every page to render dynamically
  (no static optimization), a bad trade for a mostly-static marketing
  site. The `next.config.ts` CSP covers the same threat model
  (`frame-ancestors 'none'`, `script-src 'self'`) without that cost.
- **Changing `/admin`/`/studio` business logic, IA, or copy.** Out of
  scope — this PR only adds failure-state UI and logging around existing
  behavior.

## Manual actions required after merge (not done by this PR)

1. **Set `/api/health` as Railway's health-check path** for the web
   service (Settings → Health Check Path). This PR cannot change Railway
   service settings — see `docs/production-runbook.md` for the exact
   steps.
2. **Verify the Node 22 pin is safe before merging/deploying.** This PR
   adds `"engines": {"node": "22.x"}` to `package.json`. If Railway's
   current build already uses Node 22.x, this is a no-op; if it's on a
   different major version, the next deploy will build with Node 22 —
   confirm this is intended before merging (see
   `docs/production-runbook.md`).
3. **Check for duplicate `Application.email` rows** before ever adding a
   unique constraint on that column (see above).
4. If error monitoring is wanted later: create a Sentry account/DSN
   out-of-band, then re-evaluate `@sentry/nextjs` against whatever Next.js
   version is current at that time.
