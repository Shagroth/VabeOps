const LABEL: Record<string, string> = {
  SUBMITTED: "Отправлено",
  NEEDS_REVISION: "Нужна доработка",
  ACCEPTED: "Принято",
};

const STYLE: Record<string, string> = {
  SUBMITTED: "bg-black/10",
  NEEDS_REVISION: "bg-accent-change/15 text-accent-change",
  ACCEPTED: "bg-accent-action/15 text-accent-action",
};

export function SubmissionStatusBadge({ status }: { status: string }) {
  return (
    <span className={`rounded px-1.5 py-0.5 text-xs ${STYLE[status] ?? STYLE.SUBMITTED}`}>
      {LABEL[status] ?? status}
    </span>
  );
}
