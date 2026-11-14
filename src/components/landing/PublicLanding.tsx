import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { HeroSky } from "./HeroSky";
import { ApplyForm } from "@/components/ApplyForm";
import { Reveal } from "@/components/motion/Reveal";
import { CONTRACT_FIELDS, DEMO_COURSE_META } from "@/content/demo-course";
import { signIn } from "@/auth";

const PRINCIPLES = [
  {
    title: "Ставишь задачу как инженеру, а не бросаешь реплику в чат",
    detail: "Цель, контракт, ограничения и критерии готовности есть до старта. Не после первой неудачной попытки.",
  },
  {
    title: "Проверяешь результат по существу, а не по «выглядит готовым»",
    detail: "Тесты, ревью, сверка с контрактом. «Агент сказал, что всё работает» — это ещё не проверка.",
  },
  {
    title: "Записываешь не только решение, но и то, от чего отказался",
    detail: "Через месяц кто-нибудь спросит, почему не сделали иначе. Ответ должен быть записан, а не храниться у тебя в голове.",
  },
  {
    title: "Знаешь, где агенту нужно подтверждение, а где нет",
    detail: "Запретить всё на всякий случай — плохо. Разрешить всё ради скорости — тоже плохо. Границу ставишь под конкретную задачу.",
  },
];

const WEEKS = [
  {
    title: "Agentic mindset",
    detail: "Чем агент отличается от чата, где он врёт и почему.",
    outcome: "Видишь, какую задачу отдать чату, а какую агенту, и знаешь, где агент может соврать.",
    assignment: "Взять свой рабочий кейс и решить: чат или агент. И объяснить почему.",
  },
  {
    title: "Context engineering, skills и sub-agents",
    detail: "Как собрать контекст под задачу и когда дробить работу на под-агентов.",
    outcome: "Собираешь ровно тот контекст, который нужен, и сам решаешь, нужен ли под-агент.",
    assignment: "Написать первый skill под задачу, которая у тебя постоянно повторяется.",
  },
  {
    title: "MCP и плагины",
    detail: "Подключаем внешние системы и ищем, где заканчивается зона ответственности агента.",
    outcome: "Подключаешь агенту внешний источник данных и даёшь ему минимум прав.",
    assignment: "Настроить MCP-интеграцию с одной настоящей системой из своей работы.",
  },
  {
    title: "Guardrails и безопасность",
    detail: "Permission rails, review-гейты и всё, что агенту по умолчанию доверять нельзя.",
    outcome: "Знаешь, где агенту нужно подтверждение человека, а где он справится сам.",
    assignment: "Описать guardrails для агентного workflow, которым пользуешься сейчас.",
  },
  {
    title: "Мультиагентные системы",
    detail: "Иногда несколько агентов дают выигрыш, иногда — сложность ради сложности.",
    outcome: "Можешь объяснить, почему здесь нужен один агент, а не несколько. Или наоборот.",
    assignment: "Нарисовать мультиагентную схему для своей задачи. Реализовывать не обязательно.",
  },
];

const LIVE_CALLS = ["Кикофф", "Середина", "Финал"];

const HOW_IT_WORKS = [
  { title: "Материалы по неделям", detail: "Уроки записаны заранее, смотришь, когда удобно." },
  { title: "Практика на твоих задачах", detail: "Задачи из настоящей работы инженера, без учебных игрушек." },
  { title: "Обсуждения с потоком", detail: "Обсуждаем то, что проходим на этой неделе. Отдельного форума нет." },
  { title: "Три живых созвона", detail: "Кикофф, середина и финал. Разбираем вживую, лекций не читаем." },
  { title: "Обратная связь от автора", detail: "«Принято» или «на доработку» — и всегда с комментарием по делу." },
];

