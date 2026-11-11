"use client";

import { useState } from "react";

type Week = {
  n: number;
  title: string;
  detail: string;
  outcome: string;
  assignment: string;
};

export function ProgramAccordion({ weeks }: { weeks: Week[] }) {
  const [openWeek, setOpenWeek] = useState<number | null>(1);

  return (
    <ol className="mt-10 flex flex-col">
      {weeks.map((w) => {
        const isOpen = openWeek === w.n;
        return (
          <li key={w.n} className="border-t border-hairline first:border-t-0">
            <button
              type="button"
              onClick={() => setOpenWeek(isOpen ? null : w.n)}
              aria-expanded={isOpen}
              className="flex w-full items-start gap-6 py-6 text-left"
            >
              <span className="font-mono text-sm text-graphite-muted">
                {String(w.n).padStart(2, "0")}
              </span>
              <div className="flex-1">
                <h3 className="text-xl font-medium">{w.title}</h3>
                <p className="mt-1 max-w-[60ch] text-sm text-graphite-muted">{w.detail}</p>
              </div>
              <svg
                viewBox="0 0 16 16"
                className={`mt-1.5 h-4 w-4 flex-shrink-0 text-graphite-muted transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              >
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="grid gap-4 pb-6 pl-[52px] sm:grid-cols-2">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-wide text-graphite-muted">
                      Результат
                    </span>
                    <p className="mt-1 text-sm text-graphite-muted">{w.outcome}</p>
                  </div>
                  <div>
                    <span className="font-mono text-xs uppercase tracking-wide text-graphite-muted">
                      Практика
                    </span>
                    <p className="mt-1 text-sm text-graphite-muted">{w.assignment}</p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
