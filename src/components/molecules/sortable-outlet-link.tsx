import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowDown, ArrowUp, GripVertical, Trash2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { ReactNode } from "react";
import type { Messages } from "../../i18n";
import type { CardLinksEditValues } from "../../server/outlets/outlet.schemas";
import { CustomInputText } from "../elements/custom-input-text";
import { WhatsAppNumberInput } from "../elements/whatsapp-number-input";
import { SocialBrandMark } from "../elements/social-brand-mark";
import { ActivationGoogleSearch } from "./activation-google-search";
import { Button } from "../ui/button";
import { FormField } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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
}: {
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
}) {
  const type = form.watch(`links.${index}.type`);
  const destination =
    activation.destinations[type === "facebook" ? "custom" : type];
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
      className={`relative rounded-2xl border bg-[#f8fafc] p-3 sm:p-4 ${isDragging ? "border-[#0798ad] shadow-xl" : "border-black/8"}`}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
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
            className="size-11 touch-none cursor-grab text-[#087e91] active:cursor-grabbing sm:size-8"
          >
            <GripVertical />
          </Button>
          <SocialBrandMark type={type === "facebook" ? "custom" : type} />
          <span className="min-w-0 text-sm font-bold break-words">
            {index + 1}. {channelLabels[type]}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            size="icon"
            variant="outline"
            aria-label={content.moveUp}
            className="size-11 sm:size-8"
            disabled={busy || index === 0}
            onClick={() => move(index, index - 1)}
          >
            <ArrowUp />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            aria-label={content.moveDown}
            className="size-11 sm:size-8"
            disabled={busy || index === count - 1}
            onClick={() => move(index, index + 1)}
          >
            <ArrowDown />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="destructive"
            aria-label={content.remove}
            className="size-11 sm:size-8"
            disabled={busy}
            onClick={() => setPendingRemoval(link.fieldKey)}
          >
            <Trash2 />
          </Button>
        </div>
      </div>
      <div className="grid items-start gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name={`links.${index}.type`}
          render={({ field }) => (
            <div className="grid gap-2">
              <label
                id={`channel-${link.fieldKey}`}
                className="text-sm font-semibold"
              >
                {activation.onboarding.channelLabel}
              </label>
              <Select
                items={channelLabels}
                value={field.value}
                disabled={busy}
                onValueChange={(value) => {
                  if (value) {
                    field.onChange(value);
                    form.setValue(`links.${index}.value`, "", {
                      shouldDirty: true,
                    });
                  }
                }}
              >
                <SelectTrigger
                  className="w-full"
                  aria-labelledby={`channel-${link.fieldKey}`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(channelLabels).map(([value, label]) => (
                    <SelectItem value={value} key={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        />
        <FormField
          control={form.control}
          name={`links.${index}.isActive`}
          render={({ field }) => (
            <div className="grid gap-2">
              <label
                id={`status-${link.fieldKey}`}
                className="text-sm font-semibold"
              >
                {content.linkStatus}
              </label>
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
                  className="w-full"
                  aria-labelledby={`status-${link.fieldKey}`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{content.active}</SelectItem>
                  <SelectItem value="disabled">{content.disabled}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        />
        <FormField
          control={form.control}
          name={`links.${index}.label`}
          render={({ field, fieldState }) => (
            <CustomInputText
              {...field}
              label={activation.onboarding.linkLabel}
              reserveMessageSpace
              error={fieldState.error ? content.invalid : undefined}
            />
          )}
        />
        <FormField
          control={form.control}
          name={`links.${index}.value`}
          render={({ field, fieldState }) =>
            type === "google_review" && googleReviewInput === "search" ? (
              <ActivationGoogleSearch
                inputId={`outlet-google-${link.fieldKey}`}
                content={activation}
                value={field.value}
                onSelect={field.onChange}
                error={
                  fieldState.error
                    ? activation.onboarding.selectBusiness
                    : undefined
                }
              />
            ) : type === "google_review" ? (
              <div className="grid gap-2">
                <CustomInputText
                  {...field}
                  label={activation.onboarding.placeId}
                  placeholder="ChIJ..."
                  reserveMessageSpace
                  error={fieldState.error ? content.invalid : undefined}
                />
                {placeIdGuide}
              </div>
            ) : type === "whatsapp" ? (
              <WhatsAppNumberInput
                {...field}
                label={destination.label}
                placeholder={destination.placeholder}
                helpText={destination.helpText}
                reserveMessageSpace
                error={fieldState.error ? content.invalid : undefined}
              />
            ) : (
              <CustomInputText
                {...field}
                label={destination.label}
                placeholder={destination.placeholder}
                inputMode="url"
                helpText={destination.helpText}
                reserveMessageSpace
                error={fieldState.error ? content.invalid : undefined}
              />
            )
          }
        />
      </div>
    </article>
  );
}
