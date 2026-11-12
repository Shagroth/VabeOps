import Link from "next/link";
import { requireStudioAccess } from "@/lib/require-role";
import { prisma } from "@/lib/prisma";
import { WorkspaceShell } from "@/components/WorkspaceShell";

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Черновик",
  IN_REVIEW: "На ревью",
  PUBLISHED: "Опубликовано",
  ARCHIVED: "В архиве",
};

const STATUS_TONE: Record<string, string> = {
  DRAFT: "border-hairline text-graphite-muted",
  IN_REVIEW: "border-system/40 bg-system/10 text-system",
  PUBLISHED: "border-signal/40 bg-signal/20 text-graphite",
  ARCHIVED: "border-hairline text-graphite-muted/60",
};

export default async function StudioPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string }>;
}) {
  const session = await requireStudioAccess();
  const role = session.user.role;
  const { type: typeFilter, status: statusFilter } = await searchParams;

  const isAuthorOnly = role === "AUTHOR";
  const authorScope = isAuthorOnly ? { authorId: session.user.id } : {};
  const statusScope = statusFilter ? { status: statusFilter as never } : {};

  const [articles, signals, pendingApplications] = await Promise.all([
    typeFilter === "signal"
      ? Promise.resolve([])
      : prisma.article.findMany({
          where: { ...authorScope, ...statusScope },
          include: { author: true },
          orderBy: { updatedAt: "desc" },
        }),
    typeFilter === "article"
      ? Promise.resolve([])
      : prisma.signal.findMany({
          where: { ...authorScope, ...statusScope },
          include: { author: true },
          orderBy: { updatedAt: "desc" },
        }),
    role === "ADMIN" ? prisma.application.count({ where: { status: "PENDING" } }) : Promise.resolve(0),
  ]);

  type Row = {
    id: string;
    kind: "Статья" | "Signal";
    title: string;
    status: string;
    author: string;
    updatedAt: Date;
    href: string;
  };

  const rows: Row[] = [
    ...articles.map((a) => ({
      id: a.id,
      kind: "Статья" as const,
      title: a.title,
      status: a.status,
      author: a.author.email ?? a.author.id,
      updatedAt: a.updatedAt,
      href: `/studio/articles/${a.id}`,
    })),
    ...signals.map((s) => ({
      id: s.id,
      kind: "Signal" as const,
      title: s.title,
      status: s.status,
      author: s.author.email ?? s.author.id,
      updatedAt: s.updatedAt,
      href: `/studio/signals/${s.id}`,
    })),
  ].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  return (
    <WorkspaceShell active="admin" email={session.user.email ?? ""} canAccessStudio breadcrumb="Studio">
      <div className="mx-auto flex max-w-[1080px] flex-col gap-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Studio</h1>
            <p className="text-sm text-graphite-muted">
              Роль: {role}. {isAuthorOnly ? "Показаны только твои материалы." : "Показаны все материалы."}
            </p>
          </div>
          {(role === "ADMIN" || role === "EDITOR" || role === "AUTHOR") && (
            <div className="flex gap-2">
              <Link href="/studio/articles/new" className="rounded-lg border border-hairline px-3 py-2 text-sm">
                + Статья
              </Link>
              <Link href="/studio/signals/new" className="rounded-lg border border-hairline px-3 py-2 text-sm">
                + Signal
              </Link>
            </div>
          )}
        </div>

        {role === "ADMIN" && (
          <section className="grid gap-3 sm:grid-cols-3">
            <Link href="/admin" className="rounded-xl border border-hairline bg-white/50 p-4 text-sm">
              <span className="font-mono text-[10px] uppercase tracking-wide text-graphite-muted">Операционное</span>
              <p className="mt-1 font-medium">Когорты, модули, созвоны</p>
            </Link>
            <Link href="/admin/applications" className="rounded-xl border border-hairline bg-white/50 p-4 text-sm">
              <span className="font-mono text-[10px] uppercase tracking-wide text-graphite-muted">Заявки</span>
              <p className="mt-1 font-medium">
                {pendingApplications > 0 ? `${pendingApplications} новых` : "Новых нет"}
              </p>
            </Link>
            <div className="rounded-xl border border-hairline bg-white/30 p-4 text-sm text-graphite-muted">
              <span className="font-mono text-[10px] uppercase tracking-wide">Курсы / комиксы</span>
              <p className="mt-1">
                Пока ведутся как контент-фикстуры в коде, не через Studio — см. backlog.
              </p>
            </div>
          </section>
        )}

        <section>
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-graphite-muted">Фильтр по типу:</span>
            {["all", "article", "signal"].map((t) => (
              <Link
                key={t}
                href={`/studio?${new URLSearchParams({
                  ...(t !== "all" ? { type: t } : {}),
                  ...(statusFilter ? { status: statusFilter } : {}),
                }).toString()}`}
                className={`rounded-full border px-3 py-1 ${
                  (typeFilter ?? "all") === t ? "border-ink bg-ink text-ink-foreground" : "border-hairline text-graphite-muted"
                }`}
              >
                {t === "all" ? "Все" : t === "article" ? "Статьи" : "Signals"}
              </Link>
            ))}
            <span className="ml-3 text-graphite-muted">Статус:</span>
            {["all", "DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"].map((st) => (
              <Link
                key={st}
                href={`/studio?${new URLSearchParams({
                  ...(typeFilter ? { type: typeFilter } : {}),
                  ...(st !== "all" ? { status: st } : {}),
                }).toString()}`}
                className={`rounded-full border px-3 py-1 ${
                  (statusFilter ?? "all") === st ? "border-ink bg-ink text-ink-foreground" : "border-hairline text-graphite-muted"
                }`}
              >
                {st === "all" ? "Все" : STATUS_LABEL[st]}
              </Link>
            ))}
          </div>

          <div className="overflow-x-auto rounded-xl border border-hairline">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-white/50 text-xs uppercase tracking-wide text-graphite-muted">
                <tr>
                  <th className="px-4 py-2 font-medium">Тип</th>
                  <th className="px-4 py-2 font-medium">Заголовок</th>
                  <th className="px-4 py-2 font-medium">Статус</th>
                  <th className="px-4 py-2 font-medium">Автор</th>
                  <th className="px-4 py-2 font-medium">Обновлено</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={`${r.kind}-${r.id}`} className="border-t border-hairline hover:bg-white/50">
                    <td className="px-4 py-2 text-graphite-muted">{r.kind}</td>
                    <td className="px-4 py-2">
                      <Link href={r.href} className="font-medium text-ink underline underline-offset-2">
                        {r.title || "(без названия)"}
                      </Link>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`rounded-full border px-2 py-0.5 text-xs ${STATUS_TONE[r.status]}`}>
                        {STATUS_LABEL[r.status]}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-graphite-muted">{r.author}</td>
                    <td className="px-4 py-2 text-graphite-muted">{r.updatedAt.toLocaleDateString("ru-RU")}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-graphite-muted">
                      Пока нет материалов, подходящих под фильтр.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </WorkspaceShell>
  );
}
