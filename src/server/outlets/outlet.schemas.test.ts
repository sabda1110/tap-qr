import assert from "node:assert/strict";
import { test } from "node:test";
import { updateOutletSchema } from "./outlet.schemas";

test("outlets created through card claim remain editable without a phone number", () => {
  const claimedOutlet = {
    id: "outlet-a", outletName: "Kopi Kita", slug: "kopi-kita",
    address: "Jalan Merdeka 10", phone: "", status: "active",
  };
  assert.equal(updateOutletSchema.safeParse(claimedOutlet).success, true);
  assert.equal(updateOutletSchema.safeParse({ ...claimedOutlet, phone: "628123456789" }).success, true);
  assert.equal(updateOutletSchema.safeParse({ ...claimedOutlet, phone: "not-a-number" }).success, false);
});
