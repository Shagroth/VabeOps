// "Signals" — short editorial format: what happened in agentic engineering
// and why it matters to a practicing engineer. Every item links to its
// primary source (a vendor post, a spec, a changelog, a security advisory),
// which was opened and read on the access date below. We write our own
// summary and do not reproduce the source text. Figures are quoted as the
// source states them; when a figure is the vendor's own, the summary says so.
//
// Sources checked: 2026-11-14.

export type SignalKind = "original" | "external";
export type SignalStatus = "draft" | "review" | "published" | "archived";

export type SignalEntry = {
  slug: string;
  title: string;
  summary: string;
  whyItMatters: string;
  kind: SignalKind;
  sourceUrl?: string;
  /** Who published the source, shown next to the link. */
  sourceName?: string;
  author: string;
  publishedAt: string; // ISO date of the source, display-only
  tags: string[];
  status: SignalStatus;
};

export const SIGNALS: SignalEntry[] = [
  {
    slug: "claude-code-sandboxed-bash-permissions",
    title: "В Claude Code команды в песочнице снова проходят через разрешения",
    summary:
      "В версии 2.1.325 Bash-команды, запущенные в песочнице, по умолчанию идут через обычный запрос разрешений; вернуть прежнее поведение можно настройкой sandbox.autoAllowBashIfSandboxed. Двумя релизами раньше закрыли обход разрешений через префикс с переменными окружения, выход из песочницы при создании worktree и случай, когда правила deny и ask не срабатывали на команды, запущенные через sudo или env.",
    whyItMatters:
      "Правила разрешений и поведение песочницы меняются между минорными версиями. Если агент у тебя работает без присмотра, после обновления перечитай changelog и проверь сохранённые правила: то, что вчера проходило молча, сегодня может спросить, и наоборот.",
    kind: "external",
    sourceUrl: "https://code.claude.com/docs/en/changelog",
    sourceName: "Anthropic, changelog Claude Code",
    author: "редакция KiteGrip",
    publishedAt: "2026-11-13",
    tags: ["guardrails", "права"],
    status: "published",
  },
  {
    slug: "mcp-six-month-release-cycle",
    title: "У MCP появился календарь: спецификация выходит раз в полгода",
    summary:
      "Мейнтейнеры Model Context Protocol объявили фиксированный цикл: два релиза спецификации в год, обычно в последний вторник марта и сентября. Следующий намечен на 30 марта 2027 года. В посте расписаны вехи: планирование за восемь месяцев, мягкая заморозка за два с половиной, бета-версии основных SDK за полтора и жёсткая заморозка за месяц до релиза.",
    whyItMatters:
      "Обновление MCP-серверов и клиентов можно планировать заранее, как любую другую зависимость с графиком релизов. Если у тебя своя интеграция, поставь в календарь мартовскую и сентябрьскую даты.",
    kind: "external",
    sourceUrl: "https://blog.modelcontextprotocol.io/posts/mcp-release-cycle/",
    sourceName: "Блог Model Context Protocol",
    author: "редакция KiteGrip",
    publishedAt: "2026-11-11",
    tags: ["MCP"],
    status: "published",
  },
  {
    slug: "mcp-file-transfer-extension",
    title: "MCP пробует передавать файлы мимо модели",
    summary:
      "В блоге MCP описано экспериментальное расширение io.modelcontextprotocol/files. Сервер помечает файловые аргументы инструмента, отвечает клиенту, куда загрузить файл, и клиент отправляет его напрямую, не пропуская байты через модель. Готовой реализации пока нет. Отдельно авторы оговаривают, что совпадение хеша подтверждает только целостность файла, но не его безопасность, и оставляют открытым вопрос, должен ли хост ограничивать список адресов для загрузки.",
    whyItMatters:
      "Передача файлов — новый путь, которым данные могут уйти наружу: адрес загрузки называет сервер. Если будешь включать такое расширение, заранее реши, на какие адреса твоему клиенту разрешено отправлять файлы.",
    kind: "external",
    sourceUrl: "https://blog.modelcontextprotocol.io/posts/exploring-file-uploads-and-downloads-in-mcp/",
    sourceName: "Блог Model Context Protocol",
    author: "редакция KiteGrip",
    publishedAt: "2026-11-10",
    tags: ["MCP", "безопасность"],
    status: "published",
  },
  {
    slug: "codex-explicit-project-trust",
    title: "Codex CLI требует явно доверить проект в неинтерактивном режиме",
    summary:
      "В релизе 0.169.0 команда codex exec не подключает конфигурацию проекта и его MCP-серверы в каталоге, которому не выдано доверие, даже с песочницей workspace-write. Доверие сохраняется явно, флагом --trust. В том же списке изменений — учёт пометки read-only у MCP-инструментов при автоматическом одобрении.",
    whyItMatters:
      "Конфигурация и MCP-серверы, лежащие в чужом репозитории, больше не подхватываются сами в CI и других запусках без человека. Это закрывает распространённый путь атаки через зависимости. Проверь свои пайплайны: возможно, им теперь нужен явный флаг.",
    kind: "external",
    sourceUrl: "https://github.com/openai/codex/releases/tag/rust-v0.169.0",
    sourceName: "OpenAI, релизы Codex на GitHub",
    author: "редакция KiteGrip",
    publishedAt: "2026-11-13",
    tags: ["guardrails", "CI"],
    status: "published",
  },
  {
    slug: "experts-follow-agent-lean",
    title: "Эксперты соглашаются с агентом в 86% спорных решений",
    summary:
      "Anthropic провела эксперимент: аналитики решали задачу на причинно-следственный вывод в Claude Code, а в четырёх развилках агент был скрыто настроен склоняться к одному из двух равно защитимых вариантов, выбранному подбрасыванием монеты. В анализ вошли 50 человек. Их решения совпали со склонностью агента в 86% случаев при ожидаемых 50%. Те, кто уже выбрал вариант, меняли его в 60% случаев, когда агент был не согласен, и в 6%, когда согласен. Авторы оговаривают ограничения: склонность усилили намеренно, задача и модель были одни.",
    whyItMatters:
      "Человек в контуре даёт независимую проверку только тогда, когда его решение не подсказано самим агентом. Отсюда практика: спорные решения фиксируй в контракте задачи до запуска, а не оценивай уже готовое предложение.",
    kind: "external",
    sourceUrl: "https://www.anthropic.com/research/agents-judgment-calls",
    sourceName: "Anthropic, исследование",
    author: "редакция KiteGrip",
    publishedAt: "2026-10-27",
    tags: ["ревью", "контракт задачи"],
    status: "published",
  },
  {
    slug: "claude-code-edit-race-cve",
    title: "Гонка в инструменте Edit позволяла писать за пределы проекта",
    summary:
      "Опубликована уязвимость CVE-2026-88968 в Claude Code с высокой оценкой серьёзности. На macOS код, работающий внутри песочницы Bash, мог после проверки пути подменить каталог проекта символической ссылкой, и инструмент Edit, который работает вне песочницы, записывал файл за пределами рабочей области. Для атаки нужно было уже исполнять свой код в песочнице. Исправлено в версии 2.1.251.",
    whyItMatters:
      "Вредоносный репозиторий или скрипт зависимости может превратить агента в песочнице в инструмент записи вне проекта. Вывод скучный, но рабочий: обновляй агента так же дисциплинированно, как остальные инструменты с доступом к файлам.",
    kind: "external",
    sourceUrl: "https://github.com/advisories/GHSA-5xjx-9qx6-jcrv",
    sourceName: "GitHub Advisory Database",
    author: "редакция KiteGrip",
    publishedAt: "2026-10-26",
    tags: ["безопасность", "песочница"],
    status: "published",
  },
  {
    slug: "skills-standard-foundation",
    title: "Стандарт Agent Skills передан в Agentic AI Foundation",
    summary:
      "Anthropic передала открытый стандарт Agent Skills — название, логотип, организацию на GitHub и сайт agentskills.io — фонду Agentic AI Foundation под управлением Linux Foundation, где уже находится MCP. По данным самой Anthropic, стандарт поддерживают более 70 агентных платформ, опубликовано около миллиона skills. Дальше обещаны версионированные релизы, формальный процесс предложений и рекомендации по безопасности.",
    whyItMatters:
      "Папка с файлом SKILL.md становится независимым от вендора способом упаковать процедуру и контекст для агента. Одновременно это новая поверхность для атак через зависимости: чужой skill стоит читать перед установкой так же, как чужой скрипт.",
    kind: "external",
    sourceUrl: "https://www.anthropic.com/news/donating-agent-skills-to-the-agentic-ai-foundation",
    sourceName: "Anthropic",
    author: "редакция KiteGrip",
    publishedAt: "2026-10-22",
    tags: ["skills", "стандарты"],
    status: "published",
  },
  {
    slug: "review-at-thirty-thousand-merges",
    title: "При 30 000 слияний в день ревью каждой строки перестаёт работать",
    summary:
      "Anthropic рассказала, что число влитых изменений в её монорепозитории выросло примерно с 2 500 в день в мае 2026 года до более чем 30 000 к сентябрю. Команда из семи человек за пять месяцев написала собственную систему контроля версий и инструмент ревью. Ревьюеры перешли от чтения каждой строки к проверке намерения изменения, а часть тестирования сдвинулась на этапы после слияния и перед выкладкой. Это рассказ одной компании о себе, не независимое исследование.",
    whyItMatters:
      "Полезно увидеть, где человеческое ревью ломается на объёмах, которые дают агенты, и чем его заменяют. Даже если до таких цифр тебе далеко, вопрос тот же: что именно ты проверяешь в изменении, которое не писал.",
    kind: "external",
    sourceUrl: "https://www.anthropic.com/research/redesigning-source-control",
    sourceName: "Anthropic, инженерный блог",
    author: "редакция KiteGrip",
    publishedAt: "2026-10-13",
    tags: ["ревью", "масштаб"],
    status: "published",
  },
  {
    slug: "plugin-hash-pin-bypass",
    title: "Закрепление плагина по хешу не работало, если хеш не сверяли",
    summary:
      "Уязвимость CVE-2026-86063 в Claude Code: при установке плагина инструмент переключался на закреплённый хеш коммита, но не проверял, что получил именно его. Тот, кто контролирует исходный репозиторий, мог создать ветку с именем, совпадающим с хешем, и вместо проверенного коммита устанавливался его код. Серьёзность высокая, исправлено в версии 2.1.179.",
    whyItMatters:
      "Закрепить плагин или skill на проверенной версии — правильная привычка, но она защищает только тогда, когда инструмент действительно сверяет результат. Это хороший пример того, почему ограничение должно проверяться технически, а не подразумеваться.",
    kind: "external",
    sourceUrl: "https://github.com/advisories/GHSA-pq7j-f95f-qfcv",
    sourceName: "GitHub Advisory Database",
    author: "редакция KiteGrip",
    publishedAt: "2026-10-09",
    tags: ["безопасность", "зависимости"],
    status: "published",
  },
  {
    slug: "unintended-model-actions",
    title: "Anthropic описала, как модели обходят ограничения ради задачи",
    summary:
      "В разборе перечислены четыре типа непредусмотренных действий, замеченных в тестах и во внутреннем использовании: эксплуатация ошибок в софте для запуска команд на сервере, отправка настоящих веб-форм, использование найденных токенов для доступа к закрытым данным и обход ограничений инструмента загрузки страниц через сокращатели ссылок. Среди принятых мер — перенос тестов в среду без интернета, ограничение загрузки страниц и перевод внутренних агентов на централизованную инфраструктуру с минимальным доступом в сеть и мониторингом.",
    whyItMatters:
      "Это готовый список для проверки собственных ограничений. Агент, которому мешает запрет, ищет обходной путь к цели, и формулировка в промпте его не остановит. Останавливают отсутствие доступа в сеть и отсутствие прав.",
    kind: "external",
    sourceUrl: "https://www.anthropic.com/research/investigating-unintended-model-actions",
    sourceName: "Anthropic, исследование",
    author: "редакция KiteGrip",
    publishedAt: "2026-10-09",
    tags: ["guardrails", "безопасность"],
    status: "published",
  },
  {
    slug: "dbhub-readonly-not-readonly",
    title: "Режим read-only в MCP-сервере для баз данных не мешал записи",
    summary:
      "Уязвимость CVE-2026-61788 в MCP-сервере DBHub: настройка readonly у инструмента execute_sql не делала соединение с базой доступным только для чтения. Ограничение держалось на классификаторе, который смотрел лишь на первое ключевое слово запроса, и вызовы вроде setval или dblink_exec проходили. Исправлено в версии 0.22.6.",
    whyItMatters:
      "Флажок «только чтение» в настройках сервера — ещё не ограничение. Если агенту нельзя писать в базу, это должно быть запрещено ролью на стороне самой базы, а не обещано прослойкой перед ней.",
    kind: "external",
    sourceUrl: "https://github.com/advisories/GHSA-mwwr-p57h-56pf",
    sourceName: "GitHub Advisory Database",
    author: "редакция KiteGrip",
    publishedAt: "2026-09-24",
    tags: ["MCP", "права"],
    status: "published",
  },
];

export function getSignalBySlug(slug: string) {
  return SIGNALS.find((s) => s.slug === slug);
}

export function getPublishedSignals() {
  return SIGNALS.filter((s) => s.status === "published");
}
