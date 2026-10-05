import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";
import { publicSeoRoutes, localizedPath } from "@/shared/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routing.locales.flatMap((locale) =>
    publicSeoRoutes.map((route) => {
      const path = localizedPath(route.path, locale);
      const languages = Object.fromEntries(
        routing.locales.map((code) => [
          code,
          `${siteConfig.url}${localizedPath(route.path, code)}`,
        ]),
      ) as Record<string, string>;
      languages["x-default"] = `${siteConfig.url}${localizedPath(
        route.path,
        routing.defaultLocale,
      )}`;

      return {
        url: `${siteConfig.url}${path}`,
        lastModified,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: { languages },
      };
    }),
  );
}
