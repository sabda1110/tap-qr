import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight, CalendarPlus, Check } from "lucide-react";
import type { Language } from "../../i18n";
import { consultationDateLabel, consultationRangeLabel, type ConsultationAdminCopy, type ConsultationMutation } from "../../lib/consultation-admin-view";
import { consultationSlotDraft } from "../../lib/consultation-slot-draft";
import { slotCreationSchema } from "../../server/consultations/consultation.schemas";
import type { ConsultationSettings, ConsultationSlot } from "../../server/consultations/consultation.types";
import { createConsultationSlots } from "../../server/consultations/consultation.functions";
import { ConsultationDateSelection } from "./consultation-date-selection";
import { ConsultationTimeSelection } from "./consultation-time-selection";
import { Button } from "../ui/button";
import { Dialog, DialogBody, DialogFooter } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Form } from "../ui/form";

type Props = { copy: ConsultationAdminCopy; language: Language; now: number; settings: ConsultationSettings; slots: ConsultationSlot[]; busy: boolean; mutate: ConsultationMutation; onClose: () => void; onCreated: (date: string) => void };
type Values = z.input<typeof slotCreationSchema>;

export function ConsultationSlotForm({ copy, language, now, settings, slots, busy, mutate, onClose, onCreated }: Props) {
  const [step, setStep] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const form = useForm<Values, unknown, z.output<typeof slotCreationSchema>>({ resolver: zodResolver(slotCreationSchema), defaultValues: { dates: [], times: [], repeatWeeks: 0 } });
  const [dates, times, repeatWeeks] = form.watch(["dates", "times", "repeatWeeks"]);
  const draft = consultationSlotDraft(dates, times, repeatWeeks ?? 0, settings, slots, now);
  const inputValid = slotCreationSchema.safeParse({ dates, times, repeatWeeks }).success;
  const blocked = draft.some((slot) => slot.issue !== null);
  const steps = [copy.wizard.dates, copy.wizard.times, copy.wizard.review];
  const repeatOptions = [0, 1, 3, 7].map((value) => ({ value: String(value), label: value === 0 ? copy.wizard.noRepeat : copy.wizard.repeatWeeks.replace("{count}", String(value + 1)) }));
  const update = (field: "dates" | "times", value: string[]) => form.setValue(field, value, { shouldValidate: true });
  const count = dates.length * times.length * ((repeatWeeks ?? 0) + 1);
  return <Dialog title={copy.wizard.create} description={copy.wizard.description} closeLabel={copy.close} onClose={onClose} busy={busy} dismissOnOutsidePress={false} icon={CalendarPlus}>
    <Form {...form}><form className="flex min-h-0 flex-1 flex-col" onSubmit={form.handleSubmit(async (values) => {
      if (step !== 2 || blocked || busy || !draft.length) return;
      if (await mutate(() => createConsultationSlots({ data: values }))) onCreated(draft[0].date);
    })}>
      <div className="shrink-0 border-b border-black/8 bg-white px-5 py-4 sm:px-6">
        <ol className="grid grid-cols-3 gap-2">{steps.map((label, index) => <li key={label} aria-current={step === index ? "step" : undefined} className={`flex items-center gap-2 text-xs font-bold sm:text-sm ${step >= index ? "text-[#172029]" : "text-[#69737d]"}`}><span className={`grid size-7 shrink-0 place-items-center rounded-full ${step >= index ? "bg-[#ffb332]" : "bg-[#edf0f2]"}`}>{index < step ? <Check className="size-4" /> : index + 1}</span>{label}</li>)}</ol>
      </div>
      <DialogBody>
        <fieldset disabled={busy}>
          {step === 0 && <ConsultationDateSelection dates={dates} onChange={(value) => update("dates", value)} now={now} language={language} copy={copy} disabled={busy} />}
          {step === 1 && <ConsultationTimeSelection times={times} onChange={(value) => update("times", value)} duration={settings.durasi_slot_menit} copy={copy} disabled={busy} />}
          {step === 2 && <div className="space-y-5">
            <div className="rounded-2xl border border-[#ffb332]/40 bg-[#fff6e3] p-5"><h2 className="text-xl font-bold">{copy.wizard.summary.replace("{count}", String(draft.length))}</h2><p className="mt-2 text-sm leading-6 text-[#69737d]">{copy.wizard.summaryHelp}</p></div>
            <div><label id="consultation-repeat-label" className="mb-2 block text-sm font-bold">{copy.wizard.repeatLabel}</label><Select items={repeatOptions} value={String(repeatWeeks ?? 0)} onValueChange={(value) => form.setValue("repeatWeeks", Number(value ?? 0), { shouldValidate: true })} disabled={busy}><SelectTrigger aria-labelledby="consultation-repeat-label" className="w-full"><SelectValue /></SelectTrigger><SelectContent>{repeatOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select><p className="mt-2 text-xs leading-5 text-[#69737d]">{copy.wizard.repeatHelp}</p></div>
            {count > 100 && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">{copy.slots.tooMany}</p>}
            {blocked && <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">{copy.wizard.conflictHelp}</p>}
            <div className="divide-y divide-black/8 rounded-xl border border-black/8 bg-white px-4">{(showAll ? draft.slice(0, 100) : draft.slice(0, 8)).map((slot) => <div key={slot.id} className="flex flex-wrap items-center justify-between gap-2 py-3"><div><p className="text-sm font-semibold">{consultationDateLabel(slot.startAt, language)}</p><p className="mt-1 text-xs text-[#69737d]">{consultationRangeLabel(slot.startAt, slot.endAt)}</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${slot.issue ? "bg-red-50 text-red-800" : "bg-emerald-50 text-emerald-800"}`}>{slot.issue ? copy.wizard[slot.issue] : copy.wizard.ready}</span></div>)}</div>
            {draft.length > 8 && draft.length <= 100 && <Button type="button" variant="ghost" className="w-full" onClick={() => setShowAll(!showAll)}>{showAll ? copy.wizard.showLess : copy.wizard.showAll.replace("{count}", String(draft.length))}</Button>}
            <p className="text-xs leading-6 text-[#69737d]">{copy.wizard.cutoffHelp.replace("{hours}", String(settings.batas_pemesanan_jam))}</p>
          </div>}
        </fieldset>
      </DialogBody>
      <DialogFooter className="sm:items-center sm:justify-between">
        <Button type="button" variant="outline" disabled={busy} onClick={() => step === 0 ? onClose() : setStep(step - 1)}><ArrowLeft />{step === 0 ? copy.close : copy.wizard.back}</Button>
        {step < 2 ? <Button key="next" type="button" disabled={busy || (step === 0 ? !dates.length : !times.length)} onClick={() => setStep(step + 1)}>{step === 0 ? copy.wizard.chooseTimes : copy.wizard.review}<ArrowRight /></Button> : <Button key="save" type="submit" disabled={busy || !inputValid || blocked || !draft.length}><CalendarPlus />{busy ? copy.saving : copy.wizard.publish.replace("{count}", String(draft.length))}</Button>}
      </DialogFooter>
    </form></Form>
  </Dialog>;
}
