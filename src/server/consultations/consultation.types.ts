export const slotStatuses = ["tersedia", "dipesan", "ditutup"] as const;
export const bookingStatuses = ["menunggu", "dikonfirmasi", "dibatalkan", "dibatalkan_otomatis", "selesai"] as const;
export type SlotStatus = (typeof slotStatuses)[number];
export type BookingStatus = (typeof bookingStatuses)[number];
export type ConsultationSettings = {
  durasi_slot_menit: number;
  tenggat_konfirmasi_jam: number;
  batas_pemesanan_jam: number;
  maks_booking_aktif_per_nomor: number;
};
export const defaultConsultationSettings: ConsultationSettings = {
  durasi_slot_menit: 30, tenggat_konfirmasi_jam: 2,
  batas_pemesanan_jam: 3, maks_booking_aktif_per_nomor: 3,
};
export type ConsultationSlot = {
  id: string; date: string; startAt: string; endAt: string;
  status: SlotStatus; bookingId: string | null; createdAt: string;
};
export type PublicConsultationSlot = Omit<ConsultationSlot, "bookingId" | "createdAt"> & { bookable: boolean };
export type BookingRecord = {
  slotId: string; code: string; name: string; whatsapp: string;
  businessName: string; businessType: string; notes: string;
  status: BookingStatus; startAt: string; endAt: string; deadlineAt: string;
  reason: string; createdAt: string; updatedAt: string; revision: number;
  statusTokenHash: string; cancelTokenHash: string;
  isNew: boolean; notificationPending: boolean;
  reminder6Queued: boolean; reminder1Queued: boolean;
  reminder6Sent: boolean; reminder1Sent: boolean;
  remindersStartAt?: string;
};
export type AdminConsultationBooking = Omit<BookingRecord, "statusTokenHash" | "cancelTokenHash"> & { id: string };
export type PublicConsultationBooking = Pick<BookingRecord, "code" | "name" | "startAt" | "endAt" | "deadlineAt" | "status" | "reason" | "createdAt">;
export type NotificationEvent = "new" | "cancelled" | "rescheduled" | "reminder6" | "reminder1";
