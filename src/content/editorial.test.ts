import assert from "node:assert/strict";
import test from "node:test";
import { JOURNAL } from "./journal.ts";
import { getPublishedSignals } from "./signals.ts";

const isRealHttps = (url: string) => /^https:\/\/[^/]+\.[a-z]{2,}\//.test(url) && !url.includes("example.");

test("every published signal links to a real primary source", () => {
  const signals = getPublishedSignals();
  assert.ok(signals.length >= 6);
  for (const s of signals) {
    assert.ok(s.sourceUrl && isRealHttps(s.sourceUrl), `${s.slug} source`);
    assert.ok(s.sourceName, `${s.slug} source name`);
    assert.match(s.publishedAt, /^\d{4}-\d{2}-\d{2}$/);
  }
  assert.equal(new Set(signals.map((s) => s.slug)).size, signals.length);
});

test("every journal article cites at least three distinct primary sources", () => {
  for (const entry of JOURNAL) {
    assert.ok(entry.sources.length >= 3, `${entry.slug} sources`);
    const urls = entry.sources.map((s) => s.url);
    assert.equal(new Set(urls).size, urls.length, `${entry.slug} duplicate source`);
    for (const source of entry.sources) {
      assert.ok(isRealHttps(source.url), `${entry.slug}: ${source.url}`);
      assert.ok(source.title && source.publisher);
    }
  }
});
