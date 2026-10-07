import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useFieldArray, type UseFormReturn } from "react-hook-form";
import type { Messages } from "../../i18n";
import type { ActivationLink, OwnerActivationValues } from "../../lib/validation/owner-activation-schema";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { SortableActivationLink } from "./sortable-activation-link";

type Content = Messages["adminDashboard"]["activation"];

export function ActivationLinksEditor({ form, content }: { form: UseFormReturn<OwnerActivationValues>; content: Content }) {
  const { fields, append, remove, move } = useFieldArray({ control: form.control, name: "links", keyName: "fieldKey" });
  const disabled = form.formState.isSubmitting;
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const [type, setType] = useState<ActivationLink["type"]>("google_review");
  const channelItems = Object.fromEntries(
    Object.entries(content.channels).map(([key, channel]) => [key, channel.title]),
  );
  return <section className="rounded-2xl border border-black/8 bg-white p-5 sm:p-6">
    <h2 className="text-lg font-bold">{content.onboarding.linksTitle}</h2>
    <p className="mt-2 text-sm leading-6 text-[#69737d]">{content.onboarding.dragHelp}</p>
    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Select items={channelItems} value={type} disabled={disabled} onValueChange={(value) => value && setType(value as ActivationLink["type"])}>
        <SelectTrigger aria-label={content.onboarding.channelLabel} className="w-full sm:w-64">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(content.channels).map(([key, channel]) => (
            <SelectItem key={key} value={key}>{channel.title}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button className="h-11 px-4" disabled={disabled || fields.length >= 20} type="button" onClick={() => append({ id: crypto.randomUUID(), type, label: content.channels[type].title, value: "" })}><Plus />{content.onboarding.addLink}</Button>
    </div>
    <DndContext id="activation-links" sensors={sensors} collisionDetection={closestCenter} onDragEnd={({ active, over }) => {
      if (!over || active.id === over.id || disabled) return;
      const from = fields.findIndex((link) => link.fieldKey === active.id);
      const to = fields.findIndex((link) => link.fieldKey === over.id);
      if (from >= 0 && to >= 0) move(from, to);
    }}><SortableContext items={fields.map((link) => link.fieldKey)} strategy={verticalListSortingStrategy}>
      <div className="mt-5 grid gap-4">{fields.map((link, index) => <SortableActivationLink key={link.fieldKey} link={link} index={index} count={fields.length} form={form} content={content} move={move} remove={remove} disabled={disabled} />)}</div>
    </SortableContext></DndContext>
    {form.formState.errors.links?.root && <p className="mt-3 text-sm text-red-600">{content.onboarding.requiredLink}</p>}
    {fields.length === 0 && <p className="mt-4 text-sm text-[#69737d]">{content.onboarding.requiredLink}</p>}
  </section>;
}
