import assert from "node:assert/strict";
import test from "node:test";
import { COURSES, COURSE_KEYS, getCourse, isPublicCourseModule } from "./course-catalog.ts";

test("every course has five modules with content and homework", () => {
  for (const key of COURSE_KEYS) {
    const course = COURSES[key];
    assert.deepEqual(course.modules.map((m) => m.number), [1, 2, 3, 4, 5]);
    for (const m of course.modules) {
      const content = course.getContent(m.number);
      assert.ok(content, `${key} module ${m.number} has content`);
      assert.ok(content.homework, `${key} module ${m.number} has homework`);
      assert.equal(content.homework.moduleNumber, m.number);
    }
    assert.equal(course.getContent(null), null);
    assert.equal(course.getContent(6), null);
  }
});

test("rubrics add up to 20 and the pass score is reachable", () => {
  for (const key of COURSE_KEYS) {
    const course = COURSES[key];
    assert.equal(course.scoring.reduce((sum, c) => sum + c.points, 0), 20);
    assert.ok(course.passScore > 0 && course.passScore <= 20);
  }
});

test("only modules 1 and 2 are public in both courses", () => {
  for (const key of COURSE_KEYS) {
    const course = COURSES[key];
    assert.deepEqual([1, 2, 3, 4, 5].filter((n) => isPublicCourseModule(course, n)), [1, 2]);
  }
});

test("unknown course keys fall back to engineers", () => {
  assert.equal(getCourse("FIRST_FLIGHT").key, "FIRST_FLIGHT");
  assert.equal(getCourse(undefined).key, "ENGINEERS");
  assert.equal(getCourse("DESIGNERS").key, "ENGINEERS");
});

test("first flight lessons: every concept step has theory, a scheme and a checkpoint", () => {
  for (const m of COURSES.FIRST_FLIGHT.modules) {
    const prototype = COURSES.FIRST_FLIGHT.getContent(m.number)?.prototype;
    assert.ok(prototype);
    assert.equal(prototype.steps.length, 7);
    assert.ok(prototype.storageKey?.startsWith("kitegrip-first-flight-"));
    for (const step of prototype.steps.slice(1, 5)) {
      assert.ok(step.theory && step.theory.length >= 2, `${m.number}/${step.id} theory`);
      assert.ok(step.diagram, `${m.number}/${step.id} diagram`);
      const cp = step.checkpoint;
      assert.ok(cp, `${m.number}/${step.id} checkpoint`);
      assert.ok(cp.options.some((o) => o.id === cp.correctId));
    }
    assert.equal(prototype.labFields.length, 5);
    assert.ok(prototype.labFields.every((f) => f.example.trim().length >= 12));
  }
});
