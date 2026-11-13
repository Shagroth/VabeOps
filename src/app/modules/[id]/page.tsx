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
import { canAccessStudio, canReviewSubmissions } from "@/lib/require-role";
import { displayName } from "@/lib/display-name";
import { ModuleHero } from "@/components/demo-course/ModuleHero";
import { DemoCourseFlow } from "@/components/demo-course/DemoCourseFlow";
import { PrototypeModuleFlow } from "@/components/demo-course/PrototypeModuleFlow";
import { HomeworkAssignmentSection } from "@/components/demo-course/HomeworkAssignment";
import { getHomeworkAssignment } from "@/content/demo-course-homework";
import { MODULE_ONE_SUMMARY, getPrototypeModule } from "@/content/demo-course-program";
import { DECISION_FIELD_LABELS } from "@/lib/decision-field-labels";
import { HOMEWORK_SCORING, HOMEWORK_PASS_SCORE } from "@/content/demo-course-homework";
import { sumScores, totalMaxScore } from "@/lib/homework-scoring";

const PROSE =
  "prose prose-sm max-w-none prose-headings:font-semibold prose-h1:text-xl prose-h2:text-lg prose-h3:text-base";

/** Course content (lesson flow + homework brief) for a week linked to a program module. */
function getCourseContent(courseModuleNumber: number | null) {
  if (!courseModuleNumber) return null;
  const homework = getHomeworkAssignment(courseModuleNumber);
  if (courseModuleNumber === 1) return { summary: MODULE_ONE_SUMMARY, prototype: null, homework };
  const prototype = getPrototypeModule(courseModuleNumber);
  if (!prototype) return null;
  return { summary: prototype, prototype, homework };
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/");

  const mod = await prisma.module.findUnique({ where: { id } });
  if (!mod) notFound();

  // Membership is checked against the module's own cohort, not "the latest
  // enrollment", so a participant of an older cohort can't open newer weeks.
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_cohortId: { userId: session.user.id, cohortId: mod.cohortId } },
  });
  if (!enrollment) notFound();

  const studio = canAccessStudio(session.user.role);
  const reviewAccess = canReviewSubmissions(session.user.role);

  if (!mod.isOpen) {
    return (
      <WorkspaceShell
        active="program"
        email={session.user.email ?? ""}
        canAccessStudio={studio}
        canReviewSubmissions={reviewAccess}
        breadcrumb={`Неделя ${mod.weekNumber}`}
      >
        <div className="mx-auto max-w-[820px]">
          <span className="text-sm text-graphite-muted">Неделя {mod.weekNumber}</span>
          <h1 className="mb-2 text-2xl font-semibold">{mod.title}</h1>
          <p className="text-graphite-muted">Эта неделя ещё не открыта — автор откроет её по расписанию потока.</p>
        </div>
      </WorkspaceShell>
    );
  }

  const [cohortWeeks, submission, feedbackForm, comments] = await Promise.all([
    prisma.module.findMany({
      where: { cohortId: mod.cohortId },
      orderBy: { weekNumber: "asc" },
      select: { id: true, weekNumber: true, isOpen: true },
    }),
    prisma.submission.findUnique({
      where: { moduleId_userId: { moduleId: id, userId: session.user.id } },
      include: {
        versions: { orderBy: { createdAt: "desc" } },
        feedback: {
          include: { author: { select: { name: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    }),
    prisma.feedbackForm.findUnique({
      where: { moduleId_level: { moduleId: id, level: enrollment.level } },
      include: { responses: { where: { userId: session.user.id } } },
    }),
    prisma.moduleComment.findMany({
      where: { moduleId: id },
      select: { id: true, content: true, createdAt: true, user: { select: { name: true } } },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const index = cohortWeeks.findIndex((w) => w.id === mod.id);
  const prevWeek = index > 0 ? cohortWeeks[index - 1] : null;
  const nextWeek = index >= 0 && index < cohortWeeks.length - 1 ? cohortWeeks[index + 1] : null;
  const nextOpenHref = nextWeek?.isOpen ? `/modules/${nextWeek.id}` : null;

  const course = getCourseContent(mod.courseModuleNumber);
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
  const flowLinks = {
    nextHref: nextOpenHref,
    nextLabel: nextWeek ? `К неделе ${nextWeek.weekNumber} →` : undefined,
    overviewHref: "/modules",
  };
  const hasAuthorNotes = mod.notesMd.trim().length > 0 || mod.assignmentMd.trim().length > 0;

  return (
    <WorkspaceShell
      active="program"
      email={session.user.email ?? ""}
      canAccessStudio={studio}
      canReviewSubmissions={reviewAccess}
      breadcrumb={`Неделя ${mod.weekNumber} · ${mod.title}`}
    >
      <div className="flex flex-col gap-10">
        {course ? (
          <>
            <div className="overflow-hidden rounded-[28px]">
              <ModuleHero
                mode="workspace"
                number={course.summary.number}
                eyebrow={`Неделя ${mod.weekNumber} · ${course.summary.eyebrow}`}
                title={course.summary.title}
                dek={course.summary.dek}
                result={course.summary.result}
                guidedMinutes={course.summary.guidedMinutes}
                practiceMinutes={course.summary.practiceMinutes}
                overviewHref="/modules"
                overviewLabel="← Программа потока"
                prevHref={prevWeek?.isOpen ? `/modules/${prevWeek.id}` : null}
                nextHref={nextOpenHref}
              />
            </div>

            {videoUrl && <video controls className="w-full rounded-lg" src={videoUrl} />}

            <section aria-label="Урок">
              {course.prototype ? (
                <PrototypeModuleFlow module={course.prototype} workspace={flowLinks} />
              ) : (
                <DemoCourseFlow workspace={flowLinks} />
              )}
            </section>

            {course.homework && (
              <div className="overflow-hidden rounded-[28px]">
                <HomeworkAssignmentSection assignment={course.homework} />
              </div>
            )}
          </>
        ) : (
          <div className="mx-auto w-full max-w-[820px]">
            <span className="text-sm text-graphite-muted">Неделя {mod.weekNumber}</span>
            <h1 className="text-2xl font-semibold">{mod.title}</h1>
            {videoUrl && <video controls className="mt-6 w-full rounded-lg" src={videoUrl} />}
          </div>
        )}

        <div className="mx-auto flex w-full max-w-[820px] flex-col gap-8">
          {hasAuthorNotes && (
            <section className="flex flex-col gap-4">
              {course && <h2 className="text-lg font-semibold">Заметки автора к неделе</h2>}
              {mod.notesMd.trim() && (
                <div className={PROSE}>
                  <ReactMarkdown>{mod.notesMd}</ReactMarkdown>
                </div>
              )}
              {mod.assignmentMd.trim() && (
                <div className={PROSE}>
                  {!course && <h2>Задание</h2>}
                  <ReactMarkdown>{mod.assignmentMd}</ReactMarkdown>
                </div>
              )}
            </section>
          )}

          <section className="flex flex-col gap-3 rounded-2xl border border-hairline bg-white/50 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Сдача домашней работы</h2>
              {submission && <SubmissionStatusBadge status={submission.status} />}
            </div>
            <p className="text-sm text-graphite-muted">
              Приложи ссылку на репозиторий или PR и заполни разбор решения. Каждая отправка сохраняется
              отдельной версией — предыдущие и фидбек к ним не пропадут.
            </p>

            {submission && submission.feedback.length > 0 && (
              <div className="flex flex-col gap-3 rounded-lg border border-accent-change/30 bg-accent-change/[0.04] p-4 text-sm">
                <span className="font-medium">Фидбек по сдаче</span>
                {submission.feedback.map((f) => {
                  const scores = (f.scores as number[] | null) ?? null;
                  return (
                    <div key={f.id}>
                      <div className="text-xs text-graphite-muted">
                        {displayName(f.author, "Автор")} · {f.createdAt.toLocaleString("ru-RU")}
                      </div>
                      {f.content && <p className="whitespace-pre-wrap">{f.content}</p>}
                      {scores && (
                        <div className="mt-2 rounded border border-accent-change/20 bg-white/50 p-2 text-xs">
                          <div className="mb-1 font-medium text-graphite">
                            Балл: {sumScores(scores)} из {totalMaxScore(HOMEWORK_SCORING)}{" "}
                            <span className="text-graphite-muted">
                              (проходной — {HOMEWORK_PASS_SCORE}
                              {sumScores(scores) >= HOMEWORK_PASS_SCORE ? ", пройдено ✓" : ""})
                            </span>
                          </div>
                          <ul className="flex flex-col gap-0.5 text-graphite-muted">
                            {HOMEWORK_SCORING.map((c, i) => (
                              <li key={c.label}>
                                {c.label}: {scores[i]} / {c.points}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <SubmissionForm
              moduleId={mod.id}
              initial={initialBreakdown}
              conditionsChangedMd={mod.conditionsChangedMd}
              initialPublished={submission?.publishedToCohort ?? false}
            />

            {olderVersions.length > 0 && (
              <details className="text-sm text-graphite-muted">
                <summary className="cursor-pointer">Предыдущие версии ({olderVersions.length})</summary>
                <ul className="mt-2 flex flex-col gap-3">
                  {olderVersions.map((v) => (
                    <li key={v.id} className="rounded-lg border border-hairline p-3">
                      <div className="mb-1 text-xs text-graphite-muted">{v.createdAt.toLocaleString("ru-RU")}</div>
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
              <FeedbackForm formId={feedbackForm.id} questions={questions} initialAnswers={initialAnswers} />
            </section>
          )}

          <section className="flex flex-col gap-3 border-t border-hairline pt-6">
            <h2 className="text-lg font-semibold">Обсуждение недели</h2>
            <CommentThread
              moduleId={mod.id}
              comments={comments.map((c) => ({
                id: c.id,
                content: c.content,
                createdAt: c.createdAt,
                author: displayName(c.user),
              }))}
            />
          </section>
        </div>
      </div>
    </WorkspaceShell>
  );
}
