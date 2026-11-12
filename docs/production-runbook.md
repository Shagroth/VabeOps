# Production runbook

Operational reference for VabeOps during and after the December 2026
pilot. Audience: whoever is on call — likely just the author, given the
pilot's size. Pairs with `docs/production-readiness.md` (what changed and
why) and `AGENTS.md` (hard safety boundaries for any future automated
change).

## Deployment readiness checklist

Before merging a change that will deploy:

- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes
- [ ] `npm test` passes
- [ ] `npx prisma validate` passes
- [ ] `npm run build` passes locally
- [ ] If `prisma/schema.prisma` changed: the Railway pre-deploy command is
      `npx prisma db push` (**without** `--accept-data-loss`). A schema
      change that would lose data will **fail the deploy**, not silently
      apply — if that happens, don't add `--accept-data-loss` to make it
      pass; figure out why the change is destructive first.
- [ ] CI is green on the PR (`.github/workflows/ci.yml`)

## Checking Railway logs

Railway → project → the web service → **Deployments** tab for build
logs; **Logs** (or the service's observability tab) for runtime logs.
Filter by text — our structured logs are JSON lines in production, so you
can search for an `event` name (e.g. `magic_link_send_failed`) or a
`correlationId`.

## Using `/api/health`

```
GET /api/health
```

- `200` with `{"status":"ok","checks":{"app":"ok","database":"ok"}}` —
  healthy.
- `503` with `{"status":"error","checks":{"app":"ok","database":"error"}}`
  — the database check failed or timed out (bounded at ~2s). No stack
  trace, hostname, or connection string is ever in the body — check
  Railway logs for the correlating `health_check_failed` event instead.
- Always `Cache-Control: no-store` — don't expect a CDN/browser to have
  cached a stale result.
- No auth required by design (so Railway's own health checker, which
  doesn't send credentials, can call it).

Manual check: `curl -i https://<your-railway-url>/api/health`.

### Setting it as Railway's health-check path (manual, post-merge)

This PR does **not** change Railway settings — do this by hand once the
PR is merged and deployed:

1. Railway dashboard → the web service → **Settings** → **Deploy** →
   **Healthcheck Path**.
2. Set it to `/api/health`.
3. Leave the healthcheck timeout at Railway's default unless you have a
   specific reason to change it — the endpoint itself is bounded to
   ~2 seconds.
4. Redeploy (or wait for the next deploy) and confirm Railway shows the
   service as healthy.

## Tracing an error by correlation ID

1. Find the correlation ID: either from a user/error-page report (the
   `digest` shown on our error pages — Next's built-in error hash, not
   something we mint), or from a `correlationId` field in a log line.
2. Search Railway logs for that exact string. Structured log lines are
   JSON with `correlationId` as a top-level field, so an exact-match
   search is reliable (no partial-match false positives from similar IDs).
3. The matching `event` name tells you what happened:
   `health_check_failed`, `application_submitted` /
   `application_duplicate_ignored` / `application_submit_failed`,
   `magic_link_sent` / `magic_link_send_failed`, (Studio publish /
   submission-save events, same pattern).
4. `errorCode` on a failure line is a stable short code (e.g.
   `RESEND_TIMEOUT`, `DB_WRITE_FAILED`, `DB_UNAVAILABLE`) — safe to
   mention in an issue or to the reporting user; it never contains a raw
   provider message, stack trace, or connection string.

## Incident: database unavailable

Symptoms: `/api/health` returns 503 with `database: "error"`; pages that
read from Postgres show the `error.tsx`/`admin/error.tsx`/`studio/error.tsx`
fallback UI.

1. Check Railway's Postgres plugin status in the dashboard — is the
   database service itself up?
2. Check the web service's logs for `health_check_failed` /
   `DB_UNAVAILABLE` and any Prisma connection errors around the same
   time.
3. If the Postgres service is down: this is a Railway-side incident —
   there's nothing to roll back in the app; wait for Railway/Postgres to
   recover, then confirm `/api/health` returns 200 again.
4. If the app can't reach a healthy Postgres (e.g. after a `DATABASE_URL`
   change): verify the variable in Railway's Variables tab *without*
   printing its value in chat/logs/issues (see "never paste" below) —
   confirm it's set, don't confirm what it is.

## Incident: email provider (Resend) failing

Symptoms: `magic_link_send_failed` log events; pilot participants report
they never got a sign-in email; `/auth/error` page shown after
submitting the sign-in form.

1. Check the `errorCode` on the failure log: `RESEND_TIMEOUT` (provider
   slow/unreachable within 8s), `RESEND_HTTP_4xx`/`5xx` (provider
   rejected the request — commonly an invalid/expired API key or a
   suspended Resend account), `RESEND_NETWORK_ERROR` (DNS/connectivity).
2. For `RESEND_HTTP_401`/`403`: check Resend's own dashboard for account
   status; the API key may need rotating (see "never paste" below — do
   this via Railway's Variables tab and Resend's dashboard directly, not
   by pasting the key anywhere else).
3. For repeated `RESEND_TIMEOUT`: check Resend's status page for an
   ongoing incident before assuming it's our app.
4. This is a user-facing but non-destructive failure — no retry/backoff
   is needed beyond asking the participant to try again once the
   provider issue clears.

## Incident: a deploy's pre-deploy step failed

Symptoms: Railway shows the deployment stuck/failed at the pre-deploy
command (`npx prisma db push`).

1. Read the actual error in Railway's build logs — `db push` without
   `--accept-data-loss` fails loudly (not silently) when a schema change
   would lose data. That's the intended safety behavior, not a bug to
   route around.
2. Don't add `--accept-data-loss` to make it pass. Instead: figure out
   why the migration is destructive (e.g. a new required column with no
   default, a dropped column that still has data) and fix the schema
   change itself, or handle the data migration deliberately.
3. Until fixed, the previous deployment stays live — a failed pre-deploy
   step does not take the running app down.

## Rolling back the web deployment

Railway dashboard → the web service → **Deployments** → find the last
known-good deployment → **Redeploy** (or "Rollback" if shown). This
redeploys that build's artifact; it does **not** revert the database
schema. If the incident involved a schema change, a code rollback alone
may not be enough — assess whether the old code is still compatible with
the current (possibly already-migrated) schema before rolling back.

## Verifying recovery

After any incident response:

1. `curl -i https://<your-railway-url>/api/health` → expect `200` and
   `status: "ok"`.
2. Load the homepage and `/demo-course` in a browser — no console
   errors, no CSP violations (check devtools console).
3. If the incident touched auth: do a real sign-in attempt with a test
   account you control (don't use a pilot participant's email) and
   confirm the email arrives and the link works.
4. Watch Railway logs for a few minutes for any repeated failure events.

## Database backups (Railway Postgres)

- **Checking backup availability is a manual, human step** — this
  requires looking at Railway's plan/billing page, which has billing
  implications outside what an automated change should decide. Go to
  the Postgres service → **Backups** tab and confirm a recent automatic
  backup exists (or that Railway's current plan includes them) before
  any schema change.
- **Before a schema change that touches existing data** (not a purely
  additive one like a new nullable column): take a manual backup from
  that same Backups tab, even if automatic backups are enabled.
- **Test a restore only against a separate, non-production database** —
  e.g. a local Postgres or a throwaway Railway Postgres instance. Never
  practice a restore against the pilot's production database.
- Enabling backups, changing the backup plan, or performing a restore are
  **not** things this repo's automation should do — they require a human
  with billing/plan authority.

## Information that must never be pasted into issues, chat, or logs

- `DATABASE_URL` (or any fragment of it — including just the host/port)
- `AUTH_SECRET`, `AUTH_RESEND_KEY`, R2 credentials, any API key
- A magic-link URL (it's a live, single-use credential until used/expired)
- A participant's full email address — use the masked form
  (`an***@example.com`, same as our logs) when referring to a specific
  user in an issue
- Raw request/response bodies from `/apply` or any submission form
  (application answers, submission content)
- Full stack traces from production (an error `digest`/`correlationId` +
  the safe `errorCode` is enough to investigate from logs directly)

## Incident template

```
## What happened
(one or two sentences — symptom, not root cause yet)

## When
(first observed, still ongoing? / resolved at?)

## Correlation ID(s) / error code(s)
(from logs — see "Tracing an error by correlation ID" above)

## User impact
(how many pilot participants, which flow — sign-in / apply / submission / Studio)

## Resolution
(what fixed it, or current status if still open)

## Follow-up
(anything to change so this doesn't recur)
```

## Post-deploy smoke test

Run this after every deploy, before announcing it's live:

1. `curl -i https://<your-railway-url>/api/health` → `200`, `status: "ok"`.
2. Load `/` — hero renders, no console errors.
3. Load `/demo-course` — content renders.
4. Load `/apply` — form renders; **do not submit real or fake data**
   unless you intend to review/delete the resulting row afterward.
5. Load a route that doesn't exist (e.g. `/this-does-not-exist`) — confirm
   the on-brand 404 page appears, not a blank page or Next's default.
6. If the deploy touched auth: sign in with a test account you control
   and confirm the magic-link email arrives and the link works.
7. Check Railway logs for any unexpected `error`-level events in the few
   minutes after deploy.

## Future uptime monitoring (documented, not set up)

Not configured in this PR — no external account was created. When ready:

- Poll `GET /api/health` every 5 minutes from an external monitor.
- Alert only after **2 consecutive failures** (avoids paging on a single
  transient blip).
- Add a **separate** check on the homepage (`/`) — a health-check-only
  monitor can be green while the actual site is broken in a way the
  health check doesn't cover (e.g. a build artifact issue).
- Do **not** monitor any authenticated or secret-bearing URL (no
  `/admin`, no `/api/auth/*`, nothing with a token in the query string).
