// One place that knows which courses exist and where their content lives.
// A cohort names its course (Cohort.course in schema.prisma); the keys here
// must match that enum. No Prisma or Next imports: unit-testable.
import {
  MODULE_ONE_SUMMARY,
  PROGRAM_MODULES,
  getPrototypeModule,
  type PrototypeModule,
} from "./demo-course-program.ts";
import {
  HOMEWORK_PASS_SCORE,
  HOMEWORK_SCORING,
  getHomeworkAssignment,
  type HomeworkAssignment,
} from "./demo-course-homework.ts";
import { PUBLIC_DEMO_MODULES } from "./demo-access.ts";
import { FIRST_FLIGHT_MODULES, getFirstFlightModule } from "./first-flight-program.ts";
import { FIRST_FLIGHT_PASS_SCORE, FIRST_FLIGHT_SCORING, getFirstFlightHomework } from "./first-flight-homework.ts";

import { COURSE_KEYS, COURSE_LIST, isCourseKey, type CourseKey } from "./course-list.ts";

export { COURSE_KEYS, isCourseKey, type CourseKey };

export type CourseModuleSummary = {
  number: number;
  eyebrow: string;
  title: string;
  shortTitle: string;
  dek: string;
  result: string;
  guidedMinutes: [number, number];
  practiceMinutes: [number, number];
  artifactName: string;
};

export type ScoringCriterion = { points: number; label: string; detail: string };

export type CourseContent = {
  summary: CourseModuleSummary;
  /** `null` only for the engineers' module 1, which has its own lesson flow. */
  prototype: PrototypeModule | null;
  homework: HomeworkAssignment | undefined;
};

export type CourseDefinition = {
  key: CourseKey;
  title: string;
  /** Audience in a few words, for admin and the workspace. */
  audience: string;
  /** Public pages of the course. */
  path: string;
  modules: readonly CourseModuleSummary[];
  /** Modules readable on the public pages; the rest only in the workspace. */
  publicModules: readonly number[];
  scoring: readonly ScoringCriterion[];
  passScore: number;
  /** One line under the rubric: what the points are given for. */
  scoringNote: string;
  /** Heading above the homework task list. */
  tasksTitle: string;
  /** What a participant attaches when handing in homework. */
  submissionHint: string;
  getContent(moduleNumber: number | null): CourseContent | null;
};

const engineers: CourseDefinition = {
  key: "ENGINEERS",
  ...COURSE_LIST.ENGINEERS,
  modules: PROGRAM_MODULES,
  publicModules: PUBLIC_DEMO_MODULES,
  scoring: HOMEWORK_SCORING,
  passScore: HOMEWORK_PASS_SCORE,
  scoringNote:
    "Объём кода и красота ответа модели баллов не приносят. Баллы — за то, что ты поставил границы, добыл доказательства и сам принял инженерное решение.",
  tasksTitle: "Техническое задание",
  submissionHint: "Приложи ссылку на репозиторий или PR и заполни разбор решения.",
  getContent(moduleNumber) {
    if (!moduleNumber) return null;
    const homework = getHomeworkAssignment(moduleNumber);
    if (moduleNumber === 1) return { summary: MODULE_ONE_SUMMARY, prototype: null, homework };
    const prototype = getPrototypeModule(moduleNumber);
    return prototype ? { summary: prototype, prototype, homework } : null;
  },
};

const firstFlight: CourseDefinition = {
  key: "FIRST_FLIGHT",
  ...COURSE_LIST.FIRST_FLIGHT,
  modules: FIRST_FLIGHT_MODULES,
  publicModules: [1, 2],
  scoring: FIRST_FLIGHT_SCORING,
  passScore: FIRST_FLIGHT_PASS_SCORE,
  scoringNote:
    "Длина текста и красивый ответ модели баллов не приносят. Баллы — за то, что ты ясно поставил задачу, проверил результат и сам решил, что с ним делать.",
  tasksTitle: "Что сделать",
  submissionHint: "Приложи ссылку на документ или вставь текст работы и заполни разбор.",
  getContent(moduleNumber) {
    if (!moduleNumber) return null;
    const prototype = getFirstFlightModule(moduleNumber);
    return prototype ? { summary: prototype, prototype, homework: getFirstFlightHomework(moduleNumber) } : null;
  },
};

export const COURSES: Record<CourseKey, CourseDefinition> = { ENGINEERS: engineers, FIRST_FLIGHT: firstFlight };

/** Unknown or missing keys fall back to the engineers' course, which every older cohort ran. */
export function getCourse(key: unknown): CourseDefinition {
  return isCourseKey(key) ? COURSES[key] : engineers;
}

export function isPublicCourseModule(course: CourseDefinition, moduleNumber: number): boolean {
  return course.publicModules.includes(moduleNumber);
}
