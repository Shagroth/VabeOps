"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type NavItem = { href: string; label: string };
type NavGroupDef = { label: string; items: NavItem[] };

const NAV_GROUPS: NavGroupDef[] = [
  {
    label: "Учиться",
    items: [
      { href: "/courses", label: "Каталог обучения" },
      { href: "/demo-course", label: "Бесплатный demo-курс" },
      { href: "/#program", label: "Программа пилота" },
    ],
  },
  {
    label: "Журнал",
    items: [
      { href: "/journal", label: "Статьи" },
      { href: "/signals", label: "Signals" },
      { href: "/comics", label: "Комиксы" },
    ],
  },
  {
    label: "О VabeOps",
    items: [
      { href: "/authors", label: "Авторы" },
      { href: "/#about", label: "О пилоте" },
    ],
  },
];

const SIMPLE_LINK: NavItem = { href: "/events", label: "События" };

function Wordmark() {
  return (
    <div className="flex items-center gap-2">
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <circle cx="5" cy="19" r="2" fill="var(--system)" />
        <path d="M7 18 L17 7" stroke="var(--signal)" strokeWidth="1.6" fill="none" />
        <circle cx="19" cy="5" r="2" fill="var(--signal)" />
      </svg>
      <span className="font-medium text-ink-foreground">VabeOps</span>
    </div>
  );
}

function NavGroup({ group }: { group: NavGroupDef }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 transition-colors duration-200 hover:text-ink-foreground"
      >
        {group.label}
        <svg viewBox="0 0 10 6" className={`h-1.5 w-2.5 transition-transform duration-150 ${open ? "rotate-180" : ""}`} aria-hidden="true">
          <path d="M1 1 L5 5 L9 1" stroke="currentColor" strokeWidth="1.4" fill="none" />
        </svg>
      </button>
      {open && (
        <div
          role="menu"
          aria-label={group.label}
          className="absolute left-0 top-full z-40 mt-3 min-w-[200px] rounded-xl border border-hairline-ink bg-ink p-1.5 shadow-[0_16px_32px_-16px_rgba(0,0,0,0.6)]"
        >
          {group.items.map((item) => (
            <Link
              key={item.href}
              role="menuitem"
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm text-ink-muted transition-colors duration-150 hover:bg-white/5 hover:text-ink-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
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
      <a
        href="#main-content"
        className="absolute left-2 top-2 z-50 -translate-y-16 rounded-lg bg-signal px-4 py-2 text-sm font-medium text-signal-ink transition-transform duration-150 focus:translate-y-0"
      >
        Перейти к содержанию
      </a>
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" onClick={() => setMenuOpen(false)}>
          <Wordmark />
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-ink-muted lg:flex" aria-label="Основная навигация">
          {NAV_GROUPS.map((group) => (
            <NavGroup key={group.label} group={group} />
          ))}
          <Link href={SIMPLE_LINK.href} className="transition-colors duration-200 hover:text-ink-foreground">
            {SIMPLE_LINK.label}
          </Link>
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
        <nav className="border-t border-hairline-ink bg-ink px-6 py-4 lg:hidden" aria-label="Мобильная навигация">
          <ul className="flex flex-col gap-4">
            {NAV_GROUPS.map((group) => (
              <li key={group.label}>
                <div className="mb-1.5 font-mono text-[10px] uppercase tracking-wide text-ink-muted/70">
                  {group.label}
                </div>
                <ul className="flex flex-col gap-1">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-lg px-2 py-2 text-sm text-ink-muted transition-colors duration-150 hover:bg-white/5 hover:text-ink-foreground"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
            <li>
              <Link
                href={SIMPLE_LINK.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-2 py-2.5 text-sm text-ink-muted transition-colors duration-150 hover:bg-white/5 hover:text-ink-foreground"
              >
                {SIMPLE_LINK.label}
              </Link>
            </li>
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
