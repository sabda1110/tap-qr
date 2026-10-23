import assert from "node:assert/strict";
import { test } from "node:test";
import { getStoryImageLayout } from "./story-image";

test("landscape story images fit fully inside a portrait canvas by default", () => {
  const layout = getStoryImageLayout(1600, 900, 1080, 1920, {
    zoom: 1,
    positionX: 0,
    positionY: 0,
  });
  assert.equal(layout.drawWidth, 1080);
  assert.equal(layout.drawHeight, 607.5);
  assert.equal(layout.drawX, 0);
  assert.equal(layout.drawY, 656.25);
  assert.ok(layout.fillZoom > 3);
});

test("position controls keep a fitted landscape image inside the canvas", () => {
  const top = getStoryImageLayout(1600, 900, 1080, 1920, {
    zoom: 1,
    positionX: 0,
    positionY: -100,
  });
  const bottom = getStoryImageLayout(1600, 900, 1080, 1920, {
    zoom: 1,
    positionX: 0,
    positionY: 100,
  });
  assert.equal(top.drawY, 0);
  assert.equal(bottom.drawY + bottom.drawHeight, 1920);
});
