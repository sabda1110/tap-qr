import type { PrintCardDetail, PrintCardOption } from "../../server/print/admin-print.repository.server";

export type AdminPrintStudioContent = {
  kicker: string;
  title: string;
  description: string;
  selectCardLabel: string;
  manualCardLabel: string;
  chooseThemeLabel: string;
  showMonsterLabel: string;
  preHeadlineLabel: string;
  headlineLabel: string;
  footerNoteLabel: string;
  resetDefaults: string;
  printNow: string;
  previewTitle: string;
  dimensionsNote: string;
  tabSingle: string;
  tabBulk: string;
  sizeLabel: string;
  sizePresetA7: string;
  sizePresetA6: string;
  sizePresetA5: string;
  sizePresetCustom: string;
  customWidthLabel: string;
  customHeightLabel: string;
  cropMarksLabel: string;
  bulkFilterAll: string;
  bulkSelectAll: string;
  bulkDeselectAll: string;
  bulkSelectedCount: string;
  bulkPrintPdf: string;
  bulkEmptySelection: string;
  searchCardPlaceholder: string;
  printPdfHint: string;
  confirmDialogTitle: string;
  confirmDialogDescriptionSingle: string;
  confirmDialogDescriptionBulk: string;
  confirmDialogStatusNotice: string;
  confirmDialogPrintOnly: string;
  confirmDialogPrintAndMark: string;
  confirmDialogCancel: string;
  toastPrintSuccess: string;
  toastPrintFailure: string;
  themes: {
    google: { title: string; subtitle: string; defaultPreHeadline: string; defaultHeadline: string; defaultFooter: string };
    coffee: { title: string; subtitle: string; defaultPreHeadline: string; defaultHeadline: string; defaultFooter: string };
    barbershop: { title: string; subtitle: string; defaultPreHeadline: string; defaultHeadline: string; defaultFooter: string };
    modern: { title: string; subtitle: string; defaultPreHeadline: string; defaultHeadline: string; defaultFooter: string };
  };
};

export type AdminPrintStudioProps = {
  cards: PrintCardOption[];
  initialCard: PrintCardDetail | null;
  content: AdminPrintStudioContent;
  locale: string;
};
