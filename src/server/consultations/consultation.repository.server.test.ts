import assert from "node:assert/strict";
import { test } from "node:test";
import { bookingInputSchema, consultationSettingsSchema, phoneSchema, slotCreationSchema } from "./consultation.schemas";
import { activeBooking, canBookSlot, confirmationDeadline, expandSlots, releasedSlotStatus } from "./consultation-policy";
import { defaultConsultationSettings } from "./consultation.types";
import { createConsultation, publicBooking, readPublicConsultation } from "./consultation.repository.server";
import { changeConsultationBooking } from "./consultation-actions.repository.server";
import { changeSlot, createSlots } from "./consultation-slots.repository.server";
import { consultationRateLimit, hashConsultation } from "./consultation-store.server";
import { bookingInput, fixtureNow, seedSlots, withConsultations } from "./consultation-test-fixture";

test("consultation validation, WIB conversion, cutoff equality, and repeat dates", () => {
  assert.equal(phoneSchema.parse("+62 812-3456-7890"), "6281234567890");
  assert.equal(phoneSchema.parse("081234567890"), "6281234567890");
  assert.equal(phoneSchema.safeParse("+1 555 1234 5678").success, false);
  assert.equal(consultationSettingsSchema.safeParse({ ...defaultConsultationSettings, batas_pemesanan_jam: 2 }).success, false);
  assert.equal(consultationSettingsSchema.safeParse({ ...defaultConsultationSettings, durasi_slot_menit: 0 }).success, false);
  assert.equal(slotCreationSchema.safeParse({ dates: ["2026-02-30"], times: ["10:00"] }).success, false);
  assert.equal(slotCreationSchema.safeParse({ dates: ["2026-11-07"], times: ["24:00"] }).success, false);
  const slots = expandSlots(["2026-11-07"], ["10:00", "11:00", "13:00", "14:00"], 3, 30);
  assert.equal(slots.length, 16);
  assert.equal(slots[0].startAt, "2026-11-07T03:00:00.000Z");
  assert.equal(slots[0].endAt, "2026-11-07T03:30:00.000Z");
  assert.equal(slots[12].date, "2026-11-28");
  assert.equal(expandSlots(["2026-11-07", "2026-11-14"], ["10:00", "10:00"], 1, 30).length, 3);
  const startAt = new Date(fixtureNow + 3 * 3_600_000).toISOString();
  assert.equal(canBookSlot({ startAt, status: "tersedia" }, defaultConsultationSettings, fixtureNow), true);
  assert.equal(canBookSlot({ startAt, status: "tersedia" }, defaultConsultationSettings, fixtureNow + 1), false);
  assert.equal(canBookSlot({ startAt, status: "ditutup" }, defaultConsultationSettings, fixtureNow), false);
  assert.equal(releasedSlotStatus(startAt, defaultConsultationSettings, fixtureNow + 1), "ditutup");
  assert.equal(confirmationDeadline(startAt, defaultConsultationSettings), new Date(fixtureNow + 3_600_000).toISOString());
  const draft = bookingInput("20261107-1000");
  assert.equal(bookingInputSchema.parse({ ...draft, name: "<Visitor>\n" }).name, "Visitor");
  assert.equal(bookingInputSchema.safeParse({ ...draft, notes: "x".repeat(301) }).success, false);
  assert.equal(bookingInputSchema.safeParse({ ...draft, cancelToken: draft.statusToken }).success, false);
});

