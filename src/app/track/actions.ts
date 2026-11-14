"use server";

import { prisma } from "@/lib/prisma";
import { funnelDay, parseFunnelHit } from "@/lib/funnel";

/**
 * Public, unauthenticated counter for the course funnel. Input is
 * untrusted: anything that is not a known course/module/event is ignored.
 * It stores a per-day count and nothing about the caller. Best-effort: a
 * database error must never break a lesson, so it is swallowed.
 */
export async function trackFunnel(raw: unknown): Promise<void> {
  const hit = parseFunnelHit(raw);
  if (!hit) return;
  const day = funnelDay(new Date());
  try {
    await prisma.funnelCount.upsert({
      where: { day_course_moduleNumber_event: { day, ...hit } },
      create: { day, ...hit, count: 1 },
      update: { count: { increment: 1 } },
    });
  } catch {
    // Counting is not worth an error surface.
  }
}
