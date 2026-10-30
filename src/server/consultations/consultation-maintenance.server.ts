import { changeConsultationBooking } from "./consultation-actions.repository.server";
import { consultationDb, enqueueConsultationNotification } from "./consultation-store.server";
import { waitingConsultationBookings } from "./consultation-query.repository.server";
import type { BookingRecord } from "./consultation.types";
import { dispatchConsultationNotifications } from "./consultation-notifications.server";

export async function runConsultationMaintenance(options: { dispatch?: boolean; budgetMs?: number; maxEvents?: number } = {}) {
  const now = Date.now();
  const waiting = await waitingConsultationBookings();
  let expired = 0;
  let reminders = 0;
  for (const doc of waiting) {
    const booking = doc.data() as BookingRecord;
    if (Date.parse(booking.deadlineAt) <= now) {
      if (await changeConsultationBooking({ id: doc.id, action: "expire" })) expired++;
      continue;
    }
    for (const hours of [6, 1] as const) {
      const queuedField = hours === 6 ? "reminder6Queued" : "reminder1Queued";
      const scheduledAt = Date.parse(booking.deadlineAt) - hours * 3_600_000;
      if (booking[queuedField] || scheduledAt > now || scheduledAt < Date.parse(booking.remindersStartAt ?? booking.createdAt)) continue;
      const queued = await consultationDb().runTransaction(async (tx) => {
        const fresh = (await tx.get(doc.ref)).data() as BookingRecord;
        const currentNow = Date.now();
        const dueAt = Date.parse(fresh.deadlineAt) - hours * 3_600_000;
        if (fresh.status !== "menunggu" || fresh[queuedField] || Date.parse(fresh.deadlineAt) <= currentNow || dueAt > currentNow || dueAt < Date.parse(fresh.remindersStartAt ?? fresh.createdAt)) return false;
        const next = { ...fresh, [queuedField]: true, notificationPending: true, updatedAt: new Date(currentNow).toISOString() };
        tx.update(doc.ref, { [queuedField]: true, notificationPending: true, updatedAt: next.updatedAt });
        enqueueConsultationNotification(tx, doc.id, next, hours === 6 ? "reminder6" : "reminder1");
        return true;
      });
      if (queued) reminders++;
    }
  }
  if (options.dispatch !== false) await dispatchConsultationNotifications(undefined, options);
  return { expired, reminders };
}
