import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Messages } from "../../i18n";
import { claimUserCard } from "../../server/cards/card-entry.functions";
import { claimCardSchema } from "../../server/cards/card-entry.schemas";
import { updateOutletCardLinksSchema, type CardLinksEditValues } from "../../server/outlets/outlet.schemas";
import { uploadOutletLogo } from "../../server/uploads/image-upload.functions";
import { ImageUploadField } from "../molecules/image-upload-field";
import { OutletLinksEditor } from "../molecules/outlet-links-editor";
import { CustomInputText } from "../elements/custom-input-text";
import { Form } from "../ui/form";
import { Dialog } from "../ui/dialog";
import { Button } from "../ui/button";
import { useToast } from "../ui/toaster";

export function CardClaimDialog({ cardId, messages, onClose, onSaved }: {
  cardId?: string; messages: Messages; onClose: () => void; onSaved: () => Promise<void>;
}) {
  const content = messages.cardClaim;
  const [card, setCard] = useState(cardId ?? "");
  const [outlet, setOutlet] = useState({ outletName: "", slug: "", address: "", city: "", province: "" });
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const onboarding = messages.adminDashboard.activation.onboarding;
  const [error, setError] = useState("");
  const { showToast } = useToast();
  const form = useForm<CardLinksEditValues>({
    resolver: zodResolver(updateOutletCardLinksSchema),
    defaultValues: { outletId: "new", cardId: "new", links: [] },
  });
  const busy = form.formState.isSubmitting || uploadingLogo;
  async function save(values: CardLinksEditValues) {
    if (uploadingLogo) return;
    setError("");
    setInvalidFields([]);
    const parsed = claimCardSchema.safeParse({ cardId: card, ...outlet, logoUrl, links: values.links });
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
  return <Dialog title={content.title} closeLabel={content.cancel} onClose={onClose} busy={busy}>
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit(save)} className="grid gap-5" aria-busy={busy}>
        <fieldset disabled={busy} className="grid gap-5 border-0 p-0">
          <CustomInputText label={content.card} value={card} readOnly={Boolean(cardId)} onChange={(event) => setCard(event.target.value)} />
          <ImageUploadField value={logoUrl} onChange={setLogoUrl} onBusyChange={setUploadingLogo}
            content={onboarding.logo} disabled={form.formState.isSubmitting} uploadImage={uploadOutletLogo} />
          <div className="grid items-start gap-4 sm:grid-cols-2">
            {(["outletName", "slug", "address", "city", "province"] as const).map((name) => (
              <CustomInputText key={name} label={onboarding.fields[name]} value={outlet[name]}
                helpText={name === "slug" ? content.help : undefined}
                error={invalidFields.includes(name) ? content.invalid : undefined}
                onChange={(event) => {
                  setOutlet((current) => ({ ...current, [name]: event.target.value }));
                  setInvalidFields((current) => current.filter((field) => field !== name));
                }} />
            ))}
          </div>
          <OutletLinksEditor form={form} content={messages.adminDashboard.outlets} activation={messages.adminDashboard.activation} />
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>{content.cancel}</Button>
            <Button type="submit" disabled={busy}>{busy ? content.saving : content.save}</Button>
          </div>
        </fieldset>
      </form>
    </Form>
  </Dialog>;
}
