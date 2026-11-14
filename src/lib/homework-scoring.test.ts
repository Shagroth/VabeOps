import { test } from "node:test";
import assert from "node:assert/strict";
import { parseScores, totalMaxScore, sumScores } from "./homework-scoring.ts";

const RUBRIC = [
  { points: 5, label: "Работоспособность" },
  { points: 5, label: "Контракты и границы" },
  { points: 4, label: "Независимая проверка" },
  { points: 3, label: "Риски" },
  { points: 2, label: "Воспроизводимость" },
  { points: 1, label: "Документация" },
];

test("totalMaxScore sums every criterion's max", () => {
  assert.equal(totalMaxScore(RUBRIC), 20);
});

test("sumScores adds the awarded points", () => {
  assert.equal(sumScores([5, 5, 4, 3, 2, 1]), 20);
  assert.equal(sumScores([0, 0, 0, 0, 0, 0]), 0);
});

test("parseScores returns 'none' when every field is blank — scoring stays optional", () => {
  assert.deepEqual(parseScores(RUBRIC, {}), { kind: "none" });
  assert.deepEqual(parseScores(RUBRIC, { "0": "", "1": "  " }), { kind: "none" });
});

test("parseScores returns 'complete' with the total when every field is filled and in range", () => {
  const result = parseScores(RUBRIC, { "0": "5", "1": "4", "2": "4", "3": "2", "4": "2", "5": "1" });
  assert.deepEqual(result, { kind: "complete", scores: [5, 4, 4, 2, 2, 1], total: 18 });
});

test("parseScores allows zero for a criterion", () => {
  const result = parseScores(RUBRIC, { "0": "0", "1": "0", "2": "0", "3": "0", "4": "0", "5": "0" });
  assert.deepEqual(result, { kind: "complete", scores: [0, 0, 0, 0, 0, 0], total: 0 });
});

test("parseScores rejects a half-filled rubric instead of silently computing a partial total", () => {
  const result = parseScores(RUBRIC, { "0": "5" });
  assert.equal(result.kind, "invalid");
  if (result.kind === "invalid") assert.match(result.error, /Контракты и границы/);
});

test("parseScores rejects a score above the criterion's max", () => {
  const result = parseScores(RUBRIC, { "0": "999", "1": "5", "2": "4", "3": "3", "4": "2", "5": "1" });
  assert.equal(result.kind, "invalid");
  if (result.kind === "invalid") assert.match(result.error, /от 0 до 5/);
});

test("parseScores rejects a negative score", () => {
  const result = parseScores(RUBRIC, { "0": "-1", "1": "5", "2": "4", "3": "3", "4": "2", "5": "1" });
  assert.equal(result.kind, "invalid");
});

test("parseScores rejects a non-numeric value", () => {
  const result = parseScores(RUBRIC, { "0": "five", "1": "5", "2": "4", "3": "3", "4": "2", "5": "1" });
  assert.equal(result.kind, "invalid");
});
