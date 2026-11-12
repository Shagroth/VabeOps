import Link from "next/link";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { JournalCard } from "@/components/cards/JournalCard";
import { JOURNAL, getFeaturedJournal, type JournalCategory } from "@/content/journal";

export const metadata = { title: "Журнал" };

const CATEGORIES: JournalCategory[] = [
  "Инженерные заметки",
  "Безопасность",
  "Инструменты",
  "Полевые тесты",
  "Аналитика",
];

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const active = CATEGORIES.includes(category as JournalCategory) ? (category as JournalCategory) : undefined;
  const featured = getFeaturedJournal();
  const rest = JOURNAL.filter((j) => j.slug !== featured.slug);
  const filtered = active ? rest.filter((j) => j.category === active) : rest;

  return (
    <div className="flex min-h-screen flex-col bg-paper text-graphite">
      <Header />
      <main id="main-content" className="flex-1">
        <section className="bg-ink py-16 text-ink-foreground">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-copper">
              Journal
            </span>
            <h1 className="mt-3 max-w-[32ch] text-[2.375rem] font-semibold tracking-tight sm:text-[3rem]">
              Полевые заметки
            </h1>
            <p className="mt-4 max-w-[62ch] text-ink-muted">
              Авторская редакция, а не лента новостей про ИИ: разборы инженерных решений,
              чек-листы и короткие заметки с практики.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10">
          {!active && (
            <div className="mb-10">
              <JournalCard entry={featured} large />
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Link
              href="/journal"
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors duration-150 ${
                !active
                  ? "border-ink bg-ink text-ink-foreground"
                  : "border-hairline text-graphite-muted hover:text-graphite"
              }`}
            >
              Все
            </Link>
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                href={`/journal?category=${encodeURIComponent(c)}`}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors duration-150 ${
                  active === c
                    ? "border-ink bg-ink text-ink-foreground"
                    : "border-hairline text-graphite-muted hover:text-graphite"
                }`}
              >
                {c}
              </Link>
            ))}
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((j) => (
              <JournalCard key={j.slug} entry={j} />
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-graphite-muted">В этой категории пока нет материалов.</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
