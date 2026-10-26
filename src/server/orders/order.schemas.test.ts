import assert from "node:assert/strict";
import { test } from "node:test";
import { acrylicMonsterThemes, acrylicPrintThemes, getSocialPrintThemes, isMonsterPrintTheme, legacyPrintThemes, pvcMonsterThemes, pvcPrintThemes } from "../../lib/print-themes";
import { canAdvanceOrder, createOrderSchema, orderDraftSchema, orderPhoneSchema, orderStatuses, orderTokenSchema, updateOrderSchema } from "./order.schemas";
import { detailOrder, phoneOrderSummary, summarizeOrder, type OrderRecord } from "./order.types";

const draft = { name: "Pemesan TapQR", email: "owner@example.com", phone: "081234567890", address: "Jalan Contoh 123, Jakarta 12345", shippingRegion: { province: "DKI Jakarta", city: "Jakarta Selatan", district: "Tebet", village: "Tebet Barat" }, material: "acrylic", quantity: 2, product: "social", theme: "review-poster" } as const;
const token = "a".repeat(64);

test("checkout normalizes contact details and validates product-specific themes", () => {
  const social = orderDraftSchema.parse({ ...draft, email: "Owner@EXAMPLE.com" });
  assert.equal(social.phone, "6281234567890");
  assert.equal(social.email, "owner@example.com");
  assert.equal(orderDraftSchema.safeParse({ ...draft, product: "wifi" }).success, false);
  assert.equal(orderDraftSchema.safeParse({ ...draft, product: "wifi", theme: "poster" }).success, true);
  assert.equal(orderDraftSchema.safeParse({ ...draft, quantity: 101 }).success, false);
  assert.equal(orderDraftSchema.safeParse({ ...draft, address: "" }).success, false);
  for (const field of ["province", "city", "district", "village"]) {
    assert.equal(orderDraftSchema.safeParse({ ...draft, shippingRegion: { ...draft.shippingRegion, [field]: "" } }).success, false);
  }
  assert.equal(orderPhoneSchema.parse("+62 812-3456-7890"), social.phone);
  assert.equal(orderPhoneSchema.safeParse("not-a-phone").success, false);
});

test("order schema discards browser-supplied ownership, status, and WiFi credentials", () => {
  const parsed = createOrderSchema.parse({ token, order: { ...draft, ownerId: "attacker", status: "completed", payload: "WIFI:T:WPA;S:test;P:secret;;" } });
  assert.equal("ownerId" in parsed.order, false);
  assert.equal("status" in parsed.order, false);
  assert.equal("payload" in parsed.order, false);
  assert.equal(createOrderSchema.safeParse({ token: "TQO-PUBLIC", order: draft }).success, false);
});

test("social print designs accept their intended material and reject mismatches", () => {
  for (const [material, themes] of [["pvc", pvcPrintThemes], ["acrylic", acrylicPrintThemes]] as const) {
    for (const theme of themes) {
      assert.equal(orderDraftSchema.safeParse({ ...draft, material, theme }).success, true);
      const mismatch = orderDraftSchema.safeParse({ ...draft, material: material === "pvc" ? "acrylic" : "pvc", theme });
      assert.equal(mismatch.success, false);
      if (!mismatch.success) assert.deepEqual(mismatch.error.issues[0].path, ["theme"]);
      assert.equal(orderDraftSchema.safeParse({ ...draft, material, theme, product: "wifi" }).success, false);
    }
    assert.deepEqual(getSocialPrintThemes(material), [...legacyPrintThemes, ...themes]);
  }
});

test("legacy social designs remain available for both materials and schema options stay accessible", () => {
  for (const material of ["acrylic", "pvc"] as const) {
    for (const theme of legacyPrintThemes) {
      assert.equal(orderDraftSchema.safeParse({ ...draft, material, theme }).success, true);
    }
  }
  assert.equal(orderDraftSchema.options[0].shape.theme.parse("pvc-signal"), "pvc-signal");
  assert.equal(orderDraftSchema.options[1].shape.theme.parse("poster"), "poster");
});

test("six monster designs can be ordered only for their matching material", () => {
  const expected = {
    pvc: ["pvc-monster-mango", "pvc-monster-boba", "pvc-monster-ziggy"],
    acrylic: ["acrylic-monster-mango", "acrylic-monster-boba", "acrylic-monster-ziggy"],
  } as const;
  assert.deepEqual(pvcMonsterThemes, expected.pvc);
  assert.deepEqual(acrylicMonsterThemes, expected.acrylic);
  for (const material of ["pvc", "acrylic"] as const) {
    for (const theme of expected[material]) {
      assert.equal(isMonsterPrintTheme(theme), true);
      assert.equal(orderDraftSchema.safeParse({ ...draft, material, theme }).success, true);
      const otherMaterial = material === "pvc" ? "acrylic" : "pvc";
      assert.equal(orderDraftSchema.safeParse({ ...draft, material: otherMaterial, theme }).success, false);
    }
  }
  assert.equal(isMonsterPrintTheme("pvc-signal"), false);
});

test("private tracking requires a random token, never a public order code or phone", () => {
  assert.equal(orderTokenSchema.safeParse(token).success, true);
  assert.equal(orderTokenSchema.safeParse("TQO-123456789ABC").success, false);
  assert.equal(orderTokenSchema.safeParse("082278536416").success, false);
});

test("statuses move forward one step and shipping requires carrier and tracking number", () => {
  for (const current of orderStatuses) for (const next of orderStatuses) assert.equal(canAdvanceOrder(current, next), orderStatuses.indexOf(next) === orderStatuses.indexOf(current) + 1);
  const input = { id: token, expectedStatus: "confirmed", status: "shipped", carrier: "", trackingNumber: "" };
  assert.equal(updateOrderSchema.safeParse(input).success, false);
  assert.equal(updateOrderSchema.safeParse({ ...input, carrier: "Courier", trackingNumber: "ABC123" }).success, true);
});

test("guest tracking projection never exposes contact, address, owner, or admin IDs", () => {
  const order: OrderRecord = { ...orderDraftSchema.parse(draft), code: "TQO-123456789ABC", ownerId: "owner-uid", status: "on_progress", carrier: "", trackingNumber: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), history: [{ status: "on_progress", at: new Date().toISOString(), by: "admin-uid" }] };
  const summary = summarizeOrder(token, order);
  for (const key of ["name", "email", "phone", "address", "shippingRegion", "ownerId", "customer"]) assert.equal(key in summary, false);
  assert.equal("by" in summary.history[0], false);
  assert.equal(detailOrder(token, order).customer.email, draft.email);
  assert.deepEqual(detailOrder(token, order).customer.shippingRegion, draft.shippingRegion);
  const legacy = { ...order };
  delete legacy.shippingRegion;
  assert.equal(detailOrder(token, legacy).customer.shippingRegion, null);
  const shipping = { ...order, carrier: "JNE", trackingNumber: "TEST123456" };
  for (const status of ["on_progress", "confirmed", "shipped", "completed"] as const) {
    const result = phoneOrderSummary({ ...shipping, status });
    const sent = status === "shipped" || status === "completed";
    assert.equal(result.carrier, sent ? "JNE" : "");
    assert.equal(result.trackingNumber, sent ? "TEST123456" : "");
    for (const key of ["email", "phone", "address", "shippingRegion", "ownerId", "customer", "history", "id"]) assert.equal(key in result, false);
  }
});
