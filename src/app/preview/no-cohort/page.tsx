import Link from "next/link";
import { requirePreviewEnv } from "../guard";
import { WorkspaceShell } from "@/components/WorkspaceShell";
import { PreviewBanner } from "@/components/PreviewBanner";
import { CourseCard } from "@/components/cards/CourseCard";
import { EventCard } from "@/components/cards/EventCard";
import { JournalCard } from "@/components/cards/JournalCard";
import { MINI_COURSES } from "@/content/courses";
import { EVENTS } from "@/content/events";
import { getFeaturedJournal } from "@/content/journal";

export default function PreviewNoCohortPage() {
  requirePreviewEnv();

  const previewCourses = MINI_COURSES.slice(0, 3);
  const previewEvents = EVENTS.slice(0, 2);
  const featured = getFeaturedJournal();

  return (
    <WorkspaceShell active="overview" email="preview-no-cohort@example.test" canAccessStudio={false}>
      <div className="mx-auto flex max-w-[1080px] flex-col gap-10">
        <PreviewBanner label="Обзор — аккаунт без когорты" />

        <div className="rounded-2xl border border-hairline bg-white/40 px-6 py-12 text-center sm:px-10">
          <svg viewBox="0 0 160 80" className="mx-auto h-14 w-28 opacity-70" fill="none" aria-hidden="true">
            <path d="M10 70 L60 40" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            <path d="M60 40 L140 12" stroke="var(--system)" strokeWidth="2.5" />
            <path d="M60 40 L120 66" stroke="currentColor" strokeWidth="2" opacity="0.25" strokeDasharray="4 4" />
            <circle cx="60" cy="40" r="4" fill="currentColor" opacity="0.5" />
            <circle cx="140" cy="12" r="5" fill="var(--system)" />
          </svg>
          <h1 className="mt-4 text-2xl font-semibold">Пока нет активной когорты</h1>
          <p className="mx-auto mt-2 max-w-[48ch] text-graphite-muted">
            Твой аккаунт подтверждён, но ты ещё не прикреплён(а) ни к одной когорте пилота.
            Пока жди — можешь посмотреть, что уже есть в открытом доступе.
          </p>
        </div>

        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-sm font-medium text-graphite-muted">Бесплатные мини-курсы</h2>
            <Link href="/courses" className="text-xs text-graphite-muted underline">
              Все мини-курсы →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {previewCourses.map((c) => (
              <CourseCard key={c.slug} course={c} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-sm font-medium text-graphite-muted">Мероприятия</h2>
            <Link href="/events" className="text-xs text-graphite-muted underline">
              Все мероприятия →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {previewEvents.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-sm font-medium text-graphite-muted">Из журнала</h2>
            <Link href="/journal" className="text-xs text-graphite-muted underline">
              Все статьи →
            </Link>
          </div>
          <JournalCard entry={featured} large />
        </section>

        <Link href="/preview" className="text-sm text-graphite-muted underline">
          ← все preview-состояния
        </Link>
      </div>
    </WorkspaceShell>
  );
}
