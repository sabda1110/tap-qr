import {
  PrintDocument,
  PrintGridSheet,
  PrintGridCell,
} from "../elements/print-document";
import { useEffect, useState } from "react";
import { Layers, Printer } from "lucide-react";
import type { PrintThemeKey } from "../elements/nfc-tap-target";
import type { PrintDimensions } from "../elements/print-size-selector";
import type { ReviewCardLabels } from "./classic-review-card";
import { Button } from "../ui/button";
import { getCardUrl } from "../../lib/app-url";
import type { CardMaterial } from "../../lib/firebase/firestore-schema";
import { PVC_CARD_HEIGHT, PVC_CARD_WIDTH } from "./order-pvc-card";
import { createBrandedQrDataUrl } from "../../lib/branded-qr-code";
import {
  getSmartSheetLayout,
  chunkCardsForPrint,
} from "../../lib/smart-print-layout";
import {
  BASE_CARD_WIDTH,
  BASE_CARD_HEIGHT,
  type PrintPaper,
} from "../../lib/print-dimensions";
import { MaterialCardCanvas } from "./material-card-canvas";
import { BulkPrintCardItem } from "./bulk-print-card-item";

type ThemeDefaults = {
  defaultPreHeadline: string;
  defaultHeadline: string;
  defaultFooter: string;
};

type BulkPrintPreviewGridProps = {
  labels: ReviewCardLabels;
  cardIds: string[];
  cardMaterials: Record<string, CardMaterial>;
  theme: PrintThemeKey;
  dimensions: PrintDimensions;
  paper: PrintPaper;
  showMonster: boolean;
  showCropMarks: boolean;
  preHeadline?: string;
  headline?: string;
  footerNote?: string;
  locale: string;
  onPrintBulk: () => void;
  printHint: string;
  cardThemes?: Record<string, PrintThemeKey>;
  onCardThemeChange?: (cardId: string, theme: PrintThemeKey) => void;
  themeLabels?: Record<PrintThemeKey, { title: string }>;
  themeDefaults?: Record<PrintThemeKey, ThemeDefaults>;
  cardThemeLabel?: string;
};

export function BulkPrintPreviewGrid({
  labels,
  cardIds,
  cardMaterials,
  theme,
  dimensions,
  paper,
  showMonster,
  showCropMarks,
  preHeadline,
  headline,
  footerNote,
  locale,
  onPrintBulk,
  printHint,
  cardThemes,
  onCardThemeChange,
  themeLabels,
  themeDefaults,
  cardThemeLabel,
}: BulkPrintPreviewGridProps) {
  const [qrMap, setQrMap] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    async function generateQrs() {
      setIsGenerating(true);
      const results: Record<string, string> = {};
      for (const id of cardIds) {
        if (isCancelled) return;
        try {
          const url = getCardUrl(locale, id);
          const dataUrl = await createBrandedQrDataUrl(url, {
            margin: 1,
            width: 320,
          });
          results[id] = dataUrl;
        } catch (err) {
          console.error("Failed to generate QR for", id, err);
        }
      }
      if (!isCancelled) {
        setQrMap(results);
        setIsGenerating(false);
      }
    }

    if (cardIds.length > 0) {
      void generateQrs();
    } else {
      setQrMap({});
      setIsGenerating(false);
    }

    return () => {
      isCancelled = true;
    };
  }, [cardIds, locale]);

  if (cardIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-black/10 bg-neutral-50/60 p-12 text-center">
        <Layers className="size-10 text-neutral-300 mb-2" />
        <h3 className="text-sm font-bold text-neutral-700">
          Belum Ada Kartu Terpilih
        </h3>
        <p className="mt-1 text-xs text-neutral-400 max-w-sm">
          Pilih satu atau beberapa kartu di panel sebelah kiri untuk melihat
          preview dan mengenerate lembar cetak siap produksi.
        </p>
      </div>
    );
  }

  const layout = getSmartSheetLayout(
    dimensions.widthMm,
    dimensions.heightMm,
    paper,
    showCropMarks,
  );
  const sheets = chunkCardsForPrint(cardIds, layout.capacityPerSheet);

  return (
    <div className="space-y-4">
      {/* Action Bar Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/8 bg-white p-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-neutral-900">
              Preview Batch Cetak ({cardIds.length} Kartu)
            </span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
              {dimensions.widthMm} × {dimensions.heightMm} mm ·{" "}
              {paper.toUpperCase()} ({sheets.length} Lembar ·{" "}
              {layout.capacityPerSheet} per lembar)
            </span>
          </div>
          <p className="mt-0.5 text-xs text-neutral-500">{printHint}</p>
        </div>

        <Button
          type="button"
          onClick={onPrintBulk}
          disabled={isGenerating}
          className="gap-2 bg-[#ffb332] text-black shadow-md hover:bg-[#e69f24] font-bold"
        >
          <Printer className="size-4" />
          <span>
            {isGenerating
              ? "Menyiapkan QR..."
              : `Cetak / Simpan PDF (${cardIds.length})`}
          </span>
        </Button>
      </div>

      {/* Grid of Preview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {cardIds.map((id, index) => {
          const material = cardMaterials[id] ?? "acrylic";
          const currentTheme = cardThemes?.[id] ?? theme;
          const isCustom = currentTheme !== theme;
          const defs = themeDefaults?.[currentTheme];
          const curPre = isCustom && defs ? defs.defaultPreHeadline : preHeadline;
          const curHead = isCustom && defs ? defs.defaultHeadline : headline;
          const curFoot = isCustom && defs ? defs.defaultFooter : footerNote;

          return (
            <BulkPrintCardItem
              key={id}
              id={id}
              index={index}
              material={material}
              theme={currentTheme}
              labels={labels}
              showMonster={showMonster}
              showCropMarks={showCropMarks}
              preHeadline={curPre}
              headline={curHead}
              footerNote={curFoot}
              qrDataUrl={qrMap[id] || ""}
              cardThemeLabel={cardThemeLabel}
              themeLabels={themeLabels}
              onThemeChange={onCardThemeChange}
            />
          );
        })}
      </div>

      <PrintDocument>
        {sheets.map((sheetCardIds, sIdx) => (
          <PrintGridSheet key={sIdx} layout={layout}>
            {sheetCardIds.map((id) => {
              const material = cardMaterials[id] ?? "acrylic";
              const currentTheme = cardThemes?.[id] ?? theme;
              const isCustom = currentTheme !== theme;
              const defs = themeDefaults?.[currentTheme];
              const curPre =
                isCustom && defs ? defs.defaultPreHeadline : preHeadline;
              const curHead =
                isCustom && defs ? defs.defaultHeadline : headline;
              const curFoot =
                isCustom && defs ? defs.defaultFooter : footerNote;
              const isPvc = material === "pvc";
              const cWidth = isPvc ? PVC_CARD_WIDTH : BASE_CARD_WIDTH;
              const cHeight = isPvc ? PVC_CARD_HEIGHT : BASE_CARD_HEIGHT;

              return (
                <PrintGridCell
                  key={id}
                  dimensions={dimensions}
                  canvasWidth={cWidth}
                  canvasHeight={cHeight}
                  cropMarks={showCropMarks}
                >
                  <MaterialCardCanvas
                    cardId={id}
                    material={material}
                    labels={labels}
                    theme={currentTheme}
                    showMonster={showMonster}
                    preHeadline={curPre}
                    headline={curHead}
                    footerNote={curFoot}
                    qrDataUrl={qrMap[id] || ""}
                  />
                </PrintGridCell>
              );
            })}
          </PrintGridSheet>
        ))}
      </PrintDocument>
    </div>
  );
}
