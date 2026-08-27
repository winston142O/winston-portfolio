import type { MetadataRoute } from "next";
import { siteUrl } from "@/site";
import { routing } from "@/i18n/routing";


export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${siteUrl}/${l}`]),
      ),
    },
  }));
}
