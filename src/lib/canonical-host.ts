// Decides whether a request came in on the platform's generated domain and
// should be sent to the site's own domain. Pure, so it is unit-tested.
//
// Railway keeps serving the app on its generated *.up.railway.app address
// after a custom domain is attached. Without a redirect both addresses
// work, people end up signed in on the generated one, and links get shared
// with it.

const PLATFORM_SUFFIX = ".up.railway.app";
const DEFAULT_CANONICAL_HOST = "kitegrip.com";

function hostOf(url: string | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).host.toLowerCase();
  } catch {
    return null;
  }
}

function isPlatformHost(host: string): boolean {
  return host.toLowerCase().split(":")[0].endsWith(PLATFORM_SUFFIX);
}

/**
 * The site's own host. Taken from NEXT_PUBLIC_SITE_URL unless that is
 * missing, local, or itself the generated address (a leftover from before
 * the domain existed).
 */
export function canonicalHost(siteUrl: string | undefined): string {
  const host = hostOf(siteUrl);
  if (!host || isPlatformHost(host) || host.startsWith("localhost") || host.startsWith("127.0.0.1")) {
    return DEFAULT_CANONICAL_HOST;
  }
  return host;
}

/**
 * Where to redirect, or null to serve the request as is. Only requests
 * that arrived on the generated platform domain are redirected: unknown
 * hosts, internal health checks and local development are left alone.
 */
export function canonicalRedirect(input: {
  requestHost: string | null;
  pathname: string;
  search: string;
  siteUrl: string | undefined;
  production: boolean;
}): string | null {
  if (!input.production || !input.requestHost) return null;
  if (!isPlatformHost(input.requestHost)) return null;
  if (input.pathname === "/api/health") return null;
  return `https://${canonicalHost(input.siteUrl)}${input.pathname}${input.search}`;
}
