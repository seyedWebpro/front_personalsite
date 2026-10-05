import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";

export default function robots(): MetadataRoute.Robots {
  const localeDisallow = routing.locales.flatMap((locale) => [
    `/${locale}/admin`,
    `/${locale}/admin/`,
    `/${locale}/auth`,
    `/${locale}/auth/`,
  ]);

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/auth", "/auth/", ...localeDisallow],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
