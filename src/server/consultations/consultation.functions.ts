import { createServerFn } from "@tanstack/react-start";
import { getRequestIP, setResponseHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireAdmin } from "../auth/authorization.server";
import { bookingActionSchema, bookingInputSchema, consultationSettingsSchema, consultationTokenSchema, slotActionSchema, slotBulkDeleteSchema, slotCreationSchema, normalizeConsultationPhone } from "./consultation.schemas";
import { deleteConsultationSlots } from "./consultation-slot-delete.repository.server";
import { canBookSlot } from "./consultation-policy";
import { bookingsRef, consultationRateLimit, hashConsultation, readConsultationSettings } from "./consultation-store.server";
import { createConsultation, findBookingByCancelToken, listConsultationBookings, listConsultationSlots, readPublicConsultation } from "./consultation.repository.server";
import { changeConsultationBooking } from "./consultation-actions.repository.server";
import { changeSlot, createSlots, writeConsultationSettings } from "./consultation-slots.repository.server";
import { runConsultationMaintenance } from "./consultation-maintenance.server";
import { dispatchConsultationNotifications } from "./consultation-notifications.server";

function privateResponse() {
  setResponseHeader("Cache-Control", "private, no-store");
  setResponseHeader("Referrer-Policy", "no-referrer");
  setResponseHeader("X-Robots-Tag", "noindex, nofollow");
}
function adminWhatsApp() {
  const phone = normalizeConsultationPhone(process.env.ADMIN_WHATSAPP ?? "");
  return /^628\d{8,11}$/.test(phone) ? phone : null;
}
const knownReasons = new Set(["confirmedSlot", "slotUnavailable", "limit", "slotBooked", "deadlinePassed", "invalidStatus", "duplicateSlot", "slotPast", "notFound", "notificationFailed"]);
function safeReason(error: unknown) { return error instanceof Error && knownReasons.has(error.message) ? error.message : "error"; }
async function mutation(work: () => Promise<unknown>) {
  privateResponse();
  try { await work(); return { success: true as const }; }
  catch (error) { return { success: false as const, reason: safeReason(error) }; }
}
async function maintenance() { await runConsultationMaintenance({ budgetMs: 5_000, maxEvents: 2 }); }
async function notify(id?: string) {
  try { await dispatchConsultationNotifications(id); }
  catch { console.warn("consultation_notification_dispatch_failed"); }
}

export const getConsultationAvailability = createServerFn({ method: "GET" }).handler(async () => {
  privateResponse();
  await maintenance();
  const [settings, slots] = await Promise.all([readConsultationSettings(), listConsultationSlots()]);
  const now = Date.now();
  return { settings, slots: slots.map(({ bookingId: _bookingId, createdAt: _created, ...slot }) => ({ ...slot, bookable: canBookSlot(slot, settings, now) })), whatsappNumber: adminWhatsApp(), serverNow: new Date(now).toISOString() };
});
export const submitConsultation = createServerFn({ method: "POST" }).validator(bookingInputSchema).handler(async ({ data }) => {
  privateResponse();
  if (data.website) return { success: false as const, reason: "bot" };
  try {
    await consultationRateLimit(getRequestIP({ xForwardedFor: true }) ?? "unknown");
    await maintenance();
    const id = await createConsultation(data);
    await notify(id);
    return { success: true as const, token: data.statusToken };
  } catch (error) { return { success: false as const, reason: safeReason(error) }; }
});
export const getConsultationStatus = createServerFn({ method: "POST" }).validator(z.object({ token: consultationTokenSchema })).handler(async ({ data }) => {
  privateResponse();
  await maintenance();
  return { booking: await readPublicConsultation(data.token), whatsappNumber: adminWhatsApp(), serverNow: new Date().toISOString() };
});
export const cancelConsultation = createServerFn({ method: "POST" }).validator(z.object({ token: consultationTokenSchema })).handler(async ({ data }) => mutation(async () => {
  await consultationRateLimit(getRequestIP({ xForwardedFor: true }) ?? "unknown");
  await maintenance();
  const id = await findBookingByCancelToken(data.token);
  if (!id) throw new Error("notFound");
  await changeConsultationBooking({ id, action: "cancel", reason: "cancelledByCustomer", expectedCancelHash: hashConsultation(data.token) });
  await notify(id);
}));
export const getAdminConsultations = createServerFn({ method: "GET" }).handler(async () => {
  privateResponse();
  const user = await requireAdmin();
  await maintenance();
  const [settings, slots, bookings] = await Promise.all([readConsultationSettings(), listConsultationSlots(true), listConsultationBookings()]);
  return { user, settings, slots, bookings, serverNow: new Date().toISOString(), whatsappNumber: adminWhatsApp() };
});
export const createConsultationSlots = createServerFn({ method: "POST" }).validator(slotCreationSchema).handler(async ({ data }) => {
  await requireAdmin(); return mutation(() => createSlots(data));
});
export const changeConsultationSlot = createServerFn({ method: "POST" }).validator(slotActionSchema).handler(async ({ data }) => {
  await requireAdmin(); return mutation(async () => { await changeSlot(data); if (data.action === "delete") await notify(); });
});
export const deleteAdminConsultationSlots = createServerFn({ method: "POST" }).validator(slotBulkDeleteSchema).handler(async ({ data }) => {
  await requireAdmin(); return mutation(async () => { await deleteConsultationSlots(data.ids); await notify(); });
});
export const saveConsultationSettings = createServerFn({ method: "POST" }).validator(consultationSettingsSchema).handler(async ({ data }) => {
  await requireAdmin(); return mutation(() => writeConsultationSettings(data));
});
export const adminConsultationAction = createServerFn({ method: "POST" }).validator(bookingActionSchema).handler(async ({ data }) => {
  await requireAdmin();
  return mutation(async () => { await maintenance(); await changeConsultationBooking(data); await notify(data.id); });
});
export const retryConsultationNotification = createServerFn({ method: "POST" }).validator(z.object({ id: consultationTokenSchema })).handler(async ({ data }) => {
  await requireAdmin();
  return mutation(async () => {
    await dispatchConsultationNotifications(data.id);
    const booking = await bookingsRef().doc(data.id).get();
    if (!booking.exists) throw new Error("notFound");
    if (booking.data()?.notificationPending) throw new Error("notificationFailed");
  });
});
