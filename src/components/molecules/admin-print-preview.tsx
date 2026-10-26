import { PrintDocument, PrintSheet } from "../elements/print-document";
import { Store } from "lucide-react";
import type { PrintThemeKey } from "../elements/nfc-tap-target";
import type { PrintDimensions } from "../elements/print-size-selector";
import { PrintCardScaledFrame } from "../elements/print-card-scaled-frame";
import { PrintCropMarks } from "../elements/print-crop-marks";
import { PrintCardCanvas } from "./print-card-canvas";
import type { ReviewCardLabels } from "./classic-review-card";
import type { CardMaterial } from "../../lib/firebase/firestore-schema";
import { OrderPvcCard, PVC_CARD_HEIGHT, PVC_CARD_WIDTH } from "./order-pvc-card";

type AdminPrintPreviewProps = {
  labels: ReviewCardLabels;
  cardId: string;
  footerNote: string;
  headline: string;
  preHeadline: string;
  qrDataUrl: string;
  showMonster: boolean;
  theme: PrintThemeKey;
  previewTitle: string;
  dimensions: PrintDimensions;
  material: CardMaterial;
  showCropMarks?: boolean;
};

export function AdminPrintPreview({
  labels,
  cardId,
  footerNote,
  headline,
  preHeadline,
  qrDataUrl,
  showMonster,
  theme,
  previewTitle,
  dimensions,
  material,
  showCropMarks = false,
}: AdminPrintPreviewProps) {
  const dimensionText = `${dimensions.widthMm} × ${dimensions.heightMm} mm${
    dimensions.preset !== "custom" ? ` (${dimensions.preset.toUpperCase()})` : ""
  }`;

  const artwork = material === "pvc" ? (
    <OrderPvcCard
      cardId={cardId}
      copy={{ preHeadline, headline, footer: footerNote, action: labels.review, tap: labels.tap, tapHelp: labels.tapHelp, scan: labels.scan, scanHelp: labels.scanHelp, or: labels.or, qrAlt: labels.qrAlt }}
      qrDataUrl={qrDataUrl}
      showMonster={showMonster}
      value={{ product: "social", theme }}
    />
  ) : (
    <PrintCardCanvas
      labels={labels}
      cardId={cardId}
      footerNote={footerNote}
      headline={headline}
      preHeadline={preHeadline}
      qrDataUrl={qrDataUrl}
      showMonster={showMonster}
      theme={theme}
    />
  );

  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-black/8 bg-gradient-to-b from-[#f8fafc] to-[#eef2f6] p-6 shadow-inner lg:col-span-6 lg:p-8">
      <div className="mb-4 flex w-full flex-wrap items-center justify-between gap-2 text-xs font-bold text-[#69737d]">
        <span className="inline-flex items-center gap-1.5 uppercase">
          <Store className="size-3.5" />
          {previewTitle}
        </span>
        <span className="rounded-full bg-[#087e91]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#087e91]">
          {dimensionText}
        </span>
      </div>

      <PrintDocument>
        <PrintSheet dimensions={dimensions} cropMarks={showCropMarks}
          {...(material === "pvc" ? { canvasWidth: PVC_CARD_WIDTH, canvasHeight: PVC_CARD_HEIGHT } : {})}>
          {artwork}
        </PrintSheet>
      </PrintDocument>
      {/* Material-aware card preview */}
      <div className="relative flex w-full min-w-0 flex-col items-center justify-center p-3">
        {showCropMarks && <PrintCropMarks />}
        <PrintCardScaledFrame {...(material === "pvc" ? { canvasWidth: PVC_CARD_WIDTH, canvasHeight: PVC_CARD_HEIGHT, maxWidth: 516 } : { maxWidth: Math.min(340, 340 * dimensions.widthMm / 148) })}>
          {artwork}
        </PrintCardScaledFrame>

        {/* Acrylic stand base */}
        {material === "acrylic" && <div className="mt-3 h-4 w-3/4 rounded-full bg-gradient-to-r from-black/10 via-black/25 to-black/10 shadow-lg blur-xs" />}
      </div>
    </div>
  );
}
