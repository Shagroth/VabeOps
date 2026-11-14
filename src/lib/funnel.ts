// Anonymous funnel for the public course modules. Pure helpers, no Prisma
// or Next imports, so the validation and the summary are unit-tested.
//
// What is counted: events, not people. A browser sends each event of a
// module at most once (a localStorage flag, see useFunnel), and the server
// only increments a per-day counter. Nothing identifies a visitor.
import { isCourseKey, type CourseKey } from "../content/course-list.ts";

export const FUNNEL_EVENTS = ["open", "lab", "artifact", "finished", "export"] as const;
export type FunnelEvent = (typeof FUNNEL_EVENTS)[number];

export const FUNNEL_EVENT_LABEL: Record<FunnelEvent, string> = {
  open: "Открыли модуль",
  lab: "Дошли до лаборатории",
  artifact: "Дошли до артефакта",
  finished: "Завершили модуль",
  export: "Скопировали или скачали артефакт",
};

export type FunnelHit = { course: CourseKey; moduleNumber: number; event: FunnelEvent };

/** Validates untrusted input from the public tracking action. */
export function parseFunnelHit(raw: unknown): FunnelHit | null {
  if (typeof raw !== "object" || raw === null) return null;
  const { course, moduleNumber, event } = raw as Record<string, unknown>;
  if (!isCourseKey(course)) return null;
  if (typeof moduleNumber !== "number" || !Number.isInteger(moduleNumber) || moduleNumber < 1 || moduleNumber > 5) return null;
  if (typeof event !== "string" || !(FUNNEL_EVENTS as readonly string[]).includes(event)) return null;
  return { course, moduleNumber, event: event as FunnelEvent };
}

/** The day bucket: midnight UTC of the given moment. */
export function funnelDay(now: Date): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export type FunnelRow = { course: string; moduleNumber: number; event: string; count: number };

export type FunnelModuleSummary = {
  moduleNumber: number;
  counts: Record<FunnelEvent, number>;
  /** Share of "open" that reached the artifact, 0..100, or null when nobody opened. */
  reachedArtifactPct: number | null;
};

/** Totals per module of one course, modules in order. */
export function summarizeFunnel(rows: readonly FunnelRow[], course: CourseKey, moduleNumbers: readonly number[]): FunnelModuleSummary[] {
  return moduleNumbers.map((moduleNumber) => {
    const counts = Object.fromEntries(FUNNEL_EVENTS.map((e) => [e, 0])) as Record<FunnelEvent, number>;
    for (const row of rows) {
      if (row.course !== course || row.moduleNumber !== moduleNumber) continue;
      if ((FUNNEL_EVENTS as readonly string[]).includes(row.event)) counts[row.event as FunnelEvent] += row.count;
    }
    return {
      moduleNumber,
      counts,
      reachedArtifactPct: counts.open > 0 ? Math.round((counts.artifact / counts.open) * 100) : null,
    };
  });
}
