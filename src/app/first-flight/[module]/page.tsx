import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { HomeworkAssignmentSection } from "@/components/demo-course/HomeworkAssignment";
import { LockedModuleNotice } from "@/components/demo-course/LockedModuleNotice";
import { ModuleHero } from "@/components/demo-course/ModuleHero";
import { PrototypeModuleFlow } from "@/components/demo-course/PrototypeModuleFlow";
import { COURSES, isPublicCourseModule } from "@/content/course-catalog";

const course = COURSES.FIRST_FLIGHT;
const LAST = course.modules.length;

type PageProps = { params: Promise<{ module: string }> };

export function generateStaticParams() {
  return course.modules.map((module) => ({ module: String(module.number) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { module: rawModule } = await params;
  const summary = course.modules.find((item) => String(item.number) === rawModule);
  if (!summary) return {};
  const open = isPublicCourseModule(course, summary.number);
  return {
    title: `${summary.title} · First Flight`,
    description: summary.dek,
    alternates: { canonical: `${course.path}/${summary.number}` },
    ...(open
      ? { openGraph: { title: summary.title, description: summary.dek, type: "article" as const } }
      : { robots: { index: false, follow: true } }),
  };
}

export default async function FirstFlightModulePage({ params }: PageProps) {
  const { module: rawModule } = await params;
  const moduleNumber = Number(rawModule);
  if (!Number.isInteger(moduleNumber) || String(moduleNumber) !== rawModule) notFound();

  const content = course.getContent(moduleNumber);
  if (!content?.prototype || !content.homework) notFound();
  const { prototype, homework } = content;
  const open = isPublicCourseModule(course, moduleNumber);

  const hero = (
    <ModuleHero
      mode={open ? "public" : "locked"}
      number={prototype.number}
      eyebrow={prototype.eyebrow}
      title={prototype.title}
      dek={prototype.dek}
      result={prototype.result}
      guidedMinutes={prototype.guidedMinutes}
      practiceMinutes={prototype.practiceMinutes}
      overviewHref={course.path}
      prevHref={moduleNumber > 1 ? `${course.path}/${moduleNumber - 1}` : null}
      nextHref={moduleNumber < LAST ? `${course.path}/${moduleNumber + 1}` : null}
    />
  );

  // Modules outside the public set render only their summary here. The
  // lesson and the homework brief stay server-side and are shown in the
  // cohort workspace (/modules/[id]) to enrolled participants.
  return (
    <div className="flex min-h-screen flex-col bg-paper text-[17px] text-graphite">
      <Header />
      <main id="main-content" className="flex-1">
        {hero}
        {open ? (
          <>
            <section className="mx-auto max-w-[1280px] px-3 pb-20 sm:px-8 lg:pb-24">
              <PrototypeModuleFlow module={prototype} />
            </section>
            <HomeworkAssignmentSection
              assignment={homework}
              scoring={course.scoring}
              passScore={course.passScore}
              scoringNote={course.scoringNote}
              tasksTitle={course.tasksTitle}
            />
          </>
        ) : (
          <LockedModuleNotice
            moduleNumber={prototype.number}
            artifactName={prototype.artifactName}
            homeworkTitle={homework.title}
            openModuleHref={`${course.path}/1`}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
