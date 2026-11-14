// "Signals" — short editorial format (brief §8): a quick explanation of
// something happening in agentic engineering + why it matters to a
// practicing engineer. External items are curated by hand on purpose (no
// auto-ingestion — see backlog) and link out rather than reproduce the
// source text. `sourceUrl` on the external items is a placeholder
// (example.com) until a real piece is picked and attributed — this file
// ships as a skeleton, not as already-curated real news.

export type SignalKind = "original" | "external";
export type SignalStatus = "draft" | "review" | "published" | "archived";

export type SignalEntry = {
  slug: string;
  title: string;
  summary: string;
  whyItMatters: string;
  kind: SignalKind;
  sourceUrl?: string;
  sourceIsPlaceholder?: boolean;
  author: string;
  publishedAt: string; // ISO date, display-only
  tags: string[];
  status: SignalStatus;
};

export const SIGNALS: SignalEntry[] = [
  {
    slug: "approval-gates-are-not-one-size",
    title: "Approval-гейты перестают быть бинарными",
    summary:
      "Команды всё чаще делят подтверждения на уровни: read проходит автоматически, write в прод-путях идёт через обязательный review, для необратимых операций есть отдельный гейт. Одно общее «спроси перед всем» уходит.",
    whyItMatters:
      "Если у тебя один approval на все действия агента, он наверняка либо дёргает по мелочам, либо пропускает рискованное. Деление по уровню риска работает, его стоит просто скопировать.",
    kind: "original",
    author: "Игорь Ковалёв",
    publishedAt: "2026-10-28",
    tags: ["guardrails", "approval"],
    status: "published",
  },
  {
    slug: "context-window-growth-not-the-fix",
    title: "Рост контекстного окна не отменяет контекст-инжиниринг",
    summary:
      "Модели с большим окном по-прежнему теряются в неструктурированном контексте. Объём форму не заменяет.",
    whyItMatters:
      "Идея «теперь можно скормить весь репозиторий» на практике не работает. Разделение на задачу, ограничения и проверку нужно при любом размере окна.",
    kind: "original",
    author: "Игорь Ковалёв",
    publishedAt: "2026-11-02",
    tags: ["context engineering"],
    status: "published",
  },
  {
    slug: "mcp-permission-scopes-field-notes",
    title: "Полевые заметки сообщества о permission scope в MCP",
    summary:
      "Кейсы, где слишком широкий scope MCP-интеграции закончился инцидентом, и чек-лист, который из них получается.",
    whyItMatters:
      "Учиться на чужом инциденте дешевле, чем на своём. Загляни сюда, прежде чем давать агенту write-доступ через MCP.",
    kind: "external",
    sourceUrl: "https://example.com/mcp-permission-scopes-field-notes",
    sourceIsPlaceholder: true,
    author: "курирует Игорь Ковалёв",
    publishedAt: "2026-11-05",
    tags: ["MCP", "безопасность"],
    status: "published",
  },
  {
    slug: "multi-agent-coordination-cost-writeup",
    title: "Разбор реальной стоимости координации в мультиагентных системах",
    summary:
      "Во что на практике обходится синхронизация состояния, когда над одной задачей работают несколько агентов.",
    whyItMatters:
      "Прочитай перед тем, как проектировать мультиагентную схему. И сравни цифры с ожидаемым выигрышем, а не с ощущением «звучит мощно».",
    kind: "external",
    sourceUrl: "https://example.com/multi-agent-coordination-cost-writeup",
    sourceIsPlaceholder: true,
    author: "курирует Игорь Ковалёв",
    publishedAt: "2026-11-09",
    tags: ["мультиагентные системы"],
    status: "published",
  },
];

export function getSignalBySlug(slug: string) {
  return SIGNALS.find((s) => s.slug === slug);
}

export function getPublishedSignals() {
  return SIGNALS.filter((s) => s.status === "published");
}
