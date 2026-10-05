function resolveSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return "http://localhost:3000";
}

function resolveApiOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return "http://localhost:5095";
}

/**
 * Brand + SEO defaults. Locale-specific display names live in `src/messages/{en,fa}.json` (`site.*`).
 * Runtime lang/dir come from next-intl `[locale]` layout — do not hardcode UI language here.
 */
export const siteConfig = {
  name: "Personal Site",
  shortName: "Personal Site",
  description: "Personal programming site — projects, articles, and contact.",
  locale: "en-US",
  openGraphLocale: "en_US",
  language: "en",
  dir: "ltr" as const,
  url: resolveSiteUrl(),
  apiOrigin: resolveApiOrigin(),
  defaultOgImage: "/images/og-default.png",
} as const;
