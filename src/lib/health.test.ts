import { test } from "node:test";
import assert from "node:assert/strict";
import { runHealthCheck } from "./health.ts";

test("runHealthCheck reports ok when the database probe resolves", async () => {
  const result = await runHealthCheck(async () => {}, 50);
  assert.equal(result.status, "ok");
  assert.equal(result.checks.app, "ok");
  assert.equal(result.checks.database, "ok");
});

test("runHealthCheck reports error when the database probe rejects", async () => {
  const result = await runHealthCheck(async () => {
    throw new Error("connection refused");
  }, 50);
  assert.equal(result.status, "error");
  assert.equal(result.checks.app, "ok");
  assert.equal(result.checks.database, "error");
});

test("runHealthCheck reports error when the database probe exceeds the timeout", async () => {
  const result = await runHealthCheck(
    () => new Promise((resolve) => setTimeout(resolve, 500)),
    20
  );
  assert.equal(result.status, "error");
  assert.equal(result.checks.database, "error");
});

test("runHealthCheck never throws, even when the probe rejects", async () => {
  await assert.doesNotReject(async () => {
    await runHealthCheck(async () => {
      throw new Error("boom");
    }, 50);
  });
});
