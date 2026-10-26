import { createHash } from "node:crypto";
import { getFirebaseAdminFirestore } from "../../lib/firebase/admin.server";

const digest = (value: string) => createHash("sha256").update(value).digest("hex");

export type PublicAnalyticsContext = { ip: string; visitorId: string };

// Bound writes per IP; deduplicate per anonymous browser so customers sharing
// a shop's WiFi do not suppress one another's activity.
export async function allowPublicEvent(key: string, context: PublicAnalyticsContext, now = Date.now()) {
  const db = getFirebaseAdminFirestore();
  const window = Math.floor(now / 60_000);
  const rate = db.collection("analyticsRateLimits").doc(digest(`rate:${context.ip}:${window}`));
  const duplicate = db.collection("analyticsRateLimits").doc(digest(`event:${context.visitorId}:${key}`));
  return db.runTransaction(async (transaction) => {
    const [limit, previous] = await Promise.all([transaction.get(rate), transaction.get(duplicate)]);
    if ((limit.data()?.count ?? 0) >= 120) return false;
    const lastAt = previous.data()?.lastAt;
    if (typeof lastAt === "number" && now - lastAt < 5_000) return false;
    const expiresAt = new Date(now + 86_400_000);
    transaction.set(rate, { count: (limit.data()?.count ?? 0) + 1, expiresAt });
    transaction.set(duplicate, { lastAt: now, expiresAt });
    return true;
  });
}
