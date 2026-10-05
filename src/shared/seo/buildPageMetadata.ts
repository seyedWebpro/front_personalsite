import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import {
  routing,
  toOpenGraphLocale,
  type AppLocale,
  isAppLocale,
} from "@/i18n/routing";

export type BuildPageMetadataInput = {
  title: string;
  description: string;
  /** Locale-unprefixed path, e.g. `/projects` or `/` */
  path: string;
  locale?: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
};

function normalizePath(path: string): string {
  if (!path || path === "/") return "/";
  return path.startsWith("/") ? path.replace(/\/$/, "") || "/" : `/${path.replace(/\/$/, "")}`;
}

export function localizedPath(path: string, locale: string): string {
  const normalized = normalizePath(path);
  if (normalized === "/") return `/${locale}`;
  return `/${locale}${normalized}`;
}

export function absoluteUrl(path = "/", locale?: string): string {
  if (locale && isAppLocale(locale)) {
    const localized = localizedPath(path, locale);
    return `${siteConfig.url}${localized}`;
  }
  const normalized = normalizePath(path);
  return normalized === "/" ? siteConfig.url : `${siteConfig.url}${normalized}`;
}

function resolveOgImageUrl(image?: string): string {
  const raw = (image ?? "").trim();
  const fallback = absoluteUrl(siteConfig.defaultOgImage);

  if (!raw) return fallback;
  if (/^https?:\/\//i.test(raw)) return raw;

  if (raw.startsWith("/api/files/")) {
    return `${siteConfig.apiOrigin}${raw}`;
  }

  return absoluteUrl(raw);
}

export function buildPageMetadata({
  title,
  description,
  path,
  locale = routing.defaultLocale,
  image,
  type = "website",
  noIndex = false,
  publishedTime,
  modifiedTime,
}: BuildPageMetadataInput): Metadata {
  const lang: AppLocale = isAppLocale(locale) ? locale : routing.defaultLocale;
  const canonicalPath = localizedPath(path, lang);
  const url = `${siteConfig.url}${canonicalPath}`;
  const ogImage = resolveOgImageUrl(image);
  const plainPath = normalizePath(path);

  const languageAlternates = Object.fromEntries(
    routing.locales.map((code) => [code, localizedPath(plainPath, code)]),
  ) as Record<string, string>;
  languageAlternates["x-default"] = localizedPath(plainPath, routing.defaultLocale);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: languageAlternates,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.shortName,
      locale: toOpenGraphLocale(lang),
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === "article"
        ? {
            ...(publishedTime ? { publishedTime } : {}),
            ...(modifiedTime ? { modifiedTime } : {}),
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
