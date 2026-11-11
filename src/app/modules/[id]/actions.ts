"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function submitAssignment(moduleId: string, content: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");

  await prisma.submission.upsert({
    where: { moduleId_userId: { moduleId, userId: session.user.id } },
    update: { content, submittedAt: new Date() },
    create: { moduleId, userId: session.user.id, content },
  });

  revalidatePath(`/modules/${moduleId}`);
}

export async function submitFeedback(formId: string, answers: Record<string, string>) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");

  await prisma.feedbackResponse.upsert({
    where: { formId_userId: { formId, userId: session.user.id } },
    update: { answers, submittedAt: new Date() },
    create: { formId, userId: session.user.id, answers },
  });
}
