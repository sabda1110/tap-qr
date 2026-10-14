import {
  deleteCookie,
  getCookie,
  getRequestProtocol,
  setCookie,
} from "@tanstack/react-start/server";

import { getFirebaseAdminAuth } from "../../lib/firebase/admin.server";

const sessionCookieName = "tapqr_session";
const sessionIdCookieName = "tapqr_session_id";
const sessionCookieVersion = "v2";
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
    secure: getRequestProtocol({ xForwardedProto: true }) === "https",
  };

  setCookie(
    sessionCookieName,
    `${sessionCookieVersion}.${sessionId}.${sessionCookie}`,
    cookieOptions,
  );

  return sessionId;
}

export async function getAuthenticationSession(): Promise<AuthenticationSession | null> {
  const storedSession = getCookie(sessionCookieName);
  if (!storedSession) return null;

  const parsedSession = parseStoredSession(storedSession);
  if (!parsedSession) return null;

  try {
    const decoded = await getFirebaseAdminAuth().verifySessionCookie(
      parsedSession.sessionCookie,
      true,
    );
    return { uid: decoded.uid, sessionId: parsedSession.sessionId };
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
}

function parseStoredSession(storedSession: string) {
  const currentSession = /^v2\.([^.]+)\.(.+)$/.exec(storedSession);
  if (currentSession) {
    return { sessionId: currentSession[1], sessionCookie: currentSession[2] };
  }

  const legacySessionId = getCookie(sessionIdCookieName);
  return legacySessionId
    ? { sessionId: legacySessionId, sessionCookie: storedSession }
    : null;
}
