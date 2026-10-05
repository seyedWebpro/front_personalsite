import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

/**
 * Public site is bilingual under /en and /fa.
 * When admin/auth exist: keep owner UI on /fa only and gate /admin with httpOnly cookies.
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (/^\/en\/(admin|auth)(\/|$)/.test(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/en/, "/fa");
    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
