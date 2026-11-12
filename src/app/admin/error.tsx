"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ErrorState";

export default function AdminError({
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
      title="Админка недоступна"
      description="Не получилось загрузить данные. Обычно помогает повтор — если нет, проверь позже."
      digest={error.digest}
      onRetry={retry}
    />
  );
}
