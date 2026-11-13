export type CheckpointOption = {
  id: string;
  label: string;
};

export type PrototypeStep = {
  id: string;
  index: string;
  label: string;
  short: string;
  kicker: string;
  title: string;
  lead: string;
  minutes: number;
  notes: Array<{
    number: string;
    title: string;
    body: string;
    signal?: string;
  }>;
  caseStudy?: {
    label: string;
    title: string;
    body: string;
    signals: string[];
  };
  checkpoint?: {
    prompt: string;
    context?: string;
    options: CheckpointOption[];
    correctId: string;
    success: string;
    retry: string;
  };
};

export type LabField = {
  key: string;
  label: string;
  prompt: string;
  placeholder: string;
  example: string;
};

export type PrototypeModule = {
  number: number;
  slug: string;
  eyebrow: string;
  title: string;
  shortTitle: string;
  dek: string;
  result: string;
  guidedMinutes: [number, number];
  practiceMinutes: [number, number];
  artifactName: string;
  artifactFile: string;
  labTitle: string;
  labLead: string;
  labFields: LabField[];
  rubric: string[];
  steps: PrototypeStep[];
};

export const PROGRAM_AUTHOR = {
  name: "Игорь Ковалёв",
  initials: "ИК",
  role: "Архитектор · 10 лет в backend и platform",
};

