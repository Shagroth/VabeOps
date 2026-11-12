// Author roster for the public /authors pages and the home page teaser.
// `isDemo` authors must stay visibly labeled as placeholders in every
// surface that renders them (brief §2 "Авторы") — no invented company
// names, awards, or testimonials attached to a demo persona.

export type AuthorEntry = {
  slug: string;
  displayName: string;
  title: string;
  bio: string;
  avatarGlyph: string;
  isDemo: boolean;
};

export const AUTHORS: AuthorEntry[] = [
  {
    slug: "igor-kovalev",
    displayName: "Игорь Ковалёв",
    title: "Архитектор · 10 лет в backend и платформенной инженерии",
    bio: "10 лет проектирует backend- и платформенные системы для продуктов с высокой нагрузкой — от биллинга до внутренних платформ разработки. Последние два года целенаправленно встраивает агентные workflow в существующие команды: от первого read-only MCP-доступа до guardrails для нескольких агентов, работающих параллельно. Ведёт этот пилот как личный проект, а не как представитель какой-либо компании.",
    avatarGlyph: "ИК",
    isDemo: true,
  },
];

export function getAuthorBySlug(slug: string) {
  return AUTHORS.find((a) => a.slug === slug);
}
