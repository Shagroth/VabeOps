"use client";

import { useRef, type PointerEvent } from "react";

/**
 * The hero "sky" panel: the full mark with a kite that sways on its line
 * and leans towards the pointer, as if the visitor were holding the grip.
 * The line always meets the kite because the kite turns around its own
 * bottom point. All motion is CSS and is off under prefers-reduced-motion;
 * the pointer handler only writes one custom property.
 */
export function HeroSky() {
  const ref = useRef<HTMLDivElement>(null);

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    el.style.setProperty("--lean", `${(x * 7).toFixed(2)}deg`);
  }

  function onPointerLeave() {
    ref.current?.style.setProperty("--lean", "0deg");
  }

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="kg-sky relative flex min-h-[520px] items-center justify-center overflow-hidden rounded-[36px] bg-sky-tint lg:min-h-[640px]"
    >
      <svg
        viewBox="0 0 400 640"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Знак KiteGrip: змей-искра летит, нить ведёт к ручке в руке человека"
        className="h-[520px] w-full lg:h-[640px]"
      >
        <g fill="none" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
          <path className="kg-gust" pathLength={1} d="M24 120 C 70 108, 110 132, 160 118" />
          <path className="kg-gust" pathLength={1} d="M260 260 C 300 248, 340 270, 384 256" style={{ animationDelay: "-2.4s", animationDuration: "6.5s" }} />
          <path className="kg-gust" pathLength={1} d="M30 430 C 64 420, 96 440, 132 428" style={{ animationDelay: "-4.1s", animationDuration: "8s" }} />
          <path className="kg-gust" pathLength={1} d="M250 78 C 286 70, 322 88, 372 76" style={{ animationDelay: "-1.2s", animationDuration: "7.2s" }} />
          <path className="kg-gust" pathLength={1} d="M236 520 C 276 510, 318 530, 366 516" style={{ animationDelay: "-5.3s", animationDuration: "9s" }} />
        </g>

        <path
          className="kg-string"
          pathLength={1}
          d="M200 210 C 110 320, 300 400, 200 480 C 130 536, 220 570, 200 596"
          fill="none"
          stroke="var(--string)"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path className="kg-bow" style={{ animationDelay: "1.35s" }} d="M192 349 L204 356 L192 363 Z M216 349 L204 356 L216 363 Z" fill="var(--string)" />
        <path className="kg-bow" style={{ animationDelay: "2.15s" }} d="M169 542 L181 549 L169 556 Z M193 542 L181 549 L193 556 Z" fill="var(--string)" />
        <rect className="kg-grip" x="164" y="594" width="72" height="20" rx="10" fill="var(--ink)" />

        <g className="kg-lean">
          <g className="kg-kite-in">
            <g className="kg-kite">
              <path d="M200 40 Q206 104 250 110 Q206 116 200 210 Q194 116 150 110 Q194 104 200 40 Z" fill="var(--signal)" />
              <path d="M200 44 L200 206 M154 110 L246 110" stroke="#ffffff" strokeWidth="1.4" opacity="0.8" />
            </g>
          </g>
        </g>
      </svg>

      <span className="kg-chip absolute right-5 top-14 rounded-full bg-white px-3.5 py-2 font-mono text-[13px] text-[#1e2a4a] sm:right-7 sm:top-16" style={{ animationDelay: "0.9s, 3.2s" }}>
        ✦ ИИ — летит быстро
      </span>
      <span className="kg-chip absolute left-4 top-1/2 rounded-full bg-white px-3.5 py-2 font-mono text-[13px] text-[#1e2a4a] sm:left-6" style={{ animationDelay: "1.6s, 4.4s" }}>
        〰 нить — контракт задачи
      </span>
      <span className="kg-chip absolute bottom-[76px] right-4 rounded-full bg-ink px-3.5 py-2 font-mono text-[13px] text-ink-foreground sm:right-7" style={{ animationDelay: "2.5s, 5.1s" }}>
        ▬ хватка — твоё решение
      </span>
    </div>
  );
}
