import { useFieldArray, type UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { Messages } from "../../i18n";
import type { CardLinksEditValues } from "../../server/outlets/outlet.schemas";
import { CustomInputText } from "../elements/custom-input-text";
import { ActivationGoogleSearch } from "./activation-google-search";
import { Button } from "../ui/button";
import { AlertDialog } from "../ui/alert-dialog";
import { FormField } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function OutletLinksEditor({
  form,
  content,
  activation,
}: {
  form: UseFormReturn<CardLinksEditValues>;
  content: Messages["adminDashboard"]["outlets"];
  activation: Messages["adminDashboard"]["activation"];
}) {
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "links",
    keyName: "fieldKey",
  });
  const busy = form.formState.isSubmitting;
  const [pendingRemoval, setPendingRemoval] = useState<string | null>(null);
  const channelLabels: Record<string, string> = {
    ...Object.fromEntries(
      Object.entries(activation.channels).map(([key, channel]) => [
        key,
        channel.title,
      ]),
    ),
    facebook: "Facebook",
  };
  return (
    <section className="rounded-2xl border border-black/8 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-bold">{content.links}</h2>
        <Button
          type="button"
          variant="outline"
          className="h-10"
          disabled={busy || fields.length >= 20}
          onClick={() =>
            append({
              id: crypto.randomUUID(),
              type: "custom",
              label: "",
              value: "",
              isActive: true,
            })
          }
        >
          <Plus />
          {content.add}
        </Button>
      </div>
      <div className="mt-5 grid gap-4">
        {fields.map((link, index) => {
          const type = form.watch(`links.${index}.type`);
          const destination =
            activation.destinations[type === "facebook" ? "custom" : type];
          return (
            <article
              key={link.fieldKey}
              className="rounded-2xl border border-black/8 bg-[#f8fafc] p-4"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="text-sm font-bold">
                  {index + 1}. {channelLabels[type]}
                </span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    aria-label={content.moveUp}
                    disabled={busy || index === 0}
                    onClick={() => move(index, index - 1)}
                  >
                    <ArrowUp />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    aria-label={content.moveDown}
                    disabled={busy || index === fields.length - 1}
                    onClick={() => move(index, index + 1)}
                  >
                    <ArrowDown />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    aria-label={content.remove}
                    disabled={busy}
                    onClick={() => setPendingRemoval(link.fieldKey)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
              <div className="grid items-start gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name={`links.${index}.type`}
                  render={({ field }) => (
                    <div className="grid gap-2">
                      <label
                        id={`channel-${link.fieldKey}`}
                        className="text-sm font-semibold"
                      >
                        {activation.onboarding.channelLabel}
                      </label>
                      <Select
                        items={channelLabels}
                        value={field.value}
                        disabled={busy}
                        onValueChange={(value) => {
                          if (value) {
                            field.onChange(value);
                            form.setValue(`links.${index}.value`, "", {
                              shouldDirty: true,
                            });
                          }
                        }}
                      >
                        <SelectTrigger
                          className="w-full"
                          aria-labelledby={`channel-${link.fieldKey}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(channelLabels).map(
                            ([value, label]) => (
                              <SelectItem value={value} key={value}>
                                {label}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`links.${index}.isActive`}
                  render={({ field }) => (
                    <div className="grid gap-2">
                      <label
                        id={`status-${link.fieldKey}`}
                        className="text-sm font-semibold"
                      >
                        {content.linkStatus}
                      </label>
                      <Select
                        items={{
                          active: content.active,
                          disabled: content.disabled,
                        }}
                        value={field.value ? "active" : "disabled"}
                        disabled={busy}
                        onValueChange={(value) =>
                          field.onChange(value === "active")
                        }
                      >
                        <SelectTrigger
                          className="w-full"
                          aria-labelledby={`status-${link.fieldKey}`}
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
                <FormField
                  control={form.control}
                  name={`links.${index}.label`}
                  render={({ field, fieldState }) => (
                    <CustomInputText
                      {...field}
                      label={activation.onboarding.linkLabel}
                      reserveMessageSpace
                      error={fieldState.error ? content.invalid : undefined}
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name={`links.${index}.value`}
                  render={({ field, fieldState }) =>
                    type === "google_review" ? (
                      <ActivationGoogleSearch
                        inputId={`outlet-google-${link.fieldKey}`}
                        content={activation}
                        value={field.value}
                        onSelect={field.onChange}
                        error={
                          fieldState.error
                            ? activation.onboarding.selectBusiness
                            : undefined
                        }
                      />
                    ) : (
                      <CustomInputText
                        {...field}
                        label={destination.label}
                        placeholder={destination.placeholder}
                        inputMode={type === "whatsapp" ? "tel" : "url"}
                        helpText={destination.helpText}
                        reserveMessageSpace
                        error={fieldState.error ? content.invalid : undefined}
                      />
                    )
                  }
                />
              </div>
            </article>
          );
        })}
      </div>
      {(form.formState.errors.links?.root || fields.length === 0) && (
        <p className="mt-3 text-sm text-red-600">
          {activation.onboarding.requiredLink}
        </p>
      )}
      <AlertDialog
        open={Boolean(pendingRemoval)}
        title={content.remove}
        description={content.removeConfirm}
        cancelLabel={content.cancel}
        confirmLabel={content.remove}
        onOpenChange={(open) => {
          if (!open) setPendingRemoval(null);
        }}
        onConfirm={() => {
          const index = fields.findIndex(
            (link) => link.fieldKey === pendingRemoval,
          );
          if (index >= 0 && !busy) remove(index);
          setPendingRemoval(null);
        }}
      />
    </section>
  );
}
