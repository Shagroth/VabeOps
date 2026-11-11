import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { updateModule, setFeedbackQuestions, reviewSubmission } from "../../actions";
import { SubmissionStatusBadge } from "@/components/SubmissionStatusBadge";

const DECISION_FIELD_LABELS: Record<string, string> = {
  task: "Задача",
  approach: "Подход",
  rejectedAlternative: "Отвергнутая альтернатива",
  verification: "Проверка",
  riskOrLimit: "Риск/ограничение",
  revisitCondition: "Условие пересмотра",
  conditionsResponse: "Ответ на «изменились условия»",
};

export default async function EditModulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const mod = await prisma.module.findUnique({
    where: { id },
    include: {
      submissions: {
        include: {
          user: true,
          versions: { orderBy: { createdAt: "desc" } },
          feedback: { include: { author: true }, orderBy: { createdAt: "asc" } },
        },
        orderBy: { createdAt: "desc" },
      },
      feedbackForms: { include: { responses: { include: { user: true } } } },
    },
  });
  if (!mod) notFound();

  const noviceForm = mod.feedbackForms.find((f) => f.level === "NOVICE");
  const strongForm = mod.feedbackForms.find((f) => f.level === "STRONG");

  const boundUpdate = updateModule.bind(null, mod.id);

  return (
    <main className="mx-auto max-w-2xl p-8 flex flex-col gap-10">
      <section>
        <h1 className="mb-6 text-2xl font-semibold">Неделя {mod.weekNumber} · {mod.title}</h1>
        <form action={boundUpdate} className="flex flex-col gap-4">
          <input type="hidden" name="cohortId" value={mod.cohortId} />
          <label className="flex flex-col gap-1 text-sm">
            Номер недели
            <input
              type="number"
              name="weekNumber"
              defaultValue={mod.weekNumber}
              required
              className="rounded border border-black/15 p-2 dark:border-white/20"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Название
            <input
              name="title"
              defaultValue={mod.title}
              required
              className="rounded border border-black/15 p-2 dark:border-white/20"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isOpen" defaultChecked={mod.isOpen} />
            Открыт для участников
          </label>
          <label className="flex flex-col gap-1 text-sm">
            R2 video key
            <input
              name="videoKey"
              defaultValue={mod.videoKey ?? ""}
              className="rounded border border-black/15 p-2 dark:border-white/20"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Конспект (markdown)
            <textarea
              name="notesMd"
              defaultValue={mod.notesMd}
              rows={8}
              className="rounded border border-black/15 p-2 font-mono text-xs dark:border-white/20"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Задание (markdown)
            <textarea
              name="assignmentMd"
              defaultValue={mod.assignmentMd}
              rows={6}
              className="rounded border border-black/15 p-2 font-mono text-xs dark:border-white/20"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            «Изменились условия» (опционально)
            <textarea
              name="conditionsChangedMd"
              defaultValue={mod.conditionsChangedMd ?? ""}
              rows={3}
              placeholder="Например: инструмент теперь read-only. Как это меняет подход?"
              className="rounded border border-black/15 p-2 text-sm dark:border-white/20"
            />
          </label>
          <button
            type="submit"
            className="self-start rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background"
          >
            Сохранить
          </button>
        </form>
      </section>

      <section className="flex flex-col gap-4 border-t border-black/10 pt-6 dark:border-white/15">
        <h2 className="text-lg font-semibold">Вопросы фидбека</h2>
        {(["NOVICE", "STRONG"] as const).map((level) => {
          const form = level === "NOVICE" ? noviceForm : strongForm;
          const action = setFeedbackQuestions.bind(null, mod.id, level);
          return (
            <form key={level} action={async (fd) => action(String(fd.get("questions")))} className="flex flex-col gap-2">
              <span className="text-sm font-medium">{level === "NOVICE" ? "Новички" : "Сильные"}</span>
              <textarea
                name="questions"
                defaultValue={(form?.questions as string[] | undefined)?.join("\n") ?? ""}
                placeholder={"Один вопрос на строку"}
                rows={3}
                className="rounded border border-black/15 p-2 text-sm dark:border-white/20"
              />
              <button
                type="submit"
                className="self-start rounded border border-black/15 px-3 py-1 text-sm dark:border-white/20"
              >
                Сохранить вопросы
              </button>
            </form>
          );
        })}
      </section>

      <section className="flex flex-col gap-4 border-t border-black/10 pt-6 dark:border-white/15">
        <h2 className="text-lg font-semibold">Сдачи ({mod.submissions.length})</h2>
        <ul className="flex flex-col gap-4">
          {mod.submissions.map((s) => {
            const latest = s.versions[0];
            const accept = reviewSubmission.bind(null, s.id, "ACCEPTED");
            const requestRevision = reviewSubmission.bind(null, s.id, "NEEDS_REVISION");
            return (
              <li key={s.id} className="rounded-lg border border-black/10 p-4 text-sm dark:border-white/15">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium">{s.user.email}</span>
                  <SubmissionStatusBadge status={s.status} />
                </div>

                {latest && (
                  <div className="mb-3 flex flex-col gap-1">
                    <p className="whitespace-pre-wrap">{latest.content}</p>
                    {Object.entries(DECISION_FIELD_LABELS).map(([key, label]) => {
                      const value = (latest as unknown as Record<string, string | null>)[key];
                      return value ? (
                        <p key={key}>
                          <span className="text-black/50 dark:text-white/50">{label}: </span>
                          {value}
                        </p>
                      ) : null;
                    })}
                  </div>
                )}

                {s.feedback.length > 0 && (
                  <div className="mb-3 flex flex-col gap-1 rounded bg-black/5 p-2 text-xs dark:bg-white/5">
                    {s.feedback.map((f) => (
                      <p key={f.id}>
                        <span className="text-black/50 dark:text-white/50">{f.author.email}: </span>
                        {f.content}
                      </p>
                    ))}
                  </div>
                )}

                {s.versions.length > 1 && (
                  <details className="mb-3 text-xs text-black/50 dark:text-white/50">
                    <summary className="cursor-pointer">
                      Предыдущие версии ({s.versions.length - 1})
                    </summary>
                  </details>
                )}

                <form
                  action={async (fd) => {
                    "use server";
                    const comment = String(fd.get("comment") || "");
                    const action = fd.get("intent") === "accept" ? accept : requestRevision;
                    await action(comment);
                  }}
                  className="flex flex-col gap-2"
                >
                  <textarea
                    name="comment"
                    placeholder="Комментарий (опционально)"
                    rows={2}
                    className="rounded border border-black/15 p-2 text-sm dark:border-white/20"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      name="intent"
                      value="accept"
                      className="rounded bg-accent-action px-3 py-1 text-sm text-white"
                    >
                      Принять
                    </button>
                    <button
                      type="submit"
                      name="intent"
                      value="revise"
                      className="rounded border border-accent-change/50 px-3 py-1 text-sm text-accent-change"
                    >
                      На доработку
                    </button>
                  </div>
                </form>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="flex flex-col gap-4 border-t border-black/10 pt-6 dark:border-white/15">
        <h2 className="text-lg font-semibold">Фидбек по неделе</h2>
        {mod.feedbackForms.map((f) => (
          <div key={f.id}>
            <h3 className="mb-2 text-sm font-semibold">{f.level}</h3>
            <ul className="flex flex-col gap-3">
              {f.responses.map((r) => (
                <li key={r.id} className="rounded-lg border border-black/10 p-3 text-sm dark:border-white/15">
                  <div className="mb-1 font-medium">{r.user.email}</div>
                  {Object.entries(r.answers as Record<string, string>).map(([q, a]) => (
                    <p key={q} className="mb-1">
                      <span className="text-black/50 dark:text-white/50">{q}</span> {a}
                    </p>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </main>
  );
}
