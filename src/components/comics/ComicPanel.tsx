import { CharacterAvatar } from "./CharacterAvatar";
import { getCharacter, type ComicPanelData } from "@/content/comics";

const ACCENT_TEXT: Record<string, string> = {
  dan: "text-signal-ink bg-signal/20 border-signal/40",
  rina: "text-graphite bg-system/15 border-system/40",
  viktor: "text-graphite bg-copper/15 border-copper/40",
  system: "text-graphite-muted bg-white/40 border-hairline",
};

export function ComicPanel({ panel, index }: { panel: ComicPanelData; index: number }) {
  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-hairline bg-white/60 p-5">
      <span className="font-mono text-[10px] uppercase tracking-wide text-graphite-muted">
        Панель {index + 1}
      </span>
      <p className="font-medium">{panel.caption}</p>
      <div className="flex flex-col gap-2">
        {panel.lines.map((line, i) => {
          if (line.character === "system") {
            return (
              <div key={i} className="flex items-start gap-2.5">
                <span
                  className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-hairline font-mono text-[10px] text-graphite-muted"
                  aria-hidden="true"
                >
                  ⚙
                </span>
                <div className={`rounded-xl border px-3 py-2 text-sm ${ACCENT_TEXT.system}`}>{line.text}</div>
              </div>
            );
          }
          return (
            <div key={i} className="flex items-start gap-2.5">
              <CharacterAvatar id={line.character} className="mt-0.5 h-8 w-8 flex-shrink-0" />
              <div className={`rounded-xl border px-3 py-2 text-sm ${ACCENT_TEXT[line.character]}`}>
                <span className="mr-1.5 font-medium">{getCharacter(line.character).name}:</span>
                {line.text}
              </div>
            </div>
          );
        })}
      </div>
    </li>
  );
}
