"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PrototypeModule, PrototypeStep } from "@/content/demo-course-program";
import { sendArtifactToSubmission, type WorkspaceFlowLinks } from "@/lib/artifact-bridge";
import { useFunnel, type FunnelTarget } from "./useFunnel";
import { LessonDiagramFigure } from "./LessonDiagram";
import { BTN, CARD, Checklist, ChoiceButton, Feedback, FIELD, FileCard, FlowPlaceholder, FlowShell, LabField, LabProgress, Label, Lesson, Question, StarterCase } from "./flow-ui";

type FlowState = {
  step: number;
  maxStepReached: number;
  answers: Record<string, string>;
  fields: Record<string, string>;
  reflection: string;
  finished: boolean;
};

function storageKeyOf(module: PrototypeModule) {
  return module.storageKey ?? `vabeops-module-${module.number}-v1`;
}

function initialState(module: PrototypeModule): FlowState {
  return {
    step: 0,
    maxStepReached: 0,
    answers: {},
    fields: Object.fromEntries(module.labFields.map((field) => [field.key, ""])),
    reflection: "",
    finished: false,
  };
}

function loadState(module: PrototypeModule): FlowState {
  const empty = initialState(module);
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(storageKeyOf(module));
    if (!raw) return empty;
    const saved = JSON.parse(raw) as Partial<FlowState>;
    const safeStep = Number.isInteger(saved.step) && (saved.step ?? 0) >= 0 && (saved.step ?? 0) < module.steps.length ? saved.step! : 0;
    const safeMax = Number.isInteger(saved.maxStepReached) && (saved.maxStepReached ?? 0) >= safeStep && (saved.maxStepReached ?? 0) < module.steps.length ? saved.maxStepReached! : safeStep;
    return { ...empty, ...saved, step: safeStep, maxStepReached: safeMax, answers: { ...empty.answers, ...saved.answers }, fields: { ...empty.fields, ...saved.fields } };
  } catch {
    return empty;
  }
}

function formatArtifact(module: PrototypeModule, fields: Record<string, string>, reflection: string) {
  const sections = module.labFields.map((field, index) => `## ${index + 1}. ${field.label}\n${fields[field.key] || "_Не заполнено_"}`).join("\n\n");
  return `# ${module.artifactName}\n\nМодуль ${String(module.number).padStart(2, "0")}: ${module.title}\n\n${sections}\n\n## Следующий шаг\n${reflection || "_Не заполнено_"}\n`;
}

