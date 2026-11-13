import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { WorkspaceShell } from "@/components/WorkspaceShell";
import { canAccessStudio, canReviewSubmissions } from "@/lib/require-role";
import { ParticipantProfileForm } from "@/components/ParticipantProfileForm";
import { displayName } from "@/lib/display-name";

const TYPE_LABEL: Record<string, string> = {
  KICKOFF: "Кикофф",
  MIDPOINT: "Мидпоинт",
  FINAL: "Финал",
};

export default async function StreamPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const studioAccess = canAccessStudio(session.user.role);
  const reviewAccess = canReviewSubmissions(session.user.role);

  // A user could in principle hold enrollments in more than one cohort
  // (e.g. a repeat participant across pilots) — pick the most recently
  // started cohort explicitly rather than an arbitrary `findFirst` row.
  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: session.user.id },
    orderBy: { cohort: { startDate: "desc" } },
    include: {
      cohort: {
        include: {
          liveSessions: { orderBy: { scheduledAt: "asc" } },
          enrollments: { include: { user: { select: { id: true, name: true } } } },
        },
      },
    },
  });

  if (!enrollment) {
    return (
      <WorkspaceShell active="stream" email={session.user.email ?? ""} canAccessStudio={studioAccess} canReviewSubmissions={reviewAccess}>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 rounded-2xl border border-hairline bg-white/40 px-6 py-16 text-center">
          <h1 className="text-xl font-semibold">Пока нет активной когорты</h1>
          <p className="max-w-[48ch] text-graphite-muted">
            Поток появится здесь, как только тебя зачислят в когорту.
          </p>
        </div>
      </WorkspaceShell>
    );
  }

  const myEnrollment = enrollment.cohort.enrollments.find((e) => e.userId === session.user.id)!;
  const now = new Date();
  const myName = myEnrollment.user.name;

  const recentComments = await prisma.moduleComment.findMany({
    where: { module: { cohortId: enrollment.cohortId } },
    include: { user: { select: { name: true } }, module: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const sharedSubmissions = await prisma.submission.findMany({
    where: { publishedToCohort: true, module: { cohortId: enrollment.cohortId } },
    include: {
      user: { select: { name: true } },
      module: true,
      versions: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <WorkspaceShell
      active="stream"
      email={session.user.email ?? ""}
      canAccessStudio={studioAccess}
      canReviewSubmissions={reviewAccess}
      breadcrumb={enrollment.cohort.name}
    >
      <div className="mx-auto flex max-w-[860px] flex-col gap-8">
        <h1 className="text-2xl font-semibold">Поток · {enrollment.cohort.name}</h1>

        <section>
          <h2 className="mb-3 text-sm font-medium text-graphite-muted">Созвоны</h2>
          <ul className="flex flex-col gap-2">
            {enrollment.cohort.liveSessions.map((ls) => (
              <li
                key={ls.id}
                className="flex items-center justify-between rounded-xl border border-hairline bg-white/40 p-3 text-sm"
              >
                <span>
                  {TYPE_LABEL[ls.type]} — {ls.scheduledAt.toLocaleString("ru-RU")}
                  <span className="ml-2 text-xs text-graphite-muted">
                    {ls.scheduledAt > now ? "предстоит" : "прошла"}
                  </span>
                </span>
                {ls.scheduledAt > now && (
                  <a href={ls.link} className="font-medium text-ink underline">
                    Присоединиться
                  </a>
                )}
              </li>
            ))}
            {enrollment.cohort.liveSessions.length === 0 && (
              <p className="text-sm text-graphite-muted">Созвоны ещё не назначены.</p>
            )}
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-medium text-graphite-muted">Участники</h2>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {enrollment.cohort.enrollments.map((e) => (
              <li key={e.id} className="rounded-xl border border-hairline bg-white/40 p-3 text-sm">
                <div className="font-medium">
                  {displayName(e.user)}
                  {e.userId === session.user.id && <span className="ml-1 text-xs text-graphite-muted">(ты)</span>}
                </div>
                {e.doingNow && <div className="text-graphite-muted">Делает: {e.doingNow}</div>}
                {e.exploring && <div className="text-graphite-muted">Исследует: {e.exploring}</div>}
                {e.canHelpWith && (
                  <div className="text-graphite-muted">Поможет с: {e.canHelpWith}</div>
                )}
                {!e.doingNow && !e.exploring && !e.canHelpWith && (
                  <div className="text-graphite-muted">Профиль ещё не заполнен</div>
                )}
              </li>
            ))}
          </ul>
        </section>

        <ParticipantProfileForm
          cohortId={enrollment.cohortId}
          initial={{
            name: myName ?? "",
            doingNow: myEnrollment.doingNow ?? "",
            exploring: myEnrollment.exploring ?? "",
            canHelpWith: myEnrollment.canHelpWith ?? "",
          }}
        />

        <section>
          <h2 className="mb-3 text-sm font-medium text-graphite-muted">Поделились решением</h2>
          <ul className="flex flex-col gap-2">
            {sharedSubmissions.map((s) => (
              <li key={s.id} className="rounded-xl border border-hairline bg-white/40 p-3 text-sm">
                <div className="mb-1 text-xs text-graphite-muted">
                  Неделя {s.module.weekNumber} · {s.module.title}
                </div>
                <span className="text-graphite-muted">{displayName(s.user)}: </span>
                {s.versions[0]?.content}
              </li>
            ))}
            {sharedSubmissions.length === 0 && (
              <p className="text-sm text-graphite-muted">
                Пока никто не поделился решением — это по желанию, сдачи приватны по умолчанию.
              </p>
            )}
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-medium text-graphite-muted">Недавние обсуждения</h2>
          <ul className="flex flex-col gap-2">
            {recentComments.map((c) => (
              <li key={c.id} className="rounded-xl border border-hairline bg-white/40 p-3 text-sm">
                <div className="mb-1 text-xs text-graphite-muted">
                  Неделя {c.module.weekNumber} · {c.module.title}
                </div>
                <span className="text-graphite-muted">{displayName(c.user)}: </span>
                {c.content}
              </li>
            ))}
            {recentComments.length === 0 && (
              <p className="text-sm text-graphite-muted">
                Обсуждений пока нет — они появляются на странице урока.
              </p>
            )}
          </ul>
        </section>
      </div>
    </WorkspaceShell>
  );
}
