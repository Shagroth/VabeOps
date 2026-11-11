import Link from "next/link";
import { requirePreviewEnv } from "../guard";
import { WorkspaceShell } from "@/components/WorkspaceShell";
import { SubmissionStatusBadge } from "@/components/SubmissionStatusBadge";
import { PreviewBanner } from "@/components/PreviewBanner";

const WEEKS = [
  { n: 1, title: "Agentic mindset", state: "open" as const, status: "ACCEPTED" },
  { n: 2, title: "Context engineering, skills и sub-agents", state: "open" as const, status: null },
  { n: 3, title: "MCP и плагины", state: "locked" as const, status: null },
];

export default function PreviewDashboardPage() {
  requirePreviewEnv();

  return (
    <WorkspaceShell active="overview" email="preview@example.test" isAdmin={false} breadcrumb="Demo Pilot">
      <div className="mx-auto flex max-w-[860px] flex-col gap-8">
        <PreviewBanner label="Обзор — зачисленный участник" />

        <div>
          <h1 className="text-2xl font-semibold">Demo Pilot</h1>
          <p className="text-sm text-graphite-muted">Обзор твоего прогресса в пилоте</p>
        </div>

        <div className="rounded-xl border border-hairline bg-white/60 p-6">
          <span className="text-xs uppercase tracking-wide text-graphite-muted">
            Следующий шаг
          </span>
          <div className="mt-1 text-lg font-medium">
            Неделя 2 · Context engineering, skills и sub-agents
          </div>
          <div className="text-sm text-graphite-muted">
            Открыта, но ты ещё не сдал(а) практику — продолжить →
          </div>
        </div>

        <section>
          <h2 className="mb-3 text-sm font-medium text-graphite-muted">Недели когорты</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {WEEKS.map((w) => (
              <div
                key={w.n}
                className={`rounded-xl border border-hairline bg-white/50 p-4 ${
                  w.state === "locked" ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Неделя {w.n}</span>
                  {w.state === "locked" ? (
                    <span className="text-xs text-graphite-muted">закрыта</span>
                  ) : w.status ? (
                    <SubmissionStatusBadge status={w.status} />
                  ) : (
                    <span className="text-xs text-graphite-muted">не начата</span>
                  )}
                </div>
                <p className="mt-1 text-sm text-graphite-muted">{w.title}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-hairline bg-white/40 p-4 text-sm">
          <span className="text-xs uppercase tracking-wide text-graphite-muted">
            Ближайшая встреча
          </span>
          <div className="mt-1 flex items-center justify-between">
            <span>Мидпоинт — 25.11.2026, 19:00</span>
            <span className="font-medium text-ink">Присоединиться</span>
          </div>
        </section>

        <Link href="/preview" className="text-sm text-graphite-muted underline">
          ← все preview-состояния
        </Link>
      </div>
    </WorkspaceShell>
  );
}