const module2: PrototypeModule = {
  number: 2,
  slug: "context-engineering",
  eyebrow: "Модуль 02 · Context engineering",
  title: "Контекст — это система, а не свалка",
  shortTitle: "Контекст, Skills и саб-агенты",
  dek: "Научись давать модели ровно тот контекст, который меняет решение, и выносить повторяемую работу в Skill или отдельного исполнителя.",
  result: "Context Pack и спецификация Skill для реальной инженерной задачи",
  guidedMinutes: [70, 90],
  practiceMinutes: [60, 90],
  artifactName: "Context Pack + Skill Spec",
  artifactFile: "context-pack-and-skill-spec.md",
  labTitle: "Собери минимальный контекст-пакет",
  labLead: "Возьми повторяемую задачу из своей работы. Отдели факты, которые влияют на решение, от материалов «на всякий случай», а затем опиши переиспользуемую процедуру.",
  labFields: [
    { key: "task", label: "Задача и решение", prompt: "Какое решение должен принять агент?", placeholder: "Найти причину деградации p95 и подготовить план исправления…", example: "Диагностировать рост p95 в checkout-api и вернуть подтверждённую гипотезу без изменений в проде." },
    { key: "must", label: "Must-have context", prompt: "Какие 3–5 фактов безусловно меняют решение?", placeholder: "SLO, временной интервал, недавний релиз, схема метрик…", example: "SLO p95 < 400 мс; рост начался после релиза 14:20; читать можно метрики и логи; прод менять нельзя." },
    { key: "noise", label: "Не включать", prompt: "Что выглядит полезным, но только раздувает окно контекста?", placeholder: "Весь репозиторий, год логов, старые RFC…", example: "Полный монорепозиторий, логи старше 24 часов, закрытые инциденты без общей сигнатуры." },
    { key: "trigger", label: "Trigger Skill", prompt: "Когда этот Skill должен запускаться — и когда не должен?", placeholder: "Используй при… Не используй при…", example: "Используй при деградации latency одного сервиса. Не используй при межрегиональном сетевом инциденте." },
    { key: "procedure", label: "Процедура", prompt: "Какие проверяемые шаги выполняются всегда?", placeholder: "1. Зафиксировать окно… 2. Сверить deploy…", example: "Зафиксировать окно; сверить deploy; разложить latency по dependency; проверить три гипотезы; составить evidence table." },
    { key: "handoff", label: "Саб-агент и handoff", prompt: "Нужен ли отдельный исполнитель и что он обязан вернуть?", placeholder: "Саб-агент нужен только для… Возвращает…", example: "Саб-агент исследует историю изменений параллельно и возвращает SHA, diff-summary и подтверждающие ссылки; ничего не меняет." },
  ],
  rubric: [
    "Каждый элемент контекста связан с конкретным решением",
    "Шум и устаревшие источники исключены явно",
    "Trigger Skill можно проверить до запуска",
    "Процедура содержит наблюдаемые шаги, а не пожелания",
    "У handoff есть формат результата и граница полномочий",
    "Понятно, когда саб-агент не окупает координацию",
  ],
  steps: [
    {
      id: "incident", index: "00", label: "Инцидент", short: "Контекста много, ответа нет", kicker: "00 / Context failure", title: "Агент прочитал всё — и потерял задачу", minutes: 8,
      lead: "Большое окно контекста не равно хорошему контексту. Нерелевантные и конфликтующие данные создают уверенный средний ответ вместо точного решения.",
      notes: [
        { number: "01", title: "Сигнал потерялся", body: "Критическое ограничение оказалось рядом с сотнями строк, которые не влияли на решение.", signal: "signal / noise" },
        { number: "02", title: "Источники спорят", body: "Старый RFC описывал уже отменённое поведение, но выглядел авторитетнее свежего комментария.", signal: "freshness" },
        { number: "03", title: "Цели не было", body: "Агент получил документы, но не получил решения, ради которого должен их читать.", signal: "decision" },
      ],
      caseStudy: { label: "Incident / 14:40", title: "«Вот репозиторий и папка с RFC — найди проблему»", body: "Агент потратил 18 минут, сослался на устаревший ADR и предложил миграцию. Причина инцидента была в одном флаге релиза.", signals: ["12 400 строк контекста", "3 конфликтующих документа", "0 критериев релевантности"] },
      checkpoint: { prompt: "Какое первое исправление самое сильное?", options: [{ id: "more", label: "Добавить ещё логи и README" }, { id: "decision", label: "Назвать решение и минимальные доказательства для него" }, { id: "model", label: "Переключить модель на более дорогую" }], correctId: "decision", success: "Верно. Контекст проектируют от решения назад: сначала вопрос и критерий доказательства, потом источники.", retry: "Объём или модель могут помочь, но не исправят отсутствие цели и критериев релевантности." },
    },
    {
      id: "layers", index: "01", label: "Слои", short: "Четыре слоя контекста", kicker: "01 / Context layers", title: "Контекст должен отвечать на четыре разных вопроса", minutes: 12,
      lead: "Не смешивай постановку, правила, доказательства и состояние среды. Разные слои обновляются с разной скоростью и имеют разную цену ошибки.",
      notes: [
        { number: "01", title: "Task", body: "Какое решение или изменение требуется прямо сейчас.", signal: "volatile" },
        { number: "02", title: "Constraints", body: "Контракты, права и свойства, которые нельзя нарушить.", signal: "stable" },
        { number: "03", title: "Evidence", body: "Логи, diff, метрики и примеры, подтверждающие текущую гипотезу.", signal: "traceable" },
        { number: "04", title: "Environment", body: "Версии, структура, доступные инструменты и фактическое состояние системы.", signal: "observable" },
      ],
      checkpoint: { prompt: "К какому слою относится «можно читать prod-логи, но нельзя перезапускать pod»?", options: [{ id: "task", label: "Task" }, { id: "constraints", label: "Constraints" }, { id: "evidence", label: "Evidence" }], correctId: "constraints", success: "Да. Это граница полномочий; она должна пережить смену гипотезы и набора доказательств.", retry: "Это не сама задача и не доказательство. Это устойчивое правило допустимых действий." },
    },
    {
      id: "budget", index: "02", label: "Бюджет", short: "Must-have, useful, noise", kicker: "02 / Context budget", title: "Каждая строка должна окупать внимание", minutes: 12,
      lead: "Контекст — ограниченный бюджет внимания модели. Оценивай элементы не по доступности, а по вероятности изменить план или вывод.",
      notes: [
        { number: "A", title: "Must-have", body: "Без этого факта решение может стать неправильным или опасным.", signal: "include" },
        { number: "B", title: "Useful on demand", body: "Источник нужен только после появления конкретной гипотезы.", signal: "retrieve" },
        { number: "C", title: "Noise", body: "Материал не меняет решение или дублирует более свежий источник.", signal: "exclude" },
      ],
      caseStudy: { label: "Context budget", title: "Диагностика одного упавшего integration test", body: "Сначала нужны сообщение ошибки, сам тест, изменённый код и последние релевантные diff. Полный CI-лог и весь репозиторий подключаются только по гипотезе.", signals: ["must-have: 4 источника", "on-demand: 3", "noise: всё остальное"] },
      checkpoint: { prompt: "Что лучше держать on-demand?", options: [{ id: "error", label: "Точный текст ошибки" }, { id: "contract", label: "Публичный контракт функции" }, { id: "history", label: "Историю всех CI-запусков за год" }], correctId: "history", success: "Верно. История может понадобиться для тренда, но не должна заранее занимать внимание.", retry: "Ошибка и текущий контракт напрямую определяют диагностику; без них агент будет гадать." },
    },
    {
      id: "skill", index: "03", label: "Skill", short: "Процедура с границами", kicker: "03 / Skill anatomy", title: "Skill — это воспроизводимая процедура, а не длинный промпт", minutes: 15,
      lead: "Skill полезен, когда задача повторяется и у неё есть устойчивый способ работы. Он должен объяснять триггер, входы, шаги, результат и поведение при сбое.",
      notes: [
        { number: "01", title: "Trigger", body: "Наблюдаемое условие, при котором процедура действительно уместна.", signal: "when" },
        { number: "02", title: "Inputs", body: "Минимальный набор данных и доступов с проверкой их качества.", signal: "with what" },
        { number: "03", title: "Procedure", body: "Последовательность проверок, ветвления и точки остановки.", signal: "how" },
        { number: "04", title: "Output", body: "Формат артефакта, который можно проверить или передать дальше.", signal: "evidence" },
      ],
      checkpoint: { prompt: "Какой trigger описан инженерно?", options: [{ id: "help", label: "Когда пользователю нужна помощь с базой" }, { id: "signal", label: "Когда p95 query latency > 500 мс 10 минут и нет активной миграции" }, { id: "always", label: "Используй всегда для PostgreSQL" }], correctId: "signal", success: "Да. Его можно проверить до запуска, а исключение ограничивает ложные срабатывания.", retry: "Хороший trigger наблюдаем и достаточно узок, чтобы не запускать процедуру по настроению." },
    },
    {
      id: "subagent", index: "04", label: "Саб-агент", short: "Когда делегирование окупается", kicker: "04 / Delegation test", title: "Саб-агент нужен не для статуса, а для изоляции работы", minutes: 12,
      lead: "Делегирование выгодно, когда подзадачу можно сформулировать независимо, выполнить параллельно и принять по ясному handoff-контракту.",
      notes: [
        { number: "01", title: "Независимость", body: "Исполнитель не ждёт каждый промежуточный вывод основного агента.", signal: "separable" },
        { number: "02", title: "Изоляция", body: "Подзадаче полезен собственный контекст, который не нужен остальной работе.", signal: "focused" },
        { number: "03", title: "Приёмка", body: "Результат можно проверить без повторения всего исследования.", signal: "handoff" },
      ],
      checkpoint: { prompt: "Что лучше делегировать саб-агенту?", options: [{ id: "rename", label: "Переименовать одну переменную в открытом файле" }, { id: "research", label: "Параллельно проверить историю изменений API и вернуть evidence table" }, { id: "choice", label: "Решить за владельца продукта, какое поведение нужно" }], correctId: "research", success: "Верно. Подзадача независима, требует отдельного контекста и возвращает проверяемый результат.", retry: "Мелкая локальная правка не окупает handoff, а продуктовое решение нельзя делегировать как факт." },
    },
    {
      id: "lab", index: "05", label: "Лаборатория", short: "Context Pack и Skill Spec", kicker: "05 / Field lab", title: "Собери контекст, который выдержит передачу", minutes: 20,
      lead: "Ты применишь фильтр контекста и решишь, какая часть работы заслуживает Skill или отдельного исполнителя.",
      notes: [{ number: "→", title: "Шесть полей", body: "Заполни задачу, must-have, шум, trigger, процедуру и handoff. Можно загрузить готовый инженерный пример.", signal: "artifact" }],
    },
    {
      id: "artifact", index: "06", label: "Артефакт", short: "Забери спецификацию", kicker: "06 / Takeaway", title: "Контекст-пакет готов к реальной работе", minutes: 8,
      lead: "Проверь, что другой инженер поймёт, почему каждый источник здесь, а Skill не запустится вне своего сценария.",
      notes: [{ number: "✓", title: "Transfer test", body: "Артефакт должен пережить передачу другому человеку или агенту без устного брифинга.", signal: "ready" }],
    },
  ],
};

