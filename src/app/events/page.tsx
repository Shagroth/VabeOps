import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { EventCard } from "@/components/cards/EventCard";
import { RecordingCard } from "@/components/cards/RecordingCard";
import { EVENTS } from "@/content/events";
import { RECORDINGS } from "@/content/recordings";

export const metadata = { title: "Мероприятия" };

export default function EventsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-graphite">
      <Header />
      <main id="main-content" className="flex-1">
        <section className="bg-ink py-16 text-ink-foreground">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-system">
              Events
            </span>
            <h1 className="mt-3 max-w-[32ch] text-[2.375rem] font-semibold tracking-tight sm:text-[3rem]">
              Мероприятия и воркшопы
            </h1>
            <p className="mt-4 max-w-[62ch] text-ink-muted">
              Открытые воркшопы, практические клиники и обсуждения — отдельно от трёх закрытых
              созвонов флагманской когорты. Ни один из форматов ниже ещё не имеет подтверждённой
              даты — это планы, а не расписание.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10">
          <h2 className="text-sm font-medium uppercase tracking-wide text-graphite-muted">
            Планируются
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {EVENTS.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-6 pb-16 lg:px-10">
          <h2 className="text-sm font-medium uppercase tracking-wide text-graphite-muted">
            Архив записей
          </h2>
          <p className="mt-2 max-w-[62ch] text-sm text-graphite-muted">
            Пока нет ни одной реальной записи — ниже только концепты, честно помеченные как
            недоступные для просмотра.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {RECORDINGS.map((r) => (
              <RecordingCard key={r.slug} recording={r} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
