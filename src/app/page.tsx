import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { WorkspaceShell } from "@/components/WorkspaceShell";
import { canAccessStudio, canReviewSubmissions } from "@/lib/require-role";
import { SubmissionStatusBadge } from "@/components/SubmissionStatusBadge";
import { PublicLanding } from "@/components/landing/PublicLanding";
import { CourseCard } from "@/components/cards/CourseCard";
import { EventCard } from "@/components/cards/EventCard";
import { JournalCard } from "@/components/cards/JournalCard";
import { MINI_COURSES } from "@/content/courses";
import { EVENTS } from "@/content/events";
import { getFeaturedJournal } from "@/content/journal";
import { pickNextStep } from "@/lib/next-step";

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
  const studioAccess = canAccessStudio(session.user.role);
  const reviewAccess = canReviewSubmissions(session.user.role);

  // See stream/page.tsx for why this orders explicitly by cohort start
  // date instead of trusting an arbitrary `findFirst` row.
  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: session.user.id },
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

  if (!enrollment) {
    const previewCourses = MINI_COURSES.slice(0, 3);
    const previewEvents = EVENTS.slice(0, 2);
    const featured = getFeaturedJournal();

    return (
      <WorkspaceShell active="overview" email={session.user.email ?? ""} canAccessStudio={studioAccess} canReviewSubmissions={reviewAccess}>
        <div className="mx-auto flex max-w-[1080px] flex-col gap-10">
          <div className="rounded-2xl border border-hairline bg-white/40 px-6 py-12 text-center sm:px-10">
            <svg viewBox="0 0 160 80" className="mx-auto h-14 w-28 opacity-70" fill="none" aria-hidden="true">
              <path d="M10 70 L60 40" stroke="currentColor" strokeWidth="2" opacity="0.3" />
              <path d="M60 40 L140 12" stroke="var(--system)" strokeWidth="2.5" />
              <path d="M60 40 L120 66" stroke="currentColor" strokeWidth="2" opacity="0.25" strokeDasharray="4 4" />
              <circle cx="60" cy="40" r="4" fill="currentColor" opacity="0.5" />
              <circle cx="140" cy="12" r="5" fill="var(--system)" />
            </svg>
            <h1 className="mt-4 text-2xl font-semibold">Пока нет активной когорты</h1>
            <p className="mx-auto mt-2 max-w-[48ch] text-graphite-muted">
              Твой аккаунт подтверждён, но ты ещё не прикреплён(а) ни к одной когорте пилота.
              Обычно это значит, что зачисление ещё в процессе — автор добавляет участников
              вручную после рассмотрения заявки. Пока жди — можешь посмотреть, что уже есть в
              открытом доступе.
            </p>
            {isAdmin && (
              <Link
                href="/admin"
                className="mt-5 inline-flex rounded-lg bg-ink px-5 py-2.5 text-sm font-medium text-ink-foreground transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
              >
                Управлять пилотом
              </Link>
            )}
          </div>

          <section>
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-sm font-medium text-graphite-muted">Бесплатные мини-курсы</h2>
              <Link href="/courses" className="text-xs text-graphite-muted underline">
                Все мини-курсы →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {previewCourses.map((c) => (
                <CourseCard key={c.slug} course={c} />
              ))}
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-sm font-medium text-graphite-muted">Мероприятия</h2>
              <Link href="/events" className="text-xs text-graphite-muted underline">
                Все мероприятия →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {previewEvents.map((e) => (
                <EventCard key={e.slug} event={e} />
              ))}
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-sm font-medium text-graphite-muted">Из журнала</h2>
              <Link href="/journal" className="text-xs text-graphite-muted underline">
                Все статьи →
              </Link>
            </div>
            <JournalCard entry={featured} large />
          </section>
        </div>
      </WorkspaceShell>
    );
  }

  const modules = enrollment.cohort.modules;

  const submissions = await prisma.submission.findMany({
    where: { userId: session.user.id, moduleId: { in: modules.map((m) => m.id) } },
    select: { moduleId: true, status: true },
  });
  const statusByModule = new Map(submissions.map((s) => [s.moduleId, s.status]));

  const nextStep = pickNextStep(modules, statusByModule);
  const me = await prisma.user.findUnique({ where: { id: session.user.id }, select: { name: true } });
  const now = new Date();
  const nextSession = enrollment.cohort.liveSessions.find((ls) => ls.scheduledAt > now);

  return (
    <WorkspaceShell
      active="overview"
      email={session.user.email ?? ""}
      canAccessStudio={studioAccess}
      canReviewSubmissions={reviewAccess}
      breadcrumb={enrollment.cohort.name}
    >
      <div className="mx-auto flex max-w-[860px] flex-col gap-8">
        <div>
          <h1 className="text-2xl font-semibold">{enrollment.cohort.name}</h1>
          <p className="text-sm text-graphite-muted">Обзор твоего прогресса в пилоте</p>
        </div>

        {!me?.name && (
          <Link
            href="/stream"
            className="rounded-xl border border-accent-change/40 bg-accent-change/[0.05] p-4 text-sm transition-colors duration-150 hover:bg-white"
          >
            <span className="font-medium">Представься группе.</span>{" "}
            <span className="text-graphite-muted">
              Укажи имя и пару строк о себе в «Потоке» — так тебя увидят остальные участники (email им не показывается) →
            </span>
          </Link>
        )}

        {nextStep.kind === "no-open-weeks" ? (
          <p className="rounded-xl border border-hairline bg-white/40 p-6 text-sm text-graphite-muted">
            Курс скоро начнётся — пока нет открытых недель.
          </p>
        ) : nextStep.kind === "revision" ? (
          <Link
            href={`/modules/${nextStep.week.id}#submission`}
            className="rounded-xl border border-accent-change/50 bg-white/60 p-6 transition-colors duration-150 hover:bg-white"
          >
            <span className="text-xs uppercase tracking-wide text-graphite-muted">Следующий шаг</span>
            <div className="mt-1 text-lg font-medium">
              Неделя {nextStep.week.weekNumber} · {nextStep.week.title}
            </div>
            <div className="text-sm text-graphite-muted">
              Автор оставил комментарий к твоей сдаче — загляни и отправь новую версию, когда будет время →
            </div>
          </Link>
        ) : nextStep.kind === "start" ? (
          <Link
            href={`/modules/${nextStep.week.id}`}
            className="rounded-xl border border-hairline bg-white/60 p-6 transition-colors duration-150 hover:bg-white"
          >
            <span className="text-xs uppercase tracking-wide text-graphite-muted">Следующий шаг</span>
            <div className="mt-1 text-lg font-medium">
              Неделя {nextStep.week.weekNumber} · {nextStep.week.title}
            </div>
            <div className="text-sm text-graphite-muted">
              Неделя открыта: урок, лаборатория и домашняя работа. Продолжай в своём темпе →
            </div>
          </Link>
        ) : (
          <p className="rounded-xl border border-signal/40 bg-signal/10 p-6 text-sm text-graphite">
            Все открытые недели сданы.{" "}
            {nextStep.nextClosedWeek
              ? `Следующей откроется неделя ${nextStep.nextClosedWeek.weekNumber} · ${nextStep.nextClosedWeek.title}.`
              : "Это была последняя неделя программы — до встречи на финальном созвоне."}
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
              <a href={nextSession.link} className="font-medium text-ink underline">
                Присоединиться
              </a>
            </div>
          </section>
        )}

        <section className="grid gap-3 sm:grid-cols-2">
          <Link
            href={`/journal/${getFeaturedJournal().slug}`}
            className="card-hover rounded-xl border border-hairline bg-white/50 p-4"
          >
            <span className="font-mono text-[10px] uppercase tracking-wide text-copper">
              Из журнала
            </span>
            <p className="mt-1 text-sm font-medium">{getFeaturedJournal().title}</p>
            <p className="mt-1 text-xs text-graphite-muted">{getFeaturedJournal().dek}</p>
          </Link>
          <div className="rounded-xl border border-hairline bg-white/20 p-4 text-sm">
            <span className="font-mono text-[10px] uppercase tracking-wide text-graphite-muted">
              Записи
            </span>
            <p className="mt-1 text-graphite-muted">
              Пока нет доступных записей воркшопов.{" "}
              <Link href="/events" className="text-ink underline">
                Концепты в архиве →
              </Link>
            </p>
          </div>
        </section>

        <Link href="/stream" className="text-sm text-graphite-muted underline">
          Все созвоны и обсуждения потока →
        </Link>
      </div>
    </WorkspaceShell>
  );
}
