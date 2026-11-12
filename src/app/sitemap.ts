import type { MetadataRoute } from "next";
import { MINI_COURSES } from "@/content/courses";
import { EVENTS } from "@/content/events";
import { RECORDINGS } from "@/content/recordings";
import { JOURNAL } from "@/content/journal";
import { getPublishedSignals } from "@/content/signals";
import { EPISODE_1 } from "@/content/comics";
import { AUTHORS } from "@/content/authors";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vabeops.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/courses",
    "/demo-course",
    "/journal",
    "/signals",
    "/comics",
    "/events",
    "/authors",
    "/apply",
  ];

  const dynamic = [
    ...MINI_COURSES.map((c) => `/courses/${c.slug}`),
    ...EVENTS.map((e) => `/events/${e.slug}`),
    ...RECORDINGS.map((r) => `/events/${r.slug}`),
    ...JOURNAL.map((j) => `/journal/${j.slug}`),
    ...getPublishedSignals().map((s) => `/signals/${s.slug}`),
    `/comics/${EPISODE_1.slug}`,
    ...AUTHORS.map((a) => `/authors/${a.slug}`),
  ];

  return [...staticPages, ...dynamic].map((path) => ({
    url: `${SITE_URL}${path}`,
  }));
}
