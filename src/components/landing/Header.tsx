"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/#program", label: "Курс" },
  { href: "/courses", label: "Мини-курсы" },
  { href: "/events", label: "Мероприятия" },
  { href: "/journal", label: "Журнал" },
  { href: "/#about", label: "О проекте" },
  { href: "/#faq", label: "FAQ" },
];

function Wordmark() {
  return (
    <div className="flex items-center gap-2">
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <circle cx="5" cy="19" r="2" fill="var(--system)" />
        <path d="M7 18 L17 7" stroke="var(--signal)" strokeWidth="1.6" fill="none" />
        <circle cx="19" cy="5" r="2" fill="var(--signal)" />
      </svg>
      <span className="font-medium text-ink-foreground">Vibe Ops</span>
    </div>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-30 border-b bg-ink/95 backdrop-blur transition-[box-shadow,border-color] duration-300 ${
        scrolled
          ? "border-hairline-ink shadow-[0_8px_24px_-16px_rgba(0,0,0,0.8)]"
          : "border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" onClick={() => setMenuOpen(false)}>
          <Wordmark />
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-ink-muted lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition-colors duration-200 hover:text-ink-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/#signin"
            className="text-sm text-ink-muted transition-colors duration-200 hover:text-ink-foreground"
          >
            Войти
          </Link>
          <Link
            href="/#apply"
            className="rounded-lg bg-signal px-4 py-2 text-sm font-medium text-signal-ink transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]"
          >
            Подать заявку
          </Link>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-lg border border-hairline-ink lg:hidden"
        >
          <span
            className={`h-px w-5 bg-ink-foreground transition-transform duration-200 ${
              menuOpen ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-5 bg-ink-foreground transition-transform duration-200 ${
              menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-hairline-ink bg-ink px-6 py-4 lg:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-2 py-2.5 text-sm text-ink-muted transition-colors duration-150 hover:bg-white/5 hover:text-ink-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center gap-3 border-t border-hairline-ink pt-3">
            <Link
              href="/#signin"
              onClick={() => setMenuOpen(false)}
              className="text-sm text-ink-muted hover:text-ink-foreground"
            >
              Войти
            </Link>
            <Link
              href="/#apply"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg bg-signal px-4 py-2 text-sm font-medium text-signal-ink"
            >
              Подать заявку
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
