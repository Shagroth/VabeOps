import { notFound, redirect } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getVideoUrl } from "@/lib/r2";
import { SubmissionForm } from "@/components/SubmissionForm";
import { FeedbackForm } from "@/components/FeedbackForm";
import { SubmissionStatusBadge } from "@/components/SubmissionStatusBadge";
import { CommentThread } from "@/components/CommentThread";
import { WorkspaceShell } from "@/components/WorkspaceShell";

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

  const [mod, submission, feedbackForm, comments] = await Promise.all([
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
    prisma.moduleComment.findMany({
      where: { moduleId: id },
      include: { user: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  if (!mod || mod.cohortId !== enrollment.cohortId) notFound();

  if (!mod.isOpen) {
    return (
      <WorkspaceShell active="program" email={session.user.email ?? ""} isAdmin={session.user.role === "ADMIN"}>
        <div className="mx-auto max-w-[820px]">
          <span className="text-sm text-graphite-muted">Неделя {mod.weekNumber}</span>
          <h1 className="mb-2 text-2xl font-semibold">{mod.title}</h1>
          <p className="text-graphite-muted">Эта неделя ещё не открыта.</p>
        </div>
      </WorkspaceShell>
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
    <WorkspaceShell active="program" email={session.user.email ?? ""} isAdmin={session.user.role === "ADMIN"}>
    <div className="mx-auto flex max-w-[820px] flex-col gap-8">
      <div>
        <span className="text-sm text-graphite-muted">
          Неделя {mod.weekNumber}
        </span>
        <h1 className="text-2xl font-semibold">{mod.title}</h1>
      </div>

      {videoUrl && <video controls className="w-full rounded-lg" src={videoUrl} />}

      <section className="prose prose-sm max-w-none prose-headings:font-semibold prose-h1:text-xl prose-h2:text-lg prose-h3:text-base">
        <ReactMarkdown>{mod.notesMd}</ReactMarkdown>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Задание</h2>
          {submission && <SubmissionStatusBadge status={submission.status} />}
        </div>
        <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-h1:text-xl prose-h2:text-lg prose-h3:text-base">
          <ReactMarkdown>{mod.assignmentMd}</ReactMarkdown>
        </div>

        <SubmissionForm
          moduleId={mod.id}
          initial={initialBreakdown}
          conditionsChangedMd={mod.conditionsChangedMd}
        />

        {submission && submission.feedback.length > 0 && (
          <div className="flex flex-col gap-2 rounded-lg border border-hairline p-4 text-sm">
            <span className="font-medium">Фидбек по сдаче</span>
            {submission.feedback.map((f) => (
              <p key={f.id}>
                <span className="text-graphite-muted">{f.author.email}: </span>
                {f.content}
              </p>
            ))}
          </div>
        )}

        {olderVersions.length > 0 && (
          <details className="text-sm text-graphite-muted">
            <summary className="cursor-pointer">
              Предыдущие версии ({olderVersions.length})
            </summary>
            <ul className="mt-2 flex flex-col gap-3">
              {olderVersions.map((v) => (
                <li key={v.id} className="rounded-lg border border-hairline p-3">
                  <div className="mb-1 text-xs text-graphite-muted">
                    {v.createdAt.toLocaleString("ru-RU")}
                  </div>
                  <p className="whitespace-pre-wrap">{v.content}</p>
                  {Object.entries(DECISION_FIELD_LABELS).map(([key, label]) => {
                    const value = (v as unknown as Record<string, string | null>)[key];
                    return value ? (
                      <p key={key} className="mt-1">
                        <span className="text-graphite-muted">{label}: </span>
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
        <section className="flex flex-col gap-3 border-t border-hairline pt-6">
          <h2 className="text-lg font-semibold">Фидбек по неделе</h2>
          <FeedbackForm
            formId={feedbackForm.id}
            questions={questions}
            initialAnswers={initialAnswers}
          />
        </section>
      )}

      <section className="flex flex-col gap-3 border-t border-hairline pt-6">
        <h2 className="text-lg font-semibold">Обсуждение недели</h2>
        <CommentThread moduleId={mod.id} comments={comments} />
      </section>
    </div>
    </WorkspaceShell>
  );
}
