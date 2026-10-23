import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { Messages } from "../../i18n";
import type { OutletHighlight } from "../../lib/firebase/firestore-schema";
import type { OutletDetail } from "../../server/outlets/outlet.types";
import {
  updateOutletHighlightsSchema,
  type OutletHighlightsValues,
} from "../../server/outlets/outlet.schemas";
import { updateUserOutletHighlights } from "../../server/outlets/user-outlet.functions";
import { HighlightImagePicker } from "../molecules/highlight-image-picker";
import { AlertDialog } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { DialogBody, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { useToast } from "../ui/toaster";

type PendingDelete =
  | { kind: "highlight"; highlightIndex: number }
  | { kind: "image"; highlightIndex: number; imageIndex: number };

export function OutletGalleryEditor({
  outlet,
  content,
  onBusyChange,
  onCancel,
  onSaved,
  saveHighlights = updateUserOutletHighlights,
}: {
  outlet: OutletDetail;
  content: Messages["outletGallery"];
  onBusyChange: (busy: boolean) => void;
  onCancel: () => void;
  onSaved: () => Promise<void>;
  saveHighlights?: typeof updateUserOutletHighlights;
}) {
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const form = useForm<OutletHighlightsValues>({
    resolver: zodResolver(updateOutletHighlightsSchema),
    defaultValues: { outletId: outlet.id, highlights: outlet.highlights },
    mode: "onChange",
  });
  const highlights = form.watch("highlights") ?? [];
  const busy = uploading || form.formState.isSubmitting;

  function setHighlights(next: OutletHighlight[]) {
    form.setValue("highlights", next, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  function moveHighlight(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= highlights.length) return;
    const next = [...highlights];
    [next[index], next[target]] = [next[target]!, next[index]!];
    setHighlights(next);
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    if (pendingDelete.kind === "highlight") {
      setHighlights(
        highlights.filter((_, index) => index !== pendingDelete.highlightIndex),
      );
    } else {
      const next = [...highlights];
      const highlight = next[pendingDelete.highlightIndex];
      if (highlight)
        next[pendingDelete.highlightIndex] = {
          ...highlight,
          images: highlight.images.filter(
            (_, index) => index !== pendingDelete.imageIndex,
          ),
        };
      setHighlights(next);
    }
    setPendingDelete(null);
  }

  async function save(values: OutletHighlightsValues) {
    onBusyChange(true);
    try {
      await saveHighlights({ data: values });
      showToast(content.saved, "success");
      await onSaved();
    } catch {
      showToast(content.saveFailed, "error");
    } finally {
      onBusyChange(false);
    }
  }

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      noValidate
      aria-busy={busy}
      onSubmit={form.handleSubmit(save)}
    >
      <DialogBody>
        <fieldset disabled={busy} className="grid gap-4 border-0 p-0">
          <div className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-[#bce8ef] bg-[#e8f8fb] p-4">
            <p className="max-w-2xl text-sm leading-6 text-[#087e91]">
              {content.dashboardDescription}
            </p>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#087e91]">
              {content.highlightCount.replace(
                "{count}",
                String(highlights.length),
              )}
            </span>
          </div>

          {highlights.map((highlight, highlightIndex) => (
            <section
              key={highlight.id}
              className="rounded-2xl border border-black/8 bg-white p-4 sm:p-5"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="grid size-8 place-items-center rounded-full bg-[#ffb332] text-sm font-black">
                  {highlightIndex + 1}
                </span>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label={content.moveUp}
                    disabled={highlightIndex === 0}
                    onClick={() => moveHighlight(highlightIndex, -1)}
                  >
                    <ArrowUp />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label={content.moveDown}
                    disabled={highlightIndex === highlights.length - 1}
                    onClick={() => moveHighlight(highlightIndex, 1)}
                  >
                    <ArrowDown />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label={content.removeHighlight}
                    onClick={() =>
                      setPendingDelete({ kind: "highlight", highlightIndex })
                    }
                  >
                    <Trash2 className="text-red-600" />
                  </Button>
                </div>
              </div>
              <label className="block text-sm font-semibold" htmlFor={`highlight-${highlight.id}`}>
                {content.titleLabel}
              </label>
              <Input
                id={`highlight-${highlight.id}`}
                className="mt-2"
                maxLength={24}
                placeholder={content.titlePlaceholder}
                aria-invalid={!!form.formState.errors.highlights?.[highlightIndex]?.title}
                {...form.register(`highlights.${highlightIndex}.title`)}
              />
              <div className="mt-5">
                <HighlightImagePicker
                  outletId={outlet.id}
                  images={highlight.images}
                  content={content}
                  disabled={busy}
                  onBusyChange={(value) => {
                    setUploading(value);
                    onBusyChange(value);
                  }}
                  onChange={(images) => {
                    const next = [...highlights];
                    next[highlightIndex] = { ...highlight, images };
                    setHighlights(next);
                  }}
                  onRequestRemove={(imageIndex) =>
                    setPendingDelete({
                      kind: "image",
                      highlightIndex,
                      imageIndex,
                    })
                  }
                />
              </div>
            </section>
          ))}

          {form.formState.isSubmitted && !form.formState.isValid && (
            <p role="alert" className="text-sm font-medium text-red-700">
              {content.invalid}
            </p>
          )}
          <Button
            type="button"
            variant="outline"
            className="h-11 justify-center"
            disabled={highlights.length >= 3}
            onClick={() =>
              setHighlights([
                ...highlights,
                { id: crypto.randomUUID(), title: "", images: [] },
              ])
            }
          >
            <Plus />
            {content.addHighlight}
          </Button>
        </fieldset>
      </DialogBody>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={busy}>
          {content.cancel}
        </Button>
        <Button type="submit" disabled={busy}>
          {form.formState.isSubmitting ? content.saving : content.save}
        </Button>
      </DialogFooter>
      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title={
          pendingDelete?.kind === "highlight"
            ? content.deleteHighlightTitle
            : content.deleteImageTitle
        }
        description={
          pendingDelete?.kind === "highlight"
            ? content.deleteHighlightDescription
            : content.deleteImageDescription
        }
        cancelLabel={content.deleteCancel}
        confirmLabel={content.deleteConfirm}
        onConfirm={confirmDelete}
      />
    </form>
  );
}
