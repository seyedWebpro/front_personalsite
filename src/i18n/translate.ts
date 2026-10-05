import en from "@/messages/en.json";
import fa from "@/messages/fa.json";

import { routing, type AppLocale, isAppLocale } from "./routing";

type Messages = typeof en;

const catalogs: Record<AppLocale, Messages> = { en, fa };

function readCookieLocale(): AppLocale | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]*)/);
  if (!match?.[1]) return null;
  const value = decodeURIComponent(match[1]);
  return isAppLocale(value) ? value : null;
}

/** Resolve active UI locale outside React (axios, toasts, formatters). */
export function resolveClientLocale(): AppLocale {
  if (typeof document !== "undefined") {
    const htmlLang = document.documentElement.lang?.toLowerCase() ?? "";
    if (htmlLang.startsWith("fa")) return "fa";
    if (htmlLang.startsWith("en")) return "en";
  }

  const fromCookie = readCookieLocale();
  if (fromCookie) return fromCookie;

  return routing.defaultLocale;
}

function lookup(messages: Messages, key: string): string | undefined {
  const parts = key.split(".");
  let current: unknown = messages;
  for (const part of parts) {
    if (!current || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : undefined;
}

/** Translate a dotted key using the client catalog (non-React contexts). */
export function translateKey(key: string, locale?: AppLocale): string {
  const lang = locale ?? resolveClientLocale();
  return lookup(catalogs[lang], key) ?? lookup(catalogs.en, key) ?? key;
}

export function hasMessageKey(key: string, locale?: AppLocale): boolean {
  const lang = locale ?? resolveClientLocale();
  return lookup(catalogs[lang], key) != null || lookup(catalogs.en, key) != null;
}
