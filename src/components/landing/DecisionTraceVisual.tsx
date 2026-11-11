const STAGES = [
  { label: "Контекст", sub: "контракт сервиса неизменен" },
  { label: "Агент", sub: "предлагает патч" },
  { label: "Проверка", sub: "12/12 тестов", active: true },
  { label: "Пересмотр", sub: "если изменится тариф" },
];

export function DecisionTraceVisual() {
  return (
    <div className="w-full max-w-[560px] overflow-hidden rounded-2xl border border-hairline-ink bg-[#0E1420] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]">
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-hairline-ink px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="ml-2 font-mono text-xs text-ink-muted">
          trace · billing/discount-service.ts
        </span>
      </div>

      <div className="flex flex-col gap-5 p-5">
        {/* stage rail */}
        <div className="relative flex justify-between">
          <div className="absolute left-0 right-0 top-[9px] h-px bg-hairline-ink" />
          {STAGES.map((s) => (
            <div key={s.label} className="relative z-10 flex flex-col items-center gap-2 text-center">
              <span
                className={`h-[18px] w-[18px] rounded-full border-2 ${
                  s.active
                    ? "pulse-signal border-signal bg-signal"
                    : "border-ink-muted bg-[#0E1420]"
                }`}
              />
              <span className="text-xs font-medium text-ink-foreground">{s.label}</span>
              <span className="max-w-[90px] font-mono text-[10px] leading-tight text-ink-muted">
                {s.sub}
              </span>
            </div>
          ))}
        </div>

        {/* code diff */}
        <div className="rounded-xl border border-hairline-ink bg-black/30 p-4 font-mono text-[12px] leading-relaxed">
          <div className="text-ink-muted"> export function getUserDiscount(user: User): number {"{"}</div>
          <div className="bg-signal/10 text-signal">
            {"+ "}if (user.tier === &quot;enterprise&quot;) return 0.25;
          </div>
          <div className="text-ink-muted"> if (user.tier === &quot;pro&quot;) return 0.15;</div>
          <div className="text-ink-muted"> return 0;</div>
          <div className="text-ink-muted"> {"}"}</div>
        </div>

        {/* decision branch — the one place the motif actually earns its keep */}
        <div className="relative min-h-[110px]">
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
          <div
            className="absolute text-xs"
            style={{ left: "32%", top: "0%", width: "68%" }}
          >
            <span className="font-medium text-signal">Выбрано:</span>{" "}
            <span className="text-ink-foreground/80">
              ветка внутри функции — контракт не меняется
            </span>
          </div>
          <div
            className="absolute text-xs"
            style={{ left: "32%", top: "62%", width: "68%" }}
          >
            <span className="font-medium text-ink-muted">Отклонено:</span>{" "}
            <span className="text-ink-muted">
              вынести в DiscountResolver — лишний рефакторинг ради одной строки
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-hairline-ink pt-4 font-mono text-xs text-signal">
          <span aria-hidden="true">✓</span> 12/12 тестов прошли
        </div>
      </div>
    </div>
  );
}
