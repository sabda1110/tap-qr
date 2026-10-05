import { createServerFn } from "@tanstack/react-start";

import { firebaseTokenSchema } from "./auth.schemas";
import { verifyFirebaseIdentity } from "./identity.server";
import { findUserProfile, upsertUserProfile } from "../users/user.repository.server";
import {
  clearAuthenticationSession,
  createAuthenticationSession,
  getAuthenticationSessionUserId,
} from "./session.server";

export const syncAuthenticatedUser = createServerFn({ method: "POST" })
  .validator(firebaseTokenSchema)
  .handler(async ({ data }) => {
    const identity = await verifyFirebaseIdentity(data.idToken);
    const profile = await upsertUserProfile(identity);
    await createAuthenticationSession(data.idToken);
    return profile;
  });

export const getCurrentAuthenticatedUser = createServerFn({ method: "GET" }).handler(async () => {
  const uid = await getAuthenticationSessionUserId();
  return uid ? findUserProfile(uid) : null;
});

export const clearAuthenticatedSession = createServerFn({ method: "POST" }).handler(() => {
  clearAuthenticationSession();
});

export const getAuthenticatedUser = createServerFn({ method: "GET" })
  .validator(firebaseTokenSchema)
  .handler(async ({ data }) => {
    const identity = await verifyFirebaseIdentity(data.idToken);
    return findUserProfile(identity.uid);
  });
