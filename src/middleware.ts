import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, SESSION_TOKEN_KEY } from "@/lib/constants";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Forwards session tokens from query / client cookies into request headers so
 * Server Components can authenticate even when the httpOnly cookie was blocked
 * by a cross-origin iframe.
 */
export function middleware(req: NextRequest) {
  const requestHeaders = new Headers(req.headers);

  const existing =
    requestHeaders.get("x-session-token") ||
    (requestHeaders.get("authorization") || "").replace(/^Bearer\s+/i, "");

  // The URL bootstrap is for page loads only. API calls must use headers or cookies.
  const isApi = req.nextUrl.pathname.startsWith("/api/");
  if (!isApi && !UUID_RE.test(existing)) {
    const q = req.nextUrl.searchParams.get("t") || req.nextUrl.searchParams.get("token");
    const c =
      req.cookies.get(SESSION_TOKEN_KEY)?.value ||
      req.cookies.get(SESSION_COOKIE)?.value ||
      null;
    const token = (q && UUID_RE.test(q) ? q : null) || (c && UUID_RE.test(c) ? c : null);
    if (token) {
      requestHeaders.set("x-session-token", token);
      if (!requestHeaders.get("authorization")) {
        requestHeaders.set("authorization", `Bearer ${token}`);
      }
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    /*
     * Run on all app pages and API routes except static assets.
     */
    "/((?!_next/static|_next/image|favicon.ico|icons/|images/|sw.js|manifest.webmanifest).*)",
  ],
};
