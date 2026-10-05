import type { MetadataRoute } from "next";
import { DEFAULT_CONTENT } from "@/lib/defaultContent";
import { slugify } from "@/lib/slugs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://eco-clean-expert.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const services = DEFAULT_CONTENT.services
    .filter((s) => s.active)
    .map((s) => ({
      url: `${SITE_URL}/services/${slugify(s.title)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...services,
    { url: `${SITE_URL}/mentions-legales`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/politique-confidentialite`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
