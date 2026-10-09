import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { ReactNode } from "react";
import type { Messages } from "../../i18n";
import type { OutletDetail } from "../../server/outlets/outlet.types";
import {
  updateOutletCardLinksSchema,
  type CardLinksEditValues,
} from "../../server/outlets/outlet.schemas";
import { updateAdminOutletCardLinks } from "../../server/outlets/outlet.functions";
import { OutletLinksEditor } from "../molecules/outlet-links-editor";
import { Button } from "../ui/button";
import { DialogBody, DialogFooter } from "../ui/dialog";
import { Form } from "../ui/form";
import { useToast } from "../ui/toaster";

export function OutletCardEditForm({
  outletId,
  card,
  content,
  activation,
  onBusyChange,
  onCancel,
  onSaved,
  saveCardLinks = updateAdminOutletCardLinks,
  googleReviewInput = "search",
  placeIdGuide,
}: {
  outletId: string;
  card: OutletDetail["cards"][number];
  content: Messages["adminDashboard"]["outlets"];
  activation: Messages["adminDashboard"]["activation"];
  onBusyChange: (busy: boolean) => void;
  onCancel: () => void;
  onSaved: () => Promise<void>;
  saveCardLinks?: typeof updateAdminOutletCardLinks;
  googleReviewInput?: "search" | "placeId";
  placeIdGuide?: ReactNode;
}) {
  const { showToast } = useToast();
  const form = useForm<CardLinksEditValues>({
    resolver: zodResolver(updateOutletCardLinksSchema),
    defaultValues: {
      outletId,
      cardId: card.id,
      links: card.links.map((link) => {
        let value = link.url;
        try {
          if (link.type === "google_review")
            value = new URL(link.url).searchParams.get("placeid") ?? "";
          if (link.type === "whatsapp")
            value = new URL(link.url).pathname.replace(/\D/g, "");
        } catch {
          value = "";
        }
        return {
          id: link.id,
          type: link.type,
          label: link.label,
          value,
          isActive: link.isActive,
        };
      }),
    },
  });
  const busy = form.formState.isSubmitting;
  async function save(values: CardLinksEditValues) {
    onBusyChange(true);
    try {
      await saveCardLinks({ data: values });
      showToast(content.cardSuccess, "success");
      await onSaved();
    } catch {
      showToast(content.error, "error");
    } finally {
      onBusyChange(false);
    }
  }
  return (
    <Form {...form}>
      <form
        className="flex min-h-0 flex-1 flex-col"
        noValidate
        aria-busy={busy}
        onSubmit={form.handleSubmit(save)}
      >
        <DialogBody>
          <fieldset disabled={busy} className="grid gap-5 border-0 p-0">
            <p className="rounded-xl border border-[#bce8ef] bg-[#e8f8fb] p-4 text-sm text-[#087e91]">
              {content.cardEditHelp}
              <strong className="mt-2 block break-all">{card.cardId}</strong>
            </p>
            <OutletLinksEditor
              form={form}
              content={content}
              activation={activation}
              googleReviewInput={googleReviewInput}
              placeIdGuide={placeIdGuide}
            />
          </fieldset>
        </DialogBody>
        <DialogFooter>
          <Button
            type="button"
            className="h-11 px-5"
            variant="outline"
            disabled={busy}
            onClick={onCancel}
          >
            {content.cancel}
          </Button>
          <Button type="submit" className="h-11 px-5" disabled={busy}>
            {busy ? content.saving : content.save}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
