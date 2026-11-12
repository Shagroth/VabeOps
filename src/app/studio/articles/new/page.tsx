import { requireRole } from "@/lib/require-role";
import { WorkspaceShell } from "@/components/WorkspaceShell";
import { createArticle } from "@/app/studio/actions";

export default async function NewArticlePage() {
  const session = await requireRole(["ADMIN", "EDITOR", "AUTHOR"]);

  return (
    <WorkspaceShell active="admin" email={session.user.email ?? ""} canAccessStudio breadcrumb="Studio / Новая статья">
      <div className="mx-auto flex max-w-[720px] flex-col gap-6">
        <h1 className="text-2xl font-semibold">Новая статья</h1>
        <form action={createArticle} className="flex flex-col gap-4 text-sm">
          <label className="flex flex-col gap-1">
            Slug (латиницей, для URL)
            <input name="slug" required pattern="[a-z0-9-]+" className="rounded-lg border border-hairline p-2.5" />
          </label>
          <label className="flex flex-col gap-1">
            Заголовок
            <input name="title" required maxLength={200} className="rounded-lg border border-hairline p-2.5" />
          </label>
          <label className="flex flex-col gap-1">
            Дек (краткое описание)
            <textarea name="dek" required rows={2} maxLength={400} className="rounded-lg border border-hairline p-2.5" />
          </label>
          <label className="flex flex-col gap-1">
            Категория
            <input name="category" defaultValue="Инженерные заметки" className="rounded-lg border border-hairline p-2.5" />
          </label>
          <label className="flex flex-col gap-1">
            Время чтения (мин)
            <input type="number" name="readMinutes" defaultValue={5} min={1} max={60} className="w-28 rounded-lg border border-hairline p-2.5" />
          </label>
          <label className="flex flex-col gap-1">
            Содержание (Markdown)
            <textarea name="bodyMd" rows={10} maxLength={20000} className="rounded-lg border border-hairline p-3 font-mono text-sm" />
          </label>
          <button type="submit" className="self-start rounded-lg bg-ink px-4 py-2 font-medium text-ink-foreground">
            Создать черновик
          </button>
        </form>
      </div>
    </WorkspaceShell>
  );
}
