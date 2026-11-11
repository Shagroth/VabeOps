"use client";

import { useState, useTransition } from "react";
import { submitAssignment } from "@/app/modules/[id]/actions";

export function SubmissionForm({
  moduleId,
  initialContent,
}: {
  moduleId: string;
  initialContent: string;
}) {
  const [content, setContent] = useState(initialContent);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          await submitAssignment(moduleId, content);
          setSaved(true);
        });
      }}
      className="flex flex-col gap-3"
    >
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setSaved(false);
        }}
        placeholder="Ссылка на репозиторий, описание решения или что получилось..."
        rows={6}
        className="w-full rounded-lg border border-black/10 p-3 dark:border-white/15 dark:bg-transparent"
      />
      <button
        type="submit"
        disabled={isPending || !content.trim()}
        className="self-start rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
      >
        {isPending ? "Сохраняю..." : saved ? "Сохранено ✓" : "Отправить"}
      </button>
    </form>
  );
}
