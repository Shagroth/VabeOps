import { test } from "node:test";
import assert from "node:assert/strict";
import { sendNotifyEmail } from "./notify-email.ts";

const PARAMS = {
  to: "author@example.com",
  subject: "Новая сдача",
  text: "Участник сдал неделю 2.",
  apiKey: "re_test_key",
  from: "VabeOps <no-reply@vabeops.example.com>",
};

test("sendNotifyEmail resolves ok on a 200 response and sends the right body", async () => {
  const calls: Array<{ url: string; init: RequestInit }> = [];
  const fakeFetch = async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    return new Response(JSON.stringify({ id: "email_1" }), { status: 200 });
  };

  const result = await sendNotifyEmail(PARAMS, "cid-1", "submission_notify_sent", fakeFetch);

  assert.deepEqual(result, { ok: true });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://api.resend.com/emails");
  const body = JSON.parse(String(calls[0].init.body));
  assert.equal(body.to, PARAMS.to);
  assert.equal(body.subject, PARAMS.subject);
  assert.equal(body.text, PARAMS.text);
  assert.equal(body.html, undefined, "plain text only, no HTML body");
});

test("sendNotifyEmail never throws — returns ok:false on a non-ok Resend response", async () => {
  const fakeFetch = async () => new Response(JSON.stringify({ message: "invalid api key" }), { status: 401 });

  const result = await sendNotifyEmail(PARAMS, "cid-2", "submission_notify_sent", fakeFetch);

  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.errorCode, "RESEND_HTTP_401");
    assert.doesNotMatch(result.errorCode, /invalid api key/);
  }
});

test("sendNotifyEmail never throws — returns ok:false on a network failure", async () => {
  const fakeFetch = async () => {
    throw new TypeError("fetch failed");
  };

  const result = await sendNotifyEmail(PARAMS, "cid-3", "feedback_notify_sent", fakeFetch);

  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.errorCode, "RESEND_NETWORK_ERROR");
});

test("sendNotifyEmail is bounded by its timeout and doesn't hang forever", async () => {
  const neverResolves: typeof fetch = (_url, init) =>
    new Promise((_resolve, reject) => {
      const signal = (init as RequestInit)?.signal;
      const inFlightRequest = setTimeout(() => {}, 1000);
      signal?.addEventListener(
        "abort",
        () => {
          clearTimeout(inFlightRequest);
          reject(new DOMException("timed out", "TimeoutError"));
        },
        { once: true }
      );
    });

  const start = Date.now();
  const result = await sendNotifyEmail(PARAMS, "cid-4", "submission_notify_sent", neverResolves, 20);
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.errorCode, "RESEND_TIMEOUT");
  assert.ok(Date.now() - start < 2000, "should fail quickly instead of hanging");
});
