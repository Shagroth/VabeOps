import Link from "next/link";
import {
  PROGRAM_MODULES,
  PROGRAM_TOTALS,
  formatHours,
  formatMinutes,
} from "@/content/demo-course-program";

const TOTAL_MIN = PROGRAM_TOTALS.guidedMin + PROGRAM_TOTALS.practiceMin;
const TOTAL_MAX = PROGRAM_TOTALS.guidedMax + PROGRAM_TOTALS.practiceMax;

export function CourseProgramOverview() {
  return (
    <>
      <section className="border-b border-hairline bg-[#f3f4ef]">
        <div className="mx-auto max-w-[1280px] px-6 py-14 lg:px-10 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-system">
                Field course / оценочный прототип
              </span>
              <h1 className="mt-5 max-w-[15ch] text-[2.8rem] font-semibold leading-[0.98] tracking-tight sm:text-[4.4rem] lg:text-[5.3rem]">
                Инженерная работа с ИИ
              </h1>
              <p className="mt-7 max-w-[62ch] text-lg leading-relaxed text-graphite-muted">
                Пять модулей от постановки задачи до мультиагентной системы. Это уже проходимый прототип программы: с кейсами, решениями, лабораториями и рабочими артефактами.
              </p>
            </div>

            <div className="rounded-2xl bg-ink p-6 text-ink-foreground sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">Нагрузка участника</span>
                <span className="rounded-full border border-hairline-ink px-2.5 py-1 font-mono text-[9px] uppercase text-ink-muted">v0.2</span>
              </div>
              <p className="mt-5 text-4xl font-semibold tracking-tight">{formatHours(TOTAL_MIN, TOTAL_MAX)}</p>
              <p className="mt-2 text-sm text-ink-muted">за 5 недель · примерно {formatHours(Math.round(TOTAL_MIN / 5), Math.round(TOTAL_MAX / 5))} в неделю</p>
              <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-hairline-ink">
                <Metric label="В интерфейсе" value={formatHours(PROGRAM_TOTALS.guidedMin, PROGRAM_TOTALS.guidedMax)} />
                <Metric label="Своя практика" value={formatHours(PROGRAM_TOTALS.practiceMin, PROGRAM_TOTALS.practiceMax)} />
              </div>
              <p className="mt-5 text-[11px] leading-relaxed text-ink-muted/75">
                Это оценка прототипа, не обещание длительности. Финальный хронометраж уточним после пилота по медиане и p90 прохождения.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-10 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-graphite-muted">Curriculum / 05 modules</span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Полный маршрут</h2>
          </div>
          <p className="max-w-[48ch] text-sm leading-relaxed text-graphite-muted">
            Каждый модуль заканчивается артефактом, который можно перенести в рабочий процесс — не только ответом на тест.
          </p>
        </div>

        <ol className="mt-10 space-y-4">
          {PROGRAM_MODULES.map((module, index) => (
            <li key={module.number}>
              <Link
                href={`/demo-course/${module.number}`}
                className="group grid overflow-hidden rounded-2xl border border-hairline bg-white/55 transition-all hover:-translate-y-0.5 hover:border-system/50 hover:shadow-[0_24px_60px_-45px_rgba(10,15,24,0.5)] lg:grid-cols-[110px_1.2fr_0.8fr_180px]"
              >
                <div className="flex min-h-[104px] items-center justify-center border-b border-hairline bg-[#eceee7] font-mono text-3xl text-graphite-muted lg:border-b-0 lg:border-r">
                  0{module.number}
                </div>
                <div className="p-5 sm:p-6">
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-system">Неделя {module.number}</span>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">{module.title}</h3>
                  <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-graphite-muted">{module.dek}</p>
                </div>
                <div className="border-t border-hairline p-5 sm:p-6 lg:border-l lg:border-t-0">
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-graphite-muted">Рабочий артефакт</span>
                  <p className="mt-2 text-sm font-medium">{module.artifactName}</p>
                  <p className="mt-3 text-xs leading-relaxed text-graphite-muted">{module.result}</p>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-hairline p-5 lg:flex-col lg:items-stretch lg:justify-center lg:border-l lg:border-t-0">
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-wide text-graphite-muted">Экранное время</span>
                    <p className="mt-1 text-sm font-medium">{formatMinutes(module.guidedMinutes)}</p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-ink-foreground transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
              {index < PROGRAM_MODULES.length - 1 && (
                <div className="ml-[54px] h-4 w-px bg-hairline lg:ml-[54px]" aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-hairline bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-6 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-20">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">Content budget</span>
            <h2 className="mt-4 max-w-[14ch] text-4xl font-semibold leading-tight tracking-tight">Сколько контента предстоит довести</h2>
            <p className="mt-5 max-w-[52ch] text-sm leading-relaxed text-ink-muted">
              Сейчас это сильный сценарный прототип для проверки структуры и времени. Для публикации каждый кейс потребует технической верификации, редакторской вычитки и примеров из нескольких инженерных дисциплин.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-hairline-ink sm:grid-cols-3">
            <BudgetMetric value={String(PROGRAM_TOTALS.screens)} label="учебных экранов" />
            <BudgetMetric value="5" label="инженерных кейсов" />
            <BudgetMetric value="5" label="лабораторий" />
            <BudgetMetric value="5" label="рабочих артефактов" />
            <BudgetMetric value="45–65k" label="знаков финального текста" />
            <BudgetMetric value="50–80 ч" label="авторской работы" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-12 lg:px-10 lg:py-16">
        <div className="rounded-2xl border border-system/25 bg-system/[0.05] p-6 sm:p-8">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-system">Как оценивать прототип</span>
          <div className="mt-5 grid gap-6 md:grid-cols-3">
            <Evaluation number="01" title="Засечь реальное время" body="Проходить без спешки и записывать начало/конец теории, лаборатории и самостоятельной доработки." />
            <Evaluation number="02" title="Пометить места трения" body="Где не хватает примера, формулировка двусмысленна или задание требует знаний, которых ещё не дали." />
            <Evaluation number="03" title="Проверить перенос" body="Через неделю открыть артефакт и понять, помог ли он в настоящей инженерной задаче." />
          </div>
        </div>
      </section>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="bg-ink p-4"><span className="font-mono text-[9px] uppercase tracking-wide text-ink-muted">{label}</span><p className="mt-1 text-lg font-medium">{value}</p></div>;
}

function BudgetMetric({ value, label }: { value: string; label: string }) {
  return <div className="bg-ink p-5 sm:p-6"><p className="text-2xl font-semibold text-signal">{value}</p><p className="mt-2 text-xs text-ink-muted">{label}</p></div>;
}

function Evaluation({ number, title, body }: { number: string; title: string; body: string }) {
  return <div><span className="font-mono text-[10px] text-system">{number}</span><h3 className="mt-2 font-medium">{title}</h3><p className="mt-2 text-sm leading-relaxed text-graphite-muted">{body}</p></div>;
}
