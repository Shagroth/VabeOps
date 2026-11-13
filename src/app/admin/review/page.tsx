import { requireRole, canAccessStudio, canReviewSubmissions } from "@/lib/require-role";
import { prisma } from "@/lib/prisma";
import { WorkspaceShell } from "@/components/WorkspaceShell";
import { SubmissionStatusBadge } from "@/components/SubmissionStatusBadge";
import { ScoreInputs } from "@/components/admin/ScoreInputs";
import { DECISION_FIELD_LABELS } from "@/lib/decision-field-labels";
import { HOMEWORK_SCORING } from "@/content/demo-course-homework";
import { reviewSubmission } from "../actions";

/**
 * Cross-cohort, cross-week review queue — everything a reviewer needs to
 * act on, in one place, instead of clicking into each week's own admin
 * page. ADMIN and MENTOR both land here (see studio-permissions.ts
 * canReviewSubmissions); reviewSubmission itself already enforces the
 * same role check server-side.
 */
export default async function ReviewQueuePage() {
  const session = await requireRole(["ADMIN", "MENTOR"]);

  const submissions = await prisma.submission.findMany({
    where: { status: "SUBMITTED" },
    orderBy: { createdAt: "asc" },
    include: {
      user: true,
      module: { include: { cohort: { select: { name: true } } } },
      versions: { orderBy: { createdAt: "desc" } },
      feedback: { include: { author: true }, orderBy: { createdAt: "asc" } },
    },
  });

  return (
    <WorkspaceShell
      active="admin"
      email={session.user.email ?? ""}
      canAccessStudio={canAccessStudio(session.user.role)}
      canReviewSubmissions={canReviewSubmissions(session.user.role)}
    >
      <div className="mx-auto flex max-w-[860px] flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold">На проверке</h1>
          <p className="text-sm text-graphite-muted">
            {submissions.length === 0
              ? "Очередь пуста — все сдачи проверены."
              : `${submissions.length} сдач(и) ждут решения, самые старые сверху.`}
          </p>
        </div>

        <ul className="flex flex-col gap-4">
          {submissions.map((s) => {
            const latest = s.versions[0];
            const accept = reviewSubmission.bind(null, s.id, "ACCEPTED");
            const requestRevision = reviewSubmission.bind(null, s.id, "NEEDS_REVISION");

            return (
              <li key={s.id} className="rounded-lg border border-hairline p-4 text-sm">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-medium">{s.user.email}</span>
                    <span className="ml-2 text-xs text-graphite-muted">
                      Неделя {s.module.weekNumber} · {s.module.title} · {s.module.cohort.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-graphite-muted">
                      Сдано {s.createdAt.toLocaleString("ru-RU")}
                    </span>
                    <SubmissionStatusBadge status={s.status} />
                  </div>
                </div>

                {latest && (
                  <div className="mb-3 flex flex-col gap-1">
                    <p className="whitespace-pre-wrap">{latest.content}</p>
                    {Object.entries(DECISION_FIELD_LABELS).map(([key, label]) => {
                      const value = (latest as unknown as Record<string, string | null>)[key];
                      return value ? (
                        <p key={key}>
                          <span className="text-graphite-muted">{label}: </span>
                          {value}
                        </p>
                      ) : null;
                    })}
                  </div>
                )}

                {s.feedback.length > 0 && (
                  <div className="mb-3 flex flex-col gap-1 rounded bg-black/5 p-2 text-xs">
                    {s.feedback.map((f) => (
                      <p key={f.id}>
                        <span className="text-graphite-muted">{f.author.email}: </span>
                        {f.content}
                      </p>
                    ))}
                  </div>
                )}

                {s.versions.length > 1 && (
                  <details className="mb-3 text-xs text-graphite-muted">
                    <summary className="cursor-pointer">
                      Предыдущие версии ({s.versions.length - 1})
                    </summary>
                  </details>
                )}

                <form
                  action={async (fd) => {
                    "use server";
                    const comment = String(fd.get("comment") || "");
                    const scoresRaw = Object.fromEntries(
                      HOMEWORK_SCORING.map((_, i) => [String(i), String(fd.get(`score-${i}`) || "")])
                    );
                    const action = fd.get("intent") === "accept" ? accept : requestRevision;
                    await action(comment, scoresRaw);
                  }}
                  className="flex flex-col gap-2"
                >
                  <textarea
                    name="comment"
                    placeholder="Комментарий (опционально)"
                    rows={2}
                    className="rounded border border-hairline p-2 text-sm"
                  />
                  <ScoreInputs />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      name="intent"
                      value="accept"
                      className="rounded bg-ink px-3 py-1 text-sm text-ink-foreground transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
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
      </div>
    </WorkspaceShell>
  );
}
