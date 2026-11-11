import type { CoverVariant } from "@/components/covers/CoverArt";

// All four are PLANNED concepts — none has a confirmed date yet, so none
// is labeled "upcoming". The flagship cohort's real kickoff/midpoint/final
// calls live in the LiveSession model and are intentionally NOT listed
// here — they stay private to the cohort, not a public workshop series.
export type EventKind = "workshop" | "clinic" | "discussion" | "office-hours";
export type EventStatus = "planned";

export type EventConcept = {
  slug: string;
  title: string;
  kind: EventKind;
  kindLabel: string;
  status: EventStatus;
  cover: CoverVariant;
  audience: string;
  outcome: string;
  description: string;
};

export const EVENTS: EventConcept[] = [
  {
    slug: "designing-safe-mcp-workflow",
    title: "Как спроектировать безопасный MCP-воркфлоу",
    kind: "workshop",
    kindLabel: "Живой воркшоп",
    status: "planned",
    cover: "gate",
    audience: "Инженеры, которые уже пробовали MCP и столкнулись с вопросом прав доступа",
    outcome: "Рабочий чек-лист для первой безопасной MCP-интеграции в своём проекте",
    description:
      "Разбираем на реальном примере, как спроектировать MCP-интеграцию так, чтобы агент получил ровно те права, которые нужны для задачи — не больше. Формат: совместный разбор + вопросы.",
  },
  {
    slug: "reviewing-agent-generated-changes",
    title: "Ревью изменений, которые сделал агент",
    kind: "clinic",
    kindLabel: "Практическая клиника",
    status: "planned",
    cover: "verify",
    audience: "Тимлиды и сеньоры, принимающие PR от коллег, использующих агентов",
    outcome: "Набор вопросов для ревью, которые ловят проблему до мержа, а не после",
    description:
      "Клиника про то, как ревьюить diff, когда 'автор' — агент: на что смотреть в первую очередь, какие тесты обязательны, и как отличить 'выглядит готово' от 'реально готово'.",
  },
  {
    slug: "when-more-agents-make-it-worse",
    title: "Когда больше агентов — это хуже, а не лучше",
    kind: "discussion",
    kindLabel: "Открытое обсуждение",
    status: "planned",
    cover: "multi-agent",
    audience: "Все, кто пробовал мультиагентные схемы и столкнулся с лишней сложностью",
    outcome: "Общий разбор 2-3 кейсов от участников вживую",
    description:
      "Формат без слайдов: участники приносят свои кейсы мультиагентных архитектур, разбираем вместе — где координация между агентами реально окупается, а где это сложность ради сложности.",
  },
  {
    slug: "office-hours-mcp-review",
    title: "Office hours: разбор ваших MCP-интеграций",
    kind: "office-hours",
    kindLabel: "Office hours",
    status: "planned",
    cover: "broadcast",
    audience: "Участники пилота с готовой или почти готовой MCP-интеграцией",
    outcome: "Точечная обратная связь по вашей конкретной интеграции",
    description:
      "Небольшая группа, разбор конкретных интеграций участников вживую — права доступа, обработка ошибок, откат при сбое.",
  },
];

export function getEventBySlug(slug: string) {
  return EVENTS.find((e) => e.slug === slug);
}
