import { z } from "zod";
import { bookingStatuses } from "./consultation.types";

const text = (max: number) => z.string().trim().max(max).transform((value) => value.replace(/[\u0000-\u001f\u007f<>]/g, " ").trim());
export function normalizeConsultationPhone(input: string) {
  const value = input.replace(/[\s()+.-]/g, "");
  return value.startsWith("0") ? `62${value.slice(1)}` : value;
}
export const phoneSchema = z.string().trim().max(30).transform(normalizeConsultationPhone).pipe(z.string().regex(/^628\d{8,11}$/));
export const bookingFieldsSchema = z.object({
  name: text(100).pipe(z.string().min(2)), whatsapp: phoneSchema,
  businessName: text(100).default(""), businessType: text(80).default(""),
  notes: text(300).default(""), website: z.string().max(300).default(""),
});
export const consultationTokenSchema = z.string().regex(/^[a-f0-9]{64}$/);
export const bookingInputSchema = bookingFieldsSchema.extend({
  slotId: z.string().regex(/^\d{8}-\d{4}$/),
  statusToken: consultationTokenSchema, cancelToken: consultationTokenSchema,
}).refine((data) => data.statusToken !== data.cancelToken, { path: ["cancelToken"], message: "INVALID_TOKEN" });
export const consultationSettingsSchema = z.object({
  durasi_slot_menit: z.number().int().min(5).max(180),
  tenggat_konfirmasi_jam: z.number().min(0.25).max(168),
  batas_pemesanan_jam: z.number().min(0.5).max(336),
  maks_booking_aktif_per_nomor: z.number().int().min(1).max(20),
}).refine((value) => value.batas_pemesanan_jam > value.tenggat_konfirmasi_jam, { path: ["batas_pemesanan_jam"], message: "CUTOFF_MUST_EXCEED_DEADLINE" });
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((date) => {
  const parsed = new Date(`${date}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(date);
});
export const slotCreationSchema = z.object({
  dates: z.array(dateSchema).min(1).max(31), times: z.array(z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/)).min(1).max(24),
  repeatWeeks: z.number().int().min(0).max(12).default(0),
}).refine((value) => value.dates.length * value.times.length * (value.repeatWeeks + 1) <= 100, { message: "TOO_MANY_SLOTS" });
export const slotActionSchema = z.object({ id: z.string().regex(/^\d{8}-\d{4}$/), action: z.enum(["close", "open", "delete"]) });
export const bookingActionSchema = z.object({
  id: consultationTokenSchema, action: z.enum(["confirm", "cancel", "reschedule", "complete", "seen"]),
  slotId: z.string().regex(/^\d{8}-\d{4}$/).optional(), reason: text(300).optional(),
}).refine((data) => data.action !== "reschedule" || Boolean(data.slotId), { path: ["slotId"], message: "SLOT_REQUIRED" });
export const consultationFiltersSchema = z.object({ date: dateSchema.optional(), status: z.enum(bookingStatuses).optional() });
export type BookingInput = z.infer<typeof bookingInputSchema>;
