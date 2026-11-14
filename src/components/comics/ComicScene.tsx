import type { CharacterId, SceneId } from "@/content/comics";

/**
 * Drawn scenes for the comic. Flat shapes with ink outlines in the brand
 * palette; the agent is the kite on its red line. Each scene is one SVG in
 * an 800×460 box. Text inside the drawings is decoration only: everything
 * a reader needs is in the speech bubbles and the scene description.
 */

const INK = "var(--ink)";
const PAPER = "var(--paper)";
const SKY = "var(--signal)";
const STRING = "var(--string)";

const BODY: Record<CharacterId, string> = {
  dan: SKY,
  rina: INK,
  viktor: "var(--copper)",
};

type Mood = "calm" | "happy" | "worried";

/** A character standing with feet at (x, y). */
function Figure({ who, x, y = 420, mood = "calm", point }: { who: CharacterId; x: number; y?: number; mood?: Mood; point?: "left" | "right" | "up" }) {
  const arm = point === "left" ? "M-34 -118 L-104 -150" : point === "right" ? "M34 -118 L104 -150" : point === "up" ? "M34 -122 L78 -214" : null;
  return (
    <g transform={`translate(${x} ${y})`}>
      {arm && <path d={arm} stroke={INK} strokeWidth="13" strokeLinecap="round" fill="none" />}
      <path d="M-58 0 C-58 -96 -44 -150 0 -150 C44 -150 58 -96 58 0 Z" fill={BODY[who]} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <circle cx="0" cy="-196" r="44" fill={PAPER} stroke={INK} strokeWidth="3.5" />
      {who === "dan" && <path d="M-40 -214 L-28 -252 L-10 -230 L6 -258 L20 -232 L40 -246 L40 -212 C20 -232 -20 -232 -40 -214 Z" fill={INK} />}
      {who === "rina" && <path d="M-46 -176 C-56 -250 56 -250 46 -176 L34 -176 C38 -214 -38 -214 -34 -176 Z" fill={INK} />}
      {who === "viktor" && (
        <>
          <path d="M-30 -172 C-22 -146 22 -146 30 -172 C14 -160 -14 -160 -30 -172 Z" fill={INK} />
          <g fill="none" stroke={INK} strokeWidth="3">
            <circle cx="-16" cy="-200" r="11" />
            <circle cx="16" cy="-200" r="11" />
            <path d="M-5 -200 H5" />
          </g>
        </>
      )}
      <circle cx="-16" cy="-200" r="4" fill={INK} />
      <circle cx="16" cy="-200" r="4" fill={INK} />
      {mood === "happy" && <path d="M-14 -180 Q0 -166 14 -180" stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none" />}
      {mood === "calm" && who !== "viktor" && <path d="M-11 -178 H11" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />}
      {mood === "worried" && <ellipse cx="0" cy="-177" rx="7" ry="9" fill={INK} />}
    </g>
  );
}

/** The agent: the kite with eyes. Its bottom point is at (x, y). */
function Kite({ x, y, scale = 1, tilt = 0 }: { x: number; y: number; scale?: number; tilt?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${scale})`}>
      <path d="M0 -170 Q6 -106 50 -100 Q6 -94 0 0 Q-6 -94 -50 -100 Q-6 -106 0 -170 Z" fill={SKY} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="-9" cy="-102" r="4.5" fill="#ffffff" />
      <circle cx="9" cy="-102" r="4.5" fill="#ffffff" />
    </g>
  );
}

function Line({ d }: { d: string }) {
  return <path d={d} stroke={STRING} strokeWidth="4" strokeLinecap="round" fill="none" />;
}

function Floor() {
  return <path d="M0 420 H800" stroke={INK} strokeWidth="3.5" />;
}

function Monitor({ x, children }: { x: number; children: React.ReactNode }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <rect x="0" y="150" width="250" height="170" rx="14" fill={INK} />
      <rect x="12" y="162" width="226" height="146" rx="6" fill={PAPER} />
      <path d="M125 320 V372 M70 372 H180" stroke={INK} strokeWidth="10" strokeLinecap="round" />
      <path d="M-40 372 H300" stroke={INK} strokeWidth="3.5" />
      <path d="M-20 372 V420 M280 372 V420" stroke={INK} strokeWidth="3.5" />
      {children}
    </g>
  );
}

function Phone({ x, y, broken, children }: { x: number; y: number; broken?: boolean; children?: React.ReactNode }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="0" width="120" height="210" rx="18" fill={INK} />
      <rect x="9" y="16" width="102" height="178" rx="8" fill={PAPER} />
      {broken && <path d="M30 60 L90 150 M90 60 L30 150" stroke={STRING} strokeWidth="9" strokeLinecap="round" />}
      {children}
    </g>
  );
}

function Clock({ x, y, time }: { x: number; y: number; time: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="0" width="118" height="52" rx="10" fill={PAPER} stroke={INK} strokeWidth="3.5" />
      <text x="59" y="36" textAnchor="middle" fontFamily="var(--font-mono), monospace" fontSize="26" fontWeight="500" fill={INK}>
        {time}
      </text>
    </g>
  );
}

const MONO = { fontFamily: "var(--font-mono), monospace" } as const;

const SCENES: Record<SceneId, () => React.ReactNode> = {
  cover: () => (
    <>
      <rect width="800" height="460" fill="var(--sky-tint)" />
      <Kite x={560} y={190} scale={1.05} tilt={10} />
      <Line d="M560 190 C 520 260, 640 290, 600 350 C 580 380, 620 396, 610 414" />
      <rect x="578" y="408" width="64" height="16" rx="8" fill={INK} />
      <Floor />
      <Figure who="dan" x={150} mood="happy" />
      <Figure who="rina" x={300} />
      <Figure who="viktor" x={450} />
    </>
  ),
  alert: () => (
    <>
      <rect width="800" height="460" fill="#ffffff" />
      <Clock x={640} y={50} time="21:40" />
      <Monitor x={400}>
        <rect x="30" y="182" width="190" height="44" rx="8" fill={STRING} />
        <text x="125" y="214" textAnchor="middle" {...MONO} fontSize="28" fontWeight="500" fill="#ffffff">
          500
        </text>
        <path d="M30 246 H180 M30 268 H140 M30 290 H200" stroke={INK} strokeWidth="6" strokeLinecap="round" opacity="0.25" />
      </Monitor>
      <Floor />
      <Figure who="dan" x={210} mood="worried" point="right" />
    </>
  ),
  prompt: () => (
    <>
      <rect width="800" height="460" fill="#ffffff" />
      <Monitor x={300}>
        <path d="M30 190 H200 M30 214 H170" stroke={INK} strokeWidth="7" strokeLinecap="round" />
        <rect x="30" y="238" width="16" height="26" fill={SKY} />
        <path d="M30 284 H150" stroke={INK} strokeWidth="6" strokeLinecap="round" opacity="0.25" />
      </Monitor>
      <Kite x={680} y={220} tilt={-6} />
      <Line d="M680 220 C 650 280, 730 310, 690 370" />
      <Floor />
      <Figure who="dan" x={150} point="right" />
    </>
  ),
  green: () => (
    <>
      <rect width="800" height="460" fill="var(--sky-tint)" />
      <Monitor x={300}>
        {[0, 1, 2, 3].map((col) =>
          [0, 1, 2].map((row) => (
            <path
              key={`${col}-${row}`}
              d={`M${36 + col * 50} ${196 + row * 36} l10 10 l18 -20`}
              stroke={SKY}
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          )),
        )}
      </Monitor>
      <Kite x={690} y={150} scale={0.85} tilt={16} />
      <Line d="M690 150 C 660 210, 740 240, 700 300 C 680 330, 720 350, 706 380" />
      <Floor />
      <Figure who="dan" x={150} mood="happy" point="up" />
    </>
  ),
  partner: () => (
    <>
      <rect width="800" height="460" fill="#ffffff" />
      <Phone x={500} y={150}>
        <text x="60" y="96" textAnchor="middle" {...MONO} fontSize="11" fill={INK}>
          discountCents
        </text>
        <text x="60" y="150" textAnchor="middle" fontFamily="var(--font-sans), sans-serif" fontSize="54" fontWeight="800" fill={STRING}>
          ?
        </text>
      </Phone>
      <Floor />
      <Figure who="rina" x={330} point="right" />
      <Figure who="dan" x={150} mood="worried" />
    </>
  ),
  incident: () => (
    <>
      <rect width="800" height="460" fill="#ffffff" />
      <Clock x={40} y={50} time="22:14" />
      <Phone x={230} y={130} broken />
      <Phone x={370} y={170} broken />
      <Phone x={510} y={130} />
      <text x="570" y="250" textAnchor="middle" {...MONO} fontSize="22" fill={INK}>
        ok
      </text>
      <Floor />
      <Figure who="rina" x={700} mood="worried" point="left" />
    </>
  ),
  review: () => (
    <>
      <rect width="800" height="460" fill="#ffffff" />
      <rect x="230" y="60" width="400" height="230" rx="14" fill={INK} />
      <text x="430" y="140" textAnchor="middle" fontFamily="var(--font-sans), sans-serif" fontSize="30" fontWeight="800" fill={PAPER}>
        тесты зелёные
      </text>
      <text x="430" y="194" textAnchor="middle" fontFamily="var(--font-sans), sans-serif" fontSize="44" fontWeight="800" fill={STRING}>
        ≠
      </text>
      <text x="430" y="246" textAnchor="middle" fontFamily="var(--font-sans), sans-serif" fontSize="30" fontWeight="800" fill={PAPER}>
        баг исправлен
      </text>
      <Floor />
      <Figure who="viktor" x={120} point="right" />
      <Figure who="dan" x={710} mood="calm" />
    </>
  ),
  fix: () => (
    <>
      <rect width="800" height="460" fill="var(--sky-tint)" />
      <Kite x={560} y={170} tilt={8} />
      <Line d="M560 170 C 500 240, 420 220, 300 268" />
      <rect x="240" y="258" width="66" height="18" rx="9" fill={INK} transform="rotate(-18 273 267)" />
      <Floor />
      <Figure who="dan" x={190} mood="happy" point="right" />
      <Figure who="rina" x={690} />
      <g transform="translate(596 250)">
        <rect x="0" y="0" width="74" height="96" rx="8" fill={PAPER} stroke={INK} strokeWidth="3.5" />
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M12 ${24 + i * 24} l6 6 l10 -12 M36 ${26 + i * 24} H62`} stroke={i === 0 ? SKY : INK} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        ))}
      </g>
    </>
  ),
};

export function ComicScene({ scene, alt, className = "" }: { scene: SceneId; alt: string; className?: string }) {
  const Scene = SCENES[scene];
  return (
    <svg viewBox="0 0 800 460" role="img" aria-label={alt} className={className} preserveAspectRatio="xMidYMid slice">
      <Scene />
    </svg>
  );
}
