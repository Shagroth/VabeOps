import {
  HOMEWORK_SCORING,
  type HomeworkAssignment,
  formatHomeworkTime,
} from "@/content/demo-course-homework";

export function HomeworkAssignmentSection({ assignment }: { assignment: HomeworkAssignment }) {
  return (
    <section id="homework" className="scroll-mt-24 border-t border-hairline bg-[#eef0ea]">
      <div className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        <header className="overflow-hidden rounded-[28px] bg-ink text-ink-foreground">
          <div className="grid gap-px bg-hairline-ink lg:grid-cols-[1fr_300px]">
            <div className="bg-ink p-6 sm:p-9 lg:p-12">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">Домашняя работа · 0{assignment.moduleNumber}</span>
                <span className="rounded-full border border-hairline-ink px-2.5 py-1 font-mono text-[9px] uppercase text-ink-muted">сквозной проект</span>
              </div>
              <h2 className="mt-5 max-w-[20ch] text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">{assignment.title}</h2>
              <p className="mt-5 max-w-[70ch] text-base leading-relaxed text-ink-muted">{assignment.dek}</p>
            </div>
            <div className="grid grid-cols-2 gap-px bg-hairline-ink lg:grid-cols-1">
              <HomeworkMetric label="Оценка времени" value={formatHomeworkTime(assignment.estimatedMinutes)} />
              <HomeworkMetric label="Максимум" value="20 баллов" />
            </div>
          </div>
          <div className="border-t border-hairline-ink px-6 py-5 sm:px-9 lg:px-12">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-signal">На выходе</span>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{assignment.outcome}</p>
          </div>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          <section className="rounded-2xl border border-hairline bg-white/60 p-6 sm:p-8">
            <SectionLabel>Исходная ситуация</SectionLabel>
            <div className="mt-5 space-y-4">
              {assignment.situation.map((paragraph) => <p key={paragraph} className="text-sm leading-relaxed text-graphite-muted">{paragraph}</p>)}
            </div>
            {assignment.code && (
              <div className="mt-6 overflow-hidden rounded-xl bg-ink text-ink-foreground">
                <div className="border-b border-hairline-ink px-4 py-3 font-mono text-[9px] uppercase tracking-wide text-ink-muted">{assignment.code.label}</div>
                <pre className="overflow-x-auto whitespace-pre-wrap break-words p-4 font-mono text-[11px] leading-relaxed text-signal">{assignment.code.value}</pre>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-hairline bg-white/60 p-6 sm:p-8">
            <SectionLabel>Техническое задание</SectionLabel>
            <ol className="mt-5 space-y-4">
              {assignment.tasks.map((task, index) => (
                <li key={task} className="grid grid-cols-[32px_1fr] gap-3 text-sm leading-relaxed text-graphite-muted">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-system/30 bg-system/[0.06] font-mono text-[10px] text-system">{String(index + 1).padStart(2, "0")}</span>
                  <span className="pt-1.5">{task}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {assignment.validationScenarios && (
          <section className="mt-6 rounded-2xl border border-hairline bg-white/60 p-6 sm:p-8">
            <SectionLabel>Обязательные проверки</SectionLabel>
            <div className="mt-5 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
              {assignment.validationScenarios.map((scenario, index) => (
                <div key={scenario} className="bg-[#f8f9f5] p-4">
                  <span className="font-mono text-[9px] text-system">{String(index + 1).padStart(2, "0")}</span>
                  <p className="mt-2 text-xs leading-relaxed text-graphite-muted">{scenario}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="overflow-hidden rounded-2xl bg-ink text-ink-foreground">
            <div className="border-b border-hairline-ink px-5 py-4 sm:px-6"><SectionLabel tone="dark">Что сдать</SectionLabel></div>
            <pre className="overflow-x-auto whitespace-pre p-5 font-mono text-[11px] leading-relaxed text-ink-muted sm:p-6">{assignment.deliverables.tree}</pre>
            {assignment.deliverables.notes && (
              <ul className="border-t border-hairline-ink px-5 py-5 sm:px-6">
                {assignment.deliverables.notes.map((note) => <li key={note} className="mt-2 flex gap-3 text-xs leading-relaxed text-ink-muted first:mt-0"><span className="text-signal">→</span>{note}</li>)}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-hairline bg-white/60 p-6 sm:p-8">
            <SectionLabel>Критерии приёмки</SectionLabel>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {assignment.acceptance.map((criterion) => (
                <li key={criterion} className="flex gap-3 rounded-xl border border-hairline bg-[#f8f9f5] p-4 text-xs leading-relaxed text-graphite-muted">
                  <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-signal text-[10px] text-signal-ink">✓</span>
                  {criterion}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {assignment.comparisonRows && <ComparisonTable rows={assignment.comparisonRows} />}

        <section className="mt-6 rounded-2xl border border-hairline bg-white/60 p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel>Как считаются 20 баллов</SectionLabel>
              <p className="mt-3 max-w-[64ch] text-sm leading-relaxed text-graphite-muted">Оценивается не объём кода и не красота ответа модели, а способность поставить границы, получить доказательства и принять собственное инженерное решение.</p>
            </div>
            <span className="font-mono text-xs uppercase tracking-wide text-system">pass: 14 / 20</span>
          </div>
          <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline md:grid-cols-3">
            {HOMEWORK_SCORING.map((item) => (
              <article key={item.label} className="bg-[#f8f9f5] p-4">
                <span className="font-mono text-lg text-system">+{item.points}</span>
                <h3 className="mt-2 text-sm font-medium">{item.label}</h3>
                <p className="mt-2 text-xs leading-relaxed text-graphite-muted">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <aside className="mt-6 rounded-2xl border border-accent-change/35 bg-accent-change/[0.06] p-6 sm:p-8">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent-change">Усложнение / необязательно</span>
          <p className="mt-3 max-w-[90ch] text-sm leading-relaxed text-graphite-muted">{assignment.challenge}</p>
        </aside>
      </div>
    </section>
  );
}

function HomeworkMetric({ label, value }: { label: string; value: string }) {
  return <div className="bg-ink p-5 sm:p-6"><span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted">{label}</span><p className="mt-2 text-xl font-semibold text-signal">{value}</p></div>;
}

function SectionLabel({ children, tone = "light" }: { children: React.ReactNode; tone?: "light" | "dark" }) {
  return <span className={`font-mono text-[10px] uppercase tracking-[0.18em] ${tone === "dark" ? "text-signal" : "text-system"}`}>{children}</span>;
}

function ComparisonTable({ rows }: { rows: string[] }) {
  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-hairline bg-white/60">
      <div className="p-6 sm:p-8"><SectionLabel>Сравнение, которое нельзя пропустить</SectionLabel><p className="mt-3 text-sm text-graphite-muted">Заполни таблицу фактами из двух запусков. «Кажется, было лучше» — не метрика.</p></div>
      <div className="overflow-x-auto border-t border-hairline">
        <table className="w-full min-w-[620px] border-collapse text-left text-xs">
          <thead className="bg-[#eceee7] font-mono uppercase tracking-wide text-graphite-muted"><tr><th className="px-5 py-3 font-normal">Метрика</th><th className="border-l border-hairline px-5 py-3 font-normal">Один агент</th><th className="border-l border-hairline px-5 py-3 font-normal">Несколько агентов</th></tr></thead>
          <tbody>{rows.map((row) => <tr key={row} className="border-t border-hairline"><th className="px-5 py-4 font-medium">{row}</th><td className="border-l border-hairline px-5 py-4 text-graphite-muted">Заполни после запуска</td><td className="border-l border-hairline px-5 py-4 text-graphite-muted">Заполни после запуска</td></tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}
