import type { MetadataRoute } from "next";
import { PUBLIC_ROUTES } from "@/constants/routes";
import { absoluteUrl, meditationPath } from "@/lib/seo";
import { createMeditationService } from "@/services/meditation";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const meditations = await createMeditationService().listPublished(500);
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl(PUBLIC_ROUTES.home),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
      images: [absoluteUrl("/logo.png")],
    },
    {
      url: absoluteUrl(PUBLIC_ROUTES.meditations),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: absoluteUrl(PUBLIC_ROUTES.archive),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl(PUBLIC_ROUTES.about),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  const meditationEntries: MetadataRoute.Sitemap = meditations.map((m) => ({
    url: absoluteUrl(meditationPath(m.slug)),
    lastModified: m.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
    images: [absoluteUrl(`${meditationPath(m.slug)}/opengraph-image`)],
  }));

  return [...staticEntries, ...meditationEntries];
}
