import { notFound } from "next/navigation";
import { requireStudioAccess } from "@/lib/require-role";
import { prisma } from "@/lib/prisma";
import { WorkspaceShell } from "@/components/WorkspaceShell";
import { UnsavedChangesGuard } from "@/components/studio/UnsavedChangesGuard";
import {
  archiveSignal,
  publishSignal,
  submitSignalForReview,
  updateSignal,
} from "@/app/studio/actions";

export default async function EditSignalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireStudioAccess();
  const signal = await prisma.signal.findUnique({ where: { id }, include: { author: true } });
  if (!signal) notFound();

  const role = session.user.role;
  const isOwner = signal.authorId === session.user.id;
  const canEdit =
    role === "ADMIN" || role === "EDITOR" || (role === "AUTHOR" && isOwner && signal.status !== "PUBLISHED" && signal.status !== "ARCHIVED");
  const canPublish = role === "ADMIN" || role === "EDITOR";
  const canSubmitForReview = canEdit && signal.status === "DRAFT";

  const update = updateSignal.bind(null, id);
  const submitForReview = submitSignalForReview.bind(null, id);
  const publish = publishSignal.bind(null, id);
  const archive = archiveSignal.bind(null, id);

  return (
    <WorkspaceShell active="admin" email={session.user.email ?? ""} canAccessStudio breadcrumb={`Studio / ${signal.title}`}>
      <div className="mx-auto flex max-w-[680px] flex-col gap-6">
        {canEdit && <UnsavedChangesGuard />}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold">{signal.title || "(без названия)"}</h1>
          <span className="rounded-full border border-hairline px-3 py-1 text-xs text-graphite-muted">
            {signal.status}
          </span>
        </div>
        <p className="text-xs text-graphite-muted">
          Автор: {signal.author.email} · создано {signal.createdAt.toLocaleString("ru-RU")} · обновлено{" "}
          {signal.updatedAt.toLocaleString("ru-RU")}
          {signal.publishedAt && <> · опубликовано {signal.publishedAt.toLocaleString("ru-RU")}</>}
        </p>

        <form action={update} className="flex flex-col gap-4 text-sm">
          <fieldset disabled={!canEdit} className="flex flex-col gap-4 disabled:opacity-60">
            <label className="flex flex-col gap-1">
              Заголовок
              <input name="title" defaultValue={signal.title} maxLength={200} className="rounded-lg border border-hairline p-2.5" />
            </label>
            <label className="flex flex-col gap-1">
              Тип
              <select name="kind" defaultValue={signal.kind.toLowerCase()} className="rounded-lg border border-hairline p-2.5">
                <option value="original">Оригинал</option>
                <option value="external">Внешний источник</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              Краткое объяснение события
              <textarea name="summary" defaultValue={signal.summary} rows={3} maxLength={400} className="rounded-lg border border-hairline p-2.5" />
            </label>
            <label className="flex flex-col gap-1">
              Почему это важно инженеру
              <textarea name="whyItMatters" defaultValue={signal.whyItMatters} rows={2} maxLength={1000} className="rounded-lg border border-hairline p-2.5" />
            </label>
            <label className="flex flex-col gap-1">
              Source URL
              <input name="sourceUrl" type="url" defaultValue={signal.sourceUrl ?? ""} maxLength={500} className="rounded-lg border border-hairline p-2.5" />
            </label>
            <label className="flex flex-col gap-1">
              Теги (через запятую)
              <input name="tags" defaultValue={signal.tags.join(", ")} className="rounded-lg border border-hairline p-2.5" />
            </label>
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
          {canPublish && signal.status !== "PUBLISHED" && (
            <form action={publish}>
              <button type="submit" className="rounded-lg bg-signal px-3 py-2 text-sm font-medium text-signal-ink">
                Опубликовать
              </button>
            </form>
          )}
          {canPublish && signal.status !== "ARCHIVED" && (
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
