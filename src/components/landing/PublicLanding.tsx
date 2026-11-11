import { DecisionTraceVisual } from "./DecisionTraceVisual";
import { ApplyForm } from "@/components/ApplyForm";
import { signIn } from "@/auth";

const NAV_LINKS = [
  { href: "#program", label: "Программа" },
  { href: "#how-it-works", label: "Как это работает" },
  { href: "#about", label: "Об авторе" },
  { href: "#faq", label: "FAQ" },
];

const WEEKS = [
  {
    n: 1,
    title: "Agentic mindset",
    detail: "Чат vs агент, где агент врёт и почему, гибкость мышления как рамка на весь курс.",
  },
  {
    n: 2,
    title: "Context engineering, skills и sub-agents",
    detail: "Как собрать контекст под задачу и когда декомпозиция на под-агентов оправдана.",
  },
  {
    n: 3,
    title: "MCP и плагины",
    detail: "Подключение внешних систем агенту — и где проходит граница его ответственности.",
  },
  {
    n: 4,
    title: "Guardrails и безопасность",
    detail: "Permission rails, review-гейты, что агенту нельзя доверять по умолчанию.",
  },
  {
    n: 5,
    title: "Мультиагентные системы",
    detail: "Когда несколько агентов — это мощь, а когда — сложность ради сложности.",
  },
];

const ARTIFACTS = [
  {
    title: "Кастомный skill",
    detail: "Узкая, воспроизводимая способность агента под конкретную рабочую задачу.",
  },
  {
    title: "MCP-интеграция с минимальными правами",
    detail: "Агент видит и может ровно то, что нужно для задачи — не больше.",
  },
  {
    title: "Обоснованная мультиагентная архитектура",
    detail: "Несколько агентов только там, где это реально окупает сложность координации.",
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
    a: "Точная нагрузка ещё уточняется (TBD) — ориентируйся на несколько часов в неделю на материалы и практику.",
  },
  {
    q: "Это точно бесплатно?",
    a: "Да, этот пилотный поток бесплатный. Будущие платные потоки появятся позже — отдельно.",
  },
  {
    q: "Как проходит отбор?",
    a: "Через заявку ниже. Автор рассматривает заявки вручную, мест немного — 5–10 человек.",
  },
];

