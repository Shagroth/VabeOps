"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { submitApplication, type ApplyFieldErrors } from "@/app/apply/actions";

const FIELD_STYLES = {
  light: {
    label: "text-graphite",
    input: "border-hairline bg-white/60 text-graphite placeholder:text-graphite-muted/60",
    hint: "text-graphite-muted",
    button: "bg-ink text-ink-foreground",
    confirm: "border-hairline text-graphite",
    confirmMuted: "text-graphite-muted",
    error: "text-warn",
  },
  dark: {
    label: "text-ink-foreground",
    input: "border-hairline-ink bg-white/5 text-ink-foreground placeholder:text-ink-muted",
    hint: "text-ink-muted",
    button: "bg-signal text-signal-ink",
    confirm: "border-hairline-ink text-ink-foreground",
    confirmMuted: "text-ink-muted",
    error: "text-warn",
  },
} as const;

export function ApplyForm({ variant = "light" }: { variant?: "light" | "dark" }) {
  const s = FIELD_STYLES[variant];
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<ApplyFieldErrors>({});
  const [isPending, startTransition] = useTransition();

  if (submitted) {
    return (
      <div className={`rounded-xl border p-6 text-sm ${s.confirm}`}>
        <p className="mb-2 font-medium">Заявка отправлена.</p>
        <p className={s.confirmMuted}>
          Это пилотный бесплатный поток на 5 человек — автор рассматривает заявки вручную,
          без автоматического зачисления и без обещанного срока ответа. Если тебя выберут,
          доступ придёт на указанный email.
        </p>
      </div>
    );
  }

  return (
    <form
      noValidate
      action={(formData) => {
        startTransition(async () => {
          const result = await submitApplication(formData);
          if (result.ok) {
            setErrors({});
            setSubmitted(true);
          } else {
            setErrors(result.errors);
          }
        });
      }}
      className="flex flex-col gap-4"
    >
      {/* Honeypot — hidden from sighted and screen-reader users; a filled
          value means a bot, not a person, submitted the form. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className={`flex flex-col gap-1 text-sm ${s.label}`}>
        Имя
        <input name="name" required maxLength={120} className={`rounded-lg border p-2.5 ${s.input}`} />
        {errors.name && <span className={`text-xs ${s.error}`}>{errors.name}</span>}
      </label>
      <label className={`flex flex-col gap-1 text-sm ${s.label}`}>
        Email
        <input
          type="email"
          name="email"
          required
          maxLength={200}
          className={`rounded-lg border p-2.5 ${s.input}`}
        />
        {errors.email && <span className={`text-xs ${s.error}`}>{errors.email}</span>}
      </label>
      <label className={`flex flex-col gap-1 text-sm ${s.label}`}>
        Опыт работы с AI-агентами
        <textarea
          name="experience"
          required
          rows={3}
          maxLength={2000}
          placeholder="Что уже пробовал(а): Claude Code, Cursor, свои агенты..."
          className={`rounded-lg border p-2.5 ${s.input}`}
        />
        {errors.experience && <span className={`text-xs ${s.error}`}>{errors.experience}</span>}
      </label>
      <label className={`flex flex-col gap-1 text-sm ${s.label}`}>
        Какую рабочую задачу хочешь решить с помощью курса
        <textarea
          name="workGoal"
          required
          rows={3}
          maxLength={2000}
          className={`rounded-lg border p-2.5 ${s.input}`}
        />
        {errors.workGoal && <span className={`text-xs ${s.error}`}>{errors.workGoal}</span>}
      </label>

      <p className={`text-xs ${s.hint}`}>
        Пилот бесплатный. Доступ к AI-инструментам (Claude, Cursor и т.п.) — свой, за твой счёт.
      </p>

      <label className={`flex items-start gap-2 text-xs ${s.hint}`}>
        <input type="checkbox" name="consent" required className="mt-0.5" />
        <span>
          Согласен(на), что имя, email и ответы из этой формы автор пилота использует только
          для рассмотрения заявки и свяжется со мной по указанному email. Подробнее —{" "}
          <Link href="/privacy" className="underline">
            как обрабатываются данные
          </Link>
          .
        </span>
      </label>
      {errors.consent && <span className={`text-xs ${s.error}`}>{errors.consent}</span>}

      <button
        type="submit"
        disabled={isPending}
        className={`self-start rounded-lg px-5 py-2.5 text-sm font-medium transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 ${s.button}`}
      >
        {isPending ? "Отправляю..." : "Подать заявку на пилот"}
      </button>
    </form>
  );
}
