import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { CharacterAvatar } from "@/components/comics/CharacterAvatar";
import { CHARACTERS, COMIC_SERIES, EPISODE_1 } from "@/content/comics";

export const metadata: Metadata = {
  title: COMIC_SERIES.title,
  description: COMIC_SERIES.description,
  alternates: { canonical: "/comics" },
};

export default function ComicsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-graphite">
      <Header />
      <main id="main-content" className="flex-1">
        <section className="bg-ink py-16 text-ink-foreground">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-copper">
              Комиксы
            </span>
            <h1 className="mt-3 max-w-[32ch] text-[2.375rem] font-semibold tracking-tight sm:text-[3rem]">
              {COMIC_SERIES.title}
            </h1>
            <p className="mt-4 max-w-[62ch] text-ink-muted">{COMIC_SERIES.description}</p>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10">
          <h2 className="text-lg font-semibold">Постоянные герои</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {CHARACTERS.map((c) => (
              <div key={c.id} className="flex flex-col gap-3 rounded-2xl border border-hairline bg-white/60 p-5">
                <CharacterAvatar id={c.id} className="h-16 w-16" />
                <h3 className="font-medium">{c.name}</h3>
                <p className="text-sm text-graphite-muted">{c.role}</p>
                <p className="text-xs text-graphite-muted">
                  <span className="font-medium text-graphite">Слепое пятно: </span>
                  {c.blindSpot}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-6 pb-20 lg:px-10">
          <h2 className="text-lg font-semibold">Эпизоды</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Link
              href={`/comics/${EPISODE_1.slug}`}
              className="card-hover flex flex-col gap-2 rounded-2xl border border-hairline bg-white/60 p-6"
            >
              <span className="font-mono text-[10px] uppercase tracking-wide text-graphite-muted">
                Эпизод {EPISODE_1.order}
              </span>
              <h3 className="text-lg font-medium">{EPISODE_1.title}</h3>
              <p className="text-sm text-graphite-muted">{EPISODE_1.summary}</p>
              <span className="mt-2 text-sm font-medium text-ink underline underline-offset-4">
                Читать →
              </span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
