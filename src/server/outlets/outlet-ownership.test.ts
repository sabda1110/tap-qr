import assert from "node:assert/strict";
import { test } from "node:test";
import { assertOutletOwner } from "./outlet-ownership.ts";

test("outlet and card access requires the authenticated owner", () => {
  assert.doesNotThrow(() => assertOutletOwner("owner-a", "owner-a"));
  for (const ownerId of ["owner-b", null, undefined, ""]) {
    assert.throws(
      () => assertOutletOwner(ownerId, "owner-a"),
      /OUTLET_NOT_AVAILABLE/,
    );
  }
  assert.throws(() => assertOutletOwner("", ""), /OUTLET_NOT_AVAILABLE/);
});
