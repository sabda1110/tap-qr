import { novemberPromotion, withNovemberPricing } from "../order-promotion";
import { pricingId } from "../../i18n/locales/pricing-id";
import { pricingEn } from "../../i18n/locales/pricing-en";
import { publicPageMetadata, serializeJsonLd } from "./metadata";
import { outletProfileMetadata } from "./outlet-profile";
import { DEFAULT_SEO_ORIGIN, normalizeSeoOrigin, type SeoPage } from "./pages";
import { pageStructuredData } from "./structured-data";

export function getSeoOrigin() {
  return normalizeSeoOrigin(import.meta.env.VITE_SITE_URL || DEFAULT_SEO_ORIGIN);
}
export function publicPageHead(locale: string, page: SeoPage) {
  const language = locale === "en" ? "en" : "id";
  const pricing = withNovemberPricing(language === "en" ? pricingEn : pricingId);
  const offer = (plan: typeof pricing.pvcCard) => plan.originalPrice
    ? { ...plan, validFrom: novemberPromotion.startsAt, validThrough: novemberPromotion.validThrough } : plan;
  const origin = getSeoOrigin();
  return {
    ...publicPageMetadata(origin, language, page, import.meta.env.VITE_SEO_NOINDEX === "true"),
    scripts: [{ type: "application/ld+json", children: serializeJsonLd(pageStructuredData(origin, language, page,
      page === "home" ? [offer(pricing.pvcCard), offer(pricing.acrylicBoard), { ...pricing.businessBundle, kind: "Service" }] : [])) }],
  };
}

export function outletProfileHead(locale: string, profile?: Parameters<typeof outletProfileMetadata>[2]) {
  return outletProfileMetadata(getSeoOrigin(), locale, profile, import.meta.env.VITE_SEO_NOINDEX === "true");
}
