import { test } from "node:test";
import assert from "node:assert/strict";
import {
  canEditContent,
  canPublishContent,
  canAccessStudio,
  canReviewSubmissions,
} from "./studio-permissions.ts";

test("ADMIN and EDITOR can edit any content regardless of status or ownership", () => {
  assert.equal(canEditContent("ADMIN", "someone-else", "PUBLISHED", "me"), true);
  assert.equal(canEditContent("EDITOR", "someone-else", "ARCHIVED", "me"), true);
});

test("AUTHOR can edit their own DRAFT/IN_REVIEW content", () => {
  assert.equal(canEditContent("AUTHOR", "me", "DRAFT", "me"), true);
  assert.equal(canEditContent("AUTHOR", "me", "IN_REVIEW", "me"), true);
});

test("AUTHOR cannot edit someone else's content", () => {
  assert.equal(canEditContent("AUTHOR", "someone-else", "DRAFT", "me"), false);
});

test("AUTHOR cannot edit their own content once PUBLISHED or ARCHIVED", () => {
  assert.equal(canEditContent("AUTHOR", "me", "PUBLISHED", "me"), false);
  assert.equal(canEditContent("AUTHOR", "me", "ARCHIVED", "me"), false);
});

test("MENTOR and STUDENT never have content-edit rights", () => {
  assert.equal(canEditContent("MENTOR", "me", "DRAFT", "me"), false);
  assert.equal(canEditContent("STUDENT", "me", "DRAFT", "me"), false);
});

test("only ADMIN/EDITOR can publish or archive", () => {
  assert.equal(canPublishContent("ADMIN"), true);
  assert.equal(canPublishContent("EDITOR"), true);
  assert.equal(canPublishContent("AUTHOR"), false);
  assert.equal(canPublishContent("MENTOR"), false);
  assert.equal(canPublishContent("STUDENT"), false);
});

test("MENTOR and STUDENT are excluded from Studio entirely", () => {
  assert.equal(canAccessStudio("MENTOR"), false);
  assert.equal(canAccessStudio("STUDENT"), false);
  for (const role of ["ADMIN", "EDITOR", "AUTHOR"] as const) {
    assert.equal(canAccessStudio(role), true);
  }
});

test("only ADMIN/MENTOR can see the review queue", () => {
  assert.equal(canReviewSubmissions("ADMIN"), true);
  assert.equal(canReviewSubmissions("MENTOR"), true);
  assert.equal(canReviewSubmissions("EDITOR"), false);
  assert.equal(canReviewSubmissions("AUTHOR"), false);
  assert.equal(canReviewSubmissions("STUDENT"), false);
});
