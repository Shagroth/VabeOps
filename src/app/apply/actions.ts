"use server";

import { prisma } from "@/lib/prisma";

export async function submitApplication(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const experience = String(formData.get("experience") || "").trim();
  const workGoal = String(formData.get("workGoal") || "").trim();

  if (!name || !email || !experience || !workGoal) {
    throw new Error("Заполни все поля");
  }

  await prisma.application.create({
    data: { name, email, experience, workGoal },
  });
}
