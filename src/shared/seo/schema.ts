import { siteConfig } from "@/config/site";
import { routing, type AppLocale, isAppLocale } from "@/i18n/routing";
import en from "@/messages/en.json";
import fa from "@/messages/fa.json";

import { absoluteUrl } from "./buildPageMetadata";

const siteCopy = { en: en.site, fa: fa.site } as const;

function resolveLocale(locale?: string): AppLocale {
  return locale && isAppLocale(locale) ? locale : routing.defaultLocale;
}

export function buildPersonJsonLd(locale?: string) {
  const lang = resolveLocale(locale);
  const copy = siteCopy[lang];

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: copy.name,
    url: `${siteConfig.url}/${lang}`,
    description: copy.description,
    inLanguage: lang,
  };
}

export function buildWebSiteJsonLd(locale?: string) {
  const lang = resolveLocale(locale);
  const copy = siteCopy[lang];

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: copy.name,
    url: `${siteConfig.url}/${lang}`,
    description: copy.description,
    inLanguage: lang,
    publisher: {
      "@type": "Person",
      name: copy.name,
    },
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; path: string }[],
  locale?: string,
) {
  const lang = resolveLocale(locale);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path, lang),
    })),
  };
}
