// PVC artwork uses six canvas pixels per millimetre.
export const PVC_WIDTH_MM = 86;
export const PVC_HEIGHT_MM = 54;
export const PVC_CARD_WIDTH = PVC_WIDTH_MM * 6;
export const PVC_CARD_HEIGHT = PVC_HEIGHT_MM * 6;
export const PVC_PRINT_SCALE = (PVC_WIDTH_MM * 96) / (25.4 * PVC_CARD_WIDTH);
