import type { SVGProps } from "react";

/**
 * The KiteGrip mark: a kite that doubles as the AI "spark", the red line
 * (the task contract) and the grip handle (the human decision).
 *
 * - `full`: kite with spars, line with two bows, handle. Hero and posters.
 * - `compact`: kite, short line, handle. Header logo, avatar.
 * - `favicon`: the kite alone, for 16–32px.
 *
 * `tone` names the ground the mark sits on. The line stays red on every
 * ground: it is the brand's main identifier.
 */
export type KiteGripMarkVariant = "full" | "compact" | "favicon";
export type KiteGripMarkTone = "light" | "dark" | "sky";

const TONES: Record<KiteGripMarkTone, { kite: string; spars: string; grip: string }> = {
  light: { kite: "var(--signal)", spars: "#ffffff", grip: "var(--ink)" },
  dark: { kite: "var(--paper)", spars: "var(--ink)", grip: "var(--paper)" },
  sky: { kite: "#ffffff", spars: "var(--signal)", grip: "var(--ink)" },
};

const VIEW_BOX: Record<KiteGripMarkVariant, string> = {
  full: "0 0 400 640",
  compact: "0 0 120 260",
  favicon: "0 0 120 180",
};

type Props = Omit<SVGProps<SVGSVGElement>, "children"> & {
  variant?: KiteGripMarkVariant;
  tone?: KiteGripMarkTone;
  /** Accessible name. Omit when the mark sits next to the wordmark: it is then decorative. */
  label?: string;
};

export function KiteGripMark({ variant = "compact", tone = "light", label, ...rest }: Props) {
  const c = TONES[tone];
  const a11y = label ? { role: "img" as const, "aria-label": label } : { "aria-hidden": true as const };

  return (
    <svg viewBox={VIEW_BOX[variant]} xmlns="http://www.w3.org/2000/svg" {...a11y} {...rest}>
      {variant === "full" && (
        <>
          <path d="M200 40 Q206 104 250 110 Q206 116 200 210 Q194 116 150 110 Q194 104 200 40 Z" fill={c.kite} />
          <path d="M200 44 L200 206 M154 110 L246 110" stroke={c.spars} strokeWidth="1.4" opacity="0.8" />
          <path
            d="M200 210 C 110 320, 300 400, 200 480 C 130 536, 220 570, 200 596"
            fill="none"
            stroke="var(--string)"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path d="M192 349 L204 356 L192 363 Z M216 349 L204 356 L216 363 Z" fill="var(--string)" />
          <path d="M169 542 L181 549 L169 556 Z M193 542 L181 549 L193 556 Z" fill="var(--string)" />
          <rect x="164" y="594" width="72" height="20" rx="10" fill={c.grip} />
        </>
      )}
      {variant === "compact" && (
        <>
          <path d="M60 0 Q66 64 110 70 Q66 76 60 170 Q54 76 10 70 Q54 64 60 0 Z" fill={c.kite} />
          <path d="M60 170 C 42 196, 78 214, 60 240" fill="none" stroke="var(--string)" strokeWidth="7" />
          <rect x="34" y="238" width="52" height="16" rx="8" fill={c.grip} />
        </>
      )}
      {variant === "favicon" && (
        <path d="M60 5 Q66 69 110 75 Q66 81 60 175 Q54 81 10 75 Q54 69 60 5 Z" fill={c.kite} />
      )}
    </svg>
  );
}
