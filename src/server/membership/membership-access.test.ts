import assert from "node:assert/strict";
import test from "node:test";
import { isMembershipAddonActive } from "./membership-access";

const now = Date.parse("2026-12-20T06:16:48.606Z");

test("membership entitlement requires enabled and a future expiry", () => {
  assert.equal(isMembershipAddonActive({ enabled: false, expiresAt: null }, now), false);
  assert.equal(isMembershipAddonActive({ enabled: true, expiresAt: null }, now), true);
  assert.equal(isMembershipAddonActive({ enabled: true, expiresAt: "2026-12-20T06:16:48.607Z" }, now), true);
  assert.equal(isMembershipAddonActive({ enabled: true, expiresAt: "2026-12-20T06:16:48.606Z" }, now), false);
  assert.equal(isMembershipAddonActive({ enabled: true, expiresAt: "invalid" }, now), false);
});
