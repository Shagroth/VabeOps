import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { getPublishedSignals } from "@/content/signals";

export const metadata: Metadata = {
  title: "Signals",
  description: "Короткие авторские заметки и курируемые внешние ссылки об агентной инженерии.",
  alternates: { canonical: "/signals" },
};

export default function SignalsPage() {
  const signals = getPublishedSignals();

  return (
    <div className="flex min-h-screen flex-col bg-paper text-graphite">
      <Header />
      <main id="main-content" className="flex-1">
        <section className="bg-ink py-16 text-ink-foreground">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-copper">Signals</span>
            <h1 className="mt-3 max-w-[32ch] text-[2.375rem] font-semibold tracking-tight sm:text-[3rem]">
              Короткие сигналы из практики
            </h1>
            <p className="mt-4 max-w-[62ch] text-ink-muted">
              Быстрее статьи, конкретнее новостной ленты: что произошло и почему это важно
              инженеру, который работает с агентами. Оригинальные заметки и курируемые вручную
              внешние материалы — без автоматической агрегации.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[900px] px-6 py-16 lg:px-10">
          <ul className="flex flex-col gap-4">
            {signals.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/signals/${s.slug}`}
                  className="card-hover block rounded-2xl border border-hairline bg-white/60 p-6"
                >
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-wide text-graphite-muted">
                    <span className={s.kind === "original" ? "text-copper" : "text-system"}>
                      {s.kind === "original" ? "Оригинал" : "Внешний источник"}
                    </span>
                    <span>· {s.publishedAt}</span>
                    {s.tags.map((t) => (
                      <span key={t}>· {t}</span>
                    ))}
                  </div>
                  <h2 className="mt-2 text-lg font-medium leading-snug">{s.title}</h2>
                  <p className="mt-1 text-sm text-graphite-muted">{s.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
