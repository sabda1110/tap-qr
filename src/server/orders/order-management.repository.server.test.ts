import assert from "node:assert/strict";
import { mock, test } from "node:test";
import { editOrderSchema, manageOrderSchema, orderDraftSchema } from "./order.schemas";
import { fakeOrderFirestore } from "./order-test-fixture";
import type { OrderRecord } from "./order.types";

const firebase = require("../../lib/firebase/admin.server") as typeof import("../../lib/firebase/admin.server");
const repository = require("./order-management.repository.server") as typeof import("./order-management.repository.server");
const orderRepository = require("./order.repository.server") as typeof import("./order.repository.server");
const owner = { uid: "owner", name: "Owner", email: "owner@example.com", provider: "password" as const, role: "owner" as const };
const admin = { ...owner, uid: "admin", name: "Admin", role: "admin" as const };
const id = "a".repeat(64);
const draft = orderDraftSchema.parse({ name: "Buyer", email: owner.email, phone: "081234567890", address: "Jalan Contoh 123", shippingRegion: { province: "Jakarta", city: "Jakarta Selatan", district: "Tebet", village: "Tebet Barat" }, material: "pvc", quantity: 1, product: "wifi", theme: "poster" });

async function withOrder(run: (fixture: ReturnType<typeof fakeOrderFirestore>, get: () => OrderRecord) => Promise<void>) {
  const fixture = fakeOrderFirestore();
  const record: OrderRecord = { ...draft, code: "TQO-123456789ABC", ownerId: owner.uid, status: "on_progress", paymentStatus: "unpaid", revision: 0, carrier: "", trackingNumber: "", createdAt: "2026-10-16T00:00:00.000Z", updatedAt: "2026-10-16T00:00:00.000Z", history: [] };
  fixture.documents.set(`orders/${id}`, record);
  const replacement = mock.method(firebase, "getFirebaseAdminFirestore", () => fixture.db as unknown as ReturnType<typeof firebase.getFirebaseAdminFirestore>);
  try { await run(fixture, () => fixture.documents.get(`orders/${id}`) as OrderRecord); }
  finally { replacement.mock.restore(); }
}

test("owner edits/cancels only their unpaid pending orders; stale writes cannot overwrite", async () => withOrder(async ({ documents }, get) => {
  const edit = editOrderSchema.parse({ id, expectedRevision: 0, order: { ...draft, quantity: 2 } });
  await assert.rejects(repository.mutateOrder(edit, { ...owner, uid: "other" }), /ACCESS_DENIED/);
  await assert.rejects(repository.getOwnedOrder(id, "other"), /ACCESS_DENIED/);
  await repository.mutateOrder(edit, owner);
  assert.equal(get().quantity, 2); assert.equal(get().ownerId, owner.uid);
  await assert.rejects(repository.mutateOrder(edit, owner), /CONFLICT/);
  assert.equal(get().quantity, 2);
  await assert.rejects(repository.mutateOrder(manageOrderSchema.parse({ id, expectedRevision: 1, action: "payment", paymentStatus: "paid", reason: "Bank verified" }), owner), /ACCESS_DENIED/);
  await repository.mutateOrder(manageOrderSchema.parse({ id, expectedRevision: 1, action: "cancel", reason: "Wrong card selection" }), owner);
  assert.equal(get().status, "cancelled"); assert.equal(get().cancellationReason, "Wrong card selection");
  assert.equal(get().history[0].by, owner.uid);
  const events = [...documents.entries()].filter(([path]) => path.includes("/events/"));
  assert.equal(events.length, 2);
  assert.deepEqual(events[0][1].changes, [{ field: "quantity", before: "1", after: "2" }]);
  assert.equal(events[1][1].actorId, owner.uid);
  await assert.rejects(repository.mutateOrder(editOrderSchema.parse({ ...edit, expectedRevision: 2 }), owner), /LOCKED/);
}));

test("paid orders lock owner edits; cancellation requires recorded refund; archive retains data", async () => withOrder(async ({ documents }, get) => {
  const manage = (input: Record<string, unknown>) => repository.mutateOrder(manageOrderSchema.parse({ id, expectedRevision: get().revision ?? 0, ...input }), admin);
  await manage({ action: "payment", paymentStatus: "paid", reason: "Bank transfer received" });
  await assert.rejects(repository.mutateOrder(editOrderSchema.parse({ id, expectedRevision: 1, order: draft }), owner), /LOCKED/);
  await assert.rejects(manage({ action: "cancel", reason: "Customer requested" }), /LOCKED/);
  assert.equal(get().status, "on_progress");
  await manage({ action: "payment", paymentStatus: "refunded", reason: "Refund transfer completed" });
  await manage({ action: "cancel", reason: "Customer requested" });
  assert.equal(get().paymentStatus, "refunded"); assert.equal(get().status, "cancelled");
  await assert.rejects(repository.mutateOrder(manageOrderSchema.parse({ id, expectedRevision: 3, action: "archive", archived: true }), owner), /ACCESS_DENIED/);
  await manage({ action: "archive", archived: true });
  assert.equal(get().archived, true); assert.equal(get().phone, draft.phone);
  await manage({ action: "archive", archived: false });
  assert.equal(get().archived, false);
  assert.equal([...documents.keys()].filter((path) => path.includes("/events/")).length, 5);
}));

test("production and shipping rules lock edits and cancellation after shipping", async () => withOrder(async ({ documents }, get) => {
  const manage = (input: Record<string, unknown>) => repository.mutateOrder(manageOrderSchema.parse({ id, expectedRevision: get().revision ?? 0, ...input }), admin);
  await assert.rejects(manage({ action: "archive", archived: true }), /LOCKED/);
  await orderRepository.advanceOrder({ id, expectedRevision: 0, expectedStatus: "on_progress", status: "confirmed", carrier: "", trackingNumber: "" }, admin.uid);
  await assert.rejects(manage({ action: "production" }), /LOCKED/);
  await manage({ action: "payment", paymentStatus: "paid", reason: "Transfer checked" });
  await repository.mutateOrder(editOrderSchema.parse({ id, expectedRevision: 2, order: { ...draft, material: "acrylic" }, reason: "Agreed new card format" }), admin);
  await manage({ action: "production" });
  await assert.rejects(repository.mutateOrder(editOrderSchema.parse({ id, expectedRevision: 4, order: draft, reason: "Late edit request" }), admin), /LOCKED/);
  await orderRepository.advanceOrder({ id, expectedRevision: 4, expectedStatus: "confirmed", status: "shipped", carrier: "JNE", trackingNumber: "TEST123" }, admin.uid);
  await assert.rejects(manage({ action: "cancel", reason: "Too late to cancel" }), /LOCKED/);
  await assert.rejects(manage({ action: "payment", paymentStatus: "refunded", reason: "Late refund request" }), /LOCKED/);
  await manage({ action: "shipping", carrier: "JNE", trackingNumber: "CORRECTED123", reason: "Tracking number correction" });
  assert.equal(get().trackingNumber, "CORRECTED123"); assert.equal(get().status, "shipped");
  const events = [...documents.entries()].filter(([path]) => path.includes("/events/"));
  assert.equal(events.at(-1)?.[1].action, "shipping");
  assert.equal(get().material, "acrylic");
}));
