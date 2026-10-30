import type { BookingInput } from "./consultation.schemas";
import { waitingConsultationBookings } from "./consultation-query.repository.server";
import { canBookSlot, confirmationDeadline } from "./consultation-policy";
import { bookingsRef, consultationDb, enqueueConsultationNotification, hashConsultation, lockRef, phoneRef, resolveSettings, settingsRef, slotsRef } from "./consultation-store.server";
import type { AdminConsultationBooking, BookingRecord, ConsultationSlot, PublicConsultationBooking } from "./consultation.types";

export async function createConsultation(input: BookingInput) {
  const id = hashConsultation(input.statusToken);
  const ref = bookingsRef().doc(id);
  return consultationDb().runTransaction(async (tx) => {
    const [existing, settingsDoc, slotDoc, lock, phone] = await Promise.all([
      tx.get(ref), tx.get(settingsRef()), tx.get(slotsRef().doc(input.slotId)), tx.get(lockRef(input.slotId)), tx.get(phoneRef(input.whatsapp)),
    ]);
    if (existing.exists) {
      const previous = existing.data() as BookingRecord;
      if (previous.cancelTokenHash !== hashConsultation(input.cancelToken) || previous.slotId !== input.slotId || previous.whatsapp !== input.whatsapp || previous.name !== input.name || previous.notes !== input.notes || previous.businessName !== input.businessName || previous.businessType !== input.businessType) throw new Error("error");
      return id;
    }
    const now = Date.now();
    const settings = resolveSettings(settingsDoc.data());
    const slot = slotDoc.data() as ConsultationSlot | undefined;
    if (!slot || !canBookSlot(slot, settings, now) || lock.exists || slot.bookingId) throw new Error("slotUnavailable");
    const activeIds: string[] = phone.data()?.activeIds ?? [];
    if (activeIds.length >= settings.maks_booking_aktif_per_nomor) throw new Error("limit");
    const at = new Date(now).toISOString();
    const booking: BookingRecord = {
      slotId: input.slotId, code: `TQC-${id.slice(0, 12).toUpperCase()}`,
      name: input.name, whatsapp: input.whatsapp, businessName: input.businessName,
      businessType: input.businessType, notes: input.notes, status: "menunggu",
      startAt: slot.startAt, endAt: slot.endAt, deadlineAt: confirmationDeadline(slot.startAt, settings),
      reason: "", createdAt: at, updatedAt: at, revision: 0, isNew: true, notificationPending: true,
      statusTokenHash: id, cancelTokenHash: hashConsultation(input.cancelToken),
      reminder6Queued: false, reminder1Queued: false, reminder6Sent: false, reminder1Sent: false,
      remindersStartAt: at,
    };
    tx.create(ref, booking);
    tx.create(lockRef(input.slotId), { bookingId: id });
    tx.update(slotDoc.ref, { status: "dipesan", bookingId: id });
    tx.set(phone.ref, { activeIds: [...activeIds, id] });
    enqueueConsultationNotification(tx, id, booking, "new");
    return id;
  });
}

export function publicBooking(booking: BookingRecord): PublicConsultationBooking {
  return { code: booking.code, name: booking.name, startAt: booking.startAt, endAt: booking.endAt,
    deadlineAt: booking.deadlineAt, status: booking.status, reason: booking.reason, createdAt: booking.createdAt };
}
export async function readPublicConsultation(token: string) {
  const doc = await bookingsRef().doc(hashConsultation(token)).get();
  return doc.exists ? publicBooking(doc.data() as BookingRecord) : null;
}
export async function findBookingByCancelToken(token: string) {
  const matches = await bookingsRef().where("cancelTokenHash", "==", hashConsultation(token)).limit(1).get();
  return matches.docs[0]?.id ?? null;
}
export async function listConsultationSlots(includePast = false): Promise<ConsultationSlot[]> {
  const from = new Date(Date.now() - (includePast ? 31 : 1) * 86_400_000).toISOString();
  const docs = await slotsRef().where("startAt", ">=", from).orderBy("startAt").limit(1000).get();
  return docs.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as ConsultationSlot);
}
export async function listConsultationBookings(): Promise<AdminConsultationBooking[]> {
  const [recent, pending] = await Promise.all([
    bookingsRef().orderBy("createdAt", "desc").limit(500).get(),
    waitingConsultationBookings(),
  ]);
  const docs = new Map([...recent.docs, ...pending].map((doc) => [doc.id, doc]));
  return [...docs.values()].map((doc) => {
    const { statusTokenHash: _status, cancelTokenHash: _cancel, ...booking } = doc.data() as BookingRecord;
    return { ...booking, id: doc.id };
  }).sort((a, b) => {
    if (a.status === "menunggu" && b.status !== "menunggu") return -1;
    if (b.status === "menunggu" && a.status !== "menunggu") return 1;
    return a.status === "menunggu" ? a.deadlineAt.localeCompare(b.deadlineAt) : b.createdAt.localeCompare(a.createdAt);
  });
}
