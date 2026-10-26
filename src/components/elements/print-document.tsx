import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { BASE_CARD_WIDTH, BASE_CARD_HEIGHT, getPrintPlacement } from "../../lib/print-dimensions";
import type { PrintDimensions } from "./print-size-selector";
import { PrintCropMarks } from "./print-crop-marks";

/** Escape dashboard overflow and transformed preview containers when printing. */
export function PrintDocument({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? createPortal(
    <div id="tapqr-print-document" className="hidden" aria-hidden="true">{children}</div>, document.body,
  ) : null;
}

export function PrintSheet({ dimensions, canvasWidth = BASE_CARD_WIDTH, canvasHeight = BASE_CARD_HEIGHT,
  cropMarks = false, children }: {
  dimensions: PrintDimensions;
  canvasWidth?: number;
  canvasHeight?: number;
  cropMarks?: boolean;
  children: ReactNode;
}) {
  const placement = getPrintPlacement(dimensions.widthMm, dimensions.heightMm, canvasWidth, canvasHeight, cropMarks);
  return (
    <div className="tapqr-print-sheet" style={{ width: `${dimensions.widthMm}mm`, height: `calc(${dimensions.heightMm}mm - 0.02mm)` }}>
      <div className="tapqr-print-trim" style={{ width: `${dimensions.widthMm}mm`, height: `${dimensions.heightMm}mm` }}>
      <div className="tapqr-print-artwork" style={{ width: canvasWidth, height: canvasHeight,
        left: `${placement.leftMm}mm`, top: `${placement.topMm}mm`, transform: `scale(${placement.scale})` }}>
        {cropMarks && <PrintCropMarks />}
        {children}
      </div>
      </div>
    </div>
  );
}
