import type { PrintDimensions } from "./print-size-selector";
import { getPrintPaper, type PrintPaper } from "../../lib/print-dimensions";

export function PrintStudioStyles({ dimensions, paper = "a4" }: { dimensions: PrintDimensions; paper?: PrintPaper }) {
  const sheet = getPrintPaper(dimensions.widthMm, dimensions.heightMm, paper);
  return <style>{`
    @media print {
      @page { size: ${sheet.widthMm}mm ${sheet.heightMm}mm; margin: 0; }
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        height: auto !important;
        min-height: 0 !important;
        overflow: visible !important;
        background: white !important;
      }
      body > :not(#tapqr-print-document) { display: none !important; }
      #tapqr-print-document { display: block !important; }
      .tapqr-print-sheet {
        width: ${sheet.widthMm}mm !important;
        height: calc(${sheet.heightMm}mm - 0.02mm) !important;
        display: block !important;
        position: relative !important;
        overflow: hidden !important;
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
        break-inside: avoid;
        break-after: page;
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
      .tapqr-print-sheet:last-child { break-after: auto; }
      .tapqr-print-trim {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
      .tapqr-print-artwork {
        position: absolute !important;
        transform-origin: top left !important;
      }
      .tapqr-print-artwork > .print-canvas-root {
        width: 100% !important;
        height: 100% !important;
        max-width: none !important;
        max-height: none !important;
        box-sizing: border-box !important;
        margin: 0 !important;
        box-shadow: none !important;
        transition: none !important;
      }
    }
  `}</style>;
}
