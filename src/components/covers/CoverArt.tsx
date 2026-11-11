// Original SVG cover-art family for course/event/journal/recording cards.
// Ten distinct hand-built illustrations sharing one typographic/geometric
// grammar (ink/paper + signal/system/warn accents) — not one gradient
// reskinned with different icons. Titles/metadata stay as HTML in the
// card, never baked into the SVG, so they remain accessible and indexable.

export type CoverVariant =
  | "context-window"
  | "branch"
  | "gate"
  | "verify"
  | "terminal"
  | "typographic"
  | "multi-agent"
  | "signal-path"
  | "broadcast"
  | "recording";

export type CoverTone = "ink" | "paper";

const BG: Record<CoverTone, string> = {
  ink: "#0a0f18",
  paper: "#f0f1ec",
};

function Frame({
  tone,
  children,
}: {
  tone: CoverTone;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 400 250"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      role="presentation"
      aria-hidden="true"
    >
      <rect width="400" height="250" fill={BG[tone]} />
      {children}
    </svg>
  );
}

function ContextWindow({ tone }: { tone: CoverTone }) {
  const ink = tone === "ink";
  return (
    <Frame tone={tone}>
      <rect x="40" y="36" width="320" height="178" rx="14" fill="none" stroke={ink ? "#2a3240" : "#d8dad2"} strokeWidth="2" />
      <rect x="64" y="60" width="272" height="130" rx="10" fill="none" stroke={ink ? "#3a4350" : "#c6c8bf"} strokeWidth="2" />
      <rect x="88" y="84" width="224" height="82" rx="8" fill={ink ? "#121a28" : "#ffffff"} stroke="var(--system)" strokeWidth="2" />
      <text x="106" y="112" fontFamily="var(--font-mono)" fontSize="11" fill="var(--system)">repo + task</text>
      <text x="106" y="130" fontFamily="var(--font-mono)" fontSize="11" fill={ink ? "#9aa3ad" : "#5b6672"}>+ constraints</text>
      <text x="106" y="148" fontFamily="var(--font-mono)" fontSize="11" fill="var(--signal)">= минимальный контекст</text>
      <circle cx="320" cy="48" r="4" fill="var(--signal)" />
    </Frame>
  );
}

function Branch({ tone }: { tone: CoverTone }) {
  const ink = tone === "ink";
  const muted = ink ? "#3a4350" : "#c6c8bf";
  return (
    <Frame tone={tone}>
      <path d="M50 200 L160 125" stroke={muted} strokeWidth="2.5" fill="none" />
      <path d="M160 125 L300 60" stroke="var(--signal)" strokeWidth="3" fill="none" />
      <path d="M160 125 L300 170" stroke={muted} strokeWidth="2.5" strokeDasharray="5 6" fill="none" />
      <circle cx="160" cy="125" r="7" fill={ink ? "#0a0f18" : "#f0f1ec"} stroke={ink ? "#9aa3ad" : "#5b6672"} strokeWidth="2" />
      <circle cx="300" cy="60" r="8" fill="var(--signal)" />
      <path d="M296 60 L299 64 L306 55" stroke="var(--signal-ink)" strokeWidth="2" fill="none" />
      <circle cx="300" cy="170" r="8" fill="none" stroke={muted} strokeWidth="2" />
      <path d="M296 166 L304 174 M304 166 L296 174" stroke={muted} strokeWidth="2" />
      <circle cx="50" cy="200" r="6" fill={ink ? "#9aa3ad" : "#5b6672"} />
    </Frame>
  );
}

function Gate({ tone }: { tone: CoverTone }) {
  const ink = tone === "ink";
  return (
    <Frame tone={tone}>
      <rect x="150" y="50" width="100" height="120" rx="16" fill="none" stroke="var(--system)" strokeWidth="3" />
      <circle cx="200" cy="100" r="16" fill="none" stroke={ink ? "#d8dad2" : "#131a25"} strokeWidth="3" />
      <rect x="196" y="112" width="8" height="26" rx="3" fill={ink ? "#d8dad2" : "#131a25"} />
      {[
        { x: 40, y: 56, w: "read" },
        { x: 40, y: 92, w: "write" },
        { x: 40, y: 128, w: "exec" },
      ].map((s) => (
        <g key={s.w}>
          <rect x={s.x} y={s.y} width="66" height="26" rx="13" fill="none" stroke={ink ? "#3a4350" : "#c6c8bf"} strokeWidth="1.5" />
          <text x={s.x + 33} y={s.y + 17} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill={ink ? "#9aa3ad" : "#5b6672"}>{s.w}</text>
        </g>
      ))}
      <rect x="294" y="80" width="66" height="26" rx="13" fill="var(--signal)" />
      <text x="327" y="97" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--signal-ink)">только нужное</text>
    </Frame>
  );
}

