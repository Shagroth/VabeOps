import { HOMEWORK_SCORING } from "@/content/demo-course-homework";

/**
 * Rubric score inputs for a review form — named `score-0`..`score-N` in
 * HOMEWORK_SCORING order, read server-side via src/lib/homework-scoring.ts
 * (parseScores). Optional, all-or-nothing: leave every field blank to
 * skip scoring this review entirely.
 */
export function ScoreInputs({ defaultScores }: { defaultScores?: readonly number[] | null }) {
  return (
    <fieldset className="flex flex-col gap-2 rounded border border-black/10 p-3">
      <legend className="px-2 text-xs font-medium text-black/60">
        Баллы по рубрике (опционально — заполни все поля сразу или оставь пустыми)
      </legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {HOMEWORK_SCORING.map((criterion, i) => (
          <label key={criterion.label} className="flex flex-col gap-1 text-xs">
            <span>
              {criterion.label} <span className="text-black/40">(макс {criterion.points})</span>
            </span>
            <input
              type="number"
              name={`score-${i}`}
              min={0}
              max={criterion.points}
              step={1}
              defaultValue={defaultScores?.[i] ?? ""}
              className="rounded border border-black/15 p-1.5 text-sm"
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
}
