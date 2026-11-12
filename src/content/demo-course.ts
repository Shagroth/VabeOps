// Content for the one fully walkable free demo course (brief §6):
// "Первый агентный workflow в существующем репозитории: от постановки
// задачи до проверенного патча". Pure data — no component logic here so
// the copy can be reviewed/edited without touching DemoCourseFlow.tsx.

export const DEMO_COURSE_META = {
  slug: "first-agentic-workflow",
  title: "Первый агентный workflow в существующем репозитории",
  dek: "От постановки задачи до проверенного патча — на компактном реалистичном кейсе с существующим TypeScript-сервисом скидок.",
  totalSteps: 7,
};

export const EXISTING_CONTRACT = `// src/services/discount.ts
export function calculateDiscount(customer: Customer, order: Order): number {
  if (customer.tier === "enterprise") return order.total * 0.15;
  if (customer.tier === "pro") return order.total * 0.08;
  return 0;
}`;

export const TASK_GOAL =
  "Добавить лояльность enterprise-клиентам: если enterprise-клиент с нами 2+ года, скидка увеличивается ещё на 5%.";

export const TASK_CONSTRAINTS = [
  "Сигнатура calculateDiscount(customer, order): number не меняется — это публичный контракт, вызывающий код трогать нельзя.",
  "Не вводить новую архитектуру (классы, реестры правил) ради одной дополнительной строки логики.",
  "Существующее поведение для pro и обычных клиентов не меняется.",
];

export const TASK_DONE_CRITERIA = [
  "Все существующие тесты calculateDiscount проходят без изменений.",
  "Новый тест на enterprise-клиента с yearsActive >= 2 проходит.",
  "Сигнатура функции и путь импорта не изменились.",
];

export type ContextFileChoice = {
  path: string;
  description: string;
  shouldInclude: boolean;
  why: string;
};

export const CONTEXT_FILES: ContextFileChoice[] = [
  {
    path: "src/services/discount.ts",
    description: "Сама функция, которую нужно менять",
    shouldInclude: true,
    why: "Без этого файла агент физически не может предложить патч.",
  },
  {
    path: "src/services/discount.test.ts",
    description: "Существующие тесты контракта",
    shouldInclude: true,
    why: "Показывает агенту, какое поведение уже зафиксировано и не должно сломаться.",
  },
  {
    path: "src/types/customer.ts",
    description: "Тип Customer (tier, yearsActive, ...)",
    shouldInclude: true,
    why: "Нужен, чтобы агент не угадывал форму входных данных.",
  },
  {
    path: "src/services/billing-invoice-pdf.ts",
    description: "Генерация PDF-счетов — не связано со скидками",
    shouldInclude: false,
    why: "Не имеет отношения к задаче — только увеличивает контекстное окно и шанс, что агент зацепится за что-то постороннее.",
  },
  {
    path: "вся папка src/ целиком",
    description: "'На всякий случай пусть видит весь репозиторий'",
    shouldInclude: false,
    why: "Главная ошибка контекст-инжиниринга: избыток контекста без структуры не помогает агенту, а размывает, что из этого действительно ограничение задачи.",
  },
  {
    path: "src/services/auth.ts",
    description: "Аутентификация пользователей",
    shouldInclude: false,
    why: "Другой домен, другой контракт — агенту сюда не нужно и, тем более, не нужно туда писать.",
  },
];

export type BoundaryOption = {
  id: "read" | "propose" | "write" | "execute";
  label: string;
  detail: string;
  recommended: boolean;
};

export const BOUNDARY_OPTIONS: BoundaryOption[] = [
  {
    id: "read",
    label: "Только читать",
    detail: "Агент может открывать файлы, но не предлагает изменений — слишком узко для этой задачи.",
    recommended: false,
  },
  {
    id: "propose",
    label: "Читать + предлагать патч",
    detail: "Агент готовит diff и объяснение, но не применяет его сам — ты проверяешь перед записью.",
    recommended: true,
  },
  {
    id: "write",
    label: "Читать + писать без подтверждения",
    detail: "Агент сразу применяет изменения к файлу. Для этой задачи подтверждение перед записью важнее скорости.",
    recommended: false,
  },
  {
    id: "execute",
    label: "Писать + самостоятельно выполнять команды",
    detail: "Агент и меняет код, и сам решает, что запускать в терминале — избыточно для одной точечной правки.",
    recommended: false,
  },
];

