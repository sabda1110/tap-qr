// Fixed campaign dates in WIB; pricing returns to normal after November 2026.
export const novemberPromotion = {
  startsAt: "2026-11-01T00:00:00+07:00",
  endsAt: "2026-12-01T00:00:00+07:00",
  validThrough: "2026-11-30T23:59:59+07:00",
  prices: { pvc: "Rp70.000", acrylic: "Rp50.000" },
} as const;

export function isNovemberPromotionActive(at = Date.now()) {
  return at >= Date.parse(novemberPromotion.startsAt) && at < Date.parse(novemberPromotion.endsAt);
}

export function withNovemberPricing<T extends { pvcCard: { price: string }; acrylicBoard: { price: string } }>(pricing: T, at = Date.now()) {
  const active = isNovemberPromotionActive(at);
  return {
    ...pricing,
    pvcCard: { ...pricing.pvcCard, price: active ? novemberPromotion.prices.pvc : pricing.pvcCard.price,
      originalPrice: active ? pricing.pvcCard.price : undefined },
    acrylicBoard: { ...pricing.acrylicBoard, price: active ? novemberPromotion.prices.acrylic : pricing.acrylicBoard.price,
      originalPrice: active ? pricing.acrylicBoard.price : undefined },
  };
}
