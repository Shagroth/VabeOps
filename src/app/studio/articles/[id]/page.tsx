import { notFound } from "next/navigation";
import { requireStudioAccess } from "@/lib/require-role";
import { prisma } from "@/lib/prisma";
import { WorkspaceShell } from "@/components/WorkspaceShell";
import { MarkdownField } from "@/components/studio/MarkdownField";
import { UnsavedChangesGuard } from "@/components/studio/UnsavedChangesGuard";
import {
  archiveArticle,
  publishArticle,
  submitArticleForReview,
  updateArticle,
} from "@/app/studio/actions";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireStudioAccess();
  const article = await prisma.article.findUnique({ where: { id }, include: { author: true } });
  if (!article) notFound();

  const role = session.user.role;
  const isOwner = article.authorId === session.user.id;
  const canEdit =
    role === "ADMIN" || role === "EDITOR" || (role === "AUTHOR" && isOwner && article.status !== "PUBLISHED" && article.status !== "ARCHIVED");
  const canPublish = role === "ADMIN" || role === "EDITOR";
  const canSubmitForReview = canEdit && article.status === "DRAFT";

  const update = updateArticle.bind(null, id);
  const submitForReview = submitArticleForReview.bind(null, id);
  const publish = publishArticle.bind(null, id);
  const archive = archiveArticle.bind(null, id);

  return (
    <WorkspaceShell active="admin" email={session.user.email ?? ""} canAccessStudio breadcrumb={`Studio / ${article.title}`}>
      <div className="mx-auto flex max-w-[760px] flex-col gap-6">
        {canEdit && <UnsavedChangesGuard />}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold">{article.title || "(без названия)"}</h1>
          <span className="rounded-full border border-hairline px-3 py-1 text-xs text-graphite-muted">
            {article.status}
          </span>
        </div>
        <p className="text-xs text-graphite-muted">
          Автор: {article.author.email} · создано {article.createdAt.toLocaleString("ru-RU")} · обновлено{" "}
          {article.updatedAt.toLocaleString("ru-RU")}
          {article.publishedAt && <> · опубликовано {article.publishedAt.toLocaleString("ru-RU")}</>}
        </p>

        <form action={update} className="flex flex-col gap-4 text-sm">
          <fieldset disabled={!canEdit} className="flex flex-col gap-4 disabled:opacity-60">
            <label className="flex flex-col gap-1">
              Заголовок
              <input name="title" defaultValue={article.title} maxLength={200} className="rounded-lg border border-hairline p-2.5" />
            </label>
            <label className="flex flex-col gap-1">
              Дек
              <textarea name="dek" defaultValue={article.dek} rows={2} maxLength={400} className="rounded-lg border border-hairline p-2.5" />
            </label>
            <label className="flex flex-col gap-1">
              Категория
              <input name="category" defaultValue={article.category} className="rounded-lg border border-hairline p-2.5" />
            </label>
            <label className="flex flex-col gap-1">
              Время чтения (мин)
              <input type="number" name="readMinutes" defaultValue={article.readMinutes} min={1} max={60} className="w-28 rounded-lg border border-hairline p-2.5" />
            </label>
            <MarkdownField name="bodyMd" defaultValue={article.bodyMd} />
          </fieldset>
          {canEdit && (
            <button type="submit" className="self-start rounded-lg bg-ink px-4 py-2 font-medium text-ink-foreground">
              Сохранить
            </button>
          )}
        </form>

        <div className="flex flex-wrap gap-2 border-t border-hairline pt-5">
          {canSubmitForReview && (
            <form action={submitForReview}>
              <button type="submit" className="rounded-lg border border-hairline px-3 py-2 text-sm">
                Отправить на ревью
              </button>
            </form>
          )}
          {canPublish && article.status !== "PUBLISHED" && (
            <form action={publish}>
              <button type="submit" className="rounded-lg bg-signal px-3 py-2 text-sm font-medium text-signal-ink">
                Опубликовать
              </button>
            </form>
          )}
          {canPublish && article.status !== "ARCHIVED" && (
            <form action={archive}>
              <button type="submit" className="rounded-lg border border-hairline px-3 py-2 text-sm text-graphite-muted">
                В архив
              </button>
            </form>
          )}
        </div>

        {!canEdit && (
          <p className="text-xs text-graphite-muted">
            У тебя нет прав редактировать этот материал в текущем статусе — доступен только просмотр.
          </p>
        )}
      </div>
    </WorkspaceShell>
  );
}
