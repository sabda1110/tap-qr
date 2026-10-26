import { CreditCard, Store } from "lucide-react";
import type { CardMaterial } from "../../lib/firebase/firestore-schema";
import { Button } from "../ui/button";

type PrintMaterialSelectorProps = {
  material: CardMaterial;
  onChange: (material: CardMaterial) => void;
  isEmpty: boolean;
  labels: { title: string; acrylic: string; pvc: string; empty: string };
};

export function PrintMaterialSelector({ material, onChange, isEmpty, labels }: PrintMaterialSelectorProps) {
  return (
    <div className="space-y-3 rounded-2xl border border-black/8 bg-white p-4">
      <p className="text-sm font-bold">{labels.title}</p>
      <div role="group" aria-label={labels.title} className="grid grid-cols-2 gap-2">
        {(["acrylic", "pvc"] as const).map((value) => {
          const Icon = value === "acrylic" ? Store : CreditCard;
          return (
            <Button key={value} type="button" variant={material === value ? "default" : "outline"}
              aria-pressed={material === value} onClick={() => onChange(value)}
              className="h-auto min-h-11 whitespace-normal px-3 py-2 text-center">
              <Icon className="size-4 shrink-0" />{labels[value]}
            </Button>
          );
        })}
      </div>
      {isEmpty && <p role="status" className="text-sm leading-relaxed text-muted-foreground">{labels.empty}</p>}
    </div>
  );
}
