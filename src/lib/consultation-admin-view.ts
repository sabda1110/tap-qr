import type { Language, Messages } from "../i18n";
import type { AdminConsultationBooking } from "../server/consultations/consultation.types";

export type ConsultationAdminCopy = Messages["consultation"]["admin"];
export type ConsultationMutation = (work: () => Promise<{ success: boolean; reason?: string }>) => Promise<boolean>;

export function consultationAdminError(reason: string | undefined, copy: ConsultationAdminCopy) {
  const keys = {
    slotUnavailable: "slot_unavailable", slotBooked: "slot_booked",
    deadlinePassed: "deadline_passed", invalidStatus: "invalid_status",
    duplicateSlot: "duplicate_slot", notificationFailed: "notification_failed", slotPast: "slot_past",
  } as const;
  return reason && reason in keys ? copy.errors[keys[reason as keyof typeof keys]] : copy.error;
}

export function consultationDateKey(value: string | number) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(value));
}

export function consultationDateLabel(value: string, language: Language) {
  return new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-GB", { timeZone: "Asia/Jakarta", weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(new Date(value.length === 10 ? `${value}T12:00:00+07:00` : value));
}

export function consultationTimeLabel(value: string) {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(value));
}

export function consultationRangeLabel(startAt: string, endAt: string) {
  return `${consultationTimeLabel(startAt)}–${consultationTimeLabel(endAt)} WIB`;
}

export function consultationCountdown(deadline: string, now: number, copy: ConsultationAdminCopy) {
  const minutes = Math.ceil((Date.parse(deadline) - now) / 60_000);
  if (minutes <= 0) return copy.expired;
  return copy.remaining.replace("{hours}", String(Math.floor(minutes / 60))).replace("{minutes}", String(minutes % 60));
}

export function consultationChatUrl(booking: Pick<AdminConsultationBooking, "status" | "name" | "code" | "startAt" | "endAt" | "whatsapp">, language: Language, copy: ConsultationAdminCopy) {
  const confirmed = booking.status === "dikonfirmasi";
  const values: Record<string, string> = {
    name: booking.name, code: booking.code, date: consultationDateLabel(booking.startAt, language),
    time: confirmed ? consultationRangeLabel(booking.startAt, booking.endAt) : consultationTimeLabel(booking.startAt),
  };
  const message = (confirmed ? copy.confirmationChatText : copy.chatText)
    .replace(/\{(name|code|date|time)\}/g, (_, key: string) => values[key]);
  return `https://wa.me/${booking.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const consultationStatusClass = {
  menunggu: "border-amber-200 bg-amber-50 text-amber-900",
  dikonfirmasi: "border-emerald-200 bg-emerald-50 text-emerald-800",
  dibatalkan: "border-red-200 bg-red-50 text-red-800",
  dibatalkan_otomatis: "border-red-200 bg-red-50 text-red-800",
  selesai: "border-cyan-200 bg-cyan-50 text-cyan-900",
};

export const consultationSlotClass = {
  tersedia: "border-emerald-200 bg-emerald-50 text-emerald-800",
  dipesan: "border-amber-200 bg-amber-50 text-amber-900",
  ditutup: "border-slate-200 bg-slate-100 text-slate-600",
};
