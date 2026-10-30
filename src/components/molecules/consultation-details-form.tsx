import { ArrowLeft } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import type { Messages } from "../../i18n";
import { bookingFieldsSchema } from "../../server/consultations/consultation.schemas";
import { CustomInputText } from "../elements/custom-input-text";
import { landingButtonStyles } from "../elements/landing-button";
import { Button } from "../ui/button";
import { Form } from "../ui/form";

export type ConsultationFormValues = z.output<typeof bookingFieldsSchema>;
type Props = { content: Messages["consultation"]; onSubmit: (values: ConsultationFormValues) => Promise<void>; disabled: boolean; pending: boolean; error: string | null; onBack: () => void };

export function ConsultationDetailsForm({ content, onSubmit, disabled, pending, error, onBack }: Props) {
  const form = useForm<z.input<typeof bookingFieldsSchema>, unknown, ConsultationFormValues>({
    resolver: zodResolver(bookingFieldsSchema),
    defaultValues: { name: "", whatsapp: "", businessName: "", businessType: "", notes: "", website: "" },
  });
  const fieldError = (field: keyof typeof content.validation) => form.formState.errors[field] ? content.validation[field] : undefined;
  return <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">
    <fieldset disabled={pending} className="space-y-5 disabled:opacity-65">
      <div className="grid gap-4 sm:grid-cols-2">
        <CustomInputText {...form.register("name")} label={content.name} placeholder={content.namePlaceholder} autoComplete="name" maxLength={100} required error={fieldError("name")} reserveMessageSpace />
        <CustomInputText {...form.register("whatsapp")} label={content.whatsapp} placeholder={content.whatsappPlaceholder} type="tel" inputMode="tel" autoComplete="tel" maxLength={24} required error={fieldError("whatsapp")} helpText={content.phoneHelp} reserveMessageSpace />
        <CustomInputText {...form.register("businessName")} label={content.businessName} autoComplete="organization" maxLength={100} error={fieldError("businessName")} />
        <CustomInputText {...form.register("businessType")} label={content.businessType} placeholder={content.businessTypePlaceholder} maxLength={80} error={fieldError("businessType")} />
      </div>
      <CustomInputText {...form.register("notes")} label={content.notes} helpText={content.notesHelp} maxLength={300} error={fieldError("notes")} />
      <div className="absolute -left-[10000px]" aria-hidden="true"><label htmlFor="consultation-website">{content.website}</label><input {...form.register("website")} id="consultation-website" tabIndex={-1} autoComplete="off" /></div>
      {error ? <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">{error}</p> : null}
      <div className="flex flex-col-reverse gap-3 sm:flex-row">
      <Button type="button" variant="outline" onClick={onBack} disabled={pending} className="min-h-12 whitespace-normal"><ArrowLeft aria-hidden="true" />{content.bookingFlow.back}</Button>
      <Button type="submit" disabled={disabled || pending} className={landingButtonStyles({ className: "min-h-12 flex-1 whitespace-normal" })}>{pending ? content.submitting : content.submit}</Button>
      </div>
      <p className="text-center text-xs leading-5 text-[#69737d]">{content.pendingHelp}</p>
    </fieldset>
    <p className="border-t border-black/8 pt-4 text-xs leading-5 text-[#69737d]">{content.privacy}</p>
  </form></Form>;
}
