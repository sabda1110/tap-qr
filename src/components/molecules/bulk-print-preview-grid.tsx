import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Layers, Printer } from "lucide-react";
import type { PrintThemeKey } from "../elements/nfc-tap-target";
import type { PrintDimensions } from "../elements/print-size-selector";
import { PrintCardScaledFrame } from "../elements/print-card-scaled-frame";
import { PrintCropMarks } from "../elements/print-crop-marks";
import { PrintCardCanvas } from "./print-card-canvas";
import type { ReviewCardLabels } from "./classic-review-card";
import { Button } from "../ui/button";
import { getCardUrl } from "../../lib/app-url";
import type { CardMaterial } from "../../lib/firebase/firestore-schema";
import { OrderPvcCard, PVC_CARD_HEIGHT, PVC_CARD_WIDTH } from "./order-pvc-card";

type BulkPrintPreviewGridProps = {
  labels: ReviewCardLabels;
  cardIds: string[];
  cardMaterials: Record<string, CardMaterial>;
  theme: PrintThemeKey;
  dimensions: PrintDimensions;
  showMonster: boolean;
  showCropMarks: boolean;
  preHeadline?: string;
  headline?: string;
  footerNote?: string;
  locale: string;
  onPrintBulk: () => void;
  printHint: string;
};

type MaterialCardCanvasProps = {
  cardId: string;
  material: CardMaterial;
  labels: ReviewCardLabels;
  theme: PrintThemeKey;
  showMonster: boolean;
  preHeadline?: string;
  headline?: string;
  footerNote?: string;
  qrDataUrl: string;
};

function MaterialCardCanvas({ cardId, material, labels, theme, showMonster, preHeadline, headline, footerNote, qrDataUrl }: MaterialCardCanvasProps) {
  if (material === "pvc") return (
    <OrderPvcCard
      cardId={cardId}
      copy={{ preHeadline, headline: headline ?? "", footer: footerNote ?? "", action: labels.review, tap: labels.tap, tapHelp: labels.tapHelp, scan: labels.scan, scanHelp: labels.scanHelp, or: labels.or, qrAlt: labels.qrAlt }}
      qrDataUrl={qrDataUrl}
      showMonster={showMonster}
      value={{ product: "social", theme }}
    />
  );
  return <PrintCardCanvas labels={labels} cardId={cardId} theme={theme} showMonster={showMonster} preHeadline={preHeadline} headline={headline} footerNote={footerNote} qrDataUrl={qrDataUrl} />;
}

export function BulkPrintPreviewGrid({
  labels,
  cardIds,
  cardMaterials,
  theme,
  dimensions,
  showMonster,
  showCropMarks,
  preHeadline,
  headline,
  footerNote,
  locale,
  onPrintBulk,
  printHint,
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
          const dataUrl = await QRCode.toDataURL(url, {
            margin: 1,
            width: 320,
            color: { dark: "#000000", light: "#ffffff" },
            errorCorrectionLevel: "M",
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
        <h3 className="text-sm font-bold text-neutral-700">Belum Ada Kartu Terpilih</h3>
        <p className="mt-1 text-xs text-neutral-400 max-w-sm">
          Pilih satu atau beberapa kartu di panel sebelah kiri untuk melihat preview dan mengenerate lembar cetak siap produksi.
        </p>
      </div>
    );
  }

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
              {dimensions.widthMm} × {dimensions.heightMm} mm
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
          <span>{isGenerating ? "Menyiapkan QR..." : `Cetak / Simpan PDF (${cardIds.length})`}</span>
        </Button>
      </div>

      {/* Grid of Preview Cards (Max 2 columns to prevent horizontal collisions) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {cardIds.map((id, index) => {
          const qrDataUrl = qrMap[id] || "";
          const material = cardMaterials[id] ?? "acrylic";
          return (
            <div
              key={id}
              className="relative flex flex-col items-center rounded-2xl border border-black/10 bg-neutral-50 p-3 shadow-2xs overflow-hidden"
            >
              {/* Card Index & ID Tag */}
              <div className="mb-2 flex w-full items-center justify-between text-[11px] font-bold text-neutral-500">
                <span className="rounded-md bg-black/5 px-2 py-0.5">#{index + 1}</span>
                <span className="flex min-w-0 items-center gap-2"><span className="rounded-md bg-[#e8f8fb] px-1.5 py-0.5 text-[9px] uppercase text-[#087e91]">{material}</span><span className="max-w-[140px] truncate font-mono text-neutral-700">{id}</span></span>
              </div>

              {/* Card Canvas Preview - Dynamically auto-fitted to column width */}
              <div className="relative w-full flex flex-col items-center justify-center p-2.5">
                {showCropMarks && <PrintCropMarks />}
                <PrintCardScaledFrame {...(material === "pvc" ? { canvasWidth: PVC_CARD_WIDTH, canvasHeight: PVC_CARD_HEIGHT, maxWidth: PVC_CARD_WIDTH } : {})}>
                  <MaterialCardCanvas cardId={id} material={material} labels={labels} theme={theme} showMonster={showMonster} preHeadline={preHeadline} headline={headline} footerNote={footerNote} qrDataUrl={qrDataUrl} />
                </PrintCardScaledFrame>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hidden DOM elements rendered specifically for browser multi-page print */}
      <div id="tapqr-bulk-print-container" className="hidden" aria-hidden="true">
        {cardIds.map((id) => (
          <div
            key={`print-bulk-${id}`}
            className="bulk-print-page"
            style={{
              width: `${dimensions.widthMm}mm`,
              height: `${dimensions.heightMm}mm`,
            }}
          >
            <div className="bulk-print-scaler-wrapper">
              {showCropMarks && <PrintCropMarks />}
              <MaterialCardCanvas cardId={id} material={cardMaterials[id] ?? "acrylic"} labels={labels} theme={theme} showMonster={showMonster} preHeadline={preHeadline} headline={headline} footerNote={footerNote} qrDataUrl={qrMap[id] || ""} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
