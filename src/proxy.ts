import { NextResponse, type NextRequest } from "next/server";
import { canonicalRedirect } from "@/lib/canonical-host";

/**
 * Sends requests that arrive on Railway's generated *.up.railway.app
 * address to the site's own domain, keeping path and query. 308 keeps the
 * method, so a form post or an old sign-in link still lands correctly.
 * See src/lib/canonical-host.ts for the rules.
 */
export function proxy(request: NextRequest) {
  const target = canonicalRedirect({
    requestHost: request.headers.get("x-forwarded-host") ?? request.headers.get("host"),
    pathname: request.nextUrl.pathname,
    search: request.nextUrl.search,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    production: process.env.NODE_ENV === "production",
  });
  return target ? NextResponse.redirect(target, 308) : NextResponse.next();
}

export const config = {
  // Static assets carry no host-specific state; skip them.
  matcher: ["/((?!_next/static|_next/image).*)"],
};
