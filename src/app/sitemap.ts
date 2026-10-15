import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/config";

/**
 * Single-page site — one canonical entry, still worth declaring so search
 * engines pick up freshness and the hreflang alternates.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_CONFIG.siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          en: SITE_CONFIG.siteUrl,
          ar: SITE_CONFIG.siteUrl, // same document — Arabic is client-toggled
        },
      },
    },
  ];
}
