import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { WorkspaceNav } from "@/components/WorkspaceNav";
import { ParticipantProfileForm } from "@/components/ParticipantProfileForm";

const TYPE_LABEL: Record<string, string> = {
  KICKOFF: "Кикофф",
  MIDPOINT: "Мидпоинт",
  FINAL: "Финал",
};

export default async function StreamPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: session.user.id },
    include: {
      cohort: {
        include: {
          liveSessions: { orderBy: { scheduledAt: "asc" } },
          enrollments: { include: { user: true } },
        },
      },
    },
  });

  if (!enrollment) {
    return (
      <main className="mx-auto max-w-2xl p-8">
        <p>Ты пока не записан(а) ни в одну когорту.</p>
      </main>
    );
  }

  const myEnrollment = enrollment.cohort.enrollments.find((e) => e.userId === session.user.id)!;
  const now = new Date();

  const recentComments = await prisma.moduleComment.findMany({
    where: { module: { cohortId: enrollment.cohortId } },
    include: { user: true, module: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <main className="mx-auto flex max-w-2xl flex-1 flex-col gap-8 p-8">
      <WorkspaceNav isAdmin={session.user.role === "ADMIN"} />
      <h1 className="text-xl font-semibold">Поток · {enrollment.cohort.name}</h1>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Созвоны</h2>
        <ul className="flex flex-col gap-2">
          {enrollment.cohort.liveSessions.map((ls) => (
            <li
              key={ls.id}
              className="flex items-center justify-between rounded-lg border border-black/10 p-3 text-sm"
            >
              <span>
                {TYPE_LABEL[ls.type]} — {ls.scheduledAt.toLocaleString("ru-RU")}
                <span className="ml-2 text-xs text-black/40">
                  {ls.scheduledAt > now ? "предстоит" : "прошла"}
                </span>
              </span>
              {ls.scheduledAt > now && (
                <a href={ls.link} className="underline">
                  Присоединиться
                </a>
              )}
            </li>
          ))}
          {enrollment.cohort.liveSessions.length === 0 && (
            <p className="text-sm text-black/40">Созвоны ещё не назначены.</p>
          )}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Участники</h2>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {enrollment.cohort.enrollments.map((e) => (
            <li key={e.id} className="rounded-lg border border-black/10 p-3 text-sm">
              <div className="font-medium">{e.user.email}</div>
              {e.doingNow && <div className="text-black/60">Делает: {e.doingNow}</div>}
              {e.exploring && (
                <div className="text-black/60">Исследует: {e.exploring}</div>
              )}
              {e.canHelpWith && (
                <div className="text-black/60">Поможет с: {e.canHelpWith}</div>
              )}
              {!e.doingNow && !e.exploring && !e.canHelpWith && (
                <div className="text-black/40">Профиль ещё не заполнен</div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <ParticipantProfileForm
        initial={{
          doingNow: myEnrollment.doingNow ?? "",
          exploring: myEnrollment.exploring ?? "",
          canHelpWith: myEnrollment.canHelpWith ?? "",
        }}
      />

      <section>
        <h2 className="mb-3 text-lg font-semibold">Недавние обсуждения</h2>
        <ul className="flex flex-col gap-2">
          {recentComments.map((c) => (
            <li key={c.id} className="rounded-lg border border-black/10 p-3 text-sm">
              <div className="mb-1 text-xs text-black/40">
                Неделя {c.module.weekNumber} · {c.module.title}
              </div>
              <span className="text-black/50">{c.user.email}: </span>
              {c.content}
            </li>
          ))}
          {recentComments.length === 0 && (
            <p className="text-sm text-black/40">
              Обсуждений пока нет — они появляются на странице урока.
            </p>
          )}
        </ul>
      </section>
    </main>
  );
}
