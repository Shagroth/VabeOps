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
  title: "Контекст — это архитектура, а не свалка",
  shortTitle: "Контекст, Skills и саб-агенты",
  dek: "Перестань кормить модель всем репозиторием «на всякий случай». Собери минимальный контекст, оформи повторяемую работу в Skill и пойми, когда саб-агент действительно окупается.",
  result: "компактный Context Pack и Skill Spec для реальной инженерной задачи",
  guidedMinutes: [70, 90],
  practiceMinutes: [120, 180],
  artifactName: "Context Pack + Skill Spec",
  artifactFile: "context-pack-and-skill-spec.md",
  labTitle: "Собери контекст без цифрового чердака",
  labLead: "Возьми повторяемую рабочую задачу. Оставь только факты, которые меняют решение, а из устойчивой части собери процедуру, которую не стыдно передать коллеге или агенту.",
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
      lead: "Большое окно контекста не делает ответ умнее. Если свалить туда старые RFC, весь репозиторий и год логов, модель уверенно усреднит правду с мусором.",
      notes: [
        { number: "01", title: "Сигнал утонул", body: "Одно критическое ограничение потерялось среди сотен строк, которые не меняли решение.", signal: "signal / noise" },
        { number: "02", title: "Источники подрались", body: "Старый RFC описывал отменённое поведение, но выглядел солиднее свежего факта из системы.", signal: "freshness" },
        { number: "03", title: "Решение не назвали", body: "Агент получил документы, но не понял, какое решение должен принять после чтения.", signal: "decision" },
      ],
      caseStudy: { label: "Incident / 14:40", title: "«Вот репозиторий и папка с RFC — найди проблему»", body: "Через 18 минут агент предложил миграцию на основе старого ADR. Реальная причина лежала в одном флаге релиза. Контекста было много; нужного решения в нём не было.", signals: ["12 400 строк контекста", "3 конфликтующих документа", "0 критериев релевантности"] },
      checkpoint: { prompt: "Что исправить первым?", options: [{ id: "more", label: "Добавить ещё логи и README" }, { id: "decision", label: "Назвать решение и минимальные доказательства для него" }, { id: "model", label: "Переключить модель на более дорогую" }], correctId: "decision", success: "Да. Контекст собирают от решения назад: сначала вопрос и критерии доказательства, потом источники.", retry: "Больше токенов и более дорогая модель не исправят задачу без цели и критериев релевантности." },
    },
    {
      id: "layers", index: "01", label: "Слои", short: "Четыре слоя контекста", kicker: "01 / Context layers", title: "Разложи контекст по полкам", minutes: 12,
      lead: "Задача, ограничения, доказательства и состояние среды — не один ком текста. Они обновляются с разной скоростью, поэтому должны жить отдельно.",
      notes: [
        { number: "01", title: "Задача", body: "Какое решение или изменение требуется прямо сейчас.", signal: "volatile" },
        { number: "02", title: "Ограничения", body: "Контракты, права и свойства, которые нельзя нарушить.", signal: "stable" },
        { number: "03", title: "Доказательства", body: "Логи, diff и метрики, которые подтверждают или опровергают гипотезу.", signal: "traceable" },
        { number: "04", title: "Среда", body: "Версии, структура, доступные инструменты и фактическое состояние системы.", signal: "observable" },
      ],
      checkpoint: { prompt: "К какому слою относится «можно читать prod-логи, но нельзя перезапускать pod»?", options: [{ id: "task", label: "Задача" }, { id: "constraints", label: "Ограничения" }, { id: "evidence", label: "Доказательства" }], correctId: "constraints", success: "Да. Это граница полномочий; она должна пережить смену гипотезы и набора доказательств.", retry: "Это не сама задача и не доказательство. Это устойчивое правило допустимых действий." },
    },
    {
      id: "budget", index: "02", label: "Бюджет", short: "Must-have, useful, noise", kicker: "02 / Context budget", title: "Контекст должен окупать внимание", minutes: 12,
      lead: "Не добавляй источник только потому, что он доступен. Оставляй то, что может изменить план, вывод или уровень риска. Остальное — по запросу или в корзину.",
      notes: [
        { number: "A", title: "Must-have", body: "Без этого факта решение может стать неправильным или опасным.", signal: "include" },
        { number: "B", title: "Useful on demand", body: "Источник нужен только после появления конкретной гипотезы.", signal: "retrieve" },
        { number: "C", title: "Noise", body: "Материал не меняет решение или дублирует более свежий источник.", signal: "exclude" },
      ],
      caseStudy: { label: "Context budget", title: "Диагностика одного упавшего integration test", body: "Сначала нужны сообщение ошибки, сам тест, изменённый код и последние релевантные diff. Полный CI-лог и весь репозиторий подключаются только по гипотезе.", signals: ["must-have: 4 источника", "on-demand: 3", "noise: всё остальное"] },
      checkpoint: { prompt: "Что лучше держать on-demand?", options: [{ id: "error", label: "Точный текст ошибки" }, { id: "contract", label: "Публичный контракт функции" }, { id: "history", label: "Историю всех CI-запусков за год" }], correctId: "history", success: "Верно. История может понадобиться для тренда, но не должна заранее занимать внимание.", retry: "Ошибка и текущий контракт напрямую определяют диагностику; без них агент будет гадать." },
    },
    {
      id: "skill", index: "03", label: "Skill", short: "Процедура с границами", kicker: "03 / Skill anatomy", title: "Skill — это процедура. Не промпт на три экрана.", minutes: 15,
      lead: "Skill нужен там, где задача повторяется, а способ работы уже можно назвать. Он объясняет, когда запускаться, что взять на вход, что сделать и когда остановиться.",
      notes: [
        { number: "01", title: "Trigger", body: "Наблюдаемое условие, при котором процедура действительно уместна.", signal: "when" },
        { number: "02", title: "Inputs", body: "Минимальный набор данных и доступов с проверкой их качества.", signal: "with what" },
        { number: "03", title: "Procedure", body: "Последовательность проверок, ветвления и точки остановки.", signal: "how" },
        { number: "04", title: "Output", body: "Формат артефакта, который можно проверить или передать дальше.", signal: "evidence" },
      ],
      checkpoint: { prompt: "Какой trigger описан инженерно?", options: [{ id: "help", label: "Когда пользователю нужна помощь с базой" }, { id: "signal", label: "Когда p95 query latency > 500 мс 10 минут и нет активной миграции" }, { id: "always", label: "Используй всегда для PostgreSQL" }], correctId: "signal", success: "Да. Его можно проверить до запуска, а исключение ограничивает ложные срабатывания.", retry: "Хороший trigger наблюдаем и достаточно узок, чтобы не запускать процедуру по настроению." },
    },
    {
      id: "subagent", index: "04", label: "Саб-агент", short: "Когда делегирование окупается", kicker: "04 / Delegation test", title: "Саб-агент — не повышение в должности", minutes: 12,
      lead: "Делегирование окупается, когда подзадача независима, параллельна и возвращает проверяемый результат. Если объяснять дольше, чем делать, оставь одного исполнителя.",
      notes: [
        { number: "01", title: "Независимость", body: "Исполнитель не ждёт каждый промежуточный вывод основного агента.", signal: "separable" },
        { number: "02", title: "Изоляция", body: "Подзадаче полезен собственный контекст, который не нужен остальной работе.", signal: "focused" },
        { number: "03", title: "Приёмка", body: "Результат можно проверить без повторения всего исследования.", signal: "handoff" },
      ],
      checkpoint: { prompt: "Что лучше делегировать саб-агенту?", options: [{ id: "rename", label: "Переименовать одну переменную в открытом файле" }, { id: "research", label: "Параллельно проверить историю изменений API и вернуть evidence table" }, { id: "choice", label: "Решить за владельца продукта, какое поведение нужно" }], correctId: "research", success: "Верно. Подзадача независима, требует отдельного контекста и возвращает проверяемый результат.", retry: "Мелкая локальная правка не окупает handoff, а продуктовое решение нельзя делегировать как факт." },
    },
    {
      id: "lab", index: "05", label: "Лаборатория", short: "Context Pack и Skill Spec", kicker: "05 / Field lab", title: "Собери контекст, который выдержит передачу", minutes: 20,
      lead: "Отфильтруй контекст, оформи повторяемую часть в Skill и реши, есть ли здесь работа для отдельного исполнителя — или это архитектура ради архитектуры.",
      notes: [{ number: "→", title: "Шесть полей", body: "Заполни задачу, must-have, шум, trigger, процедуру и handoff. Можно загрузить готовый инженерный пример.", signal: "artifact" }],
    },
    {
      id: "artifact", index: "06", label: "Артефакт", short: "Забери спецификацию", kicker: "06 / Takeaway", title: "Контекст-пакет готов к реальной работе", minutes: 8,
      lead: "Передай артефакт мысленно другому инженеру. Он должен понять, зачем здесь каждый источник, когда запускать Skill и где точно остановиться.",
      notes: [{ number: "✓", title: "Transfer test", body: "Артефакт должен пережить передачу другому человеку или агенту без устного брифинга.", signal: "ready" }],
    },
  ],
};

