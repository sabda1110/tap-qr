import { sendConsultationEmail, sendConsultationTelegram } from "./consultation-notification-delivery.server";
import { isConsultationReminder } from "./consultation-notification.types";
import type { ConsultationNotificationRecord, NotificationChannel, NotificationOutcome } from "./consultation-notification.types";
import {
  claimConsultationNotification, finishConsultationNotification,
  listPendingConsultationNotifications, markConsultationChannelSent,
} from "./consultation-notifications.repository.server";

async function deliverChannel(id: string, record: ConsultationNotificationRecord & { leaseId: string }, channel: NotificationChannel) {
  const sent = channel === "telegram" ? record.telegramSent : record.emailSent;
  if (sent || (channel === "email" && isConsultationReminder(record.event))) return;
  const outcome: NotificationOutcome = channel === "telegram"
    ? await sendConsultationTelegram(record)
    : await sendConsultationEmail(id, record);
  if (outcome === "sent") {
    await markConsultationChannelSent(id, record.leaseId, channel);
    return;
  }
  console.warn("consultation_notification_failed", { channel, outcome });
}

/** Outbox failures never turn an already persisted booking into a failed request. */
export async function dispatchConsultationNotifications(bookingId?: string, options: { budgetMs?: number; maxEvents?: number } = {}) {
  let processed = 0;
  const startedAt = Date.now();
  try {
    const ids = await listPendingConsultationNotifications(bookingId);
    for (const id of ids) {
      if (Date.now() - startedAt >= (options.budgetMs ?? 20_000) || processed >= (options.maxEvents ?? 20)) break;
      try {
        const record = await claimConsultationNotification(id, Boolean(bookingId));
        if (!record) continue;
        const results = await Promise.allSettled([
          deliverChannel(id, record, "telegram"),
          deliverChannel(id, record, "email"),
        ]);
        if (results.some((result) => result.status === "rejected")) {
          console.warn("consultation_notification_failed", { outcome: "channel_unavailable" });
        }
        await finishConsultationNotification(id, record.leaseId);
        processed++;
      } catch {
        console.warn("consultation_notification_failed", { outcome: "persistence_unavailable" });
      }
    }
  } catch {
    console.warn("consultation_notification_failed", { outcome: "outbox_unavailable" });
  }
  return { processed };
}
