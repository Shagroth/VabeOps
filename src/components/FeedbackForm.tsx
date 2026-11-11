"use client";

import { useState, useTransition } from "react";
import { submitFeedback } from "@/app/modules/[id]/actions";

export function FeedbackForm({
  formId,
  questions,
  initialAnswers,
}: {
  formId: string;
  questions: string[];
  initialAnswers: Record<string, string>;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          await submitFeedback(formId, answers);
          setSaved(true);
        });
      }}
      className="flex flex-col gap-4"
    >
      {questions.map((question, i) => (
        <label key={i} className="flex flex-col gap-1 text-sm">
          <span>{question}</span>
          <textarea
            value={answers[question] ?? ""}
            onChange={(e) => {
              setAnswers((prev) => ({ ...prev, [question]: e.target.value }));
              setSaved(false);
            }}
            rows={3}
            className="rounded-lg border border-black/10 p-2"
          />
        </label>
      ))}
      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-lg border border-black/15 px-4 py-2 text-sm font-medium disabled:opacity-50"
      >
        {isPending ? "Сохраняю..." : saved ? "Отправлено ✓" : "Отправить фидбек"}
      </button>
    </form>
  );
}