const module3: PrototypeModule = {
  number: 3,
  slug: "mcp-without-magic",
  eyebrow: "Модуль 03 · MCP и плагины",
  title: "MCP без магии: подключай возможности, не хаос",
  shortTitle: "MCP и плагины",
  dek: "Подключить Jira или GitHub несложно. Сложнее не выдать агенту лишнего. Разложи интеграцию на возможности, права, ошибки и безопасный отказ.",
  result: "MCP Integration Card с матрицей прав, контрактом инструментов и безопасным отказом",
  guidedMinutes: [75, 100],
  practiceMinutes: [240, 360],
  artifactName: "MCP Integration Card",
  artifactFile: "mcp-integration-card.md",
  labTitle: "Спроектируй MCP-интеграцию, которую можно пустить в пилот",
  labLead: "Выбери реальную систему — GitHub, Jira, Kubernetes, базу знаний или внутренний API. Начни с одного полезного сценария и выдай ему ровно столько прав, сколько он заслужил.",
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
    { id: "incident", index: "00", label: "Инцидент", short: "Коннектор сделал лишнее", kicker: "00 / Capability leak", title: "Просили найти дубликаты. Агент закрыл 37 задач.", minutes: 9, lead: "Интеграция не делает модель умнее — она даёт ей руки. Если эти руки умеют менять внешнюю систему, фраза «я не просил» уже не считается защитой.", notes: [
      { number: "01", title: "Tool-комбайн", body: "Один метод одновременно искал, редактировал и закрывал задачи. Удобно — до первого инцидента.", signal: "coupling" },
      { number: "02", title: "Admin для удобства", body: "Токен получил права администратора, потому что так быстрее подключить пилот.", signal: "blast radius" },
      { number: "03", title: "Ноль preview", body: "Внешнее изменение не требовало отдельного подтверждения и не показывало будущий эффект.", signal: "irreversible" },
    ], caseStudy: { label: "Postmortem / connector", title: "37 задач закрыты как дубликаты", body: "Похожие тикеты модель нашла верно. Но tool contract трактовал resolve=true как значение по умолчанию. Два часа команда возвращала состояние, которое агент изменил за секунды.", signals: ["1 широкий токен", "0 preview", "37 внешних изменений"] }, checkpoint: { prompt: "Что исправить первым?", options: [{ id: "prompt", label: "Добавить в промпт «будь осторожен»" }, { id: "split", label: "Разделить read и write, а write закрыть gate-ом" }, { id: "retry", label: "Уменьшить число повторов" }], correctId: "split", success: "Да. Безопасность должна жить в наборе доступных действий, а не только в вежливой просьбе к модели.", retry: "Промпт влияет на поведение, но опасная возможность остаётся доступной. Сначала убери лишнее право." } },
    { id: "model", index: "01", label: "Модель", short: "Host, server, tools, resources", kicker: "01 / Mental model", title: "MCP — не магия, а набор контрактов", minutes: 14, lead: "Раздели участника сессии, поставщика возможностей и конкретные действия. Тогда станет видно, где проверяются права, кто отвечает за ошибку и чему вообще приходится доверять.", notes: [
      { number: "H", title: "Host / client", body: "Управляет сессией, выбирает сервер и передаёт модели доступные возможности.", signal: "orchestration" },
      { number: "S", title: "Server", body: "Публикует tools, resources и их схемы; отвечает за исполнение и ошибки.", signal: "boundary" },
      { number: "T", title: "Tools", body: "Действия с типизированными входами, выходами и возможными побочными эффектами.", signal: "action" },
      { number: "R", title: "Resources", body: "Адресуемый контекст, который можно прочитать без скрытой мутации.", signal: "context" },
    ], checkpoint: { prompt: "Где должна окончательно проверяться авторизация на изменение Jira?", options: [{ id: "prompt", label: "В system prompt модели" }, { id: "server", label: "На MCP-сервере перед внешним вызовом" }, { id: "ui", label: "Только в интерфейсе чата" }], correctId: "server", success: "Верно. Подсказки и UI полезны, но сервер обязан сам подтвердить право на действие.", retry: "Любой клиентский слой можно обойти или неправильно интерпретировать; enforcement живёт у исполнителя." } },
    { id: "inventory", index: "02", label: "Инвентарь", short: "Карта возможностей", kicker: "02 / Capability inventory", title: "Не доверяй названию плагина — считай действия", minutes: 12, lead: "Слово «GitHub» ничего не говорит о риске. Читать issue, отправить комментарий и смержить PR — три совершенно разные поверхности действий.", notes: [
      { number: "R", title: "Read", body: "Чтение данных без изменения источника; всё ещё требует контроля приватности.", signal: "observe" },
      { number: "W", title: "Write", body: "Создание или изменение состояния, которое можно откатить.", signal: "mutate" },
      { number: "D", title: "Destructive", body: "Удаление, merge, ротация или действие с дорогим восстановлением.", signal: "gate" },
      { number: "E", title: "External communication", body: "Сообщение или публикация от имени человека либо компании.", signal: "reputation" },
    ], checkpoint: { prompt: "К какой категории относится отправка комментария в публичный issue?", options: [{ id: "read", label: "Read" }, { id: "write", label: "Только Write" }, { id: "external", label: "Write + External communication" }], correctId: "external", success: "Да. Состояние меняется, а текст ещё и представляет человека или организацию вовне.", retry: "Это не просто запись в базе: действие имеет коммуникационный и репутационный эффект." } },
    { id: "contract", index: "03", label: "Контракт", short: "Типы, ошибки, идемпотентность", kicker: "03 / Tool contracts", title: "Хороший tool не играет с моделью в угадайку", minutes: 15, lead: "Тип string ещё ничего не объясняет. Контракт должен назвать смысл, единицы, частичный успех и поведение после timeout — особенно если повторный вызов может создать дубль.", notes: [
      { number: "01", title: "Inputs", body: "Названия, ограничения, единицы и допустимые комбинации параметров.", signal: "unambiguous" },
      { number: "02", title: "Outputs", body: "Типизированный результат, ссылки на источник и признак полноты.", signal: "traceable" },
      { number: "03", title: "Errors", body: "Различимые forbidden, not_found, conflict и partial вместо общего «failed».", signal: "recoverable" },
      { number: "04", title: "Idempotency", body: "Ясно, можно ли безопасно повторить вызов после неопределённого ответа.", signal: "retry" },
    ], checkpoint: { prompt: "После timeout у create_ticket неизвестно, создалась ли задача. Что нужно?", options: [{ id: "repeat", label: "Сразу повторить тот же вызов" }, { id: "key", label: "Idempotency key и проверка результата перед повтором" }, { id: "ignore", label: "Считать операцию неуспешной" }], correctId: "key", success: "Верно. Неопределённое состояние нельзя превращать в дубли слепым повтором.", retry: "Timeout не доказывает отсутствие внешнего эффекта. Нужна проверяемая идентичность операции." } },
    { id: "permissions", index: "04", label: "Права", short: "Least privilege на практике", kicker: "04 / Permission design", title: "Выдавай права под сценарий, а не «на весь GitHub»", minutes: 14, lead: "Для первого релиза хватит одного проекта, ограниченного scope и read-only там, где ценность не требует записи. Права «на будущее» имеют привычку становиться инцидентами в настоящем.", notes: [
      { number: "01", title: "Scope", body: "Один проект, namespace или набор документов вместо всей организации.", signal: "where" },
      { number: "02", title: "Action", body: "Только необходимые verbs; read не получает write «на будущее».", signal: "what" },
      { number: "03", title: "Time", body: "Короткоживущие credentials и пересмотр прав после пилота.", signal: "when" },
    ], checkpoint: { prompt: "Какой старт для briefing-бота безопаснее?", options: [{ id: "admin", label: "Org admin token, чтобы не упереться в права" }, { id: "readonly", label: "Read-only доступ только к пилотному проекту" }, { id: "personal", label: "Личный токен автора курса" }], correctId: "readonly", success: "Да. Права соответствуют одному сценарию и ограничивают blast radius пилота.", retry: "Удобство настройки не оправдывает права, которые сценарий вообще не использует." } },
    { id: "lab", index: "05", label: "Лаборатория", short: "Integration Card", kicker: "05 / Integration lab", title: "Сначала спроектируй. Потом подключай.", minutes: 22, lead: "Свяжи полезный сценарий с конкретными capabilities, правами, ошибками и проверками. Получится и техническое задание, и нормальная основа для security review.", notes: [{ number: "→", title: "Шесть решений", body: "Сценарий, capabilities, права, tool contract, failure mode и проверка.", signal: "artifact" }] },
    { id: "artifact", index: "06", label: "Артефакт", short: "Забери Integration Card", kicker: "06 / Takeaway", title: "Интеграция описана до первого токена", minutes: 8, lead: "Карточку должен понять и разработчик, и владелец системы: что подключаем, какую ценность получаем, какие права выдаём и какой риск остаётся.", notes: [{ number: "✓", title: "Security handoff", body: "Пользовательская ценность связана с конкретными правами и проверками — без прыжка «ну это же всего лишь пилот».", signal: "ready" }] },
  ],
};

