"use client";

import { useState, useTransition } from "react";
import { submitAssignment, type DecisionBreakdown } from "@/app/modules/[id]/actions";

const FIELD_LABELS: Record<keyof Omit<DecisionBreakdown, "content" | "conditionsResponse">, string> = {
  task: "Задача (своими словами)",
  approach: "Выбранный подход",
  rejectedAlternative: "Отвергнутая альтернатива и почему",
  verification: "Как проверил(а), что решение работает",
  riskOrLimit: "Ограничение или риск",
  revisitCondition: "При каком условии пересмотрел(а) бы решение",
};

export function SubmissionForm({
  moduleId,
  initial,
  conditionsChangedMd,
}: {
  moduleId: string;
  initial: Partial<DecisionBreakdown>;
  conditionsChangedMd?: string | null;
}) {
  const [values, setValues] = useState<DecisionBreakdown>({
    content: initial.content ?? "",
    task: initial.task ?? "",
    approach: initial.approach ?? "",
    rejectedAlternative: initial.rejectedAlternative ?? "",
    verification: initial.verification ?? "",
    riskOrLimit: initial.riskOrLimit ?? "",
    revisitCondition: initial.revisitCondition ?? "",
    conditionsResponse: initial.conditionsResponse ?? "",
  });
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function set<K extends keyof DecisionBreakdown>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          await submitAssignment(moduleId, values);
          setSaved(true);
        });
      }}
      className="flex flex-col gap-4"
    >
      <label className="flex flex-col gap-1 text-sm">
        Результат
        <textarea
          value={values.content}
          onChange={(e) => set("content", e.target.value)}
          placeholder="Ссылка на репозиторий, описание решения..."
          rows={4}
          className="w-full rounded-lg border border-black/10 p-3 dark:border-white/15 dark:bg-transparent"
        />
      </label>

      <fieldset className="flex flex-col gap-3 rounded-lg border border-black/10 p-4 dark:border-white/15">
        <legend className="px-1 text-sm font-medium">Разбор решения</legend>
        {(Object.keys(FIELD_LABELS) as Array<keyof typeof FIELD_LABELS>).map((key) => (
          <label key={key} className="flex flex-col gap-1 text-sm">
            {FIELD_LABELS[key]}
            <textarea
              value={values[key]}
              onChange={(e) => set(key, e.target.value)}
              rows={2}
              className="rounded-lg border border-black/10 p-2 text-sm dark:border-white/15 dark:bg-transparent"
            />
          </label>
        ))}
      </fieldset>

      {conditionsChangedMd && (
        <label className="flex flex-col gap-1 rounded-lg border border-accent-change/40 p-4 text-sm">
          <span className="font-medium">Изменились условия</span>
          <span className="mb-1 text-black/70 dark:text-white/70">{conditionsChangedMd}</span>
          <textarea
            value={values.conditionsResponse}
            onChange={(e) => set("conditionsResponse", e.target.value)}
            rows={3}
            className="rounded-lg border border-black/10 p-2 dark:border-white/15 dark:bg-transparent"
          />
        </label>
      )}

      <button
        type="submit"
        disabled={isPending || !values.content.trim()}
        className="self-start rounded-lg bg-accent-action px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {isPending ? "Сохраняю..." : saved ? "Сохранено ✓" : "Отправить"}
      </button>
    </form>
  );
}
