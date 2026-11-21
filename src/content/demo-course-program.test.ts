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

test("engineers' concept steps carry theory, a scheme, a scenario question and a task per role", async () => {
  const { ENGINEER_ROLES } = await import("./engineer-roles.ts");
  for (const courseModule of PROTOTYPE_MODULES) {
    const concept = courseModule.steps.slice(1, 5);
    assert.equal(concept.length, 4);
    for (const step of concept) {
      const where = `module ${courseModule.number} / ${step.id}`;
      assert.ok(step.theory && step.theory.length >= 3, `${where}: theory`);
      assert.ok(step.diagram, `${where}: scheme`);
      assert.deepEqual(step.roleTasks?.map((t) => t.role), [...ENGINEER_ROLES], `${where}: role tasks`);
      assert.ok(step.roleTasks?.every((t) => t.task.length > 60), `${where}: role tasks are real tasks`);
      const cp = step.checkpoint;
      assert.ok(cp && cp.options.length === 4, `${where}: four options`);
      assert.ok(cp.options.some((o) => o.id === cp.correctId), `${where}: correct option exists`);
    }
  }
});

test("the task contract demo and every homework offer a scenario per engineering role", async () => {
  const { ENGINEER_ROLES } = await import("./engineer-roles.ts");
  const { ROLE_CONTRACT_TEMPLATES, CONTRACT_FIELDS } = await import("./demo-course.ts");
  assert.deepEqual(ROLE_CONTRACT_TEMPLATES.map((t) => t.role), [...ENGINEER_ROLES]);
  for (const template of ROLE_CONTRACT_TEMPLATES) {
    for (const field of CONTRACT_FIELDS) {
      assert.ok(template.contract[field.key].trim().length >= 12, `${template.role}: ${field.key}`);
    }
  }
  for (const assignment of HOMEWORK_ASSIGNMENTS) {
    assert.deepEqual(assignment.tracks?.map((t) => t.role), [...ENGINEER_ROLES], `homework ${assignment.moduleNumber}`);
  }
});

test("module 01 produces a decision record with two failure scenarios and binary review", () => {
  const firstModule = PROTOTYPE_MODULES[0];
  assert.equal(firstModule.artifactFile, "agent-decision-record.md");
  assert.deepEqual(firstModule.steps.slice(1, 5).map((step) => step.minutes), [12, 11, 15, 10]);
  assert.equal(firstModule.steps.find((step) => step.id === "failure-modes")?.examples?.length, 5);
  assert.ok(firstModule.labFields.some((field) => field.key === "alternatives"));
  assert.deepEqual(firstModule.labFields.filter((field) => field.key.startsWith("failure")).map((field) => field.key), ["failureOne", "failureTwo"]);
  assert.equal(HOMEWORK_ASSIGNMENTS[0].reviewMode, "decision");
  assert.ok(HOMEWORK_ASSIGNMENTS[0].deliverables.tree.endsWith(firstModule.artifactFile));
});
