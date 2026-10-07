import { getFirebaseAdminFirestore } from "../../lib/firebase/admin.server";

export async function isOutletSlugAvailable(slug: string) {
  const database = getFirebaseAdminFirestore();
  const reservation = await database.collection("outletSlugs").doc(slug).get();
  if (reservation.exists) return false;
  const existingOutlet = await database.collection("outlets").where("slug", "==", slug).limit(1).get();
  return existingOutlet.empty;
}
