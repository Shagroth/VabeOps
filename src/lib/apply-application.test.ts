import { test } from "node:test";
import assert from "node:assert/strict";
import { processApplicationSubmission, type ApplicationStore } from "./apply-application.ts";

function validFormData(overrides: Record<string, string> = {}) {
  const fd = new FormData();
  fd.set("name", overrides.name ?? "Alex");
  fd.set("email", overrides.email ?? "alex@example.com");
  fd.set("experience", overrides.experience ?? "Used Claude Code daily");
  fd.set("workGoal", overrides.workGoal ?? "Ship agent workflows safely");
  fd.set("consent", overrides.consent ?? "on");
  if (overrides.company) fd.set("company", overrides.company);
  return fd;
}

function memoryStore(seed: string[] = []): ApplicationStore & { created: string[] } {
  const emails = new Set(seed);
  const created: string[] = [];
  return {
    created,
    async findByEmail(email) {
      return emails.has(email) ? { email } : null;
    },
    async create(data) {
      emails.add(data.email);
      created.push(data.email);
    },
  };
}

test("processApplicationSubmission creates a new application on first submit", async () => {
  const store = memoryStore();
  const result = await processApplicationSubmission(validFormData(), store, "cid-1");
  assert.equal(result.ok, true);
  assert.deepEqual(store.created, ["alex@example.com"]);
});

test("processApplicationSubmission is idempotent on a duplicate email", async () => {
  const store = memoryStore(["alex@example.com"]);
  const result = await processApplicationSubmission(validFormData(), store, "cid-2");
  assert.equal(result.ok, true);
  assert.deepEqual(store.created, [], "must not write a second row for the same email");
});

test("processApplicationSubmission silently accepts a honeypot-tripped bot without writing", async () => {
  const store = memoryStore();
  const result = await processApplicationSubmission(validFormData({ company: "Acme Corp" }), store, "cid-3");
  assert.equal(result.ok, true);
  assert.deepEqual(store.created, []);
});

test("processApplicationSubmission returns field errors without touching the store", async () => {
  const store = memoryStore();
  const result = await processApplicationSubmission(validFormData({ email: "not-an-email" }), store, "cid-4");
  assert.equal(result.ok, false);
  if (!result.ok) assert.ok(result.errors.email);
  assert.deepEqual(store.created, []);
});

test("processApplicationSubmission returns a neutral error when the store write fails", async () => {
  const store: ApplicationStore = {
    async findByEmail() {
      return null;
    },
    async create() {
      throw new Error("connection terminated unexpectedly");
    },
  };

  const result = await processApplicationSubmission(validFormData(), store, "cid-5");
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.ok(result.errors.email);
    assert.doesNotMatch(result.errors.email ?? "", /connection terminated/);
  }
});

test("processApplicationSubmission returns a neutral error when the duplicate check itself fails", async () => {
  const store: ApplicationStore = {
    async findByEmail() {
      throw new Error("ECONNREFUSED");
    },
    async create() {
      throw new Error("should not be reached");
    },
  };

  const result = await processApplicationSubmission(validFormData(), store, "cid-6");
  assert.equal(result.ok, false);
});
