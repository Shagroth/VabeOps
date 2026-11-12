import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { CourseCard } from "@/components/cards/CourseCard";
import { MINI_COURSES } from "@/content/courses";

export const metadata = { title: "Мини-курсы" };

export default function CoursesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-graphite">
      <Header />
      <main id="main-content" className="flex-1">
        <section className="bg-ink py-16 text-ink-foreground">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-system">
              Free lessons
            </span>
            <h1 className="mt-3 max-w-[32ch] text-[2.375rem] font-semibold tracking-tight sm:text-[3rem]">
              Бесплатные мини-курсы
            </h1>
            <p className="mt-4 max-w-[62ch] text-ink-muted">
              Короткие уроки, гайды и практические лабы по работе с AI-агентами — отдельно от
              флагманской когорты. Часть материалов уже готова к просмотру, часть — в подготовке;
              статус всегда виден на карточке.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MINI_COURSES.map((c) => (
              <CourseCard key={c.slug} course={c} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
