import assert from "node:assert/strict";
import { mock, test } from "node:test";
import { phoneOrderLookupSchema } from "./order.schemas";

const firebase = require("../../lib/firebase/admin.server") as typeof import("../../lib/firebase/admin.server");
const repository = require("./phone-order.repository.server") as typeof import("./phone-order.repository.server");

test("phone lookup normalizes local/international formats and rejects invalid input", () => {
  for (const phone of ["081234567890", "6281234567890", "+62 812-3456-7890"]) {
    assert.equal(phoneOrderLookupSchema.parse({ phone }).phone, "6281234567890");
  }
  assert.equal(phoneOrderLookupSchema.safeParse({ phone: "0812" }).success, false);
  assert.equal(phoneOrderLookupSchema.safeParse({ phone: "6281234567890", cursor: "invalid" }).success, false);
});

test("phone lookup isolates numbers, paginates, hides private fields, and rate-limits", async () => {
  const records = Array.from({ length: 23 }, (_, index) => ({
    id: index.toString(16).padStart(64, "0"),
    data: {
      phone: index === 22 ? "6289999999999" : "6281234567890", code: `TQO-${index.toString().padStart(12, "0")}`,
      product: "social", material: "acrylic", theme: "google", quantity: 1, status: "shipped",
      createdAt: new Date(2026, 0, index + 1).toISOString(), name: "Private name", email: "private@example.com",
      address: "Private address", shippingRegion: { province: "Private province" }, ownerId: "private-owner",
      carrier: "Private courier", trackingNumber: "Private tracking", history: [{ by: "private-admin" }],
    },
  }));
  const counters = new Map<string, number>();
  let missingIndex = false;
  const snapshot = (id: string) => ({ exists: records.some((record) => record.id === id), id, data: () => records.find((record) => record.id === id)?.data });
  const db = {
    collection: (name: string) => {
      let phone = "";
      let after: string | undefined;
      let limit = 21;
      let chronological = false;
      const query = {
        doc: (id: string) => ({ id, get: async () => snapshot(id) }),
        where: (field: string, operator: string, value: string) => { assert.equal(field, "phone"); assert.equal(operator, "=="); phone = value; return query; },
        orderBy: () => { chronological = true; return query; },
        startAfter: (cursor: { id: string }) => { after = cursor.id; return query; },
        limit: (count: number) => { limit = count; return query; },
        get: async () => {
          assert.equal(name, "orders");
          if (missingIndex && chronological) throw Object.assign(new Error("The query requires an index"), { code: 9 });
          let matches = records.filter((record) => record.data.phone === phone);
          if (chronological) matches = matches.reverse();
          if (after) matches = matches.slice(matches.findIndex((record) => record.id === after) + 1);
          const docs = matches.slice(0, limit).map((record) => ({ id: record.id, data: () => record.data }));
          return { docs, size: docs.length };
        },
      };
      return query;
    },
    runTransaction: async (handler: (transaction: {
      get: (ref: { id: string }) => Promise<{ data: () => { count: number } }>;
      set: (ref: { id: string }, data: { count: number }) => void;
    }) => Promise<void>) => handler({ get: async (ref) => ({ data: () => ({ count: counters.get(ref.id) ?? 0 }) }), set: (ref, data) => { counters.set(ref.id, data.count); } }),
  };
  const replacement = mock.method(firebase, "getFirebaseAdminFirestore", () => db as unknown as ReturnType<typeof firebase.getFirebaseAdminFirestore>);
  try {
    const first = await repository.lookupOrdersByPhone({ phone: "6281234567890" }, "test-ip");
    assert.equal(first.orders.length, 20);
    assert.ok(first.nextCursor);
    for (const order of first.orders) {
      for (const key of ["id", "phone", "email", "address", "name", "shippingRegion", "ownerId", "history", "token"]) assert.equal(key in order, false);
      assert.equal(order.carrier, "Private courier");
      assert.equal(order.trackingNumber, "Private tracking");
    }
    const next = await repository.lookupOrdersByPhone({ phone: "6281234567890", cursor: first.nextCursor }, "test-ip");
    assert.equal(next.orders.length, 2);
    assert.equal(next.nextCursor, undefined);
    assert.equal(first.orders.some((order) => next.orders.some((other) => other.code === order.code)), false);
    assert.equal((await repository.lookupOrdersByPhone({ phone: "6281234567890", cursor: records[22].id }, "test-ip")).orders.length, 0);
    assert.equal((await repository.lookupOrdersByPhone({ phone: "6280000000000" }, "test-ip")).orders.length, 0);
    missingIndex = true;
    const fallback = await repository.lookupOrdersByPhone({ phone: "6281234567890" }, "fallback-ip");
    assert.equal(fallback.orders.length, 20);
    const remainder = await repository.lookupOrdersByPhone({ phone: "6281234567890", cursor: fallback.nextCursor }, "fallback-ip");
    assert.equal(remainder.orders.length, 2);
    assert.equal(new Set([...fallback.orders, ...remainder.orders].map((order) => order.code)).size, 22);
    missingIndex = false;
    for (let index = 4; index < 15; index++) await repository.lookupOrdersByPhone({ phone: "6281234567890" }, "test-ip");
    await assert.rejects(repository.lookupOrdersByPhone({ phone: "6281234567890" }, "test-ip"), /ORDER_RATE_LIMIT/);
  } finally { replacement.mock.restore(); }
});
