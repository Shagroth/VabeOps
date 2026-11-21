import type { CSSProperties, ReactNode, RefObject } from "react";

/**
 * Shared layout and building blocks of the interactive module flows
 * (DemoCourseFlow for the introductory demo, PrototypeModuleFlow for course modules).
 * Presentation only: step state and persistence stay in the flows.
 *
 * The step rail is the brand's line made literal: steps hang on a thread,
 * the covered part of it is red, and the current step sits where the grip is.
 */

export type FlowStep = { id: string; index: string; label: string; short: string };

const PILL = "kg-btn inline-flex items-center justify-center gap-2 rounded-full font-semibold";

export const BTN = {
  primary: `${PILL} min-h-12 bg-signal px-6 text-base text-signal-ink hover:bg-sky-deep disabled:cursor-not-allowed disabled:bg-paper-deep disabled:text-graphite-muted`,
  dark: `${PILL} min-h-12 bg-ink px-6 text-base text-ink-foreground hover:bg-signal disabled:cursor-not-allowed disabled:bg-paper-deep disabled:text-graphite-muted`,
  outline: `${PILL} min-h-12 border-[1.5px] border-graphite px-6 text-base hover:bg-ink hover:text-ink-foreground disabled:cursor-not-allowed disabled:border-hairline-strong disabled:text-graphite-muted disabled:hover:bg-transparent`,
  small: `${PILL} min-h-11 bg-ink px-5 text-[15px] text-ink-foreground hover:bg-signal`,
} as const;

export const FIELD =
  "w-full resize-y rounded-[14px] border border-hairline-strong bg-white px-4 py-3 text-base leading-relaxed text-graphite outline-none transition-colors placeholder:text-graphite-muted hover:border-graphite-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal";

export const CARD = "rounded-[24px] border border-hairline bg-paper p-6 sm:p-7";
export const CARD_DARK = "rounded-[24px] bg-ink p-6 text-ink-foreground sm:p-8";

export function Arrow() {
  return (
    <span aria-hidden="true" className="kg-arrow">
      →
    </span>
  );
}

/** Mono service label. `number` is the red index in front of it, as on the landing. */
export function Label({
  children,
  number,
  tone = "muted",
}: {
  children: ReactNode;
  number?: string;
  tone?: "muted" | "system" | "danger";
}) {
  const color = tone === "system" ? "text-system" : tone === "danger" ? "text-danger" : "text-graphite-muted";
  return (
    <span className={`font-mono text-[13px] uppercase tracking-[0.08em] ${color}`}>
      {number && <span className="mr-2 text-string">{number}</span>}
      {children}
    </span>
  );
}

