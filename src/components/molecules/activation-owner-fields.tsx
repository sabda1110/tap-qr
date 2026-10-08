import { useRef } from "react";
import type { AvailabilityStatus } from "../../hooks/use-debounced-availability";
import type { UseFormReturn } from "react-hook-form";
import type { Messages } from "../../i18n";
import type { OwnerActivationValues } from "../../lib/validation/owner-activation-schema";
import { toOutletSlug } from "../../lib/validation/outlet-slug";
import { CustomInputText } from "../elements/custom-input-text";
import { OutletSlugInput } from "../elements/outlet-slug-input";
import { WhatsAppNumberInput } from "../elements/whatsapp-number-input";
import { FormField } from "../ui/form";
import { ImageUploadField } from "./image-upload-field";

type Content = Messages["adminDashboard"]["activation"]["onboarding"];
const accountFields = ["name", "email", "phone", "password"] as const;
const outletFields = ["outletName", "slug", "address"] as const;

export function ActivationOwnerFields({ form, content, emailStatus, slugStatus, onUploadBusyChange }: { form: UseFormReturn<OwnerActivationValues>; content: Content; emailStatus: AvailabilityStatus; slugStatus: AvailabilityStatus; onUploadBusyChange: (busy: boolean) => void }) {
  const hasManualSlug = useRef(false);
  return <>{[accountFields, outletFields].map((fields, index) => <section className="rounded-2xl border border-black/8 bg-white p-5 sm:p-6" key={index}>
    <h2 className="mb-5 text-lg font-bold">{index === 0 ? content.accountTitle : content.outletTitle}</h2>
    {index === 1 && <FormField control={form.control} name="logoUrl" render={({ field }) => <ImageUploadField value={field.value} onChange={field.onChange} onBusyChange={onUploadBusyChange} content={content.logo} disabled={form.formState.isSubmitting} />} />}
    <div className="grid items-start gap-x-5 gap-y-2 sm:grid-cols-2">{fields.map((name) => <FormField key={name} control={form.control} name={name} render={({ field, fieldState }) => name === "phone" ? <WhatsAppNumberInput {...field}
      label={content.fields[name]} error={fieldState.error ? content.invalid : undefined} reserveMessageSpace
    /> : name === "slug" ? <OutletSlugInput {...field}
      label={content.fields[name]} error={slugStatus === "used" ? content.slugUsed : slugStatus === "error" ? content.slugCheckError : fieldState.error ? content.invalid : undefined} reserveMessageSpace
      helpText={slugStatus === "checking" ? content.slugChecking : slugStatus === "available" ? content.slugAvailable : content.slugHelp}
      onChange={(event) => { hasManualSlug.current = true; field.onChange(event); }}
    /> : <CustomInputText {...field}
      label={content.fields[name]} error={name === "email" && emailStatus === "used" ? content.emailUsed : name === "email" && emailStatus === "error" ? content.emailCheckError : fieldState.error ? content.invalid : undefined} reserveMessageSpace
      type={name === "password" ? "password" : name === "email" ? "email" : "text"}
      autoComplete={name === "password" ? "new-password" : "off"}
      helpText={name === "email" ? emailStatus === "checking" ? content.emailChecking : emailStatus === "available" ? content.emailAvailable : undefined : name === "password" ? content.passwordHelp : undefined}
      onChange={name === "outletName" ? (event) => { field.onChange(event); if (!hasManualSlug.current) form.setValue("slug", toOutletSlug(event.currentTarget.value), { shouldDirty: true, shouldValidate: true }); } : field.onChange}
    />} />)}</div>
  </section>)}</>;
}
