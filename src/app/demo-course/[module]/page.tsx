import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { DemoCourseFlow } from "@/components/demo-course/DemoCourseFlow";
import { HomeworkAssignmentSection } from "@/components/demo-course/HomeworkAssignment";
import { ModuleHero } from "@/components/demo-course/ModuleHero";
import { PrototypeModuleFlow } from "@/components/demo-course/PrototypeModuleFlow";
import { getHomeworkAssignment } from "@/content/demo-course-homework";
import { MODULE_ONE_SUMMARY, PROGRAM_MODULES, getPrototypeModule } from "@/content/demo-course-program";
import { isPublicDemoModule } from "@/content/demo-access";
import { LockedModuleNotice } from "@/components/demo-course/LockedModuleNotice";

type PageProps = { params: Promise<{ module: string }> };

export function generateStaticParams() {
  return PROGRAM_MODULES.map((module) => ({ module: String(module.number) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { module: rawModule } = await params;
  const courseModule = PROGRAM_MODULES.find((item) => String(item.number) === rawModule);
  if (!courseModule) return {};
  if (!isPublicDemoModule(courseModule.number)) {
    return {
      title: courseModule.title,
      description: courseModule.dek,
      alternates: { canonical: `/demo-course/${courseModule.number}` },
      robots: { index: false, follow: true },
    };
  }
  return {
    title: courseModule.title,
    description: courseModule.dek,
    alternates: { canonical: `/demo-course/${courseModule.number}` },
    openGraph: { title: courseModule.title, description: courseModule.dek, type: "article" },
  };
}

export default async function DemoCourseModulePage({ params }: PageProps) {
  const { module: rawModule } = await params;
  const moduleNumber = Number(rawModule);
  if (!Number.isInteger(moduleNumber) || moduleNumber < 1 || moduleNumber > 5 || String(moduleNumber) !== rawModule) notFound();
  const homework = getHomeworkAssignment(moduleNumber);
  if (!homework) notFound();

  if (moduleNumber === 1) {
    return (
      <div className="flex min-h-screen flex-col bg-paper text-graphite">
        <Header />
        <main id="main-content" className="flex-1">
          <ModuleHero number={MODULE_ONE_SUMMARY.number} eyebrow={MODULE_ONE_SUMMARY.eyebrow} title={MODULE_ONE_SUMMARY.title} dek={MODULE_ONE_SUMMARY.dek} result={MODULE_ONE_SUMMARY.result} guidedMinutes={MODULE_ONE_SUMMARY.guidedMinutes} practiceMinutes={MODULE_ONE_SUMMARY.practiceMinutes} />
          <section className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-10 lg:py-12"><DemoCourseFlow /></section>
          <HomeworkAssignmentSection assignment={homework} />
        </main>
        <Footer />
      </div>
    );
  }

  const courseModule = getPrototypeModule(moduleNumber);
  if (!courseModule) notFound();

  // Modules outside the public demo set render only their summary here —
  // the lesson flow and homework brief stay server-side and are shown in
  // the cohort workspace (/modules/[id]) to enrolled participants.
  if (!isPublicDemoModule(moduleNumber)) {
    return (
      <div className="flex min-h-screen flex-col bg-paper text-graphite">
        <Header />
        <main id="main-content" className="flex-1">
          <ModuleHero mode="locked" number={courseModule.number} eyebrow={courseModule.eyebrow} title={courseModule.title} dek={courseModule.dek} result={courseModule.result} guidedMinutes={courseModule.guidedMinutes} practiceMinutes={courseModule.practiceMinutes} />
          <LockedModuleNotice moduleNumber={courseModule.number} artifactName={courseModule.artifactName} homeworkTitle={homework.title} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper text-graphite">
      <Header />
      <main id="main-content" className="flex-1">
        <ModuleHero number={courseModule.number} eyebrow={courseModule.eyebrow} title={courseModule.title} dek={courseModule.dek} result={courseModule.result} guidedMinutes={courseModule.guidedMinutes} practiceMinutes={courseModule.practiceMinutes} />
        <section className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
          <PrototypeModuleFlow module={courseModule} />
        </section>
        <HomeworkAssignmentSection assignment={homework} />
      </main>
      <Footer />
    </div>
  );
}
