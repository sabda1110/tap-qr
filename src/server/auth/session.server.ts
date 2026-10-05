import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";

import { getFirebaseAdminAuth } from "../../lib/firebase/admin.server";

const sessionCookieName = "tapqr_session";
const sessionDurationMs = 7 * 24 * 60 * 60 * 1000;

export async function createAuthenticationSession(idToken: string) {
  const sessionCookie = await getFirebaseAdminAuth().createSessionCookie(idToken, {
    expiresIn: sessionDurationMs,
  });

  setCookie(sessionCookieName, sessionCookie, {
    httpOnly: true,
    maxAge: sessionDurationMs / 1000,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function getAuthenticationSessionUserId() {
  const sessionCookie = getCookie(sessionCookieName);
  if (!sessionCookie) return null;

  try {
    return (await getFirebaseAdminAuth().verifySessionCookie(sessionCookie, true)).uid;
  } catch {
    clearAuthenticationSession();
    return null;
  }
}

export function clearAuthenticationSession() {
  deleteCookie(sessionCookieName, { path: "/" });
}
