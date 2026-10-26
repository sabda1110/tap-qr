import { ExternalLink, Plus, X } from "lucide-react";
import { useFieldArray, type UseFormReturn } from "react-hook-form";

import type { Messages } from "../../i18n";
import type { CardLinksEditValues } from "../../server/outlets/outlet.schemas";
import { CustomInputText } from "../elements/custom-input-text";
import { SocialBrandMark } from "../elements/social-brand-mark";
import { WhatsAppNumberInput } from "../elements/whatsapp-number-input";
import { Button } from "../ui/button";
import { FormField } from "../ui/form";

const placeIdFinderUrl =
  "https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder";

export function CardClaimLinkDetails({
  form,
  content,
  activation,
}: {
  form: UseFormReturn<CardLinksEditValues>;
  content: Messages["cardClaim"];
  activation: Messages["adminDashboard"]["activation"];
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "links",
    keyName: "fieldKey",
  });

  return (
    <section>
      <div className="max-w-2xl">
        <h2 className="text-lg font-bold tracking-tight text-[#171b22] sm:text-xl">
          {content.detailsTitle}
        </h2>
        <p className="mt-1 text-sm leading-5 text-slate-500">
          {content.detailsDescription}
        </p>
      </div>
      <h3 className="sr-only">{content.yourSelections}</h3>
      <div className="mt-5 grid gap-2.5">
        {fields.map((link, index) => {
          const type = form.watch(`links.${index}.type`);
          const channelType = type === "facebook" ? "custom" : type;
          const destination = activation.destinations[channelType];
          const title =
            channelType === "custom"
              ? content.additionalLink
              : activation.channels[channelType].title;
          return (
            <article
              key={link.fieldKey}
              className="rounded-2xl border border-slate-200 bg-white p-3"
            >
              <div className="mb-3 flex items-center gap-2.5">
                <SocialBrandMark type={type === "facebook" ? "custom" : type} />
                <p className="min-w-0 flex-1 truncate text-sm font-extrabold text-slate-950">
                  {title}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 shrink-0 rounded-full text-slate-500"
                  aria-label={activation.onboarding.removeLink}
                  onClick={() => remove(index)}
                >
                  <X className="size-4" />
                </Button>
              </div>
              <div
                className={
                  type === "whatsapp" || channelType === "custom"
                    ? "grid min-w-0 gap-3 sm:grid-cols-2"
                    : "grid min-w-0 gap-3"
                }
              >
                {channelType === "custom" && (
                  <FormField
                    control={form.control}
                    name={`links.${index}.label`}
                    render={({ field, fieldState }) => (
                      <CustomInputText
                        {...field}
                        label={content.additionalLink}
                        error={fieldState.error ? content.invalid : undefined}
                      />
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name={`links.${index}.value`}
                  render={({ field, fieldState }) => {
                    if (type === "google_review")
                      return (
                        <div className="grid gap-1.5">
                          <CustomInputText
                            {...field}
                            id={`claim-google-${link.fieldKey}`}
                            label={content.googlePlaceId}
                            placeholder={content.googlePlaceIdPlaceholder}
                            autoComplete="off"
                            error={
                              fieldState.error ? content.invalid : undefined
                            }
                          />
                          <p className="text-xs leading-5 text-slate-500">
                            {content.placeIdGuide.quick}{" "}
                            <a
                              href={placeIdFinderUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 font-bold text-[#087e91] underline underline-offset-2"
                            >
                              {content.placeIdGuide.googleDocs}
                              <ExternalLink
                                aria-hidden="true"
                                className="size-3"
                              />
                            </a>
                          </p>
                        </div>
                      );
                    if (type === "whatsapp")
                      return (
                        <WhatsAppNumberInput
                          {...field}
                          label={destination.label}
                          placeholder={destination.placeholder}
                          error={fieldState.error ? content.invalid : undefined}
                        />
                      );
                    if (type === "instagram" || type === "tiktok")
                      return (
                        <CustomInputText
                          {...field}
                          label={
                            type === "instagram"
                              ? content.instagramUsername
                              : content.tiktokUsername
                          }
                          placeholder={content.usernamePlaceholder}
                          prefix="@"
                          autoCapitalize="none"
                          autoComplete="off"
                          spellCheck={false}
                          maxLength={30}
                          error={fieldState.error ? content.invalid : undefined}
                          onChange={(event) =>
                            field.onChange(
                              event.target.value.replace(/^@+/, ""),
                            )
                          }
                        />
                      );
                    return (
                      <CustomInputText
                        {...field}
                        label={destination.label}
                        placeholder={destination.placeholder}
                        inputMode="url"
                        error={fieldState.error ? content.invalid : undefined}
                      />
                    );
                  }}
                />
                {type === "whatsapp" && (
                  <FormField
                    control={form.control}
                    name={`links.${index}.message`}
                    render={({ field, fieldState }) => {
                      const inputId = `claim-whatsapp-message-${link.fieldKey}`;
                      return (
                        <div className="grid min-w-0 gap-2">
                          <label
                            htmlFor={inputId}
                            className="text-sm font-semibold text-[#252a32]"
                          >
                            {content.whatsappMessage}
                          </label>
                          <textarea
                            {...field}
                            id={inputId}
                            value={field.value ?? ""}
                            rows={2}
                            maxLength={500}
                            placeholder={content.whatsappMessagePlaceholder}
                            aria-invalid={Boolean(fieldState.error)}
                            aria-describedby={`${inputId}-help`}
                            className="min-h-12 w-full resize-y rounded-xl border border-black/10 bg-[#f8fafc] px-4 py-3 text-base text-[#252a32] outline-none transition placeholder:text-black/35 focus:border-[#0798ad] focus:bg-white focus:ring-4 focus:ring-[#0798ad]/10 aria-invalid:border-red-500 md:text-sm"
                          />
                          <p
                            id={`${inputId}-help`}
                            className="text-xs leading-5 text-slate-500"
                          >
                            {fieldState.error
                              ? content.invalid
                              : content.whatsappMessageHelp}
                          </p>
                        </div>
                      );
                    }}
                  />
                )}
              </div>
            </article>
          );
        })}
      </div>
      <Button
        type="button"
        variant="outline"
        disabled={fields.length >= 20}
        onClick={() =>
          append({
            id: crypto.randomUUID(),
            type: "custom",
            label: content.additionalLink,
            value: "",
            isActive: true,
          })
        }
        className="mt-3 w-full rounded-xl border-dashed border-[#087e91] text-[#087e91] sm:w-auto"
      >
        <Plus className="size-4" />
        {content.addAdditionalLink}
      </Button>
    </section>
  );
}
