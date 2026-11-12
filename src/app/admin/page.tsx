import Link from "next/link";
import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { WorkspaceShell } from "@/components/WorkspaceShell";
import { createCohort, createLiveSession } from "./actions";

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
      enrollments: true,
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
              <li key={m.id}>
                <Link
                  href={`/admin/modules/${m.id}`}
                  className="flex items-center justify-between rounded-lg border border-black/10 p-3 hover:bg-black/5"
                >
                  <span>
                    Неделя {m.weekNumber} · {m.title}
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
              </li>
            ))}
          </ul>

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
