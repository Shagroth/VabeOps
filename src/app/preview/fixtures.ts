import type { OverviewData } from "@/components/workspace/dashboard";
import { MINI_COURSES } from "@/content/courses";
import { getFeaturedJournal } from "@/content/journal";
import { PILOT_COURSE_TITLE, PROGRAM_MODULES } from "@/content/demo-course-program";

const featured = getFeaturedJournal();
const STATUS: (string | null)[] = ["ACCEPTED", "NEEDS_REVISION", "SUBMITTED", null, null];

const base = {
  miniCourses: MINI_COURSES,
  journal: { href: `/journal/${featured.slug}`, title: featured.title, dek: featured.dek },
  isAdmin: false,
};

const weeks = PROGRAM_MODULES.map((m, i) => ({
  id: `preview-week-${m.number}`,
  weekNumber: m.number,
  title: m.shortTitle,
  isOpen: true,
  status: STATUS[i],
}));

export const ENROLLED_OVERVIEW: OverviewData = {
  ...base,
  courses: [{ id: "preview-cohort", courseTitle: PILOT_COURSE_TITLE, cohortName: "Demo Pilot", weeks }],
  nextStep: { kind: "revision", week: weeks[1] },
  needsName: true,
  nextSession: { label: "Кикофф", when: "[ДАТА СОЗВОНА]", link: "#" },
};

export const NO_COHORT_OVERVIEW: OverviewData = {
  ...base,
  courses: [],
  nextStep: null,
  needsName: false,
  nextSession: null,
};
