import { bookingsRef, consultationDb, enqueueConsultationNotification, lockRef, phoneRef, slotsRef } from "./consultation-store.server";
import type { BookingRecord, ConsultationSlot } from "./consultation.types";

/** One atomic operation: a confirmed booking protects the entire selected batch. */
export async function deleteConsultationSlots(ids: string[]) {
  const uniqueIds = [...new Set(ids)];
  if (!uniqueIds.length || uniqueIds.length > 50) throw new Error("invalidStatus");
  return consultationDb().runTransaction(async (tx) => {
    const slots = await Promise.all(uniqueIds.map(async (id) => {
      const [slot, lock] = await Promise.all([tx.get(slotsRef().doc(id)), tx.get(lockRef(id))]);
      if (!slot.exists) throw new Error("notFound");
      const record = slot.data() as ConsultationSlot;
      if (lock.exists && lock.data()?.bookingId !== record.bookingId) throw new Error("invalidStatus");
      if (record.status === "dipesan" && !record.bookingId) throw new Error("invalidStatus");
      return { id, ref: slot.ref, record };
    }));
    const booked = await Promise.all(slots.filter((slot) => slot.record.bookingId).map(async (slot) => {
      const snapshot = await tx.get(bookingsRef().doc(slot.record.bookingId!));
      if (!snapshot.exists) throw new Error("invalidStatus");
      const booking = snapshot.data() as BookingRecord;
      if (booking.slotId !== slot.id) throw new Error("invalidStatus");
      if (booking.status === "dikonfirmasi") throw new Error("confirmedSlot");
      if (booking.status !== "menunggu") throw new Error("slotBooked");
      return { id: snapshot.id, ref: snapshot.ref, booking };
    }));
    // Several selected bookings may share a phone. Read once, then remove all IDs together.
    const phones = [...new Set(booked.map(({ booking }) => booking.whatsapp))];
    const phoneDocs = await Promise.all(phones.map(async (phone) => ({ phone, snapshot: await tx.get(phoneRef(phone)) })));
    const cancelledIds = new Set(booked.map(({ id }) => id));
    const updatedAt = new Date(Date.now()).toISOString();
    for (const { id, ref, booking } of booked) {
      const next: BookingRecord = { ...booking, status: "dibatalkan_otomatis", reason: "slotDeletedByAdmin",
        revision: booking.revision + 1, updatedAt, isNew: false, notificationPending: true };
      tx.set(ref, next);
      enqueueConsultationNotification(tx, id, next, "cancelled");
    }
    for (const { snapshot } of phoneDocs) {
      const activeIds: string[] = snapshot.data()?.activeIds ?? [];
      tx.set(snapshot.ref, { activeIds: activeIds.filter((id) => !cancelledIds.has(id)) });
    }
    for (const slot of slots) { tx.delete(slot.ref); tx.delete(lockRef(slot.id)); }
  });
}
