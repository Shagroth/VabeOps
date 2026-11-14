import type { ReactNode } from "react";
import {
  HOMEWORK_PASS_SCORE,
  HOMEWORK_SCORING,
  type HomeworkAssignment,
  formatHomeworkTime,
} from "@/content/demo-course-homework";
import type { ScoringCriterion } from "@/content/course-catalog";
import { Reveal } from "@/components/motion/Reveal";
import { CARD, Checklist, FileCard, Label } from "./flow-ui";

const H3 = "text-[23px] font-bold leading-tight tracking-[-0.015em]";

export function HomeworkAssignmentSection({
  assignment,
  scoring = HOMEWORK_SCORING,
  passScore = HOMEWORK_PASS_SCORE,
  scoringNote = "Объём кода и красота ответа модели баллов не приносят. Баллы — за то, что ты поставил границы, добыл доказательства и сам принял инженерное решение.",
  tasksTitle = "Техническое задание",
}: {
  assignment: HomeworkAssignment;
  /** Rubric of the course; defaults to the engineers' one. */
  scoring?: readonly ScoringCriterion[];
  passScore?: number;
  /** One line on what the points are given for. */
  scoringNote?: string;
  /** Heading of the task list. */
  tasksTitle?: string;
}) {
  const maxScore = scoring.reduce((sum, item) => sum + item.points, 0);
  return (
    <section id="homework" className="kg-anchor border-t border-hairline bg-white">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-14 px-5 py-20 sm:px-8 lg:py-24">
        <Reveal as="div" className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.85fr)] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Label number={`0${assignment.moduleNumber}`}>Домашняя работа</Label>
              <span className="rounded-full bg-paper-deep px-3 py-1 font-mono text-xs text-graphite">сквозной проект</span>
            </div>
            <h2 className="mt-5 max-w-[16ch] text-[clamp(36px,4.4vw,60px)] font-extrabold leading-none tracking-[-0.035em]">
              {assignment.title}
            </h2>
            <p className="mt-6 max-w-[34em] text-[19px] leading-[1.6] text-graphite-soft">{assignment.dek}</p>
          </div>

          <div className="rounded-[28px] bg-ink p-7 text-ink-foreground sm:p-8">
            <dl className="grid grid-cols-2 gap-6">
              <Metric label="Оценка времени" value={formatHomeworkTime(assignment.estimatedMinutes)} />
              <Metric label="Максимум" value={`${maxScore} баллов`} />
            </dl>
            <div className="mt-7 border-t border-ink-line pt-6">
              <span className="font-mono text-[13px] uppercase tracking-[0.08em] text-system">На выходе</span>
              <p className="mt-2 leading-relaxed text-ink-muted">{assignment.outcome}</p>
            </div>
          </div>
        </Reveal>

        <Reveal mode="children" className="grid gap-x-12 gap-y-12 lg:grid-cols-[0.82fr_1.18fr]">
          <Block title="Исходная ситуация">
            <div className="mt-5 space-y-4">
              {assignment.situation.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed text-graphite-soft">{paragraph}</p>
              ))}
            </div>
            {assignment.code && (
              <div className="mt-6 overflow-hidden rounded-[18px] bg-ink text-ink-foreground">
                <div className="border-b border-ink-line px-5 py-3 font-mono text-[13px] text-ink-muted">{assignment.code.label}</div>
                <pre className="overflow-x-auto whitespace-pre-wrap break-words p-5 font-mono text-sm leading-relaxed text-system">{assignment.code.value}</pre>
              </div>
            )}
          </Block>

          <Block title={tasksTitle}>
            <ol className="mt-2">
              {assignment.tasks.map((task, index) => (
                <li key={task} className="kg-item grid grid-cols-[44px_1fr] gap-x-3 border-b border-hairline py-4 leading-relaxed" style={{ "--i": index } as React.CSSProperties}>
                  <span className="font-mono text-[15px] text-string">{String(index + 1).padStart(2, "0")}</span>
                  <span>{task}</span>
                </li>
              ))}
            </ol>
          </Block>
        </Reveal>

        {assignment.validationScenarios && (
          <Reveal>
            <Block title="Обязательные проверки">
              <ol className="mt-2 grid gap-x-7 sm:grid-cols-2 lg:grid-cols-4">
                {assignment.validationScenarios.map((scenario, index) => (
                  <li key={scenario} className="border-b border-hairline py-4">
                    <span className="font-mono text-[15px] text-string">{String(index + 1).padStart(2, "0")}</span>
                    <p className="mt-2 text-[15px] leading-relaxed text-graphite-soft">{scenario}</p>
                  </li>
                ))}
              </ol>
            </Block>
          </Reveal>
        )}

        <Reveal className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <FileCard name="Что сдать" className="self-start">
            <pre className="overflow-x-auto whitespace-pre pb-6 pr-6 font-mono text-sm leading-relaxed">{assignment.deliverables.tree}</pre>
            {assignment.deliverables.notes && (
              <ul className="space-y-2.5 border-t border-ink-line py-6 pr-6">
                {assignment.deliverables.notes.map((note) => (
                  <li key={note} className="flex gap-3 text-[15px] leading-relaxed text-ink-muted">
                    <span aria-hidden="true" className="text-system">→</span>
                    {note}
                  </li>
                ))}
              </ul>
            )}
          </FileCard>

          <div className={CARD}>
            <Label>Критерии приёмки</Label>
            <Checklist items={assignment.acceptance} />
          </div>
        </Reveal>

        {assignment.comparisonRows && <ComparisonTable rows={assignment.comparisonRows} />}

        <Reveal mode="children">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h3 className={H3}>Как считаются {maxScore} баллов</h3>
              <p className="mt-3 max-w-[38em] leading-relaxed text-graphite-soft">
{scoringNote}
              </p>
            </div>
            <span className="rounded-full bg-sky-tint px-4 py-2 font-mono text-[13px] text-sky-deep">зачёт: {passScore} / {maxScore}</span>
          </div>
          <div className="relative mt-8 grid gap-x-7 sm:grid-cols-2 lg:grid-cols-3">
            <span aria-hidden="true" className="kg-rule absolute inset-x-0 top-0 h-[1.5px] bg-graphite" />
            {scoring.map((item, index) => (
              <article key={item.label} className="kg-item border-b border-hairline py-6" style={{ "--i": index } as React.CSSProperties}>
                <span className="text-[40px] font-extrabold leading-none tracking-[-0.04em] text-signal">+{item.points}</span>
                <h4 className="mt-3 text-lg font-bold tracking-[-0.01em]">{item.label}</h4>
                <p className="mt-1.5 text-[15px] leading-relaxed text-graphite-soft">{item.detail}</p>
              </article>
            ))}
          </div>
        </Reveal>

        <Reveal as="div" className="rounded-[28px] bg-sky-tint p-7 sm:p-9">
          <span className="font-mono text-[13px] uppercase tracking-[0.08em] text-sky-deep">Усложнение · необязательно</span>
          <p className="mt-3 max-w-[40em] text-[19px] leading-[1.55]">{assignment.challenge}</p>
        </Reveal>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[13px] uppercase tracking-[0.08em] text-ink-muted">{label}</dt>
      <dd className="mt-2 text-[28px] font-extrabold leading-none tracking-[-0.03em]">{value}</dd>
    </div>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className={`border-b-[1.5px] border-graphite pb-4 ${H3}`}>{title}</h3>
      {children}
    </section>
  );
}

function ComparisonTable({ rows }: { rows: string[] }) {
  return (
    <Reveal>
      <h3 className={H3}>Сравнение, которое нельзя пропустить</h3>
      <p className="mt-3 max-w-[38em] leading-relaxed text-graphite-soft">
        Заполни таблицу фактами из двух запусков. «Кажется, было лучше» — не метрика.
      </p>
      <div className="mt-6 overflow-x-auto rounded-[24px] border border-hairline">
        <table className="w-full min-w-[620px] border-collapse text-left text-[15px]">
          <thead className="bg-paper font-mono text-[13px] uppercase tracking-[0.08em] text-graphite-muted">
            <tr>
              <th scope="col" className="px-6 py-4 font-normal">Метрика</th>
              <th scope="col" className="border-l border-hairline px-6 py-4 font-normal">Один агент</th>
              <th scope="col" className="border-l border-hairline px-6 py-4 font-normal">Несколько агентов</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row} className="border-t border-hairline">
                <th scope="row" className="px-6 py-4 font-semibold">{row}</th>
                <td className="border-l border-hairline px-6 py-4 text-graphite-muted">Заполни после запуска</td>
                <td className="border-l border-hairline px-6 py-4 text-graphite-muted">Заполни после запуска</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Reveal>
  );
}
