import Link from "next/link";
import { KiteGripLogo } from "@/components/brand/KiteGripLogo";
import { SHOW_AUTHORS } from "@/content/authors";

const COLUMNS = [
  {
    title: "Школа",
    links: [
      { href: "/#courses", label: "Курсы" },
      { href: "/#program", label: "Программа" },
      { href: "/#faq", label: "Вопросы" },
      { href: "/#apply", label: "Подать заявку" },
    ],
  },
  {
    title: "Материалы",
    links: [
      { href: "/demo-course", label: "KiteGrip for Engineers" },
      { href: "/first-flight", label: "First Flight" },
      { href: "/courses", label: "Мини-курсы" },
      { href: "/journal", label: "Журнал" },
      { href: "/signals", label: "Signals" },
      { href: "/comics", label: "Комиксы" },
      { href: "/events", label: "События" },
    ],
  },
  {
    title: "О школе",
    links: [
      ...(SHOW_AUTHORS ? [{ href: "/authors", label: "Авторы" }] : []),
      { href: "/privacy", label: "Политика данных" },
      { href: "/#signin", label: "Войти" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-ink text-ink-muted">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.3fr_2fr]">
        <div className="flex flex-col gap-5">
          <Link href="/" aria-label="KiteGrip — на главную" className="self-start rounded-lg text-ink-foreground">
            <KiteGripLogo tone="dark" />
          </Link>
          <p lang="en" className="font-mono text-[13px]">
            Let it fly. Keep your grip.
          </p>
        </div>

        <nav aria-label="Ссылки в подвале" className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
          {COLUMNS.map((column) => (
            <div key={column.title} className="flex flex-col gap-4">
              <span className="font-mono text-xs uppercase tracking-[0.08em] text-sky-on-ink">{column.title}</span>
              <ul className="flex flex-col gap-1">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-9 items-center text-[15px] transition-colors duration-200 hover:text-ink-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-ink-line">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-5 py-6 font-mono text-[13px] sm:px-8">
          <span>© {new Date().getFullYear()} KiteGrip</span>
          <span>Школа работы с ИИ</span>
        </div>
      </div>
    </footer>
  );
}