const module4: PrototypeModule = {
  number: 4, slug: "guardrails", eyebrow: "Модуль 04 · Guardrails и безопасность", title: "Guardrails: свобода без самодеятельности", shortTitle: "Guardrails и безопасность", dek: "Построй права, review gates и проверки так, чтобы агент работал быстро, но не превращал уверенную догадку в дорогой инцидент.", result: "Agent Safety Policy с понятными разрешениями, точками контроля и stop conditions", guidedMinutes: [70, 90], practiceMinutes: [180, 300], artifactName: "Agent Safety Policy", artifactFile: "agent-safety-policy.md",
  labTitle: "Поставь агенту отбойники, а не наручники", labLead: "Возьми один агентный workflow. Разреши безопасное автоматически, поставь подтверждение перед рискованным и запрети то, что пока нечем проверить.",
  labFields: [
    { key: "workflow", label: "Workflow", prompt: "Какой результат и какие действия включает агентный цикл?", placeholder: "Диагностировать flaky test, предложить и применить патч…", example: "Найти причину flaky integration test, подготовить минимальный патч, после подтверждения применить и проверить." },
    { key: "risk", label: "Risk model", prompt: "Где высоки impact, необратимость или неопределённость?", placeholder: "Чтение — low… Изменение CI — high…", example: "Чтение кода — low; запуск целевых тестов — low; запись patch — medium; изменение shared CI — high." },
    { key: "allow", label: "Auto-allow", prompt: "Что агент выполняет сам и в какой области?", placeholder: "Читать… запускать… только в…", example: "Читать модуль и тесты, искать символы, запускать один целевой test suite в sandbox." },
    { key: "gate", label: "Review gates", prompt: "Перед какими действиями нужен человек и что он видит?", placeholder: "Перед записью показать… Перед внешним действием…", example: "Перед записью показать plan и diff; перед изменением CI — отдельное объяснение влияния и rollback." },
    { key: "deny", label: "Hard deny / stop", prompt: "Что запрещено или немедленно останавливает работу?", placeholder: "Не удалять… остановиться при…", example: "Не менять secrets, shared CI и зависимости; остановиться при необходимости файла вне scope или неоднозначном контракте." },
    { key: "verify", label: "Verification ladder", prompt: "Какие проверки идут от дешёвой к дорогой?", placeholder: "Static… targeted… integration… human…", example: "Typecheck затронутого пакета → целевые тесты → diff review → integration suite после подтверждения." },
  ], rubric: ["Каждый gate привязан к конкретному переходу", "Auto-allow ограничен областью и временем", "Необратимые действия не зависят от текста промпта", "Stop conditions наблюдаемы", "Проверки независимы от автора изменения", "Есть путь отката или безопасной остановки"],
  steps: [
    { id: "incident", index: "00", label: "Инцидент", short: "Gate в неправильном месте", kicker: "00 / Guardrail failure", title: "Агент спросил разрешение. После kubectl apply.", minutes: 8, lead: "Подтверждение полезно только до рискованного действия. Вопрос «продолжить?» после записи в прод — это уже push-уведомление об инциденте.", notes: [
      { number: "01", title: "Слишком поздно", body: "Человек увидел diff после применения, когда состояние уже изменилось.", signal: "timing" }, { number: "02", title: "Слишком широко", body: "Одно подтверждение разрешало весь последующий цикл без новых границ.", signal: "scope" }, { number: "03", title: "Без evidence", body: "При подтверждении показывали намерение агента, но не фактический diff и результаты проверок.", signal: "proof" },
    ], caseStudy: { label: "Change log / 16:05", title: "«Approve?» после kubectl apply", body: "Агент применил манифест, увидел деградацию readiness и только тогда запросил решение у человека. Контроль был в интерфейсе, но стоял на один шаг слишком поздно.", signals: ["gate после write", "нет dry-run", "rollback не подготовлен"] }, checkpoint: { prompt: "Где должен стоять первый gate?", options: [{ id: "after", label: "После apply, перед наблюдением" }, { id: "before", label: "После preview/dry-run, перед apply" }, { id: "start", label: "Один раз перед всей задачей" }], correctId: "before", success: "Да. Человек видит конкретный preview и всё ещё может остановить изменение.", retry: "Gate должен охранять переход состояния. Не начало абстрактной задачи и не уже случившийся эффект." } },
    { id: "risk", index: "01", label: "Риск", short: "Impact × reversibility × confidence", kicker: "01 / Risk model", title: "Безопасность не обязана тормозить всё подряд", minutes: 12, lead: "Чтение локального файла и рассылка клиентам не заслуживают одинакового контроля. Смотри на масштаб ущерба, обратимость и качество доказательств.", notes: [
      { number: "I", title: "Impact", body: "Сколько систем, данных или людей затронет ошибка.", signal: "blast radius" }, { number: "R", title: "Reversibility", body: "Можно ли быстро и полно вернуть предыдущее состояние.", signal: "rollback" }, { number: "C", title: "Confidence", body: "Насколько проверены входы, предположения и ожидаемый эффект.", signal: "uncertainty" },
    ], checkpoint: { prompt: "Какое действие требует самого сильного gate?", options: [{ id: "read", label: "Чтение локального теста" }, { id: "test", label: "Запуск теста в sandbox" }, { id: "mail", label: "Рассылка клиентам по неполной выборке" }], correctId: "mail", success: "Верно. Высокий охват, репутационный эффект и слабая обратимость требуют явного человеческого решения.", retry: "Локальное чтение и sandbox-проверка обратимы; внешняя коммуникация уже представляет организацию." } },
    { id: "rails", index: "02", label: "Rails", short: "Разрешения в системе", kicker: "02 / Permission rails", title: "Хороший guardrail переживёт даже плохой промпт", minutes: 13, lead: "Настоящие границы стоят там, где совершается действие: filesystem scope, API permissions, sandbox, лимиты и allowlist команд. «Пожалуйста, будь осторожен» туда не входит.", notes: [
      { number: "01", title: "Scope rails", body: "Явные каталоги, namespaces, проекты и tenants.", signal: "where" }, { number: "02", title: "Action rails", body: "Allowlist операций и разделение read/write/destructive.", signal: "what" }, { number: "03", title: "Budget rails", body: "Лимиты времени, стоимости, попыток и параллелизма.", signal: "how much" }, { number: "04", title: "Data rails", body: "Классификация, маскирование секретов и запрет утечки между контурами.", signal: "which data" },
    ], checkpoint: { prompt: "Что является настоящим rail?", options: [{ id: "text", label: "Фраза «не читай secrets»" }, { id: "fs", label: "Filesystem permission без доступа к каталогу secrets" }, { id: "persona", label: "Роль «осторожный senior»" }], correctId: "fs", success: "Да. Ограничение действует независимо от интерпретации модели.", retry: "Персона и просьба влияют на поведение, но не исключают саму возможность нарушения." } },
    { id: "gates", index: "03", label: "Gates", short: "Что должен увидеть человек", kicker: "03 / Review gates", title: "На gate приносят решение, а не тревогу", minutes: 12, lead: "Покажи человеку следующее действие, фактический diff, проверки, остаточный риск и rollback. Если для подтверждения нужно повторить всё исследование, агент не подготовил решение.", notes: [
      { number: "01", title: "Proposed action", body: "Одно конкретное следующее действие и его scope.", signal: "decision" }, { number: "02", title: "Evidence", body: "Diff, preview, источники и проверки, на которых стоит предложение.", signal: "inspectable" }, { number: "03", title: "Residual risk", body: "Что всё ещё неизвестно и как откатиться.", signal: "honest" },
    ], checkpoint: { prompt: "Какой запрос на подтверждение лучше?", options: [{ id: "vague", label: "«План выглядит хорошо. Продолжить?»" }, { id: "evidence", label: "«Применить этот diff к 2 файлам; 14 тестов зелёные; rollback — revert commit»" }, { id: "trust", label: "«Я уверен на 92%, разрешите всё»" }], correctId: "evidence", success: "Верно. Решение ограничено и сопровождается проверяемыми доказательствами.", retry: "Уверенность агента не заменяет факты, scope и понятный следующий эффект." } },
    { id: "verify", index: "04", label: "Проверка", short: "Лестница доказательств", kicker: "04 / Verification ladder", title: "Не запускай весь мир после каждой строки", minutes: 13, lead: "Иди от дешёвых сигналов к дорогим: schema и types, целевые тесты, интеграция, наблюдение. Человека подключай там, где остаётся смысловой риск, а не там, где CI и так справится.", notes: [
      { number: "01", title: "Static", body: "Формат, schema, types, policy checks.", signal: "fast" }, { number: "02", title: "Targeted", body: "Тесты именно изменённого контракта и негативные сценарии.", signal: "focused" }, { number: "03", title: "Integration", body: "Поведение на границе систем в контролируемой среде.", signal: "system" }, { number: "04", title: "Observe", body: "Метрики, canary и готовый rollback после безопасного выпуска.", signal: "runtime" },
    ], checkpoint: { prompt: "Что доказательнее для изменения API-контракта?", options: [{ id: "lint", label: "Только lint" }, { id: "unit", label: "Только новый unit-test" }, { id: "ladder", label: "Types + contract tests + consumer integration" }], correctId: "ladder", success: "Да. Разные ступени ловят разные классы нарушения границы.", retry: "Одна проверка редко видит и синтаксис, и семантику, и совместимость потребителя." } },
    { id: "lab", index: "05", label: "Лаборатория", short: "Safety Policy", kicker: "05 / Safety lab", title: "Разложи workflow на разрешённые переходы", minutes: 20, lead: "Убери слово «осторожно» и назови точные действия: что можно автоматически, где нужен gate, что запрещено и какие доказательства открывают следующий шаг.", notes: [{ number: "→", title: "Шесть полей", body: "Workflow, модель риска, auto-allow, gates, hard deny и verification ladder.", signal: "artifact" }] },
    { id: "artifact", index: "06", label: "Артефакт", short: "Забери Safety Policy", kicker: "06 / Takeaway", title: "Политика готова выйти из документа", minutes: 8, lead: "Проверь, какие правила можно перенести в permissions, CI и интерфейс подтверждений. Совет модели — ещё не контроль, пока система его не применяет.", notes: [{ number: "✓", title: "Enforcement test", body: "Если правило существует только в промпте, оно может помочь. Но guardrail оно ещё не стало.", signal: "ready" }] },
  ],
};

