/** Only controlled, non-technical text may reach the user (mirrors API ControlledMessages). */
export function isSafeUserFacingMessage(message: string | null | undefined): boolean {
  if (!message?.trim()) return false;

  const trimmed = message.trim();
  const lower = trimmed.toLowerCase();

  if (
    lower.includes("exception") ||
    lower.includes("stack") ||
    lower.includes(" at ") ||
    lower.includes("sql") ||
    lower.includes("timeout") ||
    lower.includes("null reference") ||
    lower.includes("object reference") ||
    lower.includes("inner exception") ||
    lower.includes("request failed with status code") ||
    lower.includes("network error") ||
    lower.includes("econnaborted") ||
    lower.includes("etimedout") ||
    trimmed.includes("\\") ||
    lower.includes("wwwroot") ||
    lower.includes("<html") ||
    /controlledmessages\./i.test(trimmed)
  ) {
    return false;
  }

  if (/[\u0600-\u06FF]/.test(trimmed)) return true;

  if (!trimmed.includes(" ") || trimmed.length < 12) return false;
  return /^[\w\s.,!?'"\-–—:;()%/]+$/i.test(trimmed);
}

export function sanitizeUserFacingMessage(
  message: string | null | undefined,
  fallback: string,
): string {
  if (!isSafeUserFacingMessage(message) || !message) return fallback;
  return message.trim();
}
