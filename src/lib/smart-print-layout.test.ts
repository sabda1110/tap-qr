import assert from "node:assert/strict";
import { test } from "node:test";
import { getSmartSheetLayout, chunkCardsForPrint } from "./smart-print-layout";

test("artwork paper returns 1 card per sheet matching card dimensions", () => {
  const layout = getSmartSheetLayout(74, 105, "artwork");
  assert.equal(layout.cols, 1);
  assert.equal(layout.rows, 1);
  assert.equal(layout.capacityPerSheet, 1);
  assert.equal(layout.sheetWidthMm, 74);
  assert.equal(layout.sheetHeightMm, 105);
});

test("A7 cards on A3 paper fit multiple cards per sheet", () => {
  const layout = getSmartSheetLayout(74, 105, "a3");
  assert.ok(layout.capacityPerSheet >= 6, `Expected at least 6 cards, got ${layout.capacityPerSheet}`);
  assert.equal(layout.sheetWidthMm, 297);
  assert.equal(layout.sheetHeightMm, 420);
});

test("A7 cards on A4 paper fit 4 cards per sheet (2x2)", () => {
  const layout = getSmartSheetLayout(74, 105, "a4");
  assert.equal(layout.cols, 2);
  assert.equal(layout.rows, 2);
  assert.equal(layout.capacityPerSheet, 4);
});

test("PVC cards on A4 fit multiple rows", () => {
  const layout = getSmartSheetLayout(86, 54, "a4");
  assert.ok(layout.capacityPerSheet >= 8, `Expected at least 8 cards, got ${layout.capacityPerSheet}`);
});

test("chunkCardsForPrint divides card IDs across sheets accurately", () => {
  const cards = ["c1", "c2", "c3", "c4", "c5", "c6", "c7"];
  const sheets = chunkCardsForPrint(cards, 4);
  assert.equal(sheets.length, 2);
  assert.deepEqual(sheets[0], ["c1", "c2", "c3", "c4"]);
  assert.deepEqual(sheets[1], ["c5", "c6", "c7"]);
});
