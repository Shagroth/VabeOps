import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { CourseProgramOverview } from "@/components/demo-course/CourseProgramOverview";

export const metadata: Metadata = {
  title: "Инженерная работа с ИИ — программа курса",
  description: "Практический курс VabeOps с пятью инженерными домашними работами: агенты, контекст, Skills, MCP, guardrails и мультиагентные системы.",
  alternates: { canonical: "/demo-course" },
  openGraph: {
    title: "Инженерная работа с ИИ — программа курса",
    description: "Пять модулей и пять инженерных домашних работ про ИИ — без секретных промптов, магии и мультиагентного театра.",
    type: "website",
  },
};

export default function DemoCoursePage() {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-graphite">
      <Header />
      <main id="main-content" className="flex-1">
        <CourseProgramOverview />
      </main>
      <Footer />
    </div>
  );
}
