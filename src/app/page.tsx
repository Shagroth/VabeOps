import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";

const TYPE_LABEL: Record<string, string> = {
  KICKOFF: "Кикофф",
  MIDPOINT: "Мидпоинт",
  FINAL: "Финал",
};

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    return (
      <main className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
        <h1 className="text-2xl font-semibold">Vibe Ops</h1>
        <p className="text-black/60 dark:text-white/60">
          Когортный курс для инженеров про агентность, MCP и гибкость мышления.
        </p>
        <form
          action={async (formData) => {
            "use server";
            await signIn("resend", { email: formData.get("email") });
          }}
          className="flex w-full gap-2"
        >
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            className="flex-1 rounded-lg border border-black/15 p-2 dark:border-white/20 dark:bg-transparent"
          />
          <button
            type="submit"
            className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background"
          >
            Войти
          </button>
        </form>
      </main>
    );
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: session.user.id },
    include: { cohort: { include: { liveSessions: { orderBy: { scheduledAt: "asc" } } } } },
  });

  return (
    <main className="mx-auto flex max-w-2xl flex-1 flex-col gap-8 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Vibe Ops</h1>
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button type="submit" className="text-sm underline">
            Выйти
          </button>
        </form>
      </div>

      <div className="flex gap-4">
        <Link href="/modules" className="rounded-lg border border-black/15 px-4 py-2 text-sm dark:border-white/20">
          Модули курса
        </Link>
        {session.user.role === "ADMIN" && (
          <Link href="/admin" className="rounded-lg border border-black/15 px-4 py-2 text-sm dark:border-white/20">
            Admin
          </Link>
        )}
      </div>

      {enrollment && enrollment.cohort.liveSessions.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Живые созвоны</h2>
          <ul className="flex flex-col gap-2">
            {enrollment.cohort.liveSessions.map((ls) => (
              <li
                key={ls.id}
                className="flex items-center justify-between rounded-lg border border-black/10 p-3 text-sm dark:border-white/15"
              >
                <span>
                  {TYPE_LABEL[ls.type]} — {ls.scheduledAt.toLocaleString("ru-RU")}
                </span>
                <a href={ls.link} className="underline">
                  Присоединиться
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
