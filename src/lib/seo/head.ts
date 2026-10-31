import { id } from "../../i18n/locales/id";
import { en } from "../../i18n/locales/en";
import { publicPageMetadata, serializeJsonLd } from "./metadata";
import { outletProfileMetadata } from "./outlet-profile";
import { DEFAULT_SEO_ORIGIN, normalizeSeoOrigin, type SeoPage } from "./pages";
import { pageStructuredData } from "./structured-data";

export function getSeoOrigin() {
  return normalizeSeoOrigin(import.meta.env.VITE_SITE_URL || DEFAULT_SEO_ORIGIN);
}
export function publicPageHead(locale: string, page: SeoPage) {
  const language = locale === "en" ? "en" : "id";
  const pricing = (language === "en" ? en : id).pricing;
  const origin = getSeoOrigin();
  return {
    ...publicPageMetadata(origin, language, page, import.meta.env.VITE_SEO_NOINDEX === "true"),
    scripts: [{ type: "application/ld+json", children: serializeJsonLd(pageStructuredData(origin, language, page,
      page === "home" ? [pricing.pvcCard, pricing.acrylicBoard, { ...pricing.businessBundle, kind: "Service" }] : [])) }],
  };
}

export function outletProfileHead(locale: string, profile?: Parameters<typeof outletProfileMetadata>[2]) {
  return outletProfileMetadata(getSeoOrigin(), locale, profile, import.meta.env.VITE_SEO_NOINDEX === "true");
}
