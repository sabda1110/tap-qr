import assert from "node:assert/strict";
import { test } from "node:test";
import { BASE_CARD_WIDTH, BASE_CARD_HEIGHT, PVC_CARD_WIDTH, PVC_CARD_HEIGHT, getPrintPlacement, getPrintPaper } from "./print-dimensions";

const toMm = (pixels: number) => pixels * 25.4 / 96;
const near = (actual: number, expected: number) => assert.ok(Math.abs(actual - expected) < 0.00001);

test("A7, A6 and A5 retain different physical sizes on the same A4 paper", () => {
  const heights = [105, 148, 210];
  const widths = [74, 105, 148];
  const scales = widths.map((width, index) => {
    assert.deepEqual(getPrintPaper(width, heights[index], "a4"), { widthMm: 210, heightMm: 297 });
    assert.deepEqual(getPrintPaper(width, heights[index], "artwork"), { widthMm: width, heightMm: heights[index] });
    return getPrintPlacement(width, heights[index]).scale;
  });
  assert.ok(scales[0] < scales[1] && scales[1] < scales[2]);
  near(scales[2] / scales[0], 2);
});

test("custom sheets use landscape A4 if possible and preserve oversize dimensions", () => {
  assert.deepEqual(getPrintPaper(250, 180, "a4"), { widthMm: 297, heightMm: 210 });
  assert.deepEqual(getPrintPaper(400, 500, "a4"), { widthMm: 400, heightMm: 500 });
});

test("acrylic artwork fits A7, A6 and A5 without stretching or overflowing", () => {
  for (const [width, height] of [[74, 105], [105, 148], [148, 210]]) {
    const placement = getPrintPlacement(width, height);
    const printedWidth = toMm(BASE_CARD_WIDTH * placement.scale);
    const printedHeight = toMm(BASE_CARD_HEIGHT * placement.scale);
    assert.ok(printedWidth <= width + 0.00001);
    assert.ok(printedHeight <= height + 0.00001);
    near(printedWidth / printedHeight, 380 / 550);
    near(placement.leftMm * 2 + printedWidth, width);
    near(placement.topMm * 2 + printedHeight, height);
  }
});

test("PVC retains its exact 86 by 54 mm size", () => {
  const placement = getPrintPlacement(86, 54, PVC_CARD_WIDTH, PVC_CARD_HEIGHT);
  near(toMm(PVC_CARD_WIDTH * placement.scale), 86);
  near(toMm(PVC_CARD_HEIGHT * placement.scale), 54);
  near(placement.leftMm, 0);
  near(placement.topMm, 0);
});

test("crop marks have room outside artwork, including landscape custom sheets", () => {
  for (const [width, height] of [[148, 210], [210, 148]]) {
    const placement = getPrintPlacement(width, height, 380, 550, true);
    assert.ok(placement.leftMm >= 4 - 0.00001);
    assert.ok(placement.topMm >= 4 - 0.00001);
    assert.ok(placement.leftMm + toMm(380 * placement.scale) <= width - 4 + 0.00001);
    assert.ok(placement.topMm + toMm(550 * placement.scale) <= height - 4 + 0.00001);
  }
});