function Verify({ tone }: { tone: CoverTone }) {
  const ink = tone === "ink";
  const line = ink ? "#3a4350" : "#c6c8bf";
  return (
    <Frame tone={tone}>
      <path d="M30 150 L110 150 L130 90 L160 190 L185 60 L210 150 L370 150" stroke="var(--system)" strokeWidth="2.5" fill="none" />
      {[110, 185, 370].map((x, i) => (
        <circle key={x} cx={x} cy={150} r="6" fill={i === 1 ? "var(--signal)" : ink ? "#0a0f18" : "#f0f1ec"} stroke="var(--signal)" strokeWidth="2" />
      ))}
      <g transform="translate(40,185)">
        {["контекст", "подход", "проверка"].map((t, i) => (
          <g key={t} transform={`translate(0 ${i * 16})`}>
            <path d="M0 4 L4 9 L12 -3" stroke="var(--signal)" strokeWidth="2" fill="none" />
            <text x="20" y="8" fontFamily="var(--font-mono)" fontSize="10" fill={ink ? "#9aa3ad" : "#5b6672"}>{t}</text>
          </g>
        ))}
      </g>
      <rect x="0" y="0" width="400" height="250" fill="none" stroke={line} strokeWidth="0" />
    </Frame>
  );
}

function Terminal({ tone }: { tone: CoverTone }) {
  const ink = tone === "ink";
  const rowBg = ink ? "#1b2432" : "#e4e6df";
  return (
    <Frame tone={tone}>
      <rect x="36" y="40" width="328" height="170" rx="10" fill={ink ? "#10151f" : "#ffffff"} stroke={ink ? "#2a3240" : "#d8dad2"} strokeWidth="2" />
      <rect x="36" y="40" width="328" height="28" rx="10" fill={ink ? "#161e2a" : "#edeee8"} />
      {["var(--warn)", "#e0c84a", "var(--signal)"].map((c, i) => (
        <circle key={c} cx={58 + i * 16} cy={54} r="4" fill={c} />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x="56"
          y={88 + i * 24}
          width={i === 2 ? 170 : 90 + ((i * 47) % 140)}
          height="10"
          rx="3"
          fill={i === 2 ? "var(--signal)" : rowBg}
        />
      ))}
      <text x="56" y="202" fontFamily="var(--font-mono)" fontSize="10" fill="var(--system)">$ agent verify --task</text>
    </Frame>
  );
}

function Typographic({ tone, glyph = "AI" }: { tone: CoverTone; glyph?: string }) {
  const ink = tone === "ink";
  return (
    <Frame tone={tone}>
      <g opacity="0.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="250" stroke={ink ? "#1b2432" : "#e4e6df"} strokeWidth="1" />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="400" y2={i * 50} stroke={ink ? "#1b2432" : "#e4e6df"} strokeWidth="1" />
        ))}
      </g>
      <text x="36" y="185" fontFamily="var(--font-sans)" fontWeight="600" fontSize="150" fill="var(--system)" opacity="0.9">
        {glyph}
      </text>
      <rect x="36" y="200" width="90" height="4" fill="var(--signal)" />
    </Frame>
  );
}

function MultiAgent({ tone }: { tone: CoverTone }) {
  const ink = tone === "ink";
  const muted = ink ? "#3a4350" : "#c6c8bf";
  const nodes = [
    { x: 90, y: 70 },
    { x: 90, y: 180 },
    { x: 200, y: 125 },
    { x: 310, y: 70 },
    { x: 310, y: 180 },
  ];
  return (
    <Frame tone={tone}>
      <line x1={nodes[0].x} y1={nodes[0].y} x2={nodes[2].x} y2={nodes[2].y} stroke="var(--signal)" strokeWidth="2.5" />
      <line x1={nodes[1].x} y1={nodes[1].y} x2={nodes[2].x} y2={nodes[2].y} stroke="var(--signal)" strokeWidth="2.5" />
      <line x1={nodes[2].x} y1={nodes[2].y} x2={nodes[3].x} y2={nodes[3].y} stroke={muted} strokeWidth="2" strokeDasharray="4 5" />
      <line x1={nodes[2].x} y1={nodes[2].y} x2={nodes[4].x} y2={nodes[4].y} stroke={muted} strokeWidth="2" strokeDasharray="4 5" />
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={i === 2 ? 14 : 9}
          fill={i === 2 ? "var(--signal)" : "none"}
          stroke={i === 2 ? "var(--signal-ink)" : muted}
          strokeWidth="2"
        />
      ))}
    </Frame>
  );
}

