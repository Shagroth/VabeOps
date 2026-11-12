// Module 01 is intentionally stored as reviewable data. The interactive client
// renders it, but course editors can change the teaching copy without touching
// state transitions or browser APIs.

export const DEMO_COURSE_META = {
  slug: "contract-before-agent",
  eyebrow: "Модуль 01 · Agentic mindset",
  title: "Сначала контракт, потом агент",
  dek: "Научись ставить агенту инженерную задачу так, чтобы скорость не превращалась в потерю контроля.",
  duration: "45–60 минут",
  level: "любой инженер",
  result: "Agent Task Contract для реальной рабочей задачи",
  totalSteps: 7,
};

export const MODULE_STEPS = [
  { id: "incident", index: "00", label: "Инцидент", short: "Почему «готово» не значит «верно»" },
  { id: "modes", index: "01", label: "Три режима", short: "Чат, copilot или агент" },
  { id: "anatomy", index: "02", label: "Анатомия", short: "Семь полей контракта" },
  { id: "lab", index: "03", label: "Лаборатория", short: "Собери свой контракт" },
  { id: "review", index: "04", label: "Красная команда", short: "Найди скрытые риски" },
  { id: "gate", index: "05", label: "Review gate", short: "Разрешить, остановить, уточнить" },
  { id: "artifact", index: "06", label: "Артефакт", short: "Забери контракт в работу" },
] as const;

export const INCIDENT = {
  ticket: "Добавить enterprise-клиентам бонус +5% после двух лет с нами.",
  agentReport: "Готово. Обновил расчёт скидки, поправил типы и тесты. 42/42 теста проходят.",
  damage: [
    "Агент заменил денежный результат discountCents на процент discountRate.",
    "Все внутренние тесты были переписаны под новую сигнатуру — поэтому они зелёные.",
    "Существующий TypeScript-сервис счетов продолжил ожидать сумму в центах.",
  ],
  lesson:
    "Агент оптимизировал задачу, которую увидел. Инженер не зафиксировал контракт, который нельзя было менять.",
};

export const WORK_MODES = [
  {
    id: "chat",
    title: "Чат",
    command: "объясни / сравни / придумай",
    autonomy: "Нет доступа к среде",
    useWhen: "Нужно прояснить мысль, исследовать варианты или подготовить черновик.",
  },
  {
    id: "copilot",
    title: "Copilot",
    command: "предложи рядом со мной",
    autonomy: "Локальная помощь",
    useWhen: "Ты ведёшь работу сам, а модель ускоряет отдельный шаг.",
  },
  {
    id: "agent",
    title: "Агент",
    command: "исследуй → измени → проверь",
    autonomy: "Действует в среде",
    useWhen: "Есть проверяемый результат, ясные границы и право выполнить несколько шагов.",
  },
] as const;

export const MODE_SCENARIO =
  "Нужно найти причину падения трёх интеграционных тестов, предложить минимальный патч и остановиться перед записью в файлы.";

export const CONTRACT_FIELDS = [
  {
    key: "goal",
    number: "01",
    title: "Цель",
    prompt: "Какое изменение должно появиться для пользователя или системы?",
    antiPattern: "«Разберись со скидками»",
  },
  {
    key: "state",
    number: "02",
    title: "Текущее состояние",
    prompt: "Что уже существует и какой контракт действует сейчас?",
    antiPattern: "Заставить агента угадывать архитектуру",
  },
  {
    key: "scope",
    number: "03",
    title: "Scope",
    prompt: "Что можно читать и менять — и что явно вне задачи?",
    antiPattern: "«Весь репозиторий, если понадобится»",
  },
  {
    key: "constraints",
    number: "04",
    title: "Ограничения",
    prompt: "Какие совместимости, правила и свойства нельзя нарушить?",
    antiPattern: "Описать только желаемое новое поведение",
  },
  {
    key: "permissions",
    number: "05",
    title: "Права",
    prompt: "Что агент делает сам, а перед чем обязан остановиться?",
    antiPattern: "Дать право записи и запуска команд по умолчанию",
  },
  {
    key: "done",
    number: "06",
    title: "Definition of Done",
    prompt: "Какие наблюдаемые проверки доказывают готовность?",
    antiPattern: "«Код выглядит хорошо»",
  },
  {
    key: "stop",
    number: "07",
    title: "Stop conditions",
    prompt: "При какой неопределённости или опасности агент прекращает работу?",
    antiPattern: "Надеяться, что агент сам почувствует риск",
  },
] as const;

export type ContractKey = (typeof CONTRACT_FIELDS)[number]["key"];
export type AgentContract = Record<ContractKey, string>;

export const CONTRACT_TEMPLATE: AgentContract = {
  goal:
    "Добавить enterprise-клиентам, активным 2+ года, дополнительные 5% скидки при расчёте заказа.",
  state:
    "calculateDiscount(customer, order) возвращает сумму скидки в центах. Базовая enterprise-скидка — 15%. Сигнатура публичная и используется сервисом счетов.",
  scope:
    "Можно читать discount.ts, discount.test.ts и тип Customer. Изменять — только discount.ts и его тесты. Billing и публичные типы вне scope.",
  constraints:
    "Не менять сигнатуру и единицы измерения результата. Не менять поведение pro/обычных клиентов. Не вводить новую архитектуру ради одного правила.",
  permissions:
    "Можно читать файлы и запускать целевые тесты. Сначала показать план и diff; запись в файлы — только после подтверждения.",
  done:
    "Существующие тесты проходят без изменений; добавлены кейсы для 1, 2 и 3 лет; публичная сигнатура и импорт не изменились.",
  stop:
    "Остановиться, если yearsActive отсутствует в типе, требуется миграция данных, ломается существующий тест или нужен файл вне scope.",
};

export const WEAK_REQUEST = `Исправь скидки для старых enterprise-клиентов.
Посмотри репозиторий, внеси нужные изменения и убедись, что всё работает.`;

export const REVIEW_RISKS = [
  { id: "contract", label: "Не зафиксирован публичный контракт и единица измерения", correct: true },
  { id: "scope", label: "Нет границы файлов и систем, которые можно менять", correct: true },
  { id: "permissions", label: "Агенту не сказано, где остановиться перед записью", correct: true },
  { id: "done", label: "«Всё работает» нельзя независимо проверить", correct: true },
  { id: "persona", label: "Не назначена ролевая персона senior-разработчика", correct: false },
] as const;

export const AGENT_PLAN = [
  "Открыть реализацию calculateDiscount и существующие тесты.",
  "Проверить тип Customer и наличие yearsActive.",
  "Подготовить минимальный diff без изменения сигнатуры.",
  "Показать diff и дождаться подтверждения перед записью.",
  "После подтверждения применить патч и запустить только целевые тесты.",
];

export const RUBRIC = [
  "Цель описывает результат, а не активность",
  "Текущий контракт назван явно",
  "Scope содержит границы «можно / нельзя»",
  "Права отделяют чтение, запись и выполнение",
  "Definition of Done можно проверить",
  "Есть конкретные условия остановки",
];

export function formatContract(contract: AgentContract) {
  return `# Agent Task Contract

## 1. Цель
${contract.goal}

## 2. Текущее состояние и контракт
${contract.state}

## 3. Scope
${contract.scope}

## 4. Ограничения
${contract.constraints}

## 5. Права и review gates
${contract.permissions}

## 6. Definition of Done
${contract.done}

## 7. Stop conditions
${contract.stop}`;
}
