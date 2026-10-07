import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Messages } from "../../i18n";
import type { OutletDetail } from "../../server/outlets/outlet.types";
import {
  updateOutletCardLinksSchema,
  type CardLinksEditValues,
} from "../../server/outlets/outlet.schemas";
import { updateAdminOutletCardLinks } from "../../server/outlets/outlet.functions";
import { OutletLinksEditor } from "../molecules/outlet-links-editor";
import { Button } from "../ui/button";
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
}: {
  outletId: string;
  card: OutletDetail["cards"][number];
  content: Messages["adminDashboard"]["outlets"];
  activation: Messages["adminDashboard"]["activation"];
  onBusyChange: (busy: boolean) => void;
  onCancel: () => void;
  onSaved: () => Promise<void>;
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
      await updateAdminOutletCardLinks({ data: values });
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
      <form noValidate aria-busy={busy} onSubmit={form.handleSubmit(save)}>
        <fieldset disabled={busy} className="grid gap-5 border-0 p-0">
          <p className="rounded-xl border border-[#bce8ef] bg-[#e8f8fb] p-4 text-sm text-[#087e91]">
            {content.cardEditHelp}
            <strong className="mt-2 block break-all">{card.cardId}</strong>
          </p>
          <OutletLinksEditor
            form={form}
            content={content}
            activation={activation}
          />
          <div className="sticky bottom-0 flex justify-end gap-3 rounded-xl border border-black/8 bg-white/95 p-4 backdrop-blur">
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
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
