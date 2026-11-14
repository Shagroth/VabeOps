import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { ComicViewer } from "@/components/comics/ComicViewer";
import { COMIC_SERIES, EPISODE_1 } from "@/content/comics";

const EPISODES = [EPISODE_1];

export function generateStaticParams() {
  return EPISODES.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const episode = EPISODES.find((e) => e.slug === slug);
  if (!episode) return {};
  return {
    title: `${episode.title} — ${COMIC_SERIES.title}`,
    description: episode.summary,
    alternates: { canonical: `/comics/${episode.slug}` },
  };
}

export default async function ComicEpisodePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const episode = EPISODES.find((e) => e.slug === slug);
  if (!episode) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-paper text-[17px] text-graphite">
      <Header />
      <main id="main-content" className="flex-1">
        <section className="mx-auto max-w-[980px] px-4 pb-10 pt-10 sm:px-8">
          <Link href="/comics" className="kg-link inline-flex min-h-11 items-center font-mono text-[13px] text-graphite-muted">
            ← {COMIC_SERIES.title}
          </Link>
          <span className="mt-4 block font-mono text-sm uppercase tracking-[0.1em] text-graphite-muted">
            <span className="mr-2 text-string">{String(episode.order).padStart(2, "0")}</span>Эпизод
          </span>
          <h1 className="mt-3 max-w-[16ch] text-[clamp(36px,5vw,64px)] font-extrabold leading-[0.98] tracking-[-0.04em]">
            {episode.title}
          </h1>
          <p className="mt-5 max-w-[36em] text-[19px] leading-[1.6] text-graphite-soft">{episode.summary}</p>
        </section>

        <section className="mx-auto max-w-[980px] px-4 sm:px-8">
          <ComicViewer panels={episode.panels} title={episode.title} />
        </section>

        <section className="mx-auto max-w-[980px] px-4 py-16 sm:px-8">
          <div className="rounded-[28px] bg-ink p-7 text-ink-foreground sm:p-9">
            <span className="font-mono text-[13px] uppercase tracking-[0.08em] text-system">Что из этого забрать</span>
            <h2 className="mt-3 text-[26px] font-extrabold leading-tight tracking-[-0.03em]">Чек-лист после эпизода</h2>
            <ol className="mt-5">
              {episode.checklist.map((item, i) => (
                <li key={item} className="grid grid-cols-[36px_1fr] gap-x-2 border-t border-ink-line py-3">
                  <span className="font-mono text-[15px] text-system">0{i + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
            <Link
              href="/demo-course/1"
              className="kg-btn mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-paper px-6 font-semibold text-ink hover:bg-signal hover:text-signal-ink"
            >
              Собрать свой контракт задачи <span aria-hidden="true" className="kg-arrow">→</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
