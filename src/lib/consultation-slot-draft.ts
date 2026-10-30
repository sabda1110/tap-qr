import { expandSlots } from "../server/consultations/consultation-policy";
import type { ConsultationSettings, ConsultationSlot } from "../server/consultations/consultation.types";

export function consultationSlotDraft(dates: string[], times: string[], repeatWeeks: number, settings: ConsultationSettings, existing: ConsultationSlot[], now: number) {
  const existingIds = new Set(existing.map((slot) => slot.id));
  return expandSlots(dates, times, repeatWeeks, settings.durasi_slot_menit)
    .sort((a, b) => a.startAt.localeCompare(b.startAt))
    .map((slot) => ({ ...slot, issue: existingIds.has(slot.id) ? "exists" as const
      : Date.parse(slot.startAt) - now < settings.batas_pemesanan_jam * 3_600_000 ? "tooSoon" as const
        : Date.parse(slot.startAt) > now + 366 * 86_400_000 ? "tooFar" as const : null }));
}
