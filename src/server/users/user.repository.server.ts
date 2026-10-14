import { FieldValue } from "firebase-admin/firestore";

import { getFirebaseAdminFirestore } from "../../lib/firebase/admin.server";
import type { UserProfile, UserRole } from "../../lib/auth/user-profile";
import type { FirebaseIdentity } from "../auth/identity.server";

function toRole(value: unknown): UserRole {
  return value === "admin" ? "admin" : "owner";
}

export type AuthenticatedSessionCheck =
  | { success: true; user: UserProfile }
  | { success: false; reason: "not_found" | "disabled" | "concurrent_login" };

export async function upsertUserProfile(
  identity: FirebaseIdentity,
  sessionId?: string,
): Promise<UserProfile> {
  const profileRef = getFirebaseAdminFirestore().collection("users").doc(identity.uid);
  const current = await profileRef.get();
  const role = toRole(current.data()?.role);

  await profileRef.set(
    {
      uid: identity.uid,
      email: identity.email,
      name: identity.name,
      provider: identity.provider,
      role,
      phone: current.data()?.phone ?? "",
      status: current.data()?.status === "disabled" ? "disabled" : "active",
      ...(sessionId ? { currentSessionId: sessionId, sessionUpdatedAt: FieldValue.serverTimestamp() } : {}),
      updatedAt: FieldValue.serverTimestamp(),
      ...(current.exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
    },
    { merge: true },
  );

  return { ...identity, role };
}

export async function updateUserSessionId(uid: string, sessionId: string): Promise<void> {
  await getFirebaseAdminFirestore().collection("users").doc(uid).set(
    {
      currentSessionId: sessionId,
      sessionUpdatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
}

export async function findUserProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getFirebaseAdminFirestore().collection("users").doc(uid).get();
  if (!snapshot.exists) return null;

  const profile = snapshot.data();
  if (!profile?.email || !profile.name) return null;
  return {
    uid,
    email: String(profile.email),
    name: String(profile.name),
    provider: profile.provider === "google" ? "google" : "password",
    role: toRole(profile.role),
  };
}

export async function findAuthenticatedUserWithSession(
  uid: string,
  clientSessionId: string,
): Promise<AuthenticatedSessionCheck> {
  const snapshot = await getFirebaseAdminFirestore().collection("users").doc(uid).get();
  if (!snapshot.exists) return { success: false, reason: "not_found" };

  const data = snapshot.data();
  if (!data?.email || !data?.name) return { success: false, reason: "not_found" };
  if (data?.status === "disabled") return { success: false, reason: "disabled" };

  // When a newer session exists on another device/browser, currentSessionId will differ
  if (data?.currentSessionId && data.currentSessionId !== clientSessionId) {
    return { success: false, reason: "concurrent_login" };
  }

  return {
    success: true,
    user: {
      uid,
      email: String(data.email),
      name: String(data.name),
      provider: data.provider === "google" ? "google" : "password",
      role: toRole(data.role),
    },
  };
}
