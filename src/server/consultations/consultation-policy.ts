import type { BookingStatus, ConsultationSettings, ConsultationSlot } from "./consultation.types";
export const activeBooking = (status: BookingStatus) => status === "menunggu" || status === "dikonfirmasi";
export function canBookSlot(slot: Pick<ConsultationSlot, "startAt" | "status">, settings: ConsultationSettings, now: number) {
  return slot.status === "tersedia" && Date.parse(slot.startAt) - now >= settings.batas_pemesanan_jam * 3_600_000;
}
export function releasedSlotStatus(startAt: string, settings: ConsultationSettings, now: number) {
  return canBookSlot({ startAt, status: "tersedia" }, settings, now) ? "tersedia" as const : "ditutup" as const;
}
export function confirmationDeadline(startAt: string, settings: ConsultationSettings) {
  return new Date(Date.parse(startAt) - settings.tenggat_konfirmasi_jam * 3_600_000).toISOString();
}
export function expandSlots(dates: string[], times: string[], repeatWeeks: number, minutes: number) {
  const slots = new Map<string, { id: string; date: string; startAt: string; endAt: string }>();
  for (const date of dates) for (let week = 0; week <= repeatWeeks; week++) for (const time of times) {
    const day = new Date(`${date}T00:00:00Z`);
    day.setUTCDate(day.getUTCDate() + week * 7);
    const dateKey = day.toISOString().slice(0, 10);
    const startAt = new Date(`${dateKey}T${time}:00+07:00`).toISOString();
    const endAt = new Date(Date.parse(startAt) + minutes * 60_000).toISOString();
    const id = `${dateKey.replaceAll("-", "")}-${time.replace(":", "")}`;
    slots.set(id, { id, date: dateKey, startAt, endAt });
  }
  return [...slots.values()];
}
