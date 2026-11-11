import { notFound, redirect } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getVideoUrl } from "@/lib/r2";
import { SubmissionForm } from "@/components/SubmissionForm";
import { FeedbackForm } from "@/components/FeedbackForm";
import { SubmissionStatusBadge } from "@/components/SubmissionStatusBadge";

const DECISION_FIELD_LABELS: Record<string, string> = {
  task: "Задача",
  approach: "Подход",
  rejectedAlternative: "Отвергнутая альтернатива",
  verification: "Проверка",
  riskOrLimit: "Риск/ограничение",
  revisitCondition: "Условие пересмотра",
};

export default async function ModulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/");

  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: session.user.id },
  });
  if (!enrollment) notFound();

  const [mod, submission, feedbackForm] = await Promise.all([
    prisma.module.findUnique({ where: { id } }),
    prisma.submission.findUnique({
      where: { moduleId_userId: { moduleId: id, userId: session.user.id } },
      include: {
        versions: { orderBy: { createdAt: "desc" } },
        feedback: { include: { author: true }, orderBy: { createdAt: "asc" } },
      },
    }),
    prisma.feedbackForm.findUnique({
      where: { moduleId_level: { moduleId: id, level: enrollment.level } },
      include: {
        responses: { where: { userId: session.user.id } },
      },
    }),
  ]);

  if (!mod || mod.cohortId !== enrollment.cohortId) notFound();

  if (!mod.isOpen) {
    return (
      <main className="mx-auto max-w-2xl p-8">
        <span className="text-sm text-black/50 dark:text-white/50">Неделя {mod.weekNumber}</span>
        <h1 className="mb-2 text-2xl font-semibold">{mod.title}</h1>
        <p className="text-black/60 dark:text-white/60">Эта неделя ещё не открыта.</p>
      </main>
    );
  }

  const videoUrl = mod.videoKey ? await getVideoUrl(mod.videoKey) : null;
  const questions = (feedbackForm?.questions as string[] | undefined) ?? [];
  const initialAnswers =
    (feedbackForm?.responses[0]?.answers as Record<string, string> | undefined) ?? {};
  const latestVersion = submission?.versions[0];
  const olderVersions = submission?.versions.slice(1) ?? [];
  const initialBreakdown = latestVersion
    ? {
        content: latestVersion.content,
        task: latestVersion.task ?? undefined,
        approach: latestVersion.approach ?? undefined,
        rejectedAlternative: latestVersion.rejectedAlternative ?? undefined,
        verification: latestVersion.verification ?? undefined,
        riskOrLimit: latestVersion.riskOrLimit ?? undefined,
        revisitCondition: latestVersion.revisitCondition ?? undefined,
        conditionsResponse: latestVersion.conditionsResponse ?? undefined,
      }
    : {};

  return (
    <main className="mx-auto max-w-2xl p-8 flex flex-col gap-8">
      <div>
        <span className="text-sm text-black/50 dark:text-white/50">
          Неделя {mod.weekNumber}
        </span>
        <h1 className="text-2xl font-semibold">{mod.title}</h1>
      </div>

      {videoUrl && <video controls className="w-full rounded-lg" src={videoUrl} />}

      <section className="prose dark:prose-invert max-w-none">
        <ReactMarkdown>{mod.notesMd}</ReactMarkdown>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Задание</h2>
          {submission && <SubmissionStatusBadge status={submission.status} />}
        </div>
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown>{mod.assignmentMd}</ReactMarkdown>
        </div>

        <SubmissionForm
          moduleId={mod.id}
          initial={initialBreakdown}
          conditionsChangedMd={mod.conditionsChangedMd}
        />

        {submission && submission.feedback.length > 0 && (
          <div className="flex flex-col gap-2 rounded-lg border border-black/10 p-4 text-sm dark:border-white/15">
            <span className="font-medium">Фидбек по сдаче</span>
            {submission.feedback.map((f) => (
              <p key={f.id}>
                <span className="text-black/50 dark:text-white/50">{f.author.email}: </span>
                {f.content}
              </p>
            ))}
          </div>
        )}

        {olderVersions.length > 0 && (
          <details className="text-sm text-black/60 dark:text-white/60">
            <summary className="cursor-pointer">
              Предыдущие версии ({olderVersions.length})
            </summary>
            <ul className="mt-2 flex flex-col gap-3">
              {olderVersions.map((v) => (
                <li key={v.id} className="rounded-lg border border-black/10 p-3 dark:border-white/15">
                  <div className="mb-1 text-xs text-black/40 dark:text-white/40">
                    {v.createdAt.toLocaleString("ru-RU")}
                  </div>
                  <p className="whitespace-pre-wrap">{v.content}</p>
                  {Object.entries(DECISION_FIELD_LABELS).map(([key, label]) => {
                    const value = (v as unknown as Record<string, string | null>)[key];
                    return value ? (
                      <p key={key} className="mt-1">
                        <span className="text-black/50 dark:text-white/50">{label}: </span>
                        {value}
                      </p>
                    ) : null;
                  })}
                </li>
              ))}
            </ul>
          </details>
        )}
      </section>

      {feedbackForm && questions.length > 0 && (
        <section className="flex flex-col gap-3 border-t border-black/10 pt-6 dark:border-white/15">
          <h2 className="text-lg font-semibold">Фидбек по неделе</h2>
          <FeedbackForm
            formId={feedbackForm.id}
            questions={questions}
            initialAnswers={initialAnswers}
          />
        </section>
      )}
    </main>
  );
}
