import { createHash } from "node:crypto";
import { FieldPath, type DocumentSnapshot } from "firebase-admin/firestore";
import type { z } from "zod";
import { getFirebaseAdminFirestore } from "../../lib/firebase/admin.server";
import type { phoneOrderLookupSchema } from "./order.schemas";
import { phoneOrderSummary, type OrderRecord, type PhoneOrderList } from "./order.types";

export async function lookupOrdersByPhone(input: z.infer<typeof phoneOrderLookupSchema>, ip: string): Promise<PhoneOrderList> {
  const db = getFirebaseAdminFirestore();
  const now = Date.now();
  const key = createHash("sha256").update(`phone-lookup:${ip}:${Math.floor(now / 900_000)}`).digest("hex");
  const rate = db.collection("orderRateLimits").doc(key);
  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(rate);
    const count = snapshot.data()?.count ?? 0;
    if (count >= 15) throw new Error("ORDER_RATE_LIMIT");
    transaction.set(rate, { count: count + 1, expiresAt: new Date(now + 86_400_000) });
  });
  let cursor: DocumentSnapshot | undefined;
  if (input.cursor) {
    cursor = await db.collection("orders").doc(input.cursor).get();
    if (!cursor.exists || cursor.data()?.phone !== input.phone) return { orders: [] };
  }
  const pageQuery = (chronological: boolean) => {
    let query = db.collection("orders").where("phone", "==", input.phone);
    if (chronological) query = query.orderBy("createdAt", "desc").orderBy(FieldPath.documentId(), "desc");
    if (cursor) query = query.startAfter(cursor);
    return query.limit(21);
  };
  let result;
  try { result = await pageQuery(true).get(); }
  catch (error) {
    if (!(error instanceof Error) || !("code" in error) || error.code !== 9 || !/index/i.test(error.message)) throw error;
    // Equality uses Firestore's automatic single-field index. Keep reads bounded
    // and cursors in query order; sort only this page until the composite is ready.
    result = await pageQuery(false).get();
  }
  const page = result.docs.slice(0, 20).sort((a, b) => String(b.data().createdAt).localeCompare(String(a.data().createdAt)) || b.id.localeCompare(a.id));
  return { orders: page.map((doc) => phoneOrderSummary(doc.data() as OrderRecord)),
    nextCursor: result.size > 20 ? result.docs[19].id : undefined };
}
