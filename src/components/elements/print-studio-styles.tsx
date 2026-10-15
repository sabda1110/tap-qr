import type { PrintDimensions } from "./print-size-selector";

type PrintStudioStylesProps = {
  activeTab: "single" | "bulk";
  dimensions: PrintDimensions;
};

export function PrintStudioStyles({ activeTab, dimensions }: PrintStudioStylesProps) {
  const { widthMm, heightMm } = dimensions;
  // Calculate proportional scale to safely fit the 100mm x 145mm card on the selected paper size
  const scaleRatio = Number(
    Math.min((widthMm - 2) / 100, (heightMm - 2) / 145).toFixed(3),
  );

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
          #tapqr-print-card, #tapqr-print-card * {
            visibility: visible;
          }
          #tapqr-print-card {
            position: fixed !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) scale(${scaleRatio}) !important;
            transform-origin: center center !important;
            width: 100mm !important;
            height: 145mm !important;
            max-width: 100mm !important;
            max-height: 145mm !important;
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
        `
        }
      }
    `}</style>
  );
}
