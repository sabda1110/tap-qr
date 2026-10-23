import assert from "node:assert/strict";
import { test } from "node:test";
import { updateOutletHighlightsSchema } from "./outlet.schemas";
import { parseOutletHighlights, toPublicOutletHighlights } from "./outlet-highlights";

const highlightId = "7c5dbeb0-2ff4-4c6b-9e90-cf18ec85d573";
const imageId = "67a93af3-fec0-4c8c-a910-a76d647d08d0";
const highlight = {
  id: highlightId,
  title: "Menu",
  images: [
    {
      id: imageId,
      url: "https://res.cloudinary.com/tapqr/image/upload/story.webp",
      publicId: `tapqr/highlights/owner/outlet/${imageId}`,
    },
  ],
};

test("highlight schema enforces the 3 by 5 limit and unique IDs", () => {
  assert.equal(
    updateOutletHighlightsSchema.safeParse({
      outletId: "outlet",
      highlights: [highlight],
    }).success,
    true,
  );
  assert.equal(
    updateOutletHighlightsSchema.safeParse({
      outletId: "outlet",
      highlights: [highlight, highlight],
    }).success,
    false,
  );
  assert.equal(
    updateOutletHighlightsSchema.safeParse({
      outletId: "outlet",
      highlights: [
        { ...highlight, images: Array.from({ length: 6 }, () => highlight.images[0]) },
      ],
    }).success,
    false,
  );
});

test("public highlights omit Cloudinary public IDs and invalid records", () => {
  assert.deepEqual(parseOutletHighlights([highlight, { title: "invalid" }]), [highlight]);
  assert.deepEqual(toPublicOutletHighlights([highlight]), [
    {
      id: highlightId,
      title: "Menu",
      coverUrl:
        "https://res.cloudinary.com/tapqr/image/upload/c_fill,w_160,h_160,g_auto,q_auto:eco,f_auto/story.webp",
      images: [{ id: imageId, url: highlight.images[0].url }],
    },
  ]);
});
