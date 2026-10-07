import assert from "node:assert/strict";
import { test } from "node:test";
import type { SocialLink } from "./firebase/firestore-schema";
import { copySocialLinks } from "./outlet-link-copy";

test("selected links become independent copies with fresh IDs", () => {
  const source: SocialLink[] = [
    {
      id: "ig",
      type: "instagram",
      label: "Instagram",
      url: "https://instagram.com/kopi",
      isActive: true,
      order: 0,
    },
    {
      id: "tt",
      type: "tiktok",
      label: "TikTok",
      url: "https://tiktok.com/@kopi",
      isActive: false,
      order: 1,
    },
  ];
  const snapshot = structuredClone(source);
  const copied = copySocialLinks(source.filter((link) => link.id === "ig"));
  assert.equal(copied.length, 1);
  assert.equal(copied[0].type, "instagram");
  assert.equal(copied[0].value, source[0].url);
  assert.notEqual(copied[0].id, source[0].id);
  assert.notEqual(copySocialLinks([source[0]])[0].id, copied[0].id);
  copied[0].label = "New outlet Instagram";
  copied[0].value = "https://instagram.com/new-outlet";
  assert.deepEqual(source, snapshot);
  assert.equal(copySocialLinks([source[1]])[0].isActive, false);
});

test("copied WhatsApp and Google URLs become editable destination inputs", () => {
  const source: SocialLink[] = [
    {
      id: "wa",
      type: "whatsapp",
      label: "WhatsApp",
      url: "https://wa.me/628123456789",
      isActive: true,
      order: 0,
    },
    {
      id: "google",
      type: "google_review",
      label: "Google Review",
      url: "https://search.google.com/local/writereview?placeid=ChIJExample",
      isActive: true,
      order: 1,
    },
  ];
  const copied = copySocialLinks(source);
  assert.equal(copied[0].value, "628123456789");
  assert.equal(copied[1].value, "ChIJExample");
  assert.equal("sourceCardId" in copied[0], false);
  assert.equal("sourceOutletId" in copied[0], false);
});
