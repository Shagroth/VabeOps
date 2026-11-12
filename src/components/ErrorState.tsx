"use client";

type ErrorStateProps = {
  title: string;
  description: string;
  digest?: string;
  onRetry?: () => void;
  retryLabel?: string;
  homeHref?: string;
  homeLabel?: string;
};

// Shared visual shell for error.tsx / not-found.tsx / per-section error
// boundaries. `digest` is Next's built-in opaque error-correlation hash
// (Error.prototype.digest on errors thrown during server rendering) —
// not something we mint ourselves; see docs/production-runbook.md for
// how to trace one in the Railway logs.
export function ErrorState({
  title,
  description,
  digest,
  onRetry,
  retryLabel = "Попробовать снова",
  homeHref = "/",
  homeLabel = "На главную",
}: ErrorStateProps) {
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-semibold text-graphite">{title}</h1>
      <p className="text-graphite-muted">{description}</p>
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg bg-ink px-5 py-2.5 text-sm font-medium text-ink-foreground transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
          >
            {retryLabel}
          </button>
        )}
        <a href={homeHref} className="text-sm text-graphite underline underline-offset-2">
          {homeLabel}
        </a>
      </div>
      {digest && (
        <p className="pt-2 text-xs text-graphite-muted">
          Код ошибки для обращения в поддержку: <span className="font-mono">{digest}</span>
        </p>
      )}
    </main>
  );
}
