import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cache } from "react";
import { db } from "@/lib/db";

const COOKIE_NAME = "frs_session";
const DEFAULT_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

type Payload = {
  uid: string;
  tid: string;
  exp: number;
};

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("SESSION_SECRET is not configured (need 16+ chars).");
  }
  return secret;
}

function sign(data: string): string {
  return createHmac("sha256", getSecret()).update(data).digest("base64url");
}

function encodeToken(payload: Payload): string {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${body}.${sign(body)}`;
}

function decodeToken(token: string): Payload | null {
  const dot = token.indexOf(".");
  if (dot < 0) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as Payload;
    if (!payload.uid || !payload.tid || typeof payload.exp !== "number") return null;
    if (payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function createSession(opts: {
  userId: string;
  tenantId: string;
  rememberMe?: boolean;
}) {
  const maxAge = opts.rememberMe === false ? 60 * 60 * 12 : DEFAULT_MAX_AGE;
  const payload: Payload = {
    uid: opts.userId,
    tid: opts.tenantId,
    exp: Math.floor(Date.now() / 1000) + maxAge,
  };
  const token = encodeToken(payload);
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function readSessionPayload(): Promise<Payload | null> {
  const jar = await cookies();
  const cookie = jar.get(COOKIE_NAME);
  if (!cookie?.value) return null;
  return decodeToken(cookie.value);
}

/**
 * Returns the logged-in user along with the active tenant + role. Cached for
 * the lifetime of a single request so multiple call sites stay cheap.
 */
export const getCurrentSession = cache(async () => {
  const payload = await readSessionPayload();
  if (!payload) return null;

  const membership = await db.membership.findFirst({
    where: { userId: payload.uid, tenantId: payload.tid },
    include: {
      user: { select: { id: true, email: true, firstName: true, lastName: true, photoUrl: true } },
      tenant: { select: { id: true, name: true, slug: true } },
    },
  });
  if (!membership) return null;

  return {
    user: membership.user,
    tenant: membership.tenant,
    role: membership.role,
  };
});

/**
 * Throws (or redirects) if there is no logged-in user. Use in app pages.
 */
export async function requireSession() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");
  return session;
}
