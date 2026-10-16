import assert from "node:assert/strict";
import { mock, test } from "node:test";

const firebase = require("../../lib/firebase/admin.server") as typeof import("../../lib/firebase/admin.server");
const repository = require("./order.repository.server") as typeof import("./order.repository.server");

test("missing-index order lists preserve ownership, filters, and pagination", async () => {
  const records = Array.from({ length: 51 }, (_, index) => ({
    id: index.toString(16).padStart(64, "0"),
    value: { ownerId: index === 50 ? "other-owner" : "owner-1", code: `TQO-${index}`, archived: index === 45,
      status: index % 2 ? "confirmed" : "on_progress", product: "social", theme: "google", material: "pvc", quantity: 1,
      name: "Owner", email: "owner@example.com", phone: "6281234567890", address: "Private address",
      carrier: "", trackingNumber: "", createdAt: new Date(2026, 0, index + 1).toISOString(), updatedAt: "", history: [] },
  }));
  let failure: Error & { code: number } = Object.assign(new Error("The query requires an index"), { code: 9 });
  let fallbackOwnerReads = 0;
  const db = {
    collection: () => {
      const filters: { field: string; value: string }[] = [];
      let sorted = false;
      let after: string | undefined;
      let count = 21;
      const query = {
        doc: (id: string) => ({ get: async () => ({ exists: records.some((record) => record.id === id), id, data: () => records.find((record) => record.id === id)?.value }) }),
        where: (field: string, operator: string, value: string) => { assert.equal(operator, "=="); filters.push({ field, value }); return query; },
        orderBy: () => { sorted = true; return query; },
        startAfter: (cursor: { id: string }) => { after = cursor.id; return query; },
        limit: (limit: number) => { assert.ok(limit <= 101); count = limit; return query; },
        get: async () => {
          if (sorted) throw failure;
          assert.ok(filters.length <= 1, "fallback must only require a single-field index");
          if (filters.some((filter) => filter.field === "ownerId")) fallbackOwnerReads++;
          const selected = records.filter((record) => filters.every(({ field, value }) => record.value[field as keyof typeof record.value] === value) && (!after || record.id > after));
          const docs = selected.slice(0, count).map((record) => ({ id: record.id, data: () => record.value }));
          return { docs, size: docs.length };
        },
      };
      return query;
    },
  };
  const replacement = mock.method(firebase, "getFirebaseAdminFirestore", () => db as unknown as ReturnType<typeof firebase.getFirebaseAdminFirestore>);
  try {
    const first = await repository.listOrders({}, "owner-1");
    const second = await repository.listOrders({ cursor: first.nextCursor }, "owner-1");
    const third = await repository.listOrders({ cursor: second.nextCursor }, "owner-1");
    assert.equal(new Set([...first.orders, ...second.orders, ...third.orders].map((order) => order.id)).size, 50);
    assert.equal(third.nextCursor, undefined);
    assert.ok([...first.orders, ...second.orders, ...third.orders].every((order) => order.ownerId === "owner-1"));
    assert.equal((await repository.listOrders({ cursor: records[50].id }, "owner-1")).orders.length, 0);
    const filtered = await repository.listOrders({ status: "confirmed" }, "owner-1");
    const remaining = await repository.listOrders({ status: "confirmed", cursor: filtered.nextCursor }, "owner-1");
    assert.equal(new Set([...filtered.orders, ...remaining.orders].map((order) => order.id)).size, 25);
    assert.ok([...filtered.orders, ...remaining.orders].every((order) => order.status === "confirmed" && order.ownerId === "owner-1"));
    assert.ok(fallbackOwnerReads > 0);
    assert.ok((await repository.listOrders({ status: "on_progress" })).orders.every((order) => order.status === "on_progress"));
    const archived = await repository.listOrders({ archived: true, status: "confirmed" });
    assert.equal(archived.orders.length, 1); assert.equal(archived.orders[0].id, records[45].id);
    assert.ok((await repository.listOrders({ status: "confirmed" })).orders.every((order) => !order.archived));
    failure = Object.assign(new Error("Permission denied"), { code: 7 });
    await assert.rejects(repository.listOrders({}, "owner-1"), /Permission denied/);
  } finally { replacement.mock.restore(); }
});
