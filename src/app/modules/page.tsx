import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { WorkspaceShell } from "@/components/WorkspaceShell";
import { canAccessStudio, canReviewSubmissions } from "@/lib/require-role";
import { CourseProgramCard, DashboardHeader, NoCohortCard } from "@/components/workspace/dashboard";
import { PILOT_COURSE_TITLE } from "@/content/demo-course-program";

export default async function ModulesPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const userId = session.user.id;

  // One program per cohort the person is enrolled in, newest first.
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    orderBy: { cohort: { startDate: "desc" } },
    include: {
      cohort: {
        include: { modules: { orderBy: { weekNumber: "asc" } } },
      },
    },
  });

  const moduleIds = enrollments.flatMap((e) => e.cohort.modules.map((m) => m.id));
  const submissions =
    moduleIds.length > 0
      ? await prisma.submission.findMany({
          where: { userId, moduleId: { in: moduleIds } },
          select: { moduleId: true, status: true },
        })
      : [];
  const statusByModule = new Map(submissions.map((s) => [s.moduleId, s.status]));

  return (
    <WorkspaceShell
      active="program"
      email={session.user.email ?? ""}
      canAccessStudio={canAccessStudio(session.user.role)}
      canReviewSubmissions={canReviewSubmissions(session.user.role)}
      breadcrumb={enrollments[0]?.cohort.name}
    >
      <div className="mx-auto flex max-w-[1080px] flex-col gap-10 text-[17px]">
        <DashboardHeader
          eyebrow="Программа"
          title={enrollments.length > 0 ? "Недели твоих курсов" : "Программа появится после зачисления"}
          lead={
            enrollments.length > 0
              ? "В каждой неделе — урок, лаборатория, домашняя работа и разбор от автора."
              : undefined
          }
        />
        {enrollments.length === 0 && <NoCohortCard isAdmin={session.user.role === "ADMIN"} />}
        {enrollments.map((e) => (
          <CourseProgramCard
            key={e.cohort.id}
            course={{
              id: e.cohort.id,
              courseTitle: PILOT_COURSE_TITLE,
              cohortName: e.cohort.name,
              weeks: e.cohort.modules.map((m) => ({
                id: m.id,
                weekNumber: m.weekNumber,
                title: m.title,
                isOpen: m.isOpen,
                status: statusByModule.get(m.id) ?? null,
              })),
            }}
          />
        ))}
      </div>
    </WorkspaceShell>
  );
}
