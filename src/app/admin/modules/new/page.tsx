import { requireAdmin } from "@/lib/require-admin";
import { createModule } from "../../actions";

export default async function NewModulePage({
  searchParams,
}: {
  searchParams: Promise<{ cohortId?: string }>;
}) {
  await requireAdmin();
  const { cohortId } = await searchParams;

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-2xl font-semibold">Новый модуль</h1>
      <form action={createModule} className="flex flex-col gap-4">
        <input type="hidden" name="cohortId" value={cohortId ?? ""} />
        <label className="flex flex-col gap-1 text-sm">
          Номер недели
          <input
            type="number"
            name="weekNumber"
            required
            className="rounded border border-black/15 p-2 dark:border-white/20"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Название
          <input
            name="title"
            required
            className="rounded border border-black/15 p-2 dark:border-white/20"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isOpen" defaultChecked />
          Открыт для участников
        </label>
        <label className="flex flex-col gap-1 text-sm">
          R2 video key (опционально)
          <input
            name="videoKey"
            placeholder="cohort-1/week-1.mp4"
            className="rounded border border-black/15 p-2 dark:border-white/20"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Конспект (markdown)
          <textarea
            name="notesMd"
            rows={8}
            className="rounded border border-black/15 p-2 font-mono text-xs dark:border-white/20"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Задание (markdown)
          <textarea
            name="assignmentMd"
            rows={6}
            className="rounded border border-black/15 p-2 font-mono text-xs dark:border-white/20"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          «Изменились условия» (опционально)
          <textarea
            name="conditionsChangedMd"
            rows={3}
            placeholder="Например: инструмент теперь read-only. Как это меняет подход?"
            className="rounded border border-black/15 p-2 text-sm dark:border-white/20"
          />
        </label>
        <button
          type="submit"
          className="self-start rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          Создать
        </button>
      </form>
    </main>
  );
}