const module3: PrototypeModule = {
  number: 3,
  slug: "mcp-without-magic",
  eyebrow: "Модуль 03 · MCP и плагины",
  title: "MCP без магии: подключай возможности, а не хаос",
  shortTitle: "MCP и плагины",
  dek: "Разбери интеграцию как инженерный контракт: какие возможности открываются модели, где проходит граница ответственности и что произойдёт при ошибке.",
  result: "MCP Integration Card с матрицей прав и сценарием безопасного отказа",
  guidedMinutes: [75, 100],
  practiceMinutes: [75, 120],
  artifactName: "MCP Integration Card",
  artifactFile: "mcp-integration-card.md",
  labTitle: "Спроектируй одну безопасную MCP-интеграцию",
  labLead: "Выбери реальную систему — GitHub, Jira, Kubernetes, базу знаний или внутренний API. Опиши ценность, поверхность возможностей и минимальные права для первого сценария.",
  labFields: [
    { key: "job", label: "Job to be done", prompt: "Какой один пользовательский сценарий открывает интеграция?", placeholder: "По номеру инцидента собрать read-only evidence…", example: "По ключу Jira-задачи собрать контекст, связанные PR и статус CI в единый briefing." },
    { key: "capabilities", label: "Capabilities", prompt: "Какие tools/resources нужны, а какие не нужны?", placeholder: "read_issue, list_prs… Не нужны: edit_issue…", example: "Нужны read_issue, search_prs, read_ci. Не нужны комментарии, merge, изменение статуса и удаление." },
    { key: "permissions", label: "Permission matrix", prompt: "Раздели read, write, destructive и external communication.", placeholder: "Read: allow… Write: deny…", example: "Read — allow в одном проекте; write — deny; destructive — deny; внешние сообщения — deny." },
    { key: "contract", label: "Tool contract", prompt: "Какие входы, выходы и ошибки должны быть явными?", placeholder: "Input… Output… Errors…", example: "Input: issue key. Output: typed evidence bundle со ссылками. Errors: not_found, forbidden, partial_result." },
    { key: "failure", label: "Safe failure", prompt: "Как система ведёт себя при timeout, частичном ответе или неизвестном состоянии?", placeholder: "Остановиться… Пометить… Не повторять…", example: "Не достраивать факты; пометить partial; сделать один безопасный retry чтения; вернуть отсутствующие источники." },
    { key: "verification", label: "Проверка", prompt: "Как доказать, что интеграция не вышла за разрешённую поверхность?", placeholder: "Audit log, test tenant, capability snapshot…", example: "Capability snapshot перед запуском, тестовый проект, audit log всех tool calls и негативные тесты запрещённых действий." },
  ],
  rubric: ["Сценарий ограничен одной проверяемой ценностью", "Capability inventory разделяет чтение и мутацию", "По умолчанию выданы минимальные права", "Контракт инструмента описывает частичный результат", "Повторы безопасны или явно запрещены", "Проверка видит фактические tool calls"],
  steps: [
    { id: "incident", index: "00", label: "Инцидент", short: "Коннектор сделал лишнее", kicker: "00 / Capability leak", title: "«Найди дубликаты» превратилось в «закрой задачи»", minutes: 9, lead: "Интеграция расширяет не интеллект модели, а поверхность действий. Если инструмент умеет менять внешнюю систему, эта возможность существует даже тогда, когда она не нужна сценарию.", notes: [
      { number: "01", title: "Слишком широкий tool", body: "Один метод одновременно искал, редактировал и закрывал задачи.", signal: "coupling" },
      { number: "02", title: "Write по умолчанию", body: "Токен имел права администратора, потому что так было проще настроить.", signal: "blast radius" },
      { number: "03", title: "Нет подтверждения", body: "Внешняя мутация не имела отдельного review gate.", signal: "irreversible" },
    ], caseStudy: { label: "Postmortem / connector", title: "37 задач закрыты как дубликаты", body: "Модель верно нашла похожие тикеты, но tool contract трактовал resolve=true как действие по умолчанию. Восстановление заняло два часа.", signals: ["1 широкий токен", "0 preview", "37 внешних изменений"] }, checkpoint: { prompt: "Какое системное исправление первое?", options: [{ id: "prompt", label: "Добавить в промпт «будь осторожен»" }, { id: "split", label: "Разделить read и write capabilities, write закрыть gate-ом" }, { id: "retry", label: "Уменьшить число повторов" }], correctId: "split", success: "Да. Безопасность должна существовать в capability-модели, а не только в тексте просьбы.", retry: "Текст снижает вероятность, но не убирает доступную опасную возможность." } },
    { id: "model", index: "01", label: "Модель", short: "Host, server, tools, resources", kicker: "01 / Mental model", title: "MCP — это протокол договорённостей", minutes: 14, lead: "Раздели того, кто ведёт сессию, поставщика возможностей и конкретные объекты доступа. Так легче увидеть, где проверяются права и где рождается доверие.", notes: [
      { number: "H", title: "Host / client", body: "Управляет сессией, выбирает сервер и передаёт модели доступные возможности.", signal: "orchestration" },
      { number: "S", title: "Server", body: "Публикует tools, resources и их схемы; отвечает за исполнение и ошибки.", signal: "boundary" },
      { number: "T", title: "Tools", body: "Действия с типизированными входами, выходами и возможными побочными эффектами.", signal: "action" },
      { number: "R", title: "Resources", body: "Адресуемый контекст, который можно прочитать без скрытой мутации.", signal: "context" },
    ], checkpoint: { prompt: "Где должна окончательно проверяться авторизация на изменение Jira?", options: [{ id: "prompt", label: "В system prompt модели" }, { id: "server", label: "На MCP-сервере перед внешним вызовом" }, { id: "ui", label: "Только в интерфейсе чата" }], correctId: "server", success: "Верно. Подсказки и UI полезны, но сервер обязан сам подтвердить право на действие.", retry: "Любой клиентский слой можно обойти или неправильно интерпретировать; enforcement живёт у исполнителя." } },
    { id: "inventory", index: "02", label: "Инвентарь", short: "Карта возможностей", kicker: "02 / Capability inventory", title: "Сначала перечисли, что интеграция вообще может сделать", minutes: 12, lead: "Название плагина ничего не говорит о риске. Риск живёт в конкретной возможности, области данных и типе побочного эффекта.", notes: [
      { number: "R", title: "Read", body: "Чтение данных без изменения источника; всё ещё требует контроля приватности.", signal: "observe" },
      { number: "W", title: "Write", body: "Создание или изменение состояния, которое можно откатить.", signal: "mutate" },
      { number: "D", title: "Destructive", body: "Удаление, merge, ротация или действие с дорогим восстановлением.", signal: "gate" },
      { number: "E", title: "External communication", body: "Сообщение или публикация от имени человека либо компании.", signal: "reputation" },
    ], checkpoint: { prompt: "К какой категории относится отправка комментария в публичный issue?", options: [{ id: "read", label: "Read" }, { id: "write", label: "Только Write" }, { id: "external", label: "Write + External communication" }], correctId: "external", success: "Да. Состояние меняется, а текст ещё и представляет человека или организацию вовне.", retry: "Это не просто запись в базе: действие имеет коммуникационный и репутационный эффект." } },
    { id: "contract", index: "03", label: "Контракт", short: "Типы, ошибки, идемпотентность", kicker: "03 / Tool contracts", title: "Хороший tool не заставляет модель угадывать", minutes: 15, lead: "Схема должна объяснять семантику, а не только типы. Особенно важны единицы измерения, частичный успех, повторяемость и состояние после timeout.", notes: [
      { number: "01", title: "Inputs", body: "Названия, ограничения, единицы и допустимые комбинации параметров.", signal: "unambiguous" },
      { number: "02", title: "Outputs", body: "Типизированный результат, ссылки на источник и признак полноты.", signal: "traceable" },
      { number: "03", title: "Errors", body: "Различимые forbidden, not_found, conflict и partial вместо общего «failed».", signal: "recoverable" },
      { number: "04", title: "Idempotency", body: "Ясно, можно ли безопасно повторить вызов после неопределённого ответа.", signal: "retry" },
    ], checkpoint: { prompt: "После timeout у create_ticket неизвестно, создалась ли задача. Что нужно?", options: [{ id: "repeat", label: "Сразу повторить тот же вызов" }, { id: "key", label: "Idempotency key и проверка результата перед повтором" }, { id: "ignore", label: "Считать операцию неуспешной" }], correctId: "key", success: "Верно. Неопределённое состояние нельзя превращать в дубли слепым повтором.", retry: "Timeout не доказывает отсутствие внешнего эффекта. Нужна проверяемая идентичность операции." } },
    { id: "permissions", index: "04", label: "Права", short: "Least privilege на практике", kicker: "04 / Permission design", title: "Выдавай право под сценарий, не под продукт", minutes: 14, lead: "Первый релиз интеграции должен открывать минимальную поверхность: один tenant, ограниченный scope, read-only там, где ценность не требует мутации.", notes: [
      { number: "01", title: "Scope", body: "Один проект, namespace или набор документов вместо всей организации.", signal: "where" },
      { number: "02", title: "Action", body: "Только необходимые verbs; read не получает write «на будущее».", signal: "what" },
      { number: "03", title: "Time", body: "Короткоживущие credentials и пересмотр прав после пилота.", signal: "when" },
    ], checkpoint: { prompt: "Какой старт для briefing-бота безопаснее?", options: [{ id: "admin", label: "Org admin token, чтобы не упереться в права" }, { id: "readonly", label: "Read-only доступ только к пилотному проекту" }, { id: "personal", label: "Личный токен автора курса" }], correctId: "readonly", success: "Да. Права соответствуют одной ценности и ограничивают blast radius пилота.", retry: "Удобство настройки не оправдывает права, которые сценарий вообще не использует." } },
    { id: "lab", index: "05", label: "Лаборатория", short: "Integration Card", kicker: "05 / Integration lab", title: "Спроектируй интеграцию до подключения", minutes: 22, lead: "Зафиксируй capability surface, права, контракт и безопасный отказ. Это техническое задание и одновременно материал для security review.", notes: [{ number: "→", title: "Шесть решений", body: "Сценарий, capabilities, права, tool contract, failure mode и проверка.", signal: "artifact" }] },
    { id: "artifact", index: "06", label: "Артефакт", short: "Забери Integration Card", kicker: "06 / Takeaway", title: "Интеграция описана до первого токена", minutes: 8, lead: "Передай карточку разработчику или владельцу системы: из неё должно быть понятно, что подключаем, зачем и какой риск остаётся.", notes: [{ number: "✓", title: "Security handoff", body: "Артефакт связывает пользовательскую ценность с конкретными правами и проверками.", signal: "ready" }] },
  ],
};

