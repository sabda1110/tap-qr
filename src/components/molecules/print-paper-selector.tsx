import type { PrintPaper } from "../../lib/print-dimensions";
import { Button } from "../ui/button";

export type PrintPaperLabels = { title: string; a4: string; artwork: string; help: string };

export function PrintPaperSelector({ value, onChange, labels }: {
  value: PrintPaper;
  onChange: (paper: PrintPaper) => void;
  labels: PrintPaperLabels;
}) {
  return (
    <fieldset className="space-y-3 rounded-2xl border border-black/8 bg-white p-4">
      <legend className="sr-only">{labels.title}</legend>
      <p className="text-sm font-bold">{labels.title}</p>
      <div className="grid grid-cols-2 gap-2">
        {(["a4", "artwork"] as const).map((paper) => (
          <Button key={paper} type="button" variant={value === paper ? "default" : "outline"}
            aria-pressed={value === paper} onClick={() => onChange(paper)}
            className="h-auto min-h-11 whitespace-normal px-3 py-2">
            {labels[paper]}
          </Button>
        ))}
      </div>
      <p className="text-xs leading-5 text-muted-foreground">{labels.help}</p>
    </fieldset>
  );
}
