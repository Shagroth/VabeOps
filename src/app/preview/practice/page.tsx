import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { requirePreviewEnv } from "../guard";
import { WorkspaceShell } from "@/components/WorkspaceShell";
import { SubmissionStatusBadge } from "@/components/SubmissionStatusBadge";
import { PreviewBanner } from "@/components/PreviewBanner";

const STEPS = [
  { label: "Задача", value: "Добавить скидку для тарифа enterprise, не меняя контракт функции." },
  { label: "Подход", value: "Добавил(а) ветку внутри существующей функции." },
  {
    label: "Отвергнутая альтернатива",
    value: "Вынести в отдельный DiscountResolver — лишний рефакторинг ради одной строки.",
  },
  { label: "Проверка", value: "Прогнал(а) существующий набор тестов — 12/12 прошли." },
  { label: "Риск / ограничение", value: "Если тарифов станет больше пяти, стоит пересмотреть структуру." },
  { label: "Условие пересмотра", value: "Если появится собственная логика скидок на уровне биллинга." },
];

export default function PreviewPracticePage() {
  requirePreviewEnv();

  return (
    <WorkspaceShell
      active="program"
      email="preview@example.test"
      isAdmin={false}
      breadcrumb="Неделя 1 · Agentic mindset"
    >
      <div className="mx-auto flex max-w-[820px] flex-col gap-8">
        <PreviewBanner label="Урок и практика — статичный макет, кнопки не отправляют данные" />

        <div>
          <span className="text-sm text-graphite-muted">Неделя 1</span>
          <h1 className="text-2xl font-semibold">Agentic mindset</h1>
        </div>

        <section className="prose prose-sm max-w-none prose-headings:font-semibold prose-h1:text-xl prose-h2:text-lg">
          <ReactMarkdown>{"# Контекст важнее промпта\n\nЧат vs агент, где агент врёт и почему."}</ReactMarkdown>
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Задание</h2>
            <SubmissionStatusBadge status="ACCEPTED" />
          </div>
          <p className="text-sm text-graphite-muted">
            Разбери свой реальный кейс: где ты используешь чат, а где — агент, и почему.
          </p>

          <label className="flex flex-col gap-1 text-sm">
            Результат
            <textarea
              readOnly
              rows={3}
              defaultValue="https://github.com/example/repo/pull/12"
              className="w-full rounded-lg border border-hairline bg-white/40 p-3"
            />
          </label>

          <fieldset className="rounded-xl border border-hairline p-5">
            <legend className="px-1 text-sm font-medium">Разбор решения</legend>
            <div className="flex flex-col">
              {STEPS.map((step, i) => (
                <div key={step.label} className="relative flex gap-4">
                  <div className="relative flex w-[15px] flex-shrink-0 flex-col items-center">
                    <span className="z-10 mt-1.5 h-[13px] w-[13px] rounded-full border-2 border-ink bg-ink" />
                    {i < STEPS.length - 1 && (
                      <span className="w-px flex-1 bg-hairline" aria-hidden="true" />
                    )}
                  </div>
                  <label className="flex flex-1 flex-col gap-1 pb-5 text-sm">
                    <span className="font-medium">{step.label}</span>
                    <textarea
                      readOnly
                      rows={2}
                      defaultValue={step.value}
                      className="rounded-lg border border-hairline bg-white/40 p-2 text-sm"
                    />
                  </label>
                </div>
              ))}
            </div>
          </fieldset>

          <div className="rounded-lg border border-accent-change/40 p-4 text-sm">
            <span className="font-medium">Изменились условия</span>
            <p className="mb-2 text-graphite-muted">
              Инструмент теперь работает в режиме read-only — как это меняет твой подход?
            </p>
            <textarea
              readOnly
              rows={2}
              defaultValue="Пришлось бы выносить логику в отдельный PR с ручным ревью перед мержем."
              className="w-full rounded-lg border border-hairline bg-white/40 p-2"
            />
          </div>

          <div className="rounded-lg border border-hairline bg-white/40 p-4 text-sm">
            <span className="font-medium">Фидбек по сдаче</span>
            <p className="mt-1 text-graphite-muted">admin@example.test: Чисто, принято.</p>
          </div>
        </section>

        <Link href="/preview" className="text-sm text-graphite-muted underline">
          ← все preview-состояния
        </Link>
      </div>
    </WorkspaceShell>
  );
}
