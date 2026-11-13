"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";
import { requireRole } from "@/lib/require-role";
import { prisma } from "@/lib/prisma";
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
  feedbackText: string
) {
  // Mentor feedback on cohort work is explicitly in-scope for MENTOR
  // (brief §2/§9) even though mentors don't manage publications.
  const session = await requireRole(["ADMIN", "MENTOR"]);

  await prisma.submission.update({ where: { id: submissionId }, data: { status } });

  if (feedbackText.trim()) {
    await prisma.submissionFeedback.create({
      data: { submissionId, authorId: session.user.id, content: feedbackText.trim() },
    });
  }

  const submission = await prisma.submission.findUnique({ where: { id: submissionId } });
  if (submission) revalidatePath(`/admin/modules/${submission.moduleId}`);
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
