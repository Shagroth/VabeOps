import type { Metadata } from "next";
import Link from "next/link";
import { DemoCourseFlow } from "@/components/demo-course/DemoCourseFlow";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { DEMO_COURSE_META } from "@/content/demo-course";

export const metadata: Metadata = {
  title: DEMO_COURSE_META.title,
  description: DEMO_COURSE_META.dek,
  alternates: { canonical: "/demo-course/task-contract" },
};

export default function TaskContractDemoPage() {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-[17px] text-graphite">
      <Header />
      <main id="main-content" className="mx-auto w-full max-w-[1280px] flex-1 px-3 pb-20 sm:px-8 lg:pb-24">
        <div className="max-w-[45rem] px-2 pb-10 pt-6 sm:px-0">
          <Link href="/demo-course" className="kg-link inline-flex min-h-11 items-center font-mono text-sm">← Программа курса</Link>
          <p className="mt-6 font-mono text-sm text-graphite-muted">{DEMO_COURSE_META.eyebrow}</p>
          <h1 className="mt-4 text-[clamp(40px,5vw,64px)] font-extrabold leading-none tracking-tight">{DEMO_COURSE_META.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-graphite-soft">{DEMO_COURSE_META.dek}</p>
        </div>
        <DemoCourseFlow />
      </main>
      <Footer />
    </div>
  );
}
