import assert from "node:assert/strict";
import { test } from "node:test";
import { checkoutSearchSchema } from "./checkout-search";

test("checkout material selection accepts supported media and ignores invalid query values", () => {
  assert.deepEqual(checkoutSearchSchema.parse({ material: "pvc", ownerId: "forged" }), { material: "pvc" });
  assert.deepEqual(checkoutSearchSchema.parse({ material: "acrylic" }), { material: "acrylic" });
  assert.equal(checkoutSearchSchema.parse({ material: "business" }).material, undefined);
  assert.equal(checkoutSearchSchema.parse({ material: ["pvc", "acrylic"] }).material, undefined);
  assert.deepEqual(checkoutSearchSchema.parse({}), {});
});
