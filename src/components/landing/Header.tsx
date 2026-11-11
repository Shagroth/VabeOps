"use client";

import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "#program", label: "Программа" },
  { href: "#how-it-works", label: "Как это работает" },
  { href: "#about", label: "Об авторе" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 border-b bg-ink/95 backdrop-blur transition-[box-shadow,border-color] duration-300 ${
        scrolled
          ? "border-hairline-ink shadow-[0_8px_24px_-16px_rgba(0,0,0,0.8)]"
          : "border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4 lg:px-10">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <circle cx="5" cy="19" r="2" fill="var(--system)" />
            <path d="M7 18 L17 7" stroke="var(--signal)" strokeWidth="1.6" fill="none" />
            <circle cx="19" cy="5" r="2" fill="var(--signal)" />
          </svg>
          <span className="font-medium text-ink-foreground">Vibe Ops</span>
        </div>
        <nav className="hidden items-center gap-7 text-sm text-ink-muted md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="transition-colors duration-200 hover:text-ink-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="#signin"
            className="hidden text-sm text-ink-muted transition-colors duration-200 hover:text-ink-foreground sm:inline"
          >
            Войти
          </a>
          <a
            href="#apply"
            className="rounded-lg bg-signal px-4 py-2 text-sm font-medium text-signal-ink transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]"
          >
            Подать заявку
          </a>
        </div>
      </div>
    </header>
  );
}
