import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { ConsultationSettings } from "../../server/consultations/consultation.types";
import { saveConsultationSettings } from "../../server/consultations/consultation.functions";
import { consultationSettingsSchema } from "../../server/consultations/consultation.schemas";
import type { ConsultationAdminCopy, ConsultationMutation } from "../../lib/consultation-admin-view";
import { CustomInputText } from "../elements/custom-input-text";
import { Button } from "../ui/button";
import { Form } from "../ui/form";

type Props = { settings: ConsultationSettings; copy: ConsultationAdminCopy; busy: boolean; mutate: ConsultationMutation };

export function ConsultationSettingsForm({ settings, copy, busy, mutate }: Props) {
  const form = useForm<ConsultationSettings>({ resolver: zodResolver(consultationSettingsSchema), defaultValues: settings });
  const fields = [
    ["durasi_slot_menit", copy.settings.duration, 5, 180, 1],
    ["tenggat_konfirmasi_jam", copy.settings.confirmation, 0.25, 168, 0.25],
    ["batas_pemesanan_jam", copy.settings.cutoff, 0.5, 336, 0.25],
    ["maks_booking_aktif_per_nomor", copy.settings.maxActive, 1, 20, 1],
  ] as const;
  return <section className="max-w-3xl rounded-3xl border border-black/8 bg-white p-5 sm:p-7">
    <h2 className="text-xl font-bold">{copy.settings.title}</h2>
    <p className="mt-2 text-sm leading-6 text-[#69737d]">{copy.settings.description}</p>
    <Form {...form}><form className="mt-6" onSubmit={form.handleSubmit(async (values) => { await mutate(() => saveConsultationSettings({ data: values })); })}>
      <fieldset disabled={busy} className="grid gap-5 sm:grid-cols-2">
        {fields.map(([name, label, min, max, step]) => <CustomInputText key={name} label={label} type="number" min={min} max={max} step={step} {...form.register(name, { valueAsNumber: true })} error={form.formState.errors[name] ? copy.settings.invalid : undefined} />)}
      </fieldset>
      <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">{copy.settings.help}</p>
      <Button className="mt-5 w-full sm:w-auto" type="submit" disabled={busy}>{busy ? copy.saving : copy.save}</Button>
    </form></Form>
  </section>;
}
