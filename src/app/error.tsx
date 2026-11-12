"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ErrorState";

// Next.js 16 error boundary: the second argument is `retry`, not the
// `reset` of earlier Next versions (see AGENTS.md / Next docs app/
// getting-started/error-handling.md).
export default function ErrorBoundary({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      title="Что-то пошло не так"
      description="Страница не загрузилась. Попробуй ещё раз — если не поможет, вернись на главную."
      digest={error.digest}
      onRetry={retry}
    />
  );
}
