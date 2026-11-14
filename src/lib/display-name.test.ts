import assert from "node:assert/strict";
import test from "node:test";
import { displayName, normalizeDisplayName } from "./display-name.ts";

test("displayName prefers the name and never falls back to an email", () => {
  assert.equal(displayName({ name: "Андрей" }), "Андрей");
  assert.equal(displayName({ name: "  " }), "Участник");
  assert.equal(displayName(null), "Участник");
  assert.equal(displayName({ name: null }, "Автор"), "Автор");
});

test("normalizeDisplayName trims, collapses spaces and caps length", () => {
  assert.equal(normalizeDisplayName("  Андрей   Чернов "), "Андрей Чернов");
  assert.equal(normalizeDisplayName(""), null);
  assert.equal(normalizeDisplayName(undefined), null);
  assert.equal(normalizeDisplayName("x".repeat(100))?.length, 60);
});
