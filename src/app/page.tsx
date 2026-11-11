import Link from "next/link";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { WorkspaceNav } from "@/components/WorkspaceNav";
import { PublicLanding } from "@/components/landing/PublicLanding";

const TYPE_LABEL: Record<string, string> = {
  KICKOFF: "Кикофф",
  MIDPOINT: "Мидпоинт",
  FINAL: "Финал",
};

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    return <PublicLanding />;
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: session.user.id },
    include: {
      cohort: {
        include: {
          liveSessions: { orderBy: { scheduledAt: "asc" } },
          modules: { where: { isOpen: true }, orderBy: { weekNumber: "asc" } },
        },
      },
    },
  });

  const openModules = enrollment?.cohort.modules ?? [];
  const submittedModuleIds = enrollment
    ? new Set(
        (
          await prisma.submission.findMany({
            where: { userId: session.user.id, moduleId: { in: openModules.map((m) => m.id) } },
            select: { moduleId: true },
          })
        ).map((s) => s.moduleId)
      )
    : new Set<string>();

  const nextModule = openModules.find((m) => !submittedModuleIds.has(m.id));
  const now = new Date();
  const nextSession = enrollment?.cohort.liveSessions.find((ls) => ls.scheduledAt > now);

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

      <WorkspaceNav isAdmin={session.user.role === "ADMIN"} />

      {!enrollment ? (
        <p className="rounded-xl border border-black/10 p-5 text-sm">
          Ты пока не записан(а) ни в одну когорту. Напиши админу.
        </p>
      ) : openModules.length === 0 ? (
        <p className="rounded-xl border border-black/10 p-5 text-sm">
          Курс скоро начнётся — пока нет открытых недель.
        </p>
      ) : nextModule ? (
        <Link
          href={`/modules/${nextModule.id}`}
          className="rounded-xl border border-black/10 p-5 hover:bg-black/5"
        >
          <span className="text-xs text-black/50">Следующий шаг</span>
          <div className="mt-1 font-medium">
            Неделя {nextModule.weekNumber} · {nextModule.title}
          </div>
          <div className="text-sm text-black/60">
            Открыта, но ты ещё не сдал(а) практику — продолжить →
          </div>
        </Link>
      ) : (
        <p className="rounded-xl border border-accent-action/30 bg-accent-action/5 p-5 text-sm">
          Все открытые недели сданы. Ждём, когда откроется следующая.
        </p>
      )}

      {nextSession && (
        <section className="rounded-xl border border-black/10 p-4 text-sm">
          <span className="text-xs text-black/50">Ближайшая встреча</span>
          <div className="mt-1 flex items-center justify-between">
            <span>
              {TYPE_LABEL[nextSession.type]} — {nextSession.scheduledAt.toLocaleString("ru-RU")}
            </span>
            <a href={nextSession.link} className="underline">
              Присоединиться
            </a>
          </div>
        </section>
      )}

      {enrollment && (
        <Link href="/stream" className="text-sm underline">
          Все созвоны и обсуждения потока →
        </Link>
      )}
    </main>
  );
}
