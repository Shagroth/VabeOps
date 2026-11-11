"use client";

import { useState, useTransition } from "react";
import { submitApplication } from "@/app/apply/actions";

export function ApplyForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (submitted) {
    return (
      <div className="rounded-xl border border-black/10 p-6 text-sm dark:border-white/15">
        <p className="mb-2 font-medium">Заявка отправлена.</p>
        <p className="text-black/60 dark:text-white/60">
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
      <label className="flex flex-col gap-1 text-sm">
        Имя
        <input
          name="name"
          required
          className="rounded-lg border border-black/15 p-2 dark:border-white/20 dark:bg-transparent"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Email
        <input
          type="email"
          name="email"
          required
          className="rounded-lg border border-black/15 p-2 dark:border-white/20 dark:bg-transparent"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Опыт работы с AI-агентами
        <textarea
          name="experience"
          required
          rows={3}
          placeholder="Что уже пробовал(а): Claude Code, Cursor, свои агенты..."
          className="rounded-lg border border-black/15 p-2 dark:border-white/20 dark:bg-transparent"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Какую рабочую задачу хочешь решить с помощью курса
        <textarea
          name="workGoal"
          required
          rows={3}
          className="rounded-lg border border-black/15 p-2 dark:border-white/20 dark:bg-transparent"
        />
      </label>

      <p className="text-xs text-black/50 dark:text-white/50">
        Пилот бесплатный. Доступ к AI-инструментам (Claude, Cursor и т.п.) — свой, за твой счёт.
      </p>

      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-lg bg-accent-action px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {isPending ? "Отправляю..." : "Подать заявку на пилот"}
      </button>
    </form>
  );
}
