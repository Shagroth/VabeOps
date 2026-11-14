const LABEL: Record<string, string> = {
  SUBMITTED: "Отправлено",
  NEEDS_REVISION: "Нужна доработка",
  ACCEPTED: "Принято",
};

const STYLE: Record<string, string> = {
  SUBMITTED: "bg-paper-deep text-graphite",
  NEEDS_REVISION: "bg-[#fbe4dc] text-danger",
  ACCEPTED: "bg-sky-tint text-sky-deep",
};

export function SubmissionStatusBadge({ status }: { status: string }) {
  return (
    <span className={`whitespace-nowrap rounded-full px-3 py-1 font-mono text-xs ${STYLE[status] ?? STYLE.SUBMITTED}`}>
      {LABEL[status] ?? status}
    </span>
  );
}
