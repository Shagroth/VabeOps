"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { submitApplication, type ApplyFieldErrors } from "@/app/apply/actions";

const FIELD =
  "min-h-12 w-full rounded-[14px] border px-4 py-3 text-base font-normal outline-none transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal";

const FIELD_STYLES = {
  light: {
    label: "text-graphite",
    input: `${FIELD} border-hairline-strong bg-white text-graphite placeholder:text-graphite-muted hover:border-graphite-muted`,
    hint: "text-graphite-soft",
    button: "bg-ink text-ink-foreground hover:bg-signal",
    confirm: "border-hairline-strong bg-white text-graphite",
    confirmMuted: "text-graphite-soft",
    error: "text-danger",
  },
  dark: {
    label: "text-ink-foreground",
    input: `${FIELD} border-ink-line bg-ink-raised text-ink-foreground placeholder:text-ink-muted hover:border-ink-muted`,
    hint: "text-ink-muted",
    button: "bg-signal text-signal-ink hover:bg-paper hover:text-ink",
    confirm: "border-ink-line bg-ink-raised text-ink-foreground",
    confirmMuted: "text-ink-muted",
    error: "text-[#ffb4a2]",
  },
} as const;

export function ApplyForm({ variant = "light" }: { variant?: "light" | "dark" }) {
  const s = FIELD_STYLES[variant];
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<ApplyFieldErrors>({});
  const [isPending, startTransition] = useTransition();

  if (submitted) {
    return (
      <div role="status" className={`rounded-[20px] border p-7 text-[15px] leading-relaxed ${s.confirm}`}>
        <p className="mb-2 text-xl font-extrabold tracking-[-0.02em]">Заявка отправлена.</p>
        <p className={s.confirmMuted}>
          Пилот бесплатный, мест пять. Автор читает каждую заявку сам, поэтому точный срок
          ответа обещать не будем. Если тебя выберут, доступ придёт на указанный email.
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
      className="flex flex-col gap-[18px]"
    >
      {/* Honeypot — hidden from sighted and screen-reader users; a filled
          value means a bot, not a person, submitted the form. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className={`flex flex-col gap-2 text-[15px] font-semibold ${s.label}`}>
        Имя
        <input name="name" required maxLength={120} autoComplete="name" placeholder="Как к тебе обращаться" className={s.input} />
        {errors.name && <span className={`text-sm font-normal ${s.error}`}>{errors.name}</span>}
      </label>
      <label className={`flex flex-col gap-2 text-[15px] font-semibold ${s.label}`}>
        Email
        <input
          type="email"
          name="email"
          required
          maxLength={200}
          autoComplete="email"
          placeholder="you@example.com"
          className={s.input}
        />
        {errors.email && <span className={`text-sm font-normal ${s.error}`}>{errors.email}</span>}
      </label>
      <label className={`flex flex-col gap-2 text-[15px] font-semibold ${s.label}`}>
        Опыт работы с AI-агентами
        <textarea
          name="experience"
          required
          rows={3}
          maxLength={2000}
          placeholder="Что уже пробовал(а): Claude Code, Cursor, свои агенты…"
          className={s.input}
        />
        {errors.experience && <span className={`text-sm font-normal ${s.error}`}>{errors.experience}</span>}
      </label>
      <label className={`flex flex-col gap-2 text-[15px] font-semibold ${s.label}`}>
        Какую рабочую задачу хочешь решить
        <textarea
          name="workGoal"
          required
          rows={3}
          maxLength={2000}
          placeholder="Одна задача из твоей работы, на которой хочешь потренироваться"
          className={s.input}
        />
        {errors.workGoal && <span className={`text-sm font-normal ${s.error}`}>{errors.workGoal}</span>}
      </label>

      <p className={`text-sm ${s.hint}`}>
        Пилот бесплатный. Подписки на AI-инструменты (Claude, Cursor и т. п.) оплачиваешь сам.
      </p>

      <label className={`flex items-start gap-3 text-sm leading-normal ${s.hint}`}>
        <input type="checkbox" name="consent" required className="mt-px h-5 w-5 flex-none accent-signal" />
        <span>
          Согласен(на), что имя, email и ответы из этой формы автор пилота использует только
          для рассмотрения заявки и свяжется со мной по указанному email. Подробнее —{" "}
          <Link href="/privacy" className="underline underline-offset-2">
            как обрабатываются данные
          </Link>
          .
        </span>
      </label>
      {errors.consent && <span className={`text-sm font-normal ${s.error}`}>{errors.consent}</span>}

      <button
        type="submit"
        disabled={isPending}
        className={`kg-btn min-h-14 rounded-full px-7 text-[17px] font-semibold disabled:opacity-60 ${s.button}`}
      >
        {isPending ? "Отправляю…" : "Подать заявку на пилот"}
      </button>
    </form>
  );
}
