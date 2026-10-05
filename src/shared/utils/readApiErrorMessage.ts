import axios from "axios";

import { translateKey } from "@/i18n/translate";
import type { AppLocale } from "@/i18n/routing";

import { isSafeUserFacingMessage } from "./safeUserMessage";

const AXIOS_GENERIC_STATUS = /^Request failed with status code \d+$/i;

function firstModelStateMessage(data: Record<string, unknown>): string | null {
  const errors = data.errors ?? data.Errors;
  if (!errors || typeof errors !== "object") return null;
  for (const v of Object.values(errors as Record<string, unknown>)) {
    if (Array.isArray(v)) {
      const first = v.find((x) => typeof x === "string" && x.trim());
      if (typeof first === "string") return first.trim();
    } else if (typeof v === "string" && v.trim()) {
      return v.trim();
    }
  }
  return null;
}

function firstStringListMessage(data: Record<string, unknown>): string | null {
  const errors = data.errors ?? data.Errors;
  if (!Array.isArray(errors)) return null;
  const first = errors.find((x) => typeof x === "string" && x.trim());
  return typeof first === "string" ? first.trim() : null;
}

function isUnsafeTechnicalMessage(msg: string): boolean {
  const s = msg.trim().toLowerCase();
  if (!s) return true;
  return (
    s === "method not allowed" ||
    s === "not found" ||
    s === "bad request" ||
    s === "unauthorized" ||
    s === "forbidden" ||
    s === "internal server error" ||
    s === "one or more validation errors occurred." ||
    s === "an error occurred while processing your request."
  );
}

function extractMessageFromBody(data: unknown): string | null {
  if (data == null) return null;
  if (typeof data === "string") {
    const t = data.trim();
    if (t && !t.toLowerCase().includes("<html")) return t;
    return null;
  }
  if (typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  for (const key of ["message", "Message", "detail", "Detail", "title", "Title"] as const) {
    const v = o[key];
    if (typeof v === "string" && v.trim()) {
      return firstStringListMessage(o) && isUnsafeTechnicalMessage(v)
        ? firstStringListMessage(o)
        : v.trim();
    }
  }
  return firstStringListMessage(o) ?? firstModelStateMessage(o);
}

function localizedHttpMessage(status: number | undefined, locale?: AppLocale): string {
  if (status == null || status === 0) return translateKey("common.serviceUnavailable", locale);
  if (status === 502 || status === 503 || status === 504) {
    return translateKey("common.serviceUnavailable", locale);
  }
  if (status >= 500) return translateKey("common.httpStatus.5xx", locale);
  if (status >= 400) return translateKey("common.httpStatus.4xx", locale);
  return translateKey("common.serviceUnavailable", locale);
}

/**
 * Reads `message` from API error bodies. Never surfaces raw axios / ASP.NET text.
 */
export function readApiErrorMessage(err: unknown, fallback?: string, locale?: AppLocale): string {
  const safeFallback = fallback ?? translateKey("common.serviceUnavailable", locale);

  if (axios.isAxiosError(err)) {
    if (err.code === "ERR_CANCELED" || err.name === "CanceledError") {
      return safeFallback;
    }

    if (!err.response) {
      if (err.code === "ECONNABORTED") return translateKey("common.httpStatus.timeout", locale);
      return translateKey("common.httpStatus.network", locale);
    }

    const status = err.response.status;
    const fromBody = extractMessageFromBody(err.response.data);

    if (fromBody && isSafeUserFacingMessage(fromBody) && !isUnsafeTechnicalMessage(fromBody)) {
      return fromBody;
    }

    return localizedHttpMessage(status, locale);
  }

  if (err instanceof Error && err.message && err.name !== "CanceledError") {
    if (AXIOS_GENERIC_STATUS.test(err.message) || /^network error$/i.test(err.message.trim())) {
      return safeFallback;
    }
    if (isSafeUserFacingMessage(err.message)) {
      return err.message;
    }
    return safeFallback;
  }

  return safeFallback;
}

export function isAbortError(err: unknown): boolean {
  return axios.isCancel(err) || (err instanceof Error && err.name === "CanceledError");
}
