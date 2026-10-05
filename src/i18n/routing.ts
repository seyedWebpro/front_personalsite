import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fa"],
  defaultLocale: "en",
  localePrefix: "always",
  localeDetection: true,
});

export type AppLocale = (typeof routing.locales)[number];

export function isAppLocale(value: string): value is AppLocale {
  return (routing.locales as readonly string[]).includes(value);
}

export function localeDirection(locale: string): "rtl" | "ltr" {
  return locale === "fa" ? "rtl" : "ltr";
}

export function toBcp47(locale: string): string {
  return locale === "fa" ? "fa-IR" : "en-US";
}

export function toOpenGraphLocale(locale: string): string {
  return locale === "fa" ? "fa_IR" : "en_US";
}
