// Pure helpers for linking a cohort week (Module row) to a course module
// defined in src/content/demo-course-program.ts. No Prisma/Next imports so
// they can be unit-tested with node --test.

export const COURSE_MODULE_NUMBERS = [1, 2, 3, 4, 5] as const;

/** Parses the admin form value; anything outside 1..5 (incl. "") means "no link". */
export function parseCourseModuleNumber(raw: unknown): number | null {
  if (typeof raw !== "string" || raw.trim() === "") return null;
  const value = Number(raw);
  return (COURSE_MODULE_NUMBERS as readonly number[]).includes(value) ? value : null;
}

export type ProgramWeekSeed = {
  weekNumber: number;
  courseModuleNumber: number;
  title: string;
  isOpen: boolean;
};

/**
 * Weeks to create for a cohort from the course program, skipping week
 * numbers that already exist so the action is safe to click twice. Only
 * the first week opens immediately; the rest are opened by hand in admin.
 */
export function planProgramWeeks(
  program: readonly { number: number; shortTitle: string }[],
  existingWeekNumbers: readonly number[],
): ProgramWeekSeed[] {
  const taken = new Set(existingWeekNumbers);
  return program
    .filter((m) => !taken.has(m.number))
    .map((m) => ({
      weekNumber: m.number,
      courseModuleNumber: m.number,
      title: m.shortTitle,
      isOpen: m.number === 1,
    }));
}
