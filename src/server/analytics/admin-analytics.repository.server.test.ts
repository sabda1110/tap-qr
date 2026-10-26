import assert from "node:assert/strict";
import { mock, test } from "node:test";

const firebase = require("../../lib/firebase/admin.server") as typeof import("../../lib/firebase/admin.server");
const { getAdminAnalyticsSummary } = require("./admin-analytics.repository.server") as typeof import("./admin-analytics.repository.server");

test("analytics distinguishes valid zero counts from failed database reads", async () => {
  let failCounts = false;
  let failOutlets = false;
  let ordered = false;
  const query = {
    where: () => query,
    orderBy: (field: string, direction: string) => {
      assert.equal(field, "createdAt"); assert.equal(direction, "desc"); ordered = true; return query;
    },
    limit: () => query,
    count: () => ({ get: async () => {
      if (failCounts) throw Object.assign(new Error("Unavailable"), { code: 14 });
      return { data: () => ({ count: 0 }) };
    } }),
    get: async () => {
      if (failOutlets) throw new Error("Outlets unavailable");
      return { docs: [] };
    },
  };
  const replacement = mock.method(firebase, "getFirebaseAdminFirestore", () => ({ collection: () => query }) as unknown as ReturnType<typeof firebase.getFirebaseAdminFirestore>);
  const logging = mock.method(console, "error", () => {});
  try {
    const summary = await getAdminAnalyticsSummary();
    assert.equal(summary.scans.total, 0);
    assert.equal(summary.cards.total, 0);
    assert.equal(ordered, true);
    failCounts = true;
    await assert.rejects(getAdminAnalyticsSummary(), /ADMIN_ANALYTICS_UNAVAILABLE/);
    assert.ok(logging.mock.calls.length > 0);
    failCounts = false;
    failOutlets = true;
    await assert.rejects(getAdminAnalyticsSummary(), /Outlets unavailable/);
  } finally { replacement.mock.restore(); logging.mock.restore(); }
});
