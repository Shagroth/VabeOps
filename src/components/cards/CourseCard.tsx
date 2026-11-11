import Link from "next/link";
import { CoverArt } from "@/components/covers/CoverArt";
import { StatusChip } from "@/components/StatusChip";
import type { MiniCourse } from "@/content/courses";

export function CourseCard({ course }: { course: MiniCourse }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="cover-group card-hover flex flex-col overflow-hidden rounded-2xl border border-hairline bg-white/60"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <CoverArt variant={course.cover} tone="paper" className="cover-scale block h-full w-full" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wide text-graphite-muted">
            {course.format}
          </span>
          <StatusChip tone={course.status === "preview" ? "preview" : "in_preparation"} />
        </div>
        <h3 className="text-lg font-medium leading-snug">{course.title}</h3>
        <p className="text-sm text-graphite-muted">{course.summary}</p>
        <span className="mt-auto pt-2 text-xs text-graphite-muted">{course.level}</span>
      </div>
    </Link>
  );
}
