import assert from "node:assert/strict";
import { test } from "node:test";
import { withNovemberPricing } from "./order-promotion";

const pricing = { pvcCard: { price: "Rp79.000" }, acrylicBoard: { price: "Rp69.000" }, businessBundle: { price: "Rp499.000" } };
test("November display promotion respects WIB boundaries without changing the base catalog", () => {
  for (const at of ["2026-10-31T16:59:59.999Z", "2026-11-30T17:00:00.000Z", "2027-11-02T00:00:00Z"]) {
    const result = withNovemberPricing(pricing, Date.parse(at));
    assert.equal(result.pvcCard.price, "Rp79.000");
    assert.equal(result.acrylicBoard.price, "Rp69.000");
    assert.equal(result.pvcCard.originalPrice, undefined);
    assert.equal(result.acrylicBoard.originalPrice, undefined);
  }
  for (const at of ["2026-10-31T17:00:00.000Z", "2026-11-30T16:59:59.999Z"]) {
    const result = withNovemberPricing(pricing, Date.parse(at));
    assert.equal(result.pvcCard.price, "Rp70.000");
    assert.equal(result.acrylicBoard.price, "Rp50.000");
    assert.equal(result.pvcCard.originalPrice, "Rp79.000");
    assert.equal(result.acrylicBoard.originalPrice, "Rp69.000");
    assert.equal(result.businessBundle.price, "Rp499.000");
  }
  assert.equal(pricing.pvcCard.price, "Rp79.000");
  assert.equal(pricing.acrylicBoard.price, "Rp69.000");
});
