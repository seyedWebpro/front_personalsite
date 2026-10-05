import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { LocaleSwitch } from "@/components/layout/LocaleSwitch";
import { ThemeSwitch } from "@/components/layout/ThemeSwitch";

export async function Header() {
  const t = await getTranslations("site");
  const tNav = await getTranslations("nav");

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-sm font-medium">
          {t("shortName")}
        </Link>
        <div className="flex items-center gap-4">
          <nav aria-label={tNav("main")} className="text-sm">
            <Link href="/">{tNav("home")}</Link>
          </nav>
          <LocaleSwitch />
          <ThemeSwitch />
        </div>
      </div>
    </header>
  );
}
