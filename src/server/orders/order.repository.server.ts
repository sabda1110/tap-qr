import { createHash, randomUUID } from "node:crypto";
import { FieldPath, type DocumentSnapshot, type Query } from "firebase-admin/firestore";
import { getFirebaseAdminFirestore } from "../../lib/firebase/admin.server";
import type { UserProfile } from "../../lib/auth/user-profile";
import { canAdvanceOrder, type OrderDraft, type OrderListSearch, type UpdateOrderInput } from "./order.schemas";
import { detailOrder, summarizeOrder, type OrderList, type OrderRecord } from "./order.types";
import { orderAuditChanges } from "./order-policy";

const hash = (value: string) => createHash("sha256").update(value).digest("hex");
const orderRef = (token: string) => getFirebaseAdminFirestore().collection("orders").doc(hash(token));

export async function createOrder(token: string, draft: OrderDraft, user: UserProfile | null, ip: string) {
  const db = getFirebaseAdminFirestore();
  const ref = orderRef(token);
  const now = new Date();
  const window = Math.floor(now.getTime() / (15 * 60 * 1000));
  const rateRefs = [db.collection("orderRateLimits").doc(hash(`ip:${ip}:${window}`)),
    db.collection("orderRateLimits").doc(hash(`email:${draft.email}:${window}`))];
  return db.runTransaction(async (transaction) => {
    const existing = await transaction.get(ref);
    if (existing.exists) {
      const previous = existing.data() as OrderRecord;
      // Retrying the same request must not create a second order or expose another draft.
      const { shippingRegion, ...fields } = draft;
      const sameRegion = (Object.keys(shippingRegion) as (keyof typeof shippingRegion)[])
        .every((field) => previous.shippingRegion?.[field] === shippingRegion[field]);
      if (!sameRegion || Object.entries(fields).some(([key, value]) => previous[key as keyof typeof fields] !== value)) throw new Error("ORDER_CONFLICT");
      return summarizeOrder(ref.id, previous);
    }
    const limits = await Promise.all(rateRefs.map((rate) => transaction.get(rate)));
    if (limits.some((limit) => (limit.data()?.count ?? 0) >= 5)) throw new Error("ORDER_RATE_LIMIT");
    const at = now.toISOString();
    const order: OrderRecord = {
      ...draft, code: `TQO-${ref.id.slice(0, 12).toUpperCase()}`,
      ownerId: user?.role === "owner" ? user.uid : null,
      status: "on_progress", carrier: "", trackingNumber: "", createdAt: at, updatedAt: at,
      paymentStatus: "unpaid", productionStarted: false, revision: 0, archived: false,
      history: [{ status: "on_progress", at, by: user?.uid ?? null }],
    };
    transaction.create(ref, order);
    rateRefs.forEach((rate, index) => transaction.set(rate, { count: (limits[index].data()?.count ?? 0) + 1,
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000) }));
    return summarizeOrder(ref.id, order);
  });
}

export async function findTrackedOrder(token: string) {
  const snapshot = await orderRef(token).get();
  return snapshot.exists ? summarizeOrder(snapshot.id, snapshot.data() as OrderRecord) : null;
}

export async function listOrders(search: OrderListSearch, ownerId?: string): Promise<OrderList> {
  const db = getFirebaseAdminFirestore();
  const visible = (order: OrderRecord) => !!ownerId || !!order.archived === !!search.archived;
  if (search.code) {
    const matches = await db.collection("orders").where("code", "==", search.code).limit(5).get();
    return { orders: matches.docs.filter((doc) => visible(doc.data() as OrderRecord) && (!ownerId || doc.data().ownerId === ownerId) && (!search.status || doc.data().status === search.status))
      .map((doc) => detailOrder(doc.id, doc.data() as OrderRecord)) };
  }
  let cursor: DocumentSnapshot | undefined;
  if (search.cursor) {
    cursor = await db.collection("orders").doc(search.cursor).get();
    if (!cursor.exists || (ownerId && cursor.data()?.ownerId !== ownerId)) return { orders: [] };
  }
  let query = db.collection("orders").orderBy("createdAt", "desc").orderBy(FieldPath.documentId(), "desc");
  if (ownerId) query = query.where("ownerId", "==", ownerId);
  if (search.status) query = query.where("status", "==", search.status);
  if (cursor) query = query.startAfter(cursor);
  try {
    const limit = ownerId ? 20 : 100;
    const result = await query.limit(limit + 1).get();
    const matches = [];
    let visited = 0;
    for (const doc of result.docs.slice(0, limit)) {
      visited++;
      if (visible(doc.data() as OrderRecord)) matches.push(doc);
      if (matches.length === 20) break;
    }
    return { orders: matches.map((doc) => detailOrder(doc.id, doc.data() as OrderRecord)),
      nextCursor: visited && result.size > visited ? result.docs[visited - 1].id : undefined };
  } catch (error) {
    if (!(error instanceof Error) || !("code" in error) || error.code !== 9 || !/index/i.test(error.message)) throw error;
    // Keep ownership in the Firestore query. Apply status locally when both
    // filters would require a composite index; never scan other owners' orders.
    let fallback: Query = db.collection("orders");
    if (ownerId) fallback = fallback.where("ownerId", "==", ownerId);
    else if (search.status) fallback = fallback.where("status", "==", search.status);
    if (cursor) fallback = fallback.startAfter(cursor);
    const scanLimit = !ownerId || search.status ? 100 : 20;
    const result = await fallback.limit(scanLimit + 1).get();
    const matches = [];
    let visited = 0;
    for (const doc of result.docs.slice(0, scanLimit)) {
      visited++;
      if (visible(doc.data() as OrderRecord) && (!search.status || doc.data().status === search.status)) matches.push(doc);
      if (matches.length === 20) break;
    }
    return {
      orders: matches.sort((a, b) => String(b.data().createdAt).localeCompare(String(a.data().createdAt)) || b.id.localeCompare(a.id))
        .map((doc) => detailOrder(doc.id, doc.data() as OrderRecord)),
      nextCursor: visited && result.size > visited ? result.docs[visited - 1].id : undefined,
    };
  }
}

export async function advanceOrder(input: UpdateOrderInput, adminId: string, adminName = adminId) {
  const db = getFirebaseAdminFirestore();
  const ref = db.collection("orders").doc(input.id);
  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const order = snapshot.data() as OrderRecord | undefined;
    if (!order || order.archived || order.paymentStatus === "refunded" || (order.revision ?? 0) !== input.expectedRevision || order.status !== input.expectedStatus || !canAdvanceOrder(order.status, input.status)) throw new Error("ORDER_STATUS_CONFLICT");
    if (input.status === "shipped" && (order.paymentStatus !== "paid" || !order.productionStarted || !input.carrier || !input.trackingNumber)) throw new Error("ORDER_SHIPPING_LOCKED");
    const at = new Date().toISOString();
    const updated: OrderRecord = { ...order,
      status: input.status, updatedAt: at,
      revision: (order.revision ?? 0) + 1,
      ...(input.status === "shipped" ? { carrier: input.carrier, trackingNumber: input.trackingNumber } : {}),
      history: [...order.history, { status: input.status, at, by: adminId }],
    };
    transaction.update(ref, updated);
    transaction.create(ref.collection("events").doc(randomUUID()), { action: "status", at, actorId: adminId, actorName: adminName, reason: "", changes: orderAuditChanges(order, updated) });
  });
}