const module4: PrototypeModule = {
  number: 4, slug: "guardrails", eyebrow: "Модуль 04 · Guardrails и безопасность", title: "Guardrails: свобода внутри инженерных границ", shortTitle: "Guardrails и безопасность", dek: "Построй разрешения, review gates и проверки так, чтобы агент ускорял работу, но не мог незаметно превратить неопределённость в ущерб.", result: "Agent Safety Policy и guardrail-матрица для рабочего процесса", guidedMinutes: [70, 90], practiceMinutes: [60, 90], artifactName: "Agent Safety Policy", artifactFile: "agent-safety-policy.md",
  labTitle: "Собери guardrail-матрицу", labLead: "Возьми один агентный workflow и определи риск каждого перехода: что разрешено автоматически, что требует подтверждения и что запрещено до изменения системы.",
  labFields: [
    { key: "workflow", label: "Workflow", prompt: "Какой результат и какие действия включает агентный цикл?", placeholder: "Диагностировать flaky test, предложить и применить патч…", example: "Найти причину flaky integration test, подготовить минимальный патч, после подтверждения применить и проверить." },
    { key: "risk", label: "Risk model", prompt: "Где высоки impact, необратимость или неопределённость?", placeholder: "Чтение — low… Изменение CI — high…", example: "Чтение кода — low; запуск целевых тестов — low; запись patch — medium; изменение shared CI — high." },
    { key: "allow", label: "Auto-allow", prompt: "Что агент выполняет сам и в какой области?", placeholder: "Читать… запускать… только в…", example: "Читать модуль и тесты, искать символы, запускать один целевой test suite в sandbox." },
    { key: "gate", label: "Review gates", prompt: "Перед какими действиями нужен человек и что он видит?", placeholder: "Перед записью показать… Перед внешним действием…", example: "Перед записью показать plan и diff; перед изменением CI — отдельное объяснение влияния и rollback." },
    { key: "deny", label: "Hard deny / stop", prompt: "Что запрещено или немедленно останавливает работу?", placeholder: "Не удалять… остановиться при…", example: "Не менять secrets, shared CI и зависимости; остановиться при необходимости файла вне scope или неоднозначном контракте." },
    { key: "verify", label: "Verification ladder", prompt: "Какие проверки идут от дешёвой к дорогой?", placeholder: "Static… targeted… integration… human…", example: "Typecheck затронутого пакета → целевые тесты → diff review → integration suite после подтверждения." },
  ], rubric: ["Каждый gate привязан к конкретному переходу", "Auto-allow ограничен областью и временем", "Необратимые действия не зависят от текста промпта", "Stop conditions наблюдаемы", "Проверки независимы от автора изменения", "Есть путь отката или безопасной остановки"],
  steps: [
    { id: "incident", index: "00", label: "Инцидент", short: "Gate в неправильном месте", kicker: "00 / Guardrail failure", title: "Подтверждение пришло после изменения", minutes: 8, lead: "Review gate полезен только до рискованного перехода. Запрос «подтвердите результат» после записи в прод — это уведомление, а не контроль.", notes: [
      { number: "01", title: "Слишком поздно", body: "Человек увидел diff после применения, когда состояние уже изменилось.", signal: "timing" }, { number: "02", title: "Слишком широко", body: "Одно подтверждение разрешало весь последующий цикл без новых границ.", signal: "scope" }, { number: "03", title: "Без evidence", body: "На gate показывали намерение агента, но не фактический diff и результаты проверок.", signal: "proof" },
    ], caseStudy: { label: "Change log / 16:05", title: "«Approve?» после kubectl apply", body: "Агент применил манифест, дождался деградации readiness и только затем запросил подтверждение продолжения.", signals: ["gate после write", "нет dry-run", "rollback не подготовлен"] }, checkpoint: { prompt: "Где должен стоять первый gate?", options: [{ id: "after", label: "После apply, перед наблюдением" }, { id: "before", label: "После preview/dry-run, перед apply" }, { id: "start", label: "Один раз перед всей задачей" }], correctId: "before", success: "Да. Человек получает конкретный preview и сохраняет право остановить мутацию.", retry: "Gate должен охранять сам переход состояния, а не начало абстрактной задачи или уже случившийся эффект." } },
    { id: "risk", index: "01", label: "Риск", short: "Impact × reversibility × confidence", kicker: "01 / Risk model", title: "Не все действия заслуживают одинакового трения", minutes: 12, lead: "Оцени действие по потенциальному влиянию, обратимости и уверенности. Чем хуже хотя бы одна ось, тем сильнее должен быть контроль.", notes: [
      { number: "I", title: "Impact", body: "Сколько систем, данных или людей затронет ошибка.", signal: "blast radius" }, { number: "R", title: "Reversibility", body: "Можно ли быстро и полно вернуть предыдущее состояние.", signal: "rollback" }, { number: "C", title: "Confidence", body: "Насколько проверены входы, предположения и ожидаемый эффект.", signal: "uncertainty" },
    ], checkpoint: { prompt: "Какое действие требует самого сильного gate?", options: [{ id: "read", label: "Чтение локального теста" }, { id: "test", label: "Запуск теста в sandbox" }, { id: "mail", label: "Рассылка клиентам по неполной выборке" }], correctId: "mail", success: "Верно. Высокий охват, репутационный эффект и слабая обратимость требуют явного человеческого решения.", retry: "Локальное чтение и sandbox-проверка обратимы; внешняя коммуникация уже представляет организацию." } },
    { id: "rails", index: "02", label: "Rails", short: "Разрешения в системе", kicker: "02 / Permission rails", title: "Guardrail должен пережить плохой промпт", minutes: 13, lead: "Сильные границы реализованы там, где происходит действие: filesystem scope, API permissions, sandbox, budgets и allowlist команд.", notes: [
      { number: "01", title: "Scope rails", body: "Явные каталоги, namespaces, проекты и tenants.", signal: "where" }, { number: "02", title: "Action rails", body: "Allowlist операций и разделение read/write/destructive.", signal: "what" }, { number: "03", title: "Budget rails", body: "Лимиты времени, стоимости, попыток и параллелизма.", signal: "how much" }, { number: "04", title: "Data rails", body: "Классификация, редактирование секретов и запрет утечки между контурами.", signal: "which data" },
    ], checkpoint: { prompt: "Что является настоящим rail?", options: [{ id: "text", label: "Фраза «не читай secrets»" }, { id: "fs", label: "Filesystem permission без доступа к каталогу secrets" }, { id: "persona", label: "Роль «осторожный senior»" }], correctId: "fs", success: "Да. Ограничение действует независимо от интерпретации модели.", retry: "Персона и просьба влияют на поведение, но не исключают саму возможность нарушения." } },
    { id: "gates", index: "03", label: "Gates", short: "Что должен увидеть человек", kicker: "03 / Review gates", title: "Подтверждать нужно решение, а не тревогу", minutes: 12, lead: "Хороший gate компактен: действие, причина, фактический diff, проверки, остающийся риск и rollback. Человек не должен заново проводить всё исследование.", notes: [
      { number: "01", title: "Proposed action", body: "Одно конкретное следующее действие и его scope.", signal: "decision" }, { number: "02", title: "Evidence", body: "Diff, preview, источники и проверки, на которых стоит предложение.", signal: "inspectable" }, { number: "03", title: "Residual risk", body: "Что всё ещё неизвестно и как откатиться.", signal: "honest" },
    ], checkpoint: { prompt: "Какой запрос на подтверждение лучше?", options: [{ id: "vague", label: "«План выглядит хорошо. Продолжить?»" }, { id: "evidence", label: "«Применить этот diff к 2 файлам; 14 тестов зелёные; rollback — revert commit»" }, { id: "trust", label: "«Я уверен на 92%, разрешите всё»" }], correctId: "evidence", success: "Верно. Решение ограничено и сопровождается проверяемыми доказательствами.", retry: "Уверенность агента не заменяет факты, scope и понятный следующий эффект." } },
    { id: "verify", index: "04", label: "Проверка", short: "Лестница доказательств", kicker: "04 / Verification ladder", title: "Проверяй от дешёвого сигнала к дорогому", minutes: 13, lead: "Не запускай весь мир после каждой строки. Построй лестницу: статические проверки, узкие тесты, интеграция, наблюдение и человеческий review там, где остаётся смысловой риск.", notes: [
      { number: "01", title: "Static", body: "Формат, schema, types, policy checks.", signal: "fast" }, { number: "02", title: "Targeted", body: "Тесты именно изменённого контракта и негативные сценарии.", signal: "focused" }, { number: "03", title: "Integration", body: "Поведение на границе систем в контролируемой среде.", signal: "system" }, { number: "04", title: "Observe", body: "Метрики, canary и готовый rollback после безопасного выпуска.", signal: "runtime" },
    ], checkpoint: { prompt: "Что доказательнее для изменения API-контракта?", options: [{ id: "lint", label: "Только lint" }, { id: "unit", label: "Только новый unit-test" }, { id: "ladder", label: "Types + contract tests + consumer integration" }], correctId: "ladder", success: "Да. Разные ступени ловят разные классы нарушения границы.", retry: "Одна проверка редко видит и синтаксис, и семантику, и совместимость потребителя." } },
    { id: "lab", index: "05", label: "Лаборатория", short: "Safety Policy", kicker: "05 / Safety lab", title: "Разложи workflow по разрешённым переходам", minutes: 20, lead: "Определи не общую «осторожность», а точные действия, gates, stop conditions и доказательства для одного рабочего цикла.", notes: [{ number: "→", title: "Шесть полей", body: "Workflow, модель риска, auto-allow, gates, hard deny и verification ladder.", signal: "artifact" }] },
    { id: "artifact", index: "06", label: "Артефакт", short: "Забери Safety Policy", kicker: "06 / Takeaway", title: "Политика готова стать частью системы", minutes: 8, lead: "Проверь, что правила можно перенести из документа в permissions, CI и интерфейс подтверждений.", notes: [{ number: "✓", title: "Enforcement test", body: "Если правило существует только как совет модели, оно ещё не стало guardrail.", signal: "ready" }] },
  ],
};

