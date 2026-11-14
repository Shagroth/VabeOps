"use client";

import { useCallback } from "react";
import { trackFunnel } from "@/app/track/actions";
import type { CourseKey } from "@/content/course-list";
import type { FunnelEvent } from "@/lib/funnel";

export type FunnelTarget = { course: CourseKey; moduleNumber: number };

/**
 * Returns `mark(event)`: counts an event of this module once per browser.
 * The "already sent" flag lives in localStorage, so no identifier ever
 * leaves the browser. Without a target (the cohort workspace) it does nothing.
 */
export function useFunnel(target?: FunnelTarget) {
  const course = target?.course;
  const moduleNumber = target?.moduleNumber;
  return useCallback(
    (event: FunnelEvent) => {
      if (!course || !moduleNumber) return;
      const key = `kg-funnel:${course}:${moduleNumber}:${event}`;
      try {
        if (window.localStorage.getItem(key)) return;
        window.localStorage.setItem(key, "1");
      } catch {
        return; // storage blocked: skip rather than count the same browser repeatedly
      }
      void trackFunnel({ course, moduleNumber, event });
    },
    [course, moduleNumber],
  );
}
