import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { WorkspaceShell } from "@/components/WorkspaceShell";
import { setApplicationStatus } from "../actions";
import Link from "next/link";
import { getCourse } from "@/content/course-catalog";
import { acceptProblemMessage } from "@/lib/application-accept";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Новая",
  ACCEPTED: "Принята",
  REJECTED: "Отклонена",
};

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ problem?: string; application?: string }>;
}) {
  const session = await requireAdmin();
  const { problem, application: problemApplicationId } = await searchParams;

  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
  });

  const cohorts = await prisma.cohort.findMany({
    orderBy: { startDate: "desc" },
    select: { id: true, name: true, course: true },
  });

  // Access is per course: "email|course" for everyone enrolled in a cohort of it.
  const enrollments = await prisma.enrollment.findMany({
    where: { user: { email: { in: applications.map((a) => a.email) } } },
    select: { user: { select: { email: true } }, cohort: { select: { course: true } } },
  });
  const hasAccess = new Set(enrollments.map((e) => `${e.user.email}|${e.cohort.course}`));

  return (
    <WorkspaceShell active="admin" email={session.user.email ?? ""} canAccessStudio canReviewSubmissions>
    <div className="mx-auto max-w-[860px]">
      <h1 className="mb-6 text-2xl font-semibold">Заявки</h1>
      <ul className="flex flex-col gap-4">
        {applications.map((a) => {
          const accept = setApplicationStatus.bind(null, a.id, "ACCEPTED");
          const reject = setApplicationStatus.bind(null, a.id, "REJECTED");
          const courseTitle = getCourse(a.course).title;
          const courseCohorts = cohorts.filter((c) => c.course === a.course);
          const enrolled = hasAccess.has(`${a.email}|${a.course}`);
          const message =
            problem && problemApplicationId === a.id
              ? acceptProblemMessage(problem, courseTitle)
              : null;
          const acceptFields =
            courseCohorts.length === 0 ? (
              <p className="text-sm text-amber-700">
                Нет потока курса «{courseTitle}».{" "}
                <Link href="/admin" className="underline">
                  Создай поток
                </Link>{" "}
                — после этого здесь появится кнопка.
              </p>
            ) : (
              <>
                <select
                  name="level"
                  required
                  defaultValue=""
                  className="rounded border border-black/15 px-2 py-1 text-sm"
                >
                  <option value="" disabled>
                    Уровень…
                  </option>
                  <option value="NOVICE">Новичок</option>
                  <option value="STRONG">Уверенный</option>
                </select>
                <select
                  name="cohortId"
                  aria-label="Поток"
                  defaultValue={courseCohorts[0].id}
                  className="rounded border border-black/15 px-2 py-1 text-sm"
                >
                  {courseCohorts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </>
            );
          return (
            <li key={a.id} className="rounded-lg border border-black/10 p-4">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <span className="font-medium">{a.name}</span>{" "}
                  <span className="text-sm text-black/50">{a.email}</span>{" "}
                  <span className="rounded bg-black/5 px-1.5 py-0.5 text-xs">{courseTitle}</span>
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
              {message && (
                <p role="alert" className="mb-3 rounded border border-amber-600/40 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  {message}
                </p>
              )}
              {a.status === "PENDING" && (
                <div className="flex flex-wrap items-center gap-2">
                  <form action={accept} className="flex flex-wrap items-center gap-2">
                    {acceptFields}
                    {courseCohorts.length > 0 && (
                      <button
                        type="submit"
                        className="rounded border border-black/15 px-3 py-1 text-sm"
                      >
                        Принять
                      </button>
                    )}
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
              {a.status === "ACCEPTED" && enrolled && (
                <p className="text-xs text-black/50">
                  Принят(а) — аккаунт и доступ к когорте созданы, письмо со ссылкой на вход
                  отправлено.
                </p>
              )}
              {a.status === "ACCEPTED" && !enrolled && (
                <div className="flex flex-wrap items-center gap-2">
                  <form action={accept} className="flex flex-wrap items-center gap-2">
                    {acceptFields}
                    {courseCohorts.length > 0 && (
                      <button
                        type="submit"
                        className="rounded border border-amber-600/40 px-3 py-1 text-sm text-amber-700"
                      >
                        Выдать доступ
                      </button>
                    )}
                  </form>
                  <p className="text-xs text-black/50">
                    Принят(а) раньше, но без аккаунта/когорты/письма — выбери уровень и выдай
                    доступ.
                  </p>
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
