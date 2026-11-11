import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { CoverArt } from "@/components/covers/CoverArt";
import { StatusChip } from "@/components/StatusChip";
import { MINI_COURSES, getCourseBySlug } from "@/content/courses";

export function generateStaticParams() {
  return MINI_COURSES.map((c) => ({ slug: c.slug }));
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-paper text-graphite">
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-[920px] px-6 py-16 lg:px-10">
          <Link href="/courses" className="text-sm text-graphite-muted hover:text-graphite">
            ← Все мини-курсы
          </Link>

          <div className="mt-6 overflow-hidden rounded-2xl border border-hairline">
            <div className="aspect-[16/8]">
              <CoverArt variant={course.cover} tone="paper" className="h-full w-full" />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <StatusChip tone={course.status === "preview" ? "preview" : "in_preparation"} />
            <span className="font-mono text-xs uppercase tracking-wide text-graphite-muted">
              {course.format} · {course.level}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{course.title}</h1>
          <p className="mt-4 max-w-[64ch] text-lg text-graphite-muted">{course.intro}</p>

          <div className="mt-10 rounded-2xl border border-hairline bg-white/50 p-7">
            <h2 className="text-sm font-medium uppercase tracking-wide text-graphite-muted">
              Чему научишься
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {course.goals.map((g) => (
                <li key={g} className="flex gap-3 text-sm">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-signal" />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 rounded-2xl border border-system/30 bg-system/5 p-6 text-sm text-graphite">
            {course.status === "preview" ? (
              <>
                Материал в превью — черновая структура урока готова, запись/текст ещё
                записываются. Оставь заявку на пилот, чтобы узнать первым, когда он выйдет.
              </>
            ) : (
              <>Эта тема в подготовке — структура выше уже утверждена, материал ещё не записан.</>
            )}
          </div>

          <Link
            href="/#apply"
            className="mt-8 inline-flex rounded-lg bg-ink px-5 py-2.5 text-sm font-medium text-ink-foreground transition-transform duration-150 hover:scale-[1.02]"
          >
            Подать заявку на пилот
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
