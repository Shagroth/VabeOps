import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { WorkspaceShell } from "@/components/WorkspaceShell";
import { canAccessStudio, canReviewSubmissions } from "@/lib/require-role";
import { PublicLanding } from "@/components/landing/PublicLanding";
import { WorkspaceOverview, type CourseAccess } from "@/components/workspace/dashboard";
import { MINI_COURSES } from "@/content/courses";
import { getFeaturedJournal } from "@/content/journal";
import { getCourse } from "@/content/course-catalog";
import { pickNextStep, type NextStep } from "@/lib/next-step";

const TYPE_LABEL: Record<string, string> = {
  KICKOFF: "Кикофф",
  MIDPOINT: "Середина",
  FINAL: "Финал",
};

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    return <PublicLanding />;
  }

  const userId = session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  // Every cohort the person is enrolled in is one course they have access
  // to. Newest cohort first: it drives "next step" and the breadcrumb.
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    orderBy: { cohort: { startDate: "desc" } },
    include: {
      cohort: {
        include: {
          liveSessions: { orderBy: { scheduledAt: "asc" } },
          modules: { orderBy: { weekNumber: "asc" } },
        },
      },
    },
  });

  const moduleIds = enrollments.flatMap((e) => e.cohort.modules.map((m) => m.id));
  const [submissions, me] = await Promise.all([
    moduleIds.length > 0
      ? prisma.submission.findMany({
          where: { userId, moduleId: { in: moduleIds } },
          select: { moduleId: true, status: true },
        })
      : [],
    prisma.user.findUnique({ where: { id: userId }, select: { name: true } }),
  ]);
  const statusByModule = new Map(submissions.map((s) => [s.moduleId, s.status]));

  const courses: CourseAccess[] = enrollments.map((e) => ({
    id: e.cohort.id,
    courseTitle: getCourse(e.cohort.course).title,
    cohortName: e.cohort.name,
    weeks: e.cohort.modules.map((m) => ({
      id: m.id,
      weekNumber: m.weekNumber,
      title: m.title,
      isOpen: m.isOpen,
      status: statusByModule.get(m.id) ?? null,
    })),
  }));

  // The first cohort with something to act on wins; otherwise the newest one.
  const steps = enrollments.map((e) => pickNextStep(e.cohort.modules, statusByModule));
  const nextStep: NextStep | null =
    steps.find((s) => s.kind === "revision") ?? steps.find((s) => s.kind === "start") ?? steps[0] ?? null;

  const now = new Date();
  const upcoming = enrollments
    .flatMap((e) => e.cohort.liveSessions)
    .filter((ls) => ls.scheduledAt > now)
    .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime())[0];

  const featured = getFeaturedJournal();

  return (
    <WorkspaceShell
      active="overview"
      email={session.user.email ?? ""}
      canAccessStudio={canAccessStudio(session.user.role)}
      canReviewSubmissions={canReviewSubmissions(session.user.role)}
      breadcrumb={enrollments[0]?.cohort.name}
    >
      <WorkspaceOverview
        data={{
          courses,
          nextStep,
          needsName: !me?.name,
          nextSession: upcoming
            ? {
                label: TYPE_LABEL[upcoming.type] ?? upcoming.type,
                when: upcoming.scheduledAt.toLocaleString("ru-RU", { dateStyle: "long", timeStyle: "short" }),
                link: upcoming.link,
              }
            : null,
          miniCourses: MINI_COURSES,
          journal: { href: `/journal/${featured.slug}`, title: featured.title, dek: featured.dek },
          isAdmin,
        }}
      />
    </WorkspaceShell>
  );
}
