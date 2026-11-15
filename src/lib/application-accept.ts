/**
 * Decides whether an application can be accepted right now, before anything
 * is written. Expected problems (no level picked, no cohort of the course)
 * come back as a reason the admin page shows, not as an exception.
 */

export type AcceptProblem = "level" | "cohort" | "mail";

export type AcceptPlan =
  | { ok: true; level: "NOVICE" | "STRONG"; cohortId: string }
  | { ok: false; problem: Exclude<AcceptProblem, "mail"> };

/**
 * @param cohorts cohorts of the application's course, newest first.
 * @param requestedCohortId the cohort picked in the form; ignored when it
 *   is not one of `cohorts`, so a stale form cannot enroll into another course.
 */
export function planAcceptance(
  level: string,
  requestedCohortId: string,
  cohorts: readonly { id: string }[],
): AcceptPlan {
  if (cohorts.length === 0) return { ok: false, problem: "cohort" };
  if (level !== "NOVICE" && level !== "STRONG") return { ok: false, problem: "level" };
  const picked = cohorts.find((c) => c.id === requestedCohortId) ?? cohorts[0];
  return { ok: true, level, cohortId: picked.id };
}

export function acceptProblemMessage(problem: string, courseTitle: string): string | null {
  switch (problem) {
    case "cohort":
      return `Нет потока курса «${courseTitle}». Создай его в разделе «Админка» → «Новая когорта», потом вернись и выдай доступ.`;
    case "level":
      return "Выбери уровень (новичок или уверенный) и нажми ещё раз.";
    case "mail":
      return "Доступ выдан, но письмо со ссылкой на вход не отправилось. Человек может войти сам: на странице входа ввести свою почту.";
    default:
      return null;
  }
}
