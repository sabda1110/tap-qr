import type { UserProfile } from "../../lib/auth/user-profile";
import { clearAuthenticationSession, getAuthenticationSession } from "./session.server";
import { findAuthenticatedUserWithSession } from "../users/user.repository.server";

export async function requireAuthenticatedUser(): Promise<UserProfile> {
  const session = await getAuthenticationSession();
  if (!session) throw new Error("AUTH_REQUIRED");

  const result = await findAuthenticatedUserWithSession(session.uid, session.sessionId);
  if (!result.success) {
    clearAuthenticationSession();
    if (result.reason === "concurrent_login") {
      throw new Error("CONCURRENT_LOGIN");
    }
    throw new Error("AUTH_REQUIRED");
  }

  return result.user;
}

export async function requireAdmin(): Promise<UserProfile> {
  const user = await requireAuthenticatedUser();
  if (user.role !== "admin") throw new Error("Akses admin diperlukan.");
  return user;
}

export async function requireOwner(): Promise<UserProfile> {
  const user = await requireAuthenticatedUser();
  if (user.role !== "owner") throw new Error("OWNER_ACCESS_REQUIRED");
  return user;
}
