import { test } from "node:test";
import assert from "node:assert/strict";
import { isValidEmail, normalizeEmail, clamp, validateApplication } from "./validation.ts";

test("isValidEmail accepts a plausible address", () => {
  assert.equal(isValidEmail("a@b.co"), true);
});

test("isValidEmail rejects missing @ or domain dot", () => {
  assert.equal(isValidEmail("not-an-email"), false);
  assert.equal(isValidEmail("a@b"), false);
  assert.equal(isValidEmail(""), false);
});

test("normalizeEmail trims and lowercases", () => {
  assert.equal(normalizeEmail("  Person@Example.COM  "), "person@example.com");
});

test("clamp truncates to the max length, leaves shorter strings alone", () => {
  assert.equal(clamp("hello", 3), "hel");
  assert.equal(clamp("hi", 10), "hi");
});

test("validateApplication rejects when a required field is empty", () => {
  const result = validateApplication({
    name: "",
    email: "a@b.co",
    experience: "some experience",
    workGoal: "ship things",
    consent: true,
  });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.errors.name, "Укажи имя");
    assert.equal(result.errors.email, undefined);
  }
});

test("validateApplication rejects an invalid email even if everything else is fine", () => {
  const result = validateApplication({
    name: "Alex",
    email: "not-an-email",
    experience: "x",
    workGoal: "y",
    consent: true,
  });
  assert.equal(result.ok, false);
  if (!result.ok) assert.ok(result.errors.email);
});

test("validateApplication requires explicit consent", () => {
  const result = validateApplication({
    name: "Alex",
    email: "a@b.co",
    experience: "x",
    workGoal: "y",
    consent: false,
  });
  assert.equal(result.ok, false);
  if (!result.ok) assert.ok(result.errors.consent);
});

test("validateApplication normalizes email and trims fields on success", () => {
  const result = validateApplication({
    name: "  Alex  ",
    email: "  Alex@Example.COM  ",
    experience: "  does agent stuff  ",
    workGoal: "  ship things  ",
    consent: true,
  });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.name, "Alex");
    assert.equal(result.value.email, "alex@example.com");
    assert.equal(result.value.experience, "does agent stuff");
  }
});

test("validateApplication enforces max lengths", () => {
  const result = validateApplication({
    name: "x".repeat(500),
    email: "a@b.co",
    experience: "x",
    workGoal: "y",
    consent: true,
  });
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.value.name.length, 120);
});
