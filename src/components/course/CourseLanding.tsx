import Link from "next/link";
import type { CSSProperties } from "react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { KiteGripMark, type KiteGripMarkTone } from "@/components/brand/KiteGripMark";
import { LessonDiagramFigure } from "@/components/demo-course/LessonDiagram";
import { Reveal } from "@/components/motion/Reveal";
import { isPublicCourseModule, type CourseDefinition } from "@/content/course-catalog";
import { formatMinutes, type DiagramTone } from "@/content/demo-course-program";

/**
 * The public page of a course: hero, audience, program with open and
 * cohort-only modules, how a module works, and the cohort call to action.
 * Both courses use it; the copy and the panel colour differ.
 */
export type CourseLandingCopy = {
  eyebrow: string;
  titleLine: string;
  titleLine2: string;
  /** The part of the second line set in the line colour. */
  titleAccent: string;
  lead: string;
  /** Hero panel ground: Sky for the engineers' course, Ink for First Flight, as on the landing cards. */
  panelTone: "sky" | "ink";
  chipTop: string;
  chipBottom: string;
  audience: Array<{ title: string; detail: string }>;
  programTitle: string;
  howText: string;
  howNodes: Array<{ label: string; note?: string; tone?: DiagramTone }>;
  cohortText: string;
  applyLabel: string;
};

const PANEL: Record<CourseLandingCopy["panelTone"], { bg: string; mark: KiteGripMarkTone; chip: string }> = {
  sky: { bg: "bg-signal", mark: "sky", chip: "bg-ink text-ink-foreground" },
  ink: { bg: "bg-ink", mark: "dark", chip: "bg-string text-white" },
};

const CONTAINER = "mx-auto max-w-[1280px] px-5 sm:px-8";
const H2 = "text-[clamp(36px,4.4vw,60px)] font-extrabold leading-none tracking-[-0.035em]";
const EYEBROW = "font-mono text-sm uppercase tracking-[0.1em]";
const step = (i: number) => ({ "--i": i }) as CSSProperties;

function hours(min: number, max: number) {
  const f = (m: number) => (m / 60).toFixed(1).replace(".", ",").replace(",0", "");
  return `${f(min)}–${f(max)} ч`;
}

