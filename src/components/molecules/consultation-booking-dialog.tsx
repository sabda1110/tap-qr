import { useState } from "react";
import { CalendarDays, Check, MessageCircle, RotateCw, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Language } from "../../i18n";
import type { AdminConsultationBooking, ConsultationSlot } from "../../server/consultations/consultation.types";
import { adminConsultationAction, retryConsultationNotification } from "../../server/consultations/consultation.functions";
import { consultationChatUrl, consultationCountdown, consultationDateLabel, consultationRangeLabel, consultationTimeLabel, consultationStatusClass, type ConsultationAdminCopy, type ConsultationMutation } from "../../lib/consultation-admin-view";
import { cn } from "../../lib/utils";
import { CustomInputText } from "../elements/custom-input-text";
import { Button } from "../ui/button";
import { Dialog, DialogBody, DialogFooter } from "../ui/dialog";
import { Form } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type Action = "confirm" | "cancel" | "reschedule" | "complete";
type Props = { booking: AdminConsultationBooking; slots: ConsultationSlot[]; cutoffHours: number; now: number; language: Language; copy: ConsultationAdminCopy; busy: boolean; mutate: ConsultationMutation; onClose: () => void; reasonLabels: Record<string, string> };

export function ConsultationBookingDialog({ booking, slots, cutoffHours, now, language, copy, busy, mutate, onClose, reasonLabels }: Props) {
  const [action, setAction] = useState<Action | null>(null);
  const schema = z.object({ reason: z.string().trim().max(300), slotId: z.string() })
    .refine((value) => (action !== "cancel" && action !== "reschedule") || value.reason.length > 0, { path: ["reason"], message: copy.reasonRequired })
    .refine((value) => action !== "reschedule" || Boolean(value.slotId), { path: ["slotId"], message: copy.slotRequired });
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { reason: "", slotId: "" } });
  const replacements = slots.filter((slot) => slot.status === "tersedia" && slot.id !== booking.slotId && Date.parse(slot.startAt) - now >= cutoffHours * 3_600_000);
  const active = booking.status === "menunggu" || booking.status === "dikonfirmasi";
  const labels: Record<Action, string> = { confirm: copy.confirm, cancel: copy.cancelBooking, reschedule: copy.reschedule, complete: copy.complete };
  const fields = [
    [copy.table.customer, `${booking.name} · +${booking.whatsapp}`],
    [copy.business, booking.businessName || copy.noBusiness],
    [copy.businessType, booking.businessType || copy.noBusiness],
    [copy.notes, booking.notes || copy.noBusiness],
  ];
  return <Dialog title={`${copy.table.details} · ${booking.code}`} closeLabel={copy.close} onClose={onClose} busy={busy} dismissOnOutsidePress={false} description={copy.actionDescription} icon={CalendarDays}>
    <Form {...form}><form className="flex min-h-0 flex-1 flex-col" onSubmit={form.handleSubmit(async (values) => {
      if (!action || busy) return;
      const success = await mutate(() => adminConsultationAction({ data: { id: booking.id, action, reason: values.reason || undefined, slotId: action === "reschedule" ? values.slotId : undefined } }));
      if (success) onClose();
    })}>
      <DialogBody>
        <div className="flex flex-wrap items-start justify-between gap-3 rounded-2xl bg-[#fff7e7] p-4">
          <div><p className="font-bold">{consultationDateLabel(booking.startAt, language)}</p><p className="mt-1 text-sm">{consultationRangeLabel(booking.startAt, booking.endAt)}</p></div>
          <span className={cn("rounded-full border px-3 py-1 text-xs font-bold", consultationStatusClass[booking.status])}>{copy.statuses[booking.status]}</span>
        </div>
        {booking.status === "menunggu" && <div className={cn("mt-4 rounded-xl border p-4 text-sm", Date.parse(booking.deadlineAt) - now < 3_600_000 ? "border-amber-300 bg-amber-50 text-amber-900" : "border-black/8 bg-white")}><p className="font-bold">{consultationCountdown(booking.deadlineAt, now, copy)}</p><p className="mt-1 text-xs">{copy.deadline}: {consultationDateLabel(booking.deadlineAt, language)}, {consultationTimeLabel(booking.deadlineAt)} WIB</p></div>}
        <dl className="mt-5 grid gap-4 sm:grid-cols-2">{fields.map(([label, value]) => <div key={label} className="min-w-0"><dt className="text-xs text-[#69737d]">{label}</dt><dd className="mt-1 break-words text-sm font-semibold">{value}</dd></div>)}</dl>
        {booking.reason && <p className="mt-4 rounded-xl bg-[#f0f3f5] p-4 text-sm"><strong>{copy.reason}: </strong>{reasonLabels[booking.reason] ?? booking.reason}</p>}
        {booking.status === "dikonfirmasi" && <p className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">{copy.confirmationChatHelp}</p>}
        <div className="mt-5 flex flex-wrap gap-2">
          <Button type="button" variant="outline" nativeButton={false} render={<a href={consultationChatUrl(booking, language, copy)} target="_blank" rel="noreferrer" />}><MessageCircle />{booking.status === "dikonfirmasi" ? copy.sendConfirmation : copy.chat}</Button>
          {booking.isNew && <Button type="button" variant="outline" disabled={busy} onClick={() => void mutate(() => adminConsultationAction({ data: { id: booking.id, action: "seen" } }))}><Check />{copy.markSeen}</Button>}
        </div>
        {booking.notificationPending && <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4"><p className="text-sm font-semibold text-amber-900">{copy.notificationPending}</p><Button type="button" variant="outline" className="mt-3 bg-white" disabled={busy} onClick={() => void mutate(() => retryConsultationNotification({ data: { id: booking.id } }))}><RotateCw />{copy.resend}</Button></div>}
        {action && <fieldset disabled={busy} className="mt-5 space-y-4 rounded-2xl border border-black/10 bg-white p-4">
          <legend className="px-1 text-sm font-bold">{labels[action]}</legend>
          {(action === "confirm" || action === "complete") && <p className="text-sm leading-6 text-[#69737d]">{action === "confirm" ? copy.confirmDescription : copy.completeDescription}</p>}
          {action === "reschedule" && <div><label className="mb-2 block text-sm font-semibold" id="consultation-replacement-label">{copy.newSlot}</label><Select items={replacements.map((slot) => ({ value: slot.id, label: `${consultationDateLabel(slot.startAt, language)} · ${consultationRangeLabel(slot.startAt, slot.endAt)}` }))} value={form.watch("slotId")} onValueChange={(value) => form.setValue("slotId", value ?? "", { shouldValidate: true })} disabled={busy || !replacements.length}><SelectTrigger aria-labelledby="consultation-replacement-label" className="w-full min-w-0"><SelectValue placeholder={copy.newSlot} /></SelectTrigger><SelectContent>{replacements.map((slot) => <SelectItem key={slot.id} value={slot.id}>{consultationDateLabel(slot.startAt, language)} · {consultationRangeLabel(slot.startAt, slot.endAt)}</SelectItem>)}</SelectContent></Select>{!replacements.length && <p className="mt-2 text-sm text-amber-900">{copy.noReplacement}</p>}{form.formState.errors.slotId && <p role="alert" className="mt-2 text-sm text-red-700">{copy.slotRequired}</p>}</div>}
          {(action === "cancel" || action === "reschedule") && <CustomInputText label={copy.reasonLabel} helpText={copy.reasonHelp} maxLength={300} {...form.register("reason")} error={form.formState.errors.reason ? copy.reasonRequired : undefined} />}
        </fieldset>}
      </DialogBody>
      <DialogFooter>
        {action ? <><Button type="button" variant="outline" disabled={busy} onClick={() => { setAction(null); form.clearErrors(); }}>{copy.cancel}</Button><Button type="submit" variant={action === "cancel" ? "destructive" : "default"} disabled={busy || (action === "confirm" && Date.parse(booking.deadlineAt) <= now)}>{busy ? copy.saving : labels[action]}</Button></> : <>
          <Button type="button" variant="outline" disabled={busy} onClick={onClose}>{copy.close}</Button>
          {active && <Button type="button" variant="destructive" disabled={busy} onClick={() => setAction("cancel")}><X />{copy.cancelBooking}</Button>}
          {active && <Button type="button" variant="outline" disabled={busy} onClick={() => setAction("reschedule")}>{copy.reschedule}</Button>}
          {booking.status === "menunggu" && <Button type="button" disabled={busy || Date.parse(booking.deadlineAt) <= now} onClick={() => setAction("confirm")}><Check />{copy.confirm}</Button>}
          {booking.status === "dikonfirmasi" && <Button type="button" disabled={busy || Date.parse(booking.endAt) > now} onClick={() => setAction("complete")}>{copy.complete}</Button>}
        </>}
      </DialogFooter>
    </form></Form>
  </Dialog>;
}