const module5: PrototypeModule = {
  number: 5, slug: "multi-agent-systems", eyebrow: "Модуль 05 · Multi-agent systems", title: "Мультиагентность без театра", shortTitle: "Мультиагентные системы", dek: "Научись отличать полезный параллелизм от дорогой постановки, проектировать роли, shared state и handoff-контракты без потери ответственности.", result: "Multi-agent System Map с ролями, handoff-контрактами и планом деградации", guidedMinutes: [75, 100], practiceMinutes: [75, 120], artifactName: "Multi-agent System Map", artifactFile: "multi-agent-system-map.md",
  labTitle: "Спроектируй систему — или докажи, что она не нужна", labLead: "Возьми сложный workflow. Сначала сформулируй тест на необходимость нескольких агентов, затем опиши роли и точки сборки результата.",
  labFields: [
    { key: "outcome", label: "Outcome", prompt: "Какой единый результат должна выдать система?", placeholder: "Подготовить проверяемый release readiness report…", example: "Подготовить release-readiness report с рисками, evidence и однозначной рекомендацией go/no-go." },
    { key: "decision", label: "One vs many", prompt: "Почему один агент не справляется эффективнее?", placeholder: "Нужны независимые параллельные…", example: "Три независимых источника — код, SLO и security — исследуются параллельно; один агент создаёт длинный смешанный контекст." },
    { key: "roles", label: "Роли", prompt: "Какая ответственность и граница контекста у каждого агента?", placeholder: "Supervisor… Code reviewer… SLO analyst…", example: "Supervisor декомпозирует и принимает; Code agent читает diff; SLO agent анализирует метрики; Security agent проверяет threat delta." },
    { key: "handoff", label: "Handoff contracts", prompt: "Что каждый исполнитель возвращает и по какой схеме?", placeholder: "status, evidence, unknowns, recommendation…", example: "Каждый возвращает status, 3 evidence links, unknowns, risk level и recommendation; без свободного длинного отчёта." },
    { key: "state", label: "Shared state", prompt: "Что является единственным источником правды и кто его меняет?", placeholder: "Supervisor владеет… Workers append-only…", example: "Supervisor владеет decision log; workers только добавляют evidence records с source и timestamp." },
    { key: "failure", label: "Failure plan", prompt: "Что происходит при конфликте, timeout или неполном результате?", placeholder: "При конфликте… При timeout…", example: "Конфликт отправляется reviewer-агенту; timeout помечает раздел incomplete; решение go запрещено без mandatory evidence." },
  ], rubric: ["Параллелизм даёт измеримую выгоду", "У ролей не пересекается ответственность за решение", "Handoff типизирован и компактен", "Shared state имеет владельца", "Конфликт не решается голосованием уверенности", "Система умеет безопасно деградировать до неполного результата"],
  steps: [
    { id: "incident", index: "00", label: "Инцидент", short: "Пять агентов, ноль владельцев", kicker: "00 / Coordination failure", title: "Все работали параллельно — никто не собрал ответ", minutes: 9, lead: "Дополнительный агент добавляет не только производительность, но и координационный налог: постановку, передачу, конфликт, ожидание и повторную проверку.", notes: [
      { number: "01", title: "Дублирование", body: "Три агента исследовали одни и те же файлы, потому что границы ролей не были названы.", signal: "waste" }, { number: "02", title: "Конфликт", body: "Выводы использовали разные версии фактов и не имели общего decision log.", signal: "state" }, { number: "03", title: "Нет владельца", body: "Supervisor пересказал ответы, но не отвечал за итоговое решение.", signal: "accountability" },
    ], caseStudy: { label: "Run / release readiness", title: "5 агентов · 28 tool calls · 3 разных вывода", body: "Code reviewer сказал go, security reviewer — no-go, supervisor выдал «скорее готово». Обязательного правила разрешения конфликта не было.", signals: ["+64% времени", "3 дублирующих чтения", "0 decision owner"] }, checkpoint: { prompt: "Какое исправление первое?", options: [{ id: "more", label: "Добавить шестого агента-арбитра" }, { id: "owner", label: "Назначить владельца решения и handoff-схему" }, { id: "prompt", label: "Попросить агентов быть согласованнее" }], correctId: "owner", success: "Верно. Параллельные выводы становятся системой только при явной сборке и ответственности.", retry: "Ещё один участник увеличит налог, если правила владения и передачи всё ещё не определены." } },
    { id: "decision", index: "01", label: "Решение", short: "Один агент или несколько", kicker: "01 / Architecture test", title: "Мультиагентность должна пройти тест окупаемости", minutes: 13, lead: "Несколько агентов полезны, когда работа действительно разделима, независима и дорога по контексту или времени. Не используй архитектуру ради ощущения масштаба.", notes: [
      { number: "01", title: "Decomposable", body: "Подзадачи имеют ясные входы и не требуют постоянной синхронизации.", signal: "split" }, { number: "02", title: "Parallel value", body: "Одновременное выполнение заметно сокращает критический путь.", signal: "speed" }, { number: "03", title: "Context isolation", body: "Каждой роли нужен свой большой контекст, который мешал бы единому агенту.", signal: "focus" }, { number: "04", title: "Verifiable handoff", body: "Результат подзадачи можно принять по схеме и evidence.", signal: "merge" },
    ], checkpoint: { prompt: "Где несколько агентов оправданы лучше?", options: [{ id: "copy", label: "Исправить текст одной кнопки" }, { id: "release", label: "Параллельно проверить code diff, SLO и security перед релизом" }, { id: "single", label: "Прочитать один лог и назвать ошибку" }], correctId: "release", success: "Да. Источники независимы, контексты разные, а результаты можно собрать по общей схеме.", retry: "Мелкая последовательная работа дешевле выполняется одним агентом без передачи контекста." } },
    { id: "state", index: "02", label: "Состояние", short: "Shared state и decision log", kicker: "02 / Shared state", title: "Общая память должна быть меньше общей переписки", minutes: 13, lead: "Не пересылай между агентами полные рассуждения. Храни компактные факты: источник, время, вывод, уверенность, неизвестные и принятое решение.", notes: [
      { number: "E", title: "Evidence records", body: "Append-only факты со ссылкой на источник и timestamp.", signal: "facts" }, { number: "D", title: "Decision log", body: "Кто принял решение, на каких доказательствах и что было отвергнуто.", signal: "owner" }, { number: "S", title: "Status", body: "Небольшая state machine вместо свободного «я почти закончил».", signal: "coordination" },
    ], checkpoint: { prompt: "Что лучше положить в shared state?", options: [{ id: "chat", label: "Полный transcript каждого агента" }, { id: "record", label: "Структурированные evidence records и decision log" }, { id: "thought", label: "Скрытые рассуждения и самооценку" }], correctId: "record", success: "Верно. Компактное состояние уменьшает расхождения и позволяет проверить происхождение решения.", retry: "Полные разговоры раздувают контекст; системе нужны факты, статусы и принятые решения." } },
    { id: "handoff", index: "03", label: "Handoff", short: "Контракт между ролями", kicker: "03 / Handoff contracts", title: "Передача — это API системы", minutes: 14, lead: "Результат роли должен быть типизирован: статус, evidence, неизвестные, риск и рекомендация. Свободный эссе-ответ усложняет сборку и скрывает пропуски.", notes: [
      { number: "01", title: "Status", body: "complete, partial, blocked или conflict — с формальными условиями.", signal: "state" }, { number: "02", title: "Evidence", body: "Ссылки и наблюдения, которые supervisor может независимо проверить.", signal: "proof" }, { number: "03", title: "Unknowns", body: "Недостающие данные, не замаскированные уверенностью.", signal: "honesty" }, { number: "04", title: "Recommendation", body: "Предложение в пределах роли, но не подмена общего владельца решения.", signal: "bounded" },
    ], checkpoint: { prompt: "Какой handoff лучше?", options: [{ id: "essay", label: "«Я всё посмотрел, в целом выглядит нормально»" }, { id: "schema", label: "status=partial; evidence=[…]; unknowns=[…]; risk=high" }, { id: "confidence", label: "«Уверенность 93%, можно релизить»" }], correctId: "schema", success: "Да. Схема показывает неполноту и не позволяет уверенности скрыть отсутствие evidence.", retry: "Красивый вывод трудно объединить с другими; структурированный контракт делает пропуски видимыми." } },
    { id: "patterns", index: "04", label: "Паттерны", short: "Supervisor, reviewer, parallel", kicker: "04 / Useful patterns", title: "Выбирай паттерн по виду зависимости", minutes: 14, lead: "Архитектура следует за потоком решений: supervisor-worker для декомпозиции, parallel research для независимых источников, reviewer для отдельной проверки готового результата.", notes: [
      { number: "S/W", title: "Supervisor → workers", body: "Один владелец делит задачу и принимает результаты по контракту.", signal: "decompose" }, { number: "P", title: "Parallel research", body: "Независимые источники исследуются одновременно и сходятся в evidence table.", signal: "fan-out" }, { number: "R", title: "Maker → reviewer", body: "Второй агент ищет дефекты в уже собранном артефакте, не переписывая задачу с нуля.", signal: "challenge" },
    ], checkpoint: { prompt: "Какой паттерн нужен для независимой проверки патча?", options: [{ id: "parallel", label: "Три одинаковых maker-агента" }, { id: "reviewer", label: "Maker → reviewer с отдельной рубрикой" }, { id: "chain", label: "Длинная цепочка пересказов" }], correctId: "reviewer", success: "Верно. Разделение создания и критики уменьшает общий blind spot.", retry: "Нужна роль с другой целью и рубрикой, а не больше копий одного и того же поведения." } },
    { id: "lab", index: "05", label: "Лаборатория", short: "System Map", kicker: "05 / Architecture lab", title: "Нарисуй поток ответственности", minutes: 22, lead: "Докажи необходимость нескольких агентов, назначь владельцев и опиши систему так, чтобы timeout или конфликт не превращались в импровизацию.", notes: [{ number: "→", title: "Шесть решений", body: "Outcome, тест one-vs-many, роли, handoff, shared state и failure plan.", signal: "artifact" }] },
    { id: "artifact", index: "06", label: "Артефакт", short: "Забери System Map", kicker: "06 / Takeaway", title: "Система готова к маленькому пилоту", minutes: 8, lead: "Начни с одного сценария и измерь критический путь, число конфликтов и стоимость проверки. Архитектура должна доказать пользу данными.", notes: [{ number: "✓", title: "Pilot test", body: "Если один агент оказывается быстрее и надёжнее, это хороший результат эксперимента, а не поражение архитектуры.", signal: "ready" }] },
  ],
};

