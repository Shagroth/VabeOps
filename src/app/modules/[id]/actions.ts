"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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

export async function submitAssignment(moduleId: string, breakdown: DecisionBreakdown) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");

  const submission = await prisma.submission.upsert({
    where: { moduleId_userId: { moduleId, userId: session.user.id } },
    update: { status: "SUBMITTED" },
    create: { moduleId, userId: session.user.id, status: "SUBMITTED" },
  });

  await prisma.submissionVersion.create({
    data: { submissionId: submission.id, ...breakdown },
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
