import Link from "next/link";
import { PROGRAM_AUTHOR, formatMinutes } from "@/content/demo-course-program";

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
  return (
    <section className="relative overflow-hidden bg-ink text-ink-foreground">
      <div className="signal-field" />
      <div className="relative mx-auto max-w-[1280px] px-6 pt-6 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline-ink pb-5">
          <Link href={overviewHref} className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted transition-colors hover:text-ink-foreground">{overviewLabel}</Link>
          <div className="flex gap-2">
            {prev && <Link href={prev} className="rounded-full border border-hairline-ink px-3 py-1.5 font-mono text-[9px] uppercase text-ink-muted hover:text-ink-foreground">← 0{number - 1}</Link>}
            {next && <Link href={next} className="rounded-full border border-hairline-ink px-3 py-1.5 font-mono text-[9px] uppercase text-ink-muted hover:text-ink-foreground">0{number + 1} →</Link>}
          </div>
        </div>
      </div>
      <div className="relative mx-auto grid max-w-[1280px] gap-12 px-6 py-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:px-10 lg:py-20">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-system">{eyebrow}</span>
          <h1 className="mt-5 max-w-[17ch] text-[2.8rem] font-semibold leading-[1.02] tracking-tight sm:text-[4rem] lg:text-[4.6rem]">{title}</h1>
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-ink-muted">{dek}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {[`${formatMinutes(guidedMinutes)} в интерфейсе`, `${formatMinutes(practiceMinutes)} практика`, accessTag].map((item) => <span key={item} className="rounded-full border border-hairline-ink px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-ink-muted">{item}</span>)}
            {mode !== "locked" && <a href="#homework" className="rounded-full border border-signal/45 bg-signal/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-signal transition-colors hover:bg-signal hover:text-signal-ink">Домашняя работа ↓</a>}
          </div>
        </div>

        <div className="rounded-2xl border border-hairline-ink bg-white/[0.035] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-system/50 bg-system/10 font-mono text-xs text-system">{PROGRAM_AUTHOR.initials}</div>
            <div><p className="text-sm font-medium">{PROGRAM_AUTHOR.name}</p><p className="text-xs text-ink-muted">{PROGRAM_AUTHOR.role}</p></div>
          </div>
          <div className="mt-6 border-t border-hairline-ink pt-5"><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal">Унесёшь с собой</span><p className="mt-2 text-sm leading-relaxed text-ink-muted">{result}.{mode === "locked" ? " Модуль открывается участникам пилота в рабочем пространстве." : " Скопируй в задачу, скачай как Markdown и проверь на живой работе."}</p></div>
          <p className="mt-5 text-[11px] leading-relaxed text-ink-muted/70">Учебные кейсы вымышлены, инженерные проблемы — до обидного настоящие. Время уточним после пилота.</p>
        </div>
      </div>
    </section>
  );
}
