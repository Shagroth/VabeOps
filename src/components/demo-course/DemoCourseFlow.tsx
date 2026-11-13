"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AGENT_PLAN,
  CONTRACT_FIELDS,
  CONTRACT_TEMPLATE,
  DEMO_COURSE_META,
  INCIDENT,
  MODE_SCENARIO,
  MODULE_STEPS,
  REVIEW_RISKS,
  RUBRIC,
  WEAK_REQUEST,
  WORK_MODES,
  formatContract,
  type AgentContract,
  type ContractKey,
} from "@/content/demo-course";
import { sendArtifactToSubmission, type WorkspaceFlowLinks } from "@/lib/artifact-bridge";

const STORAGE_KEY = "vabeops-module-contract-v2";
const LAST_STEP = MODULE_STEPS.length - 1;

type CourseState = {
  step: number;
  maxStepReached: number;
  incidentChoice: "tests" | "contract" | "model" | null;
  modeChoice: "chat" | "copilot" | "agent" | null;
  anatomySeen: ContractKey[];
  activeField: ContractKey;
  contract: AgentContract;
  reviewRisks: string[];
  reviewSubmitted: boolean;
  gateChoice: "approve" | "stop" | "expand" | null;
  reflection: string;
  finished: boolean;
};

const INITIAL_STATE: CourseState = {
  step: 0,
  maxStepReached: 0,
  incidentChoice: null,
  modeChoice: null,
  anatomySeen: [],
  activeField: "goal",
  contract: {
    goal: "",
    state: "",
    scope: "",
    constraints: "",
    permissions: "",
    done: "",
    stop: "",
  },
  reviewRisks: [],
  reviewSubmitted: false,
  gateChoice: null,
  reflection: "",
  finished: false,
};

function loadState(): CourseState {
  if (typeof window === "undefined") return INITIAL_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const saved = JSON.parse(raw) as Partial<CourseState>;
    return {
      ...INITIAL_STATE,
      ...saved,
      contract: { ...INITIAL_STATE.contract, ...saved.contract },
    };
  } catch {
    return INITIAL_STATE;
  }
}

