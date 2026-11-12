"use client";

import { useEffect, useRef, useState } from "react";
import {
  ACCEPTED_PATCH,
  BOUNDARY_OPTIONS,
  CONDITIONS_CHANGED_PROMPT,
  CONDITIONS_CHOICES,
  CONTEXT_FILES,
  DEMO_FINAL_STATE,
  DEMO_MENTOR_FEEDBACK,
  DEMO_REVISION_NOTE,
  DEMO_SUBMISSION_SUMMARY,
  EXISTING_CONTRACT,
  REJECTED_PATCH,
  REJECTED_REASON,
  TASK_CONSTRAINTS,
  TASK_DONE_CRITERIA,
  TASK_GOAL,
  TEST_COMMAND,
  TEST_OUTPUT,
  type ConditionsChoice,
} from "@/content/demo-course";

const STORAGE_KEY = "vabeops-demo-course-v1";
const TOTAL_STEPS = 7;

const STEP_LABELS = [
  "Задача",
  "Контекст",
  "Границы агента",
  "Патч",
  "Проверка",
  "Изменились условия",
  "Decision Trace",
];

type State = {
  step: number;
  maxStepReached: number;
  taskUnderstood: boolean;
  selectedFiles: string[];
  boundary: string | null;
  confirmBeforeWrite: boolean;
  patchChoice: "accepted" | "rejected" | null;
  testsRun: boolean;
  conditionsChoice: ConditionsChoice["id"] | null;
  submissionStage: "not_started" | "submitted" | "feedback_given" | "revised" | "accepted";
};

const INITIAL_STATE: State = {
  step: 0,
  maxStepReached: 0,
  taskUnderstood: false,
  selectedFiles: [],
  boundary: null,
  confirmBeforeWrite: false,
  patchChoice: null,
  testsRun: false,
  conditionsChoice: null,
  submissionStage: "not_started",
};

function loadState(): State {
  if (typeof window === "undefined") return INITIAL_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    return { ...INITIAL_STATE, ...JSON.parse(raw) };
  } catch {
    return INITIAL_STATE;
  }
}

function CodeBlock({ children, label }: { children: string; label?: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-hairline bg-ink">
      {label && (
        <div className="border-b border-hairline-ink px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-ink-muted">
          {label}
        </div>
      )}
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-ink-foreground">
        <code>{children}</code>
      </pre>
    </div>
  );
}

