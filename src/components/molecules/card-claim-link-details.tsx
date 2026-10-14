import { Plus, X } from "lucide-react";
import { useFieldArray, type UseFormReturn } from "react-hook-form";

import type { Messages } from "../../i18n";
import type { CardLinksEditValues } from "../../server/outlets/outlet.schemas";
import { CustomInputText } from "../elements/custom-input-text";
import { SocialBrandMark } from "../elements/social-brand-mark";
import { WhatsAppNumberInput } from "../elements/whatsapp-number-input";
import { Button } from "../ui/button";
import { FormField } from "../ui/form";
import { ActivationGoogleSearch } from "./activation-google-search";

export function CardClaimLinkDetails({ form, content, activation }: {
  form: UseFormReturn<CardLinksEditValues>;
  content: Messages["cardClaim"];
  activation: Messages["adminDashboard"]["activation"];
}) {
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "links", keyName: "fieldKey" });

  return (
    <section>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">{content.detailsTitle}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">{content.detailsDescription}</p>
      </div>
      <h3 className="mt-7 text-base font-extrabold text-slate-950">{content.yourSelections}</h3>
      <div className="mt-3 grid gap-3">
        {fields.map((link, index) => {
          const type = form.watch(`links.${index}.type`);
          const channelType = type === "facebook" ? "custom" : type;
          const destination = activation.destinations[channelType];
          return (
            <article key={link.fieldKey} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
              <SocialBrandMark type={type === "facebook" ? "custom" : type} />
              <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2">
                <FormField control={form.control} name={`links.${index}.label`} render={({ field, fieldState }) => (
                  <CustomInputText {...field} label={channelType === "custom" ? content.additionalLink : activation.channels[channelType].title} error={fieldState.error ? content.invalid : undefined} />
                )} />
                <FormField control={form.control} name={`links.${index}.value`} render={({ field, fieldState }) =>
                  type === "google_review" ? (
                    <ActivationGoogleSearch inputId={`claim-google-${link.fieldKey}`} content={activation} value={field.value} onSelect={field.onChange} error={fieldState.error ? activation.onboarding.selectBusiness : undefined} />
                  ) : type === "whatsapp" ? (
                    <WhatsAppNumberInput {...field} label={destination.label} placeholder={destination.placeholder} error={fieldState.error ? content.invalid : undefined} />
                  ) : (
                    <CustomInputText {...field} label={destination.label} placeholder={destination.placeholder} inputMode="url" error={fieldState.error ? content.invalid : undefined} />
                  )
                } />
              </div>
              <Button type="button" variant="ghost" size="icon" className="shrink-0 rounded-full text-slate-500" aria-label={activation.onboarding.removeLink} onClick={() => remove(index)}>
                <X />
              </Button>
            </article>
          );
        })}
      </div>
      <Button
        type="button"
        variant="outline"
        disabled={fields.length >= 20}
        onClick={() => append({
          id: crypto.randomUUID(),
          type: "custom",
          label: content.additionalLink,
          value: "",
          isActive: true,
        })}
        className="mt-4 w-full rounded-xl border-dashed border-[#155ee8] text-[#155ee8] sm:w-auto"
      >
        <Plus />
        {content.addAdditionalLink}
      </Button>
    </section>
  );
}
