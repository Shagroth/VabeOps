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
      "Всё больше команд разделяют 'подтверждение' на уровни: авто-approve для read, обязательный review для write в прод-путях, и отдельный гейт для необратимых операций — вместо одного общего 'спросить перед всем'.",
    whyItMatters:
      "Если у тебя один общий approval на все действия агента, скорее всего он либо слишком шумный (спрашивает по мелочи), либо слишком широкий (пропускает рискованное). Разделение по риску — рабочий паттерн, который стоит скопировать.",
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
      "Модели с большим окном всё ещё теряются, если контекст не структурирован — объём не заменяет форму.",
    whyItMatters:
      "Соблазн 'теперь можно просто скормить весь репозиторий' не проходит проверку практикой. Дисциплина 'задача / ограничения / проверка' остаётся нужной независимо от размера окна.",
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
      "Разбор конкретных кейсов, где слишком широкий scope MCP-интеграции привёл к инцидентам — и что из этого можно вынести как чек-лист.",
    whyItMatters:
      "Чужой разбор инцидента дешевле собственного — стоит свериться перед тем, как выдавать агенту write-доступ через MCP.",
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
      "Инженерный разбор того, во что на практике обходится синхронизация состояния между несколькими агентами на одной задаче.",
    whyItMatters:
      "Хорошая проверка перед тем, как проектировать мультиагентную схему: сравни цифры с ожидаемым выигрышем, а не с ощущением 'звучит мощно'.",
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
