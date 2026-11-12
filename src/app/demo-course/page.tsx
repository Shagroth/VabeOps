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
        <section className="bg-ink py-16 text-ink-foreground">
          <div className="mx-auto max-w-[1080px] px-6 lg:px-10">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-system">
              Бесплатный demo-курс · проходится полностью сейчас
            </span>
            <h1 className="mt-3 max-w-[32ch] text-[2.25rem] font-semibold tracking-tight sm:text-[2.75rem]">
              {DEMO_COURSE_META.title}
            </h1>
            <p className="mt-4 max-w-[62ch] text-ink-muted">{DEMO_COURSE_META.dek}</p>
            <p className="mt-4 text-sm text-ink-muted">
              Не нужен аккаунт пилота — весь курс открыт и проходится прямо в браузере.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1080px] px-6 py-12 lg:px-10">
          <DemoCourseFlow />
        </section>
      </main>
      <Footer />
    </div>
  );
}
