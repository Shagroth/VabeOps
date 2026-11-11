"use client";

import { useState, useTransition } from "react";
import { submitApplication } from "@/app/apply/actions";

const FIELD_STYLES = {
  light: {
    label: "text-graphite",
    input: "border-hairline bg-white/60 text-graphite placeholder:text-graphite-muted/60",
    hint: "text-graphite-muted",
    button: "bg-ink text-ink-foreground",
    confirm: "border-hairline text-graphite",
    confirmMuted: "text-graphite-muted",
  },
  dark: {
    label: "text-ink-foreground",
    input: "border-hairline-ink bg-white/5 text-ink-foreground placeholder:text-ink-muted",
    hint: "text-ink-muted",
    button: "bg-signal text-signal-ink",
    confirm: "border-hairline-ink text-ink-foreground",
    confirmMuted: "text-ink-muted",
  },
} as const;

export function ApplyForm({ variant = "light" }: { variant?: "light" | "dark" }) {
  const s = FIELD_STYLES[variant];
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (submitted) {
    return (
      <div className={`rounded-xl border p-6 text-sm ${s.confirm}`}>
        <p className="mb-2 font-medium">Заявка отправлена.</p>
        <p className={s.confirmMuted}>
          Это пилотный бесплатный поток на 5–10 человек — автор рассматривает заявки вручную,
          без автоматического зачисления и без обещанного срока ответа. Если тебя выберут,
          доступ придёт на указанный email.
        </p>
      </div>
    );
  }

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          await submitApplication(formData);
          setSubmitted(true);
        });
      }}
      className="flex flex-col gap-4"
    >
      <label className={`flex flex-col gap-1 text-sm ${s.label}`}>
        Имя
        <input name="name" required className={`rounded-lg border p-2.5 ${s.input}`} />
      </label>
      <label className={`flex flex-col gap-1 text-sm ${s.label}`}>
        Email
        <input
          type="email"
          name="email"
          required
          className={`rounded-lg border p-2.5 ${s.input}`}
        />
      </label>
      <label className={`flex flex-col gap-1 text-sm ${s.label}`}>
        Опыт работы с AI-агентами
        <textarea
          name="experience"
          required
          rows={3}
          placeholder="Что уже пробовал(а): Claude Code, Cursor, свои агенты..."
          className={`rounded-lg border p-2.5 ${s.input}`}
        />
      </label>
      <label className={`flex flex-col gap-1 text-sm ${s.label}`}>
        Какую рабочую задачу хочешь решить с помощью курса
        <textarea name="workGoal" required rows={3} className={`rounded-lg border p-2.5 ${s.input}`} />
      </label>

      <p className={`text-xs ${s.hint}`}>
        Пилот бесплатный. Доступ к AI-инструментам (Claude, Cursor и т.п.) — свой, за твой счёт.
      </p>

      <button
        type="submit"
        disabled={isPending}
        className={`self-start rounded-lg px-5 py-2.5 text-sm font-medium disabled:opacity-50 ${s.button}`}
      >
        {isPending ? "Отправляю..." : "Подать заявку на пилот"}
      </button>
    </form>
  );
}
