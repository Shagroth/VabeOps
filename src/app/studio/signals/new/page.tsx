import { requireRole } from "@/lib/require-role";
import { WorkspaceShell } from "@/components/WorkspaceShell";
import { createSignal } from "@/app/studio/actions";

export default async function NewSignalPage() {
  const session = await requireRole(["ADMIN", "EDITOR", "AUTHOR"]);

  return (
    <WorkspaceShell active="admin" email={session.user.email ?? ""} canAccessStudio breadcrumb="Studio / Новый Signal">
      <div className="mx-auto flex max-w-[640px] flex-col gap-6">
        <h1 className="text-2xl font-semibold">Новый Signal</h1>
        <form action={createSignal} className="flex flex-col gap-4 text-sm">
          <label className="flex flex-col gap-1">
            Slug
            <input name="slug" required pattern="[a-z0-9-]+" className="rounded-lg border border-hairline p-2.5" />
          </label>
          <label className="flex flex-col gap-1">
            Заголовок
            <input name="title" required maxLength={200} className="rounded-lg border border-hairline p-2.5" />
          </label>
          <label className="flex flex-col gap-1">
            Тип
            <select name="kind" className="rounded-lg border border-hairline p-2.5">
              <option value="original">Оригинал</option>
              <option value="external">Внешний источник</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            Краткое объяснение события
            <textarea name="summary" required rows={3} maxLength={400} className="rounded-lg border border-hairline p-2.5" />
          </label>
          <label className="flex flex-col gap-1">
            Почему это важно инженеру
            <textarea name="whyItMatters" required rows={2} maxLength={1000} className="rounded-lg border border-hairline p-2.5" />
          </label>
          <label className="flex flex-col gap-1">
            Source URL (только для внешнего)
            <input name="sourceUrl" type="url" maxLength={500} className="rounded-lg border border-hairline p-2.5" />
          </label>
          <label className="flex flex-col gap-1">
            Теги (через запятую)
            <input name="tags" className="rounded-lg border border-hairline p-2.5" />
          </label>
          <button type="submit" className="self-start rounded-lg bg-ink px-4 py-2 font-medium text-ink-foreground">
            Создать черновик
          </button>
        </form>
      </div>
    </WorkspaceShell>
  );
}