test("simultaneous booking of one slot admits one visitor and atomically creates its lock and outbox", async () => withConsultations(async (fixture) => {
  const [slot] = seedSlots(fixture);
  const results = await Promise.allSettled([createConsultation(bookingInput(slot.id, "a")), createConsultation(bookingInput(slot.id, "b", "081234567891"))]);
  assert.equal(results.filter((result) => result.status === "fulfilled").length, 1);
  const rejected = results.find((result) => result.status === "rejected") as PromiseRejectedResult;
  assert.match(String(rejected.reason), /slotUnavailable/);
  assert.ok(fixture.retries() > 0, "the concurrent callbacks must actually conflict and retry");
  const records = [...fixture.documents].filter(([path]) => path.startsWith("consultationBookings/"));
  assert.equal(records.length, 1);
  const id = records[0][0].split("/")[1];
  assert.equal(fixture.documents.get(`consultationSlots/${slot.id}`)?.bookingId, id);
  assert.equal(fixture.documents.get(`consultationSlotLocks/${slot.id}`)?.bookingId, id);
  assert.equal(fixture.documents.get(`consultationNotifications/${id}-new-0`)?.status, "pending");
}));

test("concurrent bookings across different slots share the normalized phone quota; cancellation releases quota", async () => withConsultations(async (fixture) => {
  const slots = seedSlots(fixture);
  fixture.documents.set("consultationSettings/default", { ...defaultConsultationSettings, maks_booking_aktif_per_nomor: 1 });
  const results = await Promise.allSettled(slots.slice(0, 2).map((slot, index) => createConsultation(bookingInput(slot.id, index ? "b" : "a", index ? "+62 812-3456-7890" : "081234567890"))));
  assert.equal(results.filter((result) => result.status === "fulfilled").length, 1);
  const rejected = results.find((result) => result.status === "rejected") as PromiseRejectedResult;
  assert.match(String(rejected.reason), /limit/);
  const fulfilled = results.find((result) => result.status === "fulfilled") as PromiseFulfilledResult<string>;
  await changeConsultationBooking({ id: fulfilled.value, action: "cancel" });
  const next = await createConsultation(bookingInput(slots[2].id, "c"));
  assert.equal(fixture.booking(next).status, "menunggu");
  assert.deepEqual(fixture.documents.get(`consultationPhoneLocks/${hashConsultation("6281234567890")}`)?.activeIds, [next]);
}));

test("booking retry is idempotent, rejects changed payload, and public results exclude private fields", async () => withConsultations(async (fixture) => {
  const [slot] = seedSlots(fixture);
  const input = bookingInput(slot.id);
  const id = await createConsultation(input);
  assert.equal(await createConsultation(input), id);
  await assert.rejects(createConsultation({ ...input, name: "Different person" }), /error/);
  assert.equal([...fixture.documents.keys()].filter((path) => path.startsWith("consultationNotifications/")).length, 1);
  const result = await readPublicConsultation(input.statusToken);
  assert.deepEqual(result, publicBooking(fixture.booking(id)));
  for (const key of ["whatsapp", "statusTokenHash", "cancelTokenHash", "businessName", "notes"]) assert.equal(key in result!, false);
  const stored = JSON.stringify([...fixture.documents.values()]);
  assert.equal(stored.includes(input.statusToken), false);
  assert.equal(stored.includes(input.cancelToken), false);
}));

test("cancel and reschedule release the original slot, preserve unique locks, and protect other cancel tokens", async () => withConsultations(async (fixture) => {
  const [first, target] = seedSlots(fixture);
  const input = bookingInput(first.id);
  const id = await createConsultation(input);
  await assert.rejects(changeConsultationBooking({ id, action: "cancel", expectedCancelHash: "wrong" }), /notFound/);
  await changeConsultationBooking({ id, action: "reschedule", slotId: target.id });
  assert.equal(fixture.documents.get(`consultationSlots/${first.id}`)?.status, "tersedia");
  assert.equal(fixture.documents.has(`consultationSlotLocks/${first.id}`), false);
  assert.equal(fixture.documents.get(`consultationSlotLocks/${target.id}`)?.bookingId, id);
  assert.equal(fixture.booking(id).slotId, target.id);
  assert.equal(fixture.documents.get(`consultationNotifications/${id}-rescheduled-1`)?.status, "pending");
  await changeConsultationBooking({ id, action: "cancel", expectedCancelHash: hashConsultation(input.cancelToken), reason: "cancelledByCustomer" });
  await changeConsultationBooking({ id, action: "cancel", expectedCancelHash: hashConsultation(input.cancelToken) });
  assert.equal(fixture.booking(id).revision, 2);
  assert.equal(fixture.documents.get(`consultationSlots/${target.id}`)?.status, "tersedia");
  assert.equal(fixture.documents.has(`consultationSlotLocks/${target.id}`), false);
  assert.equal(fixture.booking(id).reason, "cancelledByCustomer");
}));

