import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { WorkspaceShell } from "@/components/WorkspaceShell";
import { SubmissionStatusBadge } from "@/components/SubmissionStatusBadge";

export default async function ModulesPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const isAdmin = session.user.role === "ADMIN";

  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: session.user.id },
    include: {
      cohort: {
        include: { modules: { orderBy: { weekNumber: "asc" } } },
      },
    },
  });

  if (!enrollment) {
    return (
      <WorkspaceShell active="program" email={session.user.email ?? ""} isAdmin={isAdmin}>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 rounded-2xl border border-hairline bg-white/40 px-6 py-16 text-center">
          <h1 className="text-xl font-semibold">Пока нет активной когорты</h1>
          <p className="max-w-[48ch] text-graphite-muted">
            Программа появится здесь, как только тебя зачислят в когорту.
          </p>
        </div>
      </WorkspaceShell>
    );
  }

  const submissions = await prisma.submission.findMany({
    where: {
      userId: session.user.id,
      moduleId: { in: enrollment.cohort.modules.map((m) => m.id) },
    },
    select: { moduleId: true, status: true },
  });
  const statusByModule = new Map(submissions.map((s) => [s.moduleId, s.status]));

  return (
    <WorkspaceShell
      active="program"
      email={session.user.email ?? ""}
      isAdmin={isAdmin}
      breadcrumb={enrollment.cohort.name}
    >
      <div className="mx-auto flex max-w-[860px] flex-col gap-6">
        <h1 className="text-2xl font-semibold">{enrollment.cohort.name}</h1>
        <ul className="flex flex-col gap-2">
          {enrollment.cohort.modules.map((m) =>
            m.isOpen ? (
              <li key={m.id}>
                <Link
                  href={`/modules/${m.id}`}
                  className="flex items-center justify-between rounded-xl border border-hairline bg-white/50 p-4 transition-colors duration-150 hover:bg-white"
                >
                  <div>
                    <span className="text-sm text-graphite-muted">Неделя {m.weekNumber}</span>
                    <div className="font-medium">{m.title}</div>
                  </div>
                  {statusByModule.has(m.id) && (
                    <SubmissionStatusBadge status={statusByModule.get(m.id)!} />
                  )}
                </Link>
              </li>
            ) : (
              <li key={m.id} className="rounded-xl border border-hairline bg-white/20 p-4 opacity-60">
                <span className="text-sm text-graphite-muted">Неделя {m.weekNumber}</span>
                <div className="font-medium">{m.title}</div>
                <div className="text-xs text-graphite-muted">Скоро откроется</div>
              </li>
            )
          )}
        </ul>
      </div>
    </WorkspaceShell>
  );
}
