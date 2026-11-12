"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ErrorState";

export default function StudioError({
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
      title="Студия недоступна"
      description="Не получилось загрузить данные. Черновики не теряются — попробуй обновить через минуту."
      digest={error.digest}
      onRetry={retry}
    />
  );
}
