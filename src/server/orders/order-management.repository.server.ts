import { randomUUID } from "node:crypto";
import type { z } from "zod";
import { getFirebaseAdminFirestore } from "../../lib/firebase/admin.server";
import type { UserProfile } from "../../lib/auth/user-profile";
import type { editOrderSchema, manageOrderSchema } from "./order.schemas";
import { canAdminEditOrder, canCancelOrder, canEditOrder, orderAuditChanges } from "./order-policy";
import { detailOrder, type OrderAudit, type OrderRecord } from "./order.types";

export async function getOwnedOrder(id: string, uid: string) {
  const doc = await getFirebaseAdminFirestore().collection("orders").doc(id).get();
  const order = doc.data() as OrderRecord | undefined;
  if (!order || order.ownerId !== uid) throw new Error("ORDER_ACCESS_DENIED");
  return detailOrder(doc.id, order);
}

export async function getAdminOrderForEdit(id: string) {
  const doc = await getFirebaseAdminFirestore().collection("orders").doc(id).get();
  if (!doc.exists) throw new Error("ORDER_NOT_FOUND");
  return detailOrder(doc.id, doc.data() as OrderRecord);
}

export async function mutateOrder(input: z.infer<typeof editOrderSchema> | z.infer<typeof manageOrderSchema>, actor: UserProfile) {
  const db = getFirebaseAdminFirestore();
  const ref = db.collection("orders").doc(input.id);
  const admin = actor.role === "admin";
  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(ref);
    const previous = doc.data() as OrderRecord | undefined;
    if (!previous || (!admin && previous.ownerId !== actor.uid)) throw new Error("ORDER_ACCESS_DENIED");
    if ((previous.revision ?? 0) !== input.expectedRevision) throw new Error("ORDER_CONFLICT");
    const next = { ...previous };
    const action = "order" in input ? "edit" : input.action;
    let reason = "";
    if ("order" in input) {
      if (admin ? !canAdminEditOrder(previous) || input.reason.length < 5 : !canEditOrder(previous)) throw new Error("ORDER_LOCKED");
      Object.assign(next, input.order);
      reason = input.reason;
    } else if (input.action === "cancel") {
      if (!canCancelOrder(previous, admin)) throw new Error("ORDER_LOCKED");
      next.status = "cancelled"; next.cancellationReason = input.reason; reason = input.reason;
    } else {
      if (!admin) throw new Error("ORDER_ACCESS_DENIED");
      if (input.action === "payment") {
        const current = previous.paymentStatus ?? "unpaid";
        const paid = current === "unpaid" && input.paymentStatus === "paid" && previous.status !== "cancelled" && !previous.archived;
        const refunded = current === "paid" && input.paymentStatus === "refunded" && ["on_progress", "confirmed"].includes(previous.status) && !previous.archived;
        if (!paid && !refunded) throw new Error("ORDER_LOCKED");
        next.paymentStatus = input.paymentStatus; reason = input.reason;
      } else if (input.action === "production") {
        if (previous.status !== "confirmed" || previous.productionStarted || previous.paymentStatus !== "paid" || previous.archived) throw new Error("ORDER_LOCKED");
        next.productionStarted = true;
      } else if (input.action === "shipping") {
        if (previous.status !== "shipped" || previous.archived) throw new Error("ORDER_LOCKED");
        next.carrier = input.carrier; next.trackingNumber = input.trackingNumber; reason = input.reason;
      } else {
        if (!["completed", "cancelled"].includes(previous.status) || !!previous.archived === input.archived) throw new Error("ORDER_LOCKED");
        next.archived = input.archived;
      }
    }
    const at = new Date().toISOString();
    next.updatedAt = at; next.revision = (previous.revision ?? 0) + 1;
    if (next.status !== previous.status) next.history = [...previous.history, { status: next.status, at, by: actor.uid }];
    const audit: Omit<OrderAudit, "id"> = { action, at, actorId: actor.uid, actorName: actor.name, reason, changes: orderAuditChanges(previous, next) };
    transaction.update(ref, next);
    transaction.create(ref.collection("events").doc(randomUUID()), audit);
  });
}

export async function listOrderAudit(id: string): Promise<OrderAudit[]> {
  const docs = await getFirebaseAdminFirestore().collection("orders").doc(id).collection("events").orderBy("at", "desc").limit(20).get();
  return docs.docs.map((doc) => ({ ...doc.data(), id: doc.id } as OrderAudit));
}
