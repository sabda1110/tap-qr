import { getFirebaseAdminAuth } from "../../lib/firebase/admin.server";

export type FirebaseIdentity = {
  uid: string;
  email: string;
  name: string;
  provider: "google" | "password";
};

export async function verifyFirebaseIdentity(idToken: string): Promise<FirebaseIdentity> {
  const decoded = await getFirebaseAdminAuth().verifyIdToken(idToken, true);
  if (!decoded.email) throw new Error("Akun Firebase tidak memiliki email.");

  return {
    uid: decoded.uid,
    email: decoded.email,
    name: decoded.name ?? decoded.email.split("@")[0],
    provider: decoded.firebase.sign_in_provider === "google.com" ? "google" : "password",
  };
}
