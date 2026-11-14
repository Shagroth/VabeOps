import assert from "node:assert/strict";
import test from "node:test";
import { isAssignableRole, parseEnrollmentInput } from "./enrollment.ts";

test("parseEnrollmentInput normalises email and name", () => {
  const r = parseEnrollmentInput({ email: "  Ivan@Example.COM ", level: "NOVICE", name: "  Иван  " });
  assert.deepEqual(r, { ok: true, value: { email: "ivan@example.com", level: "NOVICE", name: "Иван" } });
});

test("parseEnrollmentInput rejects bad email and missing level", () => {
  assert.equal(parseEnrollmentInput({ email: "nope", level: "NOVICE" }).ok, false);
  assert.equal(parseEnrollmentInput({ email: "a@b.co", level: "ADMIN" }).ok, false);
  assert.equal(parseEnrollmentInput({ email: "a@b.co", level: "STRONG" }).ok, true);
});

test("only STUDENT and MENTOR are assignable from the UI", () => {
  assert.equal(isAssignableRole("MENTOR"), true);
  assert.equal(isAssignableRole("STUDENT"), true);
  assert.equal(isAssignableRole("ADMIN"), false);
  assert.equal(isAssignableRole("EDITOR"), false);
});
