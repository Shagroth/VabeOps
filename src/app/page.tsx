import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { WorkspaceShell } from "@/components/WorkspaceShell";
import { SubmissionStatusBadge } from "@/components/SubmissionStatusBadge";
import { PublicLanding } from "@/components/landing/PublicLanding";

const TYPE_LABEL: Record<string, string> = {
  KICKOFF: "Кикофф",
  MIDPOINT: "Мидпоинт",
  FINAL: "Финал",
};

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    return <PublicLanding />;
  }

  const isAdmin = session.user.role === "ADMIN";

  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: session.user.id },
    include: {
      cohort: {
        include: {
          liveSessions: { orderBy: { scheduledAt: "asc" } },
          modules: { orderBy: { weekNumber: "asc" } },
        },
      },
    },
  });

  if (!enrollment) {
    return (
      <WorkspaceShell active="overview" email={session.user.email ?? ""} isAdmin={isAdmin}>
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 rounded-2xl border border-hairline bg-white/40 px-6 py-16 text-center">
          <svg viewBox="0 0 160 80" className="h-14 w-28 opacity-70" fill="none" aria-hidden="true">
            <path d="M10 70 L60 40" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            <path d="M60 40 L140 12" stroke="var(--accent-action)" strokeWidth="2.5" />
            <path d="M60 40 L120 66" stroke="currentColor" strokeWidth="2" opacity="0.25" strokeDasharray="4 4" />
            <circle cx="60" cy="40" r="4" fill="currentColor" opacity="0.5" />
            <circle cx="140" cy="12" r="5" fill="var(--accent-action)" />
          </svg>
          <h1 className="text-2xl font-semibold">Пока нет активной когорты</h1>
          <p className="max-w-[48ch] text-graphite-muted">
            Твой аккаунт подтверждён, но ты ещё не прикреплён(а) ни к одной когорте пилота.
            Обычно это значит, что зачисление ещё в процессе — автор добавляет участников
            вручную после рассмотрения заявки.
          </p>
          {isAdmin && (
            <Link
              href="/admin"
              className="rounded-lg bg-accent-action px-5 py-2.5 text-sm font-medium text-white"
            >
              Управлять пилотом
            </Link>
          )}
        </div>
      </WorkspaceShell>
    );
  }

  const modules = enrollment.cohort.modules;
  const openModules = modules.filter((m) => m.isOpen);

  const submissions = await prisma.submission.findMany({
    where: { userId: session.user.id, moduleId: { in: modules.map((m) => m.id) } },
    select: { moduleId: true, status: true },
  });
  const statusByModule = new Map(submissions.map((s) => [s.moduleId, s.status]));

  const nextModule = openModules.find((m) => !statusByModule.has(m.id));
  const now = new Date();
  const nextSession = enrollment.cohort.liveSessions.find((ls) => ls.scheduledAt > now);

  return (
    <WorkspaceShell active="overview" email={session.user.email ?? ""} isAdmin={isAdmin}>
      <div className="mx-auto flex max-w-[860px] flex-col gap-8">
        <div>
          <h1 className="text-2xl font-semibold">{enrollment.cohort.name}</h1>
          <p className="text-sm text-graphite-muted">Обзор твоего прогресса в пилоте</p>
        </div>

        {openModules.length === 0 ? (
          <p className="rounded-xl border border-hairline bg-white/40 p-6 text-sm text-graphite-muted">
            Курс скоро начнётся — пока нет открытых недель.
          </p>
        ) : nextModule ? (
          <Link
            href={`/modules/${nextModule.id}`}
            className="rounded-xl border border-hairline bg-white/60 p-6 transition-colors duration-150 hover:bg-white"
          >
            <span className="text-xs uppercase tracking-wide text-graphite-muted">
              Следующий шаг
            </span>
            <div className="mt-1 text-lg font-medium">
              Неделя {nextModule.weekNumber} · {nextModule.title}
            </div>
            <div className="text-sm text-graphite-muted">
              Открыта, но ты ещё не сдал(а) практику — продолжить →
            </div>
          </Link>
        ) : (
          <p className="rounded-xl border border-accent-action/30 bg-accent-action/5 p-6 text-sm">
            Все открытые недели сданы. Ждём, когда откроется следующая.
          </p>
        )}

        {modules.length > 0 && (
          <section>
            <h2 className="mb-3 text-sm font-medium text-graphite-muted">Недели когорты</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {modules.map((m) => {
                const status = statusByModule.get(m.id);
                const content = (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Неделя {m.weekNumber}</span>
                      {!m.isOpen ? (
                        <span className="text-xs text-graphite-muted">закрыта</span>
                      ) : status ? (
                        <SubmissionStatusBadge status={status} />
                      ) : (
                        <span className="text-xs text-graphite-muted">не начата</span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-graphite-muted">{m.title}</p>
                  </>
                );
                return m.isOpen ? (
                  <Link
                    key={m.id}
                    href={`/modules/${m.id}`}
                    className="rounded-xl border border-hairline bg-white/50 p-4 transition-colors duration-150 hover:bg-white"
                  >
                    {content}
                  </Link>
                ) : (
                  <div
                    key={m.id}
                    className="rounded-xl border border-hairline bg-white/20 p-4 opacity-60"
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {nextSession && (
          <section className="rounded-xl border border-hairline bg-white/40 p-4 text-sm">
            <span className="text-xs uppercase tracking-wide text-graphite-muted">
              Ближайшая встреча
            </span>
            <div className="mt-1 flex items-center justify-between">
              <span>
                {TYPE_LABEL[nextSession.type]} — {nextSession.scheduledAt.toLocaleString("ru-RU")}
              </span>
              <a href={nextSession.link} className="font-medium text-accent-action underline">
                Присоединиться
              </a>
            </div>
          </section>
        )}

        <Link href="/stream" className="text-sm text-graphite-muted underline">
          Все созвоны и обсуждения потока →
        </Link>
      </div>
    </WorkspaceShell>
  );
}
