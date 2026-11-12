"use server";

import { prisma } from "@/lib/prisma";
import { validateApplication, type ApplicationFieldErrors } from "@/lib/validation";

export type ApplyFieldErrors = ApplicationFieldErrors;
export type ApplyResult = { ok: true } | { ok: false; errors: ApplyFieldErrors };

export async function submitApplication(formData: FormData): Promise<ApplyResult> {
  // Honeypot: a real visitor never sees or fills this field (hidden from
  // layout + aria-hidden in the form). Bots filling every input trip it.
  // We return success without writing anything, so the bot gets no signal
  // that it was caught.
  if (String(formData.get("company") || "").trim().length > 0) {
    return { ok: true };
  }

  const result = validateApplication({
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    experience: String(formData.get("experience") || ""),
    workGoal: String(formData.get("workGoal") || ""),
    consent: formData.get("consent") === "on",
  });

  if (!result.ok) {
    return { ok: false, errors: result.errors };
  }

  // Idempotent on email: a duplicate click or resubmit (e.g. a retried
  // network request) should not pile up multiple rows for one applicant.
  // This is deliberately not a production-grade anti-spam measure — just a
  // single-row-per-email guard appropriate for a 5-10 person free pilot.
  const existing = await prisma.application.findFirst({ where: { email: result.value.email } });
  if (existing) {
    return { ok: true };
  }

  await prisma.application.create({ data: result.value });

  return { ok: true };
}
