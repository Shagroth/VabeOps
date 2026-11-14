import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { CoverArt } from "@/components/covers/CoverArt";
import { LessonDiagramFigure } from "@/components/demo-course/LessonDiagram";
import { Checklist } from "@/components/demo-course/flow-ui";
import { COURSE_LEVEL_LABEL, MINI_COURSES, getCourseBySlug } from "@/content/courses";
import { getJournalBySlug } from "@/content/journal";

export function generateStaticParams() {
  return MINI_COURSES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return {};
  return {
    title: course.title,
    description: course.summary,
    alternates: { canonical: `/courses/${course.slug}` },
  };
}

const LABEL = "font-mono text-[13px] uppercase tracking-[0.08em]";

export default async function MiniCoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();
  const article = course.relatedArticle ? getJournalBySlug(course.relatedArticle) : undefined;

  return (
    <div className="flex min-h-screen flex-col bg-paper text-[17px] text-graphite">
      <Header />
      <main id="main-content" className="flex-1">
        <section className="mx-auto max-w-[1080px] px-5 pb-14 pt-10 sm:px-8">
          <Link href="/courses" className="kg-link inline-flex min-h-11 items-center font-mono text-[13px] text-graphite-muted">
            ← Все мини-курсы
          </Link>

          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end">
            <div>
              <span className={`${LABEL} text-graphite-muted`}>
                {course.format} · {COURSE_LEVEL_LABEL[course.level]} · {course.lessons.length} урока · {course.minutes} мин
              </span>
              <h1 className="mt-4 text-[clamp(36px,5vw,64px)] font-extrabold leading-[0.98] tracking-[-0.04em]">{course.title}</h1>
              <p className="mt-6 max-w-[36em] text-[19px] leading-[1.6] text-graphite-soft">{course.intro}</p>
            </div>
            <div className="overflow-hidden rounded-[28px] border border-hairline">
              <div className="aspect-[16/10]">
                <CoverArt variant={course.cover} tone="paper" className="h-full w-full" />
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-hairline bg-white">
          <div className="mx-auto grid max-w-[1080px] gap-10 px-5 py-14 sm:px-8 lg:grid-cols-2">
            <div>
              <h2 className="border-b-[1.5px] border-graphite pb-4 text-[23px] font-bold tracking-[-0.015em]">Что получится</h2>
              <Checklist items={course.goals} />
            </div>
            <nav aria-label="Уроки курса">
              <h2 className="border-b-[1.5px] border-graphite pb-4 text-[23px] font-bold tracking-[-0.015em]">Уроки</h2>
              <ol>
                {course.lessons.map((lesson, i) => (
                  <li key={lesson.title} className="border-b border-hairline">
                    <a href={`#lesson-${i + 1}`} className="kg-row grid min-h-14 grid-cols-[36px_1fr_auto] items-center gap-x-3 py-3">
                      <span className="font-mono text-[15px] text-string">0{i + 1}</span>
                      <span className="kg-row-title font-semibold">{lesson.title}</span>
                      <span className="font-mono text-[13px] text-graphite-muted">{lesson.minutes} мин</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </section>

        <div className="mx-auto flex max-w-[820px] flex-col gap-20 px-5 py-20 sm:px-8">
          {course.lessons.map((lesson, i) => (
            <article key={lesson.title} id={`lesson-${i + 1}`} className="kg-anchor">
              <span className={`${LABEL} text-graphite-muted`}>
                <span className="mr-2 text-string">0{i + 1}</span>Урок · {lesson.minutes} мин
              </span>
              <h2 className="mt-3 text-[clamp(28px,3.4vw,40px)] font-extrabold leading-[1.05] tracking-[-0.035em]">{lesson.title}</h2>
              <div className="mt-6 space-y-4 leading-[1.65]">
                {lesson.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              {lesson.diagram && (
                <div className="mt-8">
                  <LessonDiagramFigure diagram={lesson.diagram} />
                </div>
              )}

              {lesson.checklist && (
                <div className="mt-8 rounded-[24px] border border-hairline bg-white p-6 sm:p-7">
                  <span className={`${LABEL} text-graphite-muted`}>Проверь себя</span>
                  <Checklist items={lesson.checklist} />
                </div>
              )}

              <div className="mt-6 rounded-[24px] bg-ink p-6 text-ink-foreground sm:p-7">
                <span className={`${LABEL} text-system`}>Сделай на своём проекте</span>
                <p className="mt-3 leading-relaxed">{lesson.practice}</p>
              </div>
            </article>
          ))}

          <section aria-labelledby="takeaway-title" className="rounded-[28px] bg-sky-tint p-7 sm:p-9">
            <span className={`${LABEL} text-sky-deep`}>Забери с собой</span>
            <h2 id="takeaway-title" className="mt-3 text-[26px] font-extrabold leading-tight tracking-[-0.03em]">
              Короткий список после курса
            </h2>
            <ol className="mt-5">
              {course.takeaway.map((item, i) => (
                <li key={item} className="grid grid-cols-[36px_1fr] gap-x-2 border-t border-[#c9d6f4] py-3">
                  <span className="font-mono text-[15px] text-string">0{i + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="grid gap-5 sm:grid-cols-2">
            {article && (
              <Link href={`/journal/${article.slug}`} className="card-hover block rounded-[24px] border border-hairline bg-white p-6">
                <span className={`${LABEL} text-copper`}>Глубже, с источниками</span>
                <p className="mt-3 text-[20px] font-bold leading-snug tracking-[-0.015em]">{article.title}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-graphite-soft">{article.dek}</p>
              </Link>
            )}
            <div className="rounded-[24px] border border-hairline bg-white p-6">
              <span className={`${LABEL} text-graphite-muted`}>Дальше</span>
              <p className="mt-3 text-[20px] font-bold leading-snug tracking-[-0.015em]">Основной курс с практикой и разбором</p>
              <p className="mt-2 text-[15px] leading-relaxed text-graphite-soft">
                Мини-курс закрывает один вопрос. В KiteGrip for Engineers та же тема идёт с лабораторией, домашней
                работой и обратной связью.
              </p>
              <Link href="/demo-course/1" className="kg-link mt-4 inline-flex min-h-11 items-center font-semibold">
                Открытый модуль 1 <span aria-hidden="true" className="ml-1">→</span>
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
