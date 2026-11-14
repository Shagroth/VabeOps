// Course keys and names only. Deliberately free of course content so that
// client components (the application form, analytics) can import it without
// pulling lessons of closed modules into the browser bundle.
// Keys must match the CourseKey enum in prisma/schema.prisma.

export const COURSE_KEYS = ["ENGINEERS", "FIRST_FLIGHT"] as const;
export type CourseKey = (typeof COURSE_KEYS)[number];

export const COURSE_LIST: Record<CourseKey, { title: string; audience: string; path: string }> = {
  ENGINEERS: { title: "KiteGrip for Engineers", audience: "для разработчиков", path: "/demo-course" },
  FIRST_FLIGHT: { title: "First Flight", audience: "для новичков, без кода", path: "/first-flight" },
};

export function isCourseKey(value: unknown): value is CourseKey {
  return typeof value === "string" && (COURSE_KEYS as readonly string[]).includes(value);
}
