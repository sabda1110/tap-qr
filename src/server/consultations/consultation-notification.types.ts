import type { BookingRecord, NotificationEvent } from "./consultation.types";

export type ConsultationNotificationRecord = {
  bookingId: string;
  event: NotificationEvent;
  booking: BookingRecord;
  createdAt: string;
  telegramSent: boolean;
  emailSent: boolean;
  status: "pending" | "sent" | "skipped";
  nextAttemptAt: string;
  leaseId?: string | null;
  leaseUntil?: string | null;
  attempts?: number;
  sentAt?: string;
};

export type NotificationChannel = "telegram" | "email";
export type NotificationOutcome = "sent" | "not_configured" | "rejected" | "unavailable";

export function isConsultationReminder(event: NotificationEvent) {
  return event === "reminder6" || event === "reminder1";
}
