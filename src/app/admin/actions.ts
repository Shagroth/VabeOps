"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";
import { requireRole } from "@/lib/require-role";
import { prisma } from "@/lib/prisma";
import { parseCourseModuleNumber, planProgramWeeks } from "@/lib/course-module-link";
import { PROGRAM_MODULES } from "@/content/demo-course-program";
import { isAssignableRole, parseEnrollmentInput } from "@/lib/enrollment";
import { getOrCreateCorrelationId } from "@/lib/logger";
import { isEmailProviderConfigured, resendCredentials, siteUrl } from "@/lib/env";
import { sendNotifyEmail } from "@/lib/notify-email";
import { buildFeedbackNotifyEmail } from "@/lib/notify-templates";
import { parseScores, totalMaxScore } from "@/lib/homework-scoring";
import { HOMEWORK_SCORING, HOMEWORK_PASS_SCORE } from "@/content/demo-course-homework";
import { signIn } from "@/auth";

function readModuleFields(formData: FormData) {
  return {
    cohortId: String(formData.get("cohortId")),
    weekNumber: Number(formData.get("weekNumber")),
    title: String(formData.get("title")),
    videoKey: String(formData.get("videoKey") || "") || null,
    notesMd: String(formData.get("notesMd") || ""),
    assignmentMd: String(formData.get("assignmentMd") || ""),
    isOpen: formData.get("isOpen") === "on",
    conditionsChangedMd: String(formData.get("conditionsChangedMd") || "") || null,
    courseModuleNumber: parseCourseModuleNumber(formData.get("courseModuleNumber")),
  };
}

export async function createModule(formData: FormData) {
  await requireAdmin();
  const data = readModuleFields(formData);
  const mod = await prisma.module.create({ data });
  revalidatePath("/admin");
  redirect(`/admin/modules/${mod.id}`);
}

export async function updateModule(moduleId: string, formData: FormData) {
  await requireAdmin();
  const data = readModuleFields(formData);
  await prisma.module.update({ where: { id: moduleId }, data });
  revalidatePath("/admin");
  revalidatePath(`/admin/modules/${moduleId}`);
  revalidatePath(`/modules/${moduleId}`);
  revalidatePath("/modules");
  revalidatePath("/");
}

function splitQuestions(raw: string) {
  return raw
    .split("\n")
    .map((q) => q.trim())
    .filter(Boolean);
}

export async function setFeedbackQuestions(
  moduleId: string,
  level: "NOVICE" | "STRONG",
  questionsRaw: string
) {
  await requireAdmin();
  const questions = splitQuestions(questionsRaw);

  await prisma.feedbackForm.upsert({
    where: { moduleId_level: { moduleId, level } },
    update: { questions },
    create: { moduleId, level, questions },
  });

  revalidatePath(`/admin/modules/${moduleId}`);
}

export async function createCohort(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name"));
  const startDate = new Date(String(formData.get("startDate")));
  await prisma.cohort.create({ data: { name, startDate } });
  revalidatePath("/admin");
}

/** Creates the missing weeks of a cohort from the course program (idempotent). */
export async function createProgramWeeks(formData: FormData) {
  await requireAdmin();
  const cohortId = String(formData.get("cohortId"));
  const existing = await prisma.module.findMany({ where: { cohortId }, select: { weekNumber: true } });
  const plan = planProgramWeeks(PROGRAM_MODULES, existing.map((m) => m.weekNumber));
  if (plan.length > 0) {
    await prisma.module.createMany({
      data: plan.map((w) => ({ ...w, cohortId, notesMd: "", assignmentMd: "" })),
    });
  }
  revalidatePath("/admin");
  revalidatePath("/modules");
  revalidatePath("/");
}

export async function setModuleOpen(moduleId: string, isOpen: boolean) {
  await requireAdmin();
  await prisma.module.update({ where: { id: moduleId }, data: { isOpen } });
  revalidatePath("/admin");
  revalidatePath("/modules");
  revalidatePath(`/modules/${moduleId}`);
  revalidatePath("/");
}

export async function createLiveSession(formData: FormData) {
  await requireAdmin();
  const cohortId = String(formData.get("cohortId"));
  const type = String(formData.get("type")) as "KICKOFF" | "MIDPOINT" | "FINAL";
  const scheduledAt = new Date(String(formData.get("scheduledAt")));
  const link = String(formData.get("link"));
  await prisma.liveSession.create({ data: { cohortId, type, scheduledAt, link } });
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function reviewSubmission(
  submissionId: string,
  status: "ACCEPTED" | "NEEDS_REVISION",
  feedbackText: string,
  scoresRaw: Record<string, string> = {}
) {
  // Mentor feedback on cohort work is explicitly in-scope for MENTOR
  // (brief §2/§9) even though mentors don't manage publications.
  const session = await requireRole(["ADMIN", "MENTOR"]);

  // Scoring is optional (see homework-scoring.ts) but all-or-nothing when
  // attempted — an invalid/half-filled rubric throws before anything is
  // saved, rather than silently recording a misleading partial total.
  const parsed = parseScores(HOMEWORK_SCORING, scoresRaw);
  if (parsed.kind === "invalid") throw new Error(parsed.error);
  const scores = parsed.kind === "complete" ? parsed.scores : null;

  await prisma.submission.update({ where: { id: submissionId }, data: { status } });

  if (feedbackText.trim() || scores) {
    await prisma.submissionFeedback.create({
      data: {
        submissionId,
        authorId: session.user.id,
        content: feedbackText.trim(),
        // Omit entirely rather than pass `null` — Prisma's Json field
        // wants Prisma.JsonNull for an explicit null; leaving the key
        // out stores ordinary SQL NULL, which is what "not scored" means.
        ...(scores ? { scores } : {}),
      },
    });
  }

  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: { user: true, module: true },
  });
  if (!submission) return;

  revalidatePath(`/admin/modules/${submission.moduleId}`);
  revalidatePath("/admin/review");

  // Best-effort: the review decision itself already saved above — a
  // failed notification must not surface as a failed review action.
  if (submission.user.email && isEmailProviderConfigured()) {
    const { subject, text } = buildFeedbackNotifyEmail({
      weekNumber: submission.module.weekNumber,
      weekTitle: submission.module.title,
      moduleId: submission.moduleId,
      status,
      feedbackText,
      siteUrl: siteUrl(),
      score: scores
        ? { total: scores.reduce((sum, s) => sum + s, 0), max: totalMaxScore(HOMEWORK_SCORING), pass: HOMEWORK_PASS_SCORE }
        : null,
    });
    await sendNotifyEmail(
      { to: submission.user.email, subject, text, ...resendCredentials() },
      getOrCreateCorrelationId(await headers()),
      "feedback_notify_sent"
    );
  }
}

