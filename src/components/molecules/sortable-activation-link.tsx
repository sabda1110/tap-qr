import { SocialBrandMark } from "../elements/social-brand-mark";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowDown, ArrowUp, GripVertical, Trash2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { Messages } from "../../i18n";
import type { ActivationLink, OwnerActivationValues } from "../../lib/validation/owner-activation-schema";
import { CustomInputText } from "../elements/custom-input-text";
import { WhatsAppNumberInput } from "../elements/whatsapp-number-input";
import { Button } from "../ui/button";
import { FormField } from "../ui/form";
import { ActivationGoogleSearch } from "./activation-google-search";

type Props = {
  link: ActivationLink & { fieldKey: string };
  index: number;
  count: number;
  form: UseFormReturn<OwnerActivationValues>;
  content: Messages["adminDashboard"]["activation"];
  move: (from: number, to: number) => void;
  remove: (index: number) => void;
  disabled: boolean;
};

export function SortableActivationLink({ link, index, count, form, content, move, remove, disabled }: Props) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: link.fieldKey, disabled });
  return <article ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : undefined }} className={`relative rounded-2xl border bg-[#f8fafc] p-4 ${isDragging ? "border-[#0798ad] shadow-xl" : "border-black/10"}`}>
      <div className="mb-4 flex items-center gap-2"><button type="button" ref={setActivatorNodeRef} {...attributes} {...listeners} disabled={disabled} aria-label={content.onboarding.dragHelp} className="touch-none cursor-grab rounded-lg p-2 text-[#087e91] active:cursor-grabbing"><GripVertical className="size-5" /></button><SocialBrandMark type={link.type} /><span className="min-w-0 flex-1 text-sm font-bold">{index + 1}. {content.channels[link.type].title}</span>
        <Button size="icon" variant="outline" type="button" aria-label={content.onboarding.moveUp} disabled={disabled || index === 0} onClick={() => move(index, index - 1)}><ArrowUp /></Button>
        <Button size="icon" variant="outline" type="button" aria-label={content.onboarding.moveDown} disabled={disabled || index === count - 1} onClick={() => move(index, index + 1)}><ArrowDown /></Button>
        <Button size="icon" variant="destructive" type="button" aria-label={content.onboarding.removeLink} onClick={() => remove(index)}><Trash2 /></Button></div>
      <div className="grid items-start gap-4 sm:grid-cols-2"><FormField control={form.control} name={`links.${index}.label`} render={({ field, fieldState }) => <CustomInputText {...field} label={content.onboarding.linkLabel} reserveMessageSpace error={fieldState.error ? content.onboarding.invalid : undefined} />} />
        <FormField control={form.control} name={`links.${index}.value`} render={({ field, fieldState }) => link.type === "google_review" ? <ActivationGoogleSearch key={link.fieldKey} content={content} value={field.value} onSelect={field.onChange} error={fieldState.error ? content.onboarding.selectBusiness : undefined} /> : link.type === "whatsapp" ? <WhatsAppNumberInput {...field} label={content.destinations.whatsapp.label} placeholder={content.destinations.whatsapp.placeholder} reserveMessageSpace error={fieldState.error ? content.onboarding.invalid : undefined} helpText={content.destinations.whatsapp.helpText} /> : <CustomInputText {...field} label={content.destinations[link.type].label} placeholder={content.destinations[link.type].placeholder} inputMode="url" reserveMessageSpace error={fieldState.error ? content.onboarding.invalid : undefined} helpText={content.destinations[link.type].helpText} />} /></div>
  </article>;
}
