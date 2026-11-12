import { test } from "node:test";
import assert from "node:assert/strict";
import { magicLinkEmailHtml, magicLinkEmailText } from "./magic-link-email.ts";

test("magicLinkEmailHtml includes the sign-in link and escapes the host", () => {
  const out = magicLinkEmailHtml({ url: "https://vabeops.example.com/callback?token=abc", host: "vabeops.example.com" });
  assert.match(out, /href="https:\/\/vabeops\.example\.com\/callback\?token=abc"/);
  assert.match(out, /vabeops&#8203;\.example&#8203;\.com/);
});

test("magicLinkEmailText contains the link on its own line", () => {
  const out = magicLinkEmailText({ url: "https://vabeops.example.com/callback?token=abc", host: "vabeops.example.com" });
  assert.match(out, /^Sign in to vabeops\.example\.com\n/);
  assert.match(out, /https:\/\/vabeops\.example\.com\/callback\?token=abc/);
});
