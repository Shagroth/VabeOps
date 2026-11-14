// Author roster for the public /authors pages and the home page teaser.
// `isDemo` authors must stay visibly labeled as placeholders in every
// surface that renders them (brief §2 "Авторы") — no invented company
// names, awards, or testimonials attached to a demo persona.

/**
 * The author block is switched off until there is a real person to show.
 * The only profile below is a demo persona, and a school that does not say
 * who teaches is better off saying nothing than showing an invented name.
 *
 * To switch it on: replace the entry in AUTHORS and PROGRAM_AUTHOR in
 * demo-course-program.ts with real data (name, one-line title, short bio,
 * initials), set `isDemo: false`, then set SHOW_AUTHORS to true. That brings
 * back the author card in lessons, the /authors pages, their footer link
 * and sitemap entries, and bylines on signals.
 */
export const SHOW_AUTHORS = false;

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
    bio: "10 лет проектирует backend- и платформенные системы для продуктов с высокой нагрузкой — от биллинга до внутренних платформ разработки. Последние два года встраивает агентные workflow в живые команды — от первого read-only MCP-доступа до guardrails для нескольких параллельных агентов. Пилот ведёт как личный проект, ни от какой компании.",
    avatarGlyph: "ИК",
    isDemo: true,
  },
];

export function getAuthorBySlug(slug: string) {
  return AUTHORS.find((a) => a.slug === slug);
}
