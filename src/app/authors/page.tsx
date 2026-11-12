import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { AUTHORS } from "@/content/authors";

export const metadata: Metadata = {
  title: "Авторы",
  description: "Кто ведёт курсы и материалы VabeOps.",
  alternates: { canonical: "/authors" },
};

export default function AuthorsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-graphite">
      <Header />
      <main id="main-content" className="flex-1">
        <section className="bg-ink py-16 text-ink-foreground">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-system">Авторы</span>
            <h1 className="mt-3 max-w-[32ch] text-[2.375rem] font-semibold tracking-tight sm:text-[3rem]">
              Кто ведёт VabeOps
            </h1>
            <p className="mt-4 max-w-[62ch] text-ink-muted">
              VabeOps задуман как платформа с несколькими авторами. Сейчас в системе один
              профиль — явно демонстрационный, см. пометку на карточке ниже.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {AUTHORS.map((a) => (
              <Link
                key={a.slug}
                href={`/authors/${a.slug}`}
                className="card-hover flex flex-col gap-3 rounded-2xl border border-hairline bg-white/60 p-6"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink font-mono text-sm text-ink-foreground">
                  {a.avatarGlyph}
                </div>
                {a.isDemo && (
                  <span className="w-fit rounded-full border border-warn/40 bg-warn/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-warn">
                    Демо-профиль
                  </span>
                )}
                <h2 className="text-lg font-medium">{a.displayName}</h2>
                <p className="text-sm text-graphite-muted">{a.title}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
