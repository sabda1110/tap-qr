import assert from "node:assert/strict";
import { mock, test } from "node:test";
import { fakeOrderFirestore } from "../orders/order-test-fixture";

const firebase = require("../../lib/firebase/admin.server") as typeof import("../../lib/firebase/admin.server");
const { allowPublicEvent } = require("./public-event-limiter.server") as typeof import("./public-event-limiter.server");

test("analytics deduplicates a browser without suppressing other customers on shared WiFi", async () => {
  const { db, documents } = fakeOrderFirestore();
  const replacement = mock.method(firebase, "getFirebaseAdminFirestore", () => db as unknown as ReturnType<typeof firebase.getFirebaseAdminFirestore>);
  const context = { ip: "shared-shop-ip", visitorId: "browser-one" };
  try {
    assert.equal(await allowPublicEvent("profile:outlet-one", context, 60_000), true);
    assert.equal(await allowPublicEvent("profile:outlet-one", context, 60_100), false);
    assert.equal(await allowPublicEvent("profile:outlet-one", { ...context, visitorId: "browser-two" }, 60_100), true);
    assert.equal(await allowPublicEvent("action:outlet-one:google_review", context, 60_200), true);
    assert.equal(await allowPublicEvent("profile:outlet-one", context, 65_000), true);
    const stored = JSON.stringify([...documents]);
    assert.ok(!stored.includes(context.ip));
    assert.ok(!stored.includes(context.visitorId));
    assert.ok([...documents.values()].every((value) => value.expiresAt instanceof Date));
    assert.equal([...documents.values()].find((value) => "count" in value)?.count, 4);
  } finally { replacement.mock.restore(); }
});

test("analytics limits rotating visitors per IP and resets the minute window", async () => {
  const { db } = fakeOrderFirestore();
  const replacement = mock.method(firebase, "getFirebaseAdminFirestore", () => db as unknown as ReturnType<typeof firebase.getFirebaseAdminFirestore>);
  try {
    for (let index = 0; index < 120; index++) {
      assert.equal(await allowPublicEvent("profile:outlet-one", { ip: "same-ip", visitorId: `visitor-${index}` }, 60_000 + index), true);
    }
    assert.equal(await allowPublicEvent("profile:outlet-two", { ip: "same-ip", visitorId: "new-browser" }, 61_000), false);
    assert.equal(await allowPublicEvent("profile:outlet-two", { ip: "other-ip", visitorId: "other-browser" }, 61_000), true);
    assert.equal(await allowPublicEvent("profile:outlet-two", { ip: "same-ip", visitorId: "new-browser" }, 120_000), true);
  } finally { replacement.mock.restore(); }
});
