export type ChipTone = "preview" | "in_preparation" | "planned" | "unavailable" | "accepted";

const TONES: Record<ChipTone, string> = {
  preview: "border-system/40 bg-system/10 text-system",
  in_preparation: "border-hairline text-graphite-muted",
  planned: "border-system/40 bg-system/10 text-system",
  unavailable: "border-warn/40 bg-warn/10 text-warn",
  accepted: "border-signal/40 bg-signal/20 text-graphite",
};

const DEFAULT_LABEL: Record<ChipTone, string> = {
  preview: "Превью",
  in_preparation: "В подготовке",
  planned: "Дата уточняется",
  unavailable: "Нет записи",
  accepted: "Принято",
};

export function StatusChip({ tone, label }: { tone: ChipTone; label?: string }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide ${TONES[tone]}`}
    >
      {label ?? DEFAULT_LABEL[tone]}
    </span>
  );
}