function SignalPath({ tone }: { tone: CoverTone }) {
  const ink = tone === "ink";
  return (
    <Frame tone={tone}>
      <path
        d="M20 190 C 90 190, 90 70, 150 70 S 220 190, 280 190 S 340 90, 380 90"
        stroke="var(--system)"
        strokeWidth="2.5"
        fill="none"
      />
      {[
        { x: 20, y: 190 },
        { x: 150, y: 70 },
        { x: 280, y: 190 },
        { x: 380, y: 90 },
      ].map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={i === 1 ? 7 : 5} fill={i === 1 ? "var(--signal)" : ink ? "#0a0f18" : "#f0f1ec"} stroke="var(--system)" strokeWidth="2" />
      ))}
      <text x="150" y="50" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill={ink ? "#9aa3ad" : "#5b6672"}>decision</text>
    </Frame>
  );
}

function Broadcast({ tone }: { tone: CoverTone }) {
  const ink = tone === "ink";
  return (
    <Frame tone={tone}>
      {[30, 60, 90, 120].map((r) => (
        <circle key={r} cx="110" cy="125" r={r} fill="none" stroke="var(--system)" strokeWidth="1.5" opacity={1 - r / 150} />
      ))}
      <circle cx="110" cy="125" r="8" fill="var(--signal)" />
      <g transform="translate(230 70)">
        <rect width="134" height="28" rx="14" fill="none" stroke={ink ? "#3a4350" : "#c6c8bf"} strokeWidth="1.5" />
        <circle cx="18" cy="14" r="4" fill="var(--signal)" />
        <text x="32" y="18" fontFamily="var(--font-mono)" fontSize="10" fill={ink ? "#d8dad2" : "#131a25"}>живой созвон</text>
      </g>
      <g transform="translate(230 112)">
        <rect width="150" height="80" rx="10" fill="none" stroke={ink ? "#2a3240" : "#d8dad2"} strokeWidth="1.5" />
        {[0, 1, 2].map((i) => (
          <rect key={i} x="14" y={16 + i * 22} width={100 - i * 18} height="8" rx="2" fill={ink ? "#1b2432" : "#e4e6df"} />
        ))}
      </g>
    </Frame>
  );
}

function Recording({ tone }: { tone: CoverTone }) {
  const ink = tone === "ink";
  return (
    <Frame tone={tone}>
      <rect x="30" y="30" width="340" height="190" rx="10" fill="none" stroke={ink ? "#2a3240" : "#d8dad2"} strokeWidth="2" />
      {Array.from({ length: 10 }).map((_, i) => (
        <line key={i} x1={30 + i * 34} y1="30" x2={10 + i * 34} y2="220" stroke={ink ? "#1b2432" : "#e4e6df"} strokeWidth="1" />
      ))}
      <circle cx="200" cy="125" r="34" fill="none" stroke={ink ? "#5b6672" : "#9aa3ad"} strokeWidth="2.5" />
      <path d="M190 108 L190 142 L218 125 Z" fill={ink ? "#5b6672" : "#9aa3ad"} />
      <line x1="178" y1="103" x2="222" y2="147" stroke="var(--warn)" strokeWidth="3" />
      <rect x="150" y="186" width="100" height="20" rx="10" fill={ink ? "#161e2a" : "#edeee8"} />
      <text x="200" y="200" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--warn)">нет записи</text>
    </Frame>
  );
}

const RENDERERS: Record<CoverVariant, (p: { tone: CoverTone; glyph?: string }) => React.ReactNode> = {
  "context-window": ContextWindow,
  branch: Branch,
  gate: Gate,
  verify: Verify,
  terminal: Terminal,
  typographic: Typographic,
  "multi-agent": MultiAgent,
  "signal-path": SignalPath,
  broadcast: Broadcast,
  recording: Recording,
};

export function CoverArt({
  variant,
  tone = "paper",
  glyph,
  className = "",
}: {
  variant: CoverVariant;
  tone?: CoverTone;
  glyph?: string;
  className?: string;
}) {
  const Renderer = RENDERERS[variant];
  return <div className={className}>{Renderer({ tone, glyph })}</div>;
}
