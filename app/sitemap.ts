import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/cms/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSettings();
  const base = settings.siteUrl.replace(/\/$/, "");
  const now = new Date();
  return [
    { url: base, lastModified: now },
    { url: `${base}/privacy`, lastModified: now },
  ];
}
