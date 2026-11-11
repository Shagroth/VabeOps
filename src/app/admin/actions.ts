"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";

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
  const session = await requireAdmin();

  await prisma.submission.update({ where: { id: submissionId }, data: { status } });

  if (feedbackText.trim()) {
    await prisma.submissionFeedback.create({
      data: { submissionId, authorId: session.user.id, content: feedbackText.trim() },
    });
  }

  const submission = await prisma.submission.findUnique({ where: { id: submissionId } });
  if (submission) revalidatePath(`/admin/modules/${submission.moduleId}`);
}

export async function setApplicationStatus(
  applicationId: string,
  status: "ACCEPTED" | "REJECTED"
) {
  await requireAdmin();
  await prisma.application.update({ where: { id: applicationId }, data: { status } });
  revalidatePath("/admin/applications");
}
