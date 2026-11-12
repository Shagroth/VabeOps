import { DecisionTraceVisual } from "./DecisionTraceVisual";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ProgramAccordion } from "./ProgramAccordion";
import { ApplyForm } from "@/components/ApplyForm";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CourseCard } from "@/components/cards/CourseCard";
import { EventCard } from "@/components/cards/EventCard";
import { JournalCard } from "@/components/cards/JournalCard";
import { CharacterAvatar } from "@/components/comics/CharacterAvatar";
import { MINI_COURSES } from "@/content/courses";
import { EVENTS } from "@/content/events";
import { getFeaturedJournal } from "@/content/journal";
import { getPublishedSignals } from "@/content/signals";
import { COMIC_SERIES, EPISODE_1, CHARACTERS } from "@/content/comics";
import { AUTHORS } from "@/content/authors";
import { DEMO_COURSE_META } from "@/content/demo-course";
import { signIn } from "@/auth";
import Link from "next/link";

const WEEKS = [
  {
    n: 1,
    title: "Agentic mindset",
    detail: "Чат vs агент, где агент врёт и почему, гибкость мышления как рамка на весь курс.",
    outcome: "Отличаешь задачу для чата от задачи для агента и понимаешь, где агент может соврать.",
    assignment: "Разобрать свой реальный рабочий кейс: чат или агент, и почему.",
  },
  {
    n: 2,
    title: "Context engineering, skills и sub-agents",
    detail: "Как собрать контекст под задачу и когда декомпозиция на под-агентов оправдана.",
    outcome: "Умеешь собрать минимальный достаточный контекст и решить, нужен ли под-агент.",
    assignment: "Написать свой первый skill под конкретную повторяющуюся задачу.",
  },
  {
    n: 3,
    title: "MCP и плагины",
    detail: "Подключение внешних систем агенту — и где проходит граница его ответственности.",
    outcome: "Можешь подключить агенту внешний источник данных с минимальными правами.",
    assignment: "Настроить MCP-интеграцию для одной реальной системы из своей работы.",
  },
  {
    n: 4,
    title: "Guardrails и безопасность",
    detail: "Permission rails, review-гейты, что агенту нельзя доверять по умолчанию.",
    outcome: "Знаешь, какие действия агента требуют подтверждения человеком, а какие — нет.",
    assignment: "Описать guardrails для своего текущего агентного workflow.",
  },
  {
    n: 5,
    title: "Мультиагентные системы",
    detail: "Когда несколько агентов — это мощь, а когда — сложность ради сложности.",
    outcome: "Можешь обосновать архитектурное решение: один агент или несколько.",
    assignment: "Спроектировать (не обязательно реализовать) мультиагентную схему для своей задачи.",
  },
];

const STAYING_CURRENT = [
  {
    title: "Формулируешь задачу как для инженера, не как реплику в чат",
    detail: "Цель, контракт, ограничения и критерии готовности — до того, как агент начал, а не после первой неудачной попытки.",
  },
  {
    title: "Проверяешь результат по существу, а не по «выглядит готовым»",
    detail: "Тесты, ревью, сверка контракта — «агент сказал, что всё работает» не считается проверкой.",
  },
  {
    title: "Фиксируешь отвергнутую альтернативу, а не только финальный выбор",
    detail: "Через месяц важно не только что сделали, но и что сознательно не стали делать — и почему.",
  },
  {
    title: "Знаешь, где агенту нужно подтверждение, а где нет",
    detail: "Не «ограничиваю всё на всякий случай» и не «доверяю всё, чтобы было быстрее» — а осознанная граница под конкретную задачу.",
  },
];

const HOW_IT_WORKS = [
  { title: "Материалы по неделям", detail: "Предзаписанные уроки — смотришь в своём темпе." },
  { title: "Практика на реальных задачах", detail: "Не учебные игрушки — рабочие сценарии инженера." },
  { title: "Обсуждения с потоком", detail: "Контекстные, привязанные к неделе — не отдельный форум." },
  { title: "Три живых созвона", detail: "Кикофф, мидпоинт, финал — разбор вживую, не лекции." },
  { title: "Обратная связь от автора", detail: "Принято / на доработку, с конкретным комментарием." },
];

