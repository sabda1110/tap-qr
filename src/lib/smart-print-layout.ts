import { getPrintPaper, type PrintPaper } from "./print-dimensions";

export type SmartSheetLayout = {
  sheetWidthMm: number;
  sheetHeightMm: number;
  cols: number;
  rows: number;
  capacityPerSheet: number;
  orientation: "portrait" | "landscape";
  gapMm: number;
  paddingMm: number;
};

export function getSmartSheetLayout(
  cardWidthMm: number,
  cardHeightMm: number,
  paper: PrintPaper,
  cropMarks = false,
): SmartSheetLayout {
  if (paper === "artwork") {
    return {
      sheetWidthMm: cardWidthMm,
      sheetHeightMm: cardHeightMm,
      cols: 1,
      rows: 1,
      capacityPerSheet: 1,
      orientation: cardWidthMm > cardHeightMm ? "landscape" : "portrait",
      gapMm: 0,
      paddingMm: 0,
    };
  }

  const sheet = getPrintPaper(cardWidthMm, cardHeightMm, paper);
  const paddingMm = cropMarks ? 6 : 4;
  const gapMm = cropMarks ? 6 : 3;

  const availW = sheet.widthMm - 2 * paddingMm;
  const availH = sheet.heightMm - 2 * paddingMm;
  const cols = Math.max(1, Math.floor((availW + gapMm) / (cardWidthMm + gapMm)));
  const rows = Math.max(1, Math.floor((availH + gapMm) / (cardHeightMm + gapMm)));

  return {
    sheetWidthMm: sheet.widthMm,
    sheetHeightMm: sheet.heightMm,
    cols,
    rows,
    capacityPerSheet: cols * rows,
    orientation: sheet.widthMm > sheet.heightMm ? "landscape" : "portrait",
    gapMm,
    paddingMm,
  };
}

export function chunkCardsForPrint<T>(cards: T[], capacityPerSheet: number): T[][] {
  if (capacityPerSheet <= 0 || cards.length === 0) return [];
  const sheets: T[][] = [];
  for (let i = 0; i < cards.length; i += capacityPerSheet) {
    sheets.push(cards.slice(i, i + capacityPerSheet));
  }
  return sheets;
}
