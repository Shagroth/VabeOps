import type { Metadata } from "next";
import { ApplyForm } from "@/components/ApplyForm";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Заявка на пилот",
  description: "Заявка на закрытый бесплатный пилот KiteGrip for Engineers: 5 мест, 5–7 недель, старт в декабре 2026.",
};

export default function ApplyPage() {
  return (
    <div className="flex flex-1 flex-col bg-paper text-graphite">
      <Header />
      <main id="main-content" className="mx-auto w-full max-w-[640px] flex-1 px-5 py-16 sm:px-8">
        <span className="font-mono text-sm uppercase tracking-[0.1em] text-graphite-muted">KiteGrip for Engineers</span>
        <h1 className="mt-4 text-[clamp(40px,6vw,60px)] font-extrabold leading-none tracking-[-0.035em]">Возьмись за нить.</h1>
        <p className="mb-10 mt-5 text-[19px] leading-[1.6] text-graphite-soft">
          Пять мест. Каждую заявку читаем вручную, автоматически никого не зачисляем.
        </p>
        <ApplyForm />
      </main>
      <Footer />
    </div>
  );
}
