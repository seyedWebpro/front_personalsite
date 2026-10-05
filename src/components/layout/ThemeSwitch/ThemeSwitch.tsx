"use client";

import { useTranslations } from "next-intl";

import { useTheme } from "@/theme/ThemeProvider";
import { THEME_PREFERENCES } from "@/theme/theme";
import { cn } from "@/shared/utils/cn";

export function ThemeSwitch() {
  const t = useTranslations("theme");
  const { preference, setPreference } = useTheme();

  return (
    <div
      role="group"
      aria-label={t("select")}
      className="flex items-center gap-1 text-sm"
    >
      {THEME_PREFERENCES.map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => setPreference(value)}
          className={cn(
            "rounded-md px-2 py-1",
            preference === value
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100",
          )}
          aria-pressed={preference === value}
        >
          {t(value)}
        </button>
      ))}
    </div>
  );
}

