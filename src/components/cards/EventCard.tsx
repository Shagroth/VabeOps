import Link from "next/link";
import { CoverArt } from "@/components/covers/CoverArt";
import { StatusChip } from "@/components/StatusChip";
import type { EventConcept } from "@/content/events";

export function EventCard({ event }: { event: EventConcept }) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="cover-group card-hover flex flex-col overflow-hidden rounded-2xl border border-hairline bg-white/60"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <CoverArt variant={event.cover} tone="paper" className="cover-scale block h-full w-full" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wide text-graphite-muted">
            {event.kindLabel}
          </span>
          <StatusChip tone="planned" />
        </div>
        <h3 className="text-lg font-medium leading-snug">{event.title}</h3>
        <p className="text-sm text-graphite-muted">{event.outcome}</p>
      </div>
    </Link>
  );
}
