import { Crop, Ruler } from "lucide-react";
import { Input } from "../ui/input";

export type PrintSizePreset = "a7" | "a6" | "a5" | "custom";

export type PrintDimensions = {
  preset: PrintSizePreset;
  widthMm: number;
  heightMm: number;
};

export const DEFAULT_PRINT_DIMENSIONS: Record<Exclude<PrintSizePreset, "custom">, { widthMm: number; heightMm: number; label: string }> = {
  a7: { widthMm: 74, heightMm: 105, label: "A7 (74 × 105 mm)" },
  a6: { widthMm: 105, heightMm: 148, label: "A6 (105 × 148 mm)" },
  a5: { widthMm: 148, heightMm: 210, label: "A5 (148 × 210 mm)" },
};

type PrintSizeSelectorProps = {
  dimensions: PrintDimensions;
  onChangeDimensions: (next: PrintDimensions) => void;
  showCropMarks: boolean;
  onToggleCropMarks: (val: boolean) => void;
  labels: {
    sizeLabel: string;
    sizePresetA7: string;
    sizePresetA6: string;
    sizePresetA5: string;
    sizePresetCustom: string;
    customWidthLabel: string;
    customHeightLabel: string;
    cropMarksLabel: string;
    cropMarksHelp: string;
    sizeHelp: string;
  };
};

export function PrintSizeSelector({
  dimensions,
  onChangeDimensions,
  showCropMarks,
  onToggleCropMarks,
  labels,
}: PrintSizeSelectorProps) {
  const handleSelectPreset = (preset: PrintSizePreset) => {
    if (preset === "custom") {
      onChangeDimensions({
        preset: "custom",
        widthMm: dimensions.widthMm || 100,
        heightMm: dimensions.heightMm || 145,
      });
    } else {
      const def = DEFAULT_PRINT_DIMENSIONS[preset];
      onChangeDimensions({
        preset,
        widthMm: def.widthMm,
        heightMm: def.heightMm,
      });
    }
  };

  const handleWidthChange = (val: number) => {
    const safeVal = Math.max(30, Math.min(600, val || 30));
    onChangeDimensions({
      ...dimensions,
      preset: "custom",
      widthMm: safeVal,
    });
  };

  const handleHeightChange = (val: number) => {
    const safeVal = Math.max(30, Math.min(600, val || 30));
    onChangeDimensions({
      ...dimensions,
      preset: "custom",
      heightMm: safeVal,
    });
  };

  return (
    <fieldset className="space-y-4 rounded-2xl border border-black/8 bg-white p-4 sm:p-5">
      <legend className="sr-only">{labels.sizeLabel}</legend>
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#e8f8fb] text-[#087e91]">
          <Ruler aria-hidden="true" className="size-4.5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[#172029]">{labels.sizeLabel}</p>
          <p className="mt-0.5 text-xs leading-5 text-[#69737d]">{labels.sizeHelp}</p>
        </div>
        <span className="shrink-0 rounded-lg bg-[#f3f5f7] px-2.5 py-1.5 text-xs font-bold text-[#087e91]">
          {dimensions.widthMm} × {dimensions.heightMm} mm
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {(["a7", "a6", "a5", "custom"] as const).map((p) => {
          const isSelected = dimensions.preset === p;
          const name = {
            a7: "A7",
            a6: "A6",
            a5: "A5",
            custom: labels.sizePresetCustom.split(" ")[0],
          }[p];
          const sub = {
            a7: "74×105",
            a6: "105×148",
            a5: "148×210",
            custom: "mm",
          }[p];

          return (
            <button
              key={p}
              type="button"
              onClick={() => handleSelectPreset(p)}
              aria-pressed={isSelected}
              className={`flex min-h-16 flex-col items-start justify-center rounded-xl border px-3 py-2 text-left outline-none transition-all focus-visible:ring-3 focus-visible:ring-[#087e91]/20 ${
                isSelected
                  ? "border-[#087e91] bg-[#e8f8fb] text-[#087e91] shadow-[0_0_0_1px_#087e91]"
                  : "border-black/8 bg-[#f8fafc] text-[#4f5964] hover:border-[#087e91]/40 hover:bg-white"
              }`}
            >
              <span className="text-sm font-bold">{name}</span>
              <span className="mt-0.5 text-xs font-medium text-[#7a838d]">{sub}</span>
            </button>
          );
        })}
      </div>

      {dimensions.preset === "custom" && (
        <div className="grid grid-cols-2 gap-3 rounded-xl bg-[#f8fafc] p-3">
          <div>
            <label className="text-[11px] font-semibold text-neutral-600">
              {labels.customWidthLabel}
            </label>
            <div className="relative mt-1">
              <Input
                type="number"
                min={30}
                max={600}
                value={dimensions.widthMm}
                onChange={(e) => handleWidthChange(parseInt(e.target.value, 10))}
                className="h-10 bg-white pr-10 text-sm font-bold"
              />
              <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-[#69737d]">mm</span>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-neutral-600">
              {labels.customHeightLabel}
            </label>
            <div className="relative mt-1">
              <Input
                type="number"
                min={30}
                max={600}
                value={dimensions.heightMm}
                onChange={(e) => handleHeightChange(parseInt(e.target.value, 10))}
                className="h-10 bg-white pr-10 text-sm font-bold"
              />
              <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-[#69737d]">mm</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 border-t border-black/6 pt-4">
        <div className="flex min-w-0 items-start gap-3">
          <Crop aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#087e91]" />
          <div>
            <p className="text-xs font-bold text-[#172029]">{labels.cropMarksLabel}</p>
            <p className="mt-0.5 text-[11px] leading-4 text-[#69737d]">{labels.cropMarksHelp}</p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={showCropMarks}
          onClick={() => onToggleCropMarks(!showCropMarks)}
          aria-label={labels.cropMarksLabel}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent outline-none transition-colors focus-visible:ring-3 focus-visible:ring-[#087e91]/20 ${
            showCropMarks ? "bg-[#087e91]" : "bg-gray-300"
          }`}
        >
          <span
            className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm transition duration-200 ${
              showCropMarks ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </fieldset>
  );
}
