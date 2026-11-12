import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { AUTHORS, getAuthorBySlug } from "@/content/authors";

export function generateStaticParams() {
  return AUTHORS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) return {};
  return {
    title: `${author.displayName} — Авторы`,
    description: author.title,
    alternates: { canonical: `/authors/${author.slug}` },
  };
}

export default async function AuthorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-paper text-graphite">
      <Header />
      <main id="main-content" className="flex-1">
        <article className="mx-auto max-w-[720px] px-6 py-16 lg:px-10">
          <Link href="/authors" className="text-sm text-graphite-muted hover:text-graphite">
            ← Все авторы
          </Link>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink font-mono text-base text-ink-foreground">
              {author.avatarGlyph}
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{author.displayName}</h1>
              <p className="text-sm text-graphite-muted">{author.title}</p>
            </div>
          </div>

          {author.isDemo && (
            <p className="mt-6 rounded-xl border border-warn/40 bg-warn/10 p-4 text-sm text-warn">
              Демо-профиль автора — заменить перед публичным запуском. Вымышленный персонаж:
              не привязан к реальному человеку, компании, наградам или отзывам.
            </p>
          )}

          <p className="mt-6 text-[0.95rem] leading-relaxed text-graphite">{author.bio}</p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