const FAQ = [
  {
    q: "Кому подходит курс?",
    a: "Разработчикам, которые уже пишут код и хотят работать с AI-агентами по-взрослому. Программированию с нуля здесь не учат.",
  },
  {
    q: "Какой опыт нужен?",
    a: "Если пользовался чатом или автодополнением — хорошо, но это не обязательно. Важнее, что ты уже инженер.",
  },
  {
    q: "Какие инструменты понадобятся?",
    a: "Свой доступ к агенту вроде Claude Code или Cursor, на твоём аккаунте. В пилот он не входит.",
  },
  {
    q: "Сколько времени в неделю?",
    a: "Точную нагрузку ещё считаем. Пока закладывай несколько часов в неделю на материалы и практику.",
  },
  {
    q: "Это точно бесплатно?",
    a: "Да, пилотный поток бесплатный. Платные потоки появятся позже, отдельно от него.",
  },
  {
    q: "Как проходит отбор?",
    a: "Через заявку ниже. Автор читает каждую сам, мест в пилоте пять.",
  },
];

/** The demo module calls field 05 «Права»; on the landing card it also names what the field guards. */
const CONTRACT_LABELS: Partial<Record<(typeof CONTRACT_FIELDS)[number]["key"], string>> = {
  permissions: "Права и review gates",
};

const CONTAINER = "mx-auto max-w-[1280px] px-5 sm:px-8";
const H2 = "text-[clamp(36px,4.4vw,60px)] font-extrabold leading-none tracking-[-0.035em]";
const EYEBROW = "font-mono text-sm uppercase tracking-[0.1em]";
const NUM = "font-mono text-[15px] text-string";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

function Arrow() {
  return (
    <span aria-hidden="true" className="kg-arrow">
      →
    </span>
  );
}

/** The kite alone, as a quiet graphic inside the course cards. */
function CardKite({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 120 180" aria-hidden="true" className={`kg-card-kite pointer-events-none absolute ${className}`}>
      <path d="M60 5 Q66 69 110 75 Q66 81 60 175 Q54 81 10 75 Q54 69 60 5 Z" fill="currentColor" />
    </svg>
  );
}

function Pill({ children, className }: { children: ReactNode; className: string }) {
  return <span className={`rounded-full px-3 py-1.5 text-[13px] font-semibold ${className}`}>{children}</span>;
}

