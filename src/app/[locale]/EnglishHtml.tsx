import type { ReactNode } from "react";

import { geistMono, geistSans } from "@/shared/fonts/geist";
import { toBcp47 } from "@/i18n/routing";
import { ThemeScript } from "@/theme/ThemeScript";
import { ssrDarkClass, type ThemePreference } from "@/theme/theme";
import { cn } from "@/shared/utils/cn";

export function EnglishHtml({
  children,
  themePreference,
}: {
  children: ReactNode;
  themePreference: ThemePreference;
}) {
  return (
    <html
      lang={toBcp47("en")}
      dir="ltr"
      className={cn(
        geistSans.variable,
        geistMono.variable,
        "h-full antialiased",
        ssrDarkClass(themePreference),
      )}
      data-locale="en"
      data-theme={themePreference}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className={`${geistSans.className} min-h-full flex flex-col`}>{children}</body>
    </html>
  );
}
