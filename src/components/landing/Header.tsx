"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { KiteGripLogo } from "@/components/brand/KiteGripLogo";

const NAV = [
  { href: "/#courses", label: "Курсы" },
  { href: "/#program", label: "Программа" },
  { href: "/#practice", label: "Как учимся" },
  { href: "/#faq", label: "Вопросы" },
  { href: "/#signin", label: "Войти" },
];

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
      className={`sticky top-0 z-30 border-b bg-paper/90 text-graphite backdrop-blur-md transition-colors duration-300 ${
        scrolled || menuOpen ? "border-hairline" : "border-transparent"
      }`}
    >
      <a
        href="#main-content"
        className="absolute left-2 top-2 z-50 -translate-y-20 rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-signal-ink transition-transform duration-150 focus:translate-y-0"
      >
        Перейти к содержанию
      </a>

      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-5 py-3.5 sm:px-8">
        <Link href="/" onClick={() => setMenuOpen(false)} aria-label="KiteGrip — на главную" className="rounded-lg">
          <KiteGripLogo />
        </Link>

        <nav className="hidden items-center gap-7 text-base font-medium lg:flex" aria-label="Основная навигация">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="kg-link">
              {item.label}
            </Link>
          ))}
          <Link
            href="/#apply"
            className="kg-btn inline-flex min-h-11 items-center rounded-full bg-ink px-[22px] font-semibold text-ink-foreground hover:bg-signal"
          >
            Подать заявку
          </Link>
        </nav>

        <button
          type="button"
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-11 w-11 flex-col items-center justify-center gap-[7px] rounded-full border-[1.5px] border-graphite lg:hidden"
        >
          <span className={`h-[1.5px] w-5 bg-graphite transition-transform duration-300 ${menuOpen ? "translate-y-[4.25px] rotate-45" : ""}`} />
          <span className={`h-[1.5px] w-5 bg-graphite transition-transform duration-300 ${menuOpen ? "-translate-y-[4.25px] -rotate-45" : ""}`} />
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-nav" className="border-t border-hairline bg-paper px-5 pb-8 pt-4 sm:px-8 lg:hidden" aria-label="Мобильная навигация">
          <ul className="flex flex-col">
            {NAV.map((item, i) => (
              <li key={item.href} className="kg-menu-item border-b border-hairline" style={{ "--i": i } as CSSProperties}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-14 items-center justify-between text-2xl font-extrabold tracking-[-0.02em]"
                >
                  {item.label}
                  <span className="font-mono text-sm font-normal text-string">0{i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/#apply"
            onClick={() => setMenuOpen(false)}
            className="kg-btn kg-menu-item mt-6 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-signal px-7 text-[17px] font-semibold text-signal-ink"
            style={{ "--i": NAV.length } as CSSProperties}
          >
            Подать заявку на пилот
          </Link>
        </nav>
      )}

      {/* Scroll progress drawn as the red line; decorative, CSS-driven. */}
      <span aria-hidden="true" className="kg-progress absolute inset-x-0 bottom-[-1.5px] h-[1.5px] bg-string" />
    </header>
  );
}
