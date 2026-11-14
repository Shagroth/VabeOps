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
    <section className="mx-auto max-w-[1280px] px-5 pb-20 sm:px-8 lg:pb-24">
      <div className="grid gap-8 rounded-[28px] border border-hairline bg-white p-7 sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <span className="font-mono text-[13px] uppercase tracking-[0.08em] text-graphite-muted">
            <span className="mr-2 text-string">0{moduleNumber}</span>для участников пилота
          </span>
          <h2 className="mt-4 max-w-[22ch] text-[clamp(28px,3.2vw,40px)] font-extrabold leading-[1.05] tracking-[-0.03em]">
            Уроки, лаборатория и домашняя работа открываются в рабочем пространстве
          </h2>
          <p className="mt-5 max-w-[56ch] leading-relaxed text-graphite-soft">
            В открытом доступе — первые два модуля. Здесь участники собирают «{artifactName}», сдают домашнюю
            работу «{homeworkTitle}» и получают разбор от автора.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Link
            href="/#apply"
            className="kg-btn inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-signal px-7 text-center font-semibold text-signal-ink hover:bg-sky-deep"
          >
            Подать заявку на пилот <span aria-hidden="true" className="kg-arrow">→</span>
          </Link>
          <Link
            href="/modules"
            className="kg-btn inline-flex min-h-14 items-center justify-center rounded-full border-[1.5px] border-graphite px-7 text-center font-semibold hover:bg-ink hover:text-ink-foreground"
          >
            Я участник — открыть в рабочем пространстве
          </Link>
          <Link href="/demo-course/1" className="kg-link inline-flex min-h-11 items-center self-center text-[15px] font-semibold">
            Пройти открытые модули 1–2
          </Link>
        </div>
      </div>
    </section>
  );
}
