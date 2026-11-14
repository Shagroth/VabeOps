import Link from "next/link";
import type { CSSProperties } from "react";
import { KiteGripMark } from "@/components/brand/KiteGripMark";
import { PROGRAM_AUTHOR, formatMinutes } from "@/content/demo-course-program";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

type ModuleHeroProps = {
  number: number;
  eyebrow: string;
  title: string;
  dek: string;
  result: string;
  guidedMinutes: [number, number];
  practiceMinutes: [number, number];
  /**
   * public — open demo module; locked — public teaser of a participants-only
   * module (no homework anchor); workspace — rendered inside the cohort
   * workspace, navigation points back into /modules.
   */
  mode?: "public" | "locked" | "workspace";
  overviewHref?: string;
  overviewLabel?: string;
  /** Explicit neighbours. `undefined` falls back to /demo-course/N±1, `null` hides the link. */
  prevHref?: string | null;
  nextHref?: string | null;
};

export function ModuleHero({
  number,
  eyebrow,
  title,
  dek,
  result,
  guidedMinutes,
  practiceMinutes,
  mode = "public",
  overviewHref = "/demo-course",
  overviewLabel = "← Вся программа",
  prevHref,
  nextHref,
}: ModuleHeroProps) {
  const prev = prevHref !== undefined ? prevHref : number > 1 ? `/demo-course/${number - 1}` : null;
  const next = nextHref !== undefined ? nextHref : number < 5 ? `/demo-course/${number + 1}` : null;
  const accessTag = mode === "public" ? "без регистрации" : mode === "locked" ? "для участников пилота" : "твоя неделя";
  const pill = "kg-btn inline-flex min-h-11 items-center rounded-full border-[1.5px] border-graphite px-4 font-mono text-[13px] hover:bg-ink hover:text-ink-foreground";
  const facts = [`${formatMinutes(guidedMinutes)} в интерфейсе`, `${formatMinutes(practiceMinutes)} практика`, accessTag];
  return (
    <section className="bg-paper text-graphite">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <nav aria-label="Навигация по программе" className="flex flex-wrap items-center justify-between gap-4 pt-6">
          <Link href={overviewHref} className="kg-link inline-flex min-h-11 items-center font-mono text-[13px] text-graphite-muted hover:text-graphite">
            {overviewLabel}
          </Link>
          <div className="flex gap-2">
            {prev && <Link href={prev} aria-label={`Предыдущий модуль, 0${number - 1}`} className={pill}>← 0{number - 1}</Link>}
            {next && <Link href={next} aria-label={`Следующий модуль, 0${number + 1}`} className={pill}>0{number + 1} →</Link>}
          </div>
        </nav>

        <div className="grid items-end gap-12 pb-14 pt-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.85fr)] lg:pb-20 lg:pt-14">
          <div className="flex flex-col gap-7">
            <span className="kg-rise font-mono text-sm uppercase tracking-[0.1em] text-graphite-muted" style={step(0)}>{eyebrow}</span>
            <h1 className="max-w-[14ch] text-[clamp(40px,5.8vw,80px)] font-extrabold leading-[0.97] tracking-[-0.04em]">
              <span className="kg-line" style={step(0)}><span>{title}</span></span>
            </h1>
            <p className="kg-rise max-w-[34em] text-[19px] leading-[1.6] text-graphite-soft" style={step(2)}>{dek}</p>
            <div className="kg-rise flex flex-wrap items-center gap-2" style={step(3)}>
              <ul className="contents">
                {facts.map((item) => (
                  <li key={item} className="rounded-full border border-hairline-strong px-3.5 py-2 font-mono text-[13px] text-graphite-muted">{item}</li>
                ))}
              </ul>
              {mode !== "locked" && (
                <a href="#homework" className="kg-btn inline-flex min-h-11 items-center gap-2 rounded-full bg-signal px-5 text-[15px] font-semibold text-signal-ink hover:bg-sky-deep">
                  Домашняя работа <span aria-hidden="true">↓</span>
                </a>
              )}
            </div>
          </div>

          <aside className="kg-rise relative overflow-hidden rounded-[32px] bg-sky-tint p-7 sm:p-9" style={step(2)}>
            <KiteGripMark variant="compact" className="kg-float absolute right-7 top-7 h-24 w-auto sm:right-9" />
            <span className="font-mono text-sm uppercase tracking-[0.1em] text-sky-deep">Унесёшь с собой</span>
            <p className="mt-4 max-w-[18em] pr-12 text-[23px] font-bold leading-tight tracking-[-0.015em]">{result}.</p>
            <p className="mt-4 max-w-[30em] text-[15px] leading-relaxed text-graphite-soft">
              {mode === "locked" ? "Модуль открывается участникам пилота в рабочем пространстве." : "Скопируй в задачу, скачай как Markdown и проверь на живой работе."}
            </p>
            <div className="mt-7 flex items-center gap-3.5 border-t border-[#c9d6f4] pt-6">
              <span aria-hidden="true" className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-ink font-mono text-[13px] text-ink-foreground">{PROGRAM_AUTHOR.initials}</span>
              <div>
                <p className="font-semibold leading-snug">{PROGRAM_AUTHOR.name}</p>
                <p className="text-[15px] text-graphite-soft">{PROGRAM_AUTHOR.role}</p>
              </div>
            </div>
            <p className="mt-5 text-[13px] leading-relaxed text-graphite-muted">Учебные кейсы вымышлены, инженерные проблемы — до обидного настоящие. Время уточним после пилота.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