const FAQ = [
  {
    q: "Кому подходит курс?",
    a: "Разработчикам, которые уже пишут код и хотят профессионально работать с AI-агентами — это не курс программирования с нуля.",
  },
  {
    q: "Какой опыт нужен?",
    a: "Базовый опыт использования AI-инструментов (чат, автодополнение) приветствуется, но не обязателен — главное, что ты уже инженер.",
  },
  {
    q: "Какие инструменты понадобятся?",
    a: "Доступ к AI-агенту вроде Claude Code или Cursor — свой, на твой аккаунт. Это не входит в пилот.",
  },
  {
    q: "Сколько времени занимает в неделю?",
    a: "Точная нагрузка ещё уточняется — ориентируйся на несколько часов в неделю на материалы и практику.",
  },
  {
    q: "Это точно бесплатно?",
    a: "Да, этот пилотный поток бесплатный. Будущие платные потоки появятся позже — отдельно.",
  },
  {
    q: "Как проходит отбор?",
    a: "Через заявку ниже. Автор рассматривает заявки вручную, пилот рассчитан на 5 человек.",
  },
];

export function PublicLanding() {
  const homeCourses = MINI_COURSES.slice(0, 3);
  const homeEvents = EVENTS.slice(0, 3);
  const featured = getFeaturedJournal();
  const signals = getPublishedSignals().slice(0, 3);
  const author = AUTHORS[0];

  return (
    <div className="flex flex-1 flex-col bg-paper text-graphite">
      <Header />

      <main id="main-content">
        {/* 1 — Hero: promise + audience + primary/secondary CTA + live Decision Trace demo */}
        <section className="relative overflow-hidden bg-ink text-ink-foreground">
          <div className="signal-field" />
          <div className="relative mx-auto grid max-w-[1280px] gap-14 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-28">
            <div className="animate-hero-rise flex flex-col gap-7">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-system">
                VabeOps / Field Notes from Agentic Engineering
              </span>
              <h1 className="text-[2.75rem] font-semibold leading-[1.08] tracking-tight sm:text-[3.5rem] lg:text-[4.25rem]">
                Стань инженером, который не теряет форму.
              </h1>
              <p className="max-w-[46ch] text-lg text-ink-muted">
                Для backend, frontend, mobile, QA, data, platform, DevOps/SRE, security и
                тимлидов. Не курс программирования с нуля — курс о том, как осмысленно встраивать
                AI-агентов в реальную инженерную работу, не теряя контроль над качеством и рисками.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/demo-course"
                  className="rounded-lg bg-signal px-6 py-3 text-sm font-medium text-signal-ink transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]"
                >
                  Пройти бесплатный demo-курс
                </Link>
                <a
                  href="#program"
                  className="rounded-lg border border-hairline-ink px-6 py-3 text-sm font-medium text-ink-foreground transition-colors duration-200 hover:bg-white/5"
                >
                  Программа пилота
                </a>
              </div>
              <p className="text-sm text-ink-muted">
                Бесплатный закрытый пилот · 5 участников · 5–7 недель · старт — декабрь 2026,
                точная дата пока не публикуется
              </p>
            </div>

            <div
              className="animate-hero-rise flex justify-center lg:justify-end"
              style={{ animationDelay: "120ms" }}
            >
              <DecisionTraceVisual />
            </div>
          </div>
        </section>

        {/* 3 — What staying current actually means: concrete behaviors, not a tech list */}
        <ScrollReveal className="mx-auto w-full max-w-[1280px] px-6 py-20 lg:px-10">
          <h2 className="max-w-[30ch] text-[2.375rem] font-semibold tracking-tight text-graphite sm:text-[3rem]">
            Что значит оставаться актуальным инженером
          </h2>
          <p className="mt-4 max-w-[62ch] text-graphite-muted">
            Не список инструментов — он устареет за полгода. Это про то, как меняется сам процесс
            принятия инженерных решений, когда часть работы делает агент.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {STAYING_CURRENT.map((item) => (
              <div key={item.title} className="rounded-2xl border border-hairline bg-white/50 p-6">
                <h3 className="font-medium">{item.title}</h3>
                <p className="mt-2 text-sm text-graphite-muted">{item.detail}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* 4 — Flagship pilot program */}
        <ScrollReveal className="mx-auto w-full max-w-[1280px] px-6 py-20 lg:px-10">
          <div className="rounded-[28px] border border-hairline bg-white/40 p-7 lg:p-12">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-system">
                Пилот · бесплатно · 5 участников
              </span>
              <span className="rounded-full border border-hairline px-3 py-1 font-mono text-xs text-graphite-muted">
                5–7 недель — точные даты уточняются
              </span>
            </div>
            <h2 className="mt-4 max-w-[30ch] text-[2.375rem] font-semibold tracking-tight sm:text-[3rem]">
              VabeOps Cohort — полный разбор работы с агентами, не мини-курс
            </h2>

            <div id="program" className="mt-12">
              <ProgramAccordion weeks={WEEKS} />
              <div className="mt-10 flex flex-wrap gap-3">
                {["Кикофф", "Мидпоинт", "Финал"].map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-hairline bg-white/60 px-4 py-1.5 text-xs text-graphite-muted"
                  >
                    {label} · живой созвон когорты
                  </span>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* 5 — The real, fully walkable demo course */}
        <ScrollReveal className="w-full bg-ink py-20 text-ink-foreground">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
                  Бесплатно · без аккаунта · проходится сейчас
                </span>
                <h2 className="mt-3 max-w-[26ch] text-[2.375rem] font-semibold tracking-tight sm:text-[3rem]">
                  {DEMO_COURSE_META.title}
                </h2>
                <p className="mt-4 max-w-[56ch] text-ink-muted">{DEMO_COURSE_META.dek}</p>
                <ul className="mt-6 flex flex-col gap-2 text-sm text-ink-muted">
                  <li>— 7 шагов: от постановки задачи до итогового Decision Trace</li>
                  <li>— реальные интерактивные решения, не видео для просмотра</li>
                  <li>— прогресс хранится только в браузере, с кнопкой сброса</li>
                </ul>
                <Link
                  href="/demo-course"
                  className="mt-7 inline-flex rounded-lg bg-signal px-6 py-3 text-sm font-medium text-signal-ink transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]"
                >
                  Начать demo-курс →
                </Link>
              </div>
              <div className="rounded-2xl border border-hairline-ink bg-white/[0.03] p-6 font-mono text-xs text-ink-muted">
                <div className="text-system">Шаг 4 · Патч</div>
                <p className="mt-2 text-ink-foreground/80">
                  Вариант A — расширить существующую ветку. Вариант B — DiscountResolver.
                </p>
                <p className="mt-2">Какой стоит принять — и почему другой стоит отклонить?</p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* supplementary — free mini-courses (previews, not the demo course) */}
        <ScrollReveal className="w-full py-20">
          <div className="mx-auto flex max-w-[1280px] flex-wrap items-end justify-between gap-4 px-6 lg:px-10">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-graphite-muted">
                Catalog previews
              </span>
              <h2 className="mt-2 text-[2rem] font-semibold tracking-tight sm:text-[2.5rem]">
                Каталог обучения
              </h2>
            </div>
            <Link href="/courses" className="text-sm font-medium text-ink underline underline-offset-4">
              Весь каталог →
            </Link>
          </div>
          <div className="mt-10 flex gap-5 overflow-x-auto px-6 pb-4 [scrollbar-width:thin] lg:px-10">
            {homeCourses.map((c) => (
              <div key={c.slug} className="w-[280px] flex-shrink-0 sm:w-[320px]">
                <CourseCard course={c} />
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* 6 — Editorial layer: one big article + signals + first comic case */}
        <ScrollReveal className="mx-auto w-full max-w-[1280px] px-6 py-20 lg:px-10">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-copper">Editorial</span>
          <h2 className="mt-2 max-w-[28ch] text-[2.375rem] font-semibold tracking-tight sm:text-[3rem]">
            Журнал, Signals и комиксы
          </h2>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
            <JournalCard entry={featured} large />

            <div className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-xs uppercase tracking-wide text-graphite-muted">Signals</span>
                <Link href="/signals" className="text-xs text-graphite-muted underline">
                  Все signals →
                </Link>
              </div>
              {signals.map((s) => (
                <Link
                  key={s.slug}
                  href={`/signals/${s.slug}`}
                  className="card-hover rounded-xl border border-hairline bg-white/50 p-4"
                >
                  <span className={`font-mono text-[10px] uppercase tracking-wide ${s.kind === "original" ? "text-copper" : "text-system"}`}>
                    {s.kind === "original" ? "Оригинал" : "Внешний источник"}
                  </span>
                  <p className="mt-1 text-sm font-medium">{s.title}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-hairline bg-white/40 p-6 lg:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-wide text-copper">
                  {COMIC_SERIES.title}
                </span>
                <h3 className="mt-1 text-lg font-medium">{EPISODE_1.title}</h3>
              </div>
              <div className="flex -space-x-2">
                {CHARACTERS.map((c) => (
                  <CharacterAvatar key={c.id} id={c.id} className="h-10 w-10 rounded-full border-2 border-paper bg-white" />
                ))}
              </div>
            </div>
            <p className="mt-3 max-w-[70ch] text-sm text-graphite-muted">{EPISODE_1.summary}</p>
            <Link href={`/comics/${EPISODE_1.slug}`} className="mt-3 inline-block text-sm font-medium text-ink underline underline-offset-4">
              Читать эпизод →
            </Link>
          </div>
        </ScrollReveal>

        {/* events (supplementary to the editorial layer) */}
        <ScrollReveal className="mx-auto w-full max-w-[1280px] px-6 py-20 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-graphite-muted">
                Events
              </span>
              <h2 className="mt-2 text-[2rem] font-semibold tracking-tight sm:text-[2.5rem]">
                Мероприятия
              </h2>
            </div>
            <Link href="/events" className="text-sm font-medium text-ink underline underline-offset-4">
              Все мероприятия →
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {homeEvents.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        </ScrollReveal>

        {/* 7 — How practice and feedback work */}
        <ScrollReveal id="how-it-works" className="mx-auto w-full max-w-[1280px] px-6 py-20 lg:px-10">
          <h2 className="max-w-[26ch] text-[2.375rem] font-semibold tracking-tight sm:text-[3rem]">
            Как устроена практика и фидбек
          </h2>
          <ol className="mt-12 grid gap-8 md:grid-cols-5">
            {HOW_IT_WORKS.map((step, i) => (
              <li key={step.title} className="flex flex-col gap-2">
                <span className="font-mono text-xs text-graphite-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-sm text-graphite-muted">{step.detail}</p>
              </li>
            ))}
          </ol>
        </ScrollReveal>

        {/* 8 — Authors, demo-marked */}
        <ScrollReveal id="about" className="mx-auto w-full max-w-[1280px] px-6 py-20 lg:px-10">
          <div className="grid gap-10 rounded-2xl border border-hairline bg-white/50 p-10 lg:grid-cols-[auto_1fr] lg:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ink font-mono text-lg text-ink-foreground">
              {author.avatarGlyph}
            </div>
            <div>
              {author.isDemo && (
                <span className="mb-2 inline-flex w-fit rounded-full border border-warn/40 bg-warn/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-warn">
                  Демо-профиль автора — заменить перед публичным запуском
                </span>
              )}
              <h2 className="text-2xl font-semibold tracking-tight">{author.displayName}</h2>
              <p className="text-sm text-graphite-muted">{author.title}</p>
              <p className="mt-3 max-w-[60ch] text-graphite-muted">{author.bio}</p>
              <Link href="/authors" className="mt-3 inline-block text-sm font-medium text-ink underline underline-offset-4">
                Все авторы →
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* 9 — Workspace preview */}
        <ScrollReveal className="bg-ink py-20 text-ink-foreground">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
            <h2 className="max-w-[26ch] text-[2.375rem] font-semibold tracking-tight sm:text-[3rem]">
              Внутри рабочего пространства
            </h2>
            <p className="mt-4 max-w-[60ch] text-ink-muted">
              Не очередная LMS — компактное пространство для маленькой когорты: что делать дальше,
              текущая неделя, смежная заметка из журнала и открытая практика в одном месте.
            </p>

            <div className="mt-12 overflow-hidden rounded-2xl border border-hairline-ink bg-[#0E1420]">
              <div className="grid lg:grid-cols-[220px_1fr]">
                <div className="flex flex-col gap-1 border-b border-hairline-ink p-5 lg:border-b-0 lg:border-r">
                  {["Обзор", "Программа", "Практика", "Поток"].map((item, i) => (
                    <span
                      key={item}
                      className={`rounded-lg px-3 py-2 text-sm ${
                        i === 0 ? "bg-white/10 text-ink-foreground" : "text-ink-muted"
                      }`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col gap-5 p-6">
                  <div className="rounded-xl border border-hairline-ink bg-white/5 p-5">
                    <span className="font-mono text-xs text-system">Следующий шаг</span>
                    <p className="mt-1 font-medium">Неделя 2 · Context engineering и sub-agents</p>
                    <p className="text-sm text-ink-muted">
                      Открыта, но практика ещё не сдана — продолжить →
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1 rounded-xl border border-hairline-ink bg-signal/10 p-4 text-sm">
                      <span className="text-signal">Неделя 1</span>
                      <p className="text-ink-muted">практика принята</p>
                    </div>
                    <div className="flex-1 rounded-xl border border-hairline-ink bg-white/5 p-4 text-sm">
                      <span className="text-ink-foreground">Неделя 2</span>
                      <p className="text-ink-muted">практика открыта</p>
                    </div>
                    <div className="flex-1 rounded-xl border border-hairline-ink bg-white/[0.02] p-4 text-sm opacity-50">
                      <span className="text-ink-muted">Неделя 3</span>
                      <p className="text-ink-muted">скоро откроется</p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-hairline-ink bg-white/[0.03] p-4 text-sm">
                    <span className="font-mono text-[10px] uppercase tracking-wide text-copper">
                      Из журнала
                    </span>
                    <p className="mt-1 text-ink-muted">«{featured.title}» — связано с текущей неделей</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs text-ink-muted">
              Иллюстративный макет интерфейса — не скриншот живых данных.
            </p>
          </div>
        </ScrollReveal>

        {/* FAQ */}
        <ScrollReveal id="faq" className="mx-auto w-full max-w-[1280px] px-6 py-20 lg:px-10">
          <h2 className="text-[2.375rem] font-semibold tracking-tight sm:text-[3rem]">Частые вопросы</h2>
          <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
            {FAQ.map((item) => (
              <div key={item.q} className="border-t border-hairline pt-5">
                <h3 className="font-medium">{item.q}</h3>
                <p className="mt-2 text-sm text-graphite-muted">{item.a}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* 10 — calm closing CTA: sign in or open the demo course, not a hard sell on the closed pilot */}
        <section id="apply" className="bg-ink py-20 text-ink-foreground">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
            <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-hairline-ink bg-white/[0.03] p-8">
              <div>
                <h2 className="text-xl font-semibold">Не готов(а) подавать заявку прямо сейчас?</h2>
                <p className="mt-2 max-w-[56ch] text-ink-muted">
                  Пройди бесплатный demo-курс или войди, если уже участвуешь в пилоте — без давления
                  и без обратного отсчёта.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/demo-course"
                  className="rounded-lg bg-signal px-5 py-2.5 text-sm font-medium text-signal-ink transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]"
                >
                  Открыть demo-курс
                </Link>
                <a
                  href="#signin"
                  className="rounded-lg border border-hairline-ink px-5 py-2.5 text-sm font-medium text-ink-foreground transition-colors duration-200 hover:bg-white/5"
                >
                  Войти
                </a>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-16 grid max-w-[1280px] gap-14 px-6 lg:grid-cols-2 lg:px-10">
            <div className="flex flex-col justify-center gap-5">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-system">
                Заявка на пилот
              </span>
              <h2 className="text-[2.375rem] font-semibold tracking-tight sm:text-[3rem]">
                Подай заявку на бесплатный пилот
              </h2>
              <p className="max-w-[46ch] text-ink-muted">
                5 участников, рассмотрение вручную, без автоматического зачисления.
              </p>
            </div>
            <div className="rounded-2xl border border-hairline-ink bg-white/[0.03] p-7">
              <ApplyForm variant="dark" />
            </div>
          </div>

          <div
            id="signin"
            className="mx-auto mt-16 max-w-[1280px] border-t border-hairline-ink px-6 pt-10 lg:px-10"
          >
            <p className="mb-3 text-sm text-ink-muted">
              Уже участвуешь в пилоте? Войди по email — ссылка на вход придёт на почту. Вход по
              магик-ссылке открыт для любого email, но доступ к материалам конкретной когорты
              получают только зачисленные вручную участники.
            </p>
            <form
              action={async (formData) => {
                "use server";
                await signIn("resend", { email: formData.get("email") });
              }}
              className="flex max-w-sm gap-2"
            >
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="flex-1 rounded-lg border border-hairline-ink bg-white/5 p-2.5 text-sm text-ink-foreground placeholder:text-ink-muted"
              />
              <button
                type="submit"
                className="rounded-lg border border-hairline-ink px-4 py-2.5 text-sm font-medium text-ink-foreground transition-colors duration-200 hover:bg-white/5"
              >
                Войти
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
