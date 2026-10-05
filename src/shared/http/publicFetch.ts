/**
 * Shared fetch policy for public (anonymous) API reads from Server Components.
 * Never use for auth, admin, or personalized responses — those go through `apiClient`.
 */

export const PUBLIC_REVALIDATE_SECONDS = 60;

export const publicCacheTags = {
  site: "site",
  articles: "articles",
  projects: "projects",
  sitemap: "sitemap",
} as const;

export type PublicCacheTag = (typeof publicCacheTags)[keyof typeof publicCacheTags];

function shouldBypassPublicCache(): boolean {
  if (process.env.PUBLIC_FETCH_NO_STORE === "true") return true;
  if (process.env.PUBLIC_FETCH_NO_STORE === "false") return false;
  return process.env.NODE_ENV !== "production";
}

export type PublicFetchInit = {
  locale: string;
  tags: PublicCacheTag[];
  revalidate?: number | false;
};

export async function publicFetch(
  url: string,
  { locale, tags, revalidate }: PublicFetchInit,
): Promise<Response | null> {
  const headers: HeadersInit = {
    Accept: "application/json",
    "Accept-Language": locale === "fa" ? "fa" : "en",
  };

  try {
    if (revalidate === false || shouldBypassPublicCache()) {
      return await fetch(url, { headers, cache: "no-store" });
    }

    const seconds =
      typeof revalidate === "number" ? revalidate : PUBLIC_REVALIDATE_SECONDS;

    return await fetch(url, {
      headers,
      next: { revalidate: seconds, tags: [...tags] },
    });
  } catch {
    return null;
  }
}
