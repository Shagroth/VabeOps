import { test } from "node:test";
import assert from "node:assert/strict";
import { acceptProblemMessage, planAcceptance } from "./application-accept.ts";

const cohorts = [{ id: "new" }, { id: "old" }];

test("no cohort of the course is reported before the level", () => {
  assert.deepEqual(planAcceptance("", "", []), { ok: false, problem: "cohort" });
  assert.deepEqual(planAcceptance("NOVICE", "x", []), { ok: false, problem: "cohort" });
});

test("missing or unknown level is a problem, not an exception", () => {
  assert.deepEqual(planAcceptance("", "new", cohorts), { ok: false, problem: "level" });
  assert.deepEqual(planAcceptance("EXPERT", "new", cohorts), { ok: false, problem: "level" });
});

test("picks the requested cohort, falls back to the newest", () => {
  assert.deepEqual(planAcceptance("STRONG", "old", cohorts), { ok: true, level: "STRONG", cohortId: "old" });
  assert.deepEqual(planAcceptance("NOVICE", "", cohorts), { ok: true, level: "NOVICE", cohortId: "new" });
  assert.deepEqual(planAcceptance("NOVICE", "other-course", cohorts), { ok: true, level: "NOVICE", cohortId: "new" });
});

test("messages name the course and ignore unknown codes", () => {
  assert.match(acceptProblemMessage("cohort", "First Flight") ?? "", /First Flight/);
  assert.ok(acceptProblemMessage("level", "x"));
  assert.ok(acceptProblemMessage("mail", "x"));
  assert.equal(acceptProblemMessage("nope", "x"), null);
});
