import assert from "node:assert/strict";
import test from "node:test";
import { pickNextStep, type SubmissionStatusValue } from "./next-step.ts";

const w = (n: number, isOpen: boolean) => ({ id: `w${n}`, weekNumber: n, title: `W${n}`, isOpen });
const st = (entries: [string, SubmissionStatusValue][]) => new Map(entries);

test("no open weeks", () => {
  assert.deepEqual(pickNextStep([w(1, false)], st([])), { kind: "no-open-weeks" });
});

test("revision wins over an unstarted later week", () => {
  const r = pickNextStep([w(1, true), w(2, true)], st([["w1", "NEEDS_REVISION"]]));
  assert.equal(r.kind, "revision");
  assert.equal(r.kind === "revision" && r.week.id, "w1");
});

test("first open week without a submission", () => {
  const r = pickNextStep([w(2, true), w(1, true)], st([["w1", "ACCEPTED"]]));
  assert.equal(r.kind === "start" && r.week.id, "w2");
});

test("all open weeks submitted points at the next closed week", () => {
  const r = pickNextStep([w(1, true), w(2, false)], st([["w1", "SUBMITTED"]]));
  assert.deepEqual(r, { kind: "all-done", nextClosedWeek: w(2, false) });
});
