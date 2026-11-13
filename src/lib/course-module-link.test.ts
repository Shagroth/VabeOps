import assert from "node:assert/strict";
import test from "node:test";
import { parseCourseModuleNumber, planProgramWeeks } from "./course-module-link.ts";

test("parseCourseModuleNumber accepts only 1..5", () => {
  assert.equal(parseCourseModuleNumber("1"), 1);
  assert.equal(parseCourseModuleNumber("5"), 5);
  assert.equal(parseCourseModuleNumber(""), null);
  assert.equal(parseCourseModuleNumber("0"), null);
  assert.equal(parseCourseModuleNumber("6"), null);
  assert.equal(parseCourseModuleNumber("2.5"), null);
  assert.equal(parseCourseModuleNumber("abc"), null);
  assert.equal(parseCourseModuleNumber(null), null);
});

const PROGRAM = [1, 2, 3, 4, 5].map((n) => ({ number: n, shortTitle: `M${n}` }));

test("planProgramWeeks creates all weeks, only week 1 open", () => {
  const plan = planProgramWeeks(PROGRAM, []);
  assert.deepEqual(plan.map((w) => w.weekNumber), [1, 2, 3, 4, 5]);
  assert.deepEqual(plan.map((w) => w.isOpen), [true, false, false, false, false]);
  assert.ok(plan.every((w) => w.courseModuleNumber === w.weekNumber));
});

test("planProgramWeeks skips weeks that already exist", () => {
  const plan = planProgramWeeks(PROGRAM, [1, 3]);
  assert.deepEqual(plan.map((w) => w.weekNumber), [2, 4, 5]);
});
