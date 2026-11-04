import type { CardMaterial } from "../../lib/firebase/firestore-schema";
import type { PrintThemeKey } from "../elements/nfc-tap-target";
import type { ReviewCardLabels } from "./classic-review-card";
import { PrintCardScaledFrame } from "../elements/print-card-scaled-frame";
import { PrintCropMarks } from "../elements/print-crop-marks";
import { MaterialCardCanvas } from "./material-card-canvas";
import { getSocialPrintThemes } from "../../lib/print-themes";
import { PVC_CARD_HEIGHT, PVC_CARD_WIDTH } from "./order-pvc-card";

export type BulkPrintCardItemProps = {
  id: string;
  index: number;
  material: CardMaterial;
  theme: PrintThemeKey;
  labels: ReviewCardLabels;
  showMonster: boolean;
  showCropMarks: boolean;
  preHeadline?: string;
  headline?: string;
  footerNote?: string;
  qrDataUrl: string;
  cardThemeLabel?: string;
  themeLabels?: Record<PrintThemeKey, { title: string }>;
  onThemeChange?: (cardId: string, theme: PrintThemeKey) => void;
};

export function BulkPrintCardItem({
  id,
  index,
  material,
  theme,
  labels,
  showMonster,
  showCropMarks,
  preHeadline,
  headline,
  footerNote,
  qrDataUrl,
  cardThemeLabel,
  themeLabels,
  onThemeChange,
}: BulkPrintCardItemProps) {
  const availableThemes = getSocialPrintThemes(material);

  return (
    <div className="relative flex flex-col items-center rounded-2xl border border-black/10 bg-neutral-50 p-3 shadow-2xs overflow-hidden">
      {/* Card Index & ID Tag */}
      <div className="mb-2 flex w-full items-center justify-between text-[11px] font-bold text-neutral-500">
        <span className="rounded-md bg-black/5 px-2 py-0.5">#{index + 1}</span>
        <span className="flex min-w-0 items-center gap-2">
          <span className="rounded-md bg-[#e8f8fb] px-1.5 py-0.5 text-[9px] uppercase text-[#087e91]">
            {material}
          </span>
          <span className="max-w-[140px] truncate font-mono text-neutral-700">
            {id}
          </span>
        </span>
      </div>

      {/* Theme Selector Per Card */}
      <div className="mb-3 flex w-full items-center justify-between gap-2 border-b border-black/5 pb-2">
        <label
          htmlFor={`theme-select-${id}`}
          className="text-xs font-semibold text-neutral-600 shrink-0"
        >
          {cardThemeLabel ?? "Tema:"}
        </label>
        <select
          id={`theme-select-${id}`}
          value={theme}
          onChange={(e) => onThemeChange?.(id, e.target.value as PrintThemeKey)}
          className="h-7 w-full max-w-[200px] truncate rounded-lg border border-black/15 bg-white px-2 text-xs font-semibold text-neutral-800 shadow-2xs focus:border-[#087e91] focus:outline-none"
        >
          {availableThemes.map((key) => (
            <option key={key} value={key}>
              {themeLabels?.[key]?.title ?? key}
            </option>
          ))}
        </select>
      </div>

      {/* Card Canvas Preview */}
      <div className="relative w-full flex flex-col items-center justify-center p-2.5">
        {showCropMarks && <PrintCropMarks />}
        <div className="w-full">
          <PrintCardScaledFrame
            data-print-card-canvas={id}
            {...(material === "pvc"
              ? {
                  canvasWidth: PVC_CARD_WIDTH,
                  canvasHeight: PVC_CARD_HEIGHT,
                  maxWidth: PVC_CARD_WIDTH,
                }
              : {})}
          >
            <MaterialCardCanvas
              cardId={id}
              material={material}
              labels={labels}
              theme={theme}
              showMonster={showMonster}
              preHeadline={preHeadline}
              headline={headline}
              footerNote={footerNote}
              qrDataUrl={qrDataUrl}
            />
          </PrintCardScaledFrame>
        </div>
      </div>
    </div>
  );
}
