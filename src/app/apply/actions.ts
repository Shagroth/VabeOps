"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getOrCreateCorrelationId } from "@/lib/logger";
import { processApplicationSubmission, type ApplyResult } from "@/lib/apply-application";
import type { ApplicationFieldErrors } from "@/lib/validation";

export type ApplyFieldErrors = ApplicationFieldErrors;
export type { ApplyResult };

export async function submitApplication(formData: FormData): Promise<ApplyResult> {
  const correlationId = getOrCreateCorrelationId(await headers());

  return processApplicationSubmission(
    formData,
    {
      findByEmail: (email) => prisma.application.findFirst({ where: { email } }),
      create: async (data) => {
        await prisma.application.create({ data });
      },
    },
    correlationId
  );
}