/**
 * Accepting an application used to be a single status flag flip with no
 * downstream effect — no account, no cohort access, no notification.
 * This now actually provisions access: creates the User if they don't
 * have one yet (role STUDENT), enrolls them in the (currently single)
 * cohort at the level the admin picked, and sends them a real sign-in
 * link via the existing magic-link pipeline — not a separate "welcome"
 * template, the same email a normal self-service sign-in would send.
 *
 * The provisioning gate is "does this email already have an
 * enrollment," not "did the status field just transition." That matters
 * for applications that were already marked ACCEPTED before this
 * existed — re-running Accept on those grants access retroactively
 * instead of being a permanent no-op. Re-running Accept on an
 * application that already has access is a safe no-op (no duplicate
 * user/enrollment, no duplicate email).
 */
export async function setApplicationStatus(
  applicationId: string,
  status: "ACCEPTED" | "REJECTED",
  formData?: FormData
) {
  await requireAdmin();

  const application = await prisma.application.findUniqueOrThrow({
    where: { id: applicationId },
  });

  await prisma.application.update({ where: { id: applicationId }, data: { status } });

  if (status === "ACCEPTED") {
    const existingUser = await prisma.user.findUnique({ where: { email: application.email } });
    const alreadyEnrolled = existingUser
      ? await prisma.enrollment.findFirst({ where: { userId: existingUser.id } })
      : null;

    if (!alreadyEnrolled) {
      const level = String(formData?.get("level") ?? "");
      if (level !== "NOVICE" && level !== "STRONG") {
        throw new Error("Выбери уровень (новичок/уверенный) перед тем, как принять заявку.");
      }

      // Single-cohort assumption for the current pilot — see
      // docs/production-readiness.md backlog for picking a cohort
      // explicitly once there's more than one.
      const cohort = await prisma.cohort.findFirst({ orderBy: { startDate: "desc" } });
      if (!cohort) {
        throw new Error("Нет ни одной когорты — сначала создай когорту, потом принимай заявки.");
      }

      const user =
        existingUser ??
        (await prisma.user.create({ data: { email: application.email, role: "STUDENT" } }));

      await prisma.enrollment.create({ data: { userId: user.id, cohortId: cohort.id, level } });

      // redirect: false — this is the ADMIN's own request; without it,
      // signIn() would redirect the admin's browser to
      // /auth/check-email, a page meant for the applicant, not them.
      await signIn("resend", { email: application.email, redirect: false });
    }
  }

  revalidatePath("/admin/applications");
  revalidatePath("/admin");
}

/**
 * Enrolls a participant by email. The User row is created up front if it
 * doesn't exist yet — Auth.js's Prisma adapter matches the later magic-link
 * sign-in to it by (lower-cased) email, so no manual DB step is needed.
 */
export async function enrollParticipant(formData: FormData) {
  await requireAdmin();
  const cohortId = String(formData.get("cohortId") || "");
  const parsed = parseEnrollmentInput({
    email: formData.get("email"),
    level: formData.get("level"),
    name: formData.get("name"),
  });
  if (!cohortId || !parsed.ok) {
    throw new Error(parsed.ok ? "Не выбрана когорта" : parsed.error);
  }
  const { email, level, name } = parsed.value;

  const existing = await prisma.user.findUnique({ where: { email } });
  const user = existing
    ? !existing.name && name
      ? await prisma.user.update({ where: { id: existing.id }, data: { name } })
      : existing
    : await prisma.user.create({ data: { email, name } });

  await prisma.enrollment.upsert({
    where: { userId_cohortId: { userId: user.id, cohortId } },
    update: { level },
    create: { userId: user.id, cohortId, level },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/applications");
  revalidatePath("/stream");
}

export async function removeEnrollment(enrollmentId: string) {
  await requireAdmin();
  await prisma.enrollment.delete({ where: { id: enrollmentId } });
  revalidatePath("/admin");
  revalidatePath("/stream");
}

export async function setUserRole(userId: string, role: string) {
  const session = await requireAdmin();
  if (!isAssignableRole(role)) throw new Error("Role is not assignable from the UI");
  if (userId === session.user.id) throw new Error("Нельзя менять собственную роль");
  const target = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  // Never silently demote another admin/editor/author from this screen.
  if (!target || !isAssignableRole(target.role)) throw new Error("Роль этого пользователя меняется только в базе");
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin");
}
