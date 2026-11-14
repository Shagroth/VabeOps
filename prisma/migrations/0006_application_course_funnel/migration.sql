-- Two additive changes, both safe to apply without data loss.
--
-- 1. An application names the course it is for. Existing rows were all
--    for the engineers' pilot, which is the default.
ALTER TABLE "Application" ADD COLUMN "course" "CourseKey" NOT NULL DEFAULT 'ENGINEERS';

-- 2. Anonymous funnel counters for the public course modules
--    (see FunnelCount in schema.prisma). No personal data.
CREATE TABLE "FunnelCount" (
    "id" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "course" "CourseKey" NOT NULL,
    "moduleNumber" INTEGER NOT NULL,
    "event" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "FunnelCount_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "FunnelCount_day_course_moduleNumber_event_key" ON "FunnelCount"("day", "course", "moduleNumber", "event");
