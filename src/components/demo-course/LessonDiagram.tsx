import type { DiagramTone, LessonDiagram } from "@/content/demo-course-program";

/**
 * Schemes for lesson steps, drawn from data. Built from HTML boxes rather
 * than SVG text so Russian labels wrap and stay readable on a phone. The
 * connectors are the brand's red line; boxes carry no colour meaning that
 * is not also in their text.
 */

const TONE: Record<DiagramTone, string> = {
  plain: "border border-hairline-strong bg-white text-graphite",
  sky: "bg-signal text-white",
  ink: "bg-ink text-ink-foreground",
};

const NOTE: Record<DiagramTone, string> = {
  plain: "text-graphite-soft",
  sky: "text-[#e8eeff]",
  ink: "text-ink-muted",
};

function Box({ label, note, tone = "plain", className = "" }: { label: string; note?: string; tone?: DiagramTone; className?: string }) {
  return (
    <div className={`rounded-[18px] p-4 ${TONE[tone]} ${className}`}>
      <p className="font-bold leading-snug tracking-[-0.01em]">{label}</p>
      {note && <p className={`mt-1 text-[15px] leading-snug ${NOTE[tone]}`}>{note}</p>}
    </div>
  );
}

/** Line with an arrowhead: vertical on phones, horizontal from `md`. */
function Connector() {
  return (
    <div aria-hidden="true" className="flex flex-none items-center justify-center md:w-9">
      <svg viewBox="0 0 12 28" className="h-7 w-3 md:hidden">
        <path d="M6 0 V22" stroke="var(--string)" strokeWidth="2" fill="none" />
        <path d="M1 20 L6 27 L11 20 Z" fill="var(--string)" />
      </svg>
      <svg viewBox="0 0 36 12" className="hidden h-3 w-9 md:block">
        <path d="M0 6 H30" stroke="var(--string)" strokeWidth="2" fill="none" />
        <path d="M28 1 L35 6 L28 11 Z" fill="var(--string)" />
      </svg>
    </div>
  );
}

export function LessonDiagramFigure({ diagram }: { diagram: LessonDiagram }) {
  return (
    <figure className="mb-8 rounded-[24px] bg-sky-tint p-5 sm:p-7">
      <figcaption className="mb-5 font-mono text-[13px] uppercase tracking-[0.08em] text-sky-deep">
        Схема · {diagram.title}
      </figcaption>

      {diagram.kind === "flow" && (
        <>
          <ol className="flex flex-col md:flex-row md:items-stretch">
            {diagram.nodes.map((node, i) => (
              <li key={node.label} className="flex flex-col md:flex-1 md:flex-row md:items-stretch">
                {i > 0 && <Connector />}
                <Box {...node} className="flex-1" />
              </li>
            ))}
          </ol>
          {diagram.loop && (
            <p className="mt-4 flex items-center gap-2.5 text-[15px] font-semibold">
              <svg viewBox="0 0 28 20" aria-hidden="true" className="h-5 w-7 flex-none">
                <path d="M24 16 C 24 4, 6 4, 6 12" stroke="var(--string)" strokeWidth="2" fill="none" />
                <path d="M1 10 L6 17 L11 10 Z" fill="var(--string)" />
              </svg>
              {diagram.loop}
            </p>
          )}
        </>
      )}

      {diagram.kind === "compare" && (
        <div className={`grid gap-4 ${diagram.columns.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          {diagram.columns.map((column) => {
            const tone = column.tone ?? "plain";
            return (
              <div key={column.label} className={`rounded-[18px] p-5 ${TONE[tone]}`}>
                <p className="text-[20px] font-extrabold leading-tight tracking-[-0.02em]">{column.label}</p>
                <ul className={`mt-3 space-y-2 text-[15px] leading-snug ${NOTE[tone]}`}>
                  {column.points.map((point) => (
                    <li key={point} className="flex gap-2.5">
                      <span aria-hidden="true">—</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {diagram.kind === "stack" && (
        <ol className="flex flex-col gap-2">
          {diagram.layers.map((layer, i) => (
            <li key={layer.label} className="grid grid-cols-[36px_1fr] items-center gap-x-2">
              <span className="font-mono text-[15px] text-string">0{i + 1}</span>
              <Box {...layer} />
            </li>
          ))}
        </ol>
      )}

      {diagram.kind === "scale" && (
        <div>
          <div className="mb-3 flex items-center justify-between gap-4 font-mono text-[13px] text-graphite-muted">
            <span>
              <span aria-hidden="true" className="mr-1.5 text-string md:hidden">↓</span>
              {diagram.from}
            </span>
            <span aria-hidden="true" className="hidden h-[2px] flex-1 bg-string md:block" />
            <span className="hidden md:inline">{diagram.to}</span>
          </div>
          <ol className={`grid gap-3 ${diagram.stops.length >= 4 ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
            {diagram.stops.map((stop) => (
              <li key={stop.label}>
                <Box {...stop} className="h-full" />
              </li>
            ))}
          </ol>
          <p className="mt-3 font-mono text-[13px] text-graphite-muted md:hidden">
            <span aria-hidden="true" className="mr-1.5 text-string">↓</span>
            {diagram.to}
          </p>
        </div>
      )}

      {diagram.caption && <p className="mt-5 max-w-[60ch] text-[15px] leading-relaxed text-graphite-soft">{diagram.caption}</p>}
    </figure>
  );
}
