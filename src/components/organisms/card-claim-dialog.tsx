import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Messages } from "../../i18n";
import { useI18n } from "../../i18n";
import { claimUserCard } from "../../server/cards/card-entry.functions";
import {
  claimCardSchema,
  newClaimOutletSchema,
} from "../../server/cards/card-entry.schemas";
import { updateOutletCardLinksSchema, type CardLinksEditValues } from "../../server/outlets/outlet.schemas";
import { uploadOutletLogo } from "../../server/uploads/image-upload.functions";
import { toOutletSlug } from "../../lib/validation/outlet-slug";
import { extractCardIdFromQr } from "../../lib/card-id";
import { copySocialLinks } from "../../lib/outlet-link-copy";
import { ImageUploadField } from "../molecules/image-upload-field";
import { OutletLinksEditor } from "../molecules/outlet-links-editor";
import { UserCardCopyPicker } from "../molecules/user-card-copy-picker";
import { CardQrScanner } from "../elements/card-qr-scanner";
import { CustomInputText } from "../elements/custom-input-text";
import { OutletSlugInput } from "../elements/outlet-slug-input";
import { Form } from "../ui/form";
import { Dialog, DialogBody, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { useToast } from "../ui/toaster";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type OutletOption = { id: string; name: string };

export function CardClaimDialog({ cardId, messages, onSaved, outlets, onClose, initialOutletId, initialMode }: {
  cardId?: string; messages: Messages; onSaved: () => Promise<void>; outlets: OutletOption[];
  onClose: () => void; initialOutletId?: string; initialMode?: "new" | "existing";
}) {
  const content = messages.cardClaim;
  const { language } = useI18n();
  const [card, setCard] = useState(cardId ?? "");
  const [step, setStep] = useState<1 | 2>(1);
  const [outletMode, setOutletMode] = useState<"new" | "existing">(
    initialMode ?? (outlets.length ? "existing" : "new"),
  );
  const [selectedOutletId, setSelectedOutletId] = useState(initialOutletId ?? outlets[0]?.id ?? "");
  const [outlet, setOutlet] = useState({ outletName: "", slug: "", address: "" });
  const hasManualSlug = useRef(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const onboarding = messages.adminDashboard.activation.onboarding;
  const [error, setError] = useState("");
  const { showToast } = useToast();
  const form = useForm<CardLinksEditValues>({
    resolver: zodResolver(updateOutletCardLinksSchema),
    defaultValues: {
      outletId: "new",
      cardId: "new",
      links: [
        {
          id: "google-review",
          type: "google_review",
          label: messages.adminDashboard.activation.channels.google_review.title,
          value: "",
          isActive: true,
        },
      ],
    },
  });
  const busy = form.formState.isSubmitting || uploadingLogo;
  function nextStep() {
    setError("");
    setInvalidFields([]);
    if (outletMode === "existing") {
      if (!selectedOutletId) {
        setError(content.outletRequired);
        return;
      }
      setStep(2);
      return;
    }
    const parsed = newClaimOutletSchema.safeParse({ ...outlet, logoUrl });
    if (!parsed.success) {
      setInvalidFields(parsed.error.issues.map((issue) => String(issue.path[0])));
      setError(content.outletInvalid);
      return;
    }
    setStep(2);
  }
  async function save(values: CardLinksEditValues) {
    if (uploadingLogo) return;
    setError("");
    setInvalidFields([]);
    const payload = outletMode === "existing"
      ? { outletMode, outletId: selectedOutletId, cardId: card, links: values.links }
      : { outletMode, cardId: card, ...outlet, logoUrl, links: values.links };
    const parsed = claimCardSchema.safeParse(payload);
    if (!parsed.success) {
      setInvalidFields(parsed.error.issues.map((issue) => String(issue.path[0])));
      setError(content.invalid);
      return;
    }
    try {
      await claimUserCard({ data: parsed.data });
      showToast(content.success, "success");
      await onSaved();
    } catch (caught) {
      const message = caught instanceof Error && caught.message.includes("SLUG_ALREADY_USED") ? content.slugError : content.error;
      setError(message); showToast(message, "error");
    }
  }
  return <Dialog title={content.title} description={content.description} closeLabel={content.cancel} onClose={onClose} busy={busy} dismissOnOutsidePress={false}>
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit(save)} className="flex min-h-0 flex-1 flex-col" aria-busy={busy}>
        <DialogBody>
          <StepIndicator content={content} step={step} />
          <fieldset disabled={busy} className="grid gap-5 border-0 p-0">
            {step === 1 ? <OutletStep
              content={content} onboarding={onboarding} outlets={outlets} outlet={outlet}
              outletMode={outletMode} selectedOutletId={selectedOutletId} logoUrl={logoUrl}
              invalidFields={invalidFields} onModeChange={setOutletMode}
              onOutletSelect={setSelectedOutletId} onLogoChange={setLogoUrl}
              onUploadBusyChange={setUploadingLogo}
              onOutletChange={(name, value) => {
                setOutlet((current) => ({ ...current, [name]: value, ...(name === "outletName" && !hasManualSlug.current ? { slug: toOutletSlug(value) } : {}) }));
                setInvalidFields((current) => current.filter((field) => field !== name));
              }}
              onSlugChange={(value) => { hasManualSlug.current = true; setOutlet((current) => ({ ...current, slug: value })); }}
            /> : <>
              <p className="text-sm leading-6 text-[#69737d]">{content.linksDescription}</p>
              <CustomInputText label={content.card} value={card} readOnly={Boolean(cardId)} error={invalidFields.includes("cardId") ? content.invalid : undefined} onChange={(event) => setCard(event.target.value)} />
              {!cardId && <CardQrScanner content={content.scanner} onScan={(value) => {
                const scannedCardId = extractCardIdFromQr(value);
                if (!scannedCardId) return false;
                setCard(scannedCardId);
                setInvalidFields((current) => current.filter((field) => field !== "cardId"));
                return true;
              }} />}
              <OutletLinksEditor form={form} content={messages.adminDashboard.outlets} activation={messages.adminDashboard.activation} googleReviewInput="placeId" placeIdGuide={<p className="text-xs leading-5 text-[#69737d]">{content.placeIdGuide.quick} <a href="https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder" target="_blank" rel="noreferrer" className="font-semibold text-[#087e91] underline">{content.placeIdGuide.googleDocs}</a>. <a href={`/${language}/tutorial/google-place-id`} target="_blank" rel="noreferrer" className="font-semibold text-[#087e91] underline">{content.placeIdGuide.tutorial}</a>.</p>} />
              <UserCardCopyPicker outlets={outlets} content={content.copy} channels={messages.adminDashboard.activation.channels} disabled={busy} onCopy={(links) => {
                const current = form.getValues("links");
                const copied = copySocialLinks(links);
                if (current.length + copied.length > 20) {
                  showToast(content.copy.tooMany, "warning");
                  return;
                }
                form.setValue("links", [...current, ...copied], { shouldDirty: true, shouldValidate: true });
                showToast(content.copy.copied, "success");
              }} />
            </>}
            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          </fieldset>
        </DialogBody>
        <DialogFooter>
          {step === 2 && <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={busy}>{content.back}</Button>}
          {step === 1 ? <Button type="button" onClick={nextStep} disabled={busy}>{content.next}</Button> : <Button type="submit" disabled={busy}>{busy ? content.saving : content.save}</Button>}
        </DialogFooter>
      </form>
    </Form>
  </Dialog>;
}

function StepIndicator({ content, step }: { content: Messages["cardClaim"]; step: 1 | 2 }) {
  const steps = [content.steps.outlet, content.steps.links];
  return <div className="mb-6 grid gap-3 sm:grid-cols-[auto_1fr_auto] sm:items-center">
    {steps.map((label, index) => {
      const number = index + 1;
      const active = step === number;
      const complete = step > number;
      return <div key={label} className="contents">
        <div className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold ${active ? "bg-[#172029] text-white" : complete ? "bg-[#e8f8fb] text-[#087e91]" : "bg-[#f1f3f5] text-[#69737d]"}`}>
          <span className="grid size-5 place-items-center rounded-full bg-current/15 text-xs">{number}</span>
          <span>{label}</span>
        </div>
        {number === 1 && <div className="hidden h-px bg-black/10 sm:block" />}
      </div>;
    })}
    <p className="text-xs font-semibold text-[#69737d] sm:col-span-3">{content.step.replace("{current}", String(step))}</p>
  </div>;
}

function OutletStep({
  content,
  onboarding,
  outlets,
  outlet,
  outletMode,
  selectedOutletId,
  logoUrl,
  invalidFields,
  onModeChange,
  onOutletSelect,
  onLogoChange,
  onUploadBusyChange,
  onOutletChange,
  onSlugChange,
}: {
  content: Messages["cardClaim"];
  onboarding: Messages["adminDashboard"]["activation"]["onboarding"];
  outlets: OutletOption[];
  outlet: { outletName: string; slug: string; address: string };
  outletMode: "new" | "existing";
  selectedOutletId: string;
  logoUrl: string | null;
  invalidFields: string[];
  onModeChange: (mode: "new" | "existing") => void;
  onOutletSelect: (id: string) => void;
  onLogoChange: (value: string | null) => void;
  onUploadBusyChange: (busy: boolean) => void;
  onOutletChange: (name: "outletName" | "address", value: string) => void;
  onSlugChange: (value: string) => void;
}) {
  return <>
    <p className="text-sm leading-6 text-[#69737d]">{content.outletDescription}</p>
    <div className="grid gap-3 sm:grid-cols-2">
      <button type="button" aria-pressed={outletMode === "new"} onClick={() => onModeChange("new")} className={`rounded-2xl border p-4 text-left transition ${outletMode === "new" ? "border-[#0798ad] bg-[#e8f8fb] ring-2 ring-[#0798ad]/15" : "border-black/10 bg-white"}`}>
        <p className="font-bold">{content.newOutlet}</p>
        <p className="mt-1 text-sm text-[#69737d]">{onboarding.outletTitle}</p>
      </button>
      {outlets.length > 0 && <button type="button" aria-pressed={outletMode === "existing"} onClick={() => onModeChange("existing")} className={`rounded-2xl border p-4 text-left transition ${outletMode === "existing" ? "border-[#0798ad] bg-[#e8f8fb] ring-2 ring-[#0798ad]/15" : "border-black/10 bg-white"}`}>
        <p className="font-bold">{content.existingOutlet}</p>
        <p className="mt-1 text-sm text-[#69737d]">{content.outlets}</p>
      </button>}
    </div>
    {outletMode === "existing" ? <div className="grid gap-2">
      <label className="text-sm font-semibold" id="claim-outlet">{content.selectOutlet}</label>
      <Select items={Object.fromEntries(outlets.map((item) => [item.id, item.name]))} value={selectedOutletId} onValueChange={(value) => value && onOutletSelect(value)}>
        <SelectTrigger className="w-full" aria-labelledby="claim-outlet"><SelectValue /></SelectTrigger>
        <SelectContent>{outlets.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent>
      </Select>
      {invalidFields.includes("outletId") && <p className="text-sm text-red-600">{content.outletRequired}</p>}
    </div> : <>
      {outlets.length === 0 && <p className="rounded-xl border border-[#bce8ef] bg-[#e8f8fb] p-3 text-sm text-[#087e91]">{content.noOutlets}</p>}
      <ImageUploadField value={logoUrl} onChange={onLogoChange} onBusyChange={onUploadBusyChange} content={onboarding.logo} uploadImage={uploadOutletLogo} />
      <div className="grid items-start gap-4 sm:grid-cols-2">
        <CustomInputText label={onboarding.fields.outletName} value={outlet.outletName} error={invalidFields.includes("outletName") ? content.outletInvalid : undefined} onChange={(event) => onOutletChange("outletName", event.target.value)} />
        <OutletSlugInput label={onboarding.fields.slug} value={outlet.slug} helpText={content.help} error={invalidFields.includes("slug") ? content.outletInvalid : undefined} onChange={(event) => onSlugChange(event.target.value)} />
        <div className="sm:col-span-2"><CustomInputText label={onboarding.fields.address} value={outlet.address} error={invalidFields.includes("address") ? content.outletInvalid : undefined} onChange={(event) => onOutletChange("address", event.target.value)} /></div>
      </div>
    </>}
  </>;
}
