"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

export default function NotFoundPageView() {
  const t = useTranslations("notFound");

  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-sm text-zinc-500">{t("code")}</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-3 max-w-md text-sm text-zinc-500">{t("description")}</p>
      <Link href="/" className="mt-6 text-sm underline underline-offset-4">
        {t("home")}
      </Link>
    </main>
  );
}
