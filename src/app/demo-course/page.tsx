import type { Metadata } from "next";
import { CourseLanding } from "@/components/course/CourseLanding";
import { COURSES } from "@/content/course-catalog";
import { PROGRAM_TOTALS } from "@/content/demo-course-program";

export const metadata: Metadata = {
  title: "KiteGrip for Engineers — курс по работе с ИИ-агентами",
  description:
    "Пять модулей для platform, DevOps, SRE и fullstack-инженеров: контракт задачи, контекст, MCP, guardrails и мультиагентные системы. Модули 1–2 открыты без регистрации.",
  alternates: { canonical: "/demo-course" },
  openGraph: {
    title: "KiteGrip for Engineers — курс по работе с ИИ-агентами",
    description: "Агенты в проде под твоим контролем. Первые два модуля открыты без регистрации.",
    type: "website",
  },
};

export default function EngineersCoursePage() {
  return (
    <CourseLanding
      course={COURSES.ENGINEERS}
      totals={PROGRAM_TOTALS}
      copy={{
        eyebrow: "KiteGrip for Engineers · курс для инженеров",
        titleLine: "Агенты в проде.",
        titleLine2: "Под",
        titleAccent: "контролем.",
        lead: "Пять модулей для тех, кто уже держит прод. Контракт задачи, контекст, MCP, guardrails и мультиагентные системы — с плотной теорией, сценарными вопросами и задачами по твоей роли.",
        panelTone: "sky",
        chipTop: "агент летит быстро",
        chipBottom: "решение — твоё",
        audience: [
          { title: "Platform и DevOps", detail: "Агент рядом с Terraform, кластерами и пайплайнами: что ему можно, что требует plan и подтверждения, а что запрещено технически." },
          { title: "SRE", detail: "Агент на инциденте и вокруг алертов: чтение прода без права записи, проверяемые гипотезы и решения, которые остаются за дежурным." },
          { title: "Fullstack", detail: "Агент в продуктовой разработке: контракт API, миграции и проверка, которая умеет падать, прежде чем изменение уйдёт в основную ветку." },
        ],
        programTitle: "Пять модулей от контракта задачи до нескольких агентов",
        howText:
          "Каждый модуль начинается с инцидента. Дальше четыре шага теории со схемой, сценарным вопросом и задачей по твоей роли. В конце ты собираешь рабочий артефакт и забираешь его в Markdown.",
        howNodes: [
          { label: "Инцидент", note: "что пошло не так и почему" },
          { label: "Теория и схемы", note: "четыре шага инженерного уровня", tone: "sky" },
          { label: "Задачи по ролям", note: "platform, DevOps, SRE, fullstack" },
          { label: "Лаборатория", note: "на твоей рабочей задаче" },
          { label: "Артефакт", note: "контракт, политика, карта системы", tone: "ink" },
        ],
        cohortText:
          "Первые два модуля можно пройти прямо сейчас. Модули 3–5 и разбор домашних работ открываются участникам потока в личном кабинете. Сейчас идёт набор в закрытый бесплатный пилот: 5 мест, старт в декабре 2026.",
        applyLabel: "Подать заявку на пилот",
      }}
    />
  );
}
