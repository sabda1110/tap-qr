import { createServerFn } from "@tanstack/react-start";

import { firebaseTokenSchema } from "./auth.schemas";
import { verifyFirebaseIdentity } from "./identity.server";
import {
  findAuthenticatedUserWithSession,
  findUserProfile,
  upsertUserProfile,
} from "../users/user.repository.server";
import {
  clearAuthenticationSession as clearSessionCookies,
  createAuthenticationSession,
  getAuthenticationSession,
} from "./session.server";

export const syncAuthenticatedUser = createServerFn({ method: "POST" })
  .validator(firebaseTokenSchema)
  .handler(async ({ data }) => {
    const identity = await verifyFirebaseIdentity(data.idToken);
    const sessionId = await createAuthenticationSession(data.idToken);
    const profile = await upsertUserProfile(identity, sessionId);
    return profile;
  });

export const getCurrentAuthenticatedUser = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getAuthenticationSession();
  if (!session) return null;

  const result = await findAuthenticatedUserWithSession(session.uid, session.sessionId);
  if (!result.success) {
    clearSessionCookies();
    return null;
  }

  return result.user;
});

export const checkActiveSession = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getAuthenticationSession();
  if (!session) {
    return { active: false, reason: "no_session" as const };
  }

  const result = await findAuthenticatedUserWithSession(session.uid, session.sessionId);
  if (!result.success) {
    clearSessionCookies();
    return { active: false, reason: result.reason };
  }

  return { active: true, reason: null };
});

export const clearAuthenticatedSession = createServerFn({ method: "POST" }).handler(() => {
  clearSessionCookies();
});

export const getAuthenticatedUser = createServerFn({ method: "GET" })
  .validator(firebaseTokenSchema)
  .handler(async ({ data }) => {
    const identity = await verifyFirebaseIdentity(data.idToken);
    return findUserProfile(identity.uid);
  });
