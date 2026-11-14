import Link from "next/link";
import type { ReactNode } from "react";
import { KiteGripMark } from "@/components/brand/KiteGripMark";
import { CourseCard } from "@/components/cards/CourseCard";
import { SubmissionStatusBadge } from "@/components/SubmissionStatusBadge";
import type { MiniCourse } from "@/content/courses";
import type { NextStep } from "@/lib/next-step";

/**
 * Presentational pieces of the participant workspace overview and program
 * pages. They take plain data, so the dev-only /preview pages render the
 * same UI from fixtures without a database.
 */

export type WeekRow = {
  id: string;
  weekNumber: number;
  title: string;
  isOpen: boolean;
  /** Submission status of the current participant, if they have submitted. */
  status?: string | null;
};

export type CourseAccess = {
  /** Cohort id: one card per cohort the participant is enrolled in. */
  id: string;
  courseTitle: string;
  cohortName: string;
  weeks: WeekRow[];
};

const LABEL = "font-mono text-[13px] uppercase tracking-[0.08em] text-graphite-muted";
const PILL = "kg-btn inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 font-semibold";

function Arrow() {
  return (
    <span aria-hidden="true" className="kg-arrow">
      →
    </span>
  );
}

export function DashboardHeader({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
    <header>
      <span className={LABEL}>{eyebrow}</span>
      <h1 className="mt-3 text-[clamp(32px,4vw,48px)] font-extrabold leading-none tracking-[-0.035em]">{title}</h1>
      {lead && <p className="mt-4 max-w-[38em] text-[17px] leading-relaxed text-graphite-soft">{lead}</p>}
    </header>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: { href: string; label: string } }) {
  return (
    <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
      <h2 className="text-[26px] font-extrabold leading-none tracking-[-0.03em]">{children}</h2>
      {action && (
        <Link href={action.href} className="kg-link text-[15px] font-semibold">
          {action.label} <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
}

/** The one thing to do next, as a Sky call to action. */
export function NextStepCard({ step }: { step: NextStep }) {
  if (step.kind === "no-open-weeks") {
    return (
      <div className="rounded-[28px] border border-hairline bg-white p-7">
        <span className={LABEL}>Следующий шаг</span>
        <p className="mt-3 text-[22px] font-bold leading-snug tracking-[-0.015em]">Курс скоро стартует, открытых недель пока нет.</p>
        <p className="mt-2 text-graphite-soft">Программа ниже уже видна. Как только автор откроет первую неделю, она появится здесь.</p>
      </div>
    );
  }

  if (step.kind === "all-done") {
    return (
      <div className="rounded-[28px] bg-sky-tint p-7">
        <span className="font-mono text-[13px] uppercase tracking-[0.08em] text-sky-deep">Всё сдано</span>
        <p className="mt-3 text-[22px] font-bold leading-snug tracking-[-0.015em]">Все открытые недели сданы.</p>
        <p className="mt-2 text-graphite-soft">
          {step.nextClosedWeek
            ? `Следующей откроется неделя ${step.nextClosedWeek.weekNumber} · ${step.nextClosedWeek.title}.`
            : "Это была последняя неделя программы — до встречи на финальном созвоне."}
        </p>
      </div>
    );
  }

  const revision = step.kind === "revision";
  return (
    <Link
      href={`/modules/${step.week.id}${revision ? "#submission" : ""}`}
      className="kg-btn kg-card relative block overflow-hidden rounded-[28px] bg-signal p-7 text-white sm:p-9"
    >
      <KiteGripMark variant="favicon" tone="sky" className="kg-card-kite pointer-events-none absolute -bottom-10 right-4 h-44 w-auto opacity-15" />
      <span className="relative font-mono text-[13px] uppercase tracking-[0.08em] text-sky-soft">
        {revision ? "Следующий шаг · доработка" : "Следующий шаг"}
      </span>
      <p className="relative mt-3 max-w-[20em] text-[clamp(24px,3vw,34px)] font-extrabold leading-[1.05] tracking-[-0.03em]">
        Неделя {step.week.weekNumber} · {step.week.title}
      </p>
      <p className="relative mt-3 max-w-[34em] text-[#e8eeff]">
        {revision
          ? "Автор прокомментировал твою сдачу. Посмотри и пришли новую версию, когда будет время."
          : "Неделя открыта: урок, лаборатория и домашняя работа. Продолжай в своём темпе."}
      </p>
      <span className="relative mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 font-semibold text-ink">
        {revision ? "Открыть сдачу" : "Продолжить"} <Arrow />
      </span>
    </Link>
  );
}

/** One course the participant has access to: its weeks hang on the line. */
export function CourseProgramCard({ course }: { course: CourseAccess }) {
  const total = course.weeks.length;
  const accepted = course.weeks.filter((w) => w.status === "ACCEPTED").length;
  const open = course.weeks.filter((w) => w.isOpen).length;

  return (
    <article className="overflow-hidden rounded-[28px] border border-hairline bg-white">
      <div className="flex flex-wrap items-end justify-between gap-5 p-7 sm:p-9">
        <div>
          <span className={LABEL}>Поток «{course.cohortName}»</span>
          <h3 className="mt-3 text-[clamp(28px,3.4vw,40px)] font-extrabold leading-none tracking-[-0.035em]">{course.courseTitle}</h3>
        </div>
        {total > 0 && (
          <dl className="flex gap-8 font-mono text-[13px] text-graphite-muted">
            <div>
              <dt>открыто</dt>
              <dd className="mt-1 font-sans text-[26px] font-extrabold leading-none tracking-[-0.03em] text-graphite">
                {open} / {total}
              </dd>
            </div>
            <div>
              <dt>принято</dt>
              <dd className="mt-1 font-sans text-[26px] font-extrabold leading-none tracking-[-0.03em] text-graphite">
                {accepted} / {total}
              </dd>
            </div>
          </dl>
        )}
      </div>

      {total === 0 ? (
        <p className="border-t border-hairline p-7 text-graphite-soft sm:px-9">
          Недели этого потока ещё не созданы. Автор добавит программу перед стартом.
        </p>
      ) : (
        <ol className="border-t-[1.5px] border-graphite">
          {course.weeks.map((week) => {
            const row = (
              <>
                <span className="font-mono text-[15px] text-string">0{week.weekNumber}</span>
                <span className="min-w-0">
                  <span className="kg-row-title block text-lg font-bold leading-snug tracking-[-0.01em]">{week.title}</span>
                  <span className="block text-[15px] text-graphite-muted">Неделя {week.weekNumber}</span>
                </span>
                <span className="col-start-2 flex items-center gap-3 justify-self-start sm:col-start-3 sm:row-start-1 sm:justify-self-end">
                  {!week.isOpen ? (
                    <span className="rounded-full bg-paper-deep px-3 py-1 font-mono text-xs text-graphite-muted">скоро откроется</span>
                  ) : week.status ? (
                    <SubmissionStatusBadge status={week.status} />
                  ) : (
                    <span className="rounded-full border border-hairline-strong px-3 py-1 font-mono text-xs text-graphite-muted">не начата</span>
                  )}
                  {week.isOpen && <Arrow />}
                </span>
              </>
            );
            const layout = "grid min-h-[72px] grid-cols-[36px_minmax(0,1fr)] items-center gap-x-3 gap-y-2 px-7 py-4 sm:grid-cols-[36px_minmax(0,1fr)_auto] sm:px-9";
            return (
              <li key={week.id} className="border-b border-hairline last:border-b-0">
                {week.isOpen ? (
                  <Link href={`/modules/${week.id}`} className={`kg-row kg-card-row ${layout} transition-colors duration-200 hover:bg-paper`}>
                    {row}
                  </Link>
                ) : (
                  <div className={`${layout} text-graphite-muted`}>{row}</div>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </article>
  );
}

/** Shown to a signed-in person who is not in any cohort yet. */
export function NoCohortCard({ isAdmin }: { isAdmin: boolean }) {
  return (
    <div className="grid gap-8 rounded-[28px] bg-sky-tint p-7 sm:p-9 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
      <div>
        <span className="font-mono text-[13px] uppercase tracking-[0.08em] text-sky-deep">KiteGrip for Engineers · пилот</span>
        <h2 className="mt-3 text-[clamp(26px,3vw,36px)] font-extrabold leading-[1.05] tracking-[-0.03em]">В поток пилота тебя пока не добавили</h2>
        <p className="mt-4 max-w-[36em] leading-relaxed text-graphite-soft">
          Аккаунт подтверждён. Скорее всего, зачисление ещё идёт: автор добавляет участников вручную, когда прочитает
          заявку. А пока открыты первые два модуля курса и бесплатные мини-курсы.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <Link href="/demo-course/1" className={`${PILL} bg-signal text-signal-ink hover:bg-sky-deep`}>
          Пройти модуль 1 <Arrow />
        </Link>
        <Link href="/demo-course" className={`${PILL} border-[1.5px] border-graphite hover:bg-ink hover:text-ink-foreground`}>
          Вся программа курса
        </Link>
        {isAdmin && (
          <Link href="/admin" className={`${PILL} bg-ink text-ink-foreground hover:bg-signal`}>
            Управлять пилотом
          </Link>
        )}
      </div>
    </div>
  );
}

/** Free mini-courses are open to every signed-in person, enrolled or not. */
export function MiniCoursesSection({ courses }: { courses: MiniCourse[] }) {
  return (
    <section>
      <SectionTitle action={{ href: "/courses", label: "Все мини-курсы" }}>Бесплатные мини-курсы</SectionTitle>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
    </section>
  );
}

export function LiveSessionCard({ label, when, link }: { label: string; when: string; link: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] bg-ink p-6 text-ink-foreground sm:px-8">
      <div>
        <span className="font-mono text-[13px] uppercase tracking-[0.08em] text-system">Ближайший созвон</span>
        <p className="mt-2 text-[22px] font-bold leading-snug tracking-[-0.015em]">
          {label} · {when}
        </p>
      </div>
      <a href={link} className="kg-btn inline-flex min-h-12 items-center gap-2 rounded-full bg-paper px-6 font-semibold text-ink hover:bg-signal hover:text-signal-ink">
        Присоединиться <Arrow />
      </a>
    </div>
  );
}

export function NoticeLink({ href, title, children }: { href: string; title: string; children: ReactNode }) {
  return (
    <Link href={href} className="kg-btn flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-hairline-strong bg-white p-6 hover:border-graphite">
      <span className="max-w-[44em]">
        <span className="font-bold">{title}</span> <span className="text-graphite-soft">{children}</span>
      </span>
      <Arrow />
    </Link>
  );
}

export function JournalTeaser({ href, title, dek }: { href: string; title: string; dek: string }) {
  return (
    <Link href={href} className="card-hover block rounded-[24px] border border-hairline bg-white p-6">
      <span className="font-mono text-[13px] uppercase tracking-[0.08em] text-copper">Из журнала</span>
      <p className="mt-3 text-[20px] font-bold leading-snug tracking-[-0.015em]">{title}</p>
      <p className="mt-2 text-[15px] leading-relaxed text-graphite-soft">{dek}</p>
    </Link>
  );
}

export type OverviewData = {
  courses: CourseAccess[];
  nextStep: NextStep | null;
  needsName: boolean;
  nextSession: { label: string; when: string; link: string } | null;
  miniCourses: MiniCourse[];
  journal: { href: string; title: string; dek: string };
  isAdmin: boolean;
};

/** The whole overview page body, for a participant with or without a cohort. */
export function WorkspaceOverview({ data }: { data: OverviewData }) {
  const enrolled = data.courses.length > 0;
  return (
    <div className="mx-auto flex max-w-[1080px] flex-col gap-12 text-[17px]">
      <DashboardHeader
        eyebrow="Личный кабинет"
        title={enrolled ? "Твои курсы и прогресс" : "Добро пожаловать в KiteGrip"}
        lead={enrolled ? undefined : "Здесь появятся твои курсы, домашние работы и разборы от автора."}
      />

      {enrolled && data.needsName && (
        <NoticeLink href="/stream" title="Представься группе.">
          Напиши в «Потоке» имя и пару строк о себе, чтобы остальные знали, кто ты. Email они не увидят.
        </NoticeLink>
      )}

      {enrolled && data.nextStep && <NextStepCard step={data.nextStep} />}
      {!enrolled && <NoCohortCard isAdmin={data.isAdmin} />}

      {enrolled && (
        <section>
          <SectionTitle>Мои курсы</SectionTitle>
          <div className="flex flex-col gap-6">
            {data.courses.map((course) => (
              <CourseProgramCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      )}

      {data.nextSession && <LiveSessionCard {...data.nextSession} />}

      <MiniCoursesSection courses={data.miniCourses} />

      <section className="grid gap-5 lg:grid-cols-2">
        <JournalTeaser {...data.journal} />
        <div className="rounded-[24px] border border-hairline bg-white p-6">
          <span className={LABEL}>{enrolled ? "Поток" : "Мероприятия"}</span>
          <p className="mt-3 text-[20px] font-bold leading-snug tracking-[-0.015em]">
            {enrolled ? "Созвоны и обсуждения потока" : "Разборы и открытые обсуждения"}
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-graphite-soft">
            {enrolled
              ? "Расписание созвонов, участники группы и общий разговор по текущей неделе."
              : "Даты ещё уточняются. Анонсы появляются на странице мероприятий."}
          </p>
          <Link href={enrolled ? "/stream" : "/events"} className="kg-link mt-4 inline-flex min-h-11 items-center text-[15px] font-semibold">
            {enrolled ? "Открыть поток" : "Все мероприятия"} <span aria-hidden="true" className="ml-1">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
