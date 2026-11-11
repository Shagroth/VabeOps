import Link from "next/link";
import { requirePreviewEnv } from "../guard";
import { WorkspaceShell } from "@/components/WorkspaceShell";
import { PreviewBanner } from "@/components/PreviewBanner";

export default function PreviewNoCohortPage() {
  requirePreviewEnv();

  return (
    <WorkspaceShell active="overview" email="preview-no-cohort@example.test" isAdmin={false}>
      <div className="mx-auto flex max-w-[860px] flex-col gap-6">
        <PreviewBanner label="Обзор — аккаунт без когорты" />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 rounded-2xl border border-hairline bg-white/40 px-6 py-16 text-center">
          <svg viewBox="0 0 160 80" className="h-14 w-28 opacity-70" fill="none" aria-hidden="true">
            <path d="M10 70 L60 40" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            <path d="M60 40 L140 12" stroke="var(--system)" strokeWidth="2.5" />
            <path d="M60 40 L120 66" stroke="currentColor" strokeWidth="2" opacity="0.25" strokeDasharray="4 4" />
            <circle cx="60" cy="40" r="4" fill="currentColor" opacity="0.5" />
            <circle cx="140" cy="12" r="5" fill="var(--system)" />
          </svg>
          <h1 className="text-2xl font-semibold">Пока нет активной когорты</h1>
          <p className="max-w-[48ch] text-graphite-muted">
            Твой аккаунт подтверждён, но ты ещё не прикреплён(а) ни к одной когорте пилота.
            Обычно это значит, что зачисление ещё в процессе — автор добавляет участников
            вручную после рассмотрения заявки.
          </p>
        </div>
        <Link href="/preview" className="text-sm text-graphite-muted underline">
          ← все preview-состояния
        </Link>
      </div>
    </WorkspaceShell>
  );
}
