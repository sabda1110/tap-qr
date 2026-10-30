import { useFieldArray, type UseFormReturn } from "react-hook-form";
import type { ReactNode } from "react";
import { useState } from "react";
import { Check, Plus } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableOutletLink } from "./sortable-outlet-link";
import { useI18n, type Messages } from "../../i18n";
import { cn } from "../../lib/utils";
import type { CardLinksEditValues } from "../../server/outlets/outlet.schemas";
import { Button } from "../ui/button";
import { AlertDialog } from "../ui/alert-dialog";
import { SocialBrandMark } from "../elements/social-brand-mark";

const fixedChannels = [
  "google_review",
  "instagram",
  "tiktok",
  "whatsapp",
] as const;

export function OutletLinksEditor({
  form,
  content,
  activation,
  disabled = false,
  googleReviewInput = "search",
  placeIdGuide,
}: {
  form: UseFormReturn<CardLinksEditValues>;
  content: Messages["adminDashboard"]["outlets"];
  activation: Messages["adminDashboard"]["activation"];
  disabled?: boolean;
  googleReviewInput?: "search" | "placeId";
  placeIdGuide?: ReactNode;
}) {
  const { messages } = useI18n();
  const claim = messages.cardClaim;

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "links",
    keyName: "fieldKey",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const busy = form.formState.isSubmitting || disabled;
  const [pendingRemoval, setPendingRemoval] = useState<string | null>(null);

  const channelLabels: Record<string, string> = {
    ...Object.fromEntries(
      Object.entries(activation.channels).map(([key, channel]) => [
        key,
        channel.title,
      ]),
    ),
    facebook: "Facebook",
  };

  const selectedTypes = new Set(fields.map((link) => link.type));

  function toggleChannel(type: (typeof fixedChannels)[number]) {
    const index = fields.findIndex((link) => link.type === type);
    if (index >= 0) {
      if (fields[index].value) {
        setPendingRemoval(fields[index].fieldKey);
      } else {
        remove(index);
      }
    } else {
      append({
        id: crypto.randomUUID(),
        type,
        label: channelLabels[type] ?? type,
        value: "",
        ...(type === "whatsapp"
          ? { message: claim.whatsappMessageDefault }
          : {}),
        isActive: true,
      });
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-base font-bold tracking-tight text-[#171b22] sm:text-lg">
          {claim.channelTitle}
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          {claim.channelDescription}
        </p>
        <div className="mt-3.5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {fixedChannels.map((type) => {
            const selected = selectedTypes.has(type);
            return (
              <button
                key={type}
                type="button"
                disabled={busy}
                aria-pressed={selected}
                onClick={() => toggleChannel(type)}
                className={cn(
                  "relative flex min-h-20 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border-2 bg-white p-3 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087e91] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  selected
                    ? "border-[#171b22] bg-[#fff8e9] shadow-[3px_3px_0_#ffb332]"
                    : "border-slate-200 hover:border-[#087e91]/40",
                )}
              >
                {selected && (
                  <span className="absolute top-2 right-2 grid size-5 place-items-center rounded-full bg-[#171b22] text-[#ffb332]">
                    <Check className="size-3.5" />
                  </span>
                )}
                <SocialBrandMark type={type} />
                <span className="text-sm font-bold text-slate-900">
                  {channelLabels[type]}
                </span>
              </button>
            );
          })}
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={busy || fields.length >= 20}
          onClick={() =>
            append({
              id: crypto.randomUUID(),
              type: "custom",
              label: claim.additionalLink,
              value: "",
              isActive: true,
            })
          }
          className="mt-3 w-full rounded-xl border-dashed border-[#087e91] text-[#087e91] sm:w-auto"
        >
          <Plus className="size-4" />
          {claim.addAdditionalLink}
        </Button>
      </div>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-5">
          <div>
            <h4 className="text-base font-bold text-[#171b22]">
              {claim.detailsTitle}
            </h4>
            <p className="mt-0.5 text-xs text-slate-500">
              {activation.onboarding.dragHelp}
            </p>
          </div>
        </div>

        <DndContext
          id="outlet-links"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={({ active, over }) => {
            if (!over || active.id === over.id || busy) return;
            const from = fields.findIndex((link) => link.fieldKey === active.id);
            const to = fields.findIndex((link) => link.fieldKey === over.id);
            if (from >= 0 && to >= 0) move(from, to);
          }}
        >
          <SortableContext
            items={fields.map((link) => link.fieldKey)}
            strategy={verticalListSortingStrategy}
          >
            <div className="mt-4 grid gap-3">
              {fields.map((link, index) => (
                <SortableOutletLink
                  key={link.fieldKey}
                  link={link}
                  index={index}
                  count={fields.length}
                  form={form}
                  content={content}
                  activation={activation}
                  busy={busy}
                  channelLabels={channelLabels}
                  googleReviewInput={googleReviewInput}
                  placeIdGuide={placeIdGuide}
                  move={move}
                  setPendingRemoval={setPendingRemoval}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {(form.formState.errors.links?.root ||
        form.formState.errors.links?.message) && (
        <p className="text-sm font-semibold text-red-600">
          {activation.onboarding.requiredLink}
        </p>
      )}
      {!form.formState.errors.links && fields.length === 0 && (
        <p className="text-sm text-slate-500">
          {activation.onboarding.requiredLink}
        </p>
      )}

      <AlertDialog
        open={Boolean(pendingRemoval)}
        title={content.remove}
        description={content.removeConfirm}
        cancelLabel={content.cancel}
        confirmLabel={content.remove}
        onOpenChange={(open) => {
          if (!open) setPendingRemoval(null);
        }}
        onConfirm={() => {
          const index = fields.findIndex(
            (link) => link.fieldKey === pendingRemoval,
          );
          if (index >= 0 && !busy) remove(index);
          setPendingRemoval(null);
        }}
      />
    </section>
  );
}
