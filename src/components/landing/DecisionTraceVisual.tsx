"use client";

import { useEffect, useState } from "react";

// Hero Decision Trace — the one sequential motion moment from the brief's
// motion system (§3.1): context appears, the agent proposes a change,
// verification runs, then the decision resolves (chosen path vs the
// rejected alternative). Auto-advances only when the user allows motion;
// otherwise it renders the final, fully-informative frame and stays still.
const STAGES = [
  { label: "Контекст", sub: "контракт сервиса неизменен" },
  { label: "Агент", sub: "предлагает патч" },
  { label: "Проверка", sub: "12/12 тестов" },
  { label: "Решение", sub: "если изменится тариф — пересмотр" },
] as const;

const STAGE_MS = 2600;

export function DecisionTraceVisual() {
  const [reducedMotion, setReducedMotion] = useState(true);
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Reads an external source (OS/browser motion preference) on mount —
    // there is no SSR-safe way to know this without the client round-trip.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion || !playing) return;
    const id = setInterval(() => {
      setStage((s) => (s + 1) % STAGES.length);
    }, STAGE_MS);
    return () => clearInterval(id);
  }, [reducedMotion, playing]);

  // Reduced motion: show every stage satisfied at once, the end state,
  // with nothing moving or disappearing.
  const effectiveStage = reducedMotion ? STAGES.length - 1 : stage;
  const showDiff = reducedMotion || effectiveStage >= 1;
  const showVerify = reducedMotion || effectiveStage >= 2;
  const showResolution = reducedMotion || effectiveStage >= 3;

  return (
    <div className="w-full max-w-[560px] overflow-hidden rounded-2xl border border-hairline-ink bg-[#0E1420] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]">
      <div className="flex items-center gap-2 border-b border-hairline-ink px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="ml-2 font-mono text-xs text-ink-muted">
          trace · billing/discount-service.ts
        </span>
        {!reducedMotion && (
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Остановить демонстрацию" : "Продолжить демонстрацию"}
            className="ml-auto rounded px-2 py-0.5 font-mono text-[10px] text-ink-muted hover:bg-white/5 hover:text-ink-foreground"
          >
            {playing ? "II" : "▶"}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-5 p-5">
        <div className="relative flex justify-between">
          <div className="absolute left-0 right-0 top-[9px] h-px bg-hairline-ink" />
          {STAGES.map((s, i) => {
            const active = i === effectiveStage;
            const done = i < effectiveStage || reducedMotion;
            return (
              <div key={s.label} className="relative z-10 flex flex-col items-center gap-2 text-center">
                <span
                  className={`h-[18px] w-[18px] rounded-full border-2 transition-colors duration-300 ${
                    active ? "pulse-signal border-signal bg-signal" : done ? "border-signal/60 bg-signal/20" : "border-ink-muted bg-[#0E1420]"
                  }`}
                />
                <span className={`text-xs font-medium ${active || done ? "text-ink-foreground" : "text-ink-muted"}`}>
                  {s.label}
                </span>
                <span className="max-w-[90px] font-mono text-[10px] leading-tight text-ink-muted">
                  {s.sub}
                </span>
              </div>
            );
          })}
        </div>

        <div className="min-h-[86px] rounded-xl border border-hairline-ink bg-black/30 p-4 font-mono text-[12px] leading-relaxed">
          <div className="text-ink-muted"> export function getUserDiscount(user: User): number {"{"}</div>
          {showDiff ? (
            <div className="bg-signal/10 text-signal">
              {"+ "}if (user.tier === &quot;enterprise&quot;) return 0.25;
            </div>
          ) : (
            <div className="text-ink-muted/40">{"  // контракт: не менять сигнатуру"}</div>
          )}
          <div className="text-ink-muted"> if (user.tier === &quot;pro&quot;) return 0.15;</div>
          <div className="text-ink-muted"> return 0;</div>
          <div className="text-ink-muted"> {"}"}</div>
        </div>

        <div className="flex items-center gap-2 border-t border-hairline-ink pt-4 font-mono text-xs">
          {showVerify ? (
            <span className="flex items-center gap-2 text-signal">
              <span aria-hidden="true">✓</span> 12/12 тестов прошли
            </span>
          ) : (
            <span className="text-ink-muted">ожидаем проверку…</span>
          )}
        </div>

        {showResolution && (
          <div className="relative min-h-[90px] border-t border-hairline-ink pt-4">
            <svg viewBox="0 0 520 72" className="h-[72px] w-full" aria-hidden="true">
              <circle cx="16" cy="36" r="4" fill="var(--system)" />
              <path d="M20 36 C 90 36, 90 14, 160 14" stroke="var(--signal)" strokeWidth="2" fill="none" />
              <path
                d="M20 36 C 90 36, 90 58, 160 58"
                stroke="var(--ink-muted)"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="3 4"
              />
              <circle cx="160" cy="14" r="3.5" fill="var(--signal)" />
              <circle cx="160" cy="58" r="3.5" fill="var(--ink-muted)" />
            </svg>
            <div className="absolute text-xs" style={{ left: "32%", top: "4%", width: "68%" }}>
              <span className="font-medium text-signal">Выбрано:</span>{" "}
              <span className="text-ink-foreground/80">ветка внутри функции — контракт не меняется</span>
            </div>
            <div className="absolute text-xs" style={{ left: "32%", top: "66%", width: "68%" }}>
              <span className="font-medium text-ink-muted">Отклонено:</span>{" "}
              <span className="text-ink-muted">вынести в DiscountResolver — лишний рефакторинг ради одной строки</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
