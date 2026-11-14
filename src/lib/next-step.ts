// "Следующий шаг" on the workspace overview. Pure so the priority order is
// unit-tested: revision requested > first open week without a submission >
// waiting for the next week.

export type WeekForNextStep = { id: string; weekNumber: number; title: string; isOpen: boolean };
export type SubmissionStatusValue = "SUBMITTED" | "NEEDS_REVISION" | "ACCEPTED";

export type NextStep =
  | { kind: "no-open-weeks" }
  | { kind: "revision"; week: WeekForNextStep }
  | { kind: "start"; week: WeekForNextStep }
  | { kind: "all-done"; nextClosedWeek: WeekForNextStep | null };

export function pickNextStep(
  weeks: readonly WeekForNextStep[],
  statusByWeekId: ReadonlyMap<string, SubmissionStatusValue>,
): NextStep {
  const ordered = [...weeks].sort((a, b) => a.weekNumber - b.weekNumber);
  const open = ordered.filter((w) => w.isOpen);
  if (open.length === 0) return { kind: "no-open-weeks" };

  const revision = open.find((w) => statusByWeekId.get(w.id) === "NEEDS_REVISION");
  if (revision) return { kind: "revision", week: revision };

  const notStarted = open.find((w) => !statusByWeekId.has(w.id));
  if (notStarted) return { kind: "start", week: notStarted };

  return { kind: "all-done", nextClosedWeek: ordered.find((w) => !w.isOpen) ?? null };
}
