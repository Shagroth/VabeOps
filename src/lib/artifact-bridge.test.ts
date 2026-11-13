import assert from "node:assert/strict";
import test from "node:test";
import { mergeArtifactIntoContent } from "./artifact-bridge.ts";

test("mergeArtifactIntoContent fills an empty field", () => {
  assert.equal(mergeArtifactIntoContent("  ", "# A\n"), "# A");
});

test("mergeArtifactIntoContent appends after existing text", () => {
  assert.equal(mergeArtifactIntoContent("https://github.com/x/y", "# A"), "https://github.com/x/y\n\n# A");
});

test("mergeArtifactIntoContent does not duplicate the same artifact", () => {
  const once = mergeArtifactIntoContent("link", "# A");
  assert.equal(mergeArtifactIntoContent(once, "# A"), once);
});
