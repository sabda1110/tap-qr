import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { Messages } from "../../i18n";
import { useOutletSlugAvailability } from "../../hooks/use-outlet-slug-availability";
import {
  createOutletFieldsSchema,
  type CreateOutletFields,
} from "../../server/outlets/outlet-create.schemas";
import { createAdminOwnerOutlet } from "../../server/outlets/outlet-create.functions";
import {
  updateOutletCardLinksSchema,
  type CardLinksEditValues,
} from "../../server/outlets/outlet.schemas";
import { copySocialLinks } from "../../lib/outlet-link-copy";
import { OutletOwnerPicker } from "../molecules/outlet-owner-picker";
import { OutletCopyPicker } from "../molecules/outlet-copy-picker";
import { OutletCreateFields } from "../molecules/outlet-create-fields";
import { OutletLinksEditor } from "../molecules/outlet-links-editor";
import { Button } from "../ui/button";
import { DialogBody, DialogFooter } from "../ui/dialog";
import { Form } from "../ui/form";
import { useToast } from "../ui/toaster";

export function OutletCreateForm({
  content,
  createContent,
  activation,
  onBusyChange,
  onCancel,
  onSaved,
}: {
  content: Messages["adminDashboard"]["outlets"];
  createContent: Messages["adminDashboard"]["outletCreate"];
  activation: Messages["adminDashboard"]["activation"];
  onBusyChange: (busy: boolean) => void;
  onCancel: () => void;
  onSaved: (outletId: string) => Promise<void>;
}) {
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const form = useForm<CreateOutletFields>({
    resolver: zodResolver(createOutletFieldsSchema),
    defaultValues: {
      ownerId: "",
      cardId: "",
      outletName: "",
      slug: "",
      logoUrl: null,
      phone: "",
      address: "",
      status: "active",
    },
  });
  const linksForm = useForm<CardLinksEditValues>({
    resolver: zodResolver(updateOutletCardLinksSchema),
    defaultValues: { outletId: "new", cardId: "new", links: [] },
  });
  const ownerId = form.watch("ownerId");
  const slugStatus = useOutletSlugAvailability(form.watch("slug"));
  const busy = form.formState.isSubmitting || uploading;
  async function save(values: CreateOutletFields) {
    if (
      uploading ||
      slugStatus === "checking" ||
      slugStatus === "used" ||
      slugStatus === "error"
    )
      return;
    await linksForm.handleSubmit(async ({ links }) => {
      onBusyChange(true);
      try {
        const created = await createAdminOwnerOutlet({
          data: { ...values, links },
        });
        showToast(createContent.success, "success");
        await onSaved(created.outletId);
      } catch (error) {
        const message = error instanceof Error ? error.message : "";
        let notice = content.error;
        if (message.includes("SLUG_ALREADY_USED")) {
          notice = content.slugUsed;
          form.setError("slug", { message: notice });
        }
        if (message.includes("CARD_NOT_FOUND")) {
          notice = createContent.cardMissing;
          form.setError("cardId", { message: notice });
        }
        if (message.includes("CARD_ALREADY_ASSIGNED")) {
          notice = createContent.cardUsed;
          form.setError("cardId", { message: notice });
        }
        if (message.includes("OWNER_NOT_AVAILABLE")) {
          notice = createContent.ownerUnavailable;
          form.setError("ownerId", { message: notice });
        }
        showToast(notice, "error");
      } finally {
        onBusyChange(false);
      }
    })();
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
            <OutletOwnerPicker
              content={createContent}
              disabled={busy}
              error={
                form.formState.errors.ownerId
                  ? form.formState.errors.ownerId.message ===
                    createContent.ownerUnavailable
                    ? createContent.ownerUnavailable
                    : createContent.invalid
                  : undefined
              }
              onSelect={(owner) => {
                if (owner?.id !== ownerId)
                  linksForm.reset({
                    outletId: "new",
                    cardId: "new",
                    links: [],
                  });
                form.setValue("ownerId", owner?.id ?? "", {
                  shouldValidate: true,
                });
                if (owner && !form.getValues("phone"))
                  form.setValue("phone", owner.phone);
              }}
            />
            <OutletCreateFields
              form={form}
              content={content}
              createContent={createContent}
              activation={activation}
              slugStatus={slugStatus}
              disabled={form.formState.isSubmitting}
              onUploadBusy={(value) => {
                setUploading(value);
                onBusyChange(value);
              }}
            />
            {ownerId && (
              <OutletCopyPicker
                key={ownerId}
                ownerId={ownerId}
                content={createContent}
                channels={activation.channels}
                disabled={busy}
                onCopy={(links) => {
                  const current = linksForm.getValues("links");
                  if (current.length + links.length > 20) {
                    showToast(createContent.tooManyLinks, "warning");
                    return;
                  }
                  linksForm.reset({
                    outletId: "new",
                    cardId: "new",
                    links: [...current, ...copySocialLinks(links)],
                  });
                  showToast(createContent.copied, "success");
                }}
              />
            )}
            <Form {...linksForm}>
              <OutletLinksEditor
                form={linksForm}
                content={content}
                activation={activation}
                disabled={busy}
              />
            </Form>
          </fieldset>
        </DialogBody>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="h-11 px-5"
            disabled={busy}
            onClick={onCancel}
          >
            {content.cancel}
          </Button>
          <Button
            type="submit"
            className="h-11 px-5"
            disabled={
              busy ||
              slugStatus === "checking" ||
              slugStatus === "used" ||
              slugStatus === "error"
            }
          >
            {busy ? content.saving : createContent.save}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
