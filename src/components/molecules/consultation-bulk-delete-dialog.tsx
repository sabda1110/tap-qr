import { useState } from "react";
import { Trash2 } from "lucide-react";
import type { Language } from "../../i18n";
import { consultationDateLabel, consultationRangeLabel, type ConsultationAdminCopy, type ConsultationMutation } from "../../lib/consultation-admin-view";
import { slotDeleteState, type SlotBooking } from "../../lib/consultation-slot-delete";
import type { ConsultationSlot } from "../../server/consultations/consultation.types";
import { deleteAdminConsultationSlots } from "../../server/consultations/consultation.functions";
import { Dialog, DialogBody, DialogFooter } from "../ui/dialog";
import { AlertDialog } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

export function ConsultationBulkDeleteDialog({ slots, bookings, language, copy, busy, mutate, onClose }: {
  slots: ConsultationSlot[]; bookings: SlotBooking[]; language: Language;
  copy: ConsultationAdminCopy; busy: boolean; mutate: ConsultationMutation; onClose: () => void;
}) {
  const [requested, setRequested] = useState<string[]>([]);
  const [confirming, setConfirming] = useState(false);
  const rows = [...slots].sort((a, b) => a.startAt.localeCompare(b.startAt));
  const eligible = rows.filter((slot) => slotDeleteState(slot, bookings) !== "protected");
  const ids = requested.filter((id) => eligible.some((slot) => slot.id === id));
  const remove = async () => {
    if (busy || !ids.length) return;
    const success = await mutate(() => deleteAdminConsultationSlots({ data: { ids } }));
    setConfirming(false);
    if (success) onClose();
  };
  return <>
    <Dialog title={copy.bulkDelete.title} description={copy.bulkDelete.description} icon={Trash2}
      closeLabel={copy.close} onClose={onClose} busy={busy} dismissOnOutsidePress={false}>
      <DialogBody>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Button variant="outline" disabled={busy || !eligible.length} onClick={() => setRequested(eligible.slice(0, 50).map((slot) => slot.id))}>{copy.bulkDelete.all}</Button>
          <Button variant="ghost" disabled={busy || !ids.length} onClick={() => setRequested([])}>{copy.bulkDelete.clear}</Button>
          <p role="status" className="text-sm font-bold">{copy.bulkDelete.selected.replace("{count}", String(ids.length))}</p>
        </div>
        <div className="space-y-2">
          {rows.map((slot) => {
            const state = slotDeleteState(slot, bookings);
            const checked = ids.includes(slot.id);
            return <label key={slot.id} className={`flex items-start gap-3 rounded-xl border p-4 ${state === "protected" ? "border-black/8 bg-gray-50" : checked ? "border-[#ffb332] bg-[#fff8e9]" : "border-black/10 bg-white"}`}>
              <Checkbox checked={checked} disabled={busy || state === "protected" || (!checked && ids.length >= 50)}
                onCheckedChange={(value) => setRequested(value ? [...ids, slot.id] : ids.filter((id) => id !== slot.id))}
                aria-label={`${consultationDateLabel(slot.startAt, language)}, ${consultationRangeLabel(slot.startAt, slot.endAt)}`} className="mt-1" />
              <span className="min-w-0">
                <span className="block text-sm font-bold">{consultationDateLabel(slot.startAt, language)} · {consultationRangeLabel(slot.startAt, slot.endAt)}</span>
                <span className={`mt-1 block text-xs leading-5 ${state === "pending" ? "text-amber-900" : "text-[#69737d]"}`}>
                  {state === "protected" ? copy.bulkDelete.protected : state === "pending" ? copy.bulkDelete.pending : copy.slotStatuses[slot.status]}
                </span>
              </span>
            </label>;
          })}
          {!rows.length && <p>{copy.bulkDelete.empty}</p>}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="outline" disabled={busy} onClick={onClose}>{copy.close}</Button>
        <Button variant="destructive" disabled={busy || !ids.length} onClick={() => setConfirming(true)}><Trash2 />{copy.bulkDelete.action.replace("{count}", String(ids.length))}</Button>
      </DialogFooter>
    </Dialog>
    <AlertDialog open={confirming} onOpenChange={(value) => { if (!busy) setConfirming(value); }}
      title={copy.bulkDelete.confirmTitle} description={copy.bulkDelete.confirmDescription.replace("{count}", String(ids.length))}
      cancelLabel={copy.cancel} confirmLabel={busy ? copy.saving : copy.bulkDelete.action.replace("{count}", String(ids.length))}
      onConfirm={() => void remove()} />
  </>;
}
