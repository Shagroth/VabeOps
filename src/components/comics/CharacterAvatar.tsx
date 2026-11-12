import type { CharacterId } from "@/content/comics";

// Simple flat silhouettes — one accent color + one prop per character,
// deliberately simple enough to survive being shrunk to a sticker (brief
// §7: "простые силуэты, характерные цвета/предметы, ясная форма").

const ACCENT_VAR: Record<CharacterId, string> = {
  dan: "var(--signal)",
  rina: "var(--system)",
  viktor: "var(--copper)",
};

function Head({ fill }: { fill: string }) {
  return <circle cx="32" cy="24" r="14" fill={fill} />;
}

function Body({ fill }: { fill: string }) {
  return <path d="M14 62 C14 44 20 36 32 36 C44 36 50 44 50 62 Z" fill={fill} />;
}

export function CharacterAvatar({
  id,
  className = "",
}: {
  id: CharacterId;
  className?: string;
}) {
  const fill = ACCENT_VAR[id];
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label={`Силуэт персонажа`}>
      <Body fill={fill} />
      <Head fill={fill} />
      {id === "dan" && (
        // lightning bolt — moves fast
        <path d="M34 10 L24 28 L31 28 L27 42 L41 22 L33 22 Z" fill="var(--ink)" opacity="0.85" />
      )}
      {id === "rina" && (
        // shield/keyhole — thinks about access
        <g fill="var(--ink)" opacity="0.85">
          <path d="M32 12 L42 16 V26 C42 33 37 38 32 40 C27 38 22 33 22 26 V16 Z" />
          <circle cx="32" cy="23" r="3" fill={fill} />
        </g>
      )}
      {id === "viktor" && (
        // question mark / compass needle — asks questions
        <g>
          <circle cx="32" cy="10" r="2.6" fill="var(--ink)" opacity="0.85" />
          <path
            d="M27 16 C27 12 29 9 33 9 C37 9 39 12 38 16 C37 19 33 19 33 23"
            stroke="var(--ink)"
            strokeWidth="2.4"
            fill="none"
            opacity="0.85"
            transform="translate(0 2) scale(0.9) translate(3.2 0)"
          />
        </g>
      )}
    </svg>
  );
}
