import assert from "node:assert/strict";
import test from "node:test";
import { PUBLIC_DEMO_MODULES, isPublicDemoModule } from "./demo-access.ts";

test("only the first two modules are public", () => {
  assert.deepEqual([...PUBLIC_DEMO_MODULES], [1, 2]);
  assert.equal(isPublicDemoModule(1), true);
  assert.equal(isPublicDemoModule(2), true);
  for (const locked of [3, 4, 5]) assert.equal(isPublicDemoModule(locked), false);
  assert.equal(isPublicDemoModule(0), false);
});
