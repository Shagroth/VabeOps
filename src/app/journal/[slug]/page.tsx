import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { CoverArt } from "@/components/covers/CoverArt";
import { JOURNAL, JOURNAL_SOURCES_CHECKED, getJournalBySlug } from "@/content/journal";

export function generateStaticParams() {
  return JOURNAL.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getJournalBySlug(slug);
  if (!entry) return {};
  return {
    title: entry.title,
    description: entry.dek,
    alternates: { canonical: `/journal/${entry.slug}` },
    openGraph: { title: entry.title, description: entry.dek, type: "article" },
  };
}

export default async function JournalDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getJournalBySlug(slug);
  if (!entry) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-paper text-graphite">
      <Header />
      <main id="main-content" className="flex-1">
        <article className="mx-auto max-w-[760px] px-6 py-16 lg:px-10">
          <Link href="/journal" className="text-sm text-graphite-muted hover:text-graphite">
            ← Все статьи
          </Link>

          <div className="mt-6 overflow-hidden rounded-2xl border border-hairline">
            <div className="aspect-[16/8]">
              <CoverArt variant={entry.cover} tone="paper" className="h-full w-full" />
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2 font-mono text-xs uppercase tracking-wide">
            <span className="text-copper">{entry.category}</span>
            <span className="text-graphite-muted">· {entry.format}</span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{entry.title}</h1>
          <p className="mt-4 text-lg text-graphite-muted">{entry.dek}</p>

          <div className="mt-10 flex flex-col gap-5">
            {entry.body.map((block, i) => {
              if (block.type === "h3") {
                return (
                  <h2 key={i} className="mt-4 text-xl font-semibold tracking-tight">
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "code") {
                return (
                  <pre
                    key={i}
                    className="overflow-x-auto rounded-xl border border-hairline bg-ink p-4 font-mono text-xs leading-relaxed text-ink-foreground"
                  >
                    {block.text}
                  </pre>
                );
              }
              if (block.type === "list") {
                return (
                  <ul key={i} className="flex flex-col gap-2 text-sm">
                    {block.items.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-signal" />
                        <span className="text-graphite">{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={i} className="text-[0.95rem] leading-relaxed text-graphite">
                  {block.text}
                </p>
              );
            })}
          </div>

          <section className="mt-12 border-t-[1.5px] border-graphite pt-6" aria-labelledby="sources-title">
            <h2 id="sources-title" className="text-xl font-bold tracking-[-0.015em]">
              Источники
            </h2>
            <ol className="mt-4 flex flex-col">
              {entry.sources.map((source, i) => (
                <li key={source.url} className="grid grid-cols-[36px_1fr] gap-x-2 border-b border-hairline py-3 text-[15px]">
                  <span className="font-mono text-string">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="kg-link font-semibold">
                      {source.title}
                    </a>
                    <span className="block text-graphite-muted">
                      {source.publisher}
                      {source.date ? ` · ${source.date}` : ""}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm text-graphite-muted">
              Источники открыты и прочитаны {JOURNAL_SOURCES_CHECKED}. Страницы документации обновляются, со
              временем формулировки в них могут измениться.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
