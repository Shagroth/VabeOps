import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { CharacterAvatar } from "@/components/comics/CharacterAvatar";
import { ComicScene } from "@/components/comics/ComicScene";
import { CHARACTERS, COMIC_SERIES, EPISODE_1 } from "@/content/comics";

export const metadata: Metadata = {
  title: COMIC_SERIES.title,
  description: COMIC_SERIES.description,
  alternates: { canonical: "/comics" },
};

export default function ComicsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-[17px] text-graphite">
      <Header />
      <main id="main-content" className="flex-1">
        <section className="mx-auto max-w-[1280px] px-5 pb-12 pt-12 sm:px-8">
          <span className="font-mono text-sm uppercase tracking-[0.1em] text-graphite-muted">Комиксы</span>
          <h1 className="mt-4 text-[clamp(40px,6vw,80px)] font-extrabold leading-[0.96] tracking-[-0.045em]">{COMIC_SERIES.title}</h1>
          <p className="mt-5 max-w-[36em] text-[19px] leading-[1.6] text-graphite-soft">{COMIC_SERIES.description}</p>
        </section>

        <section className="mx-auto max-w-[1280px] px-5 pb-16 sm:px-8">
          <Link
            href={`/comics/${EPISODE_1.slug}`}
            className="kg-card grid overflow-hidden rounded-[28px] border-[2.5px] border-graphite bg-white lg:grid-cols-[1.1fr_0.9fr]"
          >
            <ComicScene
              scene="cover"
              alt={EPISODE_1.panels[0].sceneAlt}
              className="aspect-[800/460] w-full border-b-[2.5px] border-graphite lg:border-b-0 lg:border-r-[2.5px]"
            />
            <div className="flex flex-col gap-4 p-7 sm:p-9">
              <span className="font-mono text-[13px] uppercase tracking-[0.08em] text-graphite-muted">
                <span className="mr-2 text-string">0{EPISODE_1.order}</span>Эпизод · {EPISODE_1.panels.length} слайдов
              </span>
              <h2 className="text-[clamp(26px,3vw,36px)] font-extrabold leading-[1.05] tracking-[-0.03em]">{EPISODE_1.title}</h2>
              <p className="leading-relaxed text-graphite-soft">{EPISODE_1.summary}</p>
              <span className="mt-auto inline-flex min-h-12 items-center gap-2 self-start rounded-full bg-signal px-6 font-semibold text-signal-ink">
                Читать <span aria-hidden="true" className="kg-arrow">→</span>
              </span>
            </div>
          </Link>
        </section>

        <section className="border-t border-hairline bg-white">
          <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8">
            <h2 className="text-[26px] font-extrabold tracking-[-0.03em]">Постоянные герои</h2>
            <div className="mt-6 grid gap-x-7 gap-y-8 sm:grid-cols-3">
              {CHARACTERS.map((c) => (
                <div key={c.id} className="flex flex-col gap-3 border-t-[1.5px] border-graphite pt-5">
                  <CharacterAvatar id={c.id} className="h-16 w-16" />
                  <h3 className="text-[23px] font-bold tracking-[-0.015em]">{c.name}</h3>
                  <p className="text-graphite-soft">{c.role}</p>
                  <p className="text-[15px] text-graphite-muted">
                    <span className="font-semibold text-graphite">Слепое пятно. </span>
                    {c.blindSpot}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
