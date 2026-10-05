import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import HomePageView from "@/features/home/pages/HomePageView";
import { isAppLocale, type AppLocale } from "@/i18n/routing";
import { buildPageMetadata } from "@/shared/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale: AppLocale = isAppLocale(localeParam) ? localeParam : "en";
  const t = await getTranslations({ locale, namespace: "pages.home" });
  return buildPageMetadata({
    title: t("title"),
    description: t("description"),
    path: "/",
    locale,
  });
}

export default async function HomePage() {
  return <HomePageView />;
}
