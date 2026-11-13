import assert from "node:assert/strict";
import test from "node:test";
import { HOMEWORK_ASSIGNMENTS, HOMEWORK_SCORING } from "./demo-course-homework.ts";
import { PROGRAM_MODULES, PROGRAM_TOTALS, PROTOTYPE_MODULES } from "./demo-course-program.ts";

test("flagship prototype contains five seven-screen modules", () => {
  assert.equal(PROGRAM_MODULES.length, 5);
  assert.equal(PROGRAM_TOTALS.screens, 35);
  assert.deepEqual(PROGRAM_MODULES.map((courseModule) => courseModule.number), [1, 2, 3, 4, 5]);
  assert.ok(PROGRAM_MODULES.every((courseModule) => courseModule.stepCount === 7));
});

test("prototype step estimates fit each advertised guided-time range", () => {
  for (const courseModule of PROTOTYPE_MODULES) {
    const stepMinutes = courseModule.steps.reduce((total, step) => total + step.minutes, 0);
    assert.ok(stepMinutes >= courseModule.guidedMinutes[0], `module ${courseModule.number} is shorter than its estimate`);
    assert.ok(stepMinutes <= courseModule.guidedMinutes[1], `module ${courseModule.number} is longer than its estimate`);
  }
});

test("every prototype module has a gated learning path and a complete artifact schema", () => {
  for (const courseModule of PROTOTYPE_MODULES) {
    assert.equal(courseModule.steps.filter((step) => step.checkpoint).length, 5);
    assert.equal(courseModule.labFields.length, 6);
    assert.equal(new Set(courseModule.labFields.map((field) => field.key)).size, courseModule.labFields.length);
    assert.ok(courseModule.labFields.every((field) => field.example.length >= 12));
    assert.ok(courseModule.rubric.length >= 6);
  }
});

test("every module has one complete homework assignment with an honest time estimate", () => {
  assert.equal(HOMEWORK_ASSIGNMENTS.length, 5);
  assert.deepEqual(HOMEWORK_ASSIGNMENTS.map((assignment) => assignment.moduleNumber), [1, 2, 3, 4, 5]);
  assert.equal(new Set(HOMEWORK_ASSIGNMENTS.map((assignment) => assignment.moduleNumber)).size, 5);

  for (const assignment of HOMEWORK_ASSIGNMENTS) {
    const courseModule = PROGRAM_MODULES.find((item) => item.number === assignment.moduleNumber);
    assert.ok(courseModule, `module ${assignment.moduleNumber} is missing`);
    assert.deepEqual(courseModule.practiceMinutes, assignment.estimatedMinutes);
    assert.ok(assignment.tasks.length >= 6);
    assert.ok(assignment.acceptance.length >= 6);
    assert.ok(assignment.deliverables.tree.includes(`homework-0${assignment.moduleNumber}/`));
  }
});

test("homework scoring rubric totals twenty points", () => {
  assert.equal(HOMEWORK_SCORING.reduce((total, item) => total + item.points, 0), 20);
});