export const TEST_COMMAND = "npm test -- discount.test.ts";

export const ACCEPTED_PATCH = `function calculateDiscount(customer: Customer, order: Order): number {
  if (customer.tier === "enterprise") {
    const loyaltyBonus = customer.yearsActive >= 2 ? 0.05 : 0;
    return order.total * (0.15 + loyaltyBonus);
  }
  if (customer.tier === "pro") return order.total * 0.08;
  return 0;
}`;

export const REJECTED_PATCH = `// Отвергнутая альтернатива: DiscountResolver
class DiscountResolver {
  private rules: DiscountRule[] = [
    new EnterpriseLoyaltyRule(),
    new EnterpriseBaseRule(),
    new ProRule(),
  ];
  resolve(customer: Customer, order: Order): number {
    for (const rule of this.rules) {
      if (rule.applies(customer)) return rule.apply(customer, order);
    }
    return 0;
  }
}
// calculateDiscount(customer, order) {
//   return new DiscountResolver().resolve(customer, order);
// }`;

export const REJECTED_REASON =
  "Решает ту же задачу, но вводит реестр правил и три новых класса ради одной дополнительной строки логики. Сигнатура formально сохраняется, но растёт площадь ревью и тестирования без реального выигрыша — пока в правилах нет комбинаторной сложности, которая оправдывала бы абстракцию.";

export const TEST_OUTPUT = `$ npm test -- discount.test.ts

 PASS  src/services/discount.test.ts
  calculateDiscount
    ✓ enterprise tier gets base 15% (3 ms)
    ✓ pro tier gets 8% (1 ms)
    ✓ unknown tier gets 0% (1 ms)
    ✓ enterprise + 2+ years gets 20% total (1 ms)
    ✓ enterprise + <2 years stays at 15% (1 ms)

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total`;

export const CONDITIONS_CHANGED_PROMPT =
  "Условия изменились: скидка теперь должна также зависеть от региона клиента (EU/US/other) и от даты заключения контракта (старые контракты сохраняют прежние условия). Веток станет не 2-3, а больше десятка комбинаций.";

export type ConditionsChoice = {
  id: "keep-branching" | "introduce-structure";
  label: string;
  consequence: string;
};

export const CONDITIONS_CHOICES: ConditionsChoice[] = [
  {
    id: "keep-branching",
    label: "Продолжать расширять if/else в той же функции",
    consequence:
      "Работает ещё один шаг, но вложенность и число комбинаций tier×регион×дата контракта уже плохо читается и почти не тестируется по отдельности. Риск регрессии в необновлённой ветке растёт с каждым новым условием.",
  },
  {
    id: "introduce-structure",
    label: "Теперь ввести структуру (таблицу правил или аналог отклонённого DiscountResolver)",
    consequence:
      "Это именно условие пересмотра, зафиксированное на шаге 4: комбинаторная сложность, которой раньше не было, появилась. Абстракция, отклонённая для одной строки, теперь окупает себя — но контракт calculateDiscount всё ещё не меняется, меняется только то, что происходит внутри.",
  },
];

export const DEMO_SUBMISSION_SUMMARY =
  "Ссылка на патч: enterprise-клиенты 2+ года получают +5% к базовой скидке, сигнатура calculateDiscount не изменена, 5/5 тестов зелёные.";

export const DEMO_MENTOR_FEEDBACK =
  "Демо-фидбек ментора: подход верный — минимальное расширение существующей ветки, а не преждевременная абстракция. Один момент на доработку: добавь тест на граничное значение yearsActive === 2 явно (сейчас оно покрыто неявно через >= 2) — так следующий инженер увидит границу, не читая реализацию.";

export const DEMO_REVISION_NOTE =
  "Доработка: добавлен отдельный тест-кейс 'enterprise + ровно 2 года получает бонус' с явным именем, подтверждающим границу.";

export const DEMO_FINAL_STATE = "Принято. Финальная версия патча и тестов — в истории версий этой сдачи.";
