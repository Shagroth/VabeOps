"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PrototypeModule, PrototypeStep } from "@/content/demo-course-program";

type FlowState = {
  step: number;
  maxStepReached: number;
  answers: Record<string, string>;
  fields: Record<string, string>;
  reflection: string;
  finished: boolean;
};

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
    const raw = window.localStorage.getItem(`vabeops-module-${module.number}-v1`);
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

export function PrototypeModuleFlow({ module }: { module: PrototypeModule }) {
  const [state, setState] = useState(() => initialState(module));
  const [hydrated, setHydrated] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const heading = useRef<HTMLHeadingElement>(null);
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
    window.localStorage.setItem(`vabeops-module-${module.number}-v1`, JSON.stringify(state));
  }, [hydrated, module.number, state]);

  useEffect(() => {
    if (hydrated) heading.current?.focus();
  }, [hydrated, state.step]);

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
  const progress = state.finished ? 100 : Math.round(((state.maxStepReached + 1) / module.steps.length) * 100);

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
    window.localStorage.removeItem(`vabeops-module-${module.number}-v1`);
    setState(initialState(module));
    setCopyState("idle");
  }

  async function copyArtifact() {
    try {
      await navigator.clipboard.writeText(artifact);
      setCopyState("copied");
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
    URL.revokeObjectURL(href);
  }

  if (!hydrated) return <div className="min-h-[720px] rounded-[28px] border border-hairline bg-white/30" />;

  return (
    <div className="overflow-hidden rounded-[28px] border border-hairline bg-[#f3f4ef] shadow-[0_30px_80px_-55px_rgba(10,15,24,0.55)]">
      <div className="grid min-h-[760px] min-w-0 lg:grid-cols-[286px_minmax(0,1fr)]">
        <aside className="min-w-0 border-b border-hairline bg-ink text-ink-foreground lg:border-b-0 lg:border-r lg:border-hairline-ink">
          <div className="lg:sticky lg:top-[73px]">
            <div className="border-b border-hairline-ink p-5 lg:p-6">
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-system">Field course / 0{module.number}</span>
                <span className="font-mono text-[10px] text-ink-muted">{progress}%</span>
              </div>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-signal transition-[width] duration-500" style={{ width: `${progress}%` }} /></div>
              <h2 className="mt-5 text-xl font-medium leading-tight">{module.title}</h2>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">На выходе — {module.artifactName}. Это не сувенир — понесёшь его в работу.</p>
            </div>

            <nav className="min-w-0 overflow-x-auto p-3 lg:max-h-[500px] lg:overflow-y-auto lg:p-4" aria-label="Навигация по модулю">
              <ol className="flex min-w-max gap-2 lg:min-w-0 lg:flex-col">
                {module.steps.map((step, index) => {
                  const active = index === state.step;
                  const reachable = index <= state.maxStepReached;
                  const passed = index < state.maxStepReached || state.finished;
                  return (
                    <li key={step.id}>
                      <button type="button" disabled={!reachable} onClick={() => goTo(index)} aria-current={active ? "step" : undefined} className={`group flex w-[210px] items-start gap-3 rounded-xl border px-3 py-3 text-left transition-colors lg:w-full ${active ? "border-system/60 bg-system/10" : reachable ? "border-transparent hover:border-hairline-ink hover:bg-white/[0.03]" : "border-transparent opacity-35"}`}>
                        <span className={`mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full border font-mono text-[9px] ${passed ? "border-signal bg-signal text-signal-ink" : active ? "border-system text-system" : "border-hairline-ink text-ink-muted"}`}>{passed ? "✓" : step.index}</span>
                        <span><span className="block text-xs font-medium text-ink-foreground">{step.label}</span><span className="mt-0.5 block text-[11px] leading-snug text-ink-muted">{step.short}</span></span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>

            <div className="hidden border-t border-hairline-ink p-6 lg:block"><button type="button" onClick={reset} className="font-mono text-[10px] uppercase tracking-wide text-ink-muted underline underline-offset-4 hover:text-ink-foreground">Сбросить прогресс</button></div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col">
          <div className="flex items-center justify-between border-b border-hairline px-5 py-3 sm:px-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-graphite-muted">≈ {current.minutes} мин · прогресс хранится в браузере</span>
            <button type="button" onClick={reset} className="text-xs text-graphite-muted underline underline-offset-4 lg:hidden">Сбросить</button>
          </div>

          <div className="flex-1 px-5 py-8 sm:px-8 sm:py-10 xl:px-12 xl:py-12">
            <div className="mx-auto max-w-[920px]">
              {state.step === labIndex ? (
                <LabLesson module={module} headingRef={heading} state={state} completed={completedFields} onField={(key, value) => setState((currentState) => ({ ...currentState, fields: { ...currentState.fields, [key]: value } }))} onExample={() => setState((currentState) => ({ ...currentState, fields: Object.fromEntries(module.labFields.map((field) => [field.key, field.example])) }))} />
              ) : state.step === artifactIndex ? (
                <ArtifactLesson module={module} headingRef={heading} state={state} artifact={artifact} copyState={copyState} onReflection={(value) => setState((currentState) => ({ ...currentState, reflection: value }))} onCopy={copyArtifact} onDownload={downloadArtifact} onFinish={() => setState((currentState) => ({ ...currentState, finished: true }))} />
              ) : (
                <ConceptLesson step={current} headingRef={heading} answer={answer} onAnswer={(value) => setState((currentState) => ({ ...currentState, answers: { ...currentState.answers, [current.id]: value } }))} />
              )}
            </div>
          </div>

          <footer className="border-t border-hairline bg-white/40 px-5 py-4 sm:px-8">
            <div className="mx-auto flex max-w-[920px] items-center justify-between gap-4">
              <button type="button" onClick={back} disabled={state.step === 0} className="rounded-lg border border-hairline bg-white/60 px-4 py-2 text-sm text-graphite-muted disabled:opacity-30">← Назад</button>
              <span className="hidden font-mono text-[10px] uppercase tracking-wide text-graphite-muted sm:block">{current.index} / 06</span>
              {state.step < lastStep ? <button type="button" onClick={next} disabled={!canAdvance} className="rounded-lg bg-ink px-5 py-2 text-sm font-medium text-ink-foreground transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100">Продолжить →</button> : <span className="text-sm text-graphite-muted">Финал модуля</span>}
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

function ConceptLesson({ step, headingRef, answer, onAnswer }: { step: PrototypeStep; headingRef: React.RefObject<HTMLHeadingElement | null>; answer?: string; onAnswer: (value: string) => void }) {
  return (
    <Lesson headingRef={headingRef} kicker={step.kicker} title={step.title} lead={step.lead}>
      <div className={`grid gap-3 ${step.notes.length >= 4 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
        {step.notes.map((note) => <article key={`${step.id}-${note.number}`} className="relative overflow-hidden rounded-2xl border border-hairline bg-white/60 p-5"><span className="font-mono text-[10px] text-system">{note.number}</span>{note.signal && <span className="absolute right-4 top-4 rounded-full bg-[#eceee7] px-2 py-1 font-mono text-[8px] uppercase text-graphite-muted">{note.signal}</span>}<h3 className="mt-6 text-lg font-medium">{note.title}</h3><p className="mt-3 text-sm leading-relaxed text-graphite-muted">{note.body}</p></article>)}
      </div>

      {step.caseStudy && <div className="mt-5 rounded-2xl bg-ink p-6 text-ink-foreground sm:p-7"><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent-change">{step.caseStudy.label}</span><h3 className="mt-3 text-2xl font-medium">{step.caseStudy.title}</h3><p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-ink-muted">{step.caseStudy.body}</p><div className="mt-6 flex flex-wrap gap-2">{step.caseStudy.signals.map((signal) => <span key={signal} className="rounded-full border border-hairline-ink px-3 py-1.5 font-mono text-[9px] uppercase text-ink-muted">{signal}</span>)}</div></div>}

      {step.checkpoint && <div className="mt-6 rounded-2xl border border-hairline bg-white/50 p-5 sm:p-6"><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-system">Точка решения</span><h3 className="mt-2 text-lg font-medium">{step.checkpoint.prompt}</h3>{step.checkpoint.context && <p className="mt-2 text-sm text-graphite-muted">{step.checkpoint.context}</p>}<div className="mt-5 space-y-2">{step.checkpoint.options.map((option) => <button key={option.id} type="button" onClick={() => onAnswer(option.id)} className={`block w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors ${answer === option.id ? "border-system bg-system/[0.08]" : "border-hairline bg-white/60 hover:bg-white"}`}><span className="flex items-center gap-3"><span className={`h-2.5 w-2.5 flex-none rounded-full border ${answer === option.id ? "border-system bg-system" : "border-graphite-muted/40"}`} />{option.label}</span></button>)}</div>{answer && <div className={`mt-4 rounded-xl border p-4 text-sm leading-relaxed ${answer === step.checkpoint.correctId ? "border-signal/50 bg-signal/10" : "border-accent-change/40 bg-accent-change/[0.06] text-graphite-muted"}`}><span className={`mr-2 font-mono text-[10px] uppercase tracking-wide ${answer === step.checkpoint.correctId ? "text-signal-ink" : "text-accent-change"}`}>{answer === step.checkpoint.correctId ? "Точно" : "Есть подвох"}</span>{answer === step.checkpoint.correctId ? step.checkpoint.success : step.checkpoint.retry}</div>}</div>}
    </Lesson>
  );
}

function LabLesson({ module, headingRef, state, completed, onField, onExample }: { module: PrototypeModule; headingRef: React.RefObject<HTMLHeadingElement | null>; state: FlowState; completed: number; onField: (key: string, value: string) => void; onExample: () => void }) {
  return <Lesson headingRef={headingRef} kicker="05 / Field lab" title={module.labTitle} lead={module.labLead}>
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-system/25 bg-system/[0.05] p-4"><div><p className="text-sm font-medium">Нет подходящей задачи под рукой?</p><p className="mt-1 text-xs text-graphite-muted">Подставим инженерный кейс. Разбери его, а потом перепиши под свою систему.</p></div><button type="button" onClick={onExample} className="rounded-lg bg-ink px-4 py-2 text-xs font-medium text-ink-foreground">Взять учебный кейс</button></div>
    <div className="mt-5 space-y-4">{module.labFields.map((field, index) => { const value = state.fields[field.key] ?? ""; const ready = value.trim().length >= 12; return <label key={field.key} className="block rounded-2xl border border-hairline bg-white/60 p-5 focus-within:border-system"><span className="flex items-center justify-between gap-4"><span className="text-sm font-medium">0{index + 1}. {field.label}</span><span className={`font-mono text-[9px] uppercase tracking-wide ${ready ? "text-signal-ink" : "text-graphite-muted"}`}>{ready ? "готово" : "нужно заполнить"}</span></span><span className="mt-1 block text-xs text-graphite-muted">{field.prompt}</span><textarea value={value} onChange={(event) => onField(field.key, event.target.value)} rows={3} className="mt-4 w-full resize-y rounded-xl border border-hairline bg-[#fbfcf8] px-4 py-3 text-sm leading-relaxed outline-none placeholder:text-graphite-muted/50 focus:border-system" placeholder={field.placeholder} /></label>; })}</div>
    <div className="mt-4 flex items-center justify-between rounded-xl bg-ink px-4 py-3 text-sm text-ink-foreground"><span>Артефакт собран</span><span className="font-mono text-signal">{completed} / {module.labFields.length}</span></div>
  </Lesson>;
}

function ArtifactLesson({ module, headingRef, state, artifact, copyState, onReflection, onCopy, onDownload, onFinish }: { module: PrototypeModule; headingRef: React.RefObject<HTMLHeadingElement | null>; state: FlowState; artifact: string; copyState: "idle" | "copied" | "failed"; onReflection: (value: string) => void; onCopy: () => void; onDownload: () => void; onFinish: () => void }) {
  const next = module.number < 5 ? module.number + 1 : null;
  return <Lesson headingRef={headingRef} kicker="06 / Takeaway" title={`${module.artifactName} готов`} lead="Не полируй его в вакууме. Версия 0.1 должна встретиться с настоящей задачей, получить по зубам и стать точнее — так и рождаются рабочие инструменты.">
    <div className="grid min-w-0 gap-5 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="min-w-0 overflow-hidden rounded-2xl border border-hairline bg-ink text-ink-foreground"><div className="flex items-center justify-between border-b border-hairline-ink px-4 py-3"><span className="font-mono text-[10px] text-ink-muted">{module.artifactFile}</span><span className="font-mono text-[9px] uppercase text-signal">ready</span></div><pre className="max-h-[560px] min-w-0 overflow-auto whitespace-pre-wrap break-words p-5 font-mono text-[11px] leading-relaxed text-ink-muted sm:p-6">{artifact}</pre></div>
      <div className="space-y-4">
        <div className="rounded-2xl border border-hairline bg-white/60 p-5"><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-graphite-muted">Self-check / {module.rubric.length} критериев</span><ul className="mt-4 space-y-3">{module.rubric.map((item) => <li key={item} className="flex gap-3 text-xs leading-relaxed text-graphite-muted"><span className="mt-0.5 flex h-4 w-4 flex-none items-center justify-center rounded-full bg-signal text-[9px] text-signal-ink">✓</span>{item}</li>)}</ul></div>
        <label className="block rounded-2xl border border-hairline bg-white/60 p-5"><span className="text-sm font-medium">Договор с собой</span><span className="mt-1 block text-xs text-graphite-muted">На какой задаче проверишь артефакт в течение недели?</span><textarea value={state.reflection} onChange={(event) => onReflection(event.target.value)} rows={3} className="mt-4 w-full resize-y rounded-xl border border-hairline bg-[#fbfcf8] px-3 py-3 text-sm outline-none focus:border-system" placeholder="На следующей задаче я…" /></label>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1"><button type="button" onClick={onCopy} className="rounded-xl bg-ink px-4 py-3 text-sm font-medium text-ink-foreground">{copyState === "copied" ? "Скопировано ✓" : copyState === "failed" ? "Не удалось скопировать" : "Скопировать артефакт"}</button><button type="button" onClick={onDownload} className="rounded-xl border border-hairline bg-white/70 px-4 py-3 text-sm font-medium">Скачать .md</button></div>
        {state.finished ? <div className="rounded-2xl border border-signal/50 bg-signal/10 p-5"><span className="font-mono text-[10px] uppercase tracking-wide text-signal-ink">Модуль завершён</span><p className="mt-2 text-sm text-graphite-muted">Прогресс и артефакт сохранены в этом браузере.</p><div className="mt-4 flex flex-wrap gap-3">{next ? <Link href={`/demo-course/${next}`} className="rounded-lg bg-ink px-4 py-2 text-xs font-medium text-ink-foreground">К модулю {next} →</Link> : <Link href="/demo-course" className="rounded-lg bg-ink px-4 py-2 text-xs font-medium text-ink-foreground">К обзору курса →</Link>}<Link href="/demo-course" className="px-2 py-2 text-xs text-graphite-muted underline underline-offset-4">Вся программа</Link></div></div> : <button type="button" onClick={onFinish} className="w-full rounded-xl bg-signal px-4 py-3 text-sm font-medium text-signal-ink">Завершить модуль</button>}
      </div>
    </div>
  </Lesson>;
}

function Lesson({ headingRef, kicker, title, lead, children }: { headingRef: React.RefObject<HTMLHeadingElement | null>; kicker: string; title: string; lead: string; children: React.ReactNode }) {
  return <section><span className="font-mono text-[10px] uppercase tracking-[0.2em] text-system">{kicker}</span><h2 ref={headingRef} tabIndex={-1} className="mt-3 max-w-[22ch] text-3xl font-semibold leading-[1.08] tracking-tight outline-none sm:text-[2.65rem]">{title}</h2><p className="mt-5 max-w-[68ch] text-base leading-relaxed text-graphite-muted">{lead}</p><div className="mt-9">{children}</div></section>;
}
