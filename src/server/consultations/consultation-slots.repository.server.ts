import type { z } from "zod";
import type { slotActionSchema, slotCreationSchema } from "./consultation.schemas";
import type { ConsultationSettings } from "./consultation.types";
import { expandSlots } from "./consultation-policy";
import { consultationDb, lockRef, resolveSettings, settingsRef, slotsRef } from "./consultation-store.server";

export async function createSlots(input: z.infer<typeof slotCreationSchema>) {
  return consultationDb().runTransaction(async (tx) => {
    const settings = resolveSettings((await tx.get(settingsRef())).data());
    const slots = expandSlots(input.dates, input.times, input.repeatWeeks, settings.durasi_slot_menit);
    const now = Date.now();
    if (slots.some((slot) => Date.parse(slot.startAt) <= now || Date.parse(slot.startAt) > now + 366 * 86_400_000)) throw new Error("slotPast");
    const snapshots = await Promise.all(slots.map((slot) => tx.get(slotsRef().doc(slot.id))));
    if (snapshots.some((doc) => doc.exists)) throw new Error("duplicateSlot");
    slots.forEach((slot) => tx.create(slotsRef().doc(slot.id), { ...slot, status: "tersedia", bookingId: null, createdAt: new Date(now).toISOString() }));
  });
}
export async function changeSlot(input: z.infer<typeof slotActionSchema>) {
  return consultationDb().runTransaction(async (tx) => {
    const ref = slotsRef().doc(input.id);
    const [doc, lock] = await Promise.all([tx.get(ref), tx.get(lockRef(input.id))]);
    if (!doc.exists) throw new Error("notFound");
    if (doc.data()?.status === "dipesan" || doc.data()?.bookingId || lock.exists) throw new Error("slotBooked");
    if (input.action === "delete") tx.delete(ref);
    else {
      if (input.action === "open" && Date.parse(doc.data()!.startAt) <= Date.now()) throw new Error("slotPast");
      tx.update(ref, { status: input.action === "open" ? "tersedia" : "ditutup" });
    }
  });
}
export async function writeConsultationSettings(settings: ConsultationSettings) {
  await settingsRef().set(settings);
}
