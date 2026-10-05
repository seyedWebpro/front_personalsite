import type { ReactNode } from "react";

import { geistMono } from "@/shared/fonts/geist";
import { vazirmatn } from "@/shared/fonts/vazirmatn";
import { toBcp47 } from "@/i18n/routing";
import { ThemeScript } from "@/theme/ThemeScript";
import { ssrDarkClass, type ThemePreference } from "@/theme/theme";
import { cn } from "@/shared/utils/cn";

export function PersianHtml({
  children,
  themePreference,
}: {
  children: ReactNode;
  themePreference: ThemePreference;
}) {
  return (
    <html
      lang={toBcp47("fa")}
      dir="rtl"
      className={cn(
        vazirmatn.variable,
        geistMono.variable,
        "h-full antialiased",
        ssrDarkClass(themePreference),
      )}
      data-locale="fa"
      data-theme={themePreference}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className={`${vazirmatn.className} min-h-full flex flex-col`}>{children}</body>
    </html>
  );
}
