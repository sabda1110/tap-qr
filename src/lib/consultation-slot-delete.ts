import type { AdminConsultationBooking, ConsultationSlot } from "../server/consultations/consultation.types";

export type SlotBooking = Pick<AdminConsultationBooking, "id" | "slotId" | "status">;
export function slotDeleteState(slot: ConsultationSlot, bookings: SlotBooking[]) {
  if (!slot.bookingId) return slot.status === "dipesan" ? "protected" : "empty";
  const booking = bookings.find((booking) => booking.id === slot.bookingId && booking.slotId === slot.id);
  return booking?.status === "menunggu" ? "pending" : "protected";
}
