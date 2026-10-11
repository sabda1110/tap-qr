import { ChevronRight, CreditCard } from "lucide-react";

import type { Messages } from "../../i18n";
import { useI18n } from "../../i18n";
import { extractCardIdFromQr } from "../../lib/card-id";
import { copySocialLinks } from "../../lib/outlet-link-copy";
import { toOutletSlug } from "../../lib/validation/outlet-slug";
import { useCardClaim } from "../../hooks/use-card-claim";
import { CardClaimMascot } from "../molecules/card-claim-mascot";
import { CardQrScanner } from "../elements/card-qr-scanner";
import { CustomInputText } from "../elements/custom-input-text";
import {
  CardClaimOutletStep,
  type OutletOption,
} from "../molecules/card-claim-outlet-step";
import { CardClaimStepIndicator } from "../molecules/card-claim-step-indicator";
import { OutletLinksEditor } from "../molecules/outlet-links-editor";
import { UserCardCopyPicker } from "../molecules/user-card-copy-picker";
import { Button } from "../ui/button";
import { Dialog, DialogBody, DialogFooter } from "../ui/dialog";
import { Form } from "../ui/form";
import { useToast } from "../ui/toaster";

export function CardClaimDialog({
  cardId,
  messages,
  onSaved,
  outlets,
  onClose,
  initialOutletId,
  initialMode,
}: {
  cardId?: string;
  messages: Messages;
  onSaved: () => Promise<void>;
  outlets: OutletOption[];
  onClose: () => void;
  initialOutletId?: string;
  initialMode?: "new" | "existing";
}) {
  const content = messages.cardClaim;
  const { language } = useI18n();
  const onboarding = messages.adminDashboard.activation.onboarding;
  const { showToast } = useToast();

  const {
    card,
    setCard,
    step,
    setStep,
    outletMode,
    setOutletMode,
    selectedOutletId,
    setSelectedOutletId,
    outlet,
    setOutlet,
    hasManualSlug,
    logoUrl,
    setLogoUrl,
    setUploadingLogo,
    invalidFields,
    setInvalidFields,
    error,
    form,
    busy,
    nextStep,
    save,
  } = useCardClaim({
    cardId,
    initialOutletId,
    initialMode,
    outlets,
    content,
    googleReviewTitle: messages.adminDashboard.activation.channels.google_review.title,
    onSaved,
  });

  const titleNode = (
    <span>
      {content.title.replace("TapQR", "").trim()}{" "}
      <span className="text-[#0798ad]">TapQR</span>
    </span>
  );

  const headerExtra = (
    <CardClaimMascot
      badgeText={language === "id" ? "Mudah & Cepat!" : "Quick & Easy!"}
      subText={language === "id" ? "Siap digunakan ✨" : "Ready to use ✨"}
    />
  );

  return (
    <Dialog
      title={titleNode}
      description={content.description}
      icon={CreditCard}
      headerExtra={headerExtra}
      closeLabel={content.cancel}
      onClose={onClose}
      busy={busy}
      dismissOnOutsidePress={false}
    >
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(save)}
          className="flex min-h-0 flex-1 flex-col"
          aria-busy={busy}
        >
          <DialogBody>
            <CardClaimStepIndicator content={content} step={step} />
            <fieldset disabled={busy} className="grid gap-5 border-0 p-0">
              {step === 1 ? (
                <CardClaimOutletStep
                  content={content}
                  onboarding={onboarding}
                  outlets={outlets}
                  outlet={outlet}
                  outletMode={outletMode}
                  selectedOutletId={selectedOutletId}
                  logoUrl={logoUrl}
                  invalidFields={invalidFields}
                  onModeChange={setOutletMode}
                  onOutletSelect={setSelectedOutletId}
                  onLogoChange={setLogoUrl}
                  onUploadBusyChange={setUploadingLogo}
                  onOutletChange={(name, value) => {
                    setOutlet((current) => ({
                      ...current,
                      [name]: value,
                      ...(name === "outletName" && !hasManualSlug.current
                        ? { slug: toOutletSlug(value) }
                        : {}),
                    }));
                    setInvalidFields((current) => current.filter((field) => field !== name));
                  }}
                  onSlugChange={(value) => {
                    hasManualSlug.current = true;
                    setOutlet((current) => ({ ...current, slug: value }));
                  }}
                />
              ) : (
                <>
                  <p className="text-sm leading-6 text-[#69737d]">
                    {content.linksDescription}
                  </p>
                  <CustomInputText
                    label={content.card}
                    value={card}
                    readOnly={Boolean(cardId)}
                    error={invalidFields.includes("cardId") ? content.invalid : undefined}
                    onChange={(event) => setCard(event.target.value)}
                  />
                  {!cardId && (
                    <CardQrScanner
                      content={content.scanner}
                      onScan={(value) => {
                        const scannedCardId = extractCardIdFromQr(value);
                        if (!scannedCardId) return false;
                        setCard(scannedCardId);
                        setInvalidFields((current) => current.filter((field) => field !== "cardId"));
                        return true;
                      }}
                    />
                  )}
                  <OutletLinksEditor
                    form={form}
                    content={messages.adminDashboard.outlets}
                    activation={messages.adminDashboard.activation}
                    googleReviewInput="placeId"
                    placeIdGuide={
                      <p className="text-xs leading-5 text-[#69737d]">
                        {content.placeIdGuide.quick}{" "}
                        <a
                          href="https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder"
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-[#087e91] underline"
                        >
                          {content.placeIdGuide.googleDocs}
                        </a>
                        .{" "}
                        <a
                          href={`/${language}/tutorial/google-place-id`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-[#087e91] underline"
                        >
                          {content.placeIdGuide.tutorial}
                        </a>
                        .
                      </p>
                    }
                  />
                  <UserCardCopyPicker
                    outlets={outlets}
                    content={content.copy}
                    channels={messages.adminDashboard.activation.channels}
                    disabled={busy}
                    onCopy={(links) => {
                      const current = form.getValues("links");
                      const copied = copySocialLinks(links);
                      if (current.length + copied.length > 20) {
                        showToast(content.copy.tooMany, "warning");
                        return;
                      }
                      form.setValue("links", [...current, ...copied], {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                      showToast(content.copy.copied, "success");
                    }}
                  />
                </>
              )}
              {error && (
                <p role="alert" className="text-sm font-semibold text-red-600">
                  {error}
                </p>
              )}
            </fieldset>
          </DialogBody>
          <DialogFooter className="relative overflow-hidden">
            {/* Subtle decorative confetti corner */}
            <div className="absolute left-4 bottom-3 hidden sm:flex items-center gap-1.5 opacity-60 pointer-events-none select-none">
              <span className="h-2.5 w-0.5 rotate-45 rounded-full bg-[#0798ad]" />
              <span className="h-3 w-0.5 -rotate-12 rounded-full bg-[#087e91]" />
              <span className="h-2 w-0.5 rotate-30 rounded-full bg-sky-400" />
            </div>

            {step === 2 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                disabled={busy}
                className="rounded-xl border-slate-200"
              >
                {content.back}
              </Button>
            )}
            {step === 1 ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={busy}
                className="bg-[#0798ad] hover:bg-[#087e91] text-white font-bold px-6 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>{content.next}</span>
                <ChevronRight className="size-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={busy}
                className="bg-[#0798ad] hover:bg-[#087e91] text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                {busy ? content.saving : content.save}
              </Button>
            )}
          </DialogFooter>
        </form>
      </Form>
    </Dialog>
  );
}
