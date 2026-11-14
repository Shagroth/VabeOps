"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AGENT_PLAN,
  CONTRACT_FIELDS,
  ROLE_CONTRACT_TEMPLATES,
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
import { useFunnel, type FunnelTarget } from "./useFunnel";
import {
  BTN,
  CARD,
  CARD_DARK,
  Checklist,
  ChoiceButton,
  Feedback,
  FIELD,
  FileCard,
  FlowPlaceholder,
  FlowShell,
  LabField,
  LabProgress,
  Label,
  Lesson,
  Question,
} from "./flow-ui";
import { ENGINEER_ROLE_LABEL } from "@/content/engineer-roles";

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

export function DemoCourseFlow({ workspace, track }: { workspace?: WorkspaceFlowLinks; track?: FunnelTarget } = {}) {
  const mark = useFunnel(track);
  const nextHref = workspace ? workspace.nextHref : "/demo-course/2";
  const nextLabel = workspace ? workspace.nextLabel ?? "К следующей неделе →" : "К модулю 2 →";
  const overviewHref = workspace ? workspace.overviewHref : "/demo-course";
  const [state, setState] = useState<CourseState>(INITIAL_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const lessonHeading = useRef<HTMLHeadingElement>(null);
  const focusReady = useRef(false);

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
    if (!hydrated) return;
    // Skip the first run: focusing the heading on page load would scroll
    // the visitor past the module hero. Later step changes do move focus.
    if (!focusReady.current) {
      focusReady.current = true;
      return;
    }
    lessonHeading.current?.focus();
  }, [hydrated, state.step]);

  useEffect(() => {
    if (!hydrated) return;
    mark("open");
    if (state.maxStepReached >= 3) mark("lab");
    if (state.maxStepReached >= LAST_STEP) mark("artifact");
    if (state.finished) mark("finished");
  }, [hydrated, mark, state.maxStepReached, state.finished]);

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
      mark("export");
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
    mark("export");
    URL.revokeObjectURL(href);
  }

  if (!hydrated) return <FlowPlaceholder />;

  return (
    <FlowShell
      eyebrow="Модуль 01"
      title={DEMO_COURSE_META.title}
      note="На выходе — контракт для живой задачи. Сертификат прод не спасает."
      steps={MODULE_STEPS}
      step={state.step}
      maxStepReached={state.maxStepReached}
      finished={state.finished}
      topNote={`${DEMO_COURSE_META.duration} · прогресс хранится в браузере`}
      canAdvance={canAdvance}
      onGoTo={goTo}
      onBack={back}
      onNext={next}
      onReset={resetCourse}
    >
      {state.step === 0 && (
        <Lesson
          headingRef={lessonHeading}
          kicker="00 / Cold open"
          title="Агент всё сделал. Прод всё равно сломан."
          lead="Зелёные тесты иногда доказывают лишь одно: агент успел переписать и код, и правила победы. Начнём не с терминов, а с инцидента, который слишком легко представить настоящим."
        >
          <div className="grid gap-5 xl:grid-cols-2">
            <div className={`flex flex-col ${CARD}`}>
              <Label>Тикет · 09:12</Label>
              <p className="mt-4 text-[22px] font-bold leading-snug tracking-[-0.015em]">{INCIDENT.ticket}</p>
              <div className="mt-auto pt-7">
                <div className="rounded-[18px] bg-ink p-5 text-ink-foreground">
                  <span className="font-mono text-[13px] text-system">agent · 09:18</span>
                  <p className="mt-2 leading-relaxed text-ink-muted">{INCIDENT.agentReport}</p>
                </div>
              </div>
            </div>
            <div className={CARD}>
              <Label tone="danger">Incident report · 09:31</Label>
              <ul className="mt-2">
                {INCIDENT.damage.map((item, index) => (
                  <li key={item} className="grid grid-cols-[36px_1fr] gap-x-3 border-b border-hairline py-4 last:border-b-0 last:pb-0">
                    <span className="font-mono text-[15px] text-string">0{index + 1}</span>
                    <span className="leading-relaxed">{item}</span>
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
          <div className="grid gap-4 md:grid-cols-3">
            {WORK_MODES.map((mode, index) => {
              const agent = mode.id === "agent";
              return (
                <article key={mode.id} className={`flex flex-col ${agent ? CARD_DARK : CARD}`}>
                  <span className={`font-mono text-[15px] ${agent ? "text-system" : "text-string"}`}>0{index + 1}</span>
                  <h3 className="mt-6 text-[28px] font-extrabold leading-none tracking-[-0.03em]">{mode.title}</h3>
                  <p className={`mt-3 font-mono text-[13px] ${agent ? "text-system" : "text-graphite-muted"}`}>{mode.command}</p>
                  <p className="mt-6 text-[15px] font-semibold">{mode.autonomy}</p>
                  <p className={`mt-2 text-[15px] leading-relaxed ${agent ? "text-ink-muted" : "text-graphite-soft"}`}>{mode.useWhen}</p>
                </article>
              );
            })}
          </div>

          <Question title="Какой режим нужен здесь?" description={MODE_SCENARIO}>
            <div className="grid gap-2.5 sm:grid-cols-3">
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
            <div className="border-t-[1.5px] border-graphite">
              {CONTRACT_FIELDS.map((field) => {
                const active = state.activeField === field.key;
                const seen = state.anatomySeen.includes(field.key);
                return (
                  <button
                    key={field.key}
                    type="button"
                    onClick={() => exploreField(field.key)}
                    aria-pressed={active}
                    className={`kg-row flex min-h-14 w-full items-center gap-4 border-b border-hairline px-3 text-left transition-colors duration-200 ${active ? "bg-sky-tint" : "hover:bg-paper"}`}
                  >
                    <span className="font-mono text-[15px] text-string">{field.number}</span>
                    <span className="kg-row-title flex-1 text-lg font-bold tracking-[-0.01em]">{field.title}</span>
                    <span className={`font-mono text-xs ${seen ? "text-sky-deep" : "text-graphite-muted"}`}>
                      {seen ? "открыто" : "открыть"}
                    </span>
                  </button>
                );
              })}
            </div>

            {CONTRACT_FIELDS.map((field) =>
              field.key === state.activeField ? (
                <FileCard key={field.key} name="agent-task-contract.md" status={`поле ${field.number}`} className="kg-rise min-h-[380px]">
                  <div className="pb-8 pr-6 sm:pr-8">
                    <h3 className="mt-2 text-[34px] font-extrabold leading-none tracking-[-0.03em]">{field.title}</h3>
                    <p className="mt-5 max-w-[45ch] text-[17px] leading-relaxed text-ink-muted">{field.prompt}</p>
                    <div className="mt-8 border-t border-ink-line pt-5">
                      <span className="font-mono text-[13px] uppercase tracking-[0.08em] text-system">Антипаттерн</span>
                      <p className="mt-2 leading-relaxed">{field.antiPattern}</p>
                    </div>
                    <p className="mt-8 font-mono text-[13px] text-ink-muted" role="status">
                      Изучено {state.anatomySeen.length} / {CONTRACT_FIELDS.length}
                    </p>
                  </div>
                </FileCard>
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
          <div className="rounded-[24px] bg-sky-tint p-6">
            <p className="text-lg font-bold tracking-[-0.01em]">Нужен быстрый старт?</p>
            <p className="mt-1 text-[15px] text-graphite-soft">
              Загрузи учебный контракт по своей роли и перепиши его под настоящую задачу. Каждое поле редактируется.
            </p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {ROLE_CONTRACT_TEMPLATES.map((template) => (
                <button
                  key={template.role}
                  type="button"
                  onClick={() => setState((current) => ({ ...current, contract: template.contract }))}
                  className="kg-btn flex min-h-14 flex-col items-start justify-center rounded-[18px] border-[1.5px] border-graphite bg-white px-4 py-2.5 text-left hover:bg-ink hover:text-ink-foreground"
                >
                  <span className="font-mono text-xs uppercase tracking-[0.08em] opacity-70">{ENGINEER_ROLE_LABEL[template.role]}</span>
                  <span className="font-semibold leading-snug">{template.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {CONTRACT_FIELDS.map((field) => {
              const value = state.contract[field.key];
              return (
                <LabField
                  key={field.key}
                  title={`${field.number}. ${field.title}`}
                  prompt={field.prompt}
                  value={value}
                  ready={value.trim().length >= 12}
                  placeholder={`Напиши: ${field.prompt.toLowerCase()}`}
                  onChange={(next) => setContractField(field.key, next)}
                />
              );
            })}
          </div>

          <LabProgress label="Контракт собран" done={completedFields} total={CONTRACT_FIELDS.length} />
        </Lesson>
      )}

      {state.step === 4 && (
        <Lesson
          headingRef={lessonHeading}
          kicker="04 / Red team"
          title="Красная команда: сломай задачу до запуска"
          lead="На минуту перестань улучшать формулировку. Ищи лишнюю свободу, конфликт и лазейку, через которые агент сможет сделать не то — формально оставаясь правым."
        >
          <div className={CARD}>
            <Label>task.md · слабая постановка</Label>
            <pre className="mt-4 whitespace-pre-wrap font-mono text-[17px] leading-relaxed">{WEAK_REQUEST}</pre>
          </div>

          <Question title="Какие риски здесь действительно есть?" description="Можно выбрать несколько вариантов.">
            <div className="space-y-2.5">
              {REVIEW_RISKS.map((risk) => {
                const checked = state.reviewRisks.includes(risk.id);
                return (
                  <label
                    key={risk.id}
                    className={`flex min-h-14 cursor-pointer items-center gap-3.5 rounded-[18px] border-[1.5px] px-5 py-3.5 transition-colors duration-200 ${
                      checked ? "border-signal bg-sky-tint" : "border-hairline-strong bg-white hover:border-graphite"
                    }`}
                  >
                    <input type="checkbox" checked={checked} onChange={() => toggleRisk(risk.id)} className="h-5 w-5 flex-none accent-signal" />
                    <span className="font-semibold leading-snug">{risk.label}</span>
                  </label>
                );
              })}
            </div>
            <button
              type="button"
              disabled={state.reviewRisks.length === 0}
              onClick={() => setState((current) => ({ ...current, reviewSubmitted: true }))}
              className={`mt-3 ${BTN.dark}`}
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
          <FileCard name="agent plan · waiting for approval" status="paused">
            <ol className="pb-7 pr-6 sm:pr-8">
              {AGENT_PLAN.map((item, index) => (
                <li key={item} className="grid grid-cols-[36px_1fr] gap-x-3 border-t border-ink-line py-4 last:pb-0">
                  <span className="font-mono text-[15px] text-system">0{index + 1}</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ol>
          </FileCard>

          <Question title="Твоё решение">
            {[
              { id: "approve" as const, title: "Разрешить план", detail: "Он остаётся внутри scope и останавливается перед записью." },
              { id: "stop" as const, title: "Остановить задачу", detail: "Любая автономная работа здесь слишком рискованна." },
              { id: "expand" as const, title: "Сразу дать весь репозиторий", detail: "Так агент точно не упустит контекст." },
            ].map((choice) => (
              <ChoiceButton
                key={choice.id}
                selected={state.gateChoice === choice.id}
                detail={choice.detail}
                onClick={() => setState((current) => ({ ...current, gateChoice: choice.id }))}
              >
                {choice.title}
              </ChoiceButton>
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
            <FileCard name="agent-task-contract.md" status="ready" className="self-start">
              <pre className="max-h-[540px] min-w-0 overflow-auto whitespace-pre-wrap break-words pb-7 pr-6 font-mono text-sm leading-relaxed text-ink-muted">{contractText}</pre>
            </FileCard>

            <div className="space-y-4">
              <div className={CARD}>
                <Label>Self-check · 6 критериев</Label>
                <Checklist items={RUBRIC} />
              </div>

              <label className={`block ${CARD}`}>
                <span className="text-lg font-bold tracking-[-0.01em]">Одна мысль после модуля</span>
                <span className="mt-1.5 block text-[15px] text-graphite-soft">Что изменишь перед следующим запуском агента?</span>
                <textarea
                  value={state.reflection}
                  onChange={(event) => setState((current) => ({ ...current, reflection: event.target.value }))}
                  rows={4}
                  className={`mt-4 ${FIELD}`}
                  placeholder="Перед запуском я…"
                />
              </label>

              <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-1">
                <button type="button" onClick={copyContract} className={BTN.dark}>
                  {copyState === "copied" ? "Скопировано ✓" : copyState === "failed" ? "Не удалось скопировать" : "Скопировать контракт"}
                </button>
                <button type="button" onClick={downloadContract} className={BTN.outline}>
                  Скачать .md
                </button>
                {workspace && (
                  <button type="button" onClick={() => sendArtifactToSubmission(contractText)} className={`${BTN.outline} sm:col-span-2 xl:col-span-1`}>
                    Перенести в сдачу ↓
                  </button>
                )}
              </div>

              {state.finished ? (
                <div className="kg-rise rounded-[24px] bg-sky-tint p-6" role="status">
                  <Label tone="system">Модуль завершён</Label>
                  <p className="mt-2 leading-relaxed">Артефакт сохранён. Следующий модуль — как давать модели достаточно контекста, не вываливая на неё цифровой чердак.</p>
                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                    {nextHref && (
                      <Link href={nextHref} className={BTN.small}>
                        {nextLabel}
                      </Link>
                    )}
                    <Link href={overviewHref} className="kg-link inline-flex min-h-11 items-center font-semibold">
                      Вся программа
                    </Link>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setState((current) => ({ ...current, finished: true }))}
                  className={`w-full ${BTN.primary}`}
                >
                  Завершить модуль
                </button>
              )}
            </div>
          </div>
        </Lesson>
      )}
    </FlowShell>
  );
}
