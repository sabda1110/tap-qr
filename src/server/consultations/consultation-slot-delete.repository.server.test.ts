import assert from "node:assert/strict";
import { test } from "node:test";
import { bookingInput, seedSlots, withConsultations } from "./consultation-test-fixture";
import { createConsultation } from "./consultation.repository.server";
import { changeConsultationBooking } from "./consultation-actions.repository.server";
import { deleteConsultationSlots } from "./consultation-slot-delete.repository.server";
import { changeSlot } from "./consultation-slots.repository.server";
import { hashConsultation } from "./consultation-store.server";
import { slotBulkDeleteSchema } from "./consultation.schemas";
import { slotDeleteState } from "../../lib/consultation-slot-delete";

test("bulk delete cancels pending bookings, keeps history and frees shared phone quota together", async () => withConsultations(async (fixture) => {
  const slots = seedSlots(fixture);
  const first = await createConsultation(bookingInput(slots[0].id, "a"));
  const second = await createConsultation(bookingInput(slots[1].id, "b"));
  const retained = await createConsultation(bookingInput(slots[2].id, "c"));
  await deleteConsultationSlots([slots[0].id, slots[1].id, slots[3].id, slots[0].id]);
  for (const id of [first, second]) {
    const booking = fixture.booking(id);
    assert.equal(booking.status, "dibatalkan_otomatis");
    assert.equal(booking.reason, "slotDeletedByAdmin");
    assert.equal(booking.revision, 1);
    assert.equal(booking.notificationPending, true);
    assert.ok(fixture.documents.has(`consultationNotifications/${id}-cancelled-1`));
    assert.equal(fixture.documents.has(`consultationSlots/${booking.slotId}`), false);
    assert.equal(fixture.documents.has(`consultationSlotLocks/${booking.slotId}`), false);
  }
  const phone = hashConsultation("6281234567890");
  assert.deepEqual(fixture.documents.get(`consultationPhoneLocks/${phone}`)?.activeIds, [retained]);
  assert.equal(fixture.booking(retained).status, "menunggu");
  const before = structuredClone([...fixture.documents]);
  await assert.rejects(deleteConsultationSlots([slots[0].id]), /notFound/);
  assert.deepEqual([...fixture.documents], before);
}));

test("one confirmed booking rejects the entire batch without cancelling pending bookings", async () => withConsultations(async (fixture) => {
  const slots = seedSlots(fixture);
  const pending = await createConsultation(bookingInput(slots[0].id, "a"));
  const confirmed = await createConsultation(bookingInput(slots[1].id, "b"));
  await changeConsultationBooking({ id: confirmed, action: "confirm" });
  const before = structuredClone([...fixture.documents]);
  await assert.rejects(deleteConsultationSlots(slots.map((slot) => slot.id)), /confirmedSlot/);
  assert.deepEqual([...fixture.documents], before);
  assert.equal(fixture.booking(pending).status, "menunggu");
}));

test("confirmation racing with deletion never leaves a confirmed booking without a slot", async () => withConsultations(async (fixture) => {
  const [slot] = seedSlots(fixture);
  const id = await createConsultation(bookingInput(slot.id));
  const results = await Promise.allSettled([
    changeConsultationBooking({ id, action: "confirm" }), deleteConsultationSlots([slot.id]),
  ]);
  assert.equal(results.filter((result) => result.status === "fulfilled").length, 1);
  const status = fixture.booking(id).status;
  assert.ok(status === "dikonfirmasi" || status === "dibatalkan_otomatis");
  assert.equal(fixture.documents.has(`consultationSlots/${slot.id}`), status === "dikonfirmasi");
  assert.equal(fixture.documents.has(`consultationSlotLocks/${slot.id}`), status === "dikonfirmasi");
}));

test("new booking racing with deletion is either rejected or automatically cancelled", async () => withConsultations(async (fixture) => {
  const [slot] = seedSlots(fixture);
  const [bookingResult] = await Promise.allSettled([
    createConsultation(bookingInput(slot.id)), deleteConsultationSlots([slot.id]),
  ]);
  assert.equal(fixture.documents.has(`consultationSlots/${slot.id}`), false);
  assert.equal(fixture.documents.has(`consultationSlotLocks/${slot.id}`), false);
  if (bookingResult.status === "fulfilled") assert.equal(fixture.booking(bookingResult.value).status, "dibatalkan_otomatis");
}));

test("single-slot deletion uses the same pending cancellation policy", async () => withConsultations(async (fixture) => {
  const [slot] = seedSlots(fixture);
  const id = await createConsultation(bookingInput(slot.id));
  await changeSlot({ id: slot.id, action: "delete" });
  assert.equal(fixture.booking(id).status, "dibatalkan_otomatis");
}));

test("bulk deletion validation rejects empty, malformed and oversized selections", () => {
  assert.equal(slotBulkDeleteSchema.safeParse({ ids: [] }).success, false);
  assert.equal(slotBulkDeleteSchema.safeParse({ ids: ["arbitrary/id"] }).success, false);
  assert.equal(slotBulkDeleteSchema.safeParse({ ids: Array(51).fill("20261102-1000") }).success, false);
  assert.deepEqual(slotBulkDeleteSchema.parse({ ids: ["20261102-1000", "20261102-1000"] }).ids, ["20261102-1000"]);
});

test("unknown booking data and inconsistent locks remain protected", async () => withConsultations(async (fixture) => {
  const [slot] = seedSlots(fixture);
  const id = await createConsultation(bookingInput(slot.id));
  const occupied = { ...slot, bookingId: id, status: "dipesan" as const };
  assert.equal(slotDeleteState(occupied, []), "protected");
  assert.equal(slotDeleteState(occupied, [{ id, slotId: slot.id, status: "dikonfirmasi" }]), "protected");
  assert.equal(slotDeleteState(occupied, [{ id, slotId: slot.id, status: "menunggu" }]), "pending");
  fixture.documents.set(`consultationSlotLocks/${slot.id}`, { bookingId: "different-booking" });
  const before = structuredClone([...fixture.documents]);
  await assert.rejects(deleteConsultationSlots([slot.id]), /invalidStatus/);
  assert.deepEqual([...fixture.documents], before);
}));
