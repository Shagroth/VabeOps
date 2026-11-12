import { test } from "node:test";
import assert from "node:assert/strict";
import { sendMagicLinkEmail, SEND_FAILED_MESSAGE } from "./magic-link-send.ts";

const PARAMS = {
  identifier: "person@example.com",
  url: "https://vabeops.example.com/api/auth/callback/resend?token=secret&callbackUrl=%2F",
  apiKey: "re_test_key",
  from: "VabeOps <no-reply@vabeops.example.com>",
};

test("sendMagicLinkEmail resolves on a 200 response", async () => {
  const calls: Array<{ url: string; init: RequestInit }> = [];
  const fakeFetch = async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    return new Response(JSON.stringify({ id: "email_123" }), { status: 200 });
  };

  await sendMagicLinkEmail(PARAMS, "cid-1", fakeFetch);

  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://api.resend.com/emails");
  const body = JSON.parse(String(calls[0].init.body));
  assert.equal(body.to, PARAMS.identifier);
  assert.match(String((calls[0].init.headers as Record<string, string>).Authorization), /Bearer re_test_key/);
});

test("sendMagicLinkEmail throws a neutral error when Resend returns a non-ok status", async () => {
  const fakeFetch = async () => new Response(JSON.stringify({ message: "invalid api key" }), { status: 401 });

  await assert.rejects(
    () => sendMagicLinkEmail(PARAMS, "cid-2", fakeFetch),
    (err: unknown) => {
      assert.ok(err instanceof Error);
      assert.equal(err.message, SEND_FAILED_MESSAGE);
      assert.doesNotMatch(err.message, /invalid api key/);
      return true;
    }
  );
});

test("sendMagicLinkEmail throws a neutral error on a network failure", async () => {
  const fakeFetch = async () => {
    throw new TypeError("fetch failed");
  };

  await assert.rejects(() => sendMagicLinkEmail(PARAMS, "cid-3", fakeFetch), /Could not send/);
});

test("sendMagicLinkEmail is bounded by its timeout and doesn't hang forever", async () => {
  const neverResolves: typeof fetch = (_url, init) =>
    new Promise((_resolve, reject) => {
      const signal = (init as RequestInit)?.signal;
      signal?.addEventListener("abort", () => reject(new DOMException("timed out", "TimeoutError")));
    });

  const start = Date.now();
  await assert.rejects(() => sendMagicLinkEmail(PARAMS, "cid-4", neverResolves, 20), /Could not send/);
  assert.ok(Date.now() - start < 2000, "should fail quickly instead of hanging");
});