export function DemoCourseFlow() {
  const [state, setState] = useState<State>(INITIAL_STATE);
  const [hydrated, setHydrated] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // One-time hydration from localStorage (an external store, not derived
    // React state) — must happen post-mount to avoid an SSR/client mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  useEffect(() => {
    if (hydrated) headingRef.current?.focus();
  }, [state.step, hydrated]);

  function goTo(step: number) {
    setState((s) => ({ ...s, step, maxStepReached: Math.max(s.maxStepReached, step) }));
  }

  function next() {
    goTo(Math.min(state.step + 1, TOTAL_STEPS - 1));
  }

  function back() {
    goTo(Math.max(state.step - 1, 0));
  }

  function resetDemo() {
    window.localStorage.removeItem(STORAGE_KEY);
    setState(INITIAL_STATE);
  }

  function toggleFile(path: string) {
    setState((s) => ({
      ...s,
      selectedFiles: s.selectedFiles.includes(path)
        ? s.selectedFiles.filter((p) => p !== path)
        : [...s.selectedFiles, path],
    }));
  }

  if (!hydrated) {
    return <div className="h-96" aria-hidden="true" />;
  }

  const canAdvance = [
    state.taskUnderstood,
    state.selectedFiles.length > 0,
    state.boundary !== null && state.confirmBeforeWrite,
    state.patchChoice !== null,
    state.testsRun,
    state.conditionsChoice !== null,
    true,
  ][state.step];

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-system/30 bg-system/5 px-4 py-3 text-sm text-graphite">
        <strong className="font-medium">Демо-режим.</strong> Прогресс хранится только в этом
        браузере (localStorage) — ничего не уходит на сервер. Можно начать заново в любой момент.
      </div>

      <div className="flex items-center justify-between gap-4">
        <ol className="flex flex-wrap gap-1.5" aria-label="Шаги курса">
          {STEP_LABELS.map((label, i) => {
            const reachable = i <= state.maxStepReached;
            const active = i === state.step;
            return (
              <li key={label}>
                <button
                  type="button"
                  disabled={!reachable}
                  aria-current={active ? "step" : undefined}
                  onClick={() => goTo(i)}
                  className={`rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wide transition-colors duration-150 ${
                    active
                      ? "border-ink bg-ink text-ink-foreground"
                      : reachable
                        ? "border-hairline text-graphite-muted hover:border-system hover:text-graphite"
                        : "border-hairline/50 text-graphite-muted/40"
                  }`}
                >
                  {i + 1}. {label}
                </button>
              </li>
            );
          })}
        </ol>
        <button
          type="button"
          onClick={resetDemo}
          className="flex-shrink-0 text-xs text-graphite-muted underline underline-offset-2 hover:text-graphite"
        >
          Сбросить демо
        </button>
      </div>

      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-hairline"
        role="progressbar"
        aria-valuenow={state.step + 1}
        aria-valuemin={1}
        aria-valuemax={TOTAL_STEPS}
        aria-label="Прогресс курса"
      >
        <div
          className="h-full rounded-full bg-signal transition-[width] duration-300"
          style={{ width: `${((state.step + 1) / TOTAL_STEPS) * 100}%` }}
        />
      </div>

      <div className="rounded-2xl border border-hairline bg-white/60 p-6 lg:p-8">
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="text-xl font-semibold outline-none"
        >
          Шаг {state.step + 1} · {STEP_LABELS[state.step]}
        </h2>

        <div className="mt-5">
          {state.step === 0 && (
            <div className="flex flex-col gap-4 text-sm">
              <p className="text-graphite-muted">
                Прежде чем звать агента, задачу формулируют так, как её понял бы инженер — не
                промптом «сделай скидку получше».
              </p>
              <div>
                <span className="font-medium">Существующий контракт</span>
                <div className="mt-2">
                  <CodeBlock label="src/services/discount.ts (текущая версия)">
                    {EXISTING_CONTRACT}
                  </CodeBlock>
                </div>
              </div>
              <div>
                <span className="font-medium">Цель</span>
                <p className="mt-1 text-graphite-muted">{TASK_GOAL}</p>
              </div>
              <div>
                <span className="font-medium">Ограничения</span>
                <ul className="mt-1 flex flex-col gap-1 text-graphite-muted">
                  {TASK_CONSTRAINTS.map((c) => (
                    <li key={c}>— {c}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="font-medium">Критерии готовности</span>
                <ul className="mt-1 flex flex-col gap-1 text-graphite-muted">
                  {TASK_DONE_CRITERIA.map((c) => (
                    <li key={c}>— {c}</li>
                  ))}
                </ul>
              </div>
              <label className="mt-2 flex items-start gap-2 rounded-lg border border-hairline p-3">
                <input
                  type="checkbox"
                  checked={state.taskUnderstood}
                  onChange={(e) => setState((s) => ({ ...s, taskUnderstood: e.target.checked }))}
                  className="mt-0.5"
                />
                <span>
                  Понимаю цель, контракт, ограничения и критерии готовности — готов(а) собрать
                  контекст для агента.
                </span>
              </label>
            </div>
          )}

          {state.step === 1 && (
            <div className="flex flex-col gap-4 text-sm">
              <p className="text-graphite-muted">
                Отметь файлы, которые реально нужны агенту для этой задачи. «Весь репозиторий на
                всякий случай» — не минимальный контекст, а его противоположность.
              </p>
              <ul className="flex flex-col gap-2">
                {CONTEXT_FILES.map((f) => {
                  const picked = state.selectedFiles.includes(f.path);
                  return (
                    <li key={f.path}>
                      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-hairline p-3 hover:bg-white">
                        <input
                          type="checkbox"
                          checked={picked}
                          onChange={() => toggleFile(f.path)}
                          className="mt-0.5"
                        />
                        <span className="flex flex-col gap-1">
                          <span className="font-mono text-xs">{f.path}</span>
                          <span className="text-graphite-muted">{f.description}</span>
                          {picked && (
                            <span
                              className={`mt-1 text-xs ${f.shouldInclude ? "text-graphite" : "text-warn"}`}
                            >
                              {f.shouldInclude ? "✓ " : "⚠ "}
                              {f.why}
                            </span>
                          )}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {state.step === 2 && (
            <div className="flex flex-col gap-4 text-sm">
              <p className="text-graphite-muted">
                Какие действия агент может делать без остановки, а что требует твоего
                подтверждения?
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {BOUNDARY_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex cursor-pointer flex-col gap-1 rounded-lg border p-3 ${
                      state.boundary === opt.id ? "border-ink bg-white" : "border-hairline bg-white/40"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="boundary"
                        checked={state.boundary === opt.id}
                        onChange={() => setState((s) => ({ ...s, boundary: opt.id }))}
                      />
                      <span className="font-medium">{opt.label}</span>
                    </span>
                    <span className="text-graphite-muted">{opt.detail}</span>
                  </label>
                ))}
              </div>
              {state.boundary && state.boundary !== "propose" && (
                <p className="rounded-lg border border-accent-change/40 bg-accent-change/5 p-3 text-accent-change">
                  Для точечной правки в чужом контракте подтверждение перед записью снижает риск
                  сильнее, чем экономит время. Рекомендованная граница — «читать + предлагать патч».
                </p>
              )}
              <label className="flex items-start gap-2 rounded-lg border border-hairline p-3">
                <input
                  type="checkbox"
                  checked={state.confirmBeforeWrite}
                  onChange={(e) => setState((s) => ({ ...s, confirmBeforeWrite: e.target.checked }))}
                  className="mt-0.5"
                />
                <span>
                  Подтверждаю: агент не применяет изменения без явного ОК, и тестовая команда —{" "}
                  <code className="font-mono text-xs">{TEST_COMMAND}</code>.
                </span>
              </label>
            </div>
          )}

          {state.step === 3 && (
            <div className="flex flex-col gap-4 text-sm">
              <p className="text-graphite-muted">
                Агент предложил два варианта. Какой стоит принять — и почему другой стоит отклонить?
              </p>
              <div className="grid gap-4 lg:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setState((s) => ({ ...s, patchChoice: "accepted" }))}
                  className={`flex flex-col gap-2 rounded-xl border p-3 text-left ${
                    state.patchChoice === "accepted" ? "border-signal bg-signal/10" : "border-hairline"
                  }`}
                >
                  <span className="font-medium">Вариант A — расширить существующую ветку</span>
                  <CodeBlock>{ACCEPTED_PATCH}</CodeBlock>
                </button>
                <button
                  type="button"
                  onClick={() => setState((s) => ({ ...s, patchChoice: "rejected" }))}
                  className={`flex flex-col gap-2 rounded-xl border p-3 text-left ${
                    state.patchChoice === "rejected" ? "border-warn bg-warn/10" : "border-hairline"
                  }`}
                >
                  <span className="font-medium">Вариант B — DiscountResolver</span>
                  <CodeBlock>{REJECTED_PATCH}</CodeBlock>
                </button>
              </div>
              {state.patchChoice === "rejected" && (
                <p className="rounded-lg border border-accent-change/40 bg-accent-change/5 p-3 text-accent-change">
                  {REJECTED_REASON} Рекомендуемый выбор — вариант A; вариант B стоит запомнить как
                  отвергнутую альтернативу для Decision Trace, а не применять сейчас.
                </p>
              )}
              {state.patchChoice === "accepted" && (
                <p className="rounded-lg border border-signal/40 bg-signal/10 p-3 text-graphite">
                  Вариант A сохраняет контракт и не вводит абстракцию, которой пока ничего не
                  оправдывает. {REJECTED_REASON}
                </p>
              )}
            </div>
          )}

          {state.step === 4 && (
            <div className="flex flex-col gap-4 text-sm">
              <p className="text-graphite-muted">
                Патч готов — прежде чем принять, прогоняем тесты и сверяем контракт.
              </p>
              <button
                type="button"
                onClick={() => setState((s) => ({ ...s, testsRun: true }))}
                className="self-start rounded-lg bg-ink px-4 py-2 font-medium text-ink-foreground transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
              >
                Запустить {TEST_COMMAND}
              </button>
              {state.testsRun && (
                <>
                  <CodeBlock label="вывод (демо, не реальный CI)">{TEST_OUTPUT}</CodeBlock>
                  <ul className="flex flex-col gap-1 text-graphite-muted">
                    <li>✓ Все существующие тесты прошли без изменений</li>
                    <li>✓ Новый тест на enterprise + 2 года прошёл</li>
                    <li>✓ Сигнатура calculateDiscount(customer, order): number не изменилась</li>
                  </ul>
                </>
              )}
            </div>
          )}

          {state.step === 5 && (
            <div className="flex flex-col gap-4 text-sm">
              <p className="rounded-lg border border-accent-change/40 bg-accent-change/5 p-4 text-accent-change">
                {CONDITIONS_CHANGED_PROMPT}
              </p>
              <p className="text-graphite-muted">Как это меняет твой подход?</p>
              <div className="flex flex-col gap-3">
                {CONDITIONS_CHOICES.map((c) => (
                  <label
                    key={c.id}
                    className={`flex cursor-pointer flex-col gap-1 rounded-lg border p-3 ${
                      state.conditionsChoice === c.id ? "border-ink bg-white" : "border-hairline bg-white/40"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="conditions"
                        checked={state.conditionsChoice === c.id}
                        onChange={() => setState((s) => ({ ...s, conditionsChoice: c.id }))}
                      />
                      <span className="font-medium">{c.label}</span>
                    </span>
                    {state.conditionsChoice === c.id && (
                      <span className="pl-6 text-graphite-muted">{c.consequence}</span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

          {state.step === 6 && (
            <DecisionTraceSummary state={state} setState={setState} />
          )}
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-hairline pt-5">
          <button
            type="button"
            onClick={back}
            disabled={state.step === 0}
            className="rounded-lg border border-hairline px-4 py-2 text-sm text-graphite-muted disabled:opacity-40"
          >
            ← Назад
          </button>
          {state.step < TOTAL_STEPS - 1 && (
            <button
              type="button"
              onClick={next}
              disabled={!canAdvance}
              className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-ink-foreground transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:hover:scale-100"
            >
              Дальше →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function DecisionTraceSummary({
  state,
  setState,
}: {
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
}) {
  const stage = state.submissionStage;
  const approach =
    state.patchChoice === "rejected"
      ? "Вариант B (DiscountResolver) — размечен как предпочтительный на этом шаге демо"
      : "Расширение существующей ветки enterprise в calculateDiscount";
  const rejected =
    state.patchChoice === "rejected"
      ? "Вариант A (расширение ветки) — отклонён в пользу структуры"
      : "DiscountResolver / реестр правил";

  return (
    <div className="flex flex-col gap-6 text-sm">
      <p className="text-graphite-muted">
        Собранный по твоим решениям разбор — так выглядит «Decision Trace» для этой задачи.
      </p>

      <dl className="grid gap-4 sm:grid-cols-2">
        <Field label="Задача">{TASK_GOAL}</Field>
        <Field label="Подход">{approach}</Field>
        <Field label="Отвергнутая альтернатива">{rejected}</Field>
        <Field label="Проверка">
          {state.testsRun ? "5/5 тестов зелёные, контракт не изменился" : "Ещё не запущена — вернись на шаг 5"}
        </Field>
        <Field label="Риск / ограничение">
          Если число измерений скидки продолжит расти, нужна будет структура правил, а не ветки.
        </Field>
        <Field label="Условие пересмотра">
          {state.conditionsChoice === "introduce-structure"
            ? "Уже наступило в этом демо: регион + дата контракта оправдали структуру."
            : "Появление региона и даты контракта как дополнительных измерений скидки."}
        </Field>
      </dl>

      <div className="rounded-xl border border-hairline bg-white/60 p-5">
        <h3 className="font-medium">Что дальше в реальном курсе: сдача → фидбек → доработка → принято</h3>
        <p className="mt-1 text-graphite-muted">
          В воркспейсе пилота это реальная сдача с версиями и фидбеком ментора. Здесь — демо-прогон
          того же цикла, явно помеченный как демо.
        </p>

        <div className="mt-4 flex flex-col gap-3">
          {stage === "not_started" && (
            <button
              type="button"
              onClick={() => setState((s) => ({ ...s, submissionStage: "submitted" }))}
              className="self-start rounded-lg bg-ink px-4 py-2 font-medium text-ink-foreground"
            >
              Отправить демо-сдачу
            </button>
          )}
          {stage !== "not_started" && (
            <div className="rounded-lg border border-hairline p-3">
              <span className="font-mono text-[10px] uppercase tracking-wide text-graphite-muted">
                Демо-сдача
              </span>
              <p className="mt-1">{DEMO_SUBMISSION_SUMMARY}</p>
            </div>
          )}

          {stage === "submitted" && (
            <button
              type="button"
              onClick={() => setState((s) => ({ ...s, submissionStage: "feedback_given" }))}
              className="self-start rounded-lg border border-hairline px-4 py-2 font-medium"
            >
              Запросить демо-фидбек ментора
            </button>
          )}
          {(stage === "feedback_given" || stage === "revised" || stage === "accepted") && (
            <div className="rounded-lg border border-system/40 bg-system/5 p-3">
              <span className="font-mono text-[10px] uppercase tracking-wide text-system">
                Демо-фидбек ментора
              </span>
              <p className="mt-1">{DEMO_MENTOR_FEEDBACK}</p>
            </div>
          )}

          {stage === "feedback_given" && (
            <button
              type="button"
              onClick={() => setState((s) => ({ ...s, submissionStage: "revised" }))}
              className="self-start rounded-lg border border-hairline px-4 py-2 font-medium"
            >
              Доработать демо-сдачу
            </button>
          )}
          {(stage === "revised" || stage === "accepted") && (
            <div className="rounded-lg border border-hairline p-3">
              <span className="font-mono text-[10px] uppercase tracking-wide text-graphite-muted">
                Доработка
              </span>
              <p className="mt-1">{DEMO_REVISION_NOTE}</p>
            </div>
          )}

          {stage === "revised" && (
            <button
              type="button"
              onClick={() => setState((s) => ({ ...s, submissionStage: "accepted" }))}
              className="self-start rounded-lg bg-signal px-4 py-2 font-medium text-signal-ink"
            >
              Отметить как принятое (демо)
            </button>
          )}
          {stage === "accepted" && (
            <div className="rounded-lg border border-signal/40 bg-signal/10 p-3 font-medium text-graphite">
              ✓ {DEMO_FINAL_STATE}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-hairline bg-white/60 p-3">
      <dt className="font-mono text-[10px] uppercase tracking-wide text-graphite-muted">{label}</dt>
      <dd className="mt-1">{children}</dd>
    </div>
  );
}