export function PublicLanding() {
  return (
    <div className="flex flex-1 flex-col bg-paper text-graphite">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-hairline-ink bg-ink/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4 lg:px-10">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <circle cx="5" cy="19" r="2" fill="var(--system)" />
              <path d="M7 18 L17 7" stroke="var(--signal)" strokeWidth="1.6" fill="none" />
              <circle cx="19" cy="5" r="2" fill="var(--signal)" />
            </svg>
            <span className="font-medium text-ink-foreground">Vibe Ops</span>
          </div>
          <nav className="hidden items-center gap-7 text-sm text-ink-muted md:flex">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-ink-foreground">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a href="#signin" className="hidden text-sm text-ink-muted hover:text-ink-foreground sm:inline">
              Войти
            </a>
            <a
              href="#apply"
              className="rounded-lg bg-signal px-4 py-2 text-sm font-medium text-signal-ink"
            >
              Подать заявку
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-[1280px] gap-14 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-28">
          <div className="flex flex-col gap-7">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-system">
              Vibe Ops / Engineering Cohort
            </span>
            <h1 className="text-[2.75rem] font-semibold leading-[1.08] tracking-tight sm:text-[3.5rem] lg:text-[4.25rem]">
              Работай с AI-агентами.
              <br />
              Думай как инженер.
            </h1>
            <p className="max-w-[46ch] text-lg text-ink-muted">
              Когортный пилот для разработчиков, которые уже пишут код и хотят осмысленно
              встраивать агентов в реальную работу — без потери контроля над качеством и рисками.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#apply"
                className="rounded-lg bg-signal px-6 py-3 text-sm font-medium text-signal-ink"
              >
                Подать заявку на пилот
              </a>
              <a
                href="#program"
                className="rounded-lg border border-hairline-ink px-6 py-3 text-sm font-medium text-ink-foreground hover:bg-white/5"
              >
                Смотреть программу
              </a>
            </div>
            <p className="text-sm text-ink-muted">
              Бесплатный пилот · 5–10 мест · предзаписанные материалы + три живых созвона
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <DecisionTraceVisual />
          </div>
        </div>
      </section>

      {/* Section 1 — weak vs robust */}
      <section className="mx-auto w-full max-w-[1280px] px-6 py-20 lg:px-10">
        <h2 className="max-w-[26ch] text-3xl font-semibold tracking-tight text-graphite sm:text-4xl">
          От промптов к инженерным решениям
        </h2>
        <p className="mt-4 max-w-[62ch] text-graphite-muted">
          Большинство людей используют агентов как умный автокомплит: кинули промпт, приняли
          результат не глядя. Инженерный подход — другой: понятен контекст, видна альтернатива,
          которую отклонили, и есть способ проверить, что решение не сломает систему.
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-hairline bg-white/50 p-7">
            <span className="font-mono text-xs uppercase tracking-wide text-graphite-muted">
              Слабый подход
            </span>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-graphite-muted">
              <li>— промпт без контекста о реальных ограничениях системы</li>
              <li>— результат принимается на веру, без проверки</li>
              <li>— непонятно, какие альтернативы агент вообще рассматривал</li>
              <li>— при смене условий всё приходится переделывать с нуля</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-graphite/15 bg-ink p-7 text-ink-foreground">
            <span className="font-mono text-xs uppercase tracking-wide text-signal">
              Инженерный подход
            </span>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-ink-muted">
              <li>— задача и ограничения сформулированы до работы агента</li>
              <li>— решение проверяется — тестами, ревью, запуском</li>
              <li>— отклонённая альтернатива зафиксирована вместе с причиной</li>
              <li>— понятно, при каком изменении условий решение нужно пересмотреть</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 2 — what you'll build */}
      <section className="mx-auto w-full max-w-[1280px] px-6 py-20 lg:px-10">
        <h2 className="max-w-[26ch] text-3xl font-semibold tracking-tight sm:text-4xl">
          Что ты реально соберёшь
        </h2>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline md:grid-cols-3">
          {ARTIFACTS.map((a) => (
            <div key={a.title} className="flex flex-col gap-3 bg-paper p-7">
              <h3 className="text-lg font-medium">{a.title}</h3>
              <p className="text-sm text-graphite-muted">{a.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3 — program by weeks */}
      <section id="program" className="mx-auto w-full max-w-[1280px] px-6 py-20 lg:px-10">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Программа по неделям</h2>
          <span className="rounded-full border border-hairline px-3 py-1 font-mono text-xs text-graphite-muted">
            черновик — число недель и даты уточняются
          </span>
        </div>

        <ol className="mt-10 flex flex-col">
          {WEEKS.map((w) => (
            <li key={w.n} className="flex gap-6 border-t border-hairline py-6 first:border-t-0">
              <span className="font-mono text-sm text-graphite-muted">
                {String(w.n).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-lg font-medium">{w.title}</h3>
                <p className="mt-1 max-w-[60ch] text-sm text-graphite-muted">{w.detail}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap gap-3">
          {["Кикофф", "Мидпоинт", "Финал"].map((label) => (
            <span
              key={label}
              className="rounded-full border border-hairline bg-white/60 px-4 py-1.5 text-xs text-graphite-muted"
            >
              {label} · живой созвон потока
            </span>
          ))}
        </div>
      </section>

      {/* Section 4 — workspace preview (contrasting dark panel) */}
      <section className="bg-ink py-20 text-ink-foreground">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <h2 className="max-w-[26ch] text-3xl font-semibold tracking-tight sm:text-4xl">
            Внутри рабочего пространства
          </h2>
          <p className="mt-4 max-w-[60ch] text-ink-muted">
            Не очередная LMS — компактное пространство для маленькой когорты: что делать дальше,
            текущая неделя и открытая практика в одном месте.
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
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-ink-muted">
            Иллюстративный макет интерфейса — не скриншот живых данных.
          </p>
        </div>
      </section>

      {/* Section 5 — how cohort works */}
      <section id="how-it-works" className="mx-auto w-full max-w-[1280px] px-6 py-20 lg:px-10">
        <h2 className="max-w-[26ch] text-3xl font-semibold tracking-tight sm:text-4xl">
          Как устроен поток
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
      </section>

      {/* Section 6 — instructor */}
      <section id="about" className="mx-auto w-full max-w-[1280px] px-6 py-20 lg:px-10">
        <div className="grid gap-10 rounded-2xl border border-hairline bg-white/50 p-10 lg:grid-cols-[auto_1fr] lg:items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ink font-mono text-lg text-ink-foreground">
            VO
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Об авторе</h2>
            <p className="mt-3 max-w-[60ch] text-graphite-muted">
              Публичное описание автора и опыта появится здесь по мере готовности. Это
              осознанный плейсхолдер — мы не публикуем выдуманную биографию, достижения или
              логотипы компаний.
            </p>
          </div>
        </div>
      </section>

      {/* Section 7 — FAQ */}
      <section id="faq" className="mx-auto w-full max-w-[1280px] px-6 py-20 lg:px-10">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Частые вопросы</h2>
        <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
          {FAQ.map((item) => (
            <div key={item.q} className="border-t border-hairline pt-5">
              <h3 className="font-medium">{item.q}</h3>
              <p className="mt-2 text-sm text-graphite-muted">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 8 — apply */}
      <section id="apply" className="bg-ink py-20 text-ink-foreground">
        <div className="mx-auto grid max-w-[1280px] gap-14 px-6 lg:grid-cols-2 lg:px-10">
          <div className="flex flex-col justify-center gap-5">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-system">
              Заявка
            </span>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Подай заявку на бесплатный пилот
            </h2>
            <p className="max-w-[46ch] text-ink-muted">
              5–10 мест, рассмотрение вручную. Если тебя уже пригласили — войди по почте,
              ссылка на вход в шапке страницы.
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
          <p className="mb-3 text-sm text-ink-muted">Уже приглашён(а) в пилот?</p>
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
              className="rounded-lg border border-hairline-ink px-4 py-2.5 text-sm font-medium text-ink-foreground hover:bg-white/5"
            >
              Войти
            </button>
          </form>
        </div>
      </section>

      <footer className="border-t border-hairline px-6 py-8 text-xs text-graphite-muted lg:px-10">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between">
          <span>Vibe Ops · когортный пилот</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}
