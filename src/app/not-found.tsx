import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { NextIntlClientProvider } from "next-intl";

import NotFoundPageView from "@/features/not-found/pages/NotFoundPageView";
import { siteConfig } from "@/config/site";
import { geistMono, geistSans } from "@/shared/fonts/geist";
import { vazirmatn } from "@/shared/fonts/vazirmatn";
import { isAppLocale, localeDirection, toBcp47, type AppLocale } from "@/i18n/routing";
import enMessages from "@/messages/en.json";
import faMessages from "@/messages/fa.json";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { ThemeScript } from "@/theme/ThemeScript";
import { parseThemePreference, ssrDarkClass, THEME_COOKIE } from "@/theme/theme";
import { cn } from "@/shared/utils/cn";

async function resolveNotFoundLocale(): Promise<AppLocale> {
  const h = await headers();
  const fromHeader =
    h.get("x-next-intl-locale") ??
    h.get("x-middleware-request-x-next-intl-locale");
  if (fromHeader && isAppLocale(fromHeader)) return fromHeader;

  const jar = await cookies();
  const fromCookie = jar.get("NEXT_LOCALE")?.value;
  if (fromCookie && isAppLocale(fromCookie)) return fromCookie;

  const referer = h.get("referer") ?? "";
  if (referer.includes("/fa/") || referer.endsWith("/fa")) return "fa";
  return "en";
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await resolveNotFoundLocale();
  const messages = locale === "fa" ? faMessages : enMessages;
  const copy = messages.notFound;
  const site = messages.site;

  return {
    title: `${copy.code} | ${copy.title}`,
    description: copy.description,
    robots: { index: false, follow: true },
    openGraph: {
      title: `${copy.code} | ${site.shortName}`,
      description: copy.description,
      locale: locale === "fa" ? "fa_IR" : "en_US",
      siteName: siteConfig.shortName,
    },
  };
}

export default async function NotFound() {
  const locale = await resolveNotFoundLocale();
  const messages = locale === "fa" ? faMessages : enMessages;
  const dir = localeDirection(locale);
  const isEnglish = locale === "en";
  const themePreference = parseThemePreference(
    (await cookies()).get(THEME_COOKIE)?.value,
  );
  const htmlClass = cn(
    isEnglish ? geistSans.variable : vazirmatn.variable,
    geistMono.variable,
    "h-full",
    ssrDarkClass(themePreference),
  );
  const bodyClass = isEnglish ? geistSans.className : vazirmatn.className;

  return (
    <html
      lang={toBcp47(locale)}
      dir={dir}
      className={htmlClass}
      data-locale={locale}
      data-theme={themePreference}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className={`${bodyClass} min-h-full flex flex-col antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider initialPreference={themePreference}>
            <NotFoundPageView />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
