"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { clamp } from "@/lib/validation";
import { MAX_SUBMISSION_CONTENT_LEN } from "@/lib/submission-limits";
import { log, getOrCreateCorrelationId } from "@/lib/logger";
import { isEmailProviderConfigured, notifyAdminEmail, resendCredentials, siteUrl } from "@/lib/env";
import { sendNotifyEmail } from "@/lib/notify-email";
import { buildSubmissionNotifyEmail } from "@/lib/notify-templates";

export type DecisionBreakdown = {
  content: string;
  task: string;
  approach: string;
  rejectedAlternative: string;
  verification: string;
  riskOrLimit: string;
  revisitCondition: string;
  conditionsResponse: string;
};

const MAX_CONTENT_LEN = MAX_SUBMISSION_CONTENT_LEN;
const MAX_FIELD_LEN = 2000;
const MAX_ANSWER_LEN = 2000;

function sanitizeBreakdown(breakdown: DecisionBreakdown): DecisionBreakdown {
  return {
    content: clamp(breakdown.content, MAX_CONTENT_LEN),
    task: clamp(breakdown.task, MAX_FIELD_LEN),
    approach: clamp(breakdown.approach, MAX_FIELD_LEN),
    rejectedAlternative: clamp(breakdown.rejectedAlternative, MAX_FIELD_LEN),
    verification: clamp(breakdown.verification, MAX_FIELD_LEN),
    riskOrLimit: clamp(breakdown.riskOrLimit, MAX_FIELD_LEN),
    revisitCondition: clamp(breakdown.revisitCondition, MAX_FIELD_LEN),
    conditionsResponse: clamp(breakdown.conditionsResponse, MAX_FIELD_LEN),
  };
}

/**
 * Loads the module + the caller's enrollment in its cohort together, so every
 * action below can enforce "enrolled in this module's cohort + module open"
 * with one query instead of trusting the moduleId a client happened to send.
 */
async function requireOpenModuleMembership(moduleId: string, userId: string) {
  const mod = await prisma.module.findUnique({ where: { id: moduleId } });
  if (!mod) throw new Error("Module not found");

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_cohortId: { userId, cohortId: mod.cohortId } },
  });
  if (!enrollment) throw new Error("Not enrolled in this module's cohort");
  if (!mod.isOpen) throw new Error("Module is not open");

  return { mod, enrollment };
}

export async function submitAssignment(
  moduleId: string,
  breakdown: DecisionBreakdown,
  publishToCohort: boolean
) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");

  const { mod } = await requireOpenModuleMembership(moduleId, session.user.id);

  const clean = sanitizeBreakdown(breakdown);

  const submission = await prisma.submission.upsert({
    where: { moduleId_userId: { moduleId, userId: session.user.id } },
    update: { status: "SUBMITTED", publishedToCohort: publishToCohort },
    create: {
      moduleId,
      userId: session.user.id,
      status: "SUBMITTED",
      publishedToCohort: publishToCohort,
    },
  });

  await prisma.submissionVersion.create({
    data: { submissionId: submission.id, ...clean },
  });

  revalidatePath(`/modules/${moduleId}`);
  revalidatePath("/stream");

  const correlationId = getOrCreateCorrelationId(await headers());
  log({
    level: "info",
    event: "submission_saved",
    operation: "modules.submitAssignment",
    correlationId,
    meta: { moduleId, submissionId: submission.id, actorId: session.user.id, publishToCohort },
  });

  // Best-effort: a reviewer notification is a convenience, not part of
  // the submission's own success/failure — never let it throw from here.
  const adminEmail = notifyAdminEmail();
  if (adminEmail && isEmailProviderConfigured()) {
    const { subject, text } = buildSubmissionNotifyEmail({
      participantEmail: session.user.email ?? "unknown",
      weekNumber: mod.weekNumber,
      weekTitle: mod.title,
      moduleId,
      siteUrl: siteUrl(),
    });
    await sendNotifyEmail(
      { to: adminEmail, subject, text, ...resendCredentials() },
      correlationId,
      "submission_notify_sent"
    );
  }
}

export async function submitFeedback(formId: string, answers: Record<string, string>) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");

  const form = await prisma.feedbackForm.findUnique({ where: { id: formId } });
  if (!form) throw new Error("Feedback form not found");

  const { enrollment } = await requireOpenModuleMembership(form.moduleId, session.user.id);
  if (form.level !== enrollment.level) {
    throw new Error("This feedback form does not match your participant level");
  }

  const cleanAnswers = Object.fromEntries(
    Object.entries(answers).map(([key, value]) => [key, clamp(String(value ?? ""), MAX_ANSWER_LEN)])
  );

  await prisma.feedbackResponse.upsert({
    where: { formId_userId: { formId, userId: session.user.id } },
    update: { answers: cleanAnswers, submittedAt: new Date() },
    create: { formId, userId: session.user.id, answers: cleanAnswers },
  });
}
