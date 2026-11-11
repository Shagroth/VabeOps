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
      <main className="flex flex-1 flex-col">
        <section className="surface-hero flex flex-col items-center gap-6 px-8 py-20 text-center">
          <svg
            aria-hidden="true"
            viewBox="0 0 160 80"
            className="h-16 w-32 opacity-80"
            fill="none"
          >
            <path d="M10 70 L60 40" stroke="currentColor" strokeWidth="2" opacity="0.4" />
            <path d="M60 40 L140 12" stroke="var(--accent-action)" strokeWidth="2.5" />
            <path d="M60 40 L120 66" stroke="currentColor" strokeWidth="2" opacity="0.3" strokeDasharray="4 4" />
            <circle cx="60" cy="40" r="4" fill="currentColor" />
            <circle cx="140" cy="12" r="5" fill="var(--accent-action)" />
          </svg>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            Работай с AI-агентами.
            <br />
            Думай как инженер.
          </h1>
          <p className="max-w-md text-white/70">
            Когортный пилот для разработчиков, которые уже пишут код и хотят осмысленно
            встраивать агентов в реальную работу — без потери контроля над качеством и рисками.
          </p>
          <p className="text-sm text-white/50">Бесплатный пилот · 5–10 мест</p>
          <Link
            href="/apply"
            className="rounded-lg bg-accent-action px-6 py-2.5 text-sm font-medium text-white"
          >
            Подать заявку на пилот
          </Link>
        </section>

        <section className="mx-auto w-full max-w-md p-8">
          <p className="mb-2 text-xs text-black/50">Уже приглашён(а)?</p>
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
              className="flex-1 rounded-lg border border-black/15 p-2"
            />
            <button
              type="submit"
              className="rounded-lg border border-black/15 px-4 py-2 text-sm font-medium"
            >
              Войти
            </button>
          </form>
        </section>
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
