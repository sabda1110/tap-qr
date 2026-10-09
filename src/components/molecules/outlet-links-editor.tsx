import { useFieldArray, type UseFormReturn } from "react-hook-form";
import type { ReactNode } from "react";
import { useState } from "react";
import { Plus } from "lucide-react";
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
import type { Messages } from "../../i18n";
import type { CardLinksEditValues } from "../../server/outlets/outlet.schemas";
import { Button } from "../ui/button";
import { AlertDialog } from "../ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "links",
    keyName: "fieldKey",
  });
  const [selectedType, setSelectedType] =
    useState<CardLinksEditValues["links"][number]["type"]>("google_review");
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
  return (
    <section className="rounded-2xl border border-black/8 bg-white p-3 sm:p-6">
      <h2 className="text-lg font-bold">{activation.onboarding.linksTitle}</h2>
      <p className="mt-2 text-sm leading-6 text-[#69737d]">
        {activation.onboarding.dragHelp}
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Select
          items={channelLabels}
          value={selectedType}
          disabled={busy}
          onValueChange={(value) =>
            value && setSelectedType(value as typeof selectedType)
          }
        >
          <SelectTrigger
            aria-label={activation.onboarding.channelLabel}
            className="w-full sm:w-64"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(channelLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          className="h-11 px-4"
          disabled={busy || fields.length >= 20}
          onClick={() =>
            append({
              id: crypto.randomUUID(),
              type: selectedType,
              label: channelLabels[selectedType],
              value: "",
              isActive: true,
            })
          }
        >
          <Plus />
          {activation.onboarding.addLink}
        </Button>
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
          <div className="mt-5 grid gap-4">
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
      {(form.formState.errors.links?.root ||
        form.formState.errors.links?.message) && (
        <p className="mt-3 text-sm text-red-600">
          {activation.onboarding.requiredLink}
        </p>
      )}
      {!form.formState.errors.links && fields.length === 0 && (
        <p className="mt-4 text-sm text-[#69737d]">
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