const module5: PrototypeModule = {
  number: 5, slug: "multi-agent-systems", eyebrow: "Модуль 05 · Multi-agent systems", title: "Мультиагентность без театра", shortTitle: "Мультиагентные системы", dek: "Отличи полезный параллелизм от дорогой толпы ботов. Спроектируй роли, общую память и handoff так, чтобы у финального решения оставался владелец.", result: "Multi-agent System Map с ролями, контрактами передачи и сценарием деградации", guidedMinutes: [75, 100], practiceMinutes: [240, 360], artifactName: "Multi-agent System Map", artifactFile: "multi-agent-system-map.md",
  labTitle: "Спроектируй систему — или честно оставь одного агента", labLead: "Возьми сложный workflow. Сначала докажи, что параллелизм окупит координацию. Только потом добавляй роли, shared state и правила сборки результата.",
  labFields: [
    { key: "outcome", label: "Outcome", prompt: "Какой единый результат должна выдать система?", placeholder: "Подготовить проверяемый release readiness report…", example: "Подготовить release-readiness report с рисками, evidence и однозначной рекомендацией go/no-go." },
    { key: "decision", label: "One vs many", prompt: "Почему один агент не справляется эффективнее?", placeholder: "Нужны независимые параллельные…", example: "Три независимых источника — код, SLO и security — исследуются параллельно; один агент создаёт длинный смешанный контекст." },
    { key: "roles", label: "Роли", prompt: "Какая ответственность и граница контекста у каждого агента?", placeholder: "Supervisor… Code reviewer… SLO analyst…", example: "Supervisor декомпозирует и принимает; Code agent читает diff; SLO agent анализирует метрики; Security agent проверяет threat delta." },
    { key: "handoff", label: "Handoff contracts", prompt: "Что каждый исполнитель возвращает и по какой схеме?", placeholder: "status, evidence, unknowns, recommendation…", example: "Каждый возвращает status, 3 evidence links, unknowns, risk level и recommendation; без свободного длинного отчёта." },
    { key: "state", label: "Shared state", prompt: "Что является единственным источником правды и кто его меняет?", placeholder: "Supervisor владеет… Workers append-only…", example: "Supervisor владеет decision log; workers только добавляют evidence records с source и timestamp." },
    { key: "failure", label: "Failure plan", prompt: "Что происходит при конфликте, timeout или неполном результате?", placeholder: "При конфликте… При timeout…", example: "Конфликт отправляется reviewer-агенту; timeout помечает раздел incomplete; решение go запрещено без mandatory evidence." },
  ], rubric: ["Параллелизм даёт измеримую выгоду", "У ролей не пересекается ответственность за решение", "Handoff типизирован и компактен", "Shared state имеет владельца", "Конфликт не решается голосованием уверенности", "Система умеет безопасно деградировать до неполного результата"],
  steps: [
    { id: "incident", index: "00", label: "Инцидент", short: "Пять агентов, ноль владельцев", kicker: "00 / Coordination failure", title: "Пять агентов поработали. Решения всё ещё нет.", minutes: 9, lead: "Каждый новый агент приносит не только скорость, но и налог: постановку, handoff, ожидание, конфликт и повторную проверку. Параллельный хаос тоже работает параллельно.", notes: [
      { number: "01", title: "Дублирование", body: "Три агента исследовали одни и те же файлы, потому что границы ролей не были названы.", signal: "waste" }, { number: "02", title: "Конфликт", body: "Выводы использовали разные версии фактов и не имели общего decision log.", signal: "state" }, { number: "03", title: "Нет владельца", body: "Supervisor пересказал ответы, но не отвечал за итоговое решение.", signal: "accountability" },
    ], caseStudy: { label: "Run / release readiness", title: "5 агентов · 28 tool calls · 3 разных вывода", body: "Code reviewer сказал go, security reviewer — no-go, а supervisor выдал «скорее готово». Правила разрешения конфликта и владельца решения не было.", signals: ["+64% времени", "3 дублирующих чтения", "0 decision owner"] }, checkpoint: { prompt: "Что исправить первым?", options: [{ id: "more", label: "Добавить шестого агента-арбитра" }, { id: "owner", label: "Назначить владельца решения и handoff-схему" }, { id: "prompt", label: "Попросить агентов быть согласованнее" }], correctId: "owner", success: "Да. Параллельные ответы становятся системой только при явной сборке и ответственности.", retry: "Шестой агент добавит ещё один handoff. Сначала назначь владельца и правила передачи." } },
    { id: "decision", index: "01", label: "Решение", short: "Один агент или несколько", kicker: "01 / Architecture test", title: "Мультиагентность должна себя окупить", minutes: 13, lead: "Добавляй агентов, только если работа разделима, независима и дорога по времени или контексту. Архитектура ради красивой схемы — тоже форма прокрастинации.", notes: [
      { number: "01", title: "Decomposable", body: "Подзадачи имеют ясные входы и не требуют постоянной синхронизации.", signal: "split" }, { number: "02", title: "Parallel value", body: "Одновременное выполнение заметно сокращает критический путь.", signal: "speed" }, { number: "03", title: "Context isolation", body: "Каждой роли нужен свой большой контекст, который мешал бы единому агенту.", signal: "focus" }, { number: "04", title: "Verifiable handoff", body: "Результат подзадачи можно принять по схеме и evidence.", signal: "merge" },
    ], checkpoint: { prompt: "Где несколько агентов оправданы лучше?", options: [{ id: "copy", label: "Исправить текст одной кнопки" }, { id: "release", label: "Параллельно проверить code diff, SLO и security перед релизом" }, { id: "single", label: "Прочитать один лог и назвать ошибку" }], correctId: "release", success: "Да. Источники независимы, контексты разные, а результаты можно собрать по общей схеме.", retry: "Мелкая последовательная работа дешевле выполняется одним агентом без передачи контекста." } },
    { id: "state", index: "02", label: "Состояние", short: "Shared state и decision log", kicker: "02 / Shared state", title: "Общая память — не групповой чат агентов", minutes: 13, lead: "Не таскай между ролями полные рассуждения. Храни компактные факты: источник, время, вывод, неизвестные и принятое решение. Иначе контекст разрастётся быстрее результата.", notes: [
      { number: "E", title: "Evidence records", body: "Append-only факты со ссылкой на источник и timestamp.", signal: "facts" }, { number: "D", title: "Decision log", body: "Кто принял решение, на каких доказательствах и что было отвергнуто.", signal: "owner" }, { number: "S", title: "Status", body: "Небольшая state machine вместо свободного «я почти закончил».", signal: "coordination" },
    ], checkpoint: { prompt: "Что лучше положить в shared state?", options: [{ id: "chat", label: "Полный transcript каждого агента" }, { id: "record", label: "Структурированные evidence records и decision log" }, { id: "thought", label: "Скрытые рассуждения и самооценку" }], correctId: "record", success: "Верно. Компактное состояние уменьшает расхождения и позволяет проверить происхождение решения.", retry: "Полные разговоры раздувают контекст; системе нужны факты, статусы и принятые решения." } },
    { id: "handoff", index: "03", label: "Handoff", short: "Контракт между ролями", kicker: "03 / Handoff contracts", title: "Handoff — это API между агентами", minutes: 14, lead: "Каждая роль возвращает статус, доказательства, неизвестные, риск и рекомендацию. Свободное эссе звучит умно, но плохо собирается и отлично прячет пропуски.", notes: [
      { number: "01", title: "Status", body: "complete, partial, blocked или conflict — с формальными условиями.", signal: "state" }, { number: "02", title: "Evidence", body: "Ссылки и наблюдения, которые supervisor может независимо проверить.", signal: "proof" }, { number: "03", title: "Unknowns", body: "Недостающие данные, не замаскированные уверенностью.", signal: "honesty" }, { number: "04", title: "Recommendation", body: "Предложение в пределах роли, но не подмена общего владельца решения.", signal: "bounded" },
    ], checkpoint: { prompt: "Какой handoff лучше?", options: [{ id: "essay", label: "«Я всё посмотрел, в целом выглядит нормально»" }, { id: "schema", label: "status=partial; evidence=[…]; unknowns=[…]; risk=high" }, { id: "confidence", label: "«Уверенность 93%, можно релизить»" }], correctId: "schema", success: "Да. Схема показывает неполноту и не позволяет уверенности скрыть отсутствие evidence.", retry: "Красивый вывод трудно объединить с другими; структурированный контракт делает пропуски видимыми." } },
    { id: "patterns", index: "04", label: "Паттерны", short: "Supervisor, reviewer, parallel", kicker: "04 / Useful patterns", title: "Сначала зависимость. Потом паттерн.", minutes: 14, lead: "Supervisor-worker нужен для декомпозиции, parallel research — для независимых источников, reviewer — для отдельной критики результата. Не начинай с модной схемы; начинай с потока решений.", notes: [
      { number: "S/W", title: "Supervisor → workers", body: "Один владелец делит задачу и принимает результаты по контракту.", signal: "decompose" }, { number: "P", title: "Parallel research", body: "Независимые источники исследуются одновременно и сходятся в evidence table.", signal: "fan-out" }, { number: "R", title: "Maker → reviewer", body: "Второй агент ищет дефекты в уже собранном артефакте, не переписывая задачу с нуля.", signal: "challenge" },
    ], checkpoint: { prompt: "Какой паттерн нужен для независимой проверки патча?", options: [{ id: "parallel", label: "Три одинаковых maker-агента" }, { id: "reviewer", label: "Maker → reviewer с отдельной рубрикой" }, { id: "chain", label: "Длинная цепочка пересказов" }], correctId: "reviewer", success: "Верно. Разделение создания и критики уменьшает общий blind spot.", retry: "Нужна роль с другой целью и рубрикой, а не больше копий одного и того же поведения." } },
    { id: "lab", index: "05", label: "Лаборатория", short: "System Map", kicker: "05 / Architecture lab", title: "Нарисуй не агентов, а ответственность", minutes: 22, lead: "Докажи необходимость нескольких ролей, назначь владельца решения и опиши, что произойдёт при timeout, конфликте или неполном результате.", notes: [{ number: "→", title: "Шесть решений", body: "Outcome, тест one-vs-many, роли, handoff, shared state и failure plan.", signal: "artifact" }] },
    { id: "artifact", index: "06", label: "Артефакт", short: "Забери System Map", kicker: "06 / Takeaway", title: "Система готова к маленькому пилоту", minutes: 8, lead: "Начни с одного сценария. Измерь время, конфликты и стоимость проверки. Архитектура обязана доказать пользу данными — красивые стрелки уже никого не спасут.", notes: [{ number: "✓", title: "Pilot test", body: "Если один агент окажется быстрее и надёжнее, эксперимент удался: ты сэкономил себе лишнюю систему.", signal: "ready" }] },
  ],
};

export const PROTOTYPE_MODULES = [module2, module3, module4, module5] as const;

export const MODULE_ONE_SUMMARY = {
  number: 1,
  slug: "contract-before-agent",
  eyebrow: "Модуль 01 · Agentic mindset",
  title: "Сначала контракт. Потом — агент.",
  shortTitle: "Agentic mindset",
  dek: "Агент ускоряет всё — в том числе неверно понятую задачу. Зафиксируй цель, границы и доказательства готовности до того, как он начнёт действовать.",
  result: "Agent Task Contract, который можно вставить в реальную задачу уже сегодня",
  guidedMinutes: [45, 60] as [number, number],
  practiceMinutes: [90, 150] as [number, number],
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
