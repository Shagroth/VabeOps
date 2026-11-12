import { test } from "node:test";
import assert from "node:assert/strict";
import { redact, maskEmail, getOrCreateCorrelationId } from "./logger.ts";

test("redact masks keys matching sensitive patterns", () => {
  const out = redact({
    token: "abc123",
    password: "hunter2",
    Authorization: "Bearer xyz",
    cookie: "session=1",
    DATABASE_URL: "postgres://user:pass@host/db",
    apiKey: "sk_live_xxx",
    nested: { secret: "shh", keepMe: "visible" },
  }) as Record<string, unknown>;

  assert.equal(out.token, "[redacted]");
  assert.equal(out.password, "[redacted]");
  assert.equal(out.Authorization, "[redacted]");
  assert.equal(out.cookie, "[redacted]");
  assert.equal(out.DATABASE_URL, "[redacted]");
  assert.equal(out.apiKey, "[redacted]");
  assert.equal((out.nested as Record<string, unknown>).secret, "[redacted]");
  assert.equal((out.nested as Record<string, unknown>).keepMe, "visible");
});

test("redact masks magic-link style URLs found as plain values", () => {
  const out = redact({
    link: "https://app.example.com/api/auth/callback/resend?callbackUrl=%2F&token=abcdef",
    safe: "https://app.example.com/privacy",
  }) as Record<string, unknown>;

  assert.equal(out.link, "[redacted]");
  assert.equal(out.safe, "https://app.example.com/privacy");
});

test("redact leaves non-sensitive data untouched", () => {
  const out = redact({ event: "application_submitted", count: 3 }) as Record<string, unknown>;
  assert.equal(out.event, "application_submitted");
  assert.equal(out.count, 3);
});

test("maskEmail keeps up to the first two local-part characters", () => {
  assert.equal(maskEmail("andrey@example.com"), "an***@example.com");
  assert.equal(maskEmail("a@example.com"), "a***@example.com");
});

test("maskEmail redacts entirely when there is no @", () => {
  assert.equal(maskEmail("not-an-email"), "[redacted]");
});

test("getOrCreateCorrelationId reuses a safe-looking x-request-id header", () => {
  const headers = new Headers({ "x-request-id": "req-123_ABC" });
  assert.equal(getOrCreateCorrelationId(headers), "req-123_ABC");
});

test("getOrCreateCorrelationId ignores an unsafe header value and mints a UUID", () => {
  const headers = new Headers({ "x-request-id": "not a valid id!" });
  const id = getOrCreateCorrelationId(headers);
  assert.match(id, /^[0-9a-f-]{36}$/);
});

test("getOrCreateCorrelationId mints a UUID when no header is present", () => {
  const id = getOrCreateCorrelationId(undefined);
  assert.match(id, /^[0-9a-f-]{36}$/);
});
