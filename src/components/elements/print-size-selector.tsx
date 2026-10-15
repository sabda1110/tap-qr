import { SlidersHorizontal } from "lucide-react";

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
    <div className="space-y-3 rounded-2xl border border-black/8 bg-[#f8fafc] p-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-[#172029]">
          {labels.sizeLabel}
        </label>
        <span className="rounded-full bg-black/5 px-2 py-0.5 text-[11px] font-bold text-[#087e91]">
          {dimensions.widthMm} × {dimensions.heightMm} mm
        </span>
      </div>

      {/* Preset Pill Buttons */}
      <div className="grid grid-cols-4 gap-1.5">
        {(["a7", "a6", "a5", "custom"] as const).map((p) => {
          const isSelected = dimensions.preset === p;
          const name = {
            a7: "A7",
            a6: "A6",
            a5: "A5",
            custom: "Kustom",
          }[p];
          const sub = {
            a7: "74×105",
            a6: "105×148",
            a5: "148×210",
            custom: "Bebas",
          }[p];

          return (
            <button
              key={p}
              type="button"
              onClick={() => handleSelectPreset(p)}
              className={`flex flex-col items-center justify-center rounded-xl border py-2 px-1 text-center transition-all ${
                isSelected
                  ? "border-[#087e91] bg-white text-[#087e91] shadow-xs font-bold ring-2 ring-[#087e91]/20"
                  : "border-black/10 bg-white/70 text-neutral-600 hover:bg-white hover:text-black font-medium"
              }`}
            >
              <span className="text-xs">{name}</span>
              <span className="text-[10px] text-neutral-400 font-normal leading-none mt-0.5">{sub}</span>
            </button>
          );
        })}
      </div>

      {/* Custom Width & Height Inputs */}
      {dimensions.preset === "custom" && (
        <div className="pt-1 grid grid-cols-2 gap-3 border-t border-black/5">
          <div>
            <label className="text-[11px] font-semibold text-neutral-600">
              {labels.customWidthLabel}
            </label>
            <div className="relative mt-1">
              <input
                type="number"
                min={30}
                max={600}
                value={dimensions.widthMm}
                onChange={(e) => handleWidthChange(parseInt(e.target.value, 10))}
                className="w-full rounded-lg border border-black/15 bg-white px-3 py-1.5 text-xs font-bold text-neutral-900 focus:border-[#087e91] focus:outline-hidden"
              />
              <span className="absolute right-2.5 top-2 text-[10px] text-neutral-400">mm</span>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-neutral-600">
              {labels.customHeightLabel}
            </label>
            <div className="relative mt-1">
              <input
                type="number"
                min={30}
                max={600}
                value={dimensions.heightMm}
                onChange={(e) => handleHeightChange(parseInt(e.target.value, 10))}
                className="w-full rounded-lg border border-black/15 bg-white px-3 py-1.5 text-xs font-bold text-neutral-900 focus:border-[#087e91] focus:outline-hidden"
              />
              <span className="absolute right-2.5 top-2 text-[10px] text-neutral-400">mm</span>
            </div>
          </div>
        </div>
      )}

      {/* Crop Marks Toggle (for printing shops) */}
      <div className="flex items-center justify-between pt-1 border-t border-black/5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-3.5 text-[#087e91]" />
          <span className="text-[11px] font-semibold text-neutral-700">
            {labels.cropMarksLabel}
          </span>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={showCropMarks}
          onClick={() => onToggleCropMarks(!showCropMarks)}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
            showCropMarks ? "bg-[#087e91]" : "bg-gray-300"
          }`}
        >
          <span
            className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
              showCropMarks ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
