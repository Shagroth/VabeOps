"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ComicScene } from "./ComicScene";
import { getCharacter, type ComicLine, type ComicPanelData } from "@/content/comics";

/**
 * The comic as slides. It is a native horizontal scroll-snap strip, so
 * swiping works on touch screens and the comic is still readable as a
 * scrollable strip without JavaScript. Buttons, dots and the arrow keys
 * (when the strip has focus) move between slides.
 */

const SPEAKER: Record<string, { name: string; bubble: string }> = {
  dan: { name: "Дэн", bubble: "bg-white text-graphite border-graphite" },
  rina: { name: "Рина", bubble: "bg-white text-graphite border-graphite" },
  viktor: { name: "Виктор", bubble: "bg-white text-graphite border-graphite" },
  agent: { name: "Агент", bubble: "bg-signal text-white border-graphite" },
};

function Bubble({ line }: { line: ComicLine }) {
  if (line.character === "system") {
    return <p className="self-start rounded-[6px] bg-ink px-3.5 py-2 font-mono text-[13px] leading-snug text-ink-foreground sm:text-sm">{line.text}</p>;
  }
  const speaker = SPEAKER[line.character];
  const name = line.character === "agent" ? speaker.name : getCharacter(line.character).name;
  return (
    <p className={`relative max-w-[34em] rounded-[22px] border-[2.5px] px-4 py-2.5 text-[15px] leading-snug sm:text-base ${speaker.bubble}`}>
      <span className="mr-1.5 font-mono text-xs uppercase tracking-[0.08em] opacity-80">{name}</span>
      {line.text}
    </p>
  );
}

export function ComicViewer({ panels, title }: { panels: ComicPanelData[]; title: string }) {
  const strip = useRef<HTMLOListElement>(null);
  const [current, setCurrent] = useState(0);
  const last = panels.length - 1;

  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrent(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { root: el, threshold: 0.6 },
    );
    Array.from(el.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, []);

  function goTo(index: number) {
    const el = strip.current;
    const target = el?.children[Math.max(0, Math.min(last, index))] as HTMLElement | undefined;
    if (!el || !target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: target.offsetLeft - el.offsetLeft, behavior: reduce ? "auto" : "smooth" });
  }

  function onKeyDown(event: KeyboardEvent<HTMLOListElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(current + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(current - 1);
    }
  }

  const nav = "kg-btn inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 font-semibold disabled:cursor-not-allowed";

  return (
    <section aria-roledescription="комикс" aria-label={title} className="min-w-0">
      <ol
        ref={strip}
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-label="Слайды комикса. Стрелки влево и вправо листают"
        className="flex snap-x snap-mandatory overflow-x-auto rounded-[28px] border-[2.5px] border-graphite bg-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {panels.map((panel, i) => (
          <li
            key={panel.caption}
            data-index={i}
            aria-label={`Слайд ${i + 1} из ${panels.length}: ${panel.caption}`}
            className="flex w-full flex-none snap-center flex-col"
          >
            <div className="flex items-center justify-between gap-3 border-b-[2.5px] border-graphite px-5 py-3 sm:px-7">
              <h2 className="text-lg font-extrabold tracking-[-0.02em] sm:text-xl">{panel.caption}</h2>
              <span className="font-mono text-[13px] text-graphite-muted">
                {String(i + 1).padStart(2, "0")} / {String(panels.length).padStart(2, "0")}
              </span>
            </div>
            <div className="flex min-h-[132px] flex-1 flex-col justify-end gap-2.5 px-5 py-4 sm:px-7">
              {panel.lines.map((line, n) => (
                <div key={line.text} className={`flex ${line.character === "system" ? "" : n % 2 === 0 ? "justify-start" : "justify-end"}`}>
                  <Bubble line={line} />
                </div>
              ))}
            </div>
            <ComicScene scene={panel.scene} alt={panel.sceneAlt} className="aspect-[800/460] w-full border-t-[2.5px] border-graphite" />
          </li>
        ))}
      </ol>

      <div className="mt-5 flex items-center justify-between gap-4">
        <button type="button" onClick={() => goTo(current - 1)} disabled={current === 0} className={`${nav} border-[1.5px] border-graphite hover:bg-ink hover:text-ink-foreground disabled:border-hairline-strong disabled:text-graphite-muted disabled:hover:bg-transparent`}>
          <span aria-hidden="true">←</span> Назад
        </button>
        <span className="font-mono text-[13px] text-graphite-muted sm:hidden" aria-hidden="true">
          {current + 1} / {panels.length}
        </span>
        <div className="hidden items-center gap-1 sm:flex" role="group" aria-label="Перейти к слайду">
          {panels.map((panel, i) => (
            <button
              key={panel.caption}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Слайд ${i + 1}: ${panel.caption}`}
              aria-current={i === current ? "true" : undefined}
              className="flex h-11 w-5 items-center justify-center sm:w-7"
            >
              <span className={`h-[3px] w-full rounded-full transition-colors duration-300 ${i <= current ? "bg-string" : "bg-hairline-strong"}`} />
            </button>
          ))}
        </div>
        <button type="button" onClick={() => goTo(current + 1)} disabled={current === last} className={`${nav} bg-signal text-signal-ink hover:bg-sky-deep disabled:bg-paper-deep disabled:text-graphite-muted`}>
          Дальше <span aria-hidden="true" className="kg-arrow">→</span>
        </button>
      </div>
    </section>
  );
}
