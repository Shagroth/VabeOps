export function PreviewBanner({ label }: { label: string }) {
  return (
    <div className="mb-6 flex items-center gap-2 rounded-lg border border-system/40 bg-system/10 px-4 py-2.5 text-sm text-graphite">
      <span className="rounded bg-system px-1.5 py-0.5 font-mono text-xs text-ink-foreground">
        PREVIEW
      </span>
      <span>
        {label} — демо-данные, не реальный аккаунт. Ничего здесь не сохраняется и не отправляется.
      </span>
    </div>
  );
}
