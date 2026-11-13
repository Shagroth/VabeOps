import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { WorkspaceShell } from "@/components/WorkspaceShell";
import { enrollParticipant, setApplicationStatus } from "../actions";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Новая",
  ACCEPTED: "Принята",
  REJECTED: "Отклонена",
};

export default async function ApplicationsPage() {
  const session = await requireAdmin();

  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
  });
  const cohorts = await prisma.cohort.findMany({
    orderBy: { startDate: "desc" },
    select: { id: true, name: true },
  });
  const enrolledEmails = new Set(
    (
      await prisma.enrollment.findMany({ select: { user: { select: { email: true } } } })
    ).map((e) => e.user.email.toLowerCase())
  );

  return (
    <WorkspaceShell active="admin" email={session.user.email ?? ""} canAccessStudio>
    <div className="mx-auto max-w-[860px]">
      <h1 className="mb-6 text-2xl font-semibold">Заявки</h1>
      <ul className="flex flex-col gap-4">
        {applications.map((a) => {
          const accept = setApplicationStatus.bind(null, a.id, "ACCEPTED");
          const reject = setApplicationStatus.bind(null, a.id, "REJECTED");
          return (
            <li key={a.id} className="rounded-lg border border-black/10 p-4">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <span className="font-medium">{a.name}</span>{" "}
                  <span className="text-sm text-black/50">{a.email}</span>
                </div>
                <span className="text-xs text-black/50">
                  {STATUS_LABEL[a.status]}
                </span>
              </div>
              <p className="mb-1 text-sm">
                <span className="text-black/50">Опыт: </span>
                {a.experience}
              </p>
              <p className="mb-3 text-sm">
                <span className="text-black/50">Цель: </span>
                {a.workGoal}
              </p>
              {a.status === "ACCEPTED" &&
                (enrolledEmails.has(a.email.toLowerCase()) ? (
                  <p className="text-xs text-black/50">Зачислен(а) в когорту ✓</p>
                ) : cohorts.length === 0 ? (
                  <p className="text-xs text-black/50">Создай когорту в /admin, чтобы зачислить.</p>
                ) : (
                  <form action={enrollParticipant} className="flex flex-wrap gap-2 text-sm">
                    <input type="hidden" name="email" value={a.email} />
                    <input type="hidden" name="name" value={a.name} />
                    <select name="cohortId" className="rounded border border-black/15 p-1">
                      {cohorts.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <select name="level" defaultValue="NOVICE" className="rounded border border-black/15 p-1">
                      <option value="NOVICE">новичок</option>
                      <option value="STRONG">сильный</option>
                    </select>
                    <button type="submit" className="rounded border border-black/15 px-3 py-1">
                      Зачислить
                    </button>
                  </form>
                ))}
              {a.status === "PENDING" && (
                <div className="flex gap-2">
                  <form action={accept}>
                    <button
                      type="submit"
                      className="rounded border border-black/15 px-3 py-1 text-sm"
                    >
                      Принять
                    </button>
                  </form>
                  <form action={reject}>
                    <button
                      type="submit"
                      className="rounded border border-black/15 px-3 py-1 text-sm"
                    >
                      Отклонить
                    </button>
                  </form>
                </div>
              )}
            </li>
          );
        })}
        {applications.length === 0 && (
          <p className="text-sm text-black/50">Заявок пока нет.</p>
        )}
      </ul>
    </div>
    </WorkspaceShell>
  );
}
