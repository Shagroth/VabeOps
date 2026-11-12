import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { DemoCourseFlow } from "@/components/demo-course/DemoCourseFlow";
import { DEMO_COURSE_META } from "@/content/demo-course";

export const metadata: Metadata = {
  title: DEMO_COURSE_META.title,
  description: DEMO_COURSE_META.dek,
  alternates: { canonical: "/demo-course" },
  openGraph: {
    title: DEMO_COURSE_META.title,
    description: DEMO_COURSE_META.dek,
    type: "article",
  },
};

export default function DemoCoursePage() {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-graphite">
      <Header />
      <main id="main-content" className="flex-1">
        <section className="relative overflow-hidden bg-ink text-ink-foreground">
          <div className="signal-field" />
          <div className="relative mx-auto grid max-w-[1280px] gap-12 px-6 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:px-10 lg:py-24">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-system">
                {DEMO_COURSE_META.eyebrow}
              </span>
              <h1 className="mt-5 max-w-[16ch] text-[2.8rem] font-semibold leading-[1.02] tracking-tight sm:text-[4rem] lg:text-[4.8rem]">
                {DEMO_COURSE_META.title}
              </h1>
              <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-ink-muted">
                {DEMO_COURSE_META.dek}
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {[DEMO_COURSE_META.duration, DEMO_COURSE_META.level, "без регистрации"].map((item) => (
                  <span key={item} className="rounded-full border border-hairline-ink px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-ink-muted">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-hairline-ink bg-white/[0.035] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-system/50 bg-system/10 font-mono text-xs text-system">
                  ИК
                </div>
                <div>
                  <p className="text-sm font-medium">Игорь Ковалёв</p>
                  <p className="text-xs text-ink-muted">Архитектор · 10 лет в backend и platform</p>
                </div>
              </div>
              <div className="mt-6 border-t border-hairline-ink pt-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal">Результат модуля</span>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{DEMO_COURSE_META.result}. Его можно скопировать или скачать как Markdown.</p>
              </div>
              <p className="mt-5 text-[11px] leading-relaxed text-ink-muted/70">
                Демо-автор и учебный кейс вымышлены. Интерфейс и полный учебный флоу работают уже сейчас.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
          <DemoCourseFlow />
        </section>
      </main>
      <Footer />
    </div>
  );
}
