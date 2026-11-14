import type { Metadata } from "next";
import { ApplyForm } from "@/components/ApplyForm";
import { COURSE_LIST, isCourseKey } from "@/content/course-list";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Заявка на пилот",
  description: "Заявка на поток KiteGrip: курс для разработчиков или First Flight для новичков. Каждую заявку читаем вручную.",
};

export default async function ApplyPage({ searchParams }: { searchParams: Promise<{ course?: string }> }) {
  const { course } = await searchParams;
  const defaultCourse = isCourseKey(course) ? course : "ENGINEERS";
  return (
    <div className="flex flex-1 flex-col bg-paper text-graphite">
      <Header />
      <main id="main-content" className="mx-auto w-full max-w-[640px] flex-1 px-5 py-16 sm:px-8">
        <span className="font-mono text-sm uppercase tracking-[0.1em] text-graphite-muted">{COURSE_LIST[defaultCourse].title}</span>
        <h1 className="mt-4 text-[clamp(40px,6vw,60px)] font-extrabold leading-none tracking-[-0.035em]">Возьмись за нить.</h1>
        <p className="mb-10 mt-5 text-[19px] leading-[1.6] text-graphite-soft">
          Каждую заявку читаем вручную, автоматически никого не зачисляем. Курс можно поменять прямо в форме.
        </p>
        <ApplyForm defaultCourse={defaultCourse} />
      </main>
      <Footer />
    </div>
  );
}
