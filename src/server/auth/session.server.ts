import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";

import { getFirebaseAdminAuth } from "../../lib/firebase/admin.server";

const sessionCookieName = "tapqr_session";
const sessionIdCookieName = "tapqr_session_id";
const sessionDurationMs = 7 * 24 * 60 * 60 * 1000;

export type AuthenticationSession = {
  uid: string;
  sessionId: string;
};

export async function createAuthenticationSession(idToken: string): Promise<string> {
  const sessionCookie = await getFirebaseAdminAuth().createSessionCookie(idToken, {
    expiresIn: sessionDurationMs,
  });

  const sessionId = crypto.randomUUID();

  const cookieOptions = {
    httpOnly: true,
    maxAge: sessionDurationMs / 1000,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };

  setCookie(sessionCookieName, sessionCookie, cookieOptions);
  setCookie(sessionIdCookieName, sessionId, cookieOptions);

  return sessionId;
}

export async function getAuthenticationSession(): Promise<AuthenticationSession | null> {
  const sessionCookie = getCookie(sessionCookieName);
  const sessionId = getCookie(sessionIdCookieName);
  if (!sessionCookie || !sessionId) return null;

  try {
    const decoded = await getFirebaseAdminAuth().verifySessionCookie(sessionCookie, true);
    return { uid: decoded.uid, sessionId };
  } catch {
    clearAuthenticationSession();
    return null;
  }
}

export async function getAuthenticationSessionUserId(): Promise<string | null> {
  const session = await getAuthenticationSession();
  return session ? session.uid : null;
}

export function clearAuthenticationSession() {
  deleteCookie(sessionCookieName, { path: "/" });
  deleteCookie(sessionIdCookieName, { path: "/" });
}