export function PublicLanding() {
  return (
    <div className="flex flex-1 flex-col bg-paper text-[17px] leading-normal text-graphite">
      <Header />

      <main id="main-content">
        {/* 1 — Hero */}
        <section className={`${CONTAINER} grid items-center gap-14 pb-20 pt-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.85fr)] lg:pb-[88px] lg:pt-[72px]`}>
          <div className="flex flex-col gap-7">
            <span className={`kg-rise ${EYEBROW} text-graphite-muted`} style={step(0)}>
              Школа работы с ИИ
            </span>
            <h1 lang="en" className="text-[clamp(44px,6.4vw,92px)] font-extrabold leading-[0.95] tracking-[-0.045em]">
              <span className="kg-line" style={step(0)}>
                <span>Let it fly.</span>
              </span>
              <span className="kg-line" style={step(1)}>
                <span>Keep your grip.</span>
              </span>
            </h1>
            <p className="kg-rise text-[clamp(22px,2.4vw,30px)] font-semibold leading-tight tracking-[-0.01em]" style={step(3)}>
              ИИ летит быстро. Хватка — <span className="text-string">твоя</span>.
            </p>
            <p className="kg-rise max-w-[34em] text-[19px] leading-[1.6] text-graphite-soft" style={step(4)}>
              Учим работать с ИИ-агентами так, чтобы результат оставался твоим: задача поставлена как инженеру,
              результат проверен по существу, у агента есть границы, которые он не переходит.
            </p>
            <div className="kg-rise flex flex-wrap gap-3.5" style={step(5)}>
              <Link
                href="#apply"
                className="kg-btn inline-flex min-h-14 items-center gap-2 rounded-full bg-signal px-[30px] font-semibold text-signal-ink hover:bg-sky-deep"
              >
                Подать заявку на пилот <Arrow />
              </Link>
              <Link
                href="#contract"
                className="kg-btn inline-flex min-h-14 items-center rounded-full border-[1.5px] border-graphite px-[29px] font-semibold hover:bg-ink hover:text-ink-foreground"
              >
                Пройти демо-модуль
              </Link>
            </div>
            <p className="kg-rise font-mono text-sm text-graphite-muted" style={step(6)}>
              Бесплатный закрытый пилот · 5 мест · 5–7 недель · старт в декабре 2026
            </p>
          </div>

          <HeroSky />
        </section>

        {/* 2 — Principles */}
        <section className="border-t border-hairline">
          <div className={`${CONTAINER} flex flex-col gap-12 py-24`}>
            <Reveal className="flex flex-wrap items-end justify-between gap-6">
              <h2 className={`${H2} max-w-[13em]`}>Что значит не терять хватку</h2>
              <p className="max-w-[30em] text-graphite-soft">
                Список инструментов устареет за полгода, так что дело не в нём. Дело в том, как ты принимаешь
                решения, когда часть работы за тебя делает агент.
              </p>
            </Reveal>

            <Reveal mode="children" className="relative grid lg:grid-cols-2 lg:gap-x-12">
              <span aria-hidden="true" className="kg-rule absolute inset-x-0 top-0 h-[1.5px] bg-graphite" />
              {PRINCIPLES.map((item, i) => (
                <article
                  key={item.title}
                  className="kg-item grid grid-cols-[44px_1fr] gap-x-4 border-b border-hairline pb-9 pt-8 sm:grid-cols-[72px_1fr] sm:gap-x-5"
                  style={step(i + 1)}
                >
                  <span className={NUM}>0{i + 1}</span>
                  <div className="flex flex-col gap-2.5">
                    <h3 className="text-[23px] font-bold leading-tight tracking-[-0.015em]">{item.title}</h3>
                    <p className="text-graphite-soft">{item.detail}</p>
                  </div>
                </article>
              ))}
            </Reveal>
          </div>
        </section>

        {/* 3 — Courses */}
        <section id="courses" className={`kg-anchor ${CONTAINER} flex flex-col gap-10 pb-[104px] pt-6`}>
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <h2 className={H2}>Три курса — одна хватка</h2>
            <span className="font-mono text-sm text-graphite-muted">для инженеров · дизайнеров · новичков</span>
          </Reveal>

          <Reveal mode="children" className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <div className="kg-item" style={step(0)}>
              <article className="kg-card relative flex h-full min-h-[380px] flex-col gap-4 overflow-hidden rounded-[28px] bg-signal p-8 text-white">
                <CardKite className="-bottom-10 -right-4 w-40 text-white/15" />
                <div className="relative flex items-center justify-between gap-3">
                  <span className="font-mono text-[13px] text-sky-soft">01 · ENGINEERS</span>
                  <Pill className="bg-white text-sky-deep">Пилот · декабрь 2026</Pill>
                </div>
                <h3 className="relative text-[34px] font-extrabold leading-[1.02] tracking-[-0.03em]">
                  KiteGrip
                  <br />
                  for Engineers
                </h3>
                <p className="relative text-base leading-[1.55] text-[#e8eeff]">
                  Агентная инженерия для тех, кто уже пишет код: контракт задачи, контекст, MCP, guardrails и
                  мультиагентные системы.
                </p>
                <p className="relative mt-auto font-mono text-[13px] text-sky-soft">5 модулей · 5–7 недель · 5 мест</p>
                <Link
                  href="#apply"
                  className="kg-btn relative inline-flex min-h-11 items-center gap-2 self-start rounded-full bg-white px-5 font-semibold text-ink hover:bg-ink hover:text-ink-foreground"
                >
                  Подать заявку <Arrow />
                </Link>
              </article>
            </div>

            <div className="kg-item" style={step(1)}>
              <article className="kg-card relative flex h-full min-h-[380px] flex-col gap-4 overflow-hidden rounded-[28px] border border-hairline bg-white p-8">
                <CardKite className="-bottom-10 -right-4 w-40 text-sky-tint" />
                <div className="relative flex items-center justify-between gap-3">
                  <span className="font-mono text-[13px] text-graphite-muted">02 · DESIGNERS</span>
                  <Pill className="bg-paper-deep text-ink">Скоро</Pill>
                </div>
                <h3 className="relative text-[34px] font-extrabold leading-[1.02] tracking-[-0.03em]">
                  KiteGrip
                  <br />
                  for Designers
                </h3>
                <p className="relative text-base leading-[1.55] text-graphite-soft">
                  ИИ в дизайн-процессе, который ускоряет работу и не стирает твой почерк. [ПРОГРАММА]
                </p>
                <p className="relative mt-auto font-mono text-[13px] text-graphite-muted">[ФОРМАТ] · [ДЛИТЕЛЬНОСТЬ]</p>
                <Link
                  href="#apply"
                  className="kg-btn relative inline-flex min-h-11 items-center self-start rounded-full border-[1.5px] border-graphite px-[19px] font-semibold hover:bg-ink hover:text-ink-foreground"
                >
                  Узнать о старте
                </Link>
              </article>
            </div>

            <div className="kg-item md:col-span-2 xl:col-span-1" style={step(2)}>
              <article className="kg-card relative flex h-full min-h-[380px] flex-col gap-4 overflow-hidden rounded-[28px] bg-ink p-8 text-ink-foreground">
                <CardKite className="-bottom-10 -right-4 w-40 text-white/10" />
                <div className="relative flex items-center justify-between gap-3">
                  <span className="font-mono text-[13px] text-ink-muted">03 · START</span>
                  <Pill className="bg-string text-white">Открыты модули 1–2</Pill>
                </div>
                <h3 lang="en" className="relative text-[34px] font-extrabold leading-[1.02] tracking-[-0.03em]">
                  First Flight
                </h3>
                <p className="relative text-base leading-[1.55] text-[#d5d9e3]">
                  Первый полёт: ИИ с нуля, без кода и без страха всё сломать. Как устроены модели, как ставить задачу, проверять ответ и выбирать инструменты.
                </p>
                <p className="relative mt-auto font-mono text-[13px] text-ink-muted">5 модулей · теория со схемами · без кода</p>
                <Link
                  href="/first-flight"
                  className="kg-btn relative inline-flex min-h-11 items-center gap-2 self-start rounded-full border-[1.5px] border-ink-foreground px-[19px] font-semibold hover:bg-paper hover:text-ink"
                >
                  Начать с модуля 1 <Arrow />
                </Link>
              </article>
            </div>
          </Reveal>
        </section>

        {/* 4 — Pilot program */}
        <section id="program" className="kg-anchor border-y border-hairline bg-white">
          <div className={`${CONTAINER} flex flex-col gap-10 py-24`}>
            <Reveal className="flex flex-wrap items-end justify-between gap-6">
              <div className="flex flex-col gap-3.5">
                <span className={`${EYEBROW} text-graphite-muted`}>KiteGrip for Engineers · программа пилота</span>
                <h2 className={`${H2} max-w-[14em]`}>Пять недель от первой задачи до нескольких агентов</h2>
              </div>
              <ul className="flex flex-wrap gap-2" aria-label="Живые созвоны">
                {LIVE_CALLS.map((call) => (
                  <li key={call} className="rounded-full border border-hairline px-3.5 py-1.5 text-sm">
                    {call} · живой созвон
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal as="ol" mode="children" className="relative flex flex-col">
              <span aria-hidden="true" className="kg-rule absolute inset-x-0 top-0 h-[1.5px] bg-graphite" />
              {WEEKS.map((week, i) => (
                <li
                  key={week.title}
                  className="kg-item kg-row grid gap-x-9 gap-y-4 border-b border-hairline py-7 md:grid-cols-3"
                  style={step(i + 1)}
                >
                  <div className="kg-row-title flex gap-[18px]">
                    <span className={NUM}>0{i + 1}</span>
                    <div>
                      <h3 className="text-[22px] font-bold leading-tight tracking-[-0.015em]">{week.title}</h3>
                      <p className="mt-1.5 text-[15px] text-graphite-soft">{week.detail}</p>
                    </div>
                  </div>
                  <div className="pl-[39px] md:pl-0">
                    <span className="font-mono text-xs uppercase tracking-[0.08em] text-graphite-muted">Результат</span>
                    <p className="mt-1.5 text-[15px]">{week.outcome}</p>
                  </div>
                  <div className="pl-[39px] md:pl-0">
                    <span className="font-mono text-xs uppercase tracking-[0.08em] text-graphite-muted">Практика</span>
                    <p className="mt-1.5 text-[15px]">{week.assignment}</p>
                  </div>
                </li>
              ))}
            </Reveal>
          </div>
        </section>

        {/* 5 — Contract band and the demo module */}
        <section id="contract" className="kg-anchor bg-ink text-ink-foreground">
          <div className={`${CONTAINER} grid items-center gap-14 py-[104px] lg:grid-cols-2`}>
            <Reveal className="flex flex-col gap-6">
              <span className={`${EYEBROW} text-sky-on-ink`}>Демо-модуль · бесплатно · без регистрации</span>
              <h2 className="text-[clamp(40px,5vw,68px)] font-extrabold leading-[0.98] tracking-[-0.04em]">
                Сначала контракт.
                <br />
                Потом — агент.
              </h2>
              <p className="max-w-[30em] text-[19px] leading-[1.6] text-ink-muted">
                Агент ускоряет всё, в том числе неверно понятую задачу. За {DEMO_COURSE_META.duration} соберёшь
                свой Agent Task Contract и заберёшь его в работу в Markdown.
              </p>
              <Link
                href="/demo-course"
                className="kg-btn inline-flex min-h-14 items-center gap-2 self-start rounded-full bg-paper px-[30px] font-semibold text-ink hover:bg-signal hover:text-signal-ink"
              >
                Начать демо-модуль <Arrow />
              </Link>
            </Reveal>

            <Reveal
              mode="children"
              className="relative rounded-[28px] border border-ink-line bg-ink-raised py-8 pl-16 pr-8 font-mono"
            >
              <svg
                viewBox="0 0 40 400"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="absolute bottom-7 left-4 top-7 h-[calc(100%-56px)] w-10"
              >
                <path
                  className="kg-thread"
                  pathLength={1}
                  d="M20 0 C 6 60, 34 120, 20 200 C 8 270, 32 330, 20 400"
                  fill="none"
                  stroke="var(--string)"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <div className="kg-item mb-5 text-[13px] text-sky-on-ink" style={step(0)}>
                agent-task-contract.md
              </div>
              <ol className="flex flex-col gap-3.5 text-base">
                {CONTRACT_FIELDS.map((field, i) => {
                  const last = i === CONTRACT_FIELDS.length - 1;
                  return (
                    <li key={field.key} className="kg-item flex gap-4" style={step(i + 2)}>
                      <span aria-hidden="true" className="text-[#8a93a8]">
                        {field.number}
                      </span>
                      <span className={last ? "text-string" : undefined}>
                        {CONTRACT_LABELS[field.key] ?? field.title}
                        {last && (
                          <span aria-hidden="true" className="kg-caret">
                            _
                          </span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ol>
              <p
                className="kg-item mt-6 border-t border-ink-line pt-[18px] text-[13px] leading-[1.6] text-ink-muted"
                style={step(CONTRACT_FIELDS.length + 3)}
              >
                «Весь репозиторий, если понадобится». Понадобится. Всегда.
              </p>
            </Reveal>
          </div>
        </section>

        {/* 6 — Practice and feedback */}
        <section id="practice" className={`kg-anchor ${CONTAINER} flex flex-col gap-12 py-[104px]`}>
          <Reveal>
            <h2 className={`${H2} max-w-[12em]`}>Как устроены практика и обратная связь</h2>
          </Reveal>
          <Reveal as="ol" mode="children" className="grid gap-x-7 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
            {HOW_IT_WORKS.map((item, i) => {
              const last = i === HOW_IT_WORKS.length - 1;
              return (
                <li key={item.title} className="flex flex-col gap-[18px]">
                  <span
                    aria-hidden="true"
                    className={`kg-rule h-[1.5px] ${last ? "bg-string" : "bg-graphite"}`}
                    style={step(i * 2)}
                  />
                  <div className="kg-item flex flex-col gap-2.5" style={step(i * 2 + 1)}>
                    <span className={`font-mono text-sm ${last ? "text-string" : "text-graphite-muted"}`}>0{i + 1}</span>
                    <h3 className="text-xl font-bold leading-snug">{item.title}</h3>
                    <p className="text-[15px] text-graphite-soft">{item.detail}</p>
                  </div>
                </li>
              );
            })}
          </Reveal>
        </section>

        {/* 7 — FAQ */}
        <section id="faq" className="kg-anchor border-t border-hairline">
          <div className={`${CONTAINER} flex flex-col gap-10 py-24`}>
            <Reveal>
              <h2 className={H2}>Частые вопросы</h2>
            </Reveal>
            <Reveal mode="children" className="grid gap-x-12 md:grid-cols-2">
              {FAQ.map((item, i) => (
                <div key={item.q} className="kg-item border-t border-hairline-strong py-[22px]" style={step(i)}>
                  <h3 className="text-lg font-bold">{item.q}</h3>
                  <p className="mt-2 text-[15px] text-graphite-soft">{item.a}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* 8 — Apply and sign-in */}
        <section id="apply" className="kg-anchor relative overflow-hidden bg-signal text-white">
          <svg
            viewBox="0 0 400 640"
            aria-hidden="true"
            className="kg-drift pointer-events-none absolute -right-10 top-6 h-[560px] w-[440px] opacity-[0.16]"
          >
            <path d="M200 40 Q206 104 250 110 Q206 116 200 210 Q194 116 150 110 Q194 104 200 40 Z" fill="#ffffff" />
            <path
              d="M200 210 C 110 320, 300 400, 200 480 C 130 536, 220 570, 200 596"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
            />
          </svg>

          <div className={`${CONTAINER} relative grid items-start gap-14 py-[104px] lg:grid-cols-2`}>
            <Reveal className="flex flex-col gap-6">
              <span className={`${EYEBROW} text-sky-soft`}>Заявка на пилот</span>
              <h2 className="text-[clamp(40px,5vw,68px)] font-extrabold leading-[0.98] tracking-[-0.04em]">
                Возьмись за нить.
              </h2>
              <p className="max-w-[26em] text-[19px] leading-[1.6] text-[#e8eeff]">
                Пять мест. Каждую заявку читаем вручную, автоматически никого не зачисляем. Если тебя выберут,
                доступ придёт на указанный email.
              </p>
              <ul className="flex flex-col gap-2 font-mono text-sm text-sky-soft">
                <li>— бесплатно</li>
                <li>— 5–7 недель, старт в декабре 2026</li>
                <li>— подписки на AI-инструменты оплачиваешь сам</li>
              </ul>

              <div id="signin" className="kg-anchor mt-6 flex flex-col gap-3 border-t border-white/30 pt-7">
                <p className="max-w-[30em] text-[15px] text-[#e8eeff]">
                  Уже в пилоте? Введи email — пришлём ссылку для входа. Войти может кто угодно, но материалы
                  когорты видят только те, кого зачислили вручную.
                </p>
                <form
                  action={async (formData) => {
                    "use server";
                    await signIn("resend", { email: formData.get("email") });
                  }}
                  className="flex max-w-md flex-wrap gap-2"
                >
                  <label className="sr-only" htmlFor="signin-email">
                    Email для входа
                  </label>
                  <input
                    id="signin-email"
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="min-h-12 min-w-0 flex-1 rounded-full border-[1.5px] border-white/60 bg-transparent px-5 text-base text-white placeholder:text-sky-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  />
                  <button
                    type="submit"
                    className="kg-btn inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 font-semibold text-ink hover:bg-ink hover:text-ink-foreground focus-visible:outline-white"
                  >
                    Войти <Arrow />
                  </button>
                </form>
              </div>
            </Reveal>

            <Reveal delay={120} className="rounded-[28px] bg-paper p-6 text-graphite sm:p-8">
              <ApplyForm />
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
