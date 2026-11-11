"use client";

import { useState, useTransition } from "react";
import { submitAssignment, type DecisionBreakdown } from "@/app/modules/[id]/actions";

const STEPS: {
  key: keyof Omit<DecisionBreakdown, "content" | "conditionsResponse">;
  label: string;
  placeholder: string;
}[] = [
  { key: "task", label: "Задача", placeholder: "Какую задачу решал(а), своими словами" },
  { key: "approach", label: "Подход", placeholder: "Какой подход выбрал(а) и почему" },
  {
    key: "rejectedAlternative",
    label: "Отвергнутая альтернатива",
    placeholder: "Что рассматривал(а), но отклонил(а), и почему",
  },
  {
    key: "verification",
    label: "Проверка",
    placeholder: "Как убедился(ась), что решение работает",
  },
  { key: "riskOrLimit", label: "Риск / ограничение", placeholder: "Что может пойти не так" },
  {
    key: "revisitCondition",
    label: "Условие пересмотра",
    placeholder: "При каком изменении вернулся(ась) бы к этому решению",
  },
];

export function SubmissionForm({
  moduleId,
  initial,
  conditionsChangedMd,
  initialPublished = false,
}: {
  moduleId: string;
  initial: Partial<DecisionBreakdown>;
  conditionsChangedMd?: string | null;
  initialPublished?: boolean;
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
  const [publish, setPublish] = useState(initialPublished);
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
          await submitAssignment(moduleId, values, publish);
          setSaved(true);
        });
      }}
      className="flex flex-col gap-5"
    >
      <label className="flex flex-col gap-1 text-sm">
        Результат
        <textarea
          value={values.content}
          onChange={(e) => set("content", e.target.value)}
          placeholder="Ссылка на репозиторий, описание решения..."
          rows={4}
          className="w-full rounded-lg border border-hairline p-3"
        />
      </label>

      <fieldset className="rounded-xl border border-hairline p-5">
        <legend className="px-1 text-sm font-medium">Разбор решения</legend>
        <div className="flex flex-col">
          {STEPS.map((step, i) => {
            const filled = values[step.key].trim().length > 0;
            return (
              <div key={step.key} className="relative flex gap-4">
                <div className="relative flex w-[15px] flex-shrink-0 flex-col items-center">
                  <span
                    className={`z-10 mt-1.5 h-[13px] w-[13px] rounded-full border-2 transition-colors duration-200 ${
                      filled ? "border-ink bg-ink" : "border-hairline bg-paper"
                    }`}
                  />
                  {i < STEPS.length - 1 && (
                    <span className="w-px flex-1 bg-hairline" aria-hidden="true" />
                  )}
                </div>
                <label className="flex flex-1 flex-col gap-1 pb-5 text-sm">
                  <span className="font-medium">{step.label}</span>
                  <textarea
                    value={values[step.key]}
                    onChange={(e) => set(step.key, e.target.value)}
                    placeholder={step.placeholder}
                    rows={2}
                    className="rounded-lg border border-hairline p-2 text-sm"
                  />
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>

      {conditionsChangedMd && (
        <label className="flex flex-col gap-1 rounded-lg border border-accent-change/40 p-4 text-sm">
          <span className="font-medium">Изменились условия</span>
          <span className="mb-1 text-graphite-muted">{conditionsChangedMd}</span>
          <textarea
            value={values.conditionsResponse}
            onChange={(e) => set("conditionsResponse", e.target.value)}
            rows={3}
            className="rounded-lg border border-hairline p-2"
          />
        </label>
      )}

      <label className="flex items-start gap-2 text-sm text-graphite-muted">
        <input
          type="checkbox"
          checked={publish}
          onChange={(e) => {
            setPublish(e.target.checked);
            setSaved(false);
          }}
          className="mt-0.5"
        />
        <span>
          Поделиться этим решением в «Потоке» когорты. По умолчанию сдача видна только тебе и
          автору — не публикуй здесь секреты или закрытый рабочий код.
        </span>
      </label>

      <button
        type="submit"
        disabled={isPending || !values.content.trim()}
        className="self-start rounded-lg bg-ink px-4 py-2 text-sm font-medium text-ink-foreground transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
      >
        {isPending ? "Сохраняю..." : saved ? "Сохранено ✓" : "Отправить"}
      </button>
    </form>
  );
}