export function CourseLanding({ course, copy, totals }: { course: CourseDefinition; copy: CourseLandingCopy; totals: { guidedMin: number; guidedMax: number } }) {
  const panel = PANEL[copy.panelTone];
  return (
    <div className="flex min-h-screen flex-col bg-paper text-[17px] leading-normal text-graphite">
      <Header />
      <main id="main-content" className="flex-1">
        {/* Hero */}
        <section className={`${CONTAINER} grid items-center gap-14 pb-20 pt-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.85fr)] lg:pb-24 lg:pt-[72px]`}>
          <div className="flex flex-col gap-7">
            <span className={`kg-rise ${EYEBROW} text-graphite-muted`} style={step(0)}>
              {copy.eyebrow}
            </span>
            <h1 className="text-[clamp(44px,6.2vw,88px)] font-extrabold leading-[0.95] tracking-[-0.045em]">
              <span className="kg-line" style={step(0)}>
                <span>{copy.titleLine}</span>
              </span>
              <span className="kg-line" style={step(1)}>
                <span>
                  {copy.titleLine2} <span className="text-string">{copy.titleAccent}</span>
                </span>
              </span>
            </h1>
            <p className="kg-rise max-w-[34em] text-[19px] leading-[1.6] text-graphite-soft" style={step(3)}>
              {copy.lead}
            </p>
            <div className="kg-rise flex flex-wrap gap-3.5" style={step(4)}>
              <Link
                href={`${course.path}/1`}
                className="kg-btn inline-flex min-h-14 items-center gap-2 rounded-full bg-signal px-[30px] font-semibold text-signal-ink hover:bg-sky-deep"
              >
                Начать с модуля 1 <span aria-hidden="true" className="kg-arrow">→</span>
              </Link>
              <Link
                href="#program"
                className="kg-btn inline-flex min-h-14 items-center rounded-full border-[1.5px] border-graphite px-[29px] font-semibold hover:bg-ink hover:text-ink-foreground"
              >
                Программа
              </Link>
            </div>
            <p className="kg-rise font-mono text-sm text-graphite-muted" style={step(5)}>
              {course.modules.length} модулей · {hours(totals.guidedMin, totals.guidedMax)} в интерфейсе · модули 1–2 открыты без
              регистрации
            </p>
          </div>

          <div className={`relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-[36px] lg:min-h-[560px] ${panel.bg}`}>
            <KiteGripMark
              variant="full"
              tone={panel.mark}
              label="Знак KiteGrip: змей на нити"
              className="kg-float h-[400px] w-auto lg:h-[520px]"
            />
            <span className="absolute left-5 top-6 rounded-full bg-paper px-3.5 py-2 font-mono text-[13px] text-ink sm:left-7">
              ✦ {copy.chipTop}
            </span>
            <span className={`absolute bottom-6 right-5 rounded-full px-3.5 py-2 font-mono text-[13px] sm:right-7 ${panel.chip}`}>
              ▬ {copy.chipBottom}
            </span>
          </div>
        </section>

        {/* Audience */}
        <section className="border-t border-hairline">
          <div className={`${CONTAINER} flex flex-col gap-12 py-24`}>
            <Reveal>
              <h2 className={`${H2} max-w-[12em]`}>Кому подойдёт</h2>
            </Reveal>
            <Reveal mode="children" className="grid gap-x-7 gap-y-8 md:grid-cols-3">
              {copy.audience.map((item, i) => (
                <div key={item.title} className="flex flex-col gap-[18px]">
                  <span aria-hidden="true" className="kg-rule h-[1.5px] bg-graphite" style={step(i * 2)} />
                  <div className="kg-item flex flex-col gap-2.5" style={step(i * 2 + 1)}>
                    <span className="font-mono text-[15px] text-string">0{i + 1}</span>
                    <h3 className="text-[23px] font-bold leading-tight tracking-[-0.015em]">{item.title}</h3>
                    <p className="text-graphite-soft">{item.detail}</p>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* Program */}
        <section id="program" className="kg-anchor border-y border-hairline bg-white">
          <div className={`${CONTAINER} flex flex-col gap-10 py-24`}>
            <Reveal className="flex flex-col gap-3.5">
              <span className={`${EYEBROW} text-graphite-muted`}>Программа</span>
              <h2 className={`${H2} max-w-[14em]`}>{copy.programTitle}</h2>
            </Reveal>

            <Reveal as="ol" mode="children" className="relative flex flex-col">
              <span aria-hidden="true" className="kg-rule absolute inset-x-0 top-0 h-[1.5px] bg-graphite" />
              {course.modules.map((module, i) => {
                const open = isPublicCourseModule(course, module.number);
                const homework = course.getContent(module.number)?.homework;
                return (
                  <li key={module.number} className="kg-item border-b border-hairline" style={step(i + 1)}>
                    <Link
                      href={`${course.path}/${module.number}`}
                      className="kg-row grid gap-x-9 gap-y-4 py-7 transition-colors duration-200 hover:bg-paper md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_auto] md:items-center md:px-3"
                    >
                      <div className="kg-row-title flex gap-[18px]">
                        <span className="font-mono text-[15px] text-string">0{module.number}</span>
                        <div>
                          <h3 className="text-[22px] font-bold leading-tight tracking-[-0.015em]">{module.shortTitle}</h3>
                          <p className="mt-1.5 text-[15px] text-graphite-soft">{module.dek}</p>
                        </div>
                      </div>
                      <div className="pl-[39px] md:pl-0">
                        <span className="font-mono text-xs uppercase tracking-[0.08em] text-graphite-muted">Унесёшь с собой</span>
                        <p className="mt-1.5 text-[15px]">{module.artifactName}</p>
                        <p className="mt-1 font-mono text-[13px] text-graphite-muted">{formatMinutes(module.guidedMinutes)}</p>
                        {homework && <p className="mt-2 text-[15px] text-graphite-soft">Домашняя работа: {homework.shortTitle}</p>}
                      </div>
                      <span
                        className={`ml-[39px] justify-self-start rounded-full px-3.5 py-1.5 font-mono text-[13px] md:ml-0 md:justify-self-end ${
                          open ? "bg-sky-tint text-sky-deep" : "bg-paper-deep text-graphite-muted"
                        }`}
                      >
                        {open ? "открыт" : "в потоке"}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </Reveal>
          </div>
        </section>

        {/* How a module works */}
        <section className={`${CONTAINER} flex flex-col gap-10 py-24`}>
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <h2 className={`${H2} max-w-[12em]`}>Как устроен каждый модуль</h2>
            <p className="max-w-[30em] text-graphite-soft">
              {copy.howText}
            </p>
          </Reveal>
          <Reveal>
            <LessonDiagramFigure
              diagram={{
                kind: "flow",
                title: "путь по модулю",
                nodes: copy.howNodes,
                caption: "Прогресс хранится в твоём браузере. Регистрация для модулей 1–2 не нужна.",
              }}
            />
          </Reveal>
        </section>

        {/* Cohort */}
        <section className="bg-ink text-ink-foreground">
          <div className={`${CONTAINER} grid items-center gap-10 py-24 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.85fr)]`}>
            <Reveal className="flex flex-col gap-6">
              <span className={`${EYEBROW} text-sky-on-ink`}>Модули 3–5 и домашние работы</span>
              <h2 className="text-[clamp(36px,4.6vw,60px)] font-extrabold leading-[0.98] tracking-[-0.04em]">
                Дальше — в потоке, с разбором от автора
              </h2>
              <p className="max-w-[32em] text-[19px] leading-[1.6] text-ink-muted">
                {copy.cohortText}
              </p>
            </Reveal>
            <Reveal delay={120} className="flex flex-col gap-3">
              <Link
                href={`${course.path}/1`}
                className="kg-btn inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-paper px-7 font-semibold text-ink hover:bg-signal hover:text-signal-ink"
              >
                Начать с модуля 1 <span aria-hidden="true" className="kg-arrow">→</span>
              </Link>
              <Link
                href={`/apply?course=${course.key}`}
                className="kg-btn inline-flex min-h-14 items-center justify-center rounded-full border-[1.5px] border-ink-foreground px-7 font-semibold hover:bg-paper hover:text-ink"
              >
                {copy.applyLabel}
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
