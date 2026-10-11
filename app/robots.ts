import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/cms/content";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSettings();
  const base = settings.siteUrl.replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/keystatic", "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
