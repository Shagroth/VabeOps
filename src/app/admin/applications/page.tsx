import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { setApplicationStatus } from "../actions";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Новая",
  ACCEPTED: "Принята",
  REJECTED: "Отклонена",
};

export default async function ApplicationsPage() {
  await requireAdmin();

  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-2xl font-semibold">Заявки</h1>
      <ul className="flex flex-col gap-4">
        {applications.map((a) => {
          const accept = setApplicationStatus.bind(null, a.id, "ACCEPTED");
          const reject = setApplicationStatus.bind(null, a.id, "REJECTED");
          return (
            <li key={a.id} className="rounded-lg border border-black/10 p-4 dark:border-white/15">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <span className="font-medium">{a.name}</span>{" "}
                  <span className="text-sm text-black/50 dark:text-white/50">{a.email}</span>
                </div>
                <span className="text-xs text-black/50 dark:text-white/50">
                  {STATUS_LABEL[a.status]}
                </span>
              </div>
              <p className="mb-1 text-sm">
                <span className="text-black/50 dark:text-white/50">Опыт: </span>
                {a.experience}
              </p>
              <p className="mb-3 text-sm">
                <span className="text-black/50 dark:text-white/50">Цель: </span>
                {a.workGoal}
              </p>
              {a.status === "PENDING" && (
                <div className="flex gap-2">
                  <form action={accept}>
                    <button
                      type="submit"
                      className="rounded border border-black/15 px-3 py-1 text-sm dark:border-white/20"
                    >
                      Принять
                    </button>
                  </form>
                  <form action={reject}>
                    <button
                      type="submit"
                      className="rounded border border-black/15 px-3 py-1 text-sm dark:border-white/20"
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
          <p className="text-sm text-black/50 dark:text-white/50">Заявок пока нет.</p>
        )}
      </ul>
    </main>
  );
}
