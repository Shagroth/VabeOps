import { requireAdmin } from "@/lib/require-admin";
import { WorkspaceShell } from "@/components/WorkspaceShell";
import { CourseModuleSelect } from "@/components/admin/CourseModuleSelect";
import { createModule } from "../../actions";

export default async function NewModulePage({
  searchParams,
}: {
  searchParams: Promise<{ cohortId?: string }>;
}) {
  const session = await requireAdmin();
  const { cohortId } = await searchParams;

  return (
    <WorkspaceShell active="admin" email={session.user.email ?? ""} canAccessStudio>
    <div className="mx-auto max-w-[760px]">
      <h1 className="mb-6 text-2xl font-semibold">Новый модуль</h1>
      <form action={createModule} className="flex flex-col gap-4">
        <input type="hidden" name="cohortId" value={cohortId ?? ""} />
        <label className="flex flex-col gap-1 text-sm">
          Номер недели
          <input
            type="number"
            name="weekNumber"
            required
            className="rounded border border-black/15 p-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Название
          <input
            name="title"
            required
            className="rounded border border-black/15 p-2"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isOpen" defaultChecked />
          Открыт для участников
        </label>
        <CourseModuleSelect />
        <label className="flex flex-col gap-1 text-sm">
          R2 video key (опционально)
          <input
            name="videoKey"
            placeholder="cohort-1/week-1.mp4"
            className="rounded border border-black/15 p-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Конспект (markdown)
          <textarea
            name="notesMd"
            rows={8}
            className="rounded border border-black/15 p-2 font-mono text-xs"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Задание (markdown)
          <textarea
            name="assignmentMd"
            rows={6}
            className="rounded border border-black/15 p-2 font-mono text-xs"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          «Изменились условия» (опционально)
          <textarea
            name="conditionsChangedMd"
            rows={3}
            placeholder="Например: инструмент теперь read-only. Как это меняет подход?"
            className="rounded border border-black/15 p-2 text-sm"
          />
        </label>
        <button
          type="submit"
          className="self-start rounded-lg bg-ink px-4 py-2 text-sm font-medium text-ink-foreground transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
        >
          Создать
        </button>
      </form>
    </div>
    </WorkspaceShell>
  );
}
