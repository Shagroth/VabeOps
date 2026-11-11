"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function updateMyProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");

  const enrollment = await prisma.enrollment.findFirst({ where: { userId: session.user.id } });
  if (!enrollment) throw new Error("No enrollment");

  await prisma.enrollment.update({
    where: { id: enrollment.id },
    data: {
      doingNow: String(formData.get("doingNow") || "") || null,
      exploring: String(formData.get("exploring") || "") || null,
      canHelpWith: String(formData.get("canHelpWith") || "") || null,
    },
  });

  revalidatePath("/stream");
}

export async function postComment(moduleId: string, content: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Not authenticated");
  if (!content.trim()) return;

  await prisma.moduleComment.create({
    data: { moduleId, userId: session.user.id, content: content.trim() },
  });

  revalidatePath(`/modules/${moduleId}`);
  revalidatePath("/stream");
}
