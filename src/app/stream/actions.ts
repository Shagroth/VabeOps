"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { clamp } from "@/lib/validation";

const MAX_PROFILE_FIELD_LEN = 600;
const MAX_COMMENT_LEN = 4000;

/**
 * The profile form always runs inside a specific cohort's page (the Поток
 * for one cohort), so the cohort is passed explicitly rather than guessed
 * with an unbounded `findFirst` — a user enrolled in more than one cohort
 * would otherwise silently edit the wrong enrollment's profile.
 */
export async function updateMyProfile(cohortId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_cohortId: { userId: session.user.id, cohortId } },
  });
  if (!enrollment) throw new Error("Not enrolled in this cohort");

  await prisma.enrollment.update({
    where: { id: enrollment.id },
    data: {
      doingNow: clamp(String(formData.get("doingNow") || ""), MAX_PROFILE_FIELD_LEN) || null,
      exploring: clamp(String(formData.get("exploring") || ""), MAX_PROFILE_FIELD_LEN) || null,
      canHelpWith: clamp(String(formData.get("canHelpWith") || ""), MAX_PROFILE_FIELD_LEN) || null,
    },
  });

  revalidatePath("/stream");
}

export async function postComment(moduleId: string, content: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");
  const trimmed = content.trim();
  if (!trimmed) return;

  const mod = await prisma.module.findUnique({ where: { id: moduleId } });
  if (!mod) throw new Error("Module not found");
  if (!mod.isOpen) throw new Error("Module is not open");

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_cohortId: { userId: session.user.id, cohortId: mod.cohortId } },
  });
  if (!enrollment) throw new Error("Not enrolled in this module's cohort");

  await prisma.moduleComment.create({
    data: { moduleId, userId: session.user.id, content: clamp(trimmed, MAX_COMMENT_LEN) },
  });

  revalidatePath(`/modules/${moduleId}`);
  revalidatePath("/stream");
}
