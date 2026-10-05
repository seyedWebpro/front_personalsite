import type { Metadata } from "next";
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing, toOpenGraphLocale } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import {
  JsonLd,
  buildPersonJsonLd,
  buildWebSiteJsonLd,
} from "@/shared/seo";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { parseThemePreference, THEME_COOKIE } from "@/theme/theme";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const appLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: appLocale, namespace: "site" });

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: t("name"),
      template: `%s | ${t("shortName")}`,
    },
    description: t("description"),
    applicationName: t("shortName"),
    openGraph: {
      type: "website",
      locale: toOpenGraphLocale(appLocale),
      siteName: t("shortName"),
      title: t("name"),
      description: t("description"),
      url: `${siteConfig.url}/${appLocale}`,
      images: [
        {
          url: siteConfig.defaultOgImage,
          width: 1200,
          height: 630,
          alt: t("name"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("name"),
      description: t("description"),
      images: [siteConfig.defaultOgImage],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      languages: {
        en: `${siteConfig.url}/en`,
        fa: `${siteConfig.url}/fa`,
        "x-default": `${siteConfig.url}/${routing.defaultLocale}`,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const themePreference = parseThemePreference(
    (await cookies()).get(THEME_COOKIE)?.value,
  );

  const inner = (
    <>
      <JsonLd data={[buildPersonJsonLd(locale), buildWebSiteJsonLd(locale)]} />
      <NextIntlClientProvider messages={messages}>
        <ThemeProvider initialPreference={themePreference}>{children}</ThemeProvider>
      </NextIntlClientProvider>
    </>
  );

  if (locale === "en") {
    const { EnglishHtml } = await import("./EnglishHtml");
    return <EnglishHtml themePreference={themePreference}>{inner}</EnglishHtml>;
  }

  const { PersianHtml } = await import("./PersianHtml");
  return <PersianHtml themePreference={themePreference}>{inner}</PersianHtml>;
}
