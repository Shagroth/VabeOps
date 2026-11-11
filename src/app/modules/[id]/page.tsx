import { notFound, redirect } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getVideoUrl } from "@/lib/r2";
import { SubmissionForm } from "@/components/SubmissionForm";
import { FeedbackForm } from "@/components/FeedbackForm";

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
        <h2 className="text-lg font-semibold">Задание</h2>
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown>{mod.assignmentMd}</ReactMarkdown>
        </div>
        <SubmissionForm moduleId={mod.id} initialContent={submission?.content ?? ""} />
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
