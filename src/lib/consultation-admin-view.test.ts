import assert from "node:assert/strict";
import { test } from "node:test";
import { consultationChatUrl } from "./consultation-admin-view";
import { consultationAdminId } from "../i18n/locales/consultation-admin-id";
import { consultationAdminEn } from "../i18n/locales/consultation-admin-en";

const booking = {
  name: "Budi $&", code: "KSL-123", whatsapp: "6281234567890",
  startAt: "2026-11-12T03:00:00.000Z", endAt: "2026-11-12T03:30:00.000Z",
};

test("confirmed WhatsApp draft uses the actual WIB range and preserves customer names", () => {
  for (const [language, copy] of [["id", consultationAdminId], ["en", consultationAdminEn]] as const) {
    const url = new URL(consultationChatUrl({ ...booking, status: "dikonfirmasi" }, language, copy));
    const message = url.searchParams.get("text") ?? "";
    assert.equal(url.origin, "https://wa.me");
    assert.equal(url.pathname, `/${booking.whatsapp}`);
    assert.ok(message.includes(booking.name));
    assert.ok(message.includes(booking.code));
    assert.ok(message.includes("10:00–10:30 WIB"));
    assert.ok(message.includes(language === "id" ? "sudah dikonfirmasi" : "is confirmed"));
    assert.ok(message.includes("\n\n"));
    assert.ok(!message.includes("{name}") && !message.includes("{time}"));
  }
});

test("pending bookings use a neutral chat draft without claiming confirmation", () => {
  const url = new URL(consultationChatUrl({ ...booking, status: "menunggu" }, "id", consultationAdminId));
  const message = url.searchParams.get("text") ?? "";
  assert.ok(message.includes("ingin membahas booking"));
  assert.ok(!message.includes("sudah dikonfirmasi"));
});
