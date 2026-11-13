import Link from "next/link";

// Public teaser body for course modules that are not part of the open demo.
// Deliberately static (no session lookup) so the page stays statically
// rendered; enrolled participants follow the workspace link instead.
export function LockedModuleNotice({
  moduleNumber,
  artifactName,
  homeworkTitle,
}: {
  moduleNumber: number;
  artifactName: string;
  homeworkTitle: string;
}) {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <div className="grid gap-6 rounded-[28px] border border-hairline bg-white/60 p-6 sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-system">
            Модуль 0{moduleNumber} · для участников пилота
          </span>
          <h2 className="mt-4 max-w-[24ch] text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
            Уроки, лаборатория и домашняя работа открываются в рабочем пространстве
          </h2>
          <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-graphite-muted">
            В открытом доступе — первые два модуля. Здесь участники собирают «{artifactName}», сдают домашнюю
            работу «{homeworkTitle}» и получают разбор от автора.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Link
            href="/modules"
            className="rounded-xl bg-ink px-5 py-3 text-center text-sm font-medium text-ink-foreground transition-transform hover:scale-[1.02]"
          >
            Я участник — открыть в рабочем пространстве →
          </Link>
          <Link
            href="/#apply"
            className="rounded-xl border border-hairline px-5 py-3 text-center text-sm font-medium transition-colors hover:bg-white"
          >
            Подать заявку на пилот
          </Link>
          <Link href="/demo-course/1" className="text-center text-xs text-graphite-muted underline underline-offset-4">
            Пройти открытые модули 1–2
          </Link>
        </div>
      </div>
    </section>
  );
}
