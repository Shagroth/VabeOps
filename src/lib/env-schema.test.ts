import { test } from "node:test";
import assert from "node:assert/strict";
import { requireEnv, isConfigured, MissingEnvError } from "./env-schema.ts";

test("requireEnv returns the value when present", () => {
  assert.equal(requireEnv({ FOO: "bar" }, "FOO"), "bar");
});

test("requireEnv throws MissingEnvError without the value in the message", () => {
  assert.throws(
    () => requireEnv({}, "DATABASE_URL"),
    (err: unknown) => {
      assert.ok(err instanceof MissingEnvError);
      assert.equal(err.key, "DATABASE_URL");
      assert.doesNotMatch(err.message, /postgres:\/\//);
      return true;
    }
  );
});

test("requireEnv treats an empty string as missing", () => {
  assert.throws(() => requireEnv({ FOO: "" }, "FOO"));
});

test("isConfigured is true only when every key has a value", () => {
  assert.equal(isConfigured({ A: "1", B: "2" }, ["A", "B"]), true);
  assert.equal(isConfigured({ A: "1" }, ["A", "B"]), false);
  assert.equal(isConfigured({}, []), true);
});
