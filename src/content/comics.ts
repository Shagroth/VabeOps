// "KiteGrip Cases" — the school's comic format: a short incident told in
// slides. Three recurring characters and the agent, drawn as the kite.
// Every slide has a drawn scene (components/comics/ComicScene) and its
// dialogue as real DOM text, so the comic reads with images off and in a
// screen reader.

export type CharacterId = "dan" | "rina" | "viktor";

export type Character = {
  id: CharacterId;
  name: string;
  role: string;
  blindSpot: string;
  accent: "signal" | "ink" | "copper";
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
    accent: "ink",
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

export type SceneId = "cover" | "alert" | "prompt" | "green" | "partner" | "incident" | "review" | "fix";

export type ComicLine = {
  /** `system` is narration, `agent` is the agent speaking. */
  character: CharacterId | "system" | "agent";
  text: string;
};

export type ComicPanelData = {
  caption: string;
  scene: SceneId;
  /** What the drawing shows, for screen readers. */
  sceneAlt: string;
  lines: ComicLine[];
};

export type ComicEpisode = {
  slug: string;
  seriesSlug: string;
  order: number;
  title: string;
  summary: string;
  panels: ComicPanelData[];
  /** The practical outcome of the episode, shown after the last slide. */
  checklist: string[];
};

export const COMIC_SERIES = {
  slug: "vabeops-cases",
  title: "KiteGrip Cases",
  description:
    "Короткие истории о том, где работа с агентом ломается на практике. Обычно это понятно уже после инцидента. Здесь можно посмотреть со стороны.",
};

export const EPISODE_1: ComicEpisode = {
  slug: "agent-fixed-tests-broke-contract",
  seriesSlug: COMIC_SERIES.slug,
  order: 1,
  title: "Агент починил тесты и сломал контракт",
  summary:
    "Срочный баг, широкий запрос агенту, зелёные тесты — и сломанный внешний контракт, который эти тесты не проверяли.",
  panels: [
    {
      caption: "Эпизод 1",
      scene: "cover",
      sceneAlt: "Дэн, Рина и Виктор стоят рядом. Над ними летит змей — агент — на красной нити, которую никто не держит.",
      lines: [
        { character: "system", text: "Пятница. До деплоя двадцать минут." },
        { character: "system", text: "Листай стрелками или свайпом →" },
      ],
    },
    {
      caption: "Срочный баг",
      scene: "alert",
      sceneAlt: "Дэн за столом смотрит в монитор, на экране красная ошибка 500. На стене часы показывают 21:40.",
      lines: [
        { character: "system", text: "21:40. Алерт: /api/orders отдаёт 500 для части заказов." },
        { character: "dan", text: "Деплой в 22:00. Чиню прямо сейчас." },
      ],
    },
    {
      caption: "Слишком широкий запрос",
      scene: "prompt",
      sceneAlt: "Дэн печатает запрос. Рядом змей-агент с нитью, свободно висящей в воздухе.",
      lines: [
        { character: "dan", text: "Почини orders-сервис, чтобы все тесты снова были зелёными." },
        { character: "agent", text: "Принято. Про контракт ответа API в задаче ничего нет." },
      ],
    },
    {
      caption: "Зелёные тесты",
      scene: "green",
      sceneAlt: "На мониторе двенадцать галочек. Дэн доволен. Змей-агент улетел высоко, нить болтается.",
      lines: [
        { character: "agent", text: "Переименовал discountCents в discount, обновил тесты. Все проходят." },
        { character: "dan", text: "12 из 12 зелёные. Деплою." },
      ],
    },
    {
      caption: "Чужой контракт",
      scene: "partner",
      sceneAlt: "Рина показывает на телефон с приложением партнёра. На экране телефона поле discountCents и знак вопроса.",
      lines: [
        { character: "rina", text: "Стоп. discountCents читает мобильное приложение партнёра. Этого поля в ответе больше нет." },
        { character: "dan", text: "Юнит-тесты такого не ловят. Они проверяют логику внутри, а форму ответа наружу — нет." },
      ],
    },
    {
      caption: "Инцидент",
      scene: "incident",
      sceneAlt: "Три телефона с перечёркнутыми экранами. Рина тянется к кнопке отката. На часах 22:14.",
      lines: [
        { character: "system", text: "22:14. Приложение партнёра падает на разборе ответа у 40% пользователей." },
        { character: "rina", text: "Откатываю деплой. Дальше разбор, а не ещё один быстрый патч." },
      ],
    },
    {
      caption: "Разбор",
      scene: "review",
      sceneAlt: "Виктор стоит у доски. На доске написано: тесты зелёные не равно баг исправлен. Дэн слушает.",
      lines: [
        { character: "viktor", text: "Какая задача была у агента: «тесты зелёные» или «баг исправлен без разрыва контракта»?" },
        { character: "dan", text: "Честно — первая. Про контракт я не сказал ни слова." },
        { character: "viktor", text: "Вот и правило: изменение публичного ответа API подтверждает человек. До мержа." },
      ],
    },
    {
      caption: "Исправленный процесс",
      scene: "fix",
      sceneAlt: "Дэн держит ручку-хватку, от неё красная нить тянется к змею-агенту. Рядом Рина с чек-листом.",
      lines: [
        { character: "rina", text: "Добавляем contract-тест на форму ответа. Он падает отдельно от юнит-тестов." },
        { character: "dan", text: "И в задаче агенту пишу прямо: публичный контракт /api/orders менять нельзя." },
        { character: "agent", text: "Понял. Если понадобится его тронуть — остановлюсь и спрошу." },
      ],
    },
  ],
  checklist: [
    "В задаче агенту назван публичный контракт, который менять нельзя.",
    "Есть отдельный тест на форму ответа API, и он умеет падать.",
    "Изменение публичного ответа требует подтверждения человека до мержа.",
    "«Тесты зелёные» не считается проверкой, пока не ясно, что именно они проверяют.",
  ],
};
