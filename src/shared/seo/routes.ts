/** Public indexable paths for sitemap (no /admin, /auth). Add a row when a public route ships. */
export const publicSeoRoutes = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
] as const;

export type PublicSeoPath = (typeof publicSeoRoutes)[number]["path"];