test("confirmation just before the deadline survives expiry and confirmation at the deadline cannot win", async () => withConsultations(async (fixture) => {
  const slots = seedSlots(fixture);
  const first = await createConsultation(bookingInput(slots[0].id));
  fixture.setTime(Date.parse(fixture.booking(first).deadlineAt) - 1);
  await Promise.all([changeConsultationBooking({ id: first, action: "confirm" }), changeConsultationBooking({ id: first, action: "expire" })]);
  fixture.setTime(Date.parse(fixture.booking(first).deadlineAt));
  assert.equal(await changeConsultationBooking({ id: first, action: "expire" }), false);
  assert.equal(fixture.booking(first).status, "dikonfirmasi");
  fixture.setTime(fixtureNow);
  const second = await createConsultation(bookingInput(slots[1].id, "b"));
  fixture.setTime(Date.parse(fixture.booking(second).deadlineAt));
  const race = await Promise.allSettled([changeConsultationBooking({ id: second, action: "expire" }), changeConsultationBooking({ id: second, action: "confirm" })]);
  assert.equal(race.filter((result) => result.status === "fulfilled").length, 1);
  assert.equal(fixture.booking(second).status, "dibatalkan_otomatis");
  assert.equal(fixture.documents.get(`consultationSlots/${slots[1].id}`)?.status, "ditutup");
  assert.equal(fixture.documents.has(`consultationSlotLocks/${slots[1].id}`), false);
  assert.equal(activeBooking(fixture.booking(second).status), false);
  assert.equal(await changeConsultationBooking({ id: second, action: "expire" }), false);
}));

test("slot uniqueness rolls back entire batches and confirmed slots cannot be closed or deleted", async () => withConsultations(async (fixture) => {
  const input = slotCreationSchema.parse({ dates: ["2026-11-07"], times: ["10:00", "11:00", "13:00", "14:00"], repeatWeeks: 3 });
  await createSlots(input);
  assert.equal([...fixture.documents.keys()].filter((path) => path.startsWith("consultationSlots/")).length, 16);
  await assert.rejects(createSlots({ ...input, times: ["10:00", "15:00"] }), /duplicateSlot/);
  assert.equal(fixture.documents.has("consultationSlots/20261107-1500"), false);
  const slotId = "20261107-1000";
  const id = await createConsultation(bookingInput(slotId));
  await changeConsultationBooking({ id, action: "confirm" });
  await assert.rejects(changeSlot({ id: slotId, action: "delete" }), /confirmedSlot/);
  for (const action of ["close", "open"] as const) await assert.rejects(changeSlot({ id: slotId, action }), /slotBooked/);
  await changeSlot({ id: "20261107-1100", action: "close" });
  await assert.rejects(createConsultation(bookingInput("20261107-1100", "b")), /slotUnavailable/);
  await changeSlot({ id: "20261107-1100", action: "open" });
  await changeSlot({ id: "20261107-1100", action: "delete" });
  assert.equal(fixture.documents.has("consultationSlots/20261107-1100"), false);
}));

test("IP rate limit is atomic and stores only hashes, with a new budget each window", async () => withConsultations(async (fixture) => {
  const attempts = await Promise.allSettled(Array.from({ length: 16 }, () => consultationRateLimit("192.0.2.55")));
  assert.equal(attempts.filter((result) => result.status === "fulfilled").length, 15);
  assert.equal(JSON.stringify([...fixture.documents]).includes("192.0.2.55"), false);
  fixture.setTime(fixtureNow + 900_000);
  await consultationRateLimit("192.0.2.55");
}));
