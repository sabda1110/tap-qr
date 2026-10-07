import { getFirebaseAdminAuth } from "../../lib/firebase/admin.server";

export async function isOwnerEmailAvailable(email: string) {
  try {
    await getFirebaseAdminAuth().getUserByEmail(email);
    return false;
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "auth/user-not-found") return true;
    throw error;
  }
}
