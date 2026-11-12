import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { CoverArt } from "@/components/covers/CoverArt";
import { StatusChip } from "@/components/StatusChip";
import { EVENTS, getEventBySlug } from "@/content/events";
import { RECORDINGS, getRecordingBySlug } from "@/content/recordings";

export function generateStaticParams() {
  return [...EVENTS.map((e) => ({ slug: e.slug })), ...RECORDINGS.map((r) => ({ slug: r.slug }))];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  const recording = !event ? getRecordingBySlug(slug) : undefined;
  const item = event ?? recording;
  if (!item) return {};
  return {
    title: item.title,
    description: "description" in item ? item.description : undefined,
    alternates: { canonical: `/events/${item.slug}` },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  const recording = !event ? getRecordingBySlug(slug) : undefined;
  if (!event && !recording) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-paper text-graphite">
      <Header />
      <main id="main-content" className="flex-1">
        <section className="mx-auto max-w-[920px] px-6 py-16 lg:px-10">
          <Link href="/events" className="text-sm text-graphite-muted hover:text-graphite">
            ← Все мероприятия
          </Link>

          <div className="mt-6 overflow-hidden rounded-2xl border border-hairline">
            <div className="aspect-[16/8]">
              <CoverArt variant={(event ?? recording)!.cover} tone="paper" className="h-full w-full" />
            </div>
          </div>

          {event && (
            <>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <StatusChip tone="planned" />
                <span className="font-mono text-xs uppercase tracking-wide text-graphite-muted">
                  {event.kindLabel}
                </span>
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{event.title}</h1>
              <p className="mt-4 max-w-[64ch] text-lg text-graphite-muted">{event.description}</p>

              <div className="mt-10 grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-hairline bg-white/50 p-6">
                  <h2 className="text-sm font-medium uppercase tracking-wide text-graphite-muted">
                    Кому подойдёт
                  </h2>
                  <p className="mt-2 text-sm">{event.audience}</p>
                </div>
                <div className="rounded-2xl border border-hairline bg-white/50 p-6">
                  <h2 className="text-sm font-medium uppercase tracking-wide text-graphite-muted">
                    Результат
                  </h2>
                  <p className="mt-2 text-sm">{event.outcome}</p>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-system/30 bg-system/5 p-6 text-sm">
                Дата пока не подтверждена. Оставь заявку на пилот — участники пилота узнают о
                дате первыми.
              </div>
            </>
          )}

          {recording && (
            <>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <StatusChip tone="unavailable" />
                <span className="font-mono text-xs uppercase tracking-wide text-graphite-muted">
                  Концепт записи
                </span>
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                {recording.title}
              </h1>
              <p className="mt-4 max-w-[64ch] text-lg text-graphite-muted">{recording.description}</p>
              <div className="mt-8 rounded-2xl border border-warn/30 bg-warn/5 p-6 text-sm">
                Реальной записи ещё не существует — это только концепт будущего контента,
                без рабочей кнопки воспроизведения.
              </div>
            </>
          )}

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