export function FlowShell({
  eyebrow,
  title,
  note,
  steps,
  step,
  maxStepReached,
  finished,
  topNote,
  canAdvance,
  onGoTo,
  onBack,
  onNext,
  onReset,
  children,
}: {
  eyebrow: string;
  title: string;
  note: string;
  steps: readonly FlowStep[];
  step: number;
  maxStepReached: number;
  finished: boolean;
  topNote: string;
  canAdvance: boolean;
  onGoTo: (index: number) => void;
  onBack: () => void;
  onNext: () => void;
  onReset: () => void;
  children: ReactNode;
}) {
  const last = steps.length - 1;
  const current = steps[step];
  const done = finished ? steps.length : maxStepReached;

  return (
    <div className="overflow-clip rounded-[28px] border border-hairline bg-white">
      <div className="grid min-h-[760px] min-w-0 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="min-w-0 bg-ink text-ink-foreground">
          <div className="lg:sticky lg:top-[100px]">
            <div className="p-6 pb-2 lg:p-8 lg:pb-4">
              <div className="flex items-center justify-between gap-4 font-mono text-[13px]">
                <span className="uppercase tracking-[0.08em] text-system">{eyebrow}</span>
                <span className="text-ink-muted" aria-label={`Пройдено шагов: ${done} из ${steps.length}`}>
                  {done} / {steps.length}
                </span>
              </div>
              <h2 className="mt-5 text-[26px] font-extrabold leading-[1.05] tracking-[-0.03em]">{title}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">{note}</p>
            </div>

            <nav className="px-4 py-4 lg:px-6 lg:pb-6" aria-label="Навигация по модулю">
              <ol className="flex items-center lg:block">
                {steps.map((item, index) => {
                  const active = index === step;
                  const reachable = index <= maxStepReached;
                  const passed = index < maxStepReached || finished;
                  const state = active ? "текущий шаг" : passed ? "пройден" : reachable ? "открыт" : "ещё закрыт";
                  return (
                    <li key={item.id} className="relative flex flex-1 items-center last:flex-none lg:block">
                      <button
                        type="button"
                        disabled={!reachable}
                        onClick={() => onGoTo(index)}
                        aria-current={active ? "step" : undefined}
                        aria-label={`${item.index}. ${item.label} — ${state}`}
                        className={`group relative z-[1] flex min-h-11 min-w-11 items-center justify-center gap-3.5 rounded-2xl text-left transition-colors lg:w-full lg:items-start lg:justify-start lg:px-2 lg:py-2.5 ${
                          reachable && !active ? "lg:hover:bg-ink-raised" : ""
                        } ${reachable ? "" : "cursor-not-allowed"}`}
                      >
                        <span
                          className={`flex h-7 w-7 flex-none items-center justify-center rounded-full font-mono text-[11px] transition-colors duration-300 ${
                            active
                              ? "bg-paper text-ink"
                              : passed
                                ? "bg-string text-white"
                                : "border-[1.5px] border-ink-line bg-ink text-ink-muted"
                          }`}
                        >
                          {passed && !active ? "✓" : item.index}
                        </span>
                        <span className="hidden lg:block">
                          <span className={`block text-[15px] font-semibold leading-snug ${reachable ? "text-ink-foreground" : "text-ink-muted"}`}>
                            {item.label}
                          </span>
                          <span className="mt-0.5 block text-[13px] leading-snug text-ink-muted">{item.short}</span>
                        </span>
                      </button>
                      {index < last && (
                        <span
                          aria-hidden="true"
                          className={`h-[2px] flex-1 transition-colors duration-500 lg:absolute lg:bottom-[-10px] lg:left-[21px] lg:top-[38px] lg:h-auto lg:w-[2px] lg:flex-none ${
                            index < maxStepReached || finished ? "bg-string" : "bg-ink-line"
                          }`}
                        />
                      )}
                    </li>
                  );
                })}
              </ol>
              <p className="mt-3 px-2 text-[15px] lg:hidden">
                <span className="font-semibold">{current.label}.</span>{" "}
                <span className="text-ink-muted">{current.short}</span>
              </p>
            </nav>

            <div className="hidden border-t border-ink-line px-8 py-5 lg:block">
              <button
                type="button"
                onClick={onReset}
                className="min-h-11 font-mono text-[13px] text-ink-muted underline underline-offset-4 hover:text-ink-foreground"
              >
                Сбросить прогресс
              </button>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col">
          <div className="flex min-h-14 items-center justify-between gap-4 border-b border-hairline px-5 sm:px-8 xl:px-12">
            <span className="font-mono text-[13px] text-graphite-muted">{topNote}</span>
            <button
              type="button"
              onClick={onReset}
              className="min-h-11 font-mono text-[13px] text-graphite-muted underline underline-offset-4 lg:hidden"
            >
              Сбросить
            </button>
          </div>

          <div className="flex-1 px-5 py-10 sm:px-8 sm:py-12 xl:px-12 xl:py-14">
            <div key={current.id} className="kg-rise mx-auto max-w-[920px]">
              {children}
            </div>
          </div>

          <footer className="border-t border-hairline px-5 py-5 sm:px-8 xl:px-12">
            <div className="mx-auto flex max-w-[920px] items-center justify-between gap-4">
              <button type="button" onClick={onBack} disabled={step === 0} className={BTN.outline}>
                <span aria-hidden="true">←</span> Назад
              </button>
              <span className="hidden font-mono text-[13px] text-graphite-muted sm:block">
                {current.index} / {steps[last].index}
              </span>
              {step < last ? (
                <button type="button" onClick={onNext} disabled={!canAdvance} className={BTN.primary}>
                  Продолжить <Arrow />
                </button>
              ) : (
                <span className="font-mono text-[13px] text-graphite-muted">Финал модуля</span>
              )}
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export function FlowPlaceholder() {
  return <div className="min-h-[720px] rounded-[28px] border border-hairline bg-white" />;
}

export function Lesson({
  headingRef,
  kicker,
  title,
  lead,
  children,
}: {
  headingRef: RefObject<HTMLHeadingElement | null>;
  kicker: string;
  title: string;
  lead: string;
  children: ReactNode;
}) {
  const [number, ...rest] = kicker.split(" / ");
  return (
    <section>
      <Label number={rest.length ? number : undefined}>{rest.length ? rest.join(" / ") : kicker}</Label>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-4 max-w-[20ch] text-[clamp(30px,3.6vw,48px)] font-extrabold leading-[1.02] tracking-[-0.035em]"
      >
        {title}
      </h2>
      <p className="mt-5 max-w-[60ch] text-[19px] leading-[1.6] text-graphite-soft">{lead}</p>
      <div className="mt-10">{children}</div>
    </section>
  );
}

export function Question({
  label = "Твоя очередь",
  title,
  description,
  children,
}: {
  label?: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-8 border-t-[1.5px] border-graphite pt-7">
      <Label tone="system">{label}</Label>
      <h3 className="mt-3 text-[23px] font-bold leading-tight tracking-[-0.015em]">{title}</h3>
      {description && <p className="mt-3 max-w-[64ch] leading-relaxed text-graphite-soft">{description}</p>}
      <div className="mt-6 space-y-2.5">{children}</div>
    </div>
  );
}

export function ChoiceButton({
  selected,
  onClick,
  children,
  detail,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  detail?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex min-h-14 w-full items-center gap-3.5 rounded-[18px] border-[1.5px] px-5 py-3.5 text-left transition-colors duration-200 ${
        selected ? "border-signal bg-sky-tint" : "border-hairline-strong bg-white hover:border-graphite"
      }`}
    >
      <span
        aria-hidden="true"
        className={`flex h-5 w-5 flex-none items-center justify-center rounded-full border-[1.5px] ${
          selected ? "border-signal" : "border-graphite-muted"
        }`}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-signal" />}
      </span>
      <span>
        <span className="block font-semibold leading-snug">{children}</span>
        {detail && <span className="mt-1 block text-[15px] leading-snug text-graphite-soft">{detail}</span>}
      </span>
    </button>
  );
}

export function Feedback({
  good,
  goodLabel = "Верно",
  retryLabel = "Посмотри глубже",
  children,
}: {
  good: boolean;
  goodLabel?: string;
  retryLabel?: string;
  children: ReactNode;
}) {
  return (
    <div
      role="status"
      className={`kg-rise mt-5 rounded-[18px] p-5 leading-relaxed ${good ? "bg-sky-tint" : "border border-hairline-strong bg-paper"}`}
    >
      <span className={`mb-1.5 block font-mono text-[13px] uppercase tracking-[0.08em] ${good ? "text-sky-deep" : "text-danger"}`}>
        {good ? goodLabel : retryLabel}
      </span>
      {children}
    </div>
  );
}

/** A dark "file" card with the red line down its left edge, as on the landing contract card. */
export function FileCard({
  name,
  status,
  children,
  className = "",
}: {
  name: string;
  status?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative min-w-0 overflow-hidden rounded-[24px] bg-ink pl-12 text-ink-foreground ${className}`}>
      <svg
        viewBox="0 0 40 400"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute bottom-6 left-2.5 top-6 h-[calc(100%-48px)] w-8"
      >
        <path
          d="M20 0 C 6 60, 34 120, 20 200 C 8 270, 32 330, 20 400"
          fill="none"
          stroke="var(--string)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="flex items-center justify-between gap-4 py-5 pr-6 font-mono text-[13px]">
        <span className="text-system">{name}</span>
        {status && <span className="rounded-full border border-ink-line px-3 py-1 text-ink-muted">{status}</span>}
      </div>
      {children}
    </div>
  );
}

/** Lab field: a labelled textarea with a filled/empty status chip. */
export function LabField({
  title,
  prompt,
  value,
  placeholder,
  ready,
  onChange,
}: {
  title: string;
  prompt: string;
  value: string;
  placeholder: string;
  ready: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className={`block ${CARD}`}>
      <span className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <span className="text-lg font-bold tracking-[-0.01em]">{title}</span>
        <span
          className={`rounded-full px-3 py-1 font-mono text-xs ${ready ? "bg-sky-tint text-sky-deep" : "bg-paper-deep text-graphite-muted"}`}
        >
          {ready ? "готово" : "нужно заполнить"}
        </span>
      </span>
      <span className="mt-1.5 block text-[15px] leading-relaxed text-graphite-soft">{prompt}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        className={`mt-4 ${FIELD}`}
        placeholder={placeholder}
      />
    </label>
  );
}

export function LabProgress({ label, done, total }: { label: string; done: number; total: number }) {
  return (
    <div className="mt-5 flex min-h-14 items-center justify-between rounded-full bg-ink px-6 text-ink-foreground" role="status">
      <span className="font-semibold">{label}</span>
      <span className="font-mono text-system">
        {done} / {total}
      </span>
    </div>
  );
}

export function StarterCase({ title, text, action, onClick }: { title: string; text: string; action: string; onClick: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] bg-sky-tint p-6">
      <div>
        <p className="text-lg font-bold tracking-[-0.01em]">{title}</p>
        <p className="mt-1 text-[15px] text-graphite-soft">{text}</p>
      </div>
      <button type="button" onClick={onClick} className={BTN.small}>
        {action}
      </button>
    </div>
  );
}

export function Checklist({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-graphite-soft">
          <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-0.5 h-5 w-5 flex-none text-signal">
            <path d="M4 10.5 8.2 14.5 16 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {item}
        </li>
      ))}
    </ul>
  );
}

export const stagger = (i: number) => ({ "--i": i }) as CSSProperties;
