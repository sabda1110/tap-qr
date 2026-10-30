import type { z } from "zod";
import { bookingActionSchema } from "./consultation.schemas";
import { activeBooking, canBookSlot, confirmationDeadline, releasedSlotStatus } from "./consultation-policy";
import { bookingsRef, consultationDb, enqueueConsultationNotification, lockRef, phoneRef, resolveSettings, settingsRef, slotsRef } from "./consultation-store.server";
import type { BookingRecord, ConsultationSlot } from "./consultation.types";

type Action = Omit<z.infer<typeof bookingActionSchema>, "action"> & { action: z.infer<typeof bookingActionSchema>["action"] | "expire"; expectedCancelHash?: string };
export async function changeConsultationBooking(input: Action) {
  return consultationDb().runTransaction(async (tx) => {
    const ref = bookingsRef().doc(input.id);
    const snapshot = await tx.get(ref);
    if (!snapshot.exists) throw new Error("notFound");
    const booking = snapshot.data() as BookingRecord;
    if (input.expectedCancelHash && booking.cancelTokenHash !== input.expectedCancelHash) throw new Error("notFound");
    const now = Date.now();
    if (input.action === "expire" && (booking.status !== "menunggu" || Date.parse(booking.deadlineAt) > now)) return false;
    if (input.action === "seen") { tx.update(ref, { isNew: false }); return true; }
    if (!activeBooking(booking.status)) {
      if (input.action === "cancel" && ["dibatalkan", "dibatalkan_otomatis"].includes(booking.status)) return true;
      throw new Error("invalidStatus");
    }
    if (input.action === "confirm" && (booking.status !== "menunggu" || Date.parse(booking.deadlineAt) <= now)) throw new Error("deadlinePassed");
    if (input.action === "complete" && (booking.status !== "dikonfirmasi" || Date.parse(booking.endAt) > now)) throw new Error("invalidStatus");
    if (input.action === "reschedule" && (input.slotId === booking.slotId || !input.slotId)) throw new Error("slotUnavailable");
    const [slotDoc, settingsDoc, phoneDoc, oldLock] = await Promise.all([
      tx.get(slotsRef().doc(booking.slotId)), tx.get(settingsRef()), tx.get(phoneRef(booking.whatsapp)), tx.get(lockRef(booking.slotId)),
    ]);
    const settings = resolveSettings(settingsDoc.data());
    const targetDoc = input.action === "reschedule" ? await tx.get(slotsRef().doc(input.slotId!)) : null;
    const targetLock = input.action === "reschedule" ? await tx.get(lockRef(input.slotId!)) : null;
    const target = targetDoc?.data() as ConsultationSlot | undefined;
    if (input.action === "reschedule" && (!target || !canBookSlot(target, settings, now) || target.bookingId || targetLock?.exists)) throw new Error("slotUnavailable");
    if (!slotDoc.exists || slotDoc.data()?.bookingId !== input.id || oldLock.data()?.bookingId !== input.id) throw new Error("invalidStatus");
    const next: BookingRecord = { ...booking, isNew: false, revision: booking.revision + 1, updatedAt: new Date(now).toISOString() };
    if (input.action === "confirm") next.status = "dikonfirmasi";
    if (input.action === "complete") next.status = "selesai";
    if (input.action === "cancel" || input.action === "expire") {
      next.status = input.action === "expire" ? "dibatalkan_otomatis" : "dibatalkan";
      next.reason = input.action === "expire" ? "confirmationExpired" : input.reason || "cancelledByAdmin";
      next.notificationPending = true;
    }
    if (target && targetDoc) {
      next.slotId = targetDoc.id; next.startAt = target.startAt; next.endAt = target.endAt;
      next.deadlineAt = confirmationDeadline(target.startAt, settings); next.reason = input.reason || "rescheduledByAdmin";
      next.reminder6Queued = false; next.reminder1Queued = false; next.reminder6Sent = false; next.reminder1Sent = false;
      next.remindersStartAt = next.updatedAt;
      next.notificationPending = true;
      tx.update(targetDoc.ref, { status: "dipesan", bookingId: input.id });
      tx.create(lockRef(targetDoc.id), { bookingId: input.id });
    }
    if (!activeBooking(next.status) || target) {
      tx.update(slotDoc.ref, { status: input.action === "complete" ? "ditutup" : releasedSlotStatus(booking.startAt, settings, now), bookingId: null });
      tx.delete(oldLock.ref);
    }
    if (!activeBooking(next.status)) {
      const activeIds: string[] = phoneDoc.data()?.activeIds ?? [];
      tx.set(phoneDoc.ref, { activeIds: activeIds.filter((id) => id !== input.id) });
    }
    tx.set(ref, next);
    if (input.action === "cancel" || input.action === "expire") enqueueConsultationNotification(tx, input.id, next, "cancelled");
    if (input.action === "reschedule") enqueueConsultationNotification(tx, input.id, next, "rescheduled");
    return true;
  });
}
