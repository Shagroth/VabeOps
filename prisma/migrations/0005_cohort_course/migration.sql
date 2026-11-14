-- A cohort now names the course it runs (see CourseKey in schema.prisma
-- and src/content/course-catalog.ts). Additive: existing cohorts become
-- ENGINEERS, which is what they all were. Safe to apply without data loss.
CREATE TYPE "CourseKey" AS ENUM ('ENGINEERS', 'FIRST_FLIGHT');

ALTER TABLE "Cohort" ADD COLUMN "course" "CourseKey" NOT NULL DEFAULT 'ENGINEERS';
