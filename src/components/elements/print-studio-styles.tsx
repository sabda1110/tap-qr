import type { PrintDimensions } from "./print-size-selector";
import type { CardMaterial } from "../../lib/firebase/firestore-schema";
import { PVC_WIDTH_MM, PVC_HEIGHT_MM, PVC_CARD_WIDTH, PVC_CARD_HEIGHT, PVC_PRINT_SCALE } from "../../lib/print-dimensions";

type PrintStudioStylesProps = {
  activeTab: "single" | "bulk";
  dimensions: PrintDimensions;
  material?: CardMaterial;
};

export function PrintStudioStyles({ activeTab, dimensions, material }: PrintStudioStylesProps) {
  const { widthMm, heightMm } = dimensions;
  const canvasWidthMm = material === "pvc" ? PVC_WIDTH_MM : material === "acrylic" ? 74 : 100;
  const canvasHeightMm = material === "pvc" ? PVC_HEIGHT_MM : material === "acrylic" ? 105 : 145;
  const scaleRatio = Number(
    Math.min((widthMm - 2) / canvasWidthMm, (heightMm - 2) / canvasHeightMm).toFixed(3),
  );
  const pvcScaleRatio = Math.min(widthMm / PVC_WIDTH_MM, heightMm / PVC_HEIGHT_MM);
  const canvasWidth = material === "pvc" ? `${PVC_CARD_WIDTH}px` : `${canvasWidthMm}mm`;
  const canvasHeight = material === "pvc" ? `${PVC_CARD_HEIGHT}px` : `${canvasHeightMm}mm`;
  const singleScale = material === "pvc" ? pvcScaleRatio * PVC_PRINT_SCALE : scaleRatio;

  return (
    <style>{`
      @media print {
        body * {
          visibility: hidden;
        }
        @page {
          size: ${widthMm}mm ${heightMm}mm;
          margin: 0;
        }
        ${
          activeTab === "single"
            ? `
          ${material === "pvc" ? `
          .print-card-scaled-frame:has(#tapqr-print-card),
          .print-card-scale-layer:has(#tapqr-print-card) {
            transform: none !important;
            overflow: visible !important;
            position: static !important;
          }
          ` : ""}
          #tapqr-print-card, #tapqr-print-card * {
            visibility: visible;
          }
          #tapqr-print-card {
            position: fixed !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) scale(${singleScale}) !important;
            transform-origin: center center !important;
            width: ${canvasWidth} !important;
            height: ${canvasHeight} !important;
            max-width: ${canvasWidth} !important;
            max-height: ${canvasHeight} !important;
            margin: 0 !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            z-index: 999999 !important;
          }
        `
            : `
          #tapqr-bulk-print-container, #tapqr-bulk-print-container * {
            visibility: visible;
          }
          #tapqr-bulk-print-container {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            z-index: 999999 !important;
          }
          .bulk-print-page {
            position: relative !important;
            width: ${widthMm}mm !important;
            height: ${heightMm}mm !important;
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin: 0 !important;
            padding: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            overflow: hidden !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-sizing: border-box !important;
          }
          .bulk-print-scaler-wrapper {
            width: 100mm !important;
            height: 145mm !important;
            max-width: 100mm !important;
            max-height: 145mm !important;
            transform: scale(${scaleRatio}) !important;
            transform-origin: center center !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .bulk-print-scaler-wrapper .print-canvas-root {
            width: 100mm !important;
            height: 145mm !important;
            max-width: 100mm !important;
            max-height: 145mm !important;
            box-shadow: none !important;
          }
          .bulk-print-scaler-wrapper[data-material="pvc"] {
            width: ${PVC_WIDTH_MM}mm !important;
            height: ${PVC_HEIGHT_MM}mm !important;
            max-width: ${PVC_WIDTH_MM}mm !important;
            max-height: ${PVC_HEIGHT_MM}mm !important;
            transform: scale(${pvcScaleRatio}) !important;
          }
          .bulk-print-scaler-wrapper .pvc-print-canvas {
            width: ${PVC_CARD_WIDTH}px !important;
            height: ${PVC_CARD_HEIGHT}px !important;
            max-width: ${PVC_CARD_WIDTH}px !important;
            max-height: ${PVC_CARD_HEIGHT}px !important;
            transform: scale(${PVC_PRINT_SCALE}) !important;
            transform-origin: center center !important;
          }
        `
        }
      }
    `}</style>
  );
}
