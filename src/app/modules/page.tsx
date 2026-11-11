import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function ModulesPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

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
      <main className="mx-auto max-w-2xl p-8">
        <p>Ты пока не записан(а) ни в одну когорту. Напиши админу.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl p-8 flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">{enrollment.cohort.name}</h1>
      <ul className="flex flex-col gap-2">
        {enrollment.cohort.modules.map((m) =>
          m.isOpen ? (
            <li key={m.id}>
              <Link
                href={`/modules/${m.id}`}
                className="block rounded-lg border border-black/10 p-4 hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/5"
              >
                <span className="text-sm text-black/50 dark:text-white/50">
                  Неделя {m.weekNumber}
                </span>
                <div className="font-medium">{m.title}</div>
              </Link>
            </li>
          ) : (
            <li
              key={m.id}
              className="rounded-lg border border-black/10 p-4 opacity-50 dark:border-white/15"
            >
              <span className="text-sm text-black/50 dark:text-white/50">
                Неделя {m.weekNumber}
              </span>
              <div className="font-medium">{m.title}</div>
              <div className="text-xs text-black/40 dark:text-white/40">Скоро откроется</div>
            </li>
          )
        )}
      </ul>
    </main>
  );
}
