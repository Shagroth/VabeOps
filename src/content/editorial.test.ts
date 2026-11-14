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

test("every mini-course is a finished short course", async () => {
  const { MINI_COURSES } = await import("./courses.ts");
  const { JOURNAL: journal } = await import("./journal.ts");
  assert.equal(MINI_COURSES.length, 6);
  for (const course of MINI_COURSES) {
    assert.equal(course.status, "available", course.slug);
    assert.equal(course.lessons.length, 3, course.slug);
    assert.equal(course.minutes, course.lessons.reduce((sum, l) => sum + l.minutes, 0));
    for (const lesson of course.lessons) {
      assert.ok(lesson.body.length >= 2, `${course.slug}: ${lesson.title}`);
      assert.ok(lesson.practice.length > 20);
      assert.ok(lesson.diagram || lesson.checklist, `${course.slug}: ${lesson.title} needs a scheme or a checklist`);
    }
    assert.ok(course.takeaway.length >= 4);
    assert.ok(journal.some((j) => j.slug === course.relatedArticle), `${course.slug} related article`);
  }
});

test("the comic episode is a real multi-slide comic with described scenes", async () => {
  const { EPISODE_1 } = await import("./comics.ts");
  assert.ok(EPISODE_1.panels.length >= 6);
  for (const panel of EPISODE_1.panels) {
    assert.ok(panel.scene, panel.caption);
    assert.ok(panel.sceneAlt.length > 20, `${panel.caption} needs a scene description`);
    assert.ok(panel.lines.length >= 1 && panel.lines.length <= 3, `${panel.caption} lines`);
  }
  assert.equal(new Set(EPISODE_1.panels.map((p) => p.caption)).size, EPISODE_1.panels.length);
  assert.ok(EPISODE_1.checklist.length >= 3);
});
