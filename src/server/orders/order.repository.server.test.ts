import assert from "node:assert/strict";
import { mock, test } from "node:test";
import type { OrderRecord } from "./order.types";
import { orderDraftSchema } from "./order.schemas";
import { fakeOrderFirestore } from "./order-test-fixture";

// CommonJS test runner keeps the lazy Admin helper replaceable without Firebase credentials.
const firebase = require("../../lib/firebase/admin.server") as typeof import("../../lib/firebase/admin.server");
const repository = require("./order.repository.server") as typeof import("./order.repository.server");

test("order transactions protect retries, ownership, sequential status, and guest privacy", async () => {
  const { db, documents } = fakeOrderFirestore();
  const replacement = mock.method(firebase, "getFirebaseAdminFirestore", () => db as unknown as ReturnType<typeof firebase.getFirebaseAdminFirestore>);
  const draft = orderDraftSchema.parse({ name: "Guest", email: "guest@example.com", phone: "081234567890", address: "Jalan Contoh 123, Jakarta", shippingRegion: { province: "DKI Jakarta", city: "Jakarta Selatan", district: "Tebet", village: "Tebet Barat" }, product: "wifi", theme: "poster", material: "pvc", quantity: 2 });
  const token = "a".repeat(64);
  const user = { uid: "owner-1", email: "guest@example.com", name: "Guest", provider: "password" as const, role: "owner" as const };
  try {
    const created = await repository.createOrder(token, draft, null, "127.0.0.1");
    assert.equal(created.status, "on_progress");
    assert.equal(documents.get(`orders/${created.id}`)?.ownerId, null);
    // Firestore can return map keys in a different order from the submitted object.
    const persisted = documents.get(`orders/${created.id}`)!;
    persisted.shippingRegion = Object.fromEntries(Object.entries(draft.shippingRegion).reverse());
    assert.deepEqual(await repository.createOrder(token, JSON.parse(JSON.stringify(draft)), null, "127.0.0.1"), created);
    assert.equal([...documents.keys()].filter((key) => key.startsWith("orders/") && key.split("/").length === 2).length, 1);
    await assert.rejects(repository.createOrder(token, { ...draft, quantity: 3 }, null, "127.0.0.1"), /ORDER_CONFLICT/);
    await assert.rejects(repository.createOrder(token, { ...draft, shippingRegion: { ...draft.shippingRegion, district: "Other district" } }, null, "127.0.0.1"), /ORDER_CONFLICT/);

    const advance = { id: created.id, expectedRevision: 0, expectedStatus: "on_progress" as const, status: "confirmed" as const, carrier: "", trackingNumber: "" };
    await repository.advanceOrder(advance, "admin-1");
    await assert.rejects(repository.advanceOrder(advance, "admin-2"), /ORDER_STATUS_CONFLICT/);
    await assert.rejects(repository.advanceOrder({ ...advance, expectedStatus: "confirmed", status: "completed" }, "admin-1"), /ORDER_STATUS_CONFLICT/);
    const confirmed = documents.get(`orders/${created.id}`)!;
    confirmed.paymentStatus = "paid"; confirmed.productionStarted = true;
    await repository.advanceOrder({ ...advance, expectedRevision: 1, expectedStatus: "confirmed", status: "shipped", carrier: "Courier", trackingNumber: "RESI123" }, "admin-1");
    await repository.advanceOrder({ ...advance, expectedRevision: 2, expectedStatus: "shipped", status: "completed" }, "admin-1");
    const tracked = await repository.findTrackedOrder(token);
    assert.equal(tracked?.status, "completed");
    assert.equal(tracked?.trackingNumber, "RESI123");
    assert.equal(tracked?.history.length, 4);
    assert.equal("customer" in (tracked ?? {}), false);
    const stored = documents.get(`orders/${created.id}`) as OrderRecord;
    assert.equal(stored.history[3].by, "admin-1");
    assert.equal("token" in stored, false);
    assert.equal("payload" in stored, false);

    for (const char of ["b", "c", "d", "e"]) await repository.createOrder(char.repeat(64), draft, user, "127.0.0.1");
    assert.equal(documents.get(`orders/${created.id}`)?.ownerId, null);
    assert.equal([...documents.entries()].filter(([path, order]) => path.startsWith("orders/") && path.split("/").length === 2 && order.ownerId === user.uid).length, 4);
    await assert.rejects(repository.createOrder("f".repeat(64), draft, user, "127.0.0.1"), /ORDER_RATE_LIMIT/);
    assert.equal([...documents.keys()].filter((key) => key.startsWith("orders/") && key.split("/").length === 2).length, 5);
  } finally { replacement.mock.restore(); }
});
