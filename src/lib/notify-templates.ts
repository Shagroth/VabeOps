// Plain-text (no HTML) subject/body builders for the two review-loop
// notifications. Pure so the copy is unit-tested without touching Resend
// or Prisma — see notify-email.ts for the actual send.

export type SubmissionNotifyInput = {
  participantEmail: string;
  weekNumber: number;
  weekTitle: string;
  moduleId: string;
  siteUrl: string;
};

/** New submission or new version of an existing one → the author/reviewer. */
export function buildSubmissionNotifyEmail(input: SubmissionNotifyInput): { subject: string; text: string } {
  const subject = `Новая сдача — неделя ${input.weekNumber}`;
  const link = `${input.siteUrl}/admin/modules/${input.moduleId}`;
  const text = [
    `Участник ${input.participantEmail} сдал(а) практику недели ${input.weekNumber} «${input.weekTitle}».`,
    "",
    `Проверить: ${link}`,
  ].join("\n");
  return { subject, text };
}

export type ReviewStatusForNotify = "ACCEPTED" | "NEEDS_REVISION";

const STATUS_LABEL: Record<ReviewStatusForNotify, string> = {
  ACCEPTED: "принята",
  NEEDS_REVISION: "отправлена на доработку",
};

export type FeedbackNotifyInput = {
  weekNumber: number;
  weekTitle: string;
  moduleId: string;
  status: ReviewStatusForNotify;
  feedbackText: string;
  siteUrl: string;
  /** Rubric total, if this review included scoring (see homework-scoring.ts). */
  score?: { total: number; max: number; pass: number } | null;
};

/** Reviewer set a status (and optionally feedback/score) → the participant. */
export function buildFeedbackNotifyEmail(input: FeedbackNotifyInput): { subject: string; text: string } {
  const subject = `Неделя ${input.weekNumber}: практика ${STATUS_LABEL[input.status]}`;
  const link = `${input.siteUrl}/modules/${input.moduleId}#submission`;
  const lines = [`Твоя практика по неделе ${input.weekNumber} «${input.weekTitle}» ${STATUS_LABEL[input.status]}.`];
  if (input.score) {
    const { total, max, pass } = input.score;
    lines.push("", `Балл: ${total} из ${max} (проходной — ${pass}).`);
  }
  const feedback = input.feedbackText.trim();
  if (feedback) lines.push("", "Комментарий автора:", feedback);
  lines.push("", `Открыть: ${link}`);
  return { subject, text: lines.join("\n") };
}
