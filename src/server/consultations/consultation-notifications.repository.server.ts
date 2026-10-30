import { randomUUID } from "node:crypto";
import { isConsultationIndexMissing } from "./consultation-query.repository.server";
import { getFirebaseAdminFirestore } from "../../lib/firebase/admin.server";
import type { BookingRecord } from "./consultation.types";
import { isConsultationReminder } from "./consultation-notification.types";
import type { ConsultationNotificationRecord, NotificationChannel } from "./consultation-notification.types";

function notifications() {
  return getFirebaseAdminFirestore().collection("consultationNotifications");
}

export async function listPendingConsultationNotifications(bookingId?: string) {
  const query = bookingId
    ? notifications().where("bookingId", "==", bookingId)
    : notifications().where("status", "==", "pending")
      .where("nextAttemptAt", "<=", new Date().toISOString()).orderBy("nextAttemptAt").limit(20);
  try {
    const snapshot = await query.get();
    return snapshot.docs.filter((doc) => doc.data().status === "pending").map((doc) => doc.id);
  } catch (error) {
    if (bookingId || !isConsultationIndexMissing(error)) throw error;
    const now = new Date().toISOString();
    const snapshot = await notifications().where("status", "==", "pending").get();
    return snapshot.docs.filter((doc) => typeof doc.data().nextAttemptAt === "string" && doc.data().nextAttemptAt <= now)
      .sort((a, b) => a.data().nextAttemptAt.localeCompare(b.data().nextAttemptAt) || a.id.localeCompare(b.id))
      .slice(0, 20).map((doc) => doc.id);
  }
}

export async function claimConsultationNotification(id: string, force = false) {
  const db = getFirebaseAdminFirestore();
  const ref = notifications().doc(id);
  const now = Date.now();
  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const record = snapshot.data() as ConsultationNotificationRecord | undefined;
    if (!record || record.status !== "pending" || (record.leaseUntil && Date.parse(record.leaseUntil) > now)) return null;
    if (!force && Date.parse(record.nextAttemptAt) > now) return null;
    const bookingRef = db.collection("consultationBookings").doc(record.bookingId);
    const bookingSnapshot = await transaction.get(bookingRef);
    const booking = bookingSnapshot.data() as BookingRecord | undefined;
    if (!booking) {
      transaction.update(ref, { status: "skipped" });
      return null;
    }
    if (isConsultationReminder(record.event) && (booking.status !== "menunggu" || booking.revision !== record.booking.revision || Date.parse(booking.deadlineAt) <= now)) {
      const pending = await transaction.get(notifications().where("bookingId", "==", record.bookingId));
      transaction.update(ref, { status: "skipped" });
      transaction.update(bookingRef, { notificationPending: pending.docs.some((doc) => doc.id !== id && doc.data().status === "pending") });
      return null;
    }
    const leaseId = randomUUID();
    const leaseUntil = new Date(now + 90_000).toISOString();
    transaction.update(ref, { leaseId, leaseUntil, nextAttemptAt: leaseUntil, attempts: (record.attempts ?? 0) + 1 });
    return { ...record, leaseId, attempts: (record.attempts ?? 0) + 1 };
  });
}

export async function markConsultationChannelSent(id: string, leaseId: string, channel: NotificationChannel) {
  const db = getFirebaseAdminFirestore();
  const ref = notifications().doc(id);
  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    if (snapshot.data()?.leaseId !== leaseId) return;
    transaction.update(ref, { [channel === "telegram" ? "telegramSent" : "emailSent"]: true });
  });
}

export async function finishConsultationNotification(id: string, leaseId: string) {
  const db = getFirebaseAdminFirestore();
  const ref = notifications().doc(id);
  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const record = snapshot.data() as ConsultationNotificationRecord | undefined;
    if (!record || record.leaseId !== leaseId) return;
    const bookingRef = db.collection("consultationBookings").doc(record.bookingId);
    const booking = await transaction.get(bookingRef);
    const related = await transaction.get(notifications().where("bookingId", "==", record.bookingId));
    const complete = record.telegramSent && (isConsultationReminder(record.event) || record.emailSent);
    const retryMinutes = Math.min(60, 5 * 2 ** Math.min(record.attempts ?? 1, 5));
    transaction.update(ref, {
      status: complete ? "sent" : "pending", leaseId: null, leaseUntil: null,
      nextAttemptAt: new Date(Date.now() + retryMinutes * 60_000).toISOString(),
      ...(complete ? { sentAt: new Date().toISOString() } : {}),
    });
    if (booking.exists) {
      const notificationPending = !complete || related.docs.some((doc) => doc.id !== id && doc.data().status === "pending");
      const sameRevision = booking.data()?.revision === record.booking.revision;
      transaction.update(bookingRef, {
        notificationPending,
        ...(complete && sameRevision && record.event === "reminder6" ? { reminder6Sent: true } : {}),
        ...(complete && sameRevision && record.event === "reminder1" ? { reminder1Sent: true } : {}),
      });
    }
  });
}