export const PROTOTYPE_MODULES = [module2, module3, module4, module5] as const;

export const MODULE_ONE_SUMMARY = {
  number: 1,
  slug: "contract-before-agent",
  eyebrow: "Модуль 01 · Agentic mindset",
  title: "Сначала контракт, потом агент",
  shortTitle: "Agentic mindset",
  dek: "Научись ставить агенту инженерную задачу так, чтобы скорость не превращалась в потерю контроля.",
  result: "Agent Task Contract для реальной рабочей задачи",
  guidedMinutes: [45, 60] as [number, number],
  practiceMinutes: [45, 90] as [number, number],
  artifactName: "Agent Task Contract",
  stepCount: 7,
};

export const PROGRAM_MODULES = [
  MODULE_ONE_SUMMARY,
  ...PROTOTYPE_MODULES.map((module) => ({ ...module, stepCount: module.steps.length })),
];

export const PROGRAM_TOTALS = PROGRAM_MODULES.reduce(
  (total, module) => ({
    guidedMin: total.guidedMin + module.guidedMinutes[0],
    guidedMax: total.guidedMax + module.guidedMinutes[1],
    practiceMin: total.practiceMin + module.practiceMinutes[0],
    practiceMax: total.practiceMax + module.practiceMinutes[1],
    screens: total.screens + module.stepCount,
  }),
  { guidedMin: 0, guidedMax: 0, practiceMin: 0, practiceMax: 0, screens: 0 },
);

export function getPrototypeModule(number: number) {
  return PROTOTYPE_MODULES.find((module) => module.number === number);
}

export function formatMinutes(range: [number, number]) {
  return `${range[0]}–${range[1]} мин`;
}

export function formatHours(min: number, max: number) {
  const format = (value: number) => (value / 60).toLocaleString("ru-RU", { maximumFractionDigits: 1 });
  return `${format(min)}–${format(max)} ч`;
}
