import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowDown, ArrowUp, GripVertical, X } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { ReactNode } from "react";
import { useI18n, type Messages } from "../../i18n";
import type { CardLinksEditValues } from "../../server/outlets/outlet.schemas";
import { cn } from "../../lib/utils";
import { SocialBrandMark } from "../elements/social-brand-mark";
import { Button } from "../ui/button";
import { FormField } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { OutletLinkInputs } from "./outlet-link-inputs";

type Props = {
  link: CardLinksEditValues["links"][number] & { fieldKey: string };
  index: number;
  count: number;
  form: UseFormReturn<CardLinksEditValues>;
  content: Messages["adminDashboard"]["outlets"];
  activation: Messages["adminDashboard"]["activation"];
  busy: boolean;
  channelLabels: Record<string, string>;
  googleReviewInput: "search" | "placeId";
  placeIdGuide?: ReactNode;
  move: (from: number, to: number) => void;
  setPendingRemoval: (key: string) => void;
};

export function SortableOutletLink({
  link,
  index,
  count,
  form,
  content,
  activation,
  busy,
  channelLabels,
  googleReviewInput,
  placeIdGuide,
  move,
  setPendingRemoval,
}: Props) {
  const { messages } = useI18n();
  const claim = messages.cardClaim;
  const type = form.watch(`links.${index}.type`);
  const channelType = type === "facebook" ? "custom" : type;
  const title =
    channelType === "custom"
      ? claim.additionalLink
      : (channelLabels[type] ?? type);

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.fieldKey, disabled: busy });

  return (
    <article
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : undefined,
      }}
      className={cn(
        "relative rounded-2xl border bg-white p-3.5 sm:p-4 shadow-sm transition-shadow",
        isDragging
          ? "border-[#ffb332] shadow-xl ring-2 ring-[#ffb332]/20"
          : "border-slate-200",
      )}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <Button
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            type="button"
            variant="ghost"
            size="icon"
            disabled={busy}
            aria-label={activation.onboarding.dragHelp}
            className="size-8 touch-none cursor-grab text-slate-400 hover:text-slate-700 active:cursor-grabbing"
          >
            <GripVertical className="size-4" />
          </Button>
          <SocialBrandMark type={channelType} />
          <span className="min-w-0 truncate text-sm font-extrabold text-slate-950">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <FormField
            control={form.control}
            name={`links.${index}.isActive`}
            render={({ field }) => (
              <Select
                items={{
                  active: content.active,
                  disabled: content.disabled,
                }}
                value={field.value ? "active" : "disabled"}
                disabled={busy}
                onValueChange={(value) => field.onChange(value === "active")}
              >
                <SelectTrigger
                  className="h-8 w-28 text-xs font-semibold"
                  aria-label={content.linkStatus}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{content.active}</SelectItem>
                  <SelectItem value="disabled">{content.disabled}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <Button
            type="button"
            size="icon"
            variant="outline"
            aria-label={content.moveUp}
            className="size-8 rounded-lg border-slate-200 text-slate-600"
            disabled={busy || index === 0}
            onClick={() => move(index, index - 1)}
          >
            <ArrowUp className="size-3.5" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            aria-label={content.moveDown}
            className="size-8 rounded-lg border-slate-200 text-slate-600"
            disabled={busy || index === count - 1}
            onClick={() => move(index, index + 1)}
          >
            <ArrowDown className="size-3.5" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            aria-label={content.remove}
            className="size-8 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-600"
            disabled={busy}
            onClick={() => setPendingRemoval(link.fieldKey)}
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>

      <OutletLinkInputs
        index={index}
        fieldKey={link.fieldKey}
        type={type}
        form={form}
        content={content}
        activation={activation}
        claim={claim}
        channelLabels={channelLabels}
        googleReviewInput={googleReviewInput}
        placeIdGuide={placeIdGuide}
      />
    </article>
  );
}
