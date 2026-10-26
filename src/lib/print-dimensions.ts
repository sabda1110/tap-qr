// PVC artwork uses six canvas pixels per millimetre.
export const PVC_WIDTH_MM = 86;
export const PVC_HEIGHT_MM = 54;
export const PVC_CARD_WIDTH = PVC_WIDTH_MM * 6;
export const PVC_CARD_HEIGHT = PVC_HEIGHT_MM * 6;
export const PVC_PRINT_SCALE = (PVC_WIDTH_MM * 96) / (25.4 * PVC_CARD_WIDTH);

export const BASE_CARD_WIDTH = 380;
export const BASE_CARD_HEIGHT = 550;
const CSS_PIXELS_PER_MM = 96 / 25.4;

export type PrintPaper = "a4" | "artwork";

export function getPrintPaper(widthMm: number, heightMm: number, paper: PrintPaper) {
  if (paper === "a4") {
    if (widthMm <= 210 && heightMm <= 297) return { widthMm: 210, heightMm: 297 };
    if (widthMm <= 297 && heightMm <= 210) return { widthMm: 297, heightMm: 210 };
  }
  return { widthMm, heightMm };
}

/** Fit original artwork onto a sheet without reflowing its typography. */
export function getPrintPlacement(widthMm: number, heightMm: number,
  canvasWidth = BASE_CARD_WIDTH, canvasHeight = BASE_CARD_HEIGHT, cropMarks = false) {
  const insetMm = cropMarks ? 4 : 0;
  const scale = Math.min(
    ((widthMm - insetMm * 2) * CSS_PIXELS_PER_MM) / canvasWidth,
    ((heightMm - insetMm * 2) * CSS_PIXELS_PER_MM) / canvasHeight,
    // The crop marks extend 12 artwork pixels beyond each canvas edge.
    cropMarks ? (widthMm * CSS_PIXELS_PER_MM) / (canvasWidth + 24) : Infinity,
    cropMarks ? (heightMm * CSS_PIXELS_PER_MM) / (canvasHeight + 24) : Infinity,
  );
  return {
    scale,
    leftMm: (widthMm - (canvasWidth * scale) / CSS_PIXELS_PER_MM) / 2,
    topMm: (heightMm - (canvasHeight * scale) / CSS_PIXELS_PER_MM) / 2,
  };
}
