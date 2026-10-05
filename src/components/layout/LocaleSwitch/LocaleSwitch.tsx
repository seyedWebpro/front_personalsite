"use client";

import { useLocale, useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/shared/utils/cn";

export function LocaleSwitch() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("language");

  return (
    <nav aria-label={t("select")} className="flex items-center gap-2 text-sm">
      {routing.locales.map((code) => (
        <Link
          key={code}
          href={pathname}
          locale={code}
          className={cn(
            "rounded-md px-2 py-1",
            locale === code
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100",
          )}
        >
          {t(code)}
        </Link>
      ))}
    </nav>
  );
}
