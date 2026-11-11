import Link from "next/link";
import { CoverArt } from "@/components/covers/CoverArt";
import type { JournalEntry } from "@/content/journal";

export function JournalCard({ entry, large = false }: { entry: JournalEntry; large?: boolean }) {
  return (
    <Link
      href={`/journal/${entry.slug}`}
      className={`cover-group card-hover flex overflow-hidden rounded-2xl border border-hairline bg-white/60 ${
        large ? "flex-col lg:flex-row" : "flex-col"
      }`}
    >
      <div className={`overflow-hidden ${large ? "aspect-[16/9] lg:aspect-auto lg:w-[52%]" : "aspect-[16/10]"}`}>
        <CoverArt variant={entry.cover} tone="paper" className="cover-scale block h-full w-full" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wide">
          <span className="text-copper">{entry.category}</span>
          <span className="text-graphite-muted">· {entry.format}</span>
        </div>
        <h3 className={`font-medium leading-snug ${large ? "text-2xl" : "text-lg"}`}>{entry.title}</h3>
        <p className="text-sm text-graphite-muted">{entry.dek}</p>
      </div>
    </Link>
  );
}
