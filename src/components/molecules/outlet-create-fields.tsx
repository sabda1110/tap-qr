import { useRef } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { Messages } from "../../i18n";
import type { AvailabilityStatus } from "../../hooks/use-debounced-availability";
import type { CreateOutletFields } from "../../server/outlets/outlet-create.schemas";
import { toOutletSlug } from "../../lib/validation/outlet-slug";
import { CustomInputText } from "../elements/custom-input-text";
import { OutletSlugInput } from "../elements/outlet-slug-input";
import { WhatsAppNumberInput } from "../elements/whatsapp-number-input";
import { ImageUploadField } from "./image-upload-field";
import { FormField } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function OutletCreateFields({
  form,
  activation,
  content,
  createContent,
  slugStatus,
  disabled,
  onUploadBusy,
}: {
  form: UseFormReturn<CreateOutletFields>;
  activation: Messages["adminDashboard"]["activation"];
  content: Messages["adminDashboard"]["outlets"];
  createContent: Messages["adminDashboard"]["outletCreate"];
  slugStatus: AvailabilityStatus;
  disabled: boolean;
  onUploadBusy: (busy: boolean) => void;
}) {
  const hasManualSlug = useRef(false);
  const fields = [
    "outletName",
    "slug",
    "phone",
    "address",
  ] as const;
  return (
    <>
      <section className="rounded-2xl border border-black/8 bg-white p-5">
        <h2 className="mb-5 font-bold">{content.information}</h2>
        <FormField
          control={form.control}
          name="logoUrl"
          render={({ field }) => (
            <ImageUploadField
              value={field.value}
              onChange={field.onChange}
              onBusyChange={onUploadBusy}
              content={activation.onboarding.logo}
              disabled={disabled}
            />
          )}
        />
        <div className="grid items-start gap-x-5 gap-y-2 sm:grid-cols-2">
          {fields.map((name) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field, fieldState }) =>
                name === "phone" ? (
                <WhatsAppNumberInput
                  {...field}
                  label={activation.onboarding.fields[name]}
                  reserveMessageSpace
                  error={fieldState.error ? content.invalid : undefined}
                />
                ) : name === "slug" ? (
                <OutletSlugInput
                  {...field}
                  label={activation.onboarding.fields[name]}
                  reserveMessageSpace
                  error={
                    slugStatus === "used"
                      ? content.slugUsed
                      : slugStatus === "error"
                        ? activation.onboarding.slugCheckError
                        : fieldState.error
                          ? content.invalid
                          : undefined
                  }
                  helpText={
                    slugStatus === "checking"
                      ? activation.onboarding.slugChecking
                      : slugStatus === "available"
                        ? activation.onboarding.slugAvailable
                        : activation.onboarding.slugHelp
                  }
                  onChange={(event) => {
                    hasManualSlug.current = true;
                    field.onChange(event);
                  }}
                />
                ) : (
                <CustomInputText
                  {...field}
                  label={activation.onboarding.fields[name]}
                  reserveMessageSpace
                  error={
                    fieldState.error
                      ? fieldState.error.message === content.slugUsed
                        ? content.slugUsed
                        : content.invalid
                      : undefined
                  }
                  onChange={
                    name === "outletName"
                      ? (event) => {
                          field.onChange(event);
                          if (!hasManualSlug.current)
                            form.setValue("slug", toOutletSlug(event.currentTarget.value), {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                        }
                      : field.onChange
                  }
                />
                )
              }
            />
          ))}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <div className="grid gap-2">
                <label id="create-status" className="text-sm font-semibold">
                  {content.status}
                </label>
                <Select
                  value={field.value}
                  items={{ active: content.active, disabled: content.disabled }}
                  disabled={disabled}
                  onValueChange={(value) => value && field.onChange(value)}
                >
                  <SelectTrigger
                    className="w-full"
                    aria-labelledby="create-status"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{content.active}</SelectItem>
                    <SelectItem value="disabled">{content.disabled}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />
        </div>
      </section>
      <section className="rounded-2xl border border-black/8 bg-white p-5">
        <h2 className="mb-4 font-bold">{createContent.cardTitle}</h2>
        <FormField
          control={form.control}
          name="cardId"
          render={({ field, fieldState }) => (
            <CustomInputText
              {...field}
              label={activation.cardIdLabel}
              helpText={createContent.cardHelp}
              reserveMessageSpace
              error={
                fieldState.error
                  ? fieldState.error.message === createContent.cardUsed ||
                    fieldState.error.message === createContent.cardMissing
                    ? fieldState.error.message
                    : content.invalid
                  : undefined
              }
            />
          )}
        />
      </section>
    </>
  );
}
