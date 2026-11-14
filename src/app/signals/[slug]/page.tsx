import type { Metadata } from "next";
import { SHOW_AUTHORS } from "@/content/authors";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { SIGNALS, getSignalBySlug } from "@/content/signals";

export function generateStaticParams() {
  return SIGNALS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const signal = getSignalBySlug(slug);
  if (!signal) return {};
  return {
    title: `${signal.title} — Signals`,
    description: signal.summary,
    alternates: { canonical: `/signals/${signal.slug}` },
  };
}

export default async function SignalDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const signal = getSignalBySlug(slug);
  if (!signal) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-paper text-graphite">
      <Header />
      <main id="main-content" className="flex-1">
        <article className="mx-auto max-w-[720px] px-6 py-16 lg:px-10">
          <Link href="/signals" className="text-sm text-graphite-muted hover:text-graphite">
            ← Все signals
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-wide">
            <span className="text-system">{signal.sourceName ?? "Заметка редакции"}</span>
            <span className="text-graphite-muted">· {signal.publishedAt}{SHOW_AUTHORS ? ` · ${signal.author}` : ""}</span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{signal.title}</h1>

          <p className="mt-6 text-[0.95rem] leading-relaxed text-graphite">{signal.summary}</p>

          <div className="mt-6 rounded-xl border border-signal/40 bg-signal/10 p-5">
            <span className="font-mono text-[10px] uppercase tracking-wide text-graphite-muted">
              Почему это важно инженеру
            </span>
            <p className="mt-1 text-sm text-graphite">{signal.whyItMatters}</p>
          </div>

          {signal.kind === "external" && signal.sourceUrl && (
            <div className="mt-6 rounded-xl border border-hairline bg-white/50 p-5 text-sm">
              <p className="text-graphite-muted">
                Мы не копируем текст источника: выше наш пересказ, ниже ссылка на оригинал.
              </p>
              <a href={signal.sourceUrl} target="_blank" rel="noopener noreferrer" className="kg-link mt-2 inline-block font-semibold text-ink">
                Читать первоисточник{signal.sourceName ? `: ${signal.sourceName}` : ""} →
              </a>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-2">
            {signal.tags.map((t) => (
              <span key={t} className="rounded-full border border-hairline px-3 py-1 text-xs text-graphite-muted">
                {t}
              </span>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
