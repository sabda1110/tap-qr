import type { FormEvent } from "react";
import type { CardMaterial } from "../../lib/firebase/firestore-schema";
import { Button } from "../ui/button";
import { CustomInputText } from "../elements/custom-input-text";

export type CardGeneratorFormContent = {
  quantityLabel: string;
  materialLabel: string;
  acrylic: string;
  pvc: string;
  generateSubmit: string;
  cancel: string;
};

type CardGeneratorFormProps = {
  content: CardGeneratorFormContent;
  isPending: boolean;
  quantity: string;
  material: CardMaterial;
  onQuantityChange: (value: string) => void;
  onMaterialChange: (value: CardMaterial) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export function CardGeneratorForm({
  content,
  isPending,
  quantity,
  material,
  onQuantityChange,
  onMaterialChange,
  onSubmit,
  onCancel,
}: CardGeneratorFormProps) {
  return (
    <form
      className="mt-6 grid gap-4 rounded-2xl border border-[#bce8ef] bg-[#eaf9fb] p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
      onSubmit={onSubmit}
    >
      <CustomInputText
        label={content.quantityLabel}
        max="100"
        min="1"
        onChange={(event) => onQuantityChange(event.target.value)}
        required
        type="number"
        value={quantity}
      />
      <label className="grid gap-2 text-sm font-semibold text-[#252a32]">
        {content.materialLabel}
        <select
          className="h-10 rounded-lg border border-black/12 bg-white px-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#0798ad]"
          disabled={isPending}
          onChange={(event) => onMaterialChange(event.target.value as CardMaterial)}
          value={material}
        >
          <option value="acrylic">{content.acrylic}</option>
          <option value="pvc">{content.pvc}</option>
        </select>
      </label>
      <div className="flex gap-2">
        <Button className="h-10 bg-black px-4 text-white hover:bg-black/80" disabled={isPending} type="submit">
          {content.generateSubmit}
        </Button>
        <Button className="h-10 px-4" disabled={isPending} onClick={onCancel} type="button" variant="outline">
          {content.cancel}
        </Button>
      </div>
    </form>
  );
}
