"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type Tag = "div" | "section" | "ol" | "ul" | "li" | "article";

type Props = {
  as?: Tag;
  children: ReactNode;
  className?: string;
  id?: string;
  /** Delay before the block itself comes in, in ms. */
  delay?: number;
  /**
   * `self` (default) moves the block itself. `children` leaves the block in
   * place and plays its `.kg-item`, `.kg-rule` and `.kg-thread` descendants,
   * staggered by their `--i` custom property.
   */
  mode?: "self" | "children";
  "aria-label"?: string;
};

/**
 * Scroll-entry wrapper that fails open. The server renders everything
 * visible. After hydration, only blocks still below the fold are parked
 * (`data-reveal="pending"`) and released when they scroll into view, so a
 * JS error, a missing IntersectionObserver or reduced motion all leave a
 * fully readable static page.
 */
export function Reveal({ as = "div", children, className = "", id, delay = 0, mode = "self", ...rest }: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    el.dataset.reveal = "pending";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.reveal = "in";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      delete el.dataset.reveal;
    };
  }, []);

  const Component = as as "div";
  return (
    <Component
      ref={ref as React.Ref<HTMLDivElement>}
      id={id}
      className={`${mode === "self" ? "kg-self" : ""} ${className}`}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}
      {...rest}
    >
      {children}
    </Component>
  );
}
