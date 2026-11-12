// "VabeOps Cases" — the brand's recurring comic format (brief §7).
// Three original recurring characters + one complete first episode.
// Dialogue IS the transcript (real DOM text, not baked into an image) —
// that's the accessible alternative required by the brief, not an
// afterthought bolted on separately.

export type CharacterId = "dan" | "rina" | "viktor";

export type Character = {
  id: CharacterId;
  name: string;
  role: string;
  blindSpot: string;
  accent: "signal" | "system" | "copper";
};

export const CHARACTERS: Character[] = [
  {
    id: "dan",
    name: "Дэн",
    role: "Продуктовый инженер — действует быстро",
    blindSpot: "Слишком легко доверяет агенту, когда поджимает срок — формулирует запрос по симптому, не по контракту.",
    accent: "signal",
  },
  {
    id: "rina",
    name: "Рина",
    role: "Инфраструктурный инженер — думает о рисках и доступах",
    blindSpot: "Видит риск быстро, но иногда подключается уже после того, как решение принято, а не до.",
    accent: "system",
  },
  {
    id: "viktor",
    name: "Виктор",
    role: "Архитектор-ментор — задаёт вопросы",
    blindSpot: "Хорошо находит условие пересмотра постфактум, но редко успевает предупредить до инцидента.",
    accent: "copper",
  },
];

export function getCharacter(id: CharacterId) {
  return CHARACTERS.find((c) => c.id === id)!;
}

export type ComicPanelData = {
  caption: string;
  lines: { character: CharacterId | "system"; text: string }[];
};

export type ComicEpisode = {
  slug: string;
  seriesSlug: string;
  order: number;
  title: string;
  summary: string;
  panels: ComicPanelData[];
};

export const COMIC_SERIES = {
  slug: "vabeops-cases",
  title: "VabeOps Cases",
  description:
    "Короткие кейсы о том, где агентный workflow ломается на практике — и как это обычно читается уже после инцидента, а не до него. Три повторяющихся героя, один компетентный слепой пятно у каждого.",
};

export const EPISODE_1: ComicEpisode = {
  slug: "agent-fixed-tests-broke-contract",
  seriesSlug: COMIC_SERIES.slug,
  order: 1,
  title: "Агент починил тесты и сломал контракт",
  summary:
    "Срочный баг, широкий запрос агенту, зелёные тесты — и сломанный внешний контракт, который тесты не проверяли.",
  panels: [
    {
      caption: "1. Срочный баг",
      lines: [
        { character: "system", text: "21:40. Алерт: /api/orders отдаёт 500 для части заказов." },
        { character: "dan", text: "Деплой в 22:00. Чиню прямо сейчас." },
      ],
    },
    {
      caption: "2. Агент получает слишком широкий запрос",
      lines: [
        { character: "dan", text: "Почини orders-сервис, чтобы все тесты снова были зелёными." },
        { character: "system", text: "Агент: контракт ответа API не указан как ограничение." },
      ],
    },
    {
      caption: "3. Быстрый патч и зелёные тесты",
      lines: [
        { character: "system", text: "Агент переименовал поле discountCents → discount, тесты обновлены и проходят." },
        { character: "dan", text: "12/12 зелёных. Деплою." },
      ],
    },
    {
      caption: "4. Неучтённый внешний контракт",
      lines: [
        { character: "rina", text: "Стоп — discountCents читает мобильное приложение партнёра. Этого поля больше нет в ответе." },
        { character: "dan", text: "Юнит-тесты это не ловят — они проверяют внутреннюю логику, не форму ответа наружу." },
      ],
    },
    {
      caption: "5. Инцидент",
      lines: [
        { character: "system", text: "22:14. Партнёрское приложение падает на парсинге ответа у 40% пользователей." },
        { character: "rina", text: "Откатываю деплой. Дальше — разбор, а не ещё один быстрый патч." },
      ],
    },
    {
      caption: "6. Разбор Decision Trail",
      lines: [
        { character: "viktor", text: "Какая была задача у агента — 'тесты зелёные' или 'баг исправлен без разрыва контракта'?" },
        { character: "dan", text: "Честно — первое. Контракт я не проговорил вообще." },
        { character: "viktor", text: "Вот и условие пересмотра: любое изменение публичного ответа API требует отдельного подтверждения, даже если юнит-тесты не против." },
      ],
    },
    {
      caption: "7. Исправленный workflow и чек-лист",
      lines: [
        { character: "rina", text: "Добавляем contract-тест на форму ответа — он должен падать отдельно от юнит-тестов." },
        { character: "dan", text: "И в задачу агенту — явно: 'публичный контракт /api/orders менять нельзя' до того, как он начнёт." },
        { character: "viktor", text: "Approval-гейт на изменения публичных ответов — обязателен, даже когда 'тесты зелёные'." },
      ],
    },
  ],
};
