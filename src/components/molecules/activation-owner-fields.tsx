import type { AvailabilityStatus } from "../../hooks/use-debounced-availability";
import type { UseFormReturn } from "react-hook-form";
import type { Messages } from "../../i18n";
import type { OwnerActivationValues } from "../../lib/validation/owner-activation-schema";
import { CustomInputText } from "../elements/custom-input-text";
import { FormField } from "../ui/form";

type Content = Messages["adminDashboard"]["activation"]["onboarding"];
const accountFields = ["name", "email", "phone", "password"] as const;
const outletFields = ["outletName", "slug", "address", "city", "province"] as const;

export function ActivationOwnerFields({ form, content, emailStatus, slugStatus }: { form: UseFormReturn<OwnerActivationValues>; content: Content; emailStatus: AvailabilityStatus; slugStatus: AvailabilityStatus }) {
  return <>{[accountFields, outletFields].map((fields, index) => <section className="rounded-2xl border border-black/8 bg-white p-5 sm:p-6" key={index}>
    <h2 className="mb-5 text-lg font-bold">{index === 0 ? content.accountTitle : content.outletTitle}</h2>
    <div className="grid items-start gap-x-5 gap-y-2 sm:grid-cols-2">{fields.map((name) => <FormField key={name} control={form.control} name={name} render={({ field, fieldState }) => <CustomInputText {...field}
      label={content.fields[name]} error={name === "slug" && slugStatus === "used" ? content.slugUsed : name === "slug" && slugStatus === "error" ? content.slugCheckError : name === "email" && emailStatus === "used" ? content.emailUsed : name === "email" && emailStatus === "error" ? content.emailCheckError : fieldState.error ? content.invalid : undefined} reserveMessageSpace
      type={name === "password" ? "password" : name === "email" ? "email" : name === "phone" ? "tel" : "text"}
      autoComplete={name === "password" ? "new-password" : "off"}
      helpText={name === "email" ? emailStatus === "checking" ? content.emailChecking : emailStatus === "available" ? content.emailAvailable : undefined : name === "password" ? content.passwordHelp : name === "slug" ? slugStatus === "checking" ? content.slugChecking : slugStatus === "available" ? content.slugAvailable : content.slugHelp : undefined}
    />} />)}</div>
  </section>)}</>;
}
