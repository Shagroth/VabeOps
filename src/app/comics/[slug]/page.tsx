import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { ComicPanel } from "@/components/comics/ComicPanel";
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
    <div className="flex min-h-screen flex-col bg-paper text-graphite">
      <Header />
      <main id="main-content" className="flex-1">
        <section className="bg-ink py-16 text-ink-foreground">
          <div className="mx-auto max-w-[820px] px-6 lg:px-10">
            <Link href="/comics" className="font-mono text-xs uppercase tracking-[0.2em] text-copper">
              ← {COMIC_SERIES.title}
            </Link>
            <h1 className="mt-3 max-w-[32ch] text-[2.25rem] font-semibold tracking-tight sm:text-[2.75rem]">
              {episode.title}
            </h1>
            <p className="mt-4 max-w-[62ch] text-ink-muted">{episode.summary}</p>
          </div>
        </section>

        <section className="mx-auto max-w-[820px] px-6 py-12 lg:px-10">
          <p className="mb-6 text-sm text-graphite-muted">
            Диалог ниже — это одновременно и комикс, и его текстовая расшифровка: весь текст
            доступен как обычный текст страницы, независимо от того, видны ли иллюстрации.
          </p>
          <ol className="flex flex-col gap-4">
            {episode.panels.map((panel, i) => (
              <ComicPanel key={i} panel={panel} index={i} />
            ))}
          </ol>
        </section>
      </main>
      <Footer />
    </div>
  );
}
