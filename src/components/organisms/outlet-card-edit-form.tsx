import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { ReactNode } from "react";
import { CreditCard } from "lucide-react";
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
        let message = link.message ?? undefined;
        try {
          if (link.type === "google_review")
            value = new URL(link.url).searchParams.get("placeid") ?? "";
          if (link.type === "whatsapp") {
            const destination = new URL(link.url);
            value = destination.pathname.replace(/\D/g, "");
            message ??= destination.searchParams.get("text") ?? undefined;
          }
          if (link.type === "instagram" || link.type === "tiktok") {
            const parsed = new URL(link.url);
            const username = parsed.pathname
              .replace(/^\/@?/, "")
              .replace(/\/$/, "");
            if (username) value = username;
          }
        } catch {
          if (link.type === "instagram" || link.type === "tiktok") {
            value = link.url.replace(/^@+/, "");
          } else {
            value = "";
          }
        }
        return {
          id: link.id,
          type: link.type,
          label: link.label,
          value,
          message,
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
        <DialogBody className="bg-white sm:px-7 sm:py-6">
          <fieldset disabled={busy} className="grid gap-5 border-0 p-0">
            <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-2xl border border-black/10 bg-[#fffdf8] p-4 shadow-[2px_2px_0_#f0e4cd]">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#fff2d3] px-2.5 py-1 text-xs font-bold text-[#85500f]">
                  <CreditCard className="size-3.5" />
                  {card.material === "acrylic"
                    ? content.acrylic
                    : content.pvc}
                </span>
                <span className="font-mono text-xs font-bold break-all text-slate-800">
                  {card.cardId}
                </span>
              </div>
              <p className="w-full text-xs text-[#69737d]">
                {content.cardEditHelp}
              </p>
            </div>
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
            className="h-11 rounded-md border-black/15 px-5 font-semibold"
            variant="outline"
            disabled={busy}
            onClick={onCancel}
          >
            {content.cancel}
          </Button>
          <Button
            type="submit"
            className="h-11 cursor-pointer rounded-md border-[#171b22] bg-[#ffb332] px-6 font-bold text-[#171b22] hover:bg-[#ffc45c]"
            disabled={busy}
          >
            {busy ? content.saving : content.save}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