export function PrototypeModuleFlow({ module, workspace, track }: { module: PrototypeModule; workspace?: WorkspaceFlowLinks; track?: FunnelTarget }) {
  const mark = useFunnel(track);
  const [state, setState] = useState(() => initialState(module));
  const [hydrated, setHydrated] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const heading = useRef<HTMLHeadingElement>(null);
  const focusReady = useRef(false);
  const lastStep = module.steps.length - 1;
  const labIndex = module.steps.findIndex((step) => step.id === "lab");
  const artifactIndex = module.steps.findIndex((step) => step.id === "artifact");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(loadState(module));
    setHydrated(true);
  }, [module]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKeyOf(module), JSON.stringify(state));
  }, [hydrated, module, state]);

  useEffect(() => {
    if (!hydrated) return;
    // Skip the first run: focusing the heading on page load would scroll
    // the visitor past the module hero. Later step changes do move focus.
    if (!focusReady.current) {
      focusReady.current = true;
      return;
    }
    heading.current?.focus();
  }, [hydrated, state.step]);

  useEffect(() => {
    if (!hydrated) return;
    mark("open");
    if (labIndex >= 0 && state.maxStepReached >= labIndex) mark("lab");
    if (artifactIndex >= 0 && state.maxStepReached >= artifactIndex) mark("artifact");
    if (state.finished) mark("finished");
  }, [hydrated, mark, labIndex, artifactIndex, state.maxStepReached, state.finished]);

  const completedFields = module.labFields.filter((field) => (state.fields[field.key] ?? "").trim().length >= 12).length;
  const artifact = useMemo(() => formatArtifact(module, state.fields, state.reflection), [module, state.fields, state.reflection]);
  const current = module.steps[state.step];
  const answer = state.answers[current.id];
  const canAdvance = state.step === labIndex
    ? completedFields === module.labFields.length
    : state.step === artifactIndex
      ? false
      : current.checkpoint
        ? Boolean(answer)
        : true;

  function goTo(step: number) {
    if (step > state.maxStepReached) return;
    setState((currentState) => ({ ...currentState, step }));
  }

  function next() {
    const target = Math.min(state.step + 1, lastStep);
    setState((currentState) => ({ ...currentState, step: target, maxStepReached: Math.max(currentState.maxStepReached, target) }));
  }

  function back() {
    setState((currentState) => ({ ...currentState, step: Math.max(0, currentState.step - 1) }));
  }

  function reset() {
    window.localStorage.removeItem(storageKeyOf(module));
    setState(initialState(module));
    setCopyState("idle");
  }

  async function copyArtifact() {
    try {
      await navigator.clipboard.writeText(artifact);
      setCopyState("copied");
      mark("export");
    } catch {
      setCopyState("failed");
    }
  }

  function downloadArtifact() {
    const blob = new Blob([artifact], { type: "text/markdown;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = module.artifactFile;
    anchor.click();
    mark("export");
    URL.revokeObjectURL(href);
  }

  if (!hydrated) return <FlowPlaceholder />;

  return (
    <FlowShell
      eyebrow={`Модуль 0${module.number}`}
      title={module.title}
      note={module.flowNote ?? `На выходе — ${module.artifactName}. Это не сувенир: он пойдёт прямо в работу.`}
      steps={module.steps}
      step={state.step}
      maxStepReached={state.maxStepReached}
      finished={state.finished}
      topNote={`≈ ${current.minutes} мин · прогресс хранится в браузере`}
      canAdvance={canAdvance}
      onGoTo={goTo}
      onBack={back}
      onNext={next}
      onReset={reset}
    >
      {state.step === labIndex ? (
        <LabLesson
          module={module}
          headingRef={heading}
          state={state}
          completed={completedFields}
          onField={(key, value) => setState((currentState) => ({ ...currentState, fields: { ...currentState.fields, [key]: value } }))}
          onExample={() => setState((currentState) => ({ ...currentState, fields: Object.fromEntries(module.labFields.map((field) => [field.key, field.example])) }))}
        />
      ) : state.step === artifactIndex ? (
        <ArtifactLesson
          module={module}
          headingRef={heading}
          state={state}
          artifact={artifact}
          copyState={copyState}
          onReflection={(value) => setState((currentState) => ({ ...currentState, reflection: value }))}
          onCopy={copyArtifact}
          onDownload={downloadArtifact}
          onFinish={() => setState((currentState) => ({ ...currentState, finished: true }))}
          workspace={workspace}
        />
      ) : (
        <ConceptLesson
          step={current}
          headingRef={heading}
          answer={answer}
          onAnswer={(value) => setState((currentState) => ({ ...currentState, answers: { ...currentState.answers, [current.id]: value } }))}
        />
      )}
    </FlowShell>
  );
}

type HeadingRef = React.RefObject<HTMLHeadingElement | null>;

function ConceptLesson({ step, headingRef, answer, onAnswer }: { step: PrototypeStep; headingRef: HeadingRef; answer?: string; onAnswer: (value: string) => void }) {
  return (
    <Lesson headingRef={headingRef} kicker={step.kicker} title={step.title} lead={step.lead}>
      {step.theory && (
        <div className="mb-8 max-w-[62ch] space-y-4 text-[17px] leading-[1.65]">
          {step.theory.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      )}
      {step.diagram && <LessonDiagramFigure diagram={step.diagram} />}
      <div className={`grid gap-4 ${step.notes.length >= 4 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
        {step.notes.map((note) => (
          <article key={`${step.id}-${note.number}`} className={CARD}>
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[15px] text-string">{note.number}</span>
              {note.signal && <span className="rounded-full bg-paper-deep px-3 py-1 font-mono text-xs text-graphite-muted">{note.signal}</span>}
            </div>
            <h3 className="mt-6 text-[22px] font-bold leading-tight tracking-[-0.015em]">{note.title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-graphite-soft">{note.body}</p>
          </article>
        ))}
      </div>

      {step.caseStudy && (
        <FileCard name={step.caseStudy.label} className="mt-5">
          <div className="pb-8 pr-6 sm:pr-8">
            <h3 className="text-[28px] font-extrabold leading-[1.05] tracking-[-0.03em]">{step.caseStudy.title}</h3>
            <p className="mt-4 max-w-[65ch] leading-relaxed text-ink-muted">{step.caseStudy.body}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {step.caseStudy.signals.map((signal) => (
                <li key={signal} className="rounded-full border border-ink-line px-3.5 py-1.5 font-mono text-[13px] text-ink-muted">{signal}</li>
              ))}
            </ul>
          </div>
        </FileCard>
      )}

      {step.checkpoint && (
        <Question label="Точка решения" title={step.checkpoint.prompt} description={step.checkpoint.context}>
          {step.checkpoint.options.map((option) => (
            <ChoiceButton key={option.id} selected={answer === option.id} onClick={() => onAnswer(option.id)}>
              {option.label}
            </ChoiceButton>
          ))}
          {answer && (
            <Feedback good={answer === step.checkpoint.correctId} goodLabel="Точно" retryLabel="Есть подвох">
              {answer === step.checkpoint.correctId ? step.checkpoint.success : step.checkpoint.retry}
            </Feedback>
          )}
        </Question>
      )}
    </Lesson>
  );
}

function LabLesson({ module, headingRef, state, completed, onField, onExample }: { module: PrototypeModule; headingRef: HeadingRef; state: FlowState; completed: number; onField: (key: string, value: string) => void; onExample: () => void }) {
  return (
    <Lesson headingRef={headingRef} kicker={module.labKicker ?? "05 / Field lab"} title={module.labTitle} lead={module.labLead}>
      <StarterCase
        title="Нет подходящей задачи под рукой?"
        text="Подставим инженерный кейс. Разбери его, а потом перепиши под свою систему."
        action="Взять учебный кейс"
        onClick={onExample}
      />
      <div className="mt-5 space-y-4">
        {module.labFields.map((field, index) => {
          const value = state.fields[field.key] ?? "";
          return (
            <LabField
              key={field.key}
              title={`0${index + 1}. ${field.label}`}
              prompt={field.prompt}
              value={value}
              ready={value.trim().length >= 12}
              placeholder={field.placeholder}
              onChange={(next) => onField(field.key, next)}
            />
          );
        })}
      </div>
      <LabProgress label="Артефакт собран" done={completed} total={module.labFields.length} />
    </Lesson>
  );
}

function ArtifactLesson({ module, headingRef, state, artifact, copyState, onReflection, onCopy, onDownload, onFinish, workspace }: { module: PrototypeModule; headingRef: HeadingRef; state: FlowState; artifact: string; copyState: "idle" | "copied" | "failed"; onReflection: (value: string) => void; onCopy: () => void; onDownload: () => void; onFinish: () => void; workspace?: WorkspaceFlowLinks }) {
  const next = module.number < 5 ? module.number + 1 : null;
  const coursePath = module.coursePath ?? "/demo-course";
  const nextHref = workspace ? workspace.nextHref : next ? `${coursePath}/${next}` : null;
  const nextLabel = workspace ? workspace.nextLabel ?? "К следующей неделе →" : `К модулю ${next} →`;
  const overviewHref = workspace ? workspace.overviewHref : coursePath;
  return (
    <Lesson headingRef={headingRef} kicker={module.artifactKicker ?? "06 / Takeaway"} title={`${module.artifactName} готов`} lead={module.artifactLead ?? "Не полируй его в вакууме. Версия 0.1 должна встретиться с настоящей задачей, получить по зубам и стать точнее — так и рождаются рабочие инструменты."}>
      <div className="grid min-w-0 gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <FileCard name={module.artifactFile} status="ready" className="self-start">
          <pre className="max-h-[560px] min-w-0 overflow-auto whitespace-pre-wrap break-words pb-7 pr-6 font-mono text-sm leading-relaxed text-ink-muted">{artifact}</pre>
        </FileCard>
        <div className="space-y-4">
          <div className={CARD}>
            <Label>Self-check · {module.rubric.length} критериев</Label>
            <Checklist items={module.rubric} />
          </div>
          <label className={`block ${CARD}`}>
            <span className="text-lg font-bold tracking-[-0.01em]">Договор с собой</span>
            <span className="mt-1.5 block text-[15px] text-graphite-soft">На какой задаче проверишь артефакт в течение недели?</span>
            <textarea value={state.reflection} onChange={(event) => onReflection(event.target.value)} rows={3} className={`mt-4 ${FIELD}`} placeholder="На следующей задаче я…" />
          </label>
          <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-1">
            <button type="button" onClick={onCopy} className={BTN.dark}>
              {copyState === "copied" ? "Скопировано ✓" : copyState === "failed" ? "Не удалось скопировать" : "Скопировать артефакт"}
            </button>
            <button type="button" onClick={onDownload} className={BTN.outline}>Скачать .md</button>
            {workspace && (
              <button type="button" onClick={() => sendArtifactToSubmission(artifact)} className={`${BTN.outline} sm:col-span-2 xl:col-span-1`}>
                Перенести в сдачу ↓
              </button>
            )}
          </div>
          {state.finished ? (
            <div className="kg-rise rounded-[24px] bg-sky-tint p-6" role="status">
              <Label tone="system">Модуль завершён</Label>
              <p className="mt-2 leading-relaxed">Прогресс и артефакт сохранены в этом браузере.</p>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                <Link href={nextHref ?? overviewHref} className={BTN.small}>{nextHref ? nextLabel : "К обзору курса →"}</Link>
                <Link href={overviewHref} className="kg-link inline-flex min-h-11 items-center font-semibold">Вся программа</Link>
              </div>
            </div>
          ) : (
            <button type="button" onClick={onFinish} className={`w-full ${BTN.primary}`}>Завершить модуль</button>
          )}
        </div>
      </div>
    </Lesson>
  );
}
