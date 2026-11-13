import Link from "next/link";
import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { WorkspaceShell } from "@/components/WorkspaceShell";
import {
  createCohort,
  createLiveSession,
  createProgramWeeks,
  enrollParticipant,
  removeEnrollment,
  setModuleOpen,
  setUserRole,
} from "./actions";
import { PROGRAM_MODULES } from "@/content/demo-course-program";

const LEVEL_LABEL: Record<string, string> = { NOVICE: "новичок", STRONG: "сильный" };

export default async function AdminPage() {
  const session = await requireAdmin();

  const pendingApplications = await prisma.application.count({ where: { status: "PENDING" } });

  const cohorts = await prisma.cohort.findMany({
    orderBy: { startDate: "desc" },
    include: {
      modules: {
        orderBy: { weekNumber: "asc" },
        include: { _count: { select: { submissions: true } } },
      },
      liveSessions: { orderBy: { scheduledAt: "asc" } },
      enrollments: {
        include: { user: { select: { id: true, email: true, name: true, role: true } } },
        orderBy: { user: { email: "asc" } },
      },
    },
  });

  return (
    <WorkspaceShell active="admin" email={session.user.email ?? ""} canAccessStudio>
    <div className="mx-auto flex max-w-[860px] flex-col gap-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <Link href="/admin/applications" className="text-sm underline">
          Заявки{pendingApplications > 0 ? ` (${pendingApplications} новых)` : ""}
        </Link>
      </div>

      {cohorts.map((cohort) => (
        <section key={cohort.id} className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold">
              {cohort.name} · {cohort.enrollments.length} участников
            </h2>
            <Link
              href={`/admin/modules/new?cohortId=${cohort.id}`}
              className="text-sm underline"
            >
              + модуль
            </Link>
          </div>

          <ul className="flex flex-col gap-2">
            {cohort.modules.map((m) => (
              <li key={m.id} className="flex items-stretch gap-2">
                <Link
                  href={`/admin/modules/${m.id}`}
                  className="flex flex-1 items-center justify-between rounded-lg border border-black/10 p-3 hover:bg-black/5"
                >
                  <span>
                    Неделя {m.weekNumber} · {m.title}
                    {m.courseModuleNumber && (
                      <span className="ml-2 rounded bg-black/5 px-1.5 py-0.5 text-xs text-black/60">
                        модуль 0{m.courseModuleNumber}
                      </span>
                    )}
                    {!m.isOpen && (
                      <span className="ml-2 rounded bg-black/10 px-1.5 py-0.5 text-xs">
                        закрыт
                      </span>
                    )}
                  </span>
                  <span className="text-sm text-black/50">
                    {m._count.submissions} сдач
                  </span>
                </Link>
                <form action={setModuleOpen.bind(null, m.id, !m.isOpen)}>
                  <button
                    type="submit"
                    className="h-full rounded-lg border border-black/10 px-3 text-xs hover:bg-black/5"
                  >
                    {m.isOpen ? "Закрыть" : "Открыть"}
                  </button>
                </form>
              </li>
            ))}
          </ul>

          {cohort.modules.length < PROGRAM_MODULES.length && (
            <form action={createProgramWeeks} className="text-sm">
              <input type="hidden" name="cohortId" value={cohort.id} />
              <button type="submit" className="rounded-lg border border-black/15 px-3 py-2 hover:bg-black/5">
                Создать недостающие недели из программы курса (откроется только неделя 1)
              </button>
            </form>
          )}

          <div className="rounded-lg border border-black/10 p-4">
            <h3 className="mb-2 text-sm font-semibold">Участники</h3>
            <ul className="mb-3 flex flex-col gap-1 text-sm">
              {cohort.enrollments.map((e) => (
                <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-black/5 py-1.5">
                  <span>
                    <span className="font-medium">{e.user.name || "без имени"}</span>{" "}
                    <span className="text-black/50">{e.user.email}</span>{" "}
                    <span className="rounded bg-black/5 px-1.5 py-0.5 text-xs">{LEVEL_LABEL[e.level]}</span>
                    {e.user.role !== "STUDENT" && (
                      <span className="ml-1 rounded bg-black/10 px-1.5 py-0.5 text-xs">{e.user.role}</span>
                    )}
                  </span>
                  <span className="flex gap-2">
                    {(e.user.role === "STUDENT" || e.user.role === "MENTOR") && e.user.id !== session.user.id && (
                      <form action={setUserRole.bind(null, e.user.id, e.user.role === "MENTOR" ? "STUDENT" : "MENTOR")}>
                        <button type="submit" className="rounded border border-black/15 px-2 py-0.5 text-xs">
                          {e.user.role === "MENTOR" ? "снять ментора" : "сделать ментором"}
                        </button>
                      </form>
                    )}
                    <form action={removeEnrollment.bind(null, e.id)}>
                      <button type="submit" className="rounded border border-black/15 px-2 py-0.5 text-xs text-black/60">
                        отчислить
                      </button>
                    </form>
                  </span>
                </li>
              ))}
              {cohort.enrollments.length === 0 && <li className="text-black/50">Пока никого.</li>}
            </ul>
            <form action={enrollParticipant} className="flex flex-wrap gap-2 text-sm">
              <input type="hidden" name="cohortId" value={cohort.id} />
              <input
                type="email"
                name="email"
                required
                placeholder="email участника"
                className="min-w-48 flex-1 rounded border border-black/15 p-1"
              />
              <input name="name" placeholder="Имя (видно группе)" className="min-w-36 rounded border border-black/15 p-1" />
              <select name="level" defaultValue="NOVICE" className="rounded border border-black/15 p-1">
                <option value="NOVICE">новичок</option>
                <option value="STRONG">сильный</option>
              </select>
              <button type="submit" className="rounded border border-black/15 px-3">
                зачислить
              </button>
            </form>
            <p className="mt-2 text-xs text-black/50">
              Аккаунт создаётся сразу; участник просто входит по ссылке из письма на этот email. Себя тоже можно
              зачислить — так удобно проверить, как неделя выглядит для студента.
            </p>
          </div>

          <div className="rounded-lg border border-black/10 p-4">
            <h3 className="mb-2 text-sm font-semibold">Живые созвоны</h3>
            <ul className="mb-3 flex flex-col gap-1 text-sm">
              {cohort.liveSessions.map((ls) => (
                <li key={ls.id}>
                  {ls.type} — {ls.scheduledAt.toLocaleString("ru-RU")} —{" "}
                  <a href={ls.link} className="underline">
                    ссылка
                  </a>
                </li>
              ))}
            </ul>
            <form action={createLiveSession} className="flex flex-wrap gap-2 text-sm">
              <input type="hidden" name="cohortId" value={cohort.id} />
              <select name="type" className="rounded border border-black/15 p-1">
                <option value="KICKOFF">kickoff</option>
                <option value="MIDPOINT">midpoint</option>
                <option value="FINAL">final</option>
              </select>
              <input
                type="datetime-local"
                name="scheduledAt"
                required
                className="rounded border border-black/15 p-1"
              />
              <input
                type="url"
                name="link"
                placeholder="https://meet.google.com/..."
                required
                className="flex-1 min-w-40 rounded border border-black/15 p-1"
              />
              <button type="submit" className="rounded border border-black/15 px-3">
                добавить
              </button>
            </form>
          </div>
        </section>
      ))}

      <section className="flex flex-col gap-2 border-t border-black/10 pt-6">
        <h2 className="text-lg font-semibold">Новая когорта</h2>
        <form action={createCohort} className="flex flex-wrap gap-2 text-sm">
          <input
            name="name"
            placeholder="Название когорты"
            required
            className="rounded border border-black/15 p-1"
          />
          <input
            type="date"
            name="startDate"
            required
            className="rounded border border-black/15 p-1"
          />
          <button type="submit" className="rounded border border-black/15 px-3">
            создать
          </button>
        </form>
      </section>
    </div>
    </WorkspaceShell>
  );
}
