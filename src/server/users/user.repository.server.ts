import { FieldValue } from "firebase-admin/firestore";

import { getFirebaseAdminFirestore } from "../../lib/firebase/admin.server";
import type { FirebaseIdentity } from "../auth/identity.server";

export type UserRole = "user" | "admin";

export type UserProfile = FirebaseIdentity & {
  role: UserRole;
};

function toRole(value: unknown): UserRole {
  return value === "admin" ? "admin" : "user";
}

export async function upsertUserProfile(identity: FirebaseIdentity): Promise<UserProfile> {
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
      updatedAt: FieldValue.serverTimestamp(),
      ...(current.exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
    },
    { merge: true },
  );

  return { ...identity, role };
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
