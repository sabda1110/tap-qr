import assert from "node:assert/strict";
import { test } from "node:test";

import { getSocialDestinationUrl, toStoredSocialLink } from "./social-link";

const baseLink = {
  id: "link",
  label: "Social",
  isActive: true,
};

test("social usernames become official profile URLs", () => {
  assert.equal(
    getSocialDestinationUrl({
      ...baseLink,
      type: "instagram",
      value: "@tap.qr",
    }),
    "https://www.instagram.com/tap.qr",
  );
  assert.equal(
    getSocialDestinationUrl({ ...baseLink, type: "tiktok", value: "tapqr_id" }),
    "https://www.tiktok.com/@tapqr_id",
  );
});

test("WhatsApp message is stored per link and encoded in its destination", () => {
  const stored = toStoredSocialLink(
    {
      ...baseLink,
      type: "whatsapp",
      value: "081234567890",
      message: "Halo, saya ingin bertanya.",
    },
    2,
  );

  assert.equal(stored.message, "Halo, saya ingin bertanya.");
  assert.equal(
    stored.url,
    "https://wa.me/6281234567890?text=Halo%2C%20saya%20ingin%20bertanya.",
  );
  assert.equal(stored.order, 2);
});
