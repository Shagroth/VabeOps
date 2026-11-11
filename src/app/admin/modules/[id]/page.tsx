import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { updateModule, setFeedbackQuestions } from "../../actions";

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
      submissions: { include: { user: true }, orderBy: { submittedAt: "desc" } },
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
        <ul className="flex flex-col gap-3">
          {mod.submissions.map((s) => (
            <li key={s.id} className="rounded-lg border border-black/10 p-3 text-sm dark:border-white/15">
              <div className="mb-1 font-medium">{s.user.email}</div>
              <p className="whitespace-pre-wrap text-black/70 dark:text-white/70">{s.content}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4 border-t border-black/10 pt-6 dark:border-white/15">
        <h2 className="text-lg font-semibold">Фидбек</h2>
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
