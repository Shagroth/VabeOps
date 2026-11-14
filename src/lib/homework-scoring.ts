// Pure rubric-scoring logic for a review. Framework-free: takes the
// rubric (HOMEWORK_SCORING from src/content/demo-course-homework.ts) as
// a parameter instead of importing it, so this stays independently
// testable and reusable if the rubric ever changes shape.

export type RubricCriterion = { points: number; label: string };

export type ScoreParseResult =
  | { kind: "none" }
  | { kind: "complete"; scores: number[]; total: number }
  | { kind: "invalid"; error: string };

/**
 * Reads one raw value per criterion from `raw` (criterion index as a
 * string key, e.g. form field `score-0`, `score-1`, ...). All-or-nothing:
 * every field blank -> "none" (scoring is optional, unchanged from
 * before). Any field filled -> every field must be present and within
 * [0, criterion.points], or this returns "invalid" with a reviewer-facing
 * message — a half-filled rubric would produce a misleading total, so
 * it's rejected rather than silently partial.
 */
export function parseScores(
  rubric: readonly RubricCriterion[],
  raw: Record<string, unknown>
): ScoreParseResult {
  const rawValues = rubric.map((_, i) => raw[String(i)]);
  const isBlank = (v: unknown) => v === undefined || v === null || String(v).trim() === "";

  if (rawValues.every(isBlank)) return { kind: "none" };

  const scores: number[] = [];
  for (let i = 0; i < rubric.length; i++) {
    const value = rawValues[i];
    const criterion = rubric[i];
    if (isBlank(value)) {
      return { kind: "invalid", error: `Укажи балл за «${criterion.label}»` };
    }
    const n = Number(value);
    if (!Number.isFinite(n)) {
      return { kind: "invalid", error: `Балл за «${criterion.label}» должен быть числом` };
    }
    if (n < 0 || n > criterion.points) {
      return {
        kind: "invalid",
        error: `Балл за «${criterion.label}» должен быть от 0 до ${criterion.points}`,
      };
    }
    scores.push(n);
  }

  const total = scores.reduce((sum, s) => sum + s, 0);
  return { kind: "complete", scores, total };
}

export function totalMaxScore(rubric: readonly RubricCriterion[]): number {
  return rubric.reduce((sum, c) => sum + c.points, 0);
}

export function sumScores(scores: readonly number[]): number {
  return scores.reduce((sum, s) => sum + s, 0);
}
