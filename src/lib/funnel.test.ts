import assert from "node:assert/strict";
import test from "node:test";
import { funnelDay, parseFunnelHit, summarizeFunnel } from "./funnel.ts";

test("parseFunnelHit accepts only known course, module 1..5 and event", () => {
  assert.deepEqual(parseFunnelHit({ course: "FIRST_FLIGHT", moduleNumber: 2, event: "lab" }), {
    course: "FIRST_FLIGHT",
    moduleNumber: 2,
    event: "lab",
  });
  for (const bad of [
    null,
    "open",
    { course: "DESIGNERS", moduleNumber: 1, event: "open" },
    { course: "ENGINEERS", moduleNumber: 0, event: "open" },
    { course: "ENGINEERS", moduleNumber: 6, event: "open" },
    { course: "ENGINEERS", moduleNumber: "1", event: "open" },
    { course: "ENGINEERS", moduleNumber: 1.5, event: "open" },
    { course: "ENGINEERS", moduleNumber: 1, event: "signup" },
    { course: "ENGINEERS", moduleNumber: 1 },
  ]) {
    assert.equal(parseFunnelHit(bad), null);
  }
});

test("parseFunnelHit drops extra fields", () => {
  const hit = parseFunnelHit({ course: "ENGINEERS", moduleNumber: 1, event: "open", email: "a@b.c" });
  assert.deepEqual(hit, { course: "ENGINEERS", moduleNumber: 1, event: "open" });
});

test("funnelDay is midnight UTC", () => {
  assert.equal(funnelDay(new Date("2026-11-15T23:59:59+04:00")).toISOString(), "2026-11-15T00:00:00.000Z");
});

test("summarizeFunnel totals days and computes the share that reached the artifact", () => {
  const rows = [
    { course: "ENGINEERS", moduleNumber: 1, event: "open", count: 30 },
    { course: "ENGINEERS", moduleNumber: 1, event: "open", count: 10 },
    { course: "ENGINEERS", moduleNumber: 1, event: "artifact", count: 10 },
    { course: "FIRST_FLIGHT", moduleNumber: 1, event: "open", count: 99 },
    { course: "ENGINEERS", moduleNumber: 1, event: "unknown", count: 5 },
  ];
  const [m1, m2] = summarizeFunnel(rows, "ENGINEERS", [1, 2]);
  assert.equal(m1.counts.open, 40);
  assert.equal(m1.counts.artifact, 10);
  assert.equal(m1.reachedArtifactPct, 25);
  assert.equal(m2.counts.open, 0);
  assert.equal(m2.reachedArtifactPct, null);
});
