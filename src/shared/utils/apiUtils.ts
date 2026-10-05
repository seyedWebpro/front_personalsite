import type { ApiResponse, PagedResult } from "@/shared/types/api.types";
import { translateKey } from "@/i18n/translate";

import { readApiErrorMessage } from "./readApiErrorMessage";
import { sanitizeUserFacingMessage } from "./safeUserMessage";

function pick<T>(obj: Record<string, unknown>, camel: string, pascal: string): T | undefined {
  if (camel in obj) return obj[camel] as T;
  if (pascal in obj) return obj[pascal] as T;
  return undefined;
}

function connectionFallback(): string {
  return translateKey("common.serviceUnavailable");
}

export function unwrapApiResponse<T>(payload: unknown): T {
  if (payload == null || typeof payload !== "object") {
    throw new Error(connectionFallback());
  }

  const body = payload as ApiResponse<T> & T;
  const nested = body.data ?? body.Data;

  if (nested != null) {
    const success = body.success ?? body.Success;
    if (success === false) {
      throw new Error(
        sanitizeUserFacingMessage(body.message ?? body.Message, connectionFallback()),
      );
    }
    return nested;
  }

  if ("success" in body || "Success" in body) {
    const success = body.success ?? body.Success;
    if (success === false) {
      throw new Error(
        sanitizeUserFacingMessage(body.message ?? body.Message, connectionFallback()),
      );
    }
  }

  return payload as T;
}

export function unwrapApiData<T>(response: { data: unknown }): T {
  return unwrapApiResponse<T>(response.data);
}

export function unwrapPagedApiData<T>(response: { data: unknown }): PagedResult<T> {
  const payload = unwrapApiResponse<Record<string, unknown>>(response.data);
  const items = (pick<T[]>(payload, "items", "Items") ?? []) as T[];
  const totalCount = pick<number>(payload, "totalCount", "TotalCount") ?? items.length;
  const pageNumber = pick<number>(payload, "pageNumber", "PageNumber") ?? 1;
  const pageSize = pick<number>(payload, "pageSize", "PageSize") ?? items.length;
  const totalPages =
    pick<number>(payload, "totalPages", "TotalPages") ??
    (pageSize > 0 ? Math.ceil(totalCount / pageSize) : 0);

  return { items, totalCount, pageNumber, pageSize, totalPages };
}

export function getApiErrorMessage(error: unknown, fallback?: string): string {
  return readApiErrorMessage(error, fallback);
}

export type { PagedResult };
