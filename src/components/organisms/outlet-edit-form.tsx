import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { Messages } from "../../i18n";
import { toOutletSlug } from "../../lib/validation/outlet-slug";
import type { OutletDetail } from "../../server/outlets/outlet.types";
import { updateOutletSchema, type OutletEditValues } from "../../server/outlets/outlet.schemas";
import { checkAdminOutletSlug, updateAdminOutlet } from "../../server/outlets/outlet.functions";
import { useDebouncedAvailability } from "../../hooks/use-debounced-availability";
import { CustomInputText } from "../elements/custom-input-text";
import { OutletSlugInput } from "../elements/outlet-slug-input";
import { WhatsAppNumberInput } from "../elements/whatsapp-number-input";
import { ImageUploadField } from "../molecules/image-upload-field";
import { Button } from "../ui/button";
import { DialogBody, DialogFooter } from "../ui/dialog";
import { Form, FormField } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "../ui/toaster";

type Props = {
  outlet: OutletDetail;
  content: Messages["adminDashboard"]["outlets"];
  activation: Messages["adminDashboard"]["activation"];
  onSaved: () => Promise<void>;
  onCancel: () => void;
  onBusyChange: (busy: boolean) => void;
};

function defaults(outlet: OutletDetail): OutletEditValues {
  return {
    id: outlet.id,
    outletName: outlet.name,
    slug: outlet.slug,
    logoUrl: outlet.logoUrl,
    address: outlet.address,
    phone: outlet.phone,
    status: outlet.status,
  };
}

export function OutletEditForm({
  outlet,
  content,
  activation,
  onSaved,
  onCancel,
  onBusyChange,
}: Props) {
  const { showToast } = useToast();
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const hasManualSlug = useRef(Boolean(outlet.slug));
  const form = useForm<OutletEditValues>({
    defaultValues: defaults(outlet),
    resolver: zodResolver(updateOutletSchema),
    mode: "onBlur",
  });
  const busy = form.formState.isSubmitting || uploadingLogo;
  const slug = form.watch("slug").trim();
  const checkSlug = useCallback(
    (value: string) =>
      checkAdminOutletSlug({ data: { id: outlet.id, slug: value } }),
    [outlet.id],
  );
  const slugStatus = useDebouncedAvailability(
    slug,
    updateOutletSchema.shape.slug.safeParse(slug).success &&
      slug !== outlet.slug,
    checkSlug,
  );
  const fields = [
    "outletName",
    "slug",
    "phone",
    "address",
  ] as const;
  async function save(values: OutletEditValues) {
    if (
      uploadingLogo ||
      slugStatus === "used" ||
      slugStatus === "checking" ||
      slugStatus === "error"
    )
      return;
    onBusyChange(true);
    try {
      await updateAdminOutlet({ data: values });
      showToast(content.success, "success");
      await onSaved();
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (message.includes("SLUG_ALREADY_USED"))
        form.setError("slug", { message: content.slugUsed });
      showToast(
        message.includes("SLUG_ALREADY_USED")
          ? content.slugUsed
          : content.error,
        "error",
      );
    } finally {
      onBusyChange(false);
    }
  }
  return (
    <Form {...form}>
      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={form.handleSubmit(save)}
        noValidate
        aria-busy={busy}
      >
        <DialogBody>
          <fieldset disabled={busy} className="grid gap-5 border-0 p-0">
            <p className="rounded-xl border border-[#bce8ef] bg-[#e8f8fb] p-4 text-sm leading-6 text-[#087e91]">
              {content.syncHelp}
            </p>
            <section className="rounded-2xl border border-black/8 bg-white p-5">
              <h2 className="mb-5 font-bold">{content.information}</h2>
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <ImageUploadField
                    value={field.value}
                    onChange={field.onChange}
                    onBusyChange={(uploading) => {
                      setUploadingLogo(uploading);
                      onBusyChange(uploading);
                    }}
                    content={activation.onboarding.logo}
                    disabled={form.formState.isSubmitting}
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
                                  form.setValue(
                                    "slug",
                                    toOutletSlug(event.currentTarget.value),
                                    { shouldDirty: true, shouldValidate: true },
                                  );
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
                      <label
                        id="outlet-status"
                        className="text-sm font-semibold"
                      >
                        {content.status}
                      </label>
                      <Select
                        items={{
                          active: content.active,
                          disabled: content.disabled,
                        }}
                        value={field.value}
                        disabled={busy}
                        onValueChange={(value) =>
                          value && field.onChange(value)
                        }
                      >
                        <SelectTrigger
                          aria-labelledby="outlet-status"
                          className="w-full"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">
                            {content.active}
                          </SelectItem>
                          <SelectItem value="disabled">
                            {content.disabled}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
              </div>
            </section>
          </fieldset>
        </DialogBody>
        <DialogFooter>
          <Button
            className="h-11 px-5"
            variant="outline"
            type="button"
            onClick={onCancel}
            disabled={busy}
          >
            {content.cancel}
          </Button>
          <Button
            className="h-11 px-5"
            type="submit"
            disabled={
              busy ||
              slugStatus === "checking" ||
              slugStatus === "used" ||
              slugStatus === "error"
            }
          >
            {busy ? content.saving : content.save}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