export function DemoCourseFlow({ workspace }: { workspace?: WorkspaceFlowLinks } = {}) {
  const nextHref = workspace ? workspace.nextHref : "/demo-course/2";
  const nextLabel = workspace ? workspace.nextLabel ?? "К следующей неделе →" : "К модулю 2 →";
  const overviewHref = workspace ? workspace.overviewHref : "/demo-course";
  const [state, setState] = useState<CourseState>(INITIAL_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const lessonHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // localStorage is intentionally loaded after hydration to keep the server
    // render deterministic and avoid showing another participant's state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  useEffect(() => {
    if (hydrated) lessonHeading.current?.focus();
  }, [hydrated, state.step]);

  const completedFields = CONTRACT_FIELDS.filter(
    (field) => state.contract[field.key].trim().length >= 12,
  ).length;

  const correctRiskIds = REVIEW_RISKS.filter((risk) => risk.correct).map((risk) => risk.id);
  const reviewScore = correctRiskIds.filter((id) => state.reviewRisks.includes(id)).length;
  const selectedDecoy = state.reviewRisks.includes("persona");
  const contractText = useMemo(() => formatContract(state.contract), [state.contract]);

  const canAdvance = [
    state.incidentChoice !== null,
    state.modeChoice !== null,
    state.anatomySeen.length === CONTRACT_FIELDS.length,
    completedFields === CONTRACT_FIELDS.length,
    state.reviewSubmitted,
    state.gateChoice !== null,
    false,
  ][state.step];

  function goTo(step: number) {
    if (step > state.maxStepReached) return;
    setState((current) => ({ ...current, step }));
  }

  function next() {
    const target = Math.min(state.step + 1, LAST_STEP);
    setState((current) => ({
      ...current,
      step: target,
      maxStepReached: Math.max(current.maxStepReached, target),
    }));
  }

  function back() {
    setState((current) => ({ ...current, step: Math.max(0, current.step - 1) }));
  }

  function resetCourse() {
    window.localStorage.removeItem(STORAGE_KEY);
    setState(INITIAL_STATE);
    setCopyState("idle");
  }

  function exploreField(key: ContractKey) {
    setState((current) => ({
      ...current,
      activeField: key,
      anatomySeen: current.anatomySeen.includes(key)
        ? current.anatomySeen
        : [...current.anatomySeen, key],
    }));
  }

  function setContractField(key: ContractKey, value: string) {
    setState((current) => ({
      ...current,
      contract: { ...current.contract, [key]: value },
    }));
  }

  function toggleRisk(id: string) {
    setState((current) => ({
      ...current,
      reviewSubmitted: false,
      reviewRisks: current.reviewRisks.includes(id)
        ? current.reviewRisks.filter((risk) => risk !== id)
        : [...current.reviewRisks, id],
    }));
  }

  async function copyContract() {
    try {
      await navigator.clipboard.writeText(contractText);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  function downloadContract() {
    const blob = new Blob([contractText], { type: "text/markdown;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = "agent-task-contract.md";
    anchor.click();
    URL.revokeObjectURL(href);
  }

  if (!hydrated) {
    return <div className="min-h-[720px] rounded-[28px] border border-hairline bg-white/30" />;
  }

  const progress = state.finished ? 100 : Math.round(((state.maxStepReached + 1) / MODULE_STEPS.length) * 100);

  return (
    <div className="overflow-hidden rounded-[28px] border border-hairline bg-[#f3f4ef] shadow-[0_30px_80px_-55px_rgba(10,15,24,0.55)]">
      <div className="grid min-h-[760px] min-w-0 lg:grid-cols-[286px_minmax(0,1fr)]">
        <aside className="min-w-0 border-b border-hairline bg-ink text-ink-foreground lg:border-b-0 lg:border-r lg:border-hairline-ink">
          <div className="lg:sticky lg:top-[73px]">
            <div className="border-b border-hairline-ink p-5 lg:p-6">
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-system">
                  Field course / 01
                </span>
                <span className="font-mono text-[10px] text-ink-muted">{progress}%</span>
              </div>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-signal transition-[width] duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <h2 className="mt-5 text-xl font-medium leading-tight">{DEMO_COURSE_META.title}</h2>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                На выходе — контракт для живой задачи. Сертификат прод не спасает.
              </p>
            </div>

            <nav className="min-w-0 overflow-x-auto p-3 lg:max-h-[500px] lg:overflow-y-auto lg:p-4" aria-label="Навигация по модулю">
              <ol className="flex min-w-max gap-2 lg:min-w-0 lg:flex-col">
                {MODULE_STEPS.map((item, index) => {
                  const active = index === state.step;
                  const reachable = index <= state.maxStepReached;
                  const passed = index < state.maxStepReached || state.finished;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        disabled={!reachable}
                        onClick={() => goTo(index)}
                        aria-current={active ? "step" : undefined}
                        className={`group flex w-[210px] items-start gap-3 rounded-xl border px-3 py-3 text-left transition-colors lg:w-full ${
                          active
                            ? "border-system/60 bg-system/10"
                            : reachable
                              ? "border-transparent hover:border-hairline-ink hover:bg-white/[0.03]"
                              : "border-transparent opacity-35"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full border font-mono text-[9px] ${
                            passed
                              ? "border-signal bg-signal text-signal-ink"
                              : active
                                ? "border-system text-system"
                                : "border-hairline-ink text-ink-muted"
                          }`}
                        >
                          {passed ? "✓" : item.index}
                        </span>
                        <span>
                          <span className="block text-xs font-medium text-ink-foreground">{item.label}</span>
                          <span className="mt-0.5 block text-[11px] leading-snug text-ink-muted">{item.short}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>

            <div className="hidden border-t border-hairline-ink p-6 lg:block">
              <button
                type="button"
                onClick={resetCourse}
                className="font-mono text-[10px] uppercase tracking-wide text-ink-muted underline underline-offset-4 hover:text-ink-foreground"
              >
                Сбросить прогресс
              </button>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col">
          <div className="flex items-center justify-between border-b border-hairline px-5 py-3 sm:px-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-graphite-muted">
              {DEMO_COURSE_META.duration} · прогресс хранится в браузере
            </span>
            <button
              type="button"
              onClick={resetCourse}
              className="text-xs text-graphite-muted underline underline-offset-4 lg:hidden"
            >
              Сбросить
            </button>
          </div>

          <div className="flex-1 px-5 py-8 sm:px-8 sm:py-10 xl:px-12 xl:py-12">
            <div className="mx-auto max-w-[920px]">
              {state.step === 0 && (
                <Lesson
                  headingRef={lessonHeading}
                  kicker="00 / Cold open"
                  title="Агент всё сделал. Прод всё равно сломан."
                  lead="Зелёные тесты иногда доказывают лишь одно: агент успел переписать и код, и правила победы. Начнём не с терминов, а с инцидента, который слишком легко представить настоящим."
                >
                  <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-2xl border border-hairline bg-white/70 p-5">
                      <Label>Тикет / 09:12</Label>
                      <p className="mt-3 text-lg font-medium leading-snug">{INCIDENT.ticket}</p>
                      <div className="mt-6 rounded-xl bg-ink p-4 text-sm text-ink-foreground">
                        <span className="font-mono text-[10px] uppercase tracking-wide text-signal">Agent / 09:18</span>
                        <p className="mt-2 leading-relaxed text-ink-muted">{INCIDENT.agentReport}</p>
                      </div>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl border border-accent-change/30 bg-accent-change/[0.06] p-5">
                      <div className="absolute right-5 top-4 font-mono text-5xl text-accent-change/10">!</div>
                      <Label tone="danger">Incident report / 09:31</Label>
                      <ul className="mt-4 space-y-3 text-sm">
                        {INCIDENT.damage.map((item, index) => (
                          <li key={item} className="flex gap-3">
                            <span className="font-mono text-xs text-accent-change">0{index + 1}</span>
                            <span className="text-graphite-muted">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Question title="Где произошла главная ошибка?">
                    {[
                      { id: "tests" as const, label: "Нужно было написать больше тестов" },
                      { id: "contract" as const, label: "До запуска не зафиксировали неизменяемый контракт" },
                      { id: "model" as const, label: "Выбрали недостаточно сильную модель" },
                    ].map((choice) => (
                      <ChoiceButton
                        key={choice.id}
                        selected={state.incidentChoice === choice.id}
                        onClick={() => setState((current) => ({ ...current, incidentChoice: choice.id }))}
                      >
                        {choice.label}
                      </ChoiceButton>
                    ))}
                    {state.incidentChoice && (
                      <Feedback good={state.incidentChoice === "contract"}>
                        {state.incidentChoice === "contract"
                          ? INCIDENT.lesson
                          : "Это могло усилить защиту, но не устраняет первопричину: мерка успеха и неизменяемая граница задачи не были названы до старта."}
                      </Feedback>
                    )}
                  </Question>
                </Lesson>
              )}

              {state.step === 1 && (
                <Lesson
                  headingRef={lessonHeading}
                  kicker="01 / Operating modes"
                  title="Не каждой задаче нужен агент с доступом к кнопкам"
                  lead="Чат, copilot и агент могут выглядеть похоже. Но цена ошибки у них разная: один советует, другой действует в твоей среде. Режим выбирают по риску и нужной автономности, а не по моде."
                >
                  <div className="grid gap-3 md:grid-cols-3">
                    {WORK_MODES.map((mode, index) => (
                      <article key={mode.id} className="rounded-2xl border border-hairline bg-white/60 p-5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-graphite-muted">0{index + 1}</span>
                          <span className={`h-2 w-2 rounded-full ${mode.id === "agent" ? "bg-signal" : mode.id === "copilot" ? "bg-system" : "bg-hairline"}`} />
                        </div>
                        <h3 className="mt-7 text-xl font-medium">{mode.title}</h3>
                        <p className="mt-2 font-mono text-[11px] text-system">{mode.command}</p>
                        <p className="mt-5 text-xs font-medium">{mode.autonomy}</p>
                        <p className="mt-2 text-sm leading-relaxed text-graphite-muted">{mode.useWhen}</p>
                      </article>
                    ))}
                  </div>

                  <Question title="Какой режим нужен здесь?" description={MODE_SCENARIO}>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {WORK_MODES.map((mode) => (
                        <ChoiceButton
                          key={mode.id}
                          selected={state.modeChoice === mode.id}
                          onClick={() => setState((current) => ({ ...current, modeChoice: mode.id }))}
                        >
                          {mode.title}
                        </ChoiceButton>
                      ))}
                    </div>
                    {state.modeChoice && (
                      <Feedback good={state.modeChoice === "agent"}>
                        {state.modeChoice === "agent"
                          ? "Да. Здесь есть несколько шагов, работа в среде и проверяемый результат. Но право записи остаётся за review gate: автономность — не абонемент на всё."
                          : "Чат или copilot помогут на отдельном шаге. Но здесь нужен цельный цикл: исследовать несколько файлов, собрать гипотезу и вернуть план до записи."}
                      </Feedback>
                    )}
                  </Question>
                </Lesson>
              )}

              {state.step === 2 && (
                <Lesson
                  headingRef={lessonHeading}
                  kicker="02 / Contract anatomy"
                  title="Семь полей вместо надежды на телепатию"
                  lead="Хороший контракт не диктует агенту каждый шаг. Он фиксирует цель, границы, права и доказательства готовности — то, что опасно оставлять на догадки. Открой все семь полей."
                >
                  <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
                    <div className="space-y-2">
                      {CONTRACT_FIELDS.map((field) => {
                        const active = state.activeField === field.key;
                        const seen = state.anatomySeen.includes(field.key);
                        return (
                          <button
                            key={field.key}
                            type="button"
                            onClick={() => exploreField(field.key)}
                            className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${active ? "border-system bg-system/[0.07]" : "border-hairline bg-white/50 hover:bg-white"}`}
                          >
                            <span className={`flex h-7 w-7 flex-none items-center justify-center rounded-full font-mono text-[10px] ${seen ? "bg-signal text-signal-ink" : "border border-hairline text-graphite-muted"}`}>
                              {seen ? "✓" : field.number}
                            </span>
                            <span className="text-sm font-medium">{field.title}</span>
                          </button>
                        );
                      })}
                    </div>

                    {CONTRACT_FIELDS.map((field) =>
                      field.key === state.activeField ? (
                        <div key={field.key} className="relative min-h-[360px] overflow-hidden rounded-2xl bg-ink p-6 text-ink-foreground sm:p-8">
                          <div className="signal-field opacity-30" />
                          <div className="relative">
                            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-system">Поле {field.number}</span>
                            <h3 className="mt-3 text-3xl font-medium">{field.title}</h3>
                            <p className="mt-5 max-w-[45ch] text-base leading-relaxed text-ink-muted">{field.prompt}</p>
                            <div className="mt-10 border-l border-accent-change pl-4">
                              <span className="font-mono text-[10px] uppercase tracking-wide text-accent-change">Антипаттерн</span>
                              <p className="mt-2 text-sm text-ink-muted">{field.antiPattern}</p>
                            </div>
                            <div className="mt-10 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wide text-ink-muted">
                              <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                              Изучено {state.anatomySeen.length} / {CONTRACT_FIELDS.length}
                            </div>
                          </div>
                        </div>
                      ) : null,
                    )}
                  </div>
                </Lesson>
              )}

              {state.step === 3 && (
                <Lesson
                  headingRef={lessonHeading}
                  kicker="03 / Contract lab"
                  title="Теперь преврати свою задачу в контракт"
                  lead="Возьми рабочую задачу, которую действительно готов отдать агенту. Если такой сейчас нет, загрузи учебный пример. Черновик останется только в этом браузере."
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-system/25 bg-system/[0.05] p-4">
                    <div>
                      <p className="text-sm font-medium">Нужен быстрый старт?</p>
                      <p className="mt-1 text-xs text-graphite-muted">Подставим кейс со скидками — каждое поле можно переписать.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setState((current) => ({ ...current, contract: CONTRACT_TEMPLATE }))}
                      className="rounded-lg bg-ink px-4 py-2 text-xs font-medium text-ink-foreground"
                    >
                      Загрузить учебный кейс
                    </button>
                  </div>

                  <div className="mt-5 space-y-4">
                    {CONTRACT_FIELDS.map((field) => {
                      const value = state.contract[field.key];
                      const ready = value.trim().length >= 12;
                      return (
                        <label key={field.key} className="block rounded-2xl border border-hairline bg-white/60 p-5 focus-within:border-system">
                          <span className="flex items-center justify-between gap-4">
                            <span className="text-sm font-medium">{field.number}. {field.title}</span>
                            <span className={`font-mono text-[9px] uppercase tracking-wide ${ready ? "text-signal-ink" : "text-graphite-muted"}`}>
                              {ready ? "готово" : "нужно заполнить"}
                            </span>
                          </span>
                          <span className="mt-1 block text-xs text-graphite-muted">{field.prompt}</span>
                          <textarea
                            value={value}
                            onChange={(event) => setContractField(field.key, event.target.value)}
                            rows={3}
                            className="mt-4 w-full resize-y rounded-xl border border-hairline bg-[#fbfcf8] px-4 py-3 text-sm leading-relaxed outline-none transition-colors placeholder:text-graphite-muted/50 focus:border-system"
                            placeholder={`Напиши: ${field.prompt.toLowerCase()}`}
                          />
                        </label>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-xl bg-ink px-4 py-3 text-sm text-ink-foreground">
                    <span>Контракт собран</span>
                    <span className="font-mono text-signal">{completedFields} / {CONTRACT_FIELDS.length}</span>
                  </div>
                </Lesson>
              )}

              {state.step === 4 && (
                <Lesson
                  headingRef={lessonHeading}
                  kicker="04 / Red team"
                  title="Красная команда: сломай задачу до запуска"
                  lead="На минуту перестань улучшать формулировку. Ищи лишнюю свободу, конфликт и лазейку, через которые агент сможет сделать не то — формально оставаясь правым."
                >
                  <div className="overflow-hidden rounded-2xl border border-hairline bg-white/70">
                    <div className="flex items-center gap-2 border-b border-hairline px-4 py-3">
                      <span className="h-2 w-2 rounded-full bg-accent-change" />
                      <span className="h-2 w-2 rounded-full bg-[#e9c85d]" />
                      <span className="h-2 w-2 rounded-full bg-signal" />
                      <span className="ml-2 font-mono text-[10px] text-graphite-muted">task.md / weak</span>
                    </div>
                    <pre className="whitespace-pre-wrap p-6 font-mono text-sm leading-relaxed text-graphite">{WEAK_REQUEST}</pre>
                  </div>

                  <Question title="Какие риски здесь действительно есть?" description="Можно выбрать несколько вариантов.">
                    <div className="space-y-2">
                      {REVIEW_RISKS.map((risk) => (
                        <label key={risk.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-hairline bg-white/60 p-4 hover:bg-white">
                          <input
                            type="checkbox"
                            checked={state.reviewRisks.includes(risk.id)}
                            onChange={() => toggleRisk(risk.id)}
                            className="mt-0.5"
                          />
                          <span className="text-sm">{risk.label}</span>
                        </label>
                      ))}
                    </div>
                    <button
                      type="button"
                      disabled={state.reviewRisks.length === 0}
                      onClick={() => setState((current) => ({ ...current, reviewSubmitted: true }))}
                      className="mt-3 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-ink-foreground disabled:opacity-40"
                    >
                      Проверить разбор
                    </button>
                    {state.reviewSubmitted && (
                      <Feedback good={reviewScore === correctRiskIds.length && !selectedDecoy}>
                        Ты нашёл {reviewScore} из {correctRiskIds.length} реальных рисков. Роль «senior» не создаёт границ и не заменяет проверяемый контракт — это декоративная уверенность, а не guardrail.
                      </Feedback>
                    )}
                  </Question>
                </Lesson>
              )}

              {state.step === 5 && (
                <Lesson
                  headingRef={lessonHeading}
                  kicker="05 / Review gate"
                  title="Агент вернулся с планом. Что разрешаем?"
                  lead="Контракт не превращает инженера в наблюдателя. Он создаёт моменты, где решение снова принадлежит человеку — до необратимого действия, а не после."
                >
                  <div className="rounded-2xl bg-ink p-5 text-ink-foreground sm:p-7">
                    <div className="flex items-center justify-between border-b border-hairline-ink pb-4">
                      <Label tone="system">Agent plan / waiting for approval</Label>
                      <span className="rounded-full border border-signal/40 px-2.5 py-1 font-mono text-[9px] uppercase text-signal">paused</span>
                    </div>
                    <ol className="mt-6 space-y-4">
                      {AGENT_PLAN.map((item, index) => (
                        <li key={item} className="flex gap-4 text-sm">
                          <span className="font-mono text-[10px] text-system">0{index + 1}</span>
                          <span className="text-ink-muted">{item}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <Question title="Твоё решение">
                    {[
                      { id: "approve" as const, title: "Разрешить план", detail: "Он остаётся внутри scope и останавливается перед записью." },
                      { id: "stop" as const, title: "Остановить задачу", detail: "Любая автономная работа здесь слишком рискованна." },
                      { id: "expand" as const, title: "Сразу дать весь репозиторий", detail: "Так агент точно не упустит контекст." },
                    ].map((choice) => (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() => setState((current) => ({ ...current, gateChoice: choice.id }))}
                        className={`block w-full rounded-xl border p-4 text-left transition-colors ${state.gateChoice === choice.id ? "border-system bg-system/[0.07]" : "border-hairline bg-white/50 hover:bg-white"}`}
                      >
                        <span className="text-sm font-medium">{choice.title}</span>
                        <span className="mt-1 block text-xs text-graphite-muted">{choice.detail}</span>
                      </button>
                    ))}
                    {state.gateChoice && (
                      <Feedback good={state.gateChoice === "approve"}>
                        {state.gateChoice === "approve"
                          ? "Верно. План соответствует контракту, а точка подтверждения стоит перед записью. Можно разрешить этот ограниченный следующий шаг."
                          : "Это либо тормоз на ровном месте, либо открытая дверь во весь репозиторий. Хороший guardrail не мешает работе — он контролирует следующий рискованный переход."}
                      </Feedback>
                    )}
                  </Question>
                </Lesson>
              )}

              {state.step === 6 && (
                <Lesson
                  headingRef={lessonHeading}
                  kicker="06 / Takeaway"
                  title="Контракт готов. Пора столкнуть его с реальностью."
                  lead="Это не священный шаблон на все случаи. Это минимальная инженерная память задачи: чего хотим, где границы, чем рискуем и как докажем, что закончили."
                >
                  <div className="grid min-w-0 gap-5 xl:grid-cols-[1.15fr_0.85fr]">
                    <div className="min-w-0 overflow-hidden rounded-2xl border border-hairline bg-ink text-ink-foreground">
                      <div className="flex items-center justify-between border-b border-hairline-ink px-4 py-3">
                        <span className="font-mono text-[10px] text-ink-muted">agent-task-contract.md</span>
                        <span className="font-mono text-[9px] uppercase text-signal">ready</span>
                      </div>
                      <pre className="max-h-[540px] min-w-0 overflow-auto whitespace-pre-wrap break-all p-5 font-mono text-[11px] leading-relaxed text-ink-muted sm:p-6">{contractText}</pre>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-2xl border border-hairline bg-white/60 p-5">
                        <Label>Self-check / 6 критериев</Label>
                        <ul className="mt-4 space-y-3">
                          {RUBRIC.map((item) => (
                            <li key={item} className="flex gap-3 text-xs leading-relaxed text-graphite-muted">
                              <span className="mt-0.5 flex h-4 w-4 flex-none items-center justify-center rounded-full bg-signal text-[9px] text-signal-ink">✓</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <label className="block rounded-2xl border border-hairline bg-white/60 p-5">
                        <span className="text-sm font-medium">Одна мысль после модуля</span>
                        <span className="mt-1 block text-xs text-graphite-muted">Что изменишь перед следующим запуском агента?</span>
                        <textarea
                          value={state.reflection}
                          onChange={(event) => setState((current) => ({ ...current, reflection: event.target.value }))}
                          rows={4}
                          className="mt-4 w-full resize-y rounded-xl border border-hairline bg-[#fbfcf8] px-3 py-3 text-sm outline-none focus:border-system"
                          placeholder="Перед запуском я…"
                        />
                      </label>

                      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                        <button type="button" onClick={copyContract} className="rounded-xl bg-ink px-4 py-3 text-sm font-medium text-ink-foreground">
                          {copyState === "copied" ? "Скопировано ✓" : copyState === "failed" ? "Не удалось скопировать" : "Скопировать контракт"}
                        </button>
                        <button type="button" onClick={downloadContract} className="rounded-xl border border-hairline bg-white/70 px-4 py-3 text-sm font-medium">
                          Скачать .md
                        </button>
                        {workspace && (
                          <button type="button" onClick={() => sendArtifactToSubmission(contractText)} className="rounded-xl border border-system/40 bg-system/[0.06] px-4 py-3 text-sm font-medium sm:col-span-2 xl:col-span-1">
                            Перенести в сдачу ↓
                          </button>
                        )}
                      </div>

                      {state.finished ? (
                        <div className="rounded-2xl border border-signal/50 bg-signal/10 p-5">
                          <span className="font-mono text-[10px] uppercase tracking-wide text-signal-ink">Модуль завершён</span>
                          <p className="mt-2 text-sm text-graphite-muted">Артефакт сохранён. Следующий модуль — как давать модели достаточно контекста, не вываливая на неё цифровой чердак.</p>
                          <div className="mt-4 flex flex-wrap gap-3">
                            {nextHref && (
                              <Link href={nextHref} className="rounded-lg bg-ink px-4 py-2 text-xs font-medium text-ink-foreground">
                                {nextLabel}
                              </Link>
                            )}
                            <Link href={overviewHref} className="px-2 py-2 text-xs text-graphite-muted underline underline-offset-4">
                              Вся программа
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setState((current) => ({ ...current, finished: true }))}
                          className="w-full rounded-xl bg-signal px-4 py-3 text-sm font-medium text-signal-ink"
                        >
                          Завершить модуль
                        </button>
                      )}
                    </div>
                  </div>
                </Lesson>
              )}
            </div>
          </div>

          <footer className="border-t border-hairline bg-white/40 px-5 py-4 sm:px-8">
            <div className="mx-auto flex max-w-[920px] items-center justify-between gap-4">
              <button
                type="button"
                onClick={back}
                disabled={state.step === 0}
                className="rounded-lg border border-hairline bg-white/60 px-4 py-2 text-sm text-graphite-muted disabled:opacity-30"
              >
                ← Назад
              </button>
              <span className="hidden font-mono text-[10px] uppercase tracking-wide text-graphite-muted sm:block">
                {MODULE_STEPS[state.step].index} / 06
              </span>
              {state.step < LAST_STEP ? (
                <button
                  type="button"
                  onClick={next}
                  disabled={!canAdvance}
                  className="rounded-lg bg-ink px-5 py-2 text-sm font-medium text-ink-foreground transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
                >
                  Продолжить →
                </button>
              ) : (
                <span className="text-sm text-graphite-muted">Финал модуля</span>
              )}
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

function Lesson({
  headingRef,
  kicker,
  title,
  lead,
  children,
}: {
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  kicker: string;
  title: string;
  lead: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-system">{kicker}</span>
      <h2 ref={headingRef} tabIndex={-1} className="mt-3 max-w-[22ch] text-3xl font-semibold leading-[1.08] tracking-tight outline-none sm:text-[2.65rem]">
        {title}
      </h2>
      <p className="mt-5 max-w-[68ch] text-base leading-relaxed text-graphite-muted">{lead}</p>
      <div className="mt-9">{children}</div>
    </section>
  );
}

function Label({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "danger" | "system" }) {
  const color = tone === "danger" ? "text-accent-change" : tone === "system" ? "text-system" : "text-graphite-muted";
  return <span className={`font-mono text-[10px] uppercase tracking-[0.18em] ${color}`}>{children}</span>;
}

function Question({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 rounded-2xl border border-hairline bg-white/50 p-5 sm:p-6">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-system">Твоя очередь</span>
      <h3 className="mt-2 text-lg font-medium">{title}</h3>
      {description && <p className="mt-2 text-sm leading-relaxed text-graphite-muted">{description}</p>}
      <div className="mt-5 space-y-2">{children}</div>
    </div>
  );
}

function ChoiceButton({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`block w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors ${selected ? "border-system bg-system/[0.08]" : "border-hairline bg-white/60 hover:bg-white"}`}
    >
      <span className="flex items-center gap-3">
        <span className={`h-2.5 w-2.5 flex-none rounded-full border ${selected ? "border-system bg-system" : "border-graphite-muted/40"}`} />
        {children}
      </span>
    </button>
  );
}

function Feedback({ good, children }: { good: boolean; children: React.ReactNode }) {
  return (
    <div className={`mt-4 rounded-xl border p-4 text-sm leading-relaxed ${good ? "border-signal/50 bg-signal/10 text-graphite" : "border-accent-change/40 bg-accent-change/[0.06] text-graphite-muted"}`}>
      <span className={`mr-2 font-mono text-[10px] uppercase tracking-wide ${good ? "text-signal-ink" : "text-accent-change"}`}>
        {good ? "Верно" : "Посмотри глубже"}
      </span>
      {children}
    </div>
  );
}
