import type { Metadata } from "next";
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
            <span className={signal.kind === "original" ? "text-copper" : "text-system"}>
              {signal.kind === "original" ? "Оригинал" : "Внешний источник"}
            </span>
            {signal.sourceIsPlaceholder && (
              <span className="rounded-full border border-warn/40 bg-warn/10 px-2 py-0.5 text-warn">
                Демо / плейсхолдер
              </span>
            )}
            <span className="text-graphite-muted">· {signal.publishedAt} · {signal.author}</span>
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
                Мы не копируем текст источника — только комментарий выше и ссылка.
              </p>
              {signal.sourceIsPlaceholder ? (
                <>
                  <p className="mt-2 inline-flex items-center gap-2 font-medium text-graphite-muted">
                    <span className="rounded-full border border-warn/40 bg-warn/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-warn">
                      Демо / плейсхолдер
                    </span>
                    Читать источник →
                  </p>
                  <p className="mt-2 text-xs text-warn">
                    Это технический плейсхолдер для скелета платформы, не реальный материал —
                    ссылка намеренно не кликабельна. Перед публикацией редактор заменяет её на
                    настоящий источник с атрибуцией.
                  </p>
                </>
              ) : (
                <a href={signal.sourceUrl} className="mt-2 inline-block font-medium text-ink underline">
                  Читать источник →
                </a>
              )}
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
