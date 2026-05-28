import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "frs_session";
const AUTH_ROUTES = ["/login", "/register"];
const PUBLIC_PREFIXES = ["/_next", "/api/auth", "/favicon", "/logo.svg"];

const enc = new TextEncoder();

async function verifyToken(token: string, secret: string): Promise<boolean> {
  const dot = token.indexOf(".");
  if (dot < 0) return false;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const sigBytes = b64urlToBytes(sig);
    const bodyBytes = enc.encode(body);
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes.buffer.slice(sigBytes.byteOffset, sigBytes.byteOffset + sigBytes.byteLength) as ArrayBuffer,
      bodyBytes.buffer.slice(bodyBytes.byteOffset, bodyBytes.byteOffset + bodyBytes.byteLength) as ArrayBuffer,
    );
    if (!ok) return false;

    const payload = JSON.parse(
      new TextDecoder().decode(b64urlToBytes(body)),
    ) as { exp?: number };
    if (typeof payload.exp !== "number") return false;
    if (payload.exp * 1000 < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}

function b64urlToBytes(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = (s + pad).replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const isAuthRoute = AUTH_ROUTES.some((p) => pathname.startsWith(p));
  const token = req.cookies.get(COOKIE_NAME)?.value ?? null;
  const secret = process.env.SESSION_SECRET;

  let hasValidSession = false;
  if (token && secret) {
    hasValidSession = await verifyToken(token, secret);
  }

  if (!hasValidSession && !isAuthRoute) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    const res = NextResponse.redirect(url);
    if (token) res.cookies.delete(COOKIE_NAME);
    return res;
  }

  if (hasValidSession && isAuthRoute) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.svg).*)"],
};
