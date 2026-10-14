import { ChevronLeft, ChevronRight, ContactRound } from "lucide-react";

import type { Messages } from "../../i18n";
import { extractCardIdFromQr } from "../../lib/card-id";
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
import { CardClaimChannelStep } from "../molecules/card-claim-channel-step";
import { CardClaimLinkDetails } from "../molecules/card-claim-link-details";
import { Button } from "../ui/button";
import { Dialog, DialogBody, DialogFooter } from "../ui/dialog";
import { Form } from "../ui/form";

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
  const onboarding = messages.adminDashboard.activation.onboarding;

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
    nextToDetails,
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
      <span className="bg-gradient-to-r from-[#155ee8] to-[#3288f5] bg-clip-text text-transparent">
        TapQR
      </span>
    </span>
  );

  const headerExtra = (
    <CardClaimMascot
      badgeText={content.mascotBadge}
      alt={content.mascotAlt}
    />
  );

  return (
    <Dialog
      title={titleNode}
      description={content.description}
      icon={ContactRound}
      iconClassName="border-blue-100 bg-[#eaf3ff] text-[#155ee8]"
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
          <DialogBody className="bg-white sm:px-7 sm:py-5">
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
              ) : step === 2 ? (
                <CardClaimChannelStep
                  form={form}
                  content={content}
                  channels={messages.adminDashboard.activation.channels}
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
                  <CardClaimLinkDetails
                    form={form}
                    content={content}
                    activation={messages.adminDashboard.activation}
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
          <DialogFooter>
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step === 3 ? 2 : 1)}
                disabled={busy}
                className="rounded-xl border-slate-200 px-5"
              >
                <ChevronLeft className="size-4" />
                {content.back}
              </Button>
            )}
            {step < 3 ? (
              <Button
                type="button"
                onClick={step === 1 ? nextStep : nextToDetails}
                disabled={busy}
                className="cursor-pointer gap-1.5 rounded-xl bg-[#155ee8] px-6 py-2.5 font-bold text-white shadow-md shadow-blue-600/15 transition hover:bg-[#0f4dcc]"
              >
                <span>{content.next}</span>
                <ChevronRight className="size-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={busy}
                className="cursor-pointer rounded-xl bg-[#155ee8] px-6 py-2.5 font-bold text-white shadow-md shadow-blue-600/15 transition hover:bg-[#0f4dcc]"
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
