import Link from "next/link";
import {
  PROGRAM_MODULES,
  PROGRAM_TOTALS,
  formatHours,
  formatMinutes,
} from "@/content/demo-course-program";
import { HOMEWORK_ASSIGNMENTS, formatHomeworkTime } from "@/content/demo-course-homework";
import { isPublicDemoModule } from "@/content/demo-access";

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
                Field course / ИИ без цирка
              </span>
              <h1 className="mt-5 max-w-[15ch] text-[2.8rem] font-semibold leading-[0.98] tracking-tight sm:text-[4.4rem] lg:text-[5.3rem]">
                Инженерная работа с ИИ
              </h1>
              <p className="mt-7 max-w-[62ch] text-lg leading-relaxed text-graphite-muted">
                Не курс про кнопки и «секретные промпты». За пять модулей ты соберёшь рабочую систему: ставить задачи агентам, управлять контекстом, безопасно подключать инструменты и не разводить мультиагентный зоопарк без причины.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="/demo-course/1" className="rounded-xl bg-ink px-5 py-3 text-sm font-medium text-ink-foreground transition-transform hover:scale-[1.02]">
                  Начать с первого модуля →
                </Link>
                <span className="text-xs text-graphite-muted">Модули 1–2 без регистрации · первый результат за 45–60 минут</span>
              </div>
            </div>

            <div className="rounded-2xl bg-ink p-6 text-ink-foreground sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">Нагрузка участника</span>
                <span className="rounded-full border border-hairline-ink px-2.5 py-1 font-mono text-[9px] uppercase text-ink-muted">пилот</span>
              </div>
              <p className="mt-5 text-4xl font-semibold tracking-tight">{formatHours(TOTAL_MIN, TOTAL_MAX)}</p>
              <p className="mt-2 text-sm text-ink-muted">за 5 недель · примерно {formatHours(Math.round(TOTAL_MIN / 5), Math.round(TOTAL_MAX / 5))} в неделю</p>
              <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-hairline-ink">
                <Metric label="В интерфейсе" value={formatHours(PROGRAM_TOTALS.guidedMin, PROGRAM_TOTALS.guidedMax)} />
                <Metric label="Своя практика" value={formatHours(PROGRAM_TOTALS.practiceMin, PROGRAM_TOTALS.practiceMax)} />
              </div>
              <p className="mt-5 text-[11px] leading-relaxed text-ink-muted/75">
                Не марафон фоновых видео. Время уходит на решения, практику и артефакты, которые можно забрать в работу.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-12 lg:px-10 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-system">Кому подойдёт</span>
            <h2 className="mt-3 max-w-[14ch] text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Не учим программировать. Учим работать с ИИ по-инженерному.
            </h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline md:grid-cols-3">
            <Audience title="Только начинаешь" body="Получишь понятную модель: когда достаточно чата, когда нужен агент и какие границы поставить до первого запуска." />
            <Audience title="Уже используешь каждый день" body="Превратишь личные приёмы в повторяемые Skills, контракты и проверки, которые выдерживают настоящую задачу." />
            <Audience title="Строишь для команды" body="Сможешь обсуждать MCP, guardrails и мультиагентность как архитектуру — с правами, рисками и владельцами решений." />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-10 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-graphite-muted">Curriculum / 05 modules</span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Пять недель. Ноль магии.</h2>
          </div>
          <p className="max-w-[48ch] text-sm leading-relaxed text-graphite-muted">
            Каждый модуль меняет один участок твоей работы и заканчивается артефактом. Не «посмотрел урок» — а унёс готовый инструмент.
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
                  {!isPublicDemoModule(module.number) && (
                    <span className="ml-2 rounded-full bg-[#e7e9e2] px-2 py-0.5 font-mono text-[8px] uppercase text-graphite-muted">для участников пилота</span>
                  )}
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

      <section className="border-y border-hairline bg-[#eef0ea]">
        <div className="mx-auto max-w-[1280px] px-6 py-14 lg:px-10 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-system">Homework / 05 field assignments</span>
              <h2 className="mt-3 max-w-[18ch] text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Пять домашних работ. Один инженерный портфель.</h2>
            </div>
            <p className="max-w-[52ch] text-sm leading-relaxed text-graphite-muted">Каждая работа продолжает модуль на живом сценарии: от безопасного bugfix до MCP-сервера, policy engine и честного сравнения одного агента с командой.</p>
          </div>

          <div className="mt-9 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {HOMEWORK_ASSIGNMENTS.map((assignment, index) => (
              <a key={assignment.moduleNumber} href={isPublicDemoModule(assignment.moduleNumber) ? `/demo-course/${assignment.moduleNumber}#homework` : `/demo-course/${assignment.moduleNumber}`} className={`group flex min-h-[210px] flex-col rounded-2xl border border-hairline bg-white/65 p-5 transition-all hover:-translate-y-0.5 hover:border-system/45 hover:bg-white ${index === HOMEWORK_ASSIGNMENTS.length - 1 ? "md:col-span-2 xl:col-span-1" : ""}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs text-system">0{assignment.moduleNumber}</span>
                  <span className="rounded-full bg-[#e7e9e2] px-2 py-1 font-mono text-[8px] uppercase text-graphite-muted">{formatHomeworkTime(assignment.estimatedMinutes)}</span>
                </div>
                <h3 className="mt-5 text-lg font-medium leading-snug">{assignment.shortTitle}</h3>
                <p className="mt-3 text-xs leading-relaxed text-graphite-muted">{assignment.outcome}</p>
                <span className="mt-auto pt-5 text-sm transition-transform group-hover:translate-x-1">{isPublicDemoModule(assignment.moduleNumber) ? "Открыть ТЗ →" : "Для участников пилота →"}</span>
              </a>
            ))}
          </div>

          <p className="mt-6 text-xs leading-relaxed text-graphite-muted">Оценка каждой работы — 20 баллов. Проходной результат — 14. Считаются доказательства и инженерное решение, а не длина ответа модели.</p>
        </div>
      </section>

      <section className="border-y border-hairline bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-6 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-20">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">После курса</span>
            <h2 className="mt-4 max-w-[15ch] text-4xl font-semibold leading-tight tracking-tight">Не сертификат. Пять рабочих инструментов.</h2>
            <p className="mt-5 max-w-[52ch] text-sm leading-relaxed text-ink-muted">
              Сертификат не остановит агента перед опасной командой. А хороший контракт, матрица прав и проверяемый handoff — вполне. Всё, что соберёшь, останется у тебя в Markdown и в голове.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-hairline-ink sm:grid-cols-3">
            <BudgetMetric value="01" label="Agent Task Contract" />
            <BudgetMetric value="02" label="Context Pack + Skill Spec" />
            <BudgetMetric value="03" label="MCP Integration Card" />
            <BudgetMetric value="04" label="Agent Safety Policy" />
            <BudgetMetric value="05" label="Multi-agent System Map" />
            <BudgetMetric value="∞" label="меньше веры — больше контроля" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-12 lg:px-10 lg:py-16">
        <div className="rounded-2xl border border-system/25 bg-system/[0.05] p-6 sm:p-8">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-system">Подход VabeOps</span>
          <div className="mt-5 grid gap-6 md:grid-cols-3">
            <Evaluation number="01" title="Сначала решение" body="ИИ должен двигать рабочую задачу, а не производить убедительный текст ради текста." />
            <Evaluation number="02" title="Потом свобода" body="Автономность выдаётся по мере доказанной надёжности. Не наоборот. Прод — плохое место для воспитательных экспериментов." />
            <Evaluation number="03" title="Результат — в систему" body="Если подход нельзя повторить, проверить и передать коллеге, это удача, а не инженерия." />
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-system/20 pt-6">
            <Link href="/demo-course/1" className="rounded-xl bg-signal px-5 py-3 text-sm font-medium text-signal-ink">Собрать первый контракт →</Link>
            <span className="text-xs text-graphite-muted">Можно остановиться после первого модуля. Но обычно уже не хочется.</span>
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

function Audience({ title, body }: { title: string; body: string }) {
  return <article className="bg-white/65 p-5 sm:p-6"><h3 className="font-medium">{title}</h3><p className="mt-3 text-sm leading-relaxed text-graphite-muted">{body}</p></article>;
}
