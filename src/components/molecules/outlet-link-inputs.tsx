import type { ReactNode } from "react";
import type { UseFormReturn } from "react-hook-form";
import { ExternalLink } from "lucide-react";

import type { Messages } from "../../i18n";
import type { CardLinksEditValues } from "../../server/outlets/outlet.schemas";
import { CustomInputText } from "../elements/custom-input-text";
import { WhatsAppNumberInput } from "../elements/whatsapp-number-input";
import { ActivationGoogleSearch } from "./activation-google-search";
import { FormField } from "../ui/form";

type Props = {
  index: number;
  fieldKey: string;
  type: CardLinksEditValues["links"][number]["type"];
  form: UseFormReturn<CardLinksEditValues>;
  content: Messages["adminDashboard"]["outlets"];
  activation: Messages["adminDashboard"]["activation"];
  claim: Messages["cardClaim"];
  channelLabels: Record<string, string>;
  googleReviewInput: "search" | "placeId";
  placeIdGuide?: ReactNode;
};

export function OutletLinkInputs({
  index,
  fieldKey,
  type,
  form,
  content,
  activation,
  claim,
  channelLabels,
  googleReviewInput,
  placeIdGuide,
}: Props) {
  const channelType = type === "facebook" ? "custom" : type;
  const destination = activation.destinations[channelType];

  return (
    <div className="grid min-w-0 gap-3 sm:grid-cols-2">
      <FormField
        control={form.control}
        name={`links.${index}.value`}
        render={({ field, fieldState }) => {
          if (type === "google_review" && googleReviewInput === "search") {
            return (
              <ActivationGoogleSearch
                inputId={`outlet-google-${fieldKey}`}
                content={activation}
                value={field.value}
                onSelect={field.onChange}
                error={
                  fieldState.error
                    ? activation.onboarding.selectBusiness
                    : undefined
                }
              />
            );
          }
          if (type === "google_review") {
            return (
              <div className="grid gap-1.5">
                <CustomInputText
                  {...field}
                  id={`outlet-google-${fieldKey}`}
                  label={claim.googlePlaceId}
                  placeholder={claim.googlePlaceIdPlaceholder}
                  autoComplete="off"
                  reserveMessageSpace
                  error={fieldState.error ? content.invalid : undefined}
                />
                {placeIdGuide ?? (
                  <p className="text-xs leading-5 text-slate-500">
                    {claim.placeIdGuide.quick}{" "}
                    <a
                      href="https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-[#087e91] underline underline-offset-2"
                    >
                      {claim.placeIdGuide.googleDocs}
                      <ExternalLink aria-hidden="true" className="size-3" />
                    </a>
                  </p>
                )}
              </div>
            );
          }
          if (type === "whatsapp") {
            return (
              <WhatsAppNumberInput
                {...field}
                label={destination.label}
                placeholder={destination.placeholder}
                helpText={destination.helpText}
                reserveMessageSpace
                error={fieldState.error ? content.invalid : undefined}
              />
            );
          }
          if (type === "instagram" || type === "tiktok") {
            return (
              <CustomInputText
                {...field}
                label={
                  type === "instagram"
                    ? claim.instagramUsername
                    : claim.tiktokUsername
                }
                placeholder={claim.usernamePlaceholder}
                prefix="@"
                autoCapitalize="none"
                autoComplete="off"
                spellCheck={false}
                maxLength={30}
                reserveMessageSpace
                error={fieldState.error ? content.invalid : undefined}
                onChange={(event) =>
                  field.onChange(event.target.value.replace(/^@+/, ""))
                }
              />
            );
          }
          return (
            <CustomInputText
              {...field}
              label={destination.label}
              placeholder={destination.placeholder}
              inputMode="url"
              helpText={destination.helpText}
              reserveMessageSpace
              error={fieldState.error ? content.invalid : undefined}
            />
          );
        }}
      />

      <FormField
        control={form.control}
        name={`links.${index}.label`}
        render={({ field, fieldState }) => (
          <CustomInputText
            {...field}
            label={
              channelType === "custom"
                ? claim.additionalLink
                : activation.onboarding.linkLabel
            }
            placeholder={channelLabels[type]}
            reserveMessageSpace
            error={fieldState.error ? content.invalid : undefined}
          />
        )}
      />

      {type === "whatsapp" && (
        <FormField
          control={form.control}
          name={`links.${index}.message`}
          render={({ field, fieldState }) => {
            const inputId = `outlet-whatsapp-msg-${fieldKey}`;
            return (
              <div className="col-span-full grid min-w-0 gap-2">
                <label
                  htmlFor={inputId}
                  className="text-sm font-semibold text-[#252a32]"
                >
                  {claim.whatsappMessage}
                </label>
                <textarea
                  {...field}
                  id={inputId}
                  value={field.value ?? ""}
                  rows={2}
                  maxLength={500}
                  placeholder={claim.whatsappMessagePlaceholder}
                  aria-invalid={Boolean(fieldState.error)}
                  aria-describedby={`${inputId}-help`}
                  className="min-h-12 w-full resize-y rounded-xl border border-black/10 bg-[#f8fafc] px-4 py-3 text-base text-[#252a32] outline-none transition placeholder:text-black/35 focus:border-[#0798ad] focus:bg-white focus:ring-4 focus:ring-[#0798ad]/10 aria-invalid:border-red-500 md:text-sm"
                />
                <p
                  id={`${inputId}-help`}
                  className="text-xs leading-5 text-slate-500"
                >
                  {fieldState.error ? content.invalid : claim.whatsappMessageHelp}
                </p>
              </div>
            );
          }}
        />
      )}
    </div>
  );
}
