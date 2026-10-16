import assert from "node:assert/strict";
import { test } from "node:test";
import QRCode from "qrcode";
import { BinaryBitmap, HybridBinarizer, QRCodeReader, RGBLuminanceSource } from "@zxing/library";
import { expandWifiPrintJobs, parseWifiPayload, wifiPrintSchema } from "./wifi-print-schema";

const payload = "WIFI:T:WPA;P:sample-password;S:Guest Network;H:false;";
const values = { payloads: payload, copies: 1, title: "Connect to WiFi", footer: "Welcome" };

test("WiFi field order and a single trailing semicolon are accepted without changing credentials", () => {
  const result = parseWifiPayload(payload);
  assert.equal(result?.payload, payload);
  assert.equal(result?.ssid, "Guest Network");
  assert.equal(result?.hidden, false);
});

test("escaped separators and backslashes are decoded for display but preserved in the QR payload", () => {
  const escaped = String.raw`WIFI:S:Cafe\;East\\Wing\:1;P:pass\;word;T:WPA;H:true;;`;
  const network = parseWifiPayload(escaped);
  assert.equal(network?.ssid, "Cafe;East\\Wing:1");
  assert.equal(network?.payload, escaped);
  assert.equal(network?.hidden, true);
  assert.equal(parseWifiPayload('WIFI:S:"ABCD";T:nopass;;')?.ssid, "ABCD");
  assert.equal(parseWifiPayload(String.raw`WIFI:S:\"ABCD\";T:nopass;;`)?.ssid, '"ABCD"');
});

test("open networks accept omitted passwords and omitted security", () => {
  assert.equal(parseWifiPayload("WIFI:S:Guest;T:nopass;;")?.security, "nopass");
  assert.equal(parseWifiPayload("WIFI:S:Guest;;")?.security, "nopass");
});

test("invalid or ambiguous fields cannot generate a QR", () => {
  for (const invalid of ["https://example.com", "WIFI:S:;T:WPA;P:test;", "WIFI:S:Guest;T:WPA;",
    "WIFI:S:Guest;S:Other;T:nopass;", "WIFI:S:Guest;T:WPA2-EAP;P:test;",
    "WIFI:S:Guest;T:nopass;H:maybe;", "WIFI:S:Guest;T:nopass", "WIFI:S:Guest;T:nopass;X:unknown;",
    `WIFI:S:${"a".repeat(33)};T:nopass;`]) {
    assert.equal(parseWifiPayload(invalid), null);
  }
});

test("bulk copies retain each network's exact payload and receive unique identities", () => {
  const second = "WIFI:S:Second;T:nopass;;";
  const jobs = expandWifiPrintJobs({ ...values, payloads: `${payload}\n\n${second}`, copies: 3 }, "bulk");
  assert.equal(jobs.length, 6);
  assert.deepEqual(jobs.map((job) => job.payload), [payload, payload, payload, second, second, second]);
  assert.equal(new Set(jobs.map((job) => job.id)).size, 6);
  assert.throws(() => expandWifiPrintJobs({ ...values, copies: 2 }, "single"));
  assert.equal(wifiPrintSchema.safeParse({ ...values, payloads: `${payload}\n${second}`, copies: 51 }).success, false);
  assert.equal(wifiPrintSchema.safeParse({ ...values, copies: 100 }).success, true);
});

test("invalid bulk rows identify their original line without exposing credentials", () => {
  const result = wifiPrintSchema.safeParse({ ...values, payloads: `${payload}\n\nWIFI:S:Guest;T:WPA;` });
  assert.equal(result.success, false);
  if (!result.success) assert.equal(result.error.issues[0].message, "invalid:3");
});

test("the generated QR decodes to the original WiFi string rather than a TapQR URL", () => {
  const qr = QRCode.create(payload, { errorCorrectionLevel: "M" });
  const scale = 5;
  const size = (qr.modules.size + 8) * scale;
  const pixels = new Uint8ClampedArray(size * size).fill(255);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const row = Math.floor(y / scale) - 4;
      const column = Math.floor(x / scale) - 4;
      if (row >= 0 && column >= 0 && row < qr.modules.size && column < qr.modules.size && qr.modules.get(row, column)) pixels[y * size + x] = 0;
    }
  }
  const bitmap = new BinaryBitmap(new HybridBinarizer(new RGBLuminanceSource(pixels, size, size)));
  assert.equal(new QRCodeReader().decode(bitmap).getText(), payload);
});
