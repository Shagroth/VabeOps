// Shared field labels for rendering a SubmissionVersion's "Разбор решения"
// (used by the participant-facing module page, the per-week admin review
// list, and the cross-cohort /admin/review queue). Plain data, no Next/
// Prisma imports.
export const DECISION_FIELD_LABELS: Record<string, string> = {
  task: "Задача",
  approach: "Подход",
  rejectedAlternative: "Отвергнутая альтернатива",
  verification: "Проверка",
  riskOrLimit: "Риск/ограничение",
  revisitCondition: "Условие пересмотра",
  conditionsResponse: "Ответ на «изменились условия»",
};
