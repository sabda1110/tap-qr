import { createHash } from "node:crypto";
import type { Transaction } from "firebase-admin/firestore";
import { getFirebaseAdminFirestore } from "../../lib/firebase/admin.server";
import { defaultConsultationSettings, type BookingRecord, type ConsultationSettings, type NotificationEvent } from "./consultation.types";
export const consultationDb = () => getFirebaseAdminFirestore();
export const hashConsultation = (value: string) => createHash("sha256").update(value).digest("hex");
export const settingsRef = () => consultationDb().collection("consultationSettings").doc("default");
export const slotsRef = () => consultationDb().collection("consultationSlots");
export const bookingsRef = () => consultationDb().collection("consultationBookings");
export const lockRef = (slotId: string) => consultationDb().collection("consultationSlotLocks").doc(slotId);
export const phoneRef = (phone: string) => consultationDb().collection("consultationPhoneLocks").doc(hashConsultation(phone));
export const resolveSettings = (data?: Record<string, unknown>) => ({ ...defaultConsultationSettings, ...data }) as ConsultationSettings;
export async function readConsultationSettings() { return resolveSettings((await settingsRef().get()).data()); }
export function enqueueConsultationNotification(tx: Transaction, id: string, booking: BookingRecord, event: NotificationEvent) {
  tx.create(consultationDb().collection("consultationNotifications").doc(`${id}-${event}-${booking.revision}`), {
    bookingId: id, event, booking, createdAt: booking.updatedAt, nextAttemptAt: booking.updatedAt,
    telegramSent: false, emailSent: false, status: "pending",
  });
}
export async function consultationRateLimit(ip: string) {
  const now = Date.now();
  const ref = consultationDb().collection("consultationRateLimits").doc(hashConsultation(`${ip}:${Math.floor(now / 900_000)}`));
  await consultationDb().runTransaction(async (tx) => {
    const snapshot = await tx.get(ref);
    const count = snapshot.data()?.count ?? 0;
    if (count >= 15) throw new Error("limit");
    tx.set(ref, { count: count + 1, expiresAt: new Date(now + 86_400_000) });
  });
}
