import assert from "node:assert/strict";
import { mock, test } from "node:test";

const firebase = require("../../lib/firebase/admin.server") as typeof import("../../lib/firebase/admin.server");
const { getPublicOutletProfile } = require("./public-profile.repository.server") as typeof import("./public-profile.repository.server");

test("card profiles isolate links and reject disabled or unrelated cards", async () => {
  const cardId = `TQR-${"A".repeat(32)}`;
  const links = (prefix: string, count: number) => Array.from({ length: count }, (_, index) => ({
    id: `${prefix}-${index}`, type: "custom", label: `${prefix} ${index}`,
    url: `https://example.com/${prefix}/${index}`, isActive: true, order: index,
  }));
  const first = {
    cardId, ownerId: "owner", outletId: "outlet", claimStatus: "claimed", isEnabled: true,
    config: { type: "social", social: { links: links("first", 3) } },
  };
  const second = { ...first, cardId: `TQR-${"B".repeat(32)}`, config: { type: "social", social: { links: links("second", 2) } } };
  const records = [first, second];
  const database = {
    collection: (name: string) => {
      if (name === "outlets") return { doc: () => ({ get: async () => ({
        exists: true, id: "outlet", data: () => ({ ownerId: "owner", status: "active", name: "Cafe" }),
      }) }) };
      const query = (field: string, operator: string, value: string) => ({
        limit: () => query(field, operator, value),
        get: async () => ({ docs: records.filter((record) => record[field as "cardId" | "outletId"] === value)
          .map((record, index) => ({ id: String(index), data: () => record })) }),
      });
      return { where: query };
    },
  };
  const replacement = mock.method(firebase, "getFirebaseAdminFirestore", () => database as unknown as ReturnType<typeof firebase.getFirebaseAdminFirestore>);
  try {
    const scoped = await getPublicOutletProfile("outlet", cardId);
    assert.equal(scoped?.links.length, 3);
    assert.ok(scoped?.links.every((link) => link.url.includes("/first/")));
    assert.equal((await getPublicOutletProfile("outlet"))?.links.length, 5);
    first.isEnabled = false;
    assert.equal(await getPublicOutletProfile("outlet", cardId), null);
    first.isEnabled = true;
    first.ownerId = "another-owner";
    assert.equal(await getPublicOutletProfile("outlet", cardId), null);
    first.ownerId = "owner";
    first.outletId = "another-outlet";
    assert.equal(await getPublicOutletProfile("outlet", cardId), null);
  } finally { replacement.mock.restore(); }
});
