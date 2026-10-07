import type { UserProfile } from "../../lib/auth/user-profile";
import { getAuthenticationSessionUserId } from "./session.server";
import { findUserProfile } from "../users/user.repository.server";

export async function requireAdmin(): Promise<UserProfile> {
  const uid = await getAuthenticationSessionUserId();
  if (!uid) throw new Error("Sesi autentikasi tidak ditemukan.");

  const user = await findUserProfile(uid);
  if (!user || user.role !== "admin") throw new Error("Akses admin diperlukan.");
  return user;
}

export async function requireAuthenticatedUser(): Promise<UserProfile> {
  const uid = await getAuthenticationSessionUserId();
  const user = uid ? await findUserProfile(uid) : null;
  if (!user) throw new Error("AUTH_REQUIRED");
  return user;
}
