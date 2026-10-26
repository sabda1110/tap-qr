import assert from "node:assert/strict";
import { mock, test } from "node:test";

const firebase = require("../../lib/firebase/admin.server") as typeof import("../../lib/firebase/admin.server");
const repository = require("./public-profile.repository.server") as typeof import("./public-profile.repository.server");

test("public profiles query only the requested outlet and exclude invalid ownership or inactive cards", async () => {
  let cardQueries = 0;
  const events: Record<string, unknown>[] = [];
  const card = (id: string, ownerId: string, outletId: string, enabled = true) => ({
    id,
    data: () => ({ ownerId, outletId, claimStatus: "claimed", isEnabled: enabled, config: {
      type: "social", social: { links: [{ id, type: "custom", label: id, url: `https://example.com/${id}`, isActive: true, order: 0 }] },
    } }),
  });
  const cards = [card("valid", "owner-1", "outlet-1"), card("wrong-owner", "owner-2", "outlet-1"), card("disabled", "owner-1", "outlet-1", false), card("other-outlet", "owner-1", "outlet-2")];
  const outlet = { id: "outlet-1", exists: true, data: () => ({ ownerId: "owner-1", status: "active", name: "Outlet", slug: "outlet" }) };
  const db = {
    collection: (name: string) => {
      if (name === "outlets") return { doc: () => ({ get: async () => outlet }) };
      if (name === "scanEvents") return { add: async (event: Record<string, unknown>) => { events.push(event); } };
      assert.equal(name, "cards");
      return { where: (field: string, operator: string, value: string) => {
        assert.equal(field, "outletId"); assert.equal(operator, "=="); assert.equal(value, "outlet-1");
        cardQueries++;
        return { get: async () => ({ docs: cards.filter((item) => item.data().outletId === value) }) };
      } };
    },
  };
  const replacement = mock.method(firebase, "getFirebaseAdminFirestore", () => db as unknown as ReturnType<typeof firebase.getFirebaseAdminFirestore>);
  try {
    const profile = await repository.getPublicOutletProfile("outlet-1");
    assert.deepEqual(profile?.links.map((link) => link.label), ["valid"]);
    assert.equal(cardQueries, 1);
    await repository.recordPublicProfileView("outlet-1");
    assert.equal(cardQueries, 1, "recording a view must not load card collections again");
    assert.equal(events[0].outletId, "outlet-1");
    assert.equal(events[0].event, "profile_view");
  } finally { replacement.mock.restore(); }
});
