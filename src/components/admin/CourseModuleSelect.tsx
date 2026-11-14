import type { CourseModuleSummary } from "@/content/course-catalog";

export function CourseModuleSelect({
  modules,
  defaultValue,
}: {
  /** Modules of the cohort's course. */
  modules: readonly CourseModuleSummary[];
  defaultValue?: number | null;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      Контент курса
      <select
        name="courseModuleNumber"
        defaultValue={defaultValue ? String(defaultValue) : ""}
        className="rounded border border-black/15 p-2"
      >
        <option value="">— без привязки (только markdown ниже) —</option>
        {modules.map((m) => (
          <option key={m.number} value={String(m.number)}>
            Модуль 0{m.number} · {m.shortTitle}
          </option>
        ))}
      </select>
      <span className="text-xs text-graphite-muted">
        Если выбран модуль, участник видит интерактивный урок, лабораторию и ТЗ домашней работы из программы.
        Markdown-поля ниже тогда показываются как дополнительные заметки автора.
      </span>
    </label>
  );
}
