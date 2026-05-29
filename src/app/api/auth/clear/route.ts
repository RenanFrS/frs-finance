import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "frs_session";

/**
 * Clears a stale session cookie and bounces to /login.
 *
 * The proxy validates the session cookie only by its HMAC signature, while the
 * app layer (getCurrentSession) also requires a matching Membership row. When a
 * cookie is cryptographically valid but its user/tenant no longer exist (e.g.
 * the database was reseeded with fresh ids), those two checks disagree and the
 * app would bounce /dashboard -> /login -> /dashboard forever. requireSession
 * sends such requests here so the cookie is actually deleted, breaking the loop.
 *
 * Lives under /api/auth, which the proxy treats as public, so it never bounces.
 */
export function GET(req: NextRequest) {
  const url = req.nextUrl.clone();
  const from = url.searchParams.get("from");
  url.pathname = "/login";
  url.search = "";
  if (from && from.startsWith("/")) url.searchParams.set("from", from);

  const res = NextResponse.redirect(url);
  res.cookies.delete(COOKIE_NAME);
  return res;
}
