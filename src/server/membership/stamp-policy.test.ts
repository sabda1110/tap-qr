import assert from "node:assert/strict";
import test from "node:test";
import { stampDayKey, stampExpiryTime, stampsHaveExpired } from "./stamp-policy";

test("stamp day limit follows WIB calendar days", () => {
  assert.equal(stampDayKey(new Date("2026-11-01T16:59:59.000Z")), "2026-11-01");
  assert.equal(stampDayKey(new Date("2026-11-01T17:00:00.000Z")), "2026-11-02");
});

test("stamp expiry is counted from the latest stamp", () => {
  const last = "2026-11-01T10:00:00.000Z";
  const expiry = stampExpiryTime(last, { stampExpiryValue: 2, stampExpiryUnit: "day" });
  assert.equal(stampsHaveExpired(last, { stampExpiryValue: 2, stampExpiryUnit: "day" }, expiry! - 1), false);
  assert.equal(stampsHaveExpired(last, { stampExpiryValue: 2, stampExpiryUnit: "day" }, expiry!), true);
  assert.equal(stampExpiryTime(last, { stampExpiryValue: 1, stampExpiryUnit: "month" }), Date.parse("2026-12-01T10:00:00.000Z"));
  assert.equal(stampExpiryTime("2026-01-31T10:00:00.000Z", { stampExpiryValue: 1, stampExpiryUnit: "month" }), Date.parse("2026-02-28T10:00:00.000Z"));
});
