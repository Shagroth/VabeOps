import Link from "next/link";
import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { WorkspaceShell } from "@/components/WorkspaceShell";
import { COURSE_KEYS, COURSES } from "@/content/course-catalog";
import { FUNNEL_EVENTS, FUNNEL_EVENT_LABEL, funnelDay, summarizeFunnel } from "@/lib/funnel";

const DAYS = 30;

/** Totals for the last DAYS days and for all time. Kept out of the component: it reads the clock. */
async function loadFunnel() {
  const since = funnelDay(new Date(Date.now() - (DAYS - 1) * 24 * 60 * 60 * 1000));
  const [recent, allTime] = await Promise.all([
    prisma.funnelCount.groupBy({
      by: ["course", "moduleNumber", "event"],
      where: { day: { gte: since } },
      _sum: { count: true },
    }),
    prisma.funnelCount.groupBy({ by: ["course", "moduleNumber", "event"], _sum: { count: true } }),
  ]);
  return { recent, allTime };
}

export default async function AnalyticsPage() {
  const session = await requireAdmin();

  const { recent, allTime } = await loadFunnel();
  const toRows = (groups: typeof recent) =>
    groups.map((g) => ({ course: g.course, moduleNumber: g.moduleNumber, event: g.event, count: g._sum.count ?? 0 }));

  const periods = [
    { title: `За ${DAYS} дней`, rows: toRows(recent) },
    { title: "За всё время", rows: toRows(allTime) },
  ];

  return (
    <WorkspaceShell active="admin" email={session.user.email ?? ""} canAccessStudio canReviewSubmissions>
      <div className="mx-auto flex max-w-[1080px] flex-col gap-10">
        <div>
          <Link href="/admin" className="text-sm text-graphite-muted underline">
            ← Admin
          </Link>
          <h1 className="mt-3 text-2xl font-semibold">Воронка открытых модулей</h1>
          <p className="mt-2 max-w-[70ch] text-sm text-graphite-muted">
            Считаются события, а не люди: один браузер отправляет каждое событие модуля один раз. Никаких
            идентификаторов, cookie и IP не хранится, поэтому уникальных посетителей здесь нет. Учитываются только
            публичные страницы курсов, кабинет участников не считается.
          </p>
        </div>

        {COURSE_KEYS.map((key) => {
          const course = COURSES[key];
          const modules = course.publicModules;
          return (
            <section key={key} className="flex flex-col gap-5">
              <h2 className="text-lg font-semibold">{course.title}</h2>
              {periods.map((period) => {
                const summary = summarizeFunnel(period.rows, key, modules);
                return (
                  <div key={period.title} className="overflow-x-auto rounded-[18px] border border-hairline bg-white">
                    <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                      <caption className="px-4 pt-4 text-left font-mono text-xs uppercase tracking-[0.08em] text-graphite-muted">
                        {period.title}
                      </caption>
                      <thead>
                        <tr className="text-graphite-muted">
                          <th scope="col" className="px-4 py-3 font-normal">Модуль</th>
                          {FUNNEL_EVENTS.map((event) => (
                            <th key={event} scope="col" className="px-4 py-3 font-normal">
                              {FUNNEL_EVENT_LABEL[event]}
                            </th>
                          ))}
                          <th scope="col" className="px-4 py-3 font-normal">До артефакта</th>
                        </tr>
                      </thead>
                      <tbody>
                        {summary.map((m) => (
                          <tr key={m.moduleNumber} className="border-t border-hairline">
                            <th scope="row" className="px-4 py-3 font-medium">
                              0{m.moduleNumber} · {course.modules.find((x) => x.number === m.moduleNumber)?.shortTitle}
                            </th>
                            {FUNNEL_EVENTS.map((event) => (
                              <td key={event} className="px-4 py-3 tabular-nums">
                                {m.counts[event]}
                              </td>
                            ))}
                            <td className="px-4 py-3 font-medium tabular-nums">
                              {m.reachedArtifactPct === null ? "—" : `${m.reachedArtifactPct}%`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </section>
          );
        })}
      </div>
    </WorkspaceShell>
  );
}
