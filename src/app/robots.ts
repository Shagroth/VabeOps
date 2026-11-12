import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vabeops.example.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/",
        "/studio",
        "/studio/",
        "/modules",
        "/modules/",
        "/stream",
        "/auth/",
        "/api/",
        "/preview",
        "/preview/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
